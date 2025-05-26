function doGet(e) {
  const employeeId = e.parameter.employeeId;
  if (!employeeId) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Employee ID is required." }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leaderboard3");
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);

    let empDetails = null;
    let totalEmployees = rows.length;

    for (let i = 0; i < rows.length; i++) {
      const id = String(rows[i][4]).toLowerCase(); // employee_ID in column 5 (index 4)
      if (id === employeeId.toLowerCase()) {
        empDetails = {
          name: rows[i][0],       // full_name
          arpu: rows[i][1],       // ARPU
          state: rows[i][3],      // state
          rank: (i + 1) + " out of " + totalEmployees  // Rank based on row position
        };
        break;
      }
    }

    if (!empDetails) {
      return ContentService.createTextOutput(JSON.stringify({ error: "Employee not found!" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify(empDetails))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
