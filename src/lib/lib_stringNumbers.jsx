// $.writeln(pad(45, 4));
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

// $.writeln(padWDec(34.583, 4));
function padWDec(inNum, padDigits){
    var padString = ""
    for (var i = 0; i < padDigits; i++){
                padString = padString + "0";
   }
   var decimal = "" + (inNum %1);
   var outNum = (padString+Math.floor(inNum)).slice(-padDigits);
   outNum = outNum + decimal.slice(1);

   return outNum;
}

// alert("string numbers");
