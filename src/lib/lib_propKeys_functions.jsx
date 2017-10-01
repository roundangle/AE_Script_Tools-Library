//  Required Libraries
  //  lib_modPropKeys_functions_common.jsx
  //  lib_modPropKeys_functions_multiUse.jsx
  //  lib_modPropKeys_gatherInfo_property.jsx

// Used In
  // lib_propKeys_actions_copyPaste.jsx
  // lib_propKeys_filters_Value.jsx
  // lib_propKeys_filters_Time.jsx



// Base Public Functions
    // getProps   // getProps_selected_OR_allSetable,
    // getAllSetableProps
    // propRead
    // multiPropRead
    // propWrite
    // multiPropWriteSimple
    // multiPropWriteRobust

//  MultiUse Public Functions
    //  sepPosSafety
    //  prop_conflictsCategory
    //  lyr_propCategories
    //  testConflicts

//  PropInfo Public Functions
    //  readPropIndexTreeAry
    //  readPropNameTreeAry
    //  readPropMatchNameTreeAry
    //  readLyrFromProp
    //  readPropIndexTreeObj
    //  applyPropTreeAryToLyr
    //  buildLyrProps

//  Common Public Functions
    //  cloneObj
    //  ofstAryBeginOne
    //  aryIndexOf
    //  randMinMax
    //  andUpDn
    //  randUpDnAry
    //  verageAryNums


