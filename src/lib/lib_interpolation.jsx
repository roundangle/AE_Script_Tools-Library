//  !!
//
//  Still need to test this
//
//  !!



#include "lib_ary.jsx";

// Acceptable Methods of Interplation
// 1    // Lin   // Linear
// 2    // Quad   // Quadratic //  Ease
// 3    // Cub   //  Cubic
// 4    // Qurt   //  QuartIc
// 5    // Quin   //  Quintic
// 6    // Sin   //  Sine
// 7    // Exp   //  Exponential
// 8    // Circ   //  Circle

var Interp = (function(){
  function interpAry(t, t1, t2, val1, val2, clip, mthd){    // Accepts Arrays or nonArrays  // Returns array of longest length of input arrays
    var tAry = Ary.force(t),  t1Ary = Ary.force(t1),  t2Ary = Ary.force(t2),  val1Ary = Ary.force(val1),  val2Ary = Ary.force(val2),  clipAry = Ary.force(clip),  mthdAry = Ary.force(mthd);
    var lngstLngth = Ary.longest([tAry, t1Ary, t2Ary, val1Ary, val2Ary, clipAry, mthdAry]);
    tAry = Ary.forceLength(tAry, lngstLngth, clip= false);  t1Ary = Ary.forceLength(t1Ary, lngstLngth, clip= false);  t2Ary = Ary.forceLength(t2Ary, lngstLngth, clip= false);  val1Ary = Ary.forceLength(val1Ary, lngstLngth, clip= false);  val2Ary = Ary.forceLength(val2Ary, lngstLngth, clip= false);  clipAry = Ary.forceLength(clipAry, lngstLngth, clip= false);  mthdAry = Ary.forceLength(mthdAry, lngstLngth, clip= false);

    var outAry;
    for(var i = 0; i < lngstLngth; i++){
      outAry[i] = interpNum(tAry[i], t1Ary[i], t2Ary[i], val1Ary[i], val2Ary[i], clipAry[i], mthdAry[i]);
    }
    return outAry;
  }
  function interpNum(t, t1, t2, val1, val2, clip, mthd){ //set up like AE's linear Interpolation
    var numFail = false;      //Safety determine if all inputs are numbers
    if(isNaN(t) == true){  $.writeln("interpNum()\tt is NaN"); numFail=true; } if(isNaN(t1) == true){  $.writeln("linInterpNum()\tt1 is NaN"); numFail=true; } if(isNaN(t2) == true){  $.writeln("linInterpNum()\tt2 is NaN"); numFail=true; } if(isNaN(val1) == true){  $.writeln("linInterpNum()\tval1 is NaN"); numFail=true; } if(isNaN(val2) == true){  $.writeln("linInterpNum()\tval2 is NaN"); numFail=true; }
    if(numFail==true){  return false; }

    var x1, x2, x3, y1, y3;
    if((val1 == val2) || (t1 == t2)){
      return val1;
    }else if (val1 < val2){                   // A
      y1 = val1;    y3 = val2;
      if(t1 < t2){
        x1 = t1;    x2 = t;   x3 = t2;
        var clipTRslt = clipT(x1, x2, x3);  if(clipTRslt == true){  return y1 }else if(clipTRslt == false){  return y3  };
      }else{                              // B
        x1 = -t1;    x2 = -t;   x3 = -t2;
        var clipTRslt = clipT(x1, x2, x3);  if(clipTRslt == true){  return y1 }else if(clipTRslt == false){  return y3  };
      }
      return calcInterp();
    }else if(val2 < val1){                    //  C
      y1 = -val2;    y3 = -val1;
      if(t1 < t2){
        x1 = t2;    x2 = t;   x3 = t1;
        var clipTRslt = clipT(-x1, -x2, -x3);  if(clipTRslt == true){  return -y1 }else if(clipTRslt == false){  return -y3  };
      }else{                                //  D
        x1 = -t2;    x2 = -t;   x3 = -t1;
        var clipTRslt = clipT(-x1, -x2, -x3);  if(clipTRslt == true){  return -y1 }else if(clipTRslt == false){  return -y3  };
      }
      return -calcInterp();
    }
  }

  // Private Functions

  function clipT(a1, a2, a3){   // clipping at t1 & t2
    if (clip == true){
      if(a2 < a1){ return true;  }   if(a2 > a3){ return false; }
    }
  }
  function parseInterpMethodAry(inMthd){
    // 1    // Lin   // Linear
    // 2    // Quad   // Quadratic //  Ease
    // 3    // Cub   //  Cubic
    // 4    // Qurt   //  QuartIc
    // 5    // Quin   //  Quintic
    // 6    // Sin   //  Sine
    // 7    // Exp   //  Exponential
    // 8    // Circ   //  Circle

    var thisAry = Ary.force(inMthd);
    thisAry = Ary.forceLength(thisAry, 2, clip= true);
    thisAry[0] = parseMethodName(thisAry[0]);
    thisAry[1] = parseMethodName(thisAry[1]);

    return thisAry;
  }
  function parseMethodName(mthdNm){
    if((mthdNm==1)||mthdNm==2)||mthdNm==3)||mthdNm==4)||mthdNm==5)||mthdNm==6)||mthdNm==7)||mthdNm==8)){
      return mthdNm;  // input is already acceptable
    }else if(/(quadr?a?t?i?c?|ease?)/i.test(mthdNm)){
      return 2;
    }else if(/cubi?c?/i.test(mthdNm)){
      return 3;
    }else if(/qua?rti?c?/i.test(mthdNm)){
      return 4;
    }else if(/quinti?c?/i.test(mthdNm)){
      return 5;
    }else if(/sine?a?l?/i.test(mthdNm)){
      return 6;
    }else if(/expo?n?e?n?t?i?a?l?/i.test(mthdNm)){
      return 7;
    }else if(/ci?rcl?e?/i.test(mthdNm)){
      return 8;
    }else{  //  /line?a?r?/i.test(mthdNm)   // default to linear
      return 1;
    }
  }
  function calcInterp(){
    var mthdNumAry = parseInterpMethodAry(mthd);
    if (x2 < 1.0) { // In
      switch(mthdNumAry[0]) {
        case 2:   // Quadratic //  Ease
        return Math.pow(x2,2.0)*((y3-y1)/2.0)+y1;
        break;
        case 3:   // Cub   //  Cubic
        return Math.pow(x2,3.0)*((y3-y1)/2.0)+y1;
        break;
        case 4:   // Qurt   //  QuartIc
        return Math.pow(x2,4.0)*((y3-y1)/2.0)+y1;
        break;
        case 5:   // Quin   //  Quintic
        return Math.pow(x2,5.0)*((y3-y1)/2.0)+y1;
        break;
        case 6:   // Sin   //  Sine
        return -(Math.cos((x2-x1)/(x3-x1)*Math.PI)-1.0)*((y3-y1)/2.0)+y1;
        break;
        case 7:   // Exp   //  Exponential
        return Math.pow(2.0 ,(x2-1.0)*10.0)*((y3-y1)/2.0)+y1;
        break;
        case 8:   // Circ   //  Circle
        return -(Math.sqrt(1.0-Math.pow(x2,2.0))-1.0)*((y3-y1)/2.0)+y1;
        break;
        default:  // 1    // Lin   // Linear
        return (((x2 - x1) * (y3 - y1)) / (x3 - x1)) + y1;
      }
    }else{  // Out
      switch(mthdNumAry[1]) {
        case 2:   // Quadratic //  Ease
        x2--;   return -(((x2-2.0)*x2)-1.0)*((y3-y1)/2.0)+y1;
        break;
        case 3:   // Cub   //  Cubic
        return (Math.pow(x2-2.0,3.0)+2.0)*((y3-y1)/2.0)+y1;
        break;
        case 4:   // Qurt   //  QuartIc
        return -(Math.pow(x2-2.0,4.0)-2.0)*((y3-y1)/2.0)+y1;
        break;
        case 5:   // Quin   //  Quintic
        return (Math.pow(x2-2.0,5)+2.0)*((y3-y1)/2.0)+y1;
        break;
        case 6:   // Sin   //  Sine
        return -(Math.cos((x2-x1)/(x3-x1)*Math.PI)-1.0)*((y3-y1)/2.0)+y1;
        break;
        case 7:   // Exp   //  Exponential
        return (-Math.pow(2.0 ,(x2-1.0)*-10.0)+2.0)*((y3-y1)/2.0)+y1;
        break;
        case 8:   // Circ   //  Circle
        return (Math.sqrt(1.0-Math.pow(x2-2.0,2.0))+1.0)*((y3-y1)/2.0)+y1;
        break;
        default:  // 1    // Lin   // Linear
        return (((x2 - x1) * (y3 - y1)) / (x3 - x1)) + y1;
      }
    }
  }

  return {    // Public Functions
    interpNum:  interpNum,
    interpAry:  interpAry
  };
})();



