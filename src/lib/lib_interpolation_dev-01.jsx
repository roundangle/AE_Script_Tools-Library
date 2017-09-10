#include "lib_ary.jsx";

function parseInterpMethodAry(mthd){
  // 1    // Lin   // Linear
  // 2    // Quad   // Quadratic //  Ease
  // 3    // Cub   //  Cubic
  // 4    // Qurt   //  QuartIc
  // 5    // Quin   //  Quintic
  // 6    // Sin   //  Sine
  // 7    // Exp   //  Exponential
  // 8    // Circ   //  Circle

  var thisAry = forceAry(mthd);
  thisAry = forceAryLength(thisAry, 2, clip= true);
  thisAry[0] = parseMethodName(thisAry[0]);
  thisAry[1] = parseMethodName(thisAry[1]);

  return thisAry;

  function parseMethodName(mthdNm){
    if((mthdNm==1)||mthdNm==2)||mthdNm==3)||mthdNm==4)||mthdNm==5)||mthdNm==6)||mthdNm==7)||mthdNm==8)){
      return mthdNm;  // input is already acceptable
    }else if(/(quadr?a?t?i?c?|ease?)/i.test(mthd)){
      return 2;
    }else if(/cubi?c?/i.test(mthd)){
      return 3;
    }else if(/qua?rti?c?/i.test(mthd)){
      return 4;
    }else if(/quinti?c?/i.test(mthd)){
      return 5;
    }else if(/sine?a?l?/i.test(mthd)){
      return 6;
    }else if(/expo?n?e?n?t?i?a?l?/i.test(mthd)){
      return 7;
    }else if(/ci?rcl?e?/i.test(mthd)){
      return 8;
    }else{  //  /line?a?r?/i.test(mthd)   // default to linear
      return 1;
    }
  }
}