var Base = (function(){
  function getProps_selected_OR_allSetable(inComp, skipProps, keyedPropsOnly){
        var selectProps = inComp.selectedProperties;
        if (selectProps.length != 0){
            return [selectProps, true];
        }else{
            return [getAllSetableProps(inLyrAry= inComp.selectedLayers, skipProps, keyedPropsOnly), false];   // Need to use match names
        }
  }
  function getAllSetableProps(inLyrAry, skipProps, keyedPropsOnly){     // Returns Property Array
      /*
        Property familes for skip reference
        Marker, Time Remap, Motion Trackers, Masks, Effects, Transform, Layer Styles,
        Geometry Options, Material Options, Audio, Light Options, Camera Options, Text,
        Animators, Contents (shape layer)

        --> ! as first entry in skipProps will invert for 1st level properties, and choose only them.
      */

      if (inLyrAry instanceof Array){}else{inLyrAry = [inLyrAry];}

      var invertSkipProps = false;
      if (skipProps[0] == "!"){
          invertSkipProps = true;
          skipProps.shift();
      }

      var outProps=[];
      var iAiB = ofstAryBeginOne(inLyrAry);
      for(var i = iAiB[0]; i < iAiB[1]; i++){
          var thisLyr = inLyrAry[i];
          var thisLyrProps = subPropAry(thisLyr, invertSkipProps, skipProps, keyedPropsOnly);

          while(thisLyrProps.length > 0){
              var thisTestProp = thisLyrProps[0];
              thisLyrProps.shift();
              var thisPropRslt;
              if (invertSkipProps == false){
                  thisPropRslt = subPropAry(thisTestProp, false, skipProps, keyedPropsOnly);
              }else{
                  thisPropRslt = subPropAry(thisTestProp, false, [], keyedPropsOnly);
              }

              if(thisPropRslt instanceof Array) {
                  thisLyrProps = thisPropRslt.concat(thisLyrProps);
              }else{
                  if(testConflicts(thisLyr, thisPropRslt) == true){
                    outProps[outProps.length] = thisPropRslt;
                  }
              }

          }
      }
      return outProps;
  }
  function subPropAry(inProp, invertSkipProps, skipProps, keyedPropsOnly){  // Need note or better name

      var numProps = inProp.numProperties;
      if ((numProps  === undefined)||(numProps  == 0)){
          return inProp;
      }else{
          var subOutProps=[];
          for(var i = 1; i <= numProps; i++){
              var newProp = inProp.property(i);
              if ((keyedPropsOnly == true)&&(newProp.numKeys == 0)){   // keyedPropsOnly
                  continue;
              }
              if (invertSkipProps == true){
                  if ((aryIndexOf(skipProps, newProp.matchName) != -1) || (aryIndexOf(skipProps, newProp.name) != -1)){       // Either Match Name OR Name is in List   // Do Not Skip within list
                    subOutProps[subOutProps.length] = newProp;
                  }
              }else{
                  if ((aryIndexOf(skipProps, newProp.matchName) == -1) && (aryIndexOf(skipProps, newProp.name) == -1)){       // Neither Match Name NOR Name is in List  // Skip within list
                    subOutProps[subOutProps.length] = newProp;
                  }
              }
          }
          return subOutProps;
      }
  }

  // Read
  function multiPropRead(inProps, slctKeysOnly, keyedPropsOnly){    // Returns KeyFrame Obj Array       // Needs to be able to skip non-animated props      //also possibly something to carry expressions
      var outAry=[];
      for(var i = 0; i < inProps.length; i++){
          var thisObj = propRead(inProps[i], slctKeysOnly, keyedPropsOnly);
          if (thisObj != false){outAry[outAry.length] = thisObj;}
      }
      return outAry;
  }
  function propRead(inProp, slctKeysOnly, keyedPropsOnly){ // need alt  simple option for properties with no keyframes

      if (inProp instanceof Property){
          var propType = inProp.propertyValueType;
          if(propType == PropertyValueType.NO_VALUE){return false;}
          var propCnflctCat = prop_conflictsCategory(inProp);

          var keyObjAry=[];

          var exprsn = ""
          if ((inProp.canSetExpression == true) && (inProp.expressionEnabled == true)){exprsn = inProp.expression;}

          var numKeys = inProp.numKeys;

          var slctKeysAry;
          if (numKeys == 0){
              if(keyedPropsOnly == true){return false;} //
              if(propType == PropertyValueType.MARKER){return false;}  //  If zero Markers exist, don't bother
              slctKeysAry=[];
              keyObjAry[0] = {
                  keyNum: -1,
                  sourceProperty: inProp,
                  propType: propType,
                  propCnflctCat: propCnflctCat,
                  time: 0,
                  value: inProp.value,
                  interp: {interpIn: false, interpOut: false, ab: false, cb: false, ie: false, oe: false, sab: false, scb: false, ist: false, ost: false, rov: false}
              }
          }else{
              slctKeysAry = inProp.selectedKeys;

              if(propType == PropertyValueType.MARKER){
                slctKeysAry=[];
                    for(var i = 0; i < numKeys; i++){
                        keyObjAry[i] = markerRead(inProp, i+1);
                    }
              }else{
                    if(slctKeysOnly == false){
                        for(var i = 0; i < numKeys; i++){
                            keyObjAry[i] = keyRead(inProp, i+1, propType, propCnflctCat);
                        }
                    }else{
                        if (slctKeysAry.length == 0){return false;}
                        for(var i = 0; i < slctKeysAry.length; i++){
                            keyObjAry[i] = keyRead(inProp, slctKeysAry[i], propType, propCnflctCat);
                        }
                    }
              }
          }

          return {
                  property: inProp,
                  exprsn: exprsn,
                  keyObjAry: keyObjAry,
                  slctKeysAry: slctKeysAry
          };
      }
  }
  function markerRead(inProp, keyNum){
        return {
            keyNum: keyNum,
            sourceProperty: inProp,
            propType: PropertyValueType.MARKER,
            propCnflctCat: "Universal",
            time: inProp.keyTime(keyNum),
            value: inProp.keyValue(keyNum).comment,
            interp: {interpIn: false, interpOut: false, ab: false, cb: false, ie: false, oe: false, sab: false, scb: false, ist: false, ost: false, rov: false}
        }
  }
  function keyRead(inProp, keyNum, propType, propCnflctCat){
      var ab=false, cb=false, ie=false, oe=false, sab=false, scb=false, ist=false, ost=false, rov=false, ih=false, oh=false;

      var interpIn = inProp.keyInInterpolationType(keyNum);
      var interpOut = inProp.keyOutInterpolationType(keyNum);

      if ((interpIn == KeyframeInterpolationType.BEZIER) && (interpOut == KeyframeInterpolationType.BEZIER)){
            ab = inProp.keyTemporalAutoBezier(keyNum);
            cb = inProp.keyTemporalContinuous(keyNum);
      }
      if (interpIn != KeyframeInterpolationType.HOLD || interpOut != KeyframeInterpolationType.HOLD){
            ie = inProp.keyInTemporalEase(keyNum);
            oe = inProp.keyOutTemporalEase(keyNum);
      }
      if ((propType == PropertyValueType.TwoD_SPATIAL) || (propType == PropertyValueType.ThreeD_SPATIAL)){
            sab = inProp.keySpatialAutoBezier(keyNum);
            scb = inProp.keySpatialContinuous(keyNum);
            ist = inProp.keyInSpatialTangent(keyNum);
            ost = inProp.keyOutSpatialTangent(keyNum);
            rov = inProp.keyRoving(keyNum);
      }

      return {
        keyNum: keyNum,
        sourceProperty: inProp,
        propType: propType,
        propCnflctCat: propCnflctCat,
        time: inProp.keyTime(keyNum),
        value: inProp.keyValue(keyNum),
        interp: {interpIn: interpIn, interpOut: interpOut, ab: ab, cb: cb, ie:ie, oe:oe, sab: sab, scb: scb, ist: ist, ost: ost, rov: rov}
      };
  }


  // Write
  function propWrite(inPropObj){
        var inProp = inPropObj.property;

        var keyNum = inPropObj.keyObjAry[0].keyNum;
        if ((keyNum == -1) && (inProp.numKeys == 0)){     // no keys exist so set value
            inProp.setValue(inPropObj.keyObjAry[0].value);
            return;
        }
        var keyTimesAry=[];
        var keyValsAry=[];
        var numKeys = inPropObj.keyObjAry.length;
        for(var i = 0; i < numKeys; i++){
            keyTimesAry[i] = inPropObj.keyObjAry[i].time;
            keyValsAry[i] = inPropObj.keyObjAry[i].value;
        }
        inProp.setValuesAtTimes(keyTimesAry, keyValsAry); //set values
        if ((inPropObj.exprsn != "") && (inProp.canSetExpression == true)){   //&& (inProp.expressionEnabled == true)
              inProp.expression = inPropObj.exprsn;
        }
        for(var i = 0; i < keyTimesAry.length; i++){
            var keyNum = inProp.nearestKeyIndex(keyTimesAry[i]);
            inProp.setSelectedAtKey(keyNum, true);  // utilize this better
            applyInterpolation(inProp, inPropObj.keyObjAry[i].propType, keyNum, inPropObj.keyObjAry[i].interp);
        }
  }
  function multiPropWriteSimple(inObjAry){    // Input KeyFrame Obj Array, Writes this data     // Need separate write function without all safetys
        var skipSepProps=[];
        for(var i = 0; i < inObjAry.length; i++){
            try{
              var inPropObj = inObjAry[i];
              var inProp = inPropObj.property;
              var inLyr = readLyrFromProp(inProp);
              var skipSepPropsIndex = aryIndexOf(skipSepProps, inProp);
              var propMchNmTreeAry = readPropMatchNameTreeAry(inProp);
              var propMchNm = propMchNmTreeAry[propMchNmTreeAry.length-1];
              propWrite(inPropObj);
            }catch(err){
              $.writeln("Error-->\t" + err.line.toString() + "\t" + inObjAry[i].property.matchName + "\t" + inObjAry[i].property.propertyValueType + "\t" + err.toString());
            };
        }
  }
  function multiPropWriteRobust(inObjAry){    // Input KeyFrame Obj Array, Writes this data     // Need separate write function without all safetys
        var skipSepProps=[];
        for(var i = 0; i < inObjAry.length; i++){
            try{
              propSafeWrite(inObjAry, i);
            }catch(err){
              // $.writeln("Error-->\t" + err.line.toString() + "\t" + inObjAry[i].property.matchName + "\t" + readPropMatchNameTreeAry(inObjAry[i].property).toString() + "\t" + err.toString());
              $.writeln("Error-->\t" + err.line.toString() + "\t" + inObjAry[i].property.matchName + "\t" + inObjAry[i].property.propertyValueType + "\t" + err.toString());
              //alert(err.line.toString() + "\r" + err.toString())
            };
        }
  }
  function propSafeWrite(inObjAry, iteration){      // need alt option for properties with no keyframes
        var inPropObj = inObjAry[iteration];
        var inProp = inPropObj.property;
        var inLyr = readLyrFromProp(inProp);
        // var finishBackTo2D = false;

        //if (inProp instanceof Property){
        var skipSepPropsIndex = aryIndexOf(skipSepProps, inProp);
        if(-1 == skipSepPropsIndex){
            if (inProp.propertyValueType == inPropObj.keyObjAry[0].propType) {   //inPropObj.keyObjAry[i].propType
                  var propMchNmTreeAry = readPropMatchNameTreeAry(inProp);
                  var propMchNm = propMchNmTreeAry[propMchNmTreeAry.length-1];

                  if(propMchNm == "ADBE Marker"){   //  Safety for Markers
                    for(var i = 0; i < inPropObj.keyObjAry.length; i++){
                        inProp.setValueAtTime(inPropObj.keyObjAry[i].time, new MarkerValue(inPropObj.keyObjAry[i].value));
                    }
                      return;
                  }else if (propMchNm == "ADBE Time Remapping"){    //  Safety for Time Remap
                      var inLyr = readLyrFromProp(inProp);
                      if (inLyr.canSetTimeRemapEnabled == true){
                          inLyr.timeRemapEnabled = true;
                      }else{ return; }
                  }else if (propMchNmTreeAry[0] == "ADBE MTrackers") {  // Safety for Motion Trackers
                      // Come back to this when needed
                  }else if (propMchNmTreeAry[0] == "ADBE Mask Parade") {  // Safety for Masks
                      // Come back to this when needed
                  }else if (propMchNmTreeAry[0] == "ADBE Effect Parade") {  // Safety for Effects
                      // Come back to this when needed
                  }else if(propMchNmTreeAry[0] == "ADBE Transform Group"){  //  Safety for Transform
                      var sepPos = sepPosSafety(inProp);
                      if(sepPos != false){                            // Inter-Separated properties
                          if (sepPos.active == false){
                              if(sepPos.sepLead == true){ // Input is Lead but this is Separate
                                        var threeDLyr = inLyr.threeDLayer;

                                        //  Adjust Exprsn
                                              //  replace arrays
                                              //  replace links to position
                                        var posXKeyObjAry=[], posYKeyObjAry=[], posZKeyObjAry=[];
                                        for(var i = 0; i < inPropObj.keyObjAry.length; i++){
                                              var thisKeyObj = inPropObj.keyObjAry[i];
                                              posXKeyObjAry[i] = cloneObj(thisKeyObj);
                                              posXKeyObjAry[i].value = thisKeyObj.value[0];
                                              posXKeyObjAry[i].interp.sab = false, posXKeyObjAry[i].interp.scb = false, posXKeyObjAry[i].interp.ie = posXKeyObjAry[i].interp.ie[0], posXKeyObjAry[i].interp.oe = posXKeyObjAry[i].interp.oe[0], posXKeyObjAry[i].interp.ist = posXKeyObjAry[i].interp.ist[0], posXKeyObjAry[i].interp.ost = posXKeyObjAry[i].interp.ost[0], posXKeyObjAry[i].interp.rov = false;
                                              posYKeyObjAry[i] = cloneObj(thisKeyObj);
                                              posYKeyObjAry[i].value = thisKeyObj.value[1];
                                              posYKeyObjAry[i].interp.sab = false, posYKeyObjAry[i].interp.scb = false, posYKeyObjAry[i].interp.ie = posYKeyObjAry[i].interp.ie[1], posYKeyObjAry[i].interp.oe = posYKeyObjAry[i].interp.oe[1], posYKeyObjAry[i].interp.ist = posYKeyObjAry[i].interp.ist[1], posYKeyObjAry[i].interp.ost = posYKeyObjAry[i].interp.ost[1], posYKeyObjAry[i].interp.rov = false;
                                              if(threeDLyr == true){
                                                  posZKeyObjAry[i] = cloneObj(thisKeyObj);
                                                  posZKeyObjAry[i].value = thisKeyObj.value[2];
                                                  posZKeyObjAry[i].interp.sab = false, posZKeyObjAry[i].interp.scb = false, posZKeyObjAry[i].interp.ie = posZKeyObjAry[i].interp.ie[2], posZKeyObjAry[i].interp.oe = posZKeyObjAry[i].interp.oe[2], posZKeyObjAry[i].interp.ist = posZKeyObjAry[i].interp.ist[2], posZKeyObjAry[i].interp.ost = posZKeyObjAry[i].interp.ost[2], posZKeyObjAry[i].interp.rov = false;
                                              }
                                        }

                                        var posXPropObj = {
                                              property: sepPos.linkProp[0],
                                              exprsn: inPropObj.exprsn,
                                              keyObjAry: posXKeyObjAry,
                                              slctKeysAry: inPropObj.slctKeysAry
                                        }
                                        propWrite(posXPropObj);
                                        var posYPropObj = {
                                              property: sepPos.linkProp[1],
                                              exprsn: inPropObj.exprsn,
                                              keyObjAry: posYKeyObjAry,
                                              slctKeysAry: inPropObj.slctKeysAry
                                        }
                                        propWrite(posYPropObj);
                                        if(threeDLyr == true){
                                            var posZPropObj = {
                                                  property: sepPos.linkProp[2],
                                                  exprsn: inPropObj.exprsn,
                                                  keyObjAry: posZKeyObjAry,
                                                  slctKeysAry: inPropObj.slctKeysAry
                                            }
                                            propWrite(posZPropObj);
                                        }
                                        return;
                              }else{    // Input is Separate but this Layer is not Separated
                                        $.writeln("" + iteration + "\tsepLead--False\t" + inLyr.name);

                                        var threeDLyr = inLyr.threeDLayer;
                                        //  Need Adjust Exprsn
                                              //  replace arrays
                                              //  replace links to position

                                        var folProps = sepPos.coFollowers;
                                        var leadProp = sepPos.linkProp;

                                        var sliceObjAry = inObjAry.slice(iteration);
                                        var testObjAry=[];
                                        for(var i=0; i<sliceObjAry.length; i++){
                                            testObjAry[i] = sliceObjAry[i].property;
                                        }
                                        var joinPropObjAry = [inPropObj];
                                        for(var i=0; i<folProps.length; i++){
                                            var thisFolProp = folProps[i];
                                            var testInd = aryIndexOf(testObjAry, thisFolProp);
                                            if(testInd != -1){
                                                skipSepProps[skipSepProps.length] = thisFolProp;
                                                joinPropObjAry[joinPropObjAry.length] = inObjAry[iteration + testInd];
                                            }
                                        }

                                        var posPropObj = {};
                                        var noKeysExistBool = true;
                                        var orderPropObjAry=[];
                                        for(var i=0; i<leadProp.value.length; i++){
                                            orderPropObjAry[i] = false;
                                        }
                                        for(var i=0; i<joinPropObjAry.length; i++){
                                            orderPropObjAry[sepPosSafety(joinPropObjAry[i].property).thisDim] = joinPropObjAry[i];
                                            if (joinPropObjAry[i].keyObjAry[0].keyNum != -1){
                                                noKeysExistBool = false;
                                            }
                                        }

                                        var leadPropNumKeys = leadProp.numKeys;
                                        if((leadPropNumKeys == 0)&&(noKeysExistBool == true)){  // No Keys in Destination Prop &
                                            var thisVal=[];
                                            var leadPropVal = leadProp.value;
                                            for(var i=0; i<orderPropObjAry.length; i++){
                                                var thisPropObj = orderPropObjAry[i];
                                                if (thisPropObj == false){
                                                    thisVal[i] = leadPropVal[i].value;
                                                }else{
                                                    thisVal[i] = thisPropObj.keyObjAry[0].value;
                                                }
                                            }
                                            var thisKeyObjAry = [{
                                                keyNum: -1,
                                                sourceProperty: leadProp,
                                                propType: leadProp.propertyValueType,
                                                propCnflctCat: prop_conflictsCategory(leadProp),
                                                time: 0,
                                                value: thisVal,
                                                interp: {interpIn: false, interpOut: false, ab: false, cb: false, ie: false, oe: false, sab: false, scb: false, ist: false, ost: false, rov: false}
                                            }];
                                            posPropObj = {
                                                property: leadProp,
                                                exprsn: "" ,        // Come back later
                                                keyObjAry : thisKeyObjAry,
                                                slctKeysAry: []
                                            }
                                        }else{            // Keys involved
                                            var propType = leadProp.propertyValueType;
                                            var propCnflctCat = prop_conflictsCategory(leadProp);


                                            if (-1 != aryIndexOf(orderPropObjAry, false)){    //  One of separate is not included
                                                // test if missing is Z and layer is 2D if so--skip

                                                //  With All or Some Dimensions in inProp
                                                //  Keys in Some Dimensions and/or Dest Prop

                                                // replace any false values in orderPropObjAry with corellating value
                                                var posXKeyObjAry=[], posYKeyObjAry=[], posZKeyObjAry=[];
                                                for(var i = 0; i < inPropObj.keyObjAry.length; i++){
                                                      var thisKeyObj = inPropObj.keyObjAry[i];
                                                      if(orderPropObjAry[0]==false){
                                                          posXKeyObjAry[i] = cloneObj(thisKeyObj);
                                                          posXKeyObjAry[i].value = thisKeyObj.value[0];
                                                          posXKeyObjAry[i].interp.sab = false, posXKeyObjAry[i].interp.scb = false, posXKeyObjAry[i].interp.ist = false, posXKeyObjAry[i].interp.ost = false, posXKeyObjAry[i].interp.rov = false;
                                                      }
                                                      if(orderPropObjAry[1]==false){
                                                          posYKeyObjAry[i] = cloneObj(thisKeyObj);
                                                          posYKeyObjAry[i].value = thisKeyObj.value[1];
                                                          posYKeyObjAry[i].interp.sab = false, posYKeyObjAry[i].interp.scb = false, posYKeyObjAry[i].interp.ist = false, posYKeyObjAry[i].interp.ost = false, posYKeyObjAry[i].interp.rov = false;
                                                      }
                                                      if((orderPropObjAry[1]==false)&&(threeDLyr == true)){
                                                          posZKeyObjAry[i] = cloneObj(thisKeyObj);
                                                          posZKeyObjAry[i].value = thisKeyObj.value[2];
                                                          posZKeyObjAry[i].interp.sab = false, posZKeyObjAry[i].interp.scb = false, posZKeyObjAry[i].interp.ist = false, posZKeyObjAry[i].interp.ost = false, posZKeyObjAry[i].interp.rov = false;
                                                      }
                                                }
                                                if (orderPropObjAry[0] == false){ orderPropObjAry[0] = posXKeyObjAry;}
                                                if (orderPropObjAry[1] == false){ orderPropObjAry[1] = posYKeyObjAry;}
                                                if (orderPropObjAry[2] == false){ orderPropObjAry[2] = posZKeyObjAry;}
                                            }

                                            var keysExst=[];
                                            for(var i=0; i<orderPropObjAry.length; i++){
                                                if (-1 == orderPropObjAry[i].keyObjAry[0].keyNum){
                                                    keysExst[i] = false;   // -1 detected, so No Keys are present
                                                }else{
                                                    keysExst[i] = true;
                                                }
                                            }

                                            var thisEvalVal=[], thisEvalTime=[], thisInterp=[];     // Run through once to get prev
                                            for(var i=0; i<orderPropObjAry.length; i++){
                                                thisEvalVal[i] = orderPropObjAry[i].keyObjAry[0].value;
                                                thisEvalTime[i] = orderPropObjAry[i].keyObjAry[0].time;
                                                thisInterp[i] = orderPropObjAry[i].keyObjAry[0].interp;
                                                if (keysExst[i] == true){
                                                    if(orderPropObjAry[i].keyObjAry.length > 1){
                                                        orderPropObjAry[i].keyObjAry.shift();
                                                    }else{
                                                        keysExst[i] = false;
                                                        orderPropObjAry[i].keyObjAry[0].time = 99999; //effectively infinite
                                                    }
                                                }
                                            }
                                            var  thisKeyObjAry=[], thisKeyNum=1, breakBool=false, valTestNull=false, valTestSlider=false, prevKeyExists=[];
                                            for(var i=0; i<orderPropObjAry.length; i++){  prevKeyExists[i]=false; }
                                            while(true){    //  Build keyframes
                                                            var nxtEvalVal=[], nxtEvalTime=[], nxtInterp=[];

                                                            for(var i=0; i<orderPropObjAry.length; i++){
                                                                nxtEvalVal[i] = orderPropObjAry[i].keyObjAry[0].value;
                                                                nxtEvalTime[i] = orderPropObjAry[i].keyObjAry[0].time;
                                                                nxtInterp[i] = orderPropObjAry[i].keyObjAry[0].interp;
                                                            }

                                                            var timeBool = true;
                                                            var testTime = thisEvalTime[0];
                                                            for(var i=1; i<thisEvalTime.length; i++){
                                                                if (testTime != thisEvalTime[i]){
                                                                    timeBool = false;
                                                                    break;
                                                                }
                                                            }

                                                            var thisTime, thisVal=[], writeInterp={};
                                                            if (timeBool == true){    // Keyframe exists at same time for each dimension
                                                                  thisTime = testTime;
                                                                  thisVal = thisEvalVal;

                                                                  var interpInAry=[], interpOutAry=[], abAry=[], cbAry=[], ieAry=[], oeAry=[], sabAry=[], scbAry=[], istAry=[], ostAry=[], rovAry=[];
                                                                  for(var i=0; i<thisInterp.length; i++){
                                                                      interpInAry[i] = thisInterp[i].interpIn;
                                                                      interpOutAry[i] = thisInterp[i].interpOut;
                                                                      abAry[i] = thisInterp[i].ab;
                                                                      cbAry[i] = thisInterp[i].cb;
                                                                      ieAry[i] = thisInterp[i].ie;
                                                                      oeAry[i] = thisInterp[i].oe;
                                                                      sabAry[i] = thisInterp[i].sab;
                                                                      scbAry[i] = thisInterp[i].scb;
                                                                      istAry[i] = thisInterp[i].ist;
                                                                      ostAry[i] = thisInterp[i].ost;
                                                                      rovAry[i] = thisInterp[i].rov;
                                                                  }

                                                                  writeInterp = {interpIn: testSame(interpInAry, KeyframeInterpolationType.LINEAR),
                                                                                interpOut: testSame(interpOutAry, KeyframeInterpolationType.LINEAR),
                                                                                ab: testSame(abAry, false),
                                                                                cb: testSame(cbAry, false),
                                                                                ie: averageKeyframeEase(ieAry),
                                                                                oe: averageKeyframeEase(oeAry),
                                                                                sab: testSame(sabAry, false),
                                                                                scb: testSame(scbAry, false),
                                                                                ist: istAry,
                                                                                ost: ostAry,
                                                                                rov: testSame(rovAry, false)
                                                                            };

                                                                  for(var i=0; i<orderPropObjAry.length; i++){
                                                                      if (keysExst[i] == true){
                                                                          if(orderPropObjAry[i].keyObjAry.length > 1){
                                                                              orderPropObjAry[i].keyObjAry.shift();
                                                                          }else{
                                                                              keysExst[i] = false;
                                                                              orderPropObjAry[i].keyObjAry[0].time = 99999; //effectively infinite
                                                                          }
                                                                      }
                                                                  }
                                                            }else{
                                                                  testTime = thisEvalTime[0];
                                                                  var lowTimeInd = [0];
                                                                  for(var i=1; i<thisEvalTime.length; i++){       // determine which property(s) has the next keyframe by time
                                                                        if (testTime == thisEvalTime[i]){
                                                                            lowTimeInd[lowTimeInd.length] = i;
                                                                        }else (testTime > thisEvalTime[i]){
                                                                            testTime = thisEvalTime[i];
                                                                            lowTimeInd = [i];
                                                                        }
                                                                  }
                                                                  thisTime = testTime;
                                                                  for(var i=0; i<thisEvalTime.length; i++){       //  Calculate between multiple keyframes
                                                                        if (-1 != aryIndexOf(lowTimeInd, i)){
                                                                            thisVal[i] = thisEvalVal[i];
                                                                            if (keysExst[i] == true){
                                                                                if(orderPropObjAry[i].keyObjAry.length > 1){
                                                                                    orderPropObjAry[i].keyObjAry.shift();
                                                                                }else{
                                                                                    keysExst[i] = false;
                                                                                    orderPropObjAry[i].keyObjAry[0].time = 99999; //effectively infinite
                                                                                }
                                                                            }
                                                                        }else{

                                                                            if (prevKeyExists[i] == true){
                                                                                if (valTestSlider == false){        // if valTestSlider does not exist, create it
                                                                                    valTestNull = thisComp.layers.addNull(1);
                                                                                    valTestSlider = valTestNull.property("ADBE Effect Parade").addProperty("ADBE Slider Control");
                                                                                    valTestSlider = valTestSlider .property(1);
                                                                                }




                                                                                // Also Needs to test for future key




                                                                                $.writeln("valTestSlider");
                                                                                $.writeln(thisKeyObjAry[thisKeyObjAry.length-1].time);
                                                                                $.writeln(thisEvalTime[i]);
                                                                                $.writeln(thisKeyObjAry[thisKeyObjAry.length-1].value[i]);
                                                                                $.writeln(thisEvalVal[i]);
                                                                                $.writeln("--------------");

                                                                                valTestSlider.setValuesAtTimes([thisKeyObjAry[thisKeyObjAry.length-1].time, thisEvalTime[i]], [thisKeyObjAry[thisKeyObjAry.length-1].value[i], thisEvalVal[i]]);
                                                                                // Set interpolation
                                                                                applyInterpolation(valTestSlider, false, 1, thisKeyObjAry[thisKeyObjAry.length-1].interp);
                                                                                applyInterpolation(valTestSlider, false, 1, thisInterp[i]);

                                                                                thisVal[i] = valTestSlider.valueAtTime(thisTime, false);

                                                                                valTestSlider.removeKey(1); valTestSlider.removeKey(1); //must run 2x key 2 becomes key 1
                                                                            }else{
                                                                                thisVal[i] = thisEvalVal[i];
                                                                                prevKeyExists[i] = true;
                                                                            }

                                                                        }
                                                                  }

                                                                  //  Interpolation only applied if keyframe is present for all dimensions
                                                                  writeInterp = {interpIn: false, interpOut: false, ab: false, cb: false, ie: false, oe: false, sab: false, scb: false, ist: false, ost: false, rov: false };

                                                            }

                                                            thisKeyObjAry[thisKeyNum-1] = {
                                                                keyNum: thisKeyNum,
                                                                sourceProperty: leadProp,
                                                                propType: propType,
                                                                propCnflctCat: propCnflctCat,
                                                                time: thisTime,
                                                                value: thisVal,
                                                                interp: writeInterp
                                                            };
                                                            if(breakBool == true){    // Calculated from previous loop, so as to capture final Keyframe
                                                                break;
                                                            }
                                                            for(var i=0; i<keysExst.length; i++){
                                                                if (keysExst[i] == true){
                                                                    breakBool = false;
                                                                    break;
                                                                }
                                                                if (i == keysExst.length-1){
                                                                    breakBool = true;
                                                                }
                                                            }
                                                            thisKeyNum++;
                                                            thisEvalVal = nxtEvalVal;
                                                            thisEvalTime = nxtEvalTime;
                                                            thisInterp = nxtInterp;
                                            }
                                            if (valTestNull != false){valTestNull.remove();}

                                            posPropObj = {
                                                property: leadProp,
                                                exprsn: "" ,        // Come back later
                                                keyObjAry : thisKeyObjAry,
                                                slctKeysAry: []
                                            }
                                        }
                                        propWrite(posPropObj);
                                        return;
                              }
                              return;
                          }else if((inProp.matchName == "ADBE Position_2") && (inLyr.threeDLayer == false)){
                              inLyr.threeDLayer = true; /*finishBackTo2D = true;*/
                          }
                              //  safety between unseparated & separated properties here
                      }
                  }else if(propMchNmTreeAry[0] == "ADBE Text Properties"){  //  Safety for Text
                      // Come back to this
                  }else if(propMchNmTreeAry[0] == "ADBE Root Vectors Group"){  //  Safety for Shape Layer
                      // Come back to this
                  }else if (propMchNmTreeAry[0] == "ADBE Audio Group"){
                        if(inLyr.hasAudio == false){ return; }
                  }

                  propWrite(inPropObj);

            }else{$.writeln("Input property type does not match original\t" + inProp.name + "\t" + inProp.propertyValueType + "\t" + inPropObj.keyObjAry[0].propType);}
        //}else{alert("Input object is not a property");}
      }else{  // inProp is in skipSepProps Array;
            $.writeln("SKIPPED\t" + skipSepProps[skipSepPropsIndex].name);
            skipSepProps.splice(skipSepPropsIndex, 1);
      }
  }

  function applyInterpolation(applyProp, propType, thisKeyNum, inKeyInterp){
        if ((inKeyInterp.interpIn != false) && (inKeyInterp.interpIn != false)){

              if((inKeyInterp.interpIn == KeyframeInterpolationType.BEZIER) && (inKeyInterp.interpOut == KeyframeInterpolationType.BEZIER) && (inKeyInterp.cb != false)){
                  applyProp.setTemporalContinuousAtKey(thisKeyNum, inKeyInterp.cb);
                  applyProp.setTemporalAutoBezierAtKey(thisKeyNum, inKeyInterp.ab);
              }
              if ((inKeyInterp.ie!=false) && (inKeyInterp.oe!=false) && ((inKeyInterp.interpIn != KeyframeInterpolationType.HOLD) || (inKeyInterp.interpOut != KeyframeInterpolationType.HOLD))){
                  applyProp.setTemporalEaseAtKey(thisKeyNum, inKeyInterp.ie, inKeyInterp.oe);
              }
              if ((propType == PropertyValueType.TwoD_SPATIAL) || (propType == PropertyValueType.ThreeD_SPATIAL) && (inKeyInterp.scb != false)){  // seems like this could be handled more efficiently
                  applyProp.setSpatialContinuousAtKey(thisKeyNum, inKeyInterp.scb);
                  applyProp.setSpatialAutoBezierAtKey(thisKeyNum, inKeyInterp.sab);
                  applyProp.setSpatialTangentsAtKey(thisKeyNum, inKeyInterp.ist, inKeyInterp.ost);
                  applyProp.setRovingAtKey(thisKeyNum, inKeyInterp.rov);
              }

              applyProp.setInterpolationTypeAtKey(thisKeyNum, inKeyInterp.interpIn, inKeyInterp.interpOut);
        }
  }
  function testSame(inAry, defRet){
      var ary0 = inAry[0];
      for(var i=1; i<inAry.length; i++){
          if (ary0 != inAry[i]){
              return defRet;
          }
      }
      return ary0;
  }
  function averageKeyframeEase(inEaseAry){
        var speedAry = [], influenceAry = [];
        for(var i=0; i<inEaseAry.length; i++){
            speedAry[i] = inEaseAry[i][0].speed;
            influenceAry[i] = inEaseAry[i][0].influence;
        }
        var avrgSpd = averageAryNums(speedAry);
        var avrgInf = averageAryNums(influenceAry);

        return [new KeyframeEase(avrgSpd, avrgInf)];
  }

  return {    // Public Functions
    getProps: getProps_selected_OR_allSetable,
    getAllSetableProps: getAllSetableProps,
    propRead: propRead,
    multiPropRead: multiPropRead,
    propWrite: propWrite,
    multiPropWriteSimple: multiPropWriteSimple,
    multiPropWriteRobust: multiPropWriteRobust
  };


})();

