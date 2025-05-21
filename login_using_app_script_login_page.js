const SHEET_NAME = "OTP";  // Your sheet name
const OTP_EXPIRY_MINUTES = 5;

function doGet() {
  // Serve the login.html page
  return HtmlService.createHtmlOutputFromFile('login')
    .setTitle('Login')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Called from client with google.script.run
function sendOTP(phone) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    Logger.log("Sheet not found");
    return "error";
  }
  
  // Example registered numbers
  const registeredNumbers = ["9049065265", "9999999999", "8888888888"];
  if (!registeredNumbers.includes(phone)) {
    return "unregistered";
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(new Date().getTime() + OTP_EXPIRY_MINUTES * 60000);

  const data = sheet.getDataRange().getValues();
  let foundRow = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == phone) {
      foundRow = i + 1;
      break;
    }
  }

  if (foundRow > 0) {
    sheet.getRange(foundRow, 2).setValue(otp);      // Col B = OTP
    sheet.getRange(foundRow, 3).setValue(expiry);   // Col C = Expiry
  } else {
    sheet.appendRow([phone, otp, expiry]);
  }

  Logger.log(`OTP for ${phone}: ${otp} (expires at ${expiry})`);
  return "sent";
}

function verifyOTP(phone, otp) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return "false";

  const data = sheet.getDataRange().getValues();
  const now = new Date();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == phone) {
      const storedOTP = data[i][1];
      const expiryTime = new Date(data[i][2]);
      if (storedOTP == otp && now <= expiryTime) {
        return "true";
      }
    }
  }

  return "false";
}
