//  Required Libraries
//
//    lib_gui_simpleDialog.jsx
//    modPropKeys/lib_modPropKeys_baseFunctions.jsx
//    modPropKeys/lib_modPropKeys_commonFunctions.jsx
//    modPropKeys/lib_modPropKeys_keyframeActions.jsx
//    modPropKeys/lib_modPropKeys_propertyInfo.jsx


// Used In
    //  End Tools Only

function fpsSafetyKeyTime(inPropsAry, rndMthd, slctKeysOnly){
    var thisTitle = "FPS Safety Key Time";

    app.beginUndoGroup(thisTitle);
        var propObjAry = multiPropRead(inPropsAry, slctKeysOnly, keyedPropsOnly= true);
        var ovrlpExist = false;
        var allTimes=[],  allButSkipTimes=[];
        for(var i = 0; i < propObjAry.length; i++){                                         // Gather Times
            var thisKeyObjAry = propObjAry[i].keyObjAry;
            var thisFPS = readLyrFromProp(propObjAry[i].property).containingComp.frameRate;
            allTimes[i]=[], allButSkipTimes[i]=[];
            var prevTimes=[];
            for(var j = 0; j < thisKeyObjAry.length; j++){
                  var thisKeyObj = thisKeyObjAry[j];
                  var thisTime = Number(thisKeyObj.time);
                  var newTime = keyFltr_timeDiv(thisFPS, 0, rndMthd, thisTime);

                  if (aryIndexOf(prevTimes, newTime) == -1){
                      allButSkipTimes[i][j] = newTime;
                      allTimes[i][j] = newTime;
                      prevTimes[prevTimes.length] = newTime;
                  }else{
                      allButSkipTimes[i][j] = false;
                      allTimes[i][j] = thisTime;
                      ovrlpExist = true;
                  }
            }
        }

        var applyTimes;
        if(ovrlpExist == true){
            var dlgNum = simpleDialog({title: thisTitle, msg: "Rounding time values has created overlapping keyframe(s).", btnsNameAry: ["Cancel", "Skip", "Remove"], dfltBtn: 3, scndBtn: 1}).num;
            if(dlgNum == 3){                    // Remove
                applyTimes = allButSkipTimes;
            }else if(dlgNum == 2){              // Skip
                applyTimes = allTimes;
            }else{                              // Cancel
                return false;
            }
        }else{
            applyTimes = allTimes;
        }

        deleteObjKeys(propObjAry);

        if(ovrlpExist == true){                               // Apply Times
            var applyObjAry=[];
            for(var i = 0; i < propObjAry.length; i++){
                var thisKeyObjAry = propObjAry[i].keyObjAry;
                var thisApplyKeyObjAry=[];
                for(var j = 0; j < thisKeyObjAry.length; j++){
                    var thisKeyObj = thisKeyObjAry[j];
                    var thisTime = applyTimes[i][j];
                    if (thisTime != false){
                        thisKeyObj.time = thisTime;
                        thisApplyKeyObjAry[thisApplyKeyObjAry.length] = thisKeyObj;
                    }
                }
                applyObjAry[i] = {
                    property: propObjAry[i].property,
                    exprsn: propObjAry[i].exprsn,
                    keyObjAry: thisApplyKeyObjAry,
                    slctKeysAry: propObjAry[i].slctKeysAry
                }
            }
            multiPropWriteRobust(applyObjAry);
        }else{
            for(var i = 0; i < propObjAry.length; i++){
                var thisKeyObjAry = propObjAry[i].keyObjAry;
                var thisApplyKeyObjAry=[];
                for(var j = 0; j < thisKeyObjAry.length; j++){
                    var thisKeyObj = thisKeyObjAry[j];
                    var thisTime = applyTimes[i][j];
                    if (thisTime != false){
                        thisKeyObj.time = thisTime;
                    }
                }
            }
            multiPropWriteRobust(propObjAry);
        }
    app.endUndoGroup();
}
function bpmKeyTimeMagnet(inPropsAry, bpm, strtFrm, divisions, rndMthd, keepWholeFrm, slctKeysOnly){
    if (divisions < 1){divisions = 1;}
    divisions = Math.round(divisions);
    var timeDiv = 60.0/bpm;
    timeDiv /= divisions;
    timeDiv = 1.0/timeDiv;

    var thisTitle = "BPM Key Time";
    app.beginUndoGroup(thisTitle);
        var propObjAry = multiPropRead(inPropsAry, slctKeysOnly, keyedPropsOnly= true);
        var ovrlpExist = false;
        var allTimes=[],  allButSkipTimes=[];
        for(var i = 0; i < propObjAry.length; i++){                                         // Gather Times
            var thisKeyObjAry = propObjAry[i].keyObjAry;
            var thisFPS = readLyrFromProp(propObjAry[i].property).containingComp.frameRate;
            var offsetTime =  strtFrm / thisFPS;
            allTimes[i]=[], allButSkipTimes[i]=[];
            var prevTimes=[];
            for(var j = 0; j < thisKeyObjAry.length; j++){
                  var thisKeyObj = thisKeyObjAry[j];
                  var thisTime = Number(thisKeyObj.time);

                  var newTime = keyFltr_timeDiv(timeDiv, offsetTime, rndMthd, thisTime);
                  if (keepWholeFrm == true){
                      newTime = keyFltr_timeDiv(thisFPS, 0, "floor", newTime);
                  }

                  if (aryIndexOf(prevTimes, newTime) == -1){
                      allButSkipTimes[i][j] = newTime;
                      allTimes[i][j] = newTime;
                      prevTimes[prevTimes.length] = newTime;
                  }else{
                      allButSkipTimes[i][j] = false;
                      allTimes[i][j] = thisTime;
                      ovrlpExist = true;
                  }
            }
        }

        var applyTimes;
        if(ovrlpExist == true){
            var dlgNum = simpleDialog({title: thisTitle, msg: "Rounding time values has created overlapping keyframe(s).", btnsNameAry: ["Cancel", "Skip", "Remove"], dfltBtn: 3, scndBtn: 1}).num;
            if(dlgNum == 3){                    // Remove
                applyTimes = allButSkipTimes;
            }else if(dlgNum == 2){              // Skip
                applyTimes = allTimes;
            }else{                              // Cancel
                return false;
            }
        }else{
            applyTimes = allTimes;
        }

        deleteObjKeys(propObjAry);

        if(ovrlpExist == true){                               // Apply Times
            var applyObjAry=[];
            for(var i = 0; i < propObjAry.length; i++){
                var thisKeyObjAry = propObjAry[i].keyObjAry;
                var thisApplyKeyObjAry=[];
                for(var j = 0; j < thisKeyObjAry.length; j++){
                    var thisKeyObj = thisKeyObjAry[j];
                    var thisTime = applyTimes[i][j];
                    if (thisTime != false){
                        thisKeyObj.time = thisTime;
                        thisApplyKeyObjAry[thisApplyKeyObjAry.length] = thisKeyObj;
                    }
                }
                applyObjAry[i] = {
                    property: propObjAry[i].property,
                    exprsn: propObjAry[i].exprsn,
                    keyObjAry: thisApplyKeyObjAry,
                    slctKeysAry: propObjAry[i].slctKeysAry
                }
            }
            multiPropWriteSimple(applyObjAry);
        }else{
            for(var i = 0; i < propObjAry.length; i++){
                var thisKeyObjAry = propObjAry[i].keyObjAry;
                var thisApplyKeyObjAry=[];
                for(var j = 0; j < thisKeyObjAry.length; j++){
                    var thisKeyObj = thisKeyObjAry[j];
                    var thisTime = applyTimes[i][j];
                    if (thisTime != false){
                        thisKeyObj.time = thisTime;
                    }
                }
            }
            multiPropWriteSimple(propObjAry);
        }
    app.endUndoGroup();
}
function bpmKeyLoop(inPropsAry, bpm, inStrtTime, rndMthd){
      var thisTitle = "BPM Key Loop";
      app.beginUndoGroup(thisTitle);

      var frmDur = readLyrFromProp(inPropsAry[0]).containingComp.frameDuration;

      var loopStart;
      var loopLength = 60.0/bpm;
      loopLength/=frmDur;
      loopLength = Math.round(loopLength);
      loopLength*=frmDur;

      var strtOnInPnt = false;
      if(/[iI][nN][pP][oO]?[iI]?[nN][tT]/.test(inStrtTime) ==true){   strtOnInPnt = true;   }
      for(var i = 0; i < inPropsAry.length; i++){
            if (inPropsAry[i].numKeys == 0){continue;}

            var thisProp = inPropsAry[i];
            var thisLyr = readLyrFromProp(thisProp);
            if(strtOnInPnt == true){
                loopStart = thisLyr.inPoint;
            }else{
                var inPoint = thisLyr.inPoint;
                if (loopStart == undefined){
                      if (inStrtTime+loopLength < inPoint){    // if entire loop is before begining of layer and keyframes
                          loopStart = inPoint;
                          loopStart -= inStrtTime;
                          loopStart /= loopLength;
                          loopStart = Math.floor(loopStart);
                          loopStart *= loopLength;
                          loopStart += inStrtTime;
                      }else{
                          loopStart = inStrtTime;
                      }
                }
            }

            thisProp.addKey(loopStart);
            var firstLoopPoint = loopStart + loopLength;
            thisProp.addKey(firstLoopPoint-frmDur);

            var loopStartIndx = thisProp.nearestKeyIndex(loopStart);
            if(loopStartIndx > 1){  deleteIndxRangePropKeys(thisProp, 1, loopStartIndx); }
            deleteIndxRangePropKeys(thisProp, thisProp.nearestKeyIndex(firstLoopPoint-frmDur)+1, -1);

            var propObjAry = multiPropRead([thisProp], slctKeysOnly= false, keyedPropsOnly= true);

            var loopPropObjAry=[];

            var propObjAryTime = [];
            for(var j = 0; j < propObjAry[0].keyObjAry.length; j++){
                propObjAryTime[j] = propObjAry[0].keyObjAry[j].time;
            }

            for(var j = loopLength; j < thisLyr.outPoint-loopStart; j+=loopLength){
                var newPropObj = cloneObj(propObjAry[0]);
                var newKeyObjAry=[];
                for(var k = 0; k < newPropObj.keyObjAry.length; k++){
                      var newKeyObj = cloneObj(newPropObj.keyObjAry[k]);
                      newKeyObj.time += j;
                      newKeyObjAry[k] = newKeyObj;
                }
                newPropObj.keyObjAry = newKeyObjAry;
                loopPropObjAry[loopPropObjAry.length] = newPropObj;
            }

            multiPropWriteSimple(loopPropObjAry);
      }
      app.endUndoGroup();
}

