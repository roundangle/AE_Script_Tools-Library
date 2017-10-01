//  Required Libraries
//
//

//  Used In
    // lib_propKeys_actions_propertyAdjust.jsx
    // lib_propKeys_filters_Time.jsx
    // lib_propKeys_functions_Base.jsx




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