var MultiUse = (function(){
    function sepPosSafety(inProp){
        var sepFol, sepLead;
        if (((sepFol = inProp.isSeparationFollower) == true) || ((sepLead = inProp.isSeparationLeader) == true)){
            var active, linkProp, thisDim, coFollowers;
            if (sepLead == true){
                active = !inProp.dimensionsSeparated;
                thisDim = false;
                coFollowers = false;
                linkProp = subProps(inProp);                // need this
            }else{
                linkProp = inProp.separationLeader;
                active = linkProp.dimensionsSeparated;
                thisDim = inProp.separationDimension;
                coFollowers = coFol(inProp, thisDim, linkProp);     // coFollower props
            }

        }else{
            return false;
        }

        return {
                active: active,
                sepLead: sepLead,
                linkProp: linkProp,
                thisDim: thisDim,
                coFollowers: coFollowers
        }

        function coFol(inProp, thisDim, linkProp){
            var outPropAry=[];
            var inPropGroup = inProp.propertyGroup();
            var inPropIndex = inProp.propertyIndex;
            var linkPropIndex = linkProp.propertyIndex;

            for(var i=0; i<linkProp.value.length; i++){
                var thisIndex = linkPropIndex + 1 + i;
                if(thisIndex != inPropIndex){
                    outPropAry[outPropAry.length] = inPropGroup.property(thisIndex);
                }
            }
            return outPropAry;
        }
        function subProps(inProp){
            var inPropGroup = inProp.propertyGroup();
            var inPropIndex = inProp.propertyIndex;
            var outPropAry=[];
            for(var i=0; i<inProp.value.length; i++){
                var thisIndex = inPropIndex + 1 + i;
                outPropAry[i] = inPropGroup.property(thisIndex);
            }
            return outPropAry;
        }
    }
    function prop_conflictsCategory(inProp){
          var inPropMtchNmTree = readPropMatchNameTreeAry(inProp);
          switch(inPropMtchNmTree[0]) {
              case "ADBE Marker":
                  return "Universal";
                  break;
              case "ADBE Time Remapping":
                  return "AvOnly";
                  break;
              case "ADBE MTrackers":
                  return "FootageOnly";
                  break;
              case "ADBE Mask Parade":
                  return "Secondary";
                  break;
              case "ADBE Effect Parade":
                  return "Secondary";
                  break;
              case "ADBE Transform Group":
                  var thisMtchNm = inPropMtchNmTree[inPropMtchNmTree.length-1];

                  if (-1 != aryIndexOf(["ADBE Position_2", "ADBE Orientation", "ADBE Rotate X", "ADBE Rotate Y"], thisMtchNm)){
                      return "Universal3dOnly";
                  }else if(-1 != aryIndexOf(["ADBE Scale", "ADBE Opacity"], thisMtchNm)){
                      return "Secondary";
                  }else if (thisMtchNm == "ADBE Envir Appear in Reflect"){
                      return "RayTracedEnvir";
                  }else{
                      return "Universal";
                  }
                  break;
              case "ADBE Layer Styles":
                  return "Secondary";
                  break;
              case "ADBE Plane Options Group":
                  return "RayTracedAV";
                  break;
              case "ADBE Extrsn Options Group":
                  return "RayTracedShape&Text";
                  break;
              case "ADBE Material Options Group":
                  var thisMtchNm = inPropMtchNmTree[inPropMtchNmTree.length-1];
                  if (-1 != aryIndexOf(["ADBE Casts Shadows", "ADBE Light Transmission", "ADBE Accepts Shadows", "ADBE Accepts Lights", "ADBE Ambient Coefficient", "ADBE Diffuse Coefficient", "ADBE Specular Coefficient", "ADBE Shininess Coefficient", "ADBE Metal Coefficient"], thisMtchNm)){
                      return "Secondary3dOnly";
                  }else{
                      return "RayTracedOnly";
                  }
                  break;
              case "ADBE Audio Group":
                  return "Secondary";
                  break;
              case "ADBE Camera Options Group":
                  return "CameraOnly";
                  break;
              case "ADBE Light Options Group":
                  return "LightOnly";
                  break;
              case "ADBE Root Vectors Group":
                  return "ShapeOnly";
                  break;
              case "ADBE Text Properties":
                  return "TextOnly";
                  break;
              default:
                  break;
          }
    }
    function lyr_propCategories(inLyr){
        var propOkAry=[];
        if(inLyr instanceof AVLayer){
            propOkAry = ["Universal", "Secondary", "AvOnly"];
            if (inLyr.threeDLayer == true){
                  propOkAry = propOkAry.concat(["Av3dOnly", "Universal3dOnly", "Secondary3dOnly"]);
                  if (inLyr.containingComp.renderer == "ADBE Picasso"){
                        propOkAry = propOkAry.concat(["RayTracedOnly", "RayTracedAV"]);
                  }
                  if (inLyr.environmentLayer == true){
                        propOkAry[propOkAry.length] = "RayTracedEnvir";
                  }
            }
            if(inLyr.source.frameDuration < 1){
                  propOkAry[propOkAry.length] = "FootageOnly";
            }
        }else if(inLyr instanceof CameraLayer){
            propOkAry = ["Universal", "Universal3dOnly", "CameraOnly"];
        }else if(inLyr instanceof LightLayer){
            propOkAry = ["Universal", "Universal3dOnly", "LightOnly"];
        }else if(inLyr instanceof ShapeLayer){
            propOkAry = ["Universal", "Secondary", "ShapeOnly"];
            if (inLyr.threeDLayer == true){
                  propOkAry = propOkAry.concat(["Universal3dOnly", "Secondary3dOnly"]);
                  if (inLyr.containingComp.renderer == "ADBE Picasso"){
                        propOkAry = propOkAry.concat(["RayTracedOnly", "RayTracedShape&Text"]);
                  }
            }
        }else if(inLyr instanceof TextLayer){
            propOkAry = ["Universal", "Secondary", "ShapeOnly"];
            if (inLyr.threeDLayer == true){
                  propOkAry = propOkAry.concat(["Universal3dOnly", "Secondary3dOnly"]);
                  if (inLyr.containingComp.renderer == "ADBE Picasso"){
                        propOkAry = propOkAry.concat(["RayTracedOnly", "RayTracedShape&Text"]);
                  }
            }
        }
        return propOkAry;
    }
    function testConflicts(inLyr, inPropInfo){
          var propCnflctCat;
          if (inPropInfo instanceof Property){
              if(sepPos = sepPosSafety(inPropInfo).active == false){ return false; } // First Search for Separated Inactive
              propCnflctCat = prop_conflictsCategory(inPropInfo);   // if property, then run category fresh
          }else{
                                                            // !!!--DOES NOT Search for Separated Inactive--!!!
              propCnflctCat = inPropInfo.propCnflctCat      // if keyObj, then use already run category
          }

          var lyrPropCatAry = lyr_propCategories(inLyr);
          if (-1 == aryIndexOf(lyrPropCatAry, propCnflctCat)){
              return false;   // Conflict found
          }
          if ((-1 != aryIndexOf(lyrPropCatAry, "RayTracedEnvir")) && (-1 == aryIndexOf(["ADBE Envir Appear in Reflect", "ADBE Rotate Z", "ADBE Rotate X", "ADBE Opacity", "ADBE Orientation", "ADBE Rotate Y"], inKeyObj.sourceProperty.matchName))){  //
              return false;   //Environment Layer / Non-Environment Property
          }
          return true;  // No conflicts found
    }
    return {    // Public Functions
      sepPosSafety: sepPosSafety,
      prop_conflictsCategory: prop_conflictsCategory,
      lyr_propCategories: lyr_propCategories,
      testConflicts:  testConflicts
    };
})();

