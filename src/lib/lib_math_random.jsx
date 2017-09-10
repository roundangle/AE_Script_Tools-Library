function randMinMax(min, max, returnIntBool){
    var dif = max - min;
    var thisRan = Math.random();
    thisRan *= dif;
    thisRan += min;
    if (returnIntBool == true){
      thisRan = Math.floor(thisRan);
    }
    return thisRan;
}
// $.writeln(randRange(5));
function randRange(inVal){
    var thisRan = Math.random();
    thisRan -= .5;
    thisRan *= Math.abs(inVal);
    return thisRan;
}
// $.writeln(randRangeAry([1, -1]));
function randRangeAry(inAry){
    var outAry = [];
    for(var i=0; i<inAry.length; i++){
        outAry[i] = randUpDn(inAry[i]);
    }
    return outAry;
}
// $.writeln(ranAry(23).toString());
function randAry(aryLngth){
    var outAry = [];
    for(var i = 0; i < aryLngth; i++){
        outAry [i] = Math.random();
    }
    return outAry;
}
