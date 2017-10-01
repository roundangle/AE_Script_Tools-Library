//  Required Libraries
//
//    NONE


// Used In
    // lib_propKeys_actions_copyPaste.jsx
    // lib_propKeys_filters_Value.jsx
    // lib_propKeys_filters_Time.jsx


// Keyframe Actions
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
