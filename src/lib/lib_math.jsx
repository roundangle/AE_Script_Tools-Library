// $.writeln(rad_to_deg(Math.PI));
function rad_to_deg (inRadians) {  return inRadians * 180 / Math.PI; }

// $.writeln(deg_to_rad(180));
function deg_to_rad (inDegrees) {  return inDegrees * Math.PI / 180; }

// averageAryNums([1, 2, 3, 4, 5, 6, 7]);
function averageAryNums(inAry){
  var outVal=0;
      for(var i=0; i<inAry.length; i++){
          outVal += inAry[i];
      }
  return outVal/inAry.length;
}
