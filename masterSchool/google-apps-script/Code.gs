/**
 * =========================================================================
 * ប្រព័ន្ធគ្រប់គ្រងសិស្ស - Google Apps Script Backend (Student Management API)
 * =========================================================================
 * 
 * ឯកសារនេះត្រូវយកទៅដាក់ក្នុង Google Sheet:
 * 1. បើក Google Sheet ថ្មីមួយ
 * 2. ចុច Extensions (ផ្នែកបន្ថែម) -> Apps Script
 * 3. លុបកូដចាស់ចោល រួច Copy & Paste កូដទាំងអស់នេះចូល
 * 4. ជ្រើសរើសមុខងារ 'setupDatabase' រួចចុច 'Run' ដើម្បីបង្កើតតារាង និង Folder រូបភាពស្វ័យប្រវត្តិ
 * 5. ចុច Deploy -> New deployment -> Select type 'Web app'
 *    - Execute as: Me (គណនីរបស់អ្នក)
 *    - Who has access: Anyone (អ្នកណាក៏ដោយ)
 * 6. Copy យក Web App URL ទៅដាក់ក្នុង Settings លើ Web UI
 */

const SHEET_NAME = "Students";
const PHOTO_FOLDER_NAME = "MasterSchool_Student_Photos";

/**
 * មុខងារ Setup Database ដំបូងសម្រាប់បង្កើតតារាង និង Folder រូបភាព
 */
function setupDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  } else {
    sheet.clear();
  }
  
  // ក្បាលតារាង (Header Columns)
  const headers = [
    "ID",             // អត្តលេខសិស្ស (STU-1001)
    "NameKh",         // ឈ្មោះជាភាសាខ្មែរ
    "NameEn",         // ឈ្មោះជាអក្សរឡាតាំង
    "Gender",         // ភេទ (ប្រុស / ស្រី)
    "Dob",            // ថ្ងៃខែឆ្នាំកំណើត (YYYY-MM-DD)
    "Phone",          // លេខទូរស័ព្ទសិស្ស
    "GuardianPhone",  // លេខទូរស័ព្ទអាណាព្យាបាល
    "Grade",          // ថ្នាក់/កម្រិត (Grade 7, Grade 12, etc.)
    "Shift",          // វេនសិក្សា (ព្រឹក / ថ្ងៃ / រសៀល)
    "Status",         // ស្ថានភាព (Active, Inactive, Graduated)
    "Address",        // អាសយដ្ឋាន/ខេត្ត
    "Avatar",         // Link រូបថត (Google Drive Thumbnail / Direct URL)
    "CreatedAt"       // កាលបរិច្ឆេទចុះឈ្មោះ
  ];
  
  sheet.appendRow(headers);
  
  // រៀបចំ Style ក្បាលតារាងឱ្យស្រស់ស្អាត
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#2563eb");
  headerRange.setFontColor("#ffffff");
  headerRange.setFontWeight("bold");
  headerRange.setFontSize(11);
  headerRange.setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
  
  // បង្កើត Folder MasterSchool_Student_Photos ក្នុង Google Drive សម្រាប់ផ្ទុករូបភាព
  try {
    const folders = DriveApp.getFoldersByName(PHOTO_FOLDER_NAME);
    if (!folders.hasNext()) {
      const newFolder = DriveApp.createFolder(PHOTO_FOLDER_NAME);
      newFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      Logger.log("📁 បានបង្កើត Folder ផ្ទុករូបភាព: " + PHOTO_FOLDER_NAME);
    }
  } catch (err) {
    Logger.log("Drive folder notice: " + err);
  }
  
  // ទិន្នន័យគំរូដំបូងក្នុង Google Sheet
  const sampleStudents = [
    ["STU-1001", "ចាន់ សុខា", "Chan Sokha", "ប្រុស", "2006-05-12", "012 345 678", "098 765 432", "ថ្នាក់កុំព្យូទ័រ", "ព្រឹក", "Active", "រាជធានីភ្នំពេញ", "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200", Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd")],
    ["STU-1002", "កែវ ធីតា", "Keo Thida", "ស្រី", "2007-08-23", "088 123 456", "011 223 344", "ថ្នាក់ភាសាអង់គ្លេស", "ព្រឹក", "Active", "ខេត្តសៀមរាប", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200", Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd")],
    ["STU-1003", "សេង រតនា", "Seng Rathana", "ប្រុស", "2008-01-15", "077 987 654", "085 445 566", "ថ្នាក់កុំព្យូទ័រ", "រសៀល", "Active", "ខេត្តបាត់ដំបង", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200", Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd")],
    ["STU-1004", "លឹម ស្រីនី", "Lim Sreyny", "ស្រី", "2006-11-30", "096 555 432", "016 778 899", "ថ្នាក់ភាសាអង់គ្លេស", "ព្រឹក", "Active", "ខេត្តកណ្តាល", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200", Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd")],
    ["STU-1005", "ម៉ៅ វិបុល", "Mao Vibul", "ប្រុស", "2007-04-18", "070 332 211", "092 112 233", "ថ្នាក់កុំព្យូទ័រ", "យប់", "Inactive", "ខេត្តកំពង់ចាម", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200", Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd")]
  ];
  
  sampleStudents.forEach(row => sheet.appendRow(row));
  
  // Auto fit columns
  for (let i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
  
  Logger.log("✅ បានបង្កើតតារាងទិន្នន័យសិស្ស និងរូបភាពក្នុង Google Sheets រួចរាល់!");
}