var PropInfo = (function(){
  function readPropIndexTreeAry(inProp){
      var outAry=[];
      var propIndex = inProp.propertyIndex;
      while(propIndex != undefined){
          outAry.unshift(propIndex);
          inProp = inProp.propertyGroup();
          propIndex = inProp.propertyIndex;
      }

      return outAry;
  }
  function readPropNameTreeAry(inProp){
      var outAry=[];
      var propIndex = inProp.propertyIndex;
      while(propIndex != undefined){
          outAry.unshift(inProp.name);
          inProp = inProp.propertyGroup();
          propIndex = inProp.propertyIndex;
      }
      return outAry;
  }
  function readPropMatchNameTreeAry(inProp){
      var outAry=[];
      var propIndex = inProp.propertyIndex;
      while(propIndex != undefined){
          outAry.unshift(inProp.matchName);
          inProp = inProp.propertyGroup();
          propIndex = inProp.propertyIndex;
      }

      return outAry;
  }
  function readLyrFromProp(inProp){
      if (inProp instanceof Array){inProp = inProp[0];} // if array is given, only first entry is run
      var thisProp = inProp;
      var propIndex = thisProp.propertyIndex;
      while(propIndex != undefined){
          thisProp = thisProp.propertyGroup();
          propIndex = thisProp.propertyIndex;
      }
      return thisProp
  }
  function readPropIndexTreeObj(inProp){
      var outPropIndAry=[];
      var thisProp = inProp;
      var propIndex = thisProp.propertyIndex;
      while(propIndex != undefined){
          outPropIndAry.unshift(propIndex);
          thisProp = thisProp.propertyGroup();
          propIndex = thisProp.propertyIndex;
      }
       var outLyrInd = thisProp.index;

      return {
            comp: thisProp.containingComp,
            layer: thisProp,
            property: inProp,
            layerIndex: outLyrInd,
            propAry : outPropIndAry
          };
  }
  function applyPropTreeAryToLyr(inLyr, inPropMchNmAry){
        var outProp = inLyr;

        switch(inPropMchNmAry[0]) {
            case "ADBE MTrackers":    // Safety for Motion Trackers
                // if possible find way of initiating new tracker via scripting
                if((inLyr.source.frameDuration == 1)||(inLyr.property("ADBE MTrackers").numProperties == 0)){ return false; }
                break;
            case "ADBE Mask Parade":    // Safety for Effects
                // Come back to this when needed
                break;
            case "ADBE Effect Parade":    // Safety for Effects
                // Come back to this when needed
                break;
            case "ADBE Root Vectors Group":   // Safety for Shape Layers
                // Come back to this when needed
                break;
            case "ADBE Text Properties":    // Safety for Text Layers
                // Come back to this when needed
                break;
            default:
                break;
        }
        for(var i = 0; i < inPropMchNmAry.length; i++){
            try{
              outProp = outProp.property(inPropMchNmAry[i]);
            }catch(err){
              $.writeln("Error--Prop to Layer-->\t" + err.line.toString() + "\t" + err.toString());
              return false;
              //alert(err.line.toString() + "\r" + err.toString())
            };
        }
        return outProp;
  }
  function buildLyrProps(inLyrAry, dsgProps){
      var outProps=[];
      for(var i = 0; i < inLyrAry.length; i++){
          var thisLyr = inLyrAry[i];
          for(var j = 0; j < dsgProps.length; j++){
              var thisPropTree = dsgProps[j];
              var thisOutProp = thisLyr;
              for(var k = 0; k < thisPropTree.length; k++){
                  var thisOutProp = thisOutProp.property(thisPropTree[k]);
              }
              outProps[outProps.length] = thisOutProp;
          }
      }
      return outProps
  }
  return {    // Public Functions
    readPropIndexTreeAry: readPropIndexTreeAry,
    readPropNameTreeAry:  readPropNameTreeAry,
    readPropMatchNameTreeAry: eadPropMatchNameTreeAry,
    readLyrFromProp:  readLyrFromProp,
    readPropIndexTreeObj: readPropIndexTreeObj,
    applyPropTreeAryToLyr:  applyPropTreeAryToLyr,
    buildLyrProps:  buildLyrProps
  };
})();

