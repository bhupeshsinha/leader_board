// function doGet(e) {
//   const empId = e.parameter.empId;
//   if (!empId) {
//     return ContentService.createTextOutput(JSON.stringify({ error: 'No Employee ID provided.' }))
//       .setMimeType(ContentService.MimeType.JSON);
//   }

//   const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leaderboard3");
//   const data = sheet.getDataRange().getValues().slice(1); // skip header

//   const leaderboard = data
//     .map(row => ({ name: row[0], arpu: Number(row[1]), designation: row[2], state: row[3], employee_ID: row[4] }))
//     .sort((a, b) => b.arpu - a.arpu);

//   const details = leaderboard.find((item) => item.employee_ID == empId);
//   if (!details) {
//     return ContentService.createTextOutput(JSON.stringify({ error: 'Employee not found.' }))
//       .setMimeType(ContentService.MimeType.JSON);
//   }

//   const rank = leaderboard.findIndex(item => item.employee_ID == empId) + 1;
//   details.rank = rank;

//   const top10 = leaderboard.slice(0, 10).map(item => ({
//     name: item.name,
//     arpu: item.arpu
//   }));

//   const response = {
//     details,
//     leaderboard: top10
//   };

//   return ContentService.createTextOutput(JSON.stringify(response))
//     .setMimeType(ContentService.MimeType.JSON);
// }


function doGet(e) {
  const empId = e.parameter.empId;
  if (!empId) {
    return ContentService.createTextOutput(JSON.stringify({ error: 'No Employee ID provided.' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leaderboard3");
  const data = sheet.getDataRange().getValues().slice(1); // skip header

  const leaderboard = data
    .map(row => ({ name: row[0], arpu: Number(row[1]), designation: row[2], state: row[3], employee_ID: row[4] }))
    .sort((a, b) => b.arpu - a.arpu);

  const total = leaderboard.length;  // 👈 Get the total number of participants

  const details = leaderboard.find((item) => item.employee_ID == empId);
  if (!details) {
    return ContentService.createTextOutput(JSON.stringify({ error: 'Employee not found.' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const rank = leaderboard.findIndex(item => item.employee_ID == empId) + 1;
  details.rank = rank;
  details.total = total;  // 👈 Add total to the details

  const top10 = leaderboard.slice(0, 10).map(item => ({
    name: item.name,
    arpu: item.arpu
  }));

  const response = {
    details,
    leaderboard: top10
  };

  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}