/**
 * ទទួល HTTP GET Request ពី Web App (Dynamic Real-time Fetching)
 */
function doGet(e) {
  try {
    const params = e ? e.parameter : {};
    const action = params.action || "getStudents";
    
    if (action === "getStudents") {
      const students = getAllStudents();
      return jsonResponse({
        success: true,
        count: students.length,
        data: students,
        timestamp: new Date().toISOString()
      });
    }
    
    if (action === "getStats") {
      const stats = calculateStats();
      return jsonResponse({ success: true, data: stats });
    }
    
    return jsonResponse({ success: true, message: "Google Sheets Student API is active." });
  } catch (error) {
    return jsonResponse({ success: false, error: error.toString() });
  }
}

/**
 * ទទួល HTTP POST Request ពី Web App (បង្កើត, កែប្រែ, លុប, រក្សាទុករូបភាព)
 */
function doPost(e) {
  try {
    let payload = {};
    if (e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (err) {
        payload = e.parameter || {};
      }
    } else {
      payload = e.parameter || {};
    }
    
    const action = payload.action;
    
    if (action === "createStudent") {
      const newStudent = addStudent(payload.data);
      return jsonResponse({
        success: true,
        message: "បានរក្សាទុកទិន្នន័យ និងរូបភាពក្នុង Google Sheet ជោគជ័យ!",
        data: newStudent
      });
    }
    
    if (action === "updateStudent") {
      const updated = updateStudent(payload.data);
      return jsonResponse({
        success: true,
        message: "បានកែប្រែទិន្នន័យក្នុង Google Sheet ជោគជ័យ!",
        data: updated
      });
    }
    
    if (action === "deleteStudent") {
      const deletedId = deleteStudent(payload.id);
      return jsonResponse({
        success: true,
        message: "បានលុបទិន្នន័យសិស្សពី Google Sheet ជោគជ័យ!",
        id: deletedId
      });
    }
    
    return jsonResponse({ success: false, error: "មិនស្គាល់ Action: " + action });
  } catch (error) {
    return jsonResponse({ success: false, error: error.toString() });
  }
}

/**
 * មុខងាររក្សាទុករូបភាព Base64 ចូលទៅកាន់ Google Drive
 * និងបង្កើតជា Direct URL ដើម្បីផ្ទុកក្នុង Google Sheets
 */
