// var btnReturn = simpleDialog({title: "This Title", msg: "This is the message", drpDnAry: ["a", "b", "c"], drpDnDfltInd: 0, chckBxNameAry: ["1st Checkbox Option", "2nd Checkbox Option", "3rd Checkbox Option"], chckBxDfltValAry: [true, true, false], edtTxt: "Trump Is My High Lord & Chief", txtMltLn: true, btnsNameAry: ["A", "B", "C", "D"], btnDflt: 4, btnScnd: 2});   // Designate default hilighted button
// // var btnReturn = simpleDialog({title: "This Title", msg: "This is the message.\nThis is the Second Line of the Message", btnsNameAry: ["C", "D", "E"], btnDflt: 2, btnScnd: 1});
//
// if(btnReturn != null){
//       $.writeln("dropdown text\t"+ btnReturn.drpDnText);
//       $.writeln("dropdown index\t"+ btnReturn.drpDnInd);
//       $.writeln("chckBxValAry\t"+ btnReturn.chckBxValAry.join());
//       $.writeln("edit text\t"+ btnReturn.edtTxt);
//       $.writeln("button number\t"+ btnReturn.num);
//       $.writeln("button name\t"+ btnReturn.name);
// }else{
//       $.writeln("No Return");
// }

function simpleDialog(varObj){
      var title= "", msg= "", drpDnAry= null, drpDnDfltInd= null, edtTxt= null, chckBxNameAry= [], chckBxDfltValAry= [], btnsNameAry= [], btnDflt= null, btnScnd= null;
      try{      if (typeof varObj.title === "string"){title = varObj.title;}     }catch(err){}
      try{      if (typeof varObj.msg === "string"){msg = varObj.msg;}     }catch(err){}
      try{      if (varObj.drpDnAry instanceof Array){
            drpDnAry = varObj.drpDnAry;
            try{      if ((isNaN(varObj.drpDnDfltInd) == false) && (varObj.drpDnDfltInd < drpDnAry.length)){drpDnDfltInd= varObj.drpDnDfltInd;}     }catch(err){}
      }}catch(err){}
      try{      if (varObj.chckBxNameAry instanceof Array){  chckBxNameAry = varObj.chckBxNameAry;  }}catch(err){}
      try{      if (varObj.chckBxDfltValAry instanceof Array){  chckBxDfltValAry = varObj.chckBxDfltValAry;  }}catch(err){}
      try{      if (typeof varObj.edtTxt === "string"){edtTxt = varObj.edtTxt;}     }catch(err){}
      try{      if (typeof varObj.txtMltLn !== "boolean"){varObj.txtMltLn = false;}     }catch(err){}
      try{      if (varObj.btnsNameAry instanceof Array){
            btnsNameAry = varObj.btnsNameAry;
            try{      if ((isNaN(varObj.btnDflt) == false) && (varObj.btnDflt <= btnsNameAry.length)){btnDflt= varObj.btnDflt; }     }catch(err){}
            try{      if ((isNaN(varObj.btnScnd) == false) && (varObj.btnScnd <= btnsNameAry.length)){btnScnd= varObj.btnScnd; }     }catch(err){}
      }}catch(err){}
      if(varObj.spcSize == undefined){  varObj.spcSize = "80"; }
      if(varObj.textWidth == undefined){  varObj.textWidth = "300"; }

      var btnNum = null, chckBxValAry= [], drpDnText= "", drpDnInd= null, edtTxtRtrn= "";
      simpleDialogPre();

      if (btnNum != null){
          return {num: (btnNum+1), name: btnsNameAry[btnNum], drpDnText: drpDnText, drpDnInd: drpDnInd, chckBxValAry: chckBxValAry, edtTxt: edtTxtRtrn};
      }else{
          return null;
      }

      function simpleDialogPre(){
            var thisDialog = new Window ("dialog", title);
            msg = msg.replace("\n", "\\n"); msg = msg.replace("\r", "\\r");
            var dialogString =
                    "Group { \
                        orientation: 'column', \
                        alignment: ['right','top'], \
                        alignChildren: ['right','top'],";
                    if(msg.length > 0){
                        dialogString +="stcGrp: Group{staticText: StaticText {text:'" + msg + "', preferredSize:[" + varObj.textWidth + ", -1], properties: {multiline:true}}, spcText: StaticText {text:'\t\t', preferredSize:[" + varObj.spcSize + ", -1]}}";
                    }

                    if(edtTxt != null){
                        dialogString +="edtGrp: Group{\
                              orientation: 'row',";
                        dialogString += "editText: EditText {text:'" + edtTxt + "', alignment: ['fill','top'], properties: {multiline:" + varObj.txtMltLn + "}}, spcText: StaticText {text:'\t\t', preferredSize:[" + varObj.spcSize + ", -1]}}";
                    }

                    if(drpDnAry != null){
                        dialogString +="drpDnGrp: Group{\
                              orientation: 'row',";
                        var drpDnString = ""
                        for(var i=0; i<drpDnAry.length; i++){
                            drpDnString += "'" + drpDnAry[i] + "'";
                            if (i != (drpDnAry.length-1)){
                                drpDnString += " ,";
                            }
                        }
                        dialogString += "drpDn: DropDownList{properties:{items:[" + drpDnString + "]}}, spcText: StaticText {text:'\t\t', preferredSize:[" + varObj.spcSize + ", -1]}}";
                    }

                    if(chckBxNameAry.length != 0){
                        dialogString +="chckBxGrp: Group{\
                              orientation: 'column',";
                        for(var i=0; i<chckBxNameAry.length; i++){
                            dialogString +="checkboxGrp"+ i +": Group{orientation: 'row',";
                            dialogString += "checkbox :Checkbox{text:''}";
                            dialogString += "checkboxText: StaticText {text:'" + chckBxNameAry[i] + "'}, spcText: StaticText {text:'\t\t', preferredSize:[" + varObj.spcSize + ", -1]}";
                            dialogString += "}";
                        }
                        dialogString += "}";
                    }

                    dialogString +="btnGrp: Group{orientation: 'row'}}";

            var diaGrp = thisDialog.add(dialogString);

            var btnGuiAry = [];
            for(var i=0; i<btnsNameAry.length; i++){
                if(btnDflt == (i+1)){
                    btnGuiAry[i] = diaGrp.btnGrp.add ("button", undefined, btnsNameAry[i], {name: "ok"});
                }else if(btnScnd == (i+1)){
                    btnGuiAry[i] = diaGrp.btnGrp.add ("button", undefined, btnsNameAry[i]);
                    btnGuiAry[i].active = true;
                }else{
                    btnGuiAry[i] = diaGrp.btnGrp.add ("button", undefined, btnsNameAry[i]);
                }
            }

            if((drpDnAry instanceof Array) && (drpDnAry.length > 0)){
                diaGrp.drpDnGrp.drpDn.selection = drpDnDfltInd;
            }

            for(var i=0; i<chckBxDfltValAry.length; i++){
                if (i >= chckBxNameAry.length+1){ break; }
                diaGrp.chckBxGrp["checkboxGrp"+ i].checkbox.value = chckBxDfltValAry[i];
            }

            for(var i=0; i<btnsNameAry.length; i++){
                btnGuiAry[i].onClick = function (){
                    btnNum = aryIndexOf(btnsNameAry, this.text);

                    if((typeof edtTxt === "string") && (edtTxt.length > 0)){
                        edtTxtRtrn = diaGrp.edtGrp.editText.text;
                    }
                    if((drpDnAry instanceof Array) && (drpDnAry.length > 0)){
                        drpDnInd = Number(diaGrp.drpDnGrp.drpDn.selection);
                        if (drpDnInd != null){
                            drpDnText = drpDnAry[drpDnInd];
                        }else{
                            drpDnText = "";
                        }
                    }
                    if((chckBxNameAry instanceof Array) && (chckBxNameAry.length > 0)){
                        for(var i=0; i<chckBxNameAry.length; i++){
                            chckBxValAry[i] = diaGrp.chckBxGrp["checkboxGrp"+ i].checkbox.value;
                        }
                    }
                    // thisDialog.hide();
                    thisDialog.close();
                    return;
                }
            }

            thisDialog.show ();
      }
      function aryIndexOf(inAry, chckItem){
          for(var i=0; i<inAry.length; i++){
              if (inAry[i] == chckItem){
                return i;
              }
          }
          return -1
      }
}
