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
  function nanSubZero(inVal){   // if inVal is NaN substitute zero
      if(isNaN(inVal) == true){return 0;}
      return inVal;
  }


  return {    // Public Functions
    rad_to_deg: rad_to_deg,
    deg_to_rad: deg_to_rad,
    averageAryNums: averageAryNums,
    nanSubZero: nanSubZero
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

var Calculate = (function(){  //  Complex will evaluate formulas in string form
  function mathSimple(inValA, oprtr, inValB){
    var valA = Number(inValA), valB = Number(inValB);
    if((isNaN(valA) == true)||(isNaN(valB) == true)){$.writeln("mathSimple--inVal(s) NaN\t" + inValA +"\t"+ inValB); return false;}
    if((oprtr == "/")&&(valB == 0)){$.writeln("mathSimple--Divide By Zero"); return false;}

    switch(oprtr) {
        case "+":
            return valA + valB;
            break;
        case "-":
            return valA - valB;
            break;
        case "*":
            return valA * valB;
            break;
        case "/":
            return valA / valB;
            break;
        case "%":
            return valA % valB;
            break;
        case "^":
            return Math.pow(valA, valB);
            break;
        default:
        $.writeln("mathSimple--oprtr invalid\t" + oprtr); return false;
    }
  }
  function mathComplex(inString){
      var noSpcString = inString.replace(/\s/g, "");

      // var nmbrStr = "1234567890.";
      // var oprtrStr = "+-*/%^";
      // var parenthStr = "()";

      // Test for propblem input
      var testString = noSpcString.replace(/[\d.+\-\\*\/%^()]/g, "");
      if (testString.length > 0){$.writeln("mathComplex--Illegal Characters\t" + testString); return false;}    // consider stripping illegals out and proceeding

      var opnParTly = noSpcString.match(/\(/g), clsParTly = noSpcString.match(/\)/g), opnParTlyLen, clsParTlyLen;
      if (opnParTly instanceof Array){opnParTlyLen = opnParTly.length;}else{opnParTlyLen = 0;}
      if (clsParTly instanceof Array){clsParTlyLen = clsParTly.length;}else{clsParTlyLen = 0;}
      if(opnParTlyLen != clsParTlyLen){$.writeln("mathComplex--Inequal Opening & Closing Parenthesis"); return false;}

      // Translate Parenthesis into Arrays & sub-arrays
      var mathAry = [];
      if ((-1 == noSpcString.indexOf("(")) && (-1 == noSpcString.indexOf(")"))){
            mathAry = [noSpcString];
      }else{
            var opnTly = 0, clsTly = 0;
            mathAry = rcrsvPrnthsDiv(noSpcString);
            function rcrsvPrnthsDiv(aString){
                  var outAry = [];
                  var rmnString = aString;
                  while(true){
                        if(rmnString.length == 0){ return outAry; }
                        var nxtOpn = rmnString.search(/\(/);
                        var nxtCls = rmnString.search(/\)/);
                        var thisDivInd, thisDivChar;
                        if ((nxtOpn < nxtCls)&&(nxtOpn != -1)){ thisDivInd = nxtOpn; thisDivChar = "("; }else{
                              thisDivInd = nxtCls; thisDivChar = ")";
                        }
                        var thisSplitAry = splitString(rmnString, thisDivInd, false);
                        // return thisSplitAry;
                        if (thisDivChar == "("){
                            opnTly++;
                            outAry[outAry.length] = thisSplitAry[0];
                            var thisRtrn = rcrsvPrnthsDiv(thisSplitAry[1]);
                            if (thisRtrn == false){ return false;}
                            if (thisRtrn[0].length > 0){
                                outAry[outAry.length] = [thisRtrn[0]];
                            }
                            rmnString = thisRtrn[1];
                            if(rmnString.length > 0){
                                if(-1 == thisRtrn[1].indexOf(")")){
                                      outAry[outAry.length] = thisRtrn[1];  // no more parenthesis in string
                                      return outAry;
                                }
                            }
                        }else{    //  thisDivChar == ")"
                            clsTly++;
                            if (clsTly > opnTly){$.writeln("mismatched parenthesis--)("); return false;}

                            outAry[outAry.length] = thisSplitAry[0];
                            return [outAry, thisSplitAry[1]];
                        }
                  }
            }
      }
      if(mathAry == false){return inString;}
      // $.writeln("------\n" + mathAry.join("\n"));

      //Order of Operations
      var rslt = aryOrderOpertns(mathAry);
      if (rslt == false){
          return inString;
      }else{
          return rslt;
      }
  }
  function aryOrderOpertns(inVal){  //order of Operatios
      var thisStringOrdrOp="";
      if (inVal instanceof Array){
          for(var i=0; i<inVal.length; i++){
              var thisItem = inVal[i];
              if (thisItem instanceof Array){
                  thisStringOrdrOp += aryOrderOpertns(thisItem);         // sub-arrays in recursive function
              }else{
                  thisStringOrdrOp += thisItem;
              }
          }
      }else{
          thisStringOrdrOp = inVal;
      }
      return stringOrderOpertns(thisStringOrdrOp);
  }
  function stringOrderOpertns(inStringOrdrOp){
        var procString = inStringOrdrOp;
        while(true){                                                          // Process Math in Order of Operations
            // $.writeln("proc\t\t"+ procString);
            if(isNaN(procString) == false){return procString;}
            var thisInd;
            if (/[\^]/.test(procString) == true){                             // ^
                thisInd = procString.search(/\^/);
            }else if (/[\\*\/%]/.test(procString) == true){                    // * / %
                thisInd = procString.search(/[\\*\/%]/);
            }else if (/[+\-]/.test(procString) == true){                      // + -
                thisInd = negNumTest(procString);
            }
            var thisOprtr = procString.charAt(thisInd);                             // ID char at that index
            var thisDivAry = splitString(procString, thisInd, false);               // Divide at index
            var stringA = thisDivAry[0], stringB = thisDivAry[1];    // set to String Vars   // reverse A
            var frstOprADiv=[], frstOprBDiv=[];
            if(/[^\d\.]/.test(stringA) == true){
                  stringA = reverseString(stringA);
                  var frstOprA = stringA.search(/[^\d\.]/);                         // search for first (non-number)
                  if((stringA.charAt(frstOprA) == '-') && ((stringA.charAt(1 + frstOprA).length == 0) || (/[^\d\.]/.test(stringA.charAt(1 + frstOprA)) == true))){     // Reverse Test for Neg Number
                      frstOprA++;
                  }
                  frstOprADiv = splitString(stringA, frstOprA, true);               // divide again
                  frstOprADiv[0] = reverseString(frstOprADiv[0]);                   // un-reverse
                  frstOprADiv[1] = reverseString(frstOprADiv[1]);
            }else{
                  frstOprADiv[0] = stringA;
                  frstOprADiv[1] = "";
            }
            if(/[^\d\.]/.test(stringB) == true){
                var frstOprB = negNumTest(stringB);
                frstOprBDiv = splitString(stringB, frstOprB, true);
            }else{                                                                  // final num in statement
                frstOprBDiv[0] = stringB;
                frstOprBDiv[1] = "";
            }
            var mathRslt = mathSimple(frstOprADiv[0], thisOprtr, frstOprBDiv[0]);    // perform simple math
            if (mathRslt == false){ $.writeln("Error calculating\t" + frstOprADiv[0]+"\t"+thisOprtr+"\t"+frstOprBDiv[0]); return false;}
            procString = "" + frstOprADiv[1] + mathRslt + frstOprBDiv[1];         // rejoin procString
        }
        //return procString;
  }
  function negNumTest(ngTstString){
      if(ngTstString.charAt(0) == "-"){                                         // test for negative number
          var sliceString = ngTstString.slice(1, ngTstString.length);
          var testInd = sliceString.search(/[^\d\.]/);
          if (testInd != -1){
              return 1 + testInd;           // another oprtr exists
          }else{
              return ngTstString.length;    // end of statement & negative number
          }
      }else{
          return ngTstString.search(/[^\d\.]/);
      }
  }

  return {    // Public Functions
    simple: mathSimple,
    complex:  mathComplex
  };
})();

var Format = (function(){
  function pad(inVal, places){
        var outVal;
        for(var i=0; i<places; i++){
              outVal += "0";
        }
        outVal += ""+inVal;
        ovl = outVal.length;
        outVal = outVal.substr(ovl-places, ovl);

        return outVal;
  }
  function padWDec(inNum, padDigits){
    var padString = "";
    for (var i = 0; i < padDigits; i++){
      padString = padString + "0";
    }
    var decimal = "" + (inNum %1);
    var outNum = (padString+Math.floor(inNum)).slice(-padDigits);
    outNum = outNum + decimal.slice(1);

    return outNum;
  }

  return {    // Public Functions
    pad:  pad,
    padWDec:  padWDec
  };
})();
