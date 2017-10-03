var MathGeneral = (function(){
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

  return {    // Public Functions
    rad_to_deg: rad_to_deg,
    deg_to_rad: deg_to_rad,
    averageAryNums: averageAryNums
  };
})();

var Random = (function(){
  function minMax(min, max, returnIntBool){
      var dif = max - min;
      var thisRan = Math.random();
      thisRan *= dif;
      thisRan += min;
      if (returnIntBool == true){
        thisRan = Math.floor(thisRan);
      }
      return thisRan;
  }
  function range(inVal){
      var thisRan = Math.random();
      thisRan -= .5;
      thisRan *= Math.abs(inVal);
      return thisRan;
  }
  function rangeAry(inAry){
      var outAry = [];
      for(var i=0; i<inAry.length; i++){
          outAry[i] = range(inAry[i]);
      }
      return outAry;
  }
  function aryLngth(aryLngth){
      var outAry = [];
      for(var i = 0; i < aryLngth; i++){
          outAry [i] = Math.random();
      }
      return outAry;
  }
  return {    // Public Functions
    minMax: minMax,
    range:  range,
    rangeAry: rangeAry,
    aryLngth: aryLngth
  };
})();
