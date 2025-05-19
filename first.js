function doGet(e) {
  const callback = e && e.parameter && e.parameter.callback;
  if (!callback) {
    // No callback parameter - just return JSON normally (or a message)
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leaderboard3");
    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
    const json = data.map((row, index) => ({
      rank: index + 1,
      name: row[0],
      score: row[1]
    }));
    return ContentService.createTextOutput(JSON.stringify(json))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // If callback present - return JSONP wrapped response
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leaderboard3");
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
  const json = data.map((row, index) => ({
    rank: index + 1,
    name: row[0],
    score: row[1]
  }));
  const output = callback + '(' + JSON.stringify(json) + ')';
  return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JAVASCRIPT);
}