/*    Delete Below after testing


if(/line?a?r?/i.test(mthd)){                                 // linear  lin
return (((x2 - x1) * (y3 - y1)) / (x3 - x1)) + y1;

}else if(/(quad ?in|ease? ?in)/i.test(mthd)){                    //  quad in   quadin    ease in     easin
return Math.pow((x2-x1)/(x3-x1),2)*(y3-y1)+y1;

}else if(/(quad ?out|ease? ?out)/i.test(mthd)){                  //  quad out   quadout    ease out     easout
x2 = (x2-x1)/(x3-x1);
return -(x2-2.0)*x2*(y3-y1)+y1;

}else if(/(quad ?b?o?t?h?|ease? ?b?o?t?h?)/i.test(mthd)){        //  quad both   quad    easeboth    eas
x2 = (x2-x1)/((x3-x1)/2.0);
if (x2 < 1.0) {   return Math.pow(x2,2.0)*((y3-y1)/2.0)+y1;
}else{    x2--;   return -(((x2-2.0)*x2)-1.0)*((y3-y1)/2.0)+y1;    }

}else if(/cubi?c? ?in/i.test(mthd)){                         //  cubic in   cubin
return Math.pow((x2-x1)/(x3-x1),3.0)*(y3-y1)+y1;

}else if(/cubi?c? ?out/i.test(mthd)){                        //  cubic out   cubout
return (Math.pow((x2-x1)/(x3-x1)-1.0,3.0)+1.0)*(y3-y1)+y1;

}else if(/cubi?c? ?b?o?t?h?/i.test(mthd)){                    //  cubic both   cubic
x2 = (x2-x1)/((x3-x1)/2.0);
if (x2 < 1.0) {   return Math.pow(x2,3.0)*((y3-y1)/2.0)+y1;
}else{  return (Math.pow(x2-2.0,3.0)+2.0)*((y3-y1)/2.0)+y1;     }

}else if(/quarti?c? ?in/i.test(mthd)){                         //  quartic in   quartin
return Math.pow((x2-x1)/(x3-x1),4.0)*(y3-y1)+y1;

}else if(/quarti?c? ?out/i.test(mthd)){                        //  quartic out   quartout
return -(Math.pow((x2-x1)/(x3-x1)-1.0,4.0)-1.0)*(y3-y1)+y1;

}else if(/quarti?c? ?b?o?t?h?/i.test(mthd)){                    //  quartic both   quartic
x2 = (x2-x1)/((x3-x1)/2.0);
if (x2 < 1.0) {   return Math.pow(x2,4.0)*((y3-y1)/2.0)+y1;
}else{  return -(Math.pow(x2-2.0,4.0)-2.0)*((y3-y1)/2.0)+y1;     }

}else if(/quinti?c? ?in/i.test(mthd)){                         //  quintic in   quintin
return Math.pow((x2-x1)/(x3-x1),5.0)*(y3-y1)+y1;

}else if(/quinti?c? ?out/i.test(mthd)){                        //  quintic out   quintout
return -(Math.pow((x2-x1)/(x3-x1)-1.0,5.0)+1.0)*(y3-y1)+y1;

}else if(/quinti?c? ?b?o?t?h?/i.test(mthd)){                    //  quintic both   quintic
x2 = (x2-x1)/((x3-x1)/2.0);
if (x2 < 1.0) {   return Math.pow(x2,5.0)*((y3-y1)/2.0)+y1;
}else{  return (Math.pow(x2-2.0,5)+2.0)*((y3-y1)/2.0)+y1;     }

}else if(/sin ?in/i.test(mthd)){                         //  sin in   sinin
return -Math.cos((x2-x1)/(x3-x1)*(Math.PI/2.0))*(y3-y1)+(y3-y1)+y1;

}else if(/sin ?out/i.test(mthd)){                        //  sin out   sinout
return Math.sin((x2-x1)/(x3-x1)*(Math.PI/2.0))*(y3-y1)+y1;

}else if(/sin ?b?o?t?h?/i.test(mthd)){                    //  sin both   sin
return -(Math.cos((x2-x1)/(x3-x1)*Math.PI)-1.0)*((y3-y1)/2.0)+y1;

}else if(/exp ?in/i.test(mthd)){                         //  exp in   expin
return Math.pow(2.0 ,((x2-x1)/(x3-x1)-1.0)*10.0)*(y3-y1)+y1;

}else if(/exp ?out/i.test(mthd)){                        //  exp out   expout
return (-Math.pow(2.0 ,(x2-x1)/(x3-x1)*-10.0)+1.0)*(y3-y1)+y1;

}else if(/exp ?b?o?t?h?/i.test(mthd)){                    //  exp both   exp
x2=(x2-x1)/((x3-x1)/2.0);
if(x2<1){return Math.pow(2.0 ,(x2-1.0)*10.0)*((y3-y1)/2.0)+y1;
}else{  return (-Math.pow(2.0 ,(x2-1.0)*-10.0)+2.0)*((y3-y1)/2.0)+y1;  }

}else if(/circl?e? ?in/i.test(mthd)){                         //  circle in   circin
return -(Math.sqrt(1.0-Math.pow((x2-x1)/(x3-x1),2.0))-1.0)*(y3-y1)+y1;

}else if(/circl?e? ?out/i.test(mthd)){                        //  circle out   circout
return Math.sqrt(1.0-Math.pow((x2-x1)/(x3-x1)-1.0,2.0))*(y3-y1)+y1;

}else if(/circl?e? ?b?o?t?h?/i.test(mthd)){                    //  circle both   circ
x2=(x2-x1)/((x3-x1)/2.0);
if(x2<1){return -(Math.sqrt(1.0-Math.pow(x2,2.0))-1.0)*((y3-y1)/2.0)+y1;
}else{  return (Math.sqrt(1.0-Math.pow(x2-2.0,2.0))+1.0)*((y3-y1)/2.0)+y1;  }
*/