function saveImageToDrive(base64Data, studentId) {
  if (!base64Data || typeof base64Data !== "string") {
    return "";
  }
  
  // ប្រសិនបើជា URL ស្រាប់ (https://...) មិនបាច់បម្លែងទេ
  if (!base64Data.startsWith("data:image")) {
    return base64Data;
  }
  
  try {
    const parts = base64Data.split(",");
    const meta = parts[0];
    const base64Content = parts[1];
    
    let contentType = "image/jpeg";
    if (meta.includes("png")) contentType = "image/png";
    else if (meta.includes("webp")) contentType = "image/webp";
    
    const decodedBytes = Utilities.base64Decode(base64Content);
    const fileName = `student_${studentId || 'new'}_${new Date().getTime()}.${contentType.split("/")[1]}`;
    const blob = Utilities.newBlob(decodedBytes, contentType, fileName);
    
    // ស្វែងរក ឬបង្កើត Folder MasterSchool_Student_Photos
    const folders = DriveApp.getFoldersByName(PHOTO_FOLDER_NAME);
    let folder;
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(PHOTO_FOLDER_NAME);
    }
    
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    // Direct link ដែលអាច render បានលើ Web និង Google Sheet
    const fileId = file.getId();
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w500`;
  } catch (err) {
    Logger.log("⚠️ Drive image upload error: " + err.toString());
    // ប្រសិនបើ Drive គ្មានសិទ្ធិ វានឹងរក្សាទុកក្នុង Google Sheet តាម DataURL
    return base64Data;
  }
}

/**
 * មុខងារទាញយកទិន្នន័យសិស្សទាំងអស់ពី Google Sheet (Dynamic Live Data)
 */
function getAllStudents() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    setupDatabase();
    sheet = ss.getSheetByName(SHEET_NAME);
  }
  
  const range = sheet.getDataRange();
  const data = range.getValues();
  const formulas = range.getFormulas();
  if (data.length <= 1) return [];
  
  const headers = data[0];
  const rows = data.slice(1);
  const formulaRows = formulas.slice(1);
  
  return rows.map((row, rIndex) => {
    let student = {};
    headers.forEach((header, index) => {
      let val = row[index];
      let formula = formulaRows[rIndex] ? formulaRows[rIndex][index] : "";
      
      // ប្រសិនបើ Cell ប្រើរូបមន្ត =IMAGE("url") ឬ =HYPERLINK("url")
      if ((!val || typeof val !== "string" || !val.trim()) && formula) {
        const imageMatch = formula.match(/IMAGE\s*\(\s*["']([^"']+)["']/i);
        if (imageMatch) val = imageMatch[1];
        const linkMatch = formula.match(/HYPERLINK\s*\(\s*["']([^"']+)["']/i);
        if (linkMatch) val = linkMatch[1];
      }
      
      if (val instanceof Date) {
        val = Utilities.formatDate(val, Session.getScriptTimeZone(), "yyyy-MM-dd");
      }
      student[header] = val !== undefined && val !== null ? String(val).trim() : "";
    });
    return student;
  });
}

/**
 * បន្ថែមសិស្សថ្មីចូល Google Sheet និងរក្សាទុករូបភាព
 */
function addStudent(studentData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  
  // បង្កើត ID ស្វ័យប្រវត្តិ បើគ្មាន
  if (!studentData.ID) {
    const totalRows = sheet.getLastRow();
    studentData.ID = "STU-" + (1000 + totalRows);
  }
  
  if (!studentData.CreatedAt) {
    studentData.CreatedAt = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  
  // រក្សាទុករូបភាពទៅកាន់ Google Drive / Google Sheet
  if (studentData.Avatar && studentData.Avatar.startsWith("data:image")) {
    studentData.Avatar = saveImageToDrive(studentData.Avatar, studentData.ID);
  }
  
  const newRow = [
    studentData.ID || "",
    studentData.NameKh || "",
    studentData.NameEn || "",
    studentData.Gender || "ប្រុស",
    studentData.Dob || "",
    studentData.Phone || "",
    studentData.GuardianPhone || "",
    studentData.Grade || "",
    studentData.Shift || "ព្រឹក",
    studentData.Status || "Active",
    studentData.Address || "",
    studentData.Avatar || "",
    studentData.CreatedAt
  ];
  
  sheet.appendRow(newRow);
  return studentData;
}

/**
 * កែប្រែទិន្នន័យសិស្ស និងរូបភាពក្នុង Google Sheet
 */
function updateStudent(studentData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  const targetId = String(studentData.ID).trim();
  let targetRowIndex = -1;
  
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === targetId) {
      targetRowIndex = i + 1; // 1-indexed for Sheet
      break;
    }
  }
  
  if (targetRowIndex === -1) {
    throw new Error("រកមិនឃើញសិស្សដែលមាន ID: " + targetId);
  }
  
  // រក្សាទុករូបភាពថ្មីទៅកាន់ Google Drive បើមាន
  if (studentData.Avatar && studentData.Avatar.startsWith("data:image")) {
    studentData.Avatar = saveImageToDrive(studentData.Avatar, studentData.ID);
  }
  
  const updatedRow = [
    studentData.ID,
    studentData.NameKh || "",
    studentData.NameEn || "",
    studentData.Gender || "ប្រុស",
    studentData.Dob || "",
    studentData.Phone || "",
    studentData.GuardianPhone || "",
    studentData.Grade || "",
    studentData.Shift || "ព្រឹក",
    studentData.Status || "Active",
    studentData.Address || "",
    studentData.Avatar || "",
    studentData.CreatedAt || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd")
  ];
  
  sheet.getRange(targetRowIndex, 1, 1, updatedRow.length).setValues([updatedRow]);
  return studentData;
}

/**
 * លុបទិន្នន័យសិស្សពី Google Sheet
 */
function deleteStudent(id) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  const targetId = String(id).trim();
  let targetRowIndex = -1;
  
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === targetId) {
      targetRowIndex = i + 1;
      break;
    }
  }
  
  if (targetRowIndex === -1) {
    throw new Error("រកមិនឃើញសិស្សដែលមាន ID: " + targetId);
  }
  
  sheet.deleteRow(targetRowIndex);
  return id;
}

/**
 * គណនាស្ថិតិសម្រាប់ Dashboard
 */
function calculateStats() {
  const students = getAllStudents();
  const total = students.length;
  let male = 0;
  let female = 0;
  let active = 0;
  let inactive = 0;
  let gradeCounts = {};
  
  students.forEach(s => {
    if (s.Gender === "ប្រុស" || s.Gender === "Male") male++;
    if (s.Gender === "ស្រី" || s.Gender === "Female") female++;
    if (s.Status === "Active") active++;
    else inactive++;
    
    const grade = s.Grade || "ផ្សេងៗ";
    gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
  });
  
  return {
    total,
    male,
    female,
    active,
    inactive,
    gradeCounts
  };
}

/**
 * ជំនួយការបង្កើត JSON Response ជាមួយ CORS Headers
 */
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
