var graphicSheetId = "1NjS7gYkVl1slk0IMI-4-mziJFcRoIz-0dEF1hPXu-tI";
var graphicList;

function getGraphicList() {
  if (graphicList!=undefined)
    return graphicList
  let sheetS = SpreadsheetApp.openById(graphicSheetId);
  let allListsArr = sheetS.getSheets();
  for (let i=0;i<allListsArr.length;i++)
    if ( MainLibrary.containsWord( allListsArr[i].getName(), "График") ){
      graphicList = allListsArr[i]
      return graphicList
    }
}
function getEmployeesFromGraphic(){
  let graphicList = getGraphicList();
  let firstRow = 9;
  let fioColumn = 2;
  let rowsCount = graphicList.getLastRow() - firstRow + 1
  let graphicListRange = graphicList.getRange(firstRow,fioColumn,rowsCount).getValues();
  let fioArr = [];
  for (let i=0;i<graphicListRange.length;i++)
    if (graphicListRange[i][0]!="")
      fioArr.push(graphicListRange[i][0])
  return fioArr
}


