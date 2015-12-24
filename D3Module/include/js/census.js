/*Import nessary API*/
var fs = require("fs");

/*Initialize values*/
var ageWise = {};
var stateWise = {};
var eduCategory = {};
var fileName = new Array("../../Feed/India2011.csv","../../Feed/IndiaST2011.csv","../../Feed/IndiaSC2011.csv");
var title = [];

/*Formmating data in object for D3 js*/
 function values (obj) {
    var vals = [];
    for( var key in obj ) {
        if ( obj.hasOwnProperty(key) ) {
            vals.push(obj[key]);
        }
    }
    return vals;
}

/*Function to process CSV and populate Array*/
function csvProcessor(fileN){
  /*Check if file exists*/

      fs.readFileSync(fileN).toString().split('\n').forEach(function (line,index) {
          var temp = line.split(",");
          if (index === 0){
              title = temp;
          }
          if(line !== '' && index !== 0){
          /*Criteria to opulating Agewise data*/
          if (temp[4]=="Total" && temp[5] !== "All ages" && temp[5] !== "0-6"){
            var literatePop = parseInt(temp[12]);
            if (temp[5] in ageWise)
            {
              ageGroup = temp[5];
              ageWise[ageGroup].total += literatePop;
            }
            else{
              ageGroup = temp[5];
              ageWise[ageGroup] = {
                group : ageGroup,
                total : literatePop
              };
            }
          }

          /*Criteria to opulating Statewise data*/
          if(temp[4] =="Total" && temp[5]=="All ages"){
            var stateTotPop = parseInt(temp[39]);
            var stateMalePop = parseInt(temp[40]);
            var stateFemalePop = parseInt(temp[41]);
            if (temp[3] in stateWise){
              stateGroup = temp[3];
              stateWise[stateGroup].male += stateMalePop;
              stateWise[stateGroup].female += stateFemalePop;
            }
            else{
              stateGroup = temp[3].trim().match(/^State\s+-\s+(.*)$/i);
              stateGroup = stateGroup[1];
              stateWise[stateGroup] = {
                state : stateGroup,
                male : stateMalePop,
                female : stateFemalePop
            };
            }
          }

          /*Criteria to opulating Education category wise data*/
            for(var eduStart = 15; eduStart <=43 ; eduStart+=3){
              var edu = title[eduStart].trim().match(/^Educational level\s+-\s+(.*[^\\*])\s+-\s+\w*$/i);
                eduTitle = edu[1];
                if(eduTitle in eduCategory)
                {
                  eduCategory[eduTitle].total += parseInt(temp[eduStart]);
                }
                else {
                  eduCategory[eduTitle] = {
                  eduLevel : eduTitle,
                  total : parseInt(temp[eduStart])
                  };
                }
            }
        }
      });
  }



/*Loop to call csv processor for each file*/
for(var i=0;i<3;i++){
  /*getting file name*/
  var fName = fileName[i];
  /*Passing file name to csvProcessor*/
  csvProcessor(fName);
  }


fs.writeFile('../../Feed/age.json', JSON.stringify(values(ageWise)));
fs.writeFile('../../Feed/state.json', JSON.stringify(values(stateWise)));
fs.writeFile('../../Feed/education.json', JSON.stringify(values(eduCategory)));