var Common = (function(){
    function cloneObj(obj) {
        if ((obj == null) || (typeof obj != "object")) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }
    function ofstAryBeginOne(inAry){
        var iA = 0;
        var iB = inAry.length;
        try{ inAry[0];}catch(err){ //assumes error is from 0 being out of range
             iA++;
             iB++;
        };
        return [iA, iB];
    }
    function aryIndexOf(inAry, chckItem){
        for(var i=0; i<inAry.length; i++){
            if (inAry[i] == chckItem){
              return i;
            }
        }
        return -1;
    }
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
    function randUpDn(inVal){
        var thisRan = Math.random();
        thisRan -= .5;
        thisRan *= Math.abs(inVal);

        return thisRan;
    }
    function randUpDnAry(inAry){
        var outAry=[];
        for(var i=0; i<inAry.length; i++){
            outAry[i] = randUpDn(inAry[i]);
        }
        return outAry;
    }
    function averageAryNums(inAry){
      var outVal=0;
          for(var i=0; i<inAry.length; i++){
              outVal += inAry[i];
          }
      return outVal/inAry.length;
    }
    return {    // Public Functions
      cloneObj: cloneObj,
      ofstAryBeginOne:  ofstAryBeginOne,
      aryIndexOf: aryIndexOf,
      randMinMax: randMinMax,
      randUpDn: randUpDn,
      randUpDnAry:  randUpDnAry,
      averageAryNums: averageAryNums
    };
})();
