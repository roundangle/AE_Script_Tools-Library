//  Required Libraries
//
//    lib_modPropKeys_functions_Base.jsx
//    lib_modPropKeys_actions_keyframe.jsx
//    lib_modPropKeys_actions_propertyAdjust.jsx
//    lib_modPropKeys_functions_common.jsx
//    lib_modPropKeys_functions_multiUse.jsx
//    lib_modPropKeys_gatherInfo_property.jsx
//

// Used In
    // End Tools Only

function pasteToNewLayers(inPropsAry, destLyrs, dltInKeys, slctKeysOnly){
      app.beginUndoGroup("Property Paste");
          var propObjAry  = multiPropRead(inPropsAry, slctKeysOnly, keyedPropsOnly= false);

          if (dltInKeys == true){
              deleteObjKeys(propObjAry);
          }
          var propObjAry = propAdjst_samePropNewLyrs(destLyrs, propObjAry, propTreeMethod= "matchName");
          multiPropWriteRobust(propObjAry);

      app.endUndoGroup();
}
function propAdjst_samePropNewLyrs(newLyrsAry, inKeyObjAry, propTreeMethod){
    if (newLyrsAry instanceof Array){
    }else{ newLyrsAry = [newLyrsAry];}

    var outObjAry=[];
    for(var i = 0; i < newLyrsAry.length; i++){   // Apply to all input layers
          var thisNewLyr = newLyrsAry[i];
          for(var j = 0; j < inKeyObjAry.length; j++){
              var thisObj = cloneObj(inKeyObjAry[j]);
              if(testConflicts(thisNewLyr, thisObj.keyObjAry[0]) == true){  // Skip unsettable props
                  var propTreeAry;
                  if((propTreeMethod == "index")||(propTreeMethod == "Index")||(propTreeMethod == "INDEX")){
                      propTreeAry = readPropIndexTreeAry(thisObj.property);
                  }else{
                      propTreeAry = readPropMatchNameTreeAry(thisObj.property);
                  }

                  thisObj.property =  applyPropTreeAryToLyr(thisNewLyr, propTreeAry);
                  if (thisObj.property != false){
                      outObjAry[outObjAry.length] = thisObj;
                  }
              }
          }
    }
    return outObjAry;
}
