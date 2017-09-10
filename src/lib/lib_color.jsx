// alert("color check");


// $.writeln(rgbStrng_clrAry("<rgb: 127, 255, 0>", true));
function rgbStrng_clrAry(inString, incldAlpha){
      if (/<rgb\s*:?\s*\d{1,3},\s*\d{1,3},\s*\d{1,3}\s*>/.test(inString) == false){return false;}

      var procString = inString.replace(/(?:\s|<rgb\s*:\s*|>)/g, "");
      var splitAry = procString.split(/,/);

      for(var i=0; i<splitAry.length; i++){
          splitAry[i] = Number(splitAry[i]);
      }
      if (incldAlpha == true){
          splitAry[splitAry.length] = 1;
      }
      return splitAry;
}


//  $.writeln(hex_AEclrAry("#00FF88", true));
function hex_clrAry(inHex, incldAlpha){
      var hex = inHex.replace(/#/, "");   // Strip out Hex if present
      var outClr;
      if(/^([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
          outClr= hex.substring(1).split('');
          if(outClr.length== 3){
              outClr= [outClr[0], outClr[0], outClr[1], outClr[1], outClr[2], outClr[2]];
          }
          outClr= '0x'+outClr.join('');

          if (incldAlpha){outClr = [(outClr>>16)&255, (outClr>>8)&255, outClr&255, 1];
          }else{outClr = [(outClr>>16)&255, (outClr>>8)&255, outClr&255];}
          for(var i = 0; i < outClr.length; i++){
              outClr[i] = outClr[i] / 255.0;
          }
          return outClr;
      }
      return false;
}

//  $.writeln(stndrdClrs_clrAry("red", incldAlpha= true));
function stndrdClrs_clrAry(inName, incldAlpha){
      //  "black", "white", "red", "green", "blue", "yellow", "cyan", "magenta", "lime green", "purple", "orange", "light blue", "light green", "hot pink"
      //  "10%gray", "20%gray", "30%gray", "40%gray", "50%gray", "60%gray", "70%gray", "80%gray", "90%gray"
      var outAry =[];

      if(/[Bb][Ll][Aa]?[Cc]?[Kk]/.test(inName)){                                            outAry = [0, 0, 0];        //  black
      }else if(/[Ww][Hh]?[Ii]?[Tt][Ee]?/.test(inName)){                                     outAry = [1, 1, 1];        //  white
      }else if(/[Rr][Ee]?[Dd]/.test(inName)){                                               outAry = [1, 0, 0];        //  red
      }else if(/[Gg][Rr][Ee]?[Ee]?[Nn]/.test(inName)){                                      outAry = [0, 1, 0];        //  green
      }else if(/[Bb][Ll][Uu]?[Ee]?/.test(inName)){                                          outAry = [0, 0, 1];        //  blue
      }else if(/[Yy][Ee]?[Ll][Ll]?[Oo]?[Ww]?/.test(inName)){                                outAry = [1, 1, 0];        //  yellow
      }else if(/[Cc][Yy][Aa][Nn]/.test(inName)){                                            outAry = [0, 1, 1];        //  cyan
      }else if(/[Mm][Aa]?[Gg][Ee]?[Nn]?[Tt]?[Aa]?/.test(inName)){                           outAry = [1, 0, 1];        //  magenta
      }else if(/[Ll][Ii]?[Mm][Ee]?\s?[Gg][Rr][Ee]?[Ee]?[Nn]/.test(inName)){                 outAry = [.5, 1, 0];       //  lime green
      }else if(/[Pp][Uu]?[Rr][Pp][Ll]?[Ee]?/.test(inName)){                                 outAry = [.5, 0, 1];       //  purple
      }else if(/[Oo][Rr][Aa]?[Nn][Gg]?[Ee]?/.test(inName)){                                 outAry = [1, .5, 0];       //  orange
      }else if(/[Ll][Ii]?[Gg]?[Hh]?[Tt][Ee]?\s?[Bb][Ll][Uu]?[Ee]?/.test(inName)){           outAry = [0, .5, 1];       //  light blue
      }else if(/[Ll][Ii]?[Gg]?[Hh]?[Tt][Ee]?\s?[Gg][Rr][Ee]?[Ee]?[Nn]/.test(inName)){       outAry = [0, 1, .5];       //  light green
      }else if(/[Hh][Oo]?[Tt]\s?[Pp][Ii]?[Nn][Kk]?/.test(inName)){                          outAry = [1, 0, .5];       //  hot pink
      }else if(/10?%?\s?[Gg][Rr]?(?:[Aa]|[Ee])?[Yy]/.test(inName)){                          outAry = [.1, .1, .1];     //  10% Gray
      }else if(/20?%?\s?[Gg][Rr]?(?:[Aa]|[Ee])?[Yy]/.test(inName)){                          outAry = [.2, .2, .2];     //  20% Gray
      }else if(/30?%?\s?[Gg][Rr]?(?:[Aa]|[Ee])?[Yy]/.test(inName)){                          outAry = [.3, .3, .3];     //  30% Gray
      }else if(/40?%?\s?[Gg][Rr]?(?:[Aa]|[Ee])?[Yy]/.test(inName)){                          outAry = [.4, .4, .4];     //  40% Gray
      }else if(/60?%?\s?[Gg][Rr]?(?:[Aa]|[Ee])?[Yy]/.test(inName)){                          outAry = [.6, .6, .6];     //  60% Gray
      }else if(/70?%?\s?[Gg][Rr]?(?:[Aa]|[Ee])?[Yy]/.test(inName)){                          outAry = [.7, .7, .7];     //  70% Gray
      }else if(/80?%?\s?[Gg][Rr]?(?:[Aa]|[Ee])?[Yy]/.test(inName)){                          outAry = [.8, .8, .8];     //  80% Gray
      }else if(/90?%?\s?[Gg][Rr]?(?:[Aa]|[Ee])?[Yy]/.test(inName)){                          outAry = [.9, .9, .9];     //  90% Gray
      }else if(/5?0?%?\s?[Gg][Rr]?(?:[Aa]|[Ee])?[Yy]/.test(inName)){                         outAry = [.5, .5, .5];     //  50% Gray    //last as default grey
      }else{    return false;   }

      if(incldAlpha == true){
          outAry[outAry.length] = 1;
      }

      return outAry;
}
