// $.writeln(aryIndexOf(["checkA", "checkB", "checkC", "checkD"], "checkC"));

var Ary = (function(){
  function aryIndexOf(inAry, chckItem){
    for(var i=0; i<inAry.length; i++){
      if (inAry[i] == chckItem){
        return i;
      }
    }
    return -1;
  }
  function forceAry(inVal){ // if inVal is not an array, place ina single item array
    if (inVal instanceof Array){  // test if Array
      return inVal;
    }else{
      return [inVal];
    }
  }
  function lngstAry(in2dAry){ // Enter array of arrays, Normalize lengths of all to match longest
    var lngstLngth = 0;
    for(var i = 0; i < in2dAry.length; i++){
      var thislngth = in2dAry[i].length;
      if (thislngth > lngstLngth) lngstLngth = thislngth;
    }
    return lngstLngth;
  }
  function forceAryLength(inAry, trgtLngth, clip){  //
    var inLngth = inAry.length;
    if (inLngth == trgtLngth) return inAry;
    if(inLngth < trgtLngth){
      var outAry = inAry;
      for(var i = inLngth-1; i < trgtLngth; i++){
        outAry[i] = inAry[inLngth-1];
      }
      return outAry;
    }else{
      if (clip == true){
        return inAry.slice(0,trgtLngth);
      }else{
        return inAry;
      }
    }
  }
  return {    // Public Functions
    aryIndexOf: indexOf,
    forceAry: force,
    lngstAry: longest,
    forceAryLength: forceLength
  };
})();
