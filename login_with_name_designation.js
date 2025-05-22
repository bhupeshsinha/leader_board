const SHEET_NAME_ = "OTP";  // Sheet with phone, name, otp, expiry, designation
const OTP_EXPIRY_MINUTES_ = 5;

/**
 * Serves the login HTML page.
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('login_with_name_designation1')
    .setTitle('Login')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Sends OTP to the phone number if it's registered in Column A.
 * Stores the OTP and expiry time in the sheet.
 */
function sendOTP(phone) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_);
  if (!sheet) {
    Logger.log("Sheet not found");
    return "error";
  }

  const contactNumbers = sheet.getRange("A2:A" + sheet.getLastRow()).getValues().flat();

  // Only send OTP if phone exists in Column A
  if (!contactNumbers.includes(phone)) {
    return "unregistered";
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(new Date().getTime() + OTP_EXPIRY_MINUTES_ * 60000);

  const data = sheet.getDataRange().getValues();
  let foundRow = -1;

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == phone) {
      foundRow = i + 1;
      break;
    }
  }

  if (foundRow > 0) {
    sheet.getRange(foundRow, 3).setValue(otp);     // Column C: OTP
    sheet.getRange(foundRow, 4).setValue(expiry);  // Column D: Expiry
    sheet.getRange(foundRow, 4).setNumberFormat("yyyy-MM-dd HH:mm:ss");
  } else {
    sheet.appendRow([phone, "", otp, expiry, ""]);  // If new, append row with placeholders
  }

  Logger.log(`OTP for ${phone}: ${otp} (expires at ${expiry})`);
  return "sent";
}

/**
 * Verifies the OTP for a given phone number and returns name/designation.
 */
function verifyOTP(phone, otp) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_);
  if (!sheet) return { status: "false" };

  const data = sheet.getDataRange().getValues();
  const now = new Date();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == phone) {
      const storedOTP = data[i][2];  // Column C: OTP
      const expiryTime = new Date(data[i][3]);  // Column D: Expiry

      if (storedOTP && storedOTP.toString() === otp.toString() && now <= expiryTime) {
        const name = data[i][4] || "";         // Column B: Name
        const designation = data[i][1] || "";  // Column E: Designation

        // Optional: clear OTP and expiry after successful login
        // sheet.getRange(i + 1, 3).clearContent();  // Clear OTP
        // sheet.getRange(i + 1, 4).clearContent();  // Clear Expiry

        return {
          status: "true",
          name: name,
          designation: designation
        };
      }
    }
  }

  return { status: "false" };
}
