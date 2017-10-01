//  Required Libraries
//
//    lib_modPropKeys_baseFunctions.jsx
//    lib_modPropKeys_keyframeActions.jsx
//    lib_modPropKeys_commonFunctions.jsx
//

// Used In
    //  End Tools Only


function prprtyValMath(inPropsAry, oprtr, inMathVal, slctKeysOnly){
    //  oprtr       //    + - * / %
    //  inMathVal   //    Can be Number of Array

    var thisTitle = "Property Value Math";

    if ((inMathVal instanceof Array) || (isNaN(inMathVal) == false)){}else{
        $.writeln("inMathVal not valid\t\t" + inMathVal.toString());
        return;
    }

    app.beginUndoGroup(thisTitle);
        var propObjAry = multiPropRead(inPropsAry, slctKeysOnly, keyedPropsOnly= true);
        deleteObjKeys(propObjAry);

        if (-1 == aryIndexOf(["+", "-", "*", "/", "%"], oprtr)){$.writeln("Property Math 'oprtr' does not match a valid input\t\t'+', '-', '*', '/', '%'"); return;}

        for(var i = 0; i < propObjAry.length; i++){
            var thisKeyObjAry = propObjAry[i].keyObjAry;
            var valSmpl = thisKeyObjAry[0].value;
            var skipProp, valLength, applyValAry=[];
            if(valSmpl instanceof Array){
                skipProp = false;
                valLength = valSmpl.length;
                if(inMathVal instanceof Array){
                    if (valLength == inMathVal.length){
                        applyValAry = inMathVal;
                    }else if(valLength > inMathVal.length){
                        for(var k = 0; k < inMathVal.length; k++){
                            applyValAry[k] = inMathVal[k];
                        }
                        for(var k = (inMathVal.length-1); k < valLength; k++){
                            applyValAry[k] = inMathVal[inMathVal.length-1];
                        }
                    }else{  //  valLength < inMathVal.length
                        for(var k = 0; k < valLength; k++){
                            applyValAry[k] = inMathVal[k];
                        }
                    }
                }else{
                    for(var k = 0; k < valLength; k++){
                        applyValAry[k] = inMathVal;
                    }
                }
            }else if (isNaN(varC) == false){
                skipProp = false;
                alLength = 1;
                if(inMathVal instanceof Array){
                    applyValAry[0] = inMathVal[0];
                }else{
                    applyValAry[0] = inMathVal;
                }
            }else{
                $.writeln("This value is not an array or a number, therefore not applicable");
                skipProp = true;
            }

            if (skipProp == false){
                for(var j = 0; j < thisKeyObjAry.length; j++){
                      var thisKeyObj = thisKeyObjAry[j];
                      var thisVal = thisKeyObj.value;

                      switch(oprtr) {
                          case "+":
                              if(valLength == 1){
                                  var newValNum = thisVal + applyValAry[0];
                                  thisKeyObj.value = newValNum;
                              }else{
                                  var newValAry=[];
                                  for(var k = 0; k < valLength; k++){
                                      newValAry[k] = thisVal[k] + applyValAry[k];
                                  }
                                  thisKeyObj.value = newValAry;
                              }
                              break;
                          case "-":
                              if(valLength == 1){
                                  var newValNum = thisVal - applyValAry[0];
                                  thisKeyObj.value = newValNum;
                              }else{
                                  var newValAry=[];
                                  for(var k = 0; k < valLength; k++){
                                      newValAry[k] = thisVal[k] - applyValAry[k];
                                  }
                                  thisKeyObj.value = newValAry;
                              }
                              break;
                          case "*":
                              if(valLength == 1){
                                  var newValNum = thisVal * applyValAry[0];
                                  thisKeyObj.value = newValNum;
                              }else{
                                  var newValAry=[];
                                  for(var k = 0; k < valLength; k++){
                                      newValAry[k] = thisVal[k] * applyValAry[k];
                                  }
                                  thisKeyObj.value = newValAry;
                              }
                              break;
                          case "/":
                              if(valLength == 1){
                                  var newValNum = thisVal / applyValAry[0];
                                  thisKeyObj.value = newValNum;
                              }else{
                                  var newValAry=[];
                                  for(var k = 0; k < valLength; k++){
                                      if (applyValAry[k] != 0){
                                          newValAry[k] = thisVal[k] / applyValAry[k];
                                      }else{
                                          newValAry[k] = 0; //  Avoid divide by zero
                                      }
                                  }
                                  thisKeyObj.value = newValAry;
                              }
                              break;
                          case "%":
                              if(valLength == 1){
                                  var newValNum = thisVal % applyValAry[0];
                                  thisKeyObj.value = newValNum;
                              }else{
                                  var newValAry=[];
                                  for(var k = 0; k < valLength; k++){
                                      newValAry[k] = thisVal[k] % applyValAry[k];
                                  }
                                  thisKeyObj.value = newValAry;
                              }
                              break;
                          default:
                      }
                }
            }
        }

        multiPropWriteRobust(propObjAry);
    app.endUndoGroup();
}

