//  Required Libraries
//
//    lib_propKeys_functions.jsx
//

// Used In
    // End Tools Only
    // lib_propKeys_filters_Value.jsx
    // lib_propKeys_filters_Time.jsx

//  CopyPaste Public Functions
  //  propAdjst_samePropNewLyrs
  //  propAdjst_samePropNewLyrs

//  DeleteKeys Public Functions
  //  deleteObjKeys
  //  deleteAllPropKeys
  //  deleteIndxRangePropKeys

var CopyPaste = (function(){
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
    return {    // Public Functions
      pasteToNewLayers: pasteToNewLayers,
      propAdjst_samePropNewLyrs:  propAdjst_samePropNewLyrs
    };
})();

var Delete Keys = (function(){
  function deleteObjKeys(inObjAry){
        for(var i = 0; i < inObjAry.length; i++){
            var thisObj = inObjAry[i];
            var thisProp = thisObj.property;
            var thisKeyObjAry = thisObj.keyObjAry;
            if(thisKeyObjAry[0].keyNum != -1){
                for(var j = 0; j < thisKeyObjAry.length; j++){
                      var removeKeyIndex = thisProp.nearestKeyIndex(thisKeyObjAry[j].time);
                      thisProp.removeKey(removeKeyIndex);
                }
            }
        }
  }
  function deleteAllPropKeys(inPropsAry){
        for(var i = 0; i < inPropsAry.length; i++){
              var thisProp = inPropsAry[i];
              for(var j = thisProp.numKeys; j >= 1; j--){
                    thisProp.removeKey(j);
              }
        }
  }
  function deleteIndxRangePropKeys(inProp, indxBgnDlt, indxEndDlt){
        var propNumKeys = inProp.numKeys;

        if (indxBgnDlt > propNumKeys){  $.writeln("indxBgnDlt exceeds propNumKeys\t" + indxBgnDlt); return false; }
        if (indxEndDlt > propNumKeys){  $.writeln("indxEndDlt exceeds propNumKeys\t" + indxEndDlt); return false; }
        if (indxBgnDlt == 0){  $.writeln("indxBgnDlt = 0"); return false; }
        if (indxEndDlt == 0){  $.writeln("indxEndDlt = 0"); return false; }

        if (indxBgnDlt < 1){  indxBgnDlt = propNumKeys + indxBgnDlt + 1;  }
        if (indxEndDlt < 1){  indxEndDlt = propNumKeys + indxEndDlt + 1;  }

        for(var i = indxEndDlt; i >= indxBgnDlt; i--){
              inProp.removeKey(i);
        }
  }
  return {    // Public Functions
    deleteObjKeys:  deleteObjKeys,
    deleteAllPropKeys:  deleteAllPropKeys,
    deleteIndxRangePropKeys:  deleteIndxRangePropKeys
  };
})();