function slideKeyTime(inPropsAry, timeAddSec, slctKeysOnly){
      app.beginUndoGroup("Slide Key Time");
          var propObjAry = multiPropRead(inPropsAry, slctKeysOnly, keyedPropsOnly= true);
          deleteObjKeys(propObjAry);
          for(var i = 0; i < propObjAry.length; i++){
              var thisKeyObjAry = propObjAry[i].keyObjAry;
              for(var j = 0; j < thisKeyObjAry.length; j++){
                    var thisKeyObj = thisKeyObjAry[j];
                    thisKeyObj.time += timeAddSec;
              }
          }
          multiPropWriteRobust(propObjAry);
      app.endUndoGroup();
}

function randomSlideKeyTime(inPropsAry, ranRange, slctKeysOnly){
  app.beginUndoGroup("Random Slide Key Time");
      var propObjAry = multiPropRead(inPropsAry, slctKeysOnly, keyedPropsOnly= true);
      deleteObjKeys(propObjAry);
      for(var i = 0; i < propObjAry.length; i++){
          var thisKeyObjAry = propObjAry[i].keyObjAry;
          var thisFPS = readLyrFromProp(propObjAry[i].property).containingComp.frameRate;
          for(var j = 0; j < thisKeyObjAry.length; j++){
                var thisKeyObj = thisKeyObjAry[j];
                var ranVal = randUpDn(ranRange);
                var thisTime = Number(thisKeyObj.time);
                var ranTime = ranVal + thisTime;
                ranTime = keyFltr_timeDiv(thisFPS, 0, "round", ranTime);
                thisKeyObj.time = ranTime;
          }
      }
      multiPropWriteRobust(propObjAry);
  app.endUndoGroup();
}

// Key Filters    //use for base function for bpm & fps
function keyFltr_timeDiv(inModulo, offsetFrm, rndMthd, inVal){
      var frmDur;
      if (isNaN(Number(inModulo)) == false){frmDur = 1/inModulo;
      }else if (inModulo instanceof CompItem){frmDur = inModulo.frameDuration;
      }else{
          $.writeln("keyFltr_timeDiv input value 'inModulo' is not a valid number or a Comp Item\t" + inModulo.toString());
          return inVal;
      }
      var outVal = inVal;
      outVal -= offsetFrm;
      outVal/=frmDur;
      if(/[fF][lL][oO]?[oO]?[rR]?/.test(rndMthd)){
          outVal=Math.floor(outVal);
      }else if(/[cC][eE]?[iI]?[lL][iI]?[nN]?[gG]?/.test(rndMthd)){
          outVal=Math.ceil(outVal);
      }else{
          outVal=Math.round(outVal);
      }

      outVal*=frmDur;
      outVal += offsetFrm;
      return outVal;
}