function prprtyValRndm(inPropsAry, inRanVal, slctKeysOnly){
    //  inRanVal   //    Can be Number of Array

    var thisTitle = "Property Value Random";

    if ((inRanVal instanceof Array) || (isNaN(inRanVal) == false)){}else{
        $.writeln("inRanVal not valid\t\t" + inRanVal.toString());
        return;
    }

    app.beginUndoGroup(thisTitle);
        var propObjAry = multiPropRead(inPropsAry, slctKeysOnly, keyedPropsOnly= true);
        deleteObjKeys(propObjAry);

        for(var i = 0; i < propObjAry.length; i++){
            var thisKeyObjAry = propObjAry[i].keyObjAry;
            var valSmpl = thisKeyObjAry[0].value;
            var skipProp, valLength, applyValAry=[];
            if(valSmpl instanceof Array){
                skipProp = false;
                valLength = valSmpl.length;
                if(inRanVal instanceof Array){
                    if (valLength == inRanVal.length){
                        applyValAry = inRanVal;
                    }else if(valLength > inRanVal.length){
                        for(var k = 0; k < inRanVal.length; k++){
                            applyValAry[k] = inRanVal[k];
                        }
                        for(var k = (inRanVal.length-1); k < valLength; k++){
                            applyValAry[k] = inRanVal[inRanVal.length-1];
                        }
                    }else{  //  valLength < inRanVal.length
                        for(var k = 0; k < valLength; k++){
                            applyValAry[k] = inRanVal[k];
                        }
                    }
                }else{
                    for(var k = 0; k < valLength; k++){
                        applyValAry[k] = inRanVal;
                    }
                }

            }else if (isNaN(varC) == false){
                skipProp = false;
                alLength = 1;
                if(inRanVal instanceof Array){
                    applyValAry[0] = inRanVal[0];
                }else{
                    applyValAry[0] = inRanVal;
                }

            }else{
                $.writeln("This value is not an array or a number, therefore not applicable");
                skipProp = true;
            }

            if (skipProp == false){
                for(var j = 0; j < thisKeyObjAry.length; j++){
                    var thisKeyObj = thisKeyObjAry[j];
                    var thisVal = thisKeyObj.value;

                    var ranValAry = randUpDnAry(applyValAry);
                    if(valLength == 1){
                        var newValNum = thisVal + ranValAry[0];
                        thisKeyObj.value = newValNum;
                    }else{
                        var newValAry=[];
                        for(var k = 0; k < valLength; k++){
                            newValAry[k] = thisVal[k] + ranValAry[k];
                        }
                        thisKeyObj.value = newValAry;
                    }
                }
            }
        }

        multiPropWriteRobust(propObjAry);
    app.endUndoGroup();
}
