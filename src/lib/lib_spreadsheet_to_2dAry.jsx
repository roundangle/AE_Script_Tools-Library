function Spreadsheet_to_2dAry(file, options){
  //  options
  //  .separatorSymbol  default--> ","
  //  .encoding         default--> "utf-8"


  function loadCsvFromFile(file, options){
    function parseCSVString(csvString, options){
      options = options || {};
      var separatorSymbol =  options.separatorSymbol || ",";

      var currentRow = 0;
      var currentColumn = -1;  // will be increased to 0 during first loop iteration
      var thisCell = "";
      var i;
      var token;
      var cellStart = true;
      var insideQuote;

      function nextTokenLookAhead(){
        var nextTokenId = i+1;
        return (nextTokenId <csvString.length ? csvString[nextTokenId]: "");
      }

      function processLineBreak(){
        addCSVCellToData(thisCell, currentRow, currentColumn);
        cellStart = true;
        currentRow++;
        currentColumn = -1;
      }

      function processCellStart(){
        thisCell="";
        currentColumn++;
        insideQuote = (token == '"');
        if(insideQuote) {
          i++;
          token = csvString[i];
        }
        cellStart = false;
      }

      for(i=0; i<csvString.length; i++){
        token = csvString[i];
        if(cellStart){
          processCellStart();
        }

        if(!insideQuote && token == separatorSymbol){
          addCSVCellToData(thisCell, currentRow, currentColumn);
          cellStart = true;
        }
        else if(!insideQuote && token == "\n"){
          processLineBreak();
        }
        else if(!insideQuote && token == "\r" && nextTokenLookAhead() =="\n"){
          i++;
          processLineBreak();
        }
        else if(insideQuote && token == '"'){
          if(nextTokenLookAhead() =='"'){
            i++;
            thisCell +='"';
          }
          else {
            insideQuote = false;
          }
        }
        else {
          thisCell += token;
        }
      }
    }
    function addCSVCellToData(cellData, row, column){
      if(data === undefined){
        data =[];
      }
      if(data[row] === undefined){
        data[row] = [];
      }

      data[row][column] = cellData;
    }

    var data;
    options = options || {};
    file.encoding = options.encoding || "utf-8";
    if(!file.open("r")){
      throw new Error("could not open file: "+file.error);
    }
    var rawData = file.read();
    file.close();
    if(file.error!=="") throw new Error("could not read file:"+ file.error);

    parseCSVString(rawData, options);
    return data;
  }

  var spreadsheet = loadCsvFromFile(file, options);

  function getCell(rowId, columnId){
    return spreadsheet[rowId][columnId];
  }

  function getNumRows(){
    return spreadsheet.length;
  }

  this.getCell = getCell;
  this.getNumRows = getNumRows;
}
