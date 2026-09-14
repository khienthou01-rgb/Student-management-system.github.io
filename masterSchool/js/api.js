/**
 * API & Data Service - Manages Firebase Realtime Database Integration & Image Cloud Storage
 */
const StudentAPI = {
  _isFetching: false,

  // Check if Firebase is initialized
  isCloudConnected() {
    return typeof firebase !== "undefined" && firebase.apps && firebase.apps.length > 0;
  },

  // Helper to normalize student data structure consistently
  normalizeStudent(s, idx = 0) {
    if (!s) return null;
    const student = { ...s };
    const prefix = (typeof APP_CONFIG !== "undefined" && APP_CONFIG.studentIdPrefix) || "TX";

    if (!student.ID) {
      student.ID = `${prefix}-${1001 + idx}`;
    } else if (/^STU-/i.test(student.ID)) {
      student.ID = student.ID.replace(/^STU-/i, `${prefix}-`);
    }

    // MasterSchool is 100% Computer Class
    student.Grade = "ថ្នាក់កុំព្យូទ័រ";

    // Course
    let c = (student.Course || "").trim();
    if (!c || c.includes("English") || c.includes("Beginner") || c.includes("Intermediate")) {
      student.Course = "Typing";
    } else {
      const lc = c.toLowerCase();
      if (lc.includes("typing") || lc.includes("វាយ")) {
        student.Course = "Typing";
      } else if (lc === "word" || lc.includes("word")) {
        student.Course = "Microsoft Word";
      } else if (lc === "excel" || lc.includes("excel")) {
        student.Course = "Microsoft Excel";
      } else if (lc === "powerpoint" || lc.includes("powerpoint") || lc.includes("ppt")) {
        student.Course = "Microsoft PowerPoint";
      }
    }

    // Shift
    if (!student.Shift) {
      student.Shift = "ព្រឹក";
    } else if (student.Shift.includes("ព្រឹក")) {
      student.Shift = "ព្រឹក";
    } else if (student.Shift.includes("ថ្ងៃ")) {
      student.Shift = "ថ្ងៃ";
    } else if (student.Shift.includes("រសៀល") || student.Shift.includes("យប់")) {
      student.Shift = "រសៀល";
    }

    // Dates
    if (!student.StartDate) {
      student.StartDate = student.CreatedAt || "2026-09-01";
    }
    if (!student.EndDate) {
      const start = new Date(student.StartDate || "2026-09-01");
      start.setDate(start.getDate() + (APP_CONFIG.DEFAULT_COURSE_DURATION_DAYS || 45));
      student.EndDate = start.toISOString().split("T")[0];
    }

    // Status
    if (!student.Status) {
      student.Status = "Active";
    }

    // PIN
    if (!student.PIN && !student.pin) {
      student.PIN = "123";
    }

    // Avatar
    if (!student.Avatar) {
      student.Avatar = student.Gender === "ស្រី" ? "assets/images/default-female.svg" : "assets/images/default-male.svg";
    }

    return student;
  },

  // Dynamic Fetching: Pulls directly from Firebase Realtime Database
  async getStudents(forceRefresh = true) {
    let students = this.getLocalStudents();

    // If connected to Firebase, fetch live data directly from Firebase Realtime Database
    if (this.isCloudConnected()) {
      try {
        this._isFetching = true;
        const snapshot = await firebase.database().ref("students").once("value");
        const val = snapshot.val();
        
        if (val) {
          if (Array.isArray(val)) {
            students = val.filter(Boolean);
          } else if (typeof val === "object") {
            students = Object.values(val);
          }
          let needsCloudSync = false;
          const oldIdsToDelete = [];
          students = students.map((s, idx) => {
            const rawId = s && s.ID ? s.ID : "";
            if (!s.Grade || s.Grade !== "ថ្នាក់កុំព្យូទ័រ" || !s.PIN || /^STU-/i.test(rawId)) {
              needsCloudSync = true;
            }
            if (/^STU-/i.test(rawId)) {
              oldIdsToDelete.push(rawId);
            }
            return this.normalizeStudent(s, idx);
          }).filter(Boolean);

          // Always order newest students first (descending by CreatedAt and ID number)
          students.sort((a, b) => {
            const timeA = new Date(a.CreatedAt || a.StartDate || 0).getTime();
            const timeB = new Date(b.CreatedAt || b.StartDate || 0).getTime();
            if (timeB !== timeA) return timeB - timeA;
            const numA = parseInt((a.ID || "").replace(/\D/g, ""), 10) || 0;
            const numB = parseInt((b.ID || "").replace(/\D/g, ""), 10) || 0;
            return numB - numA;
          });

          this.saveLocalStudents(students);
          this._lastSyncedTime = new Date();
          console.log(`✅ ទាញទិន្នន័យពី Firebase Realtime Database ជោគជ័យ: ${students.length} នាក់`);

          // Proactively patch Firebase RTDB in the background if any record lacked Grade or needs TX- prefix migration
          if (needsCloudSync) {
            const updates = {};
            students.forEach(s => {
              updates[`students/${s.ID}`] = s;
            });
            oldIdsToDelete.forEach(oldId => {
              updates[`students/${oldId}`] = null;
            });
            firebase.database().ref().update(updates).catch(e => console.warn("Background normalization sync notice:", e));
          }

          return students;
        } else {
          // If Firebase is empty, return empty array
          this.saveLocalStudents([]);
          return [];
        }
      } catch (err) {
        console.warn("⚠️ មិនអាចទាញទិន្នន័យពី Firebase (ប្រើទិន្នន័យ Cache បណ្តោះអាសន្ន):", err);
      } finally {
        this._isFetching = false;
      }
    }

    if (!students) {
      students = [];
    }

    return students;
  },

  // Clear all students, attendance, and exam records for fresh entry
  async clearAllStudents() {
    this.saveLocalStudents([]);
    localStorage.removeItem(APP_CONFIG.STORAGE_KEY_STUDENTS);
    this.saveAllAttendance({});
    this.saveAllExams({});

    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref("students").remove();
        await firebase.database().ref("attendance").remove();
        await firebase.database().ref("exams").remove();
        console.log("✅ បានលុបទិន្នន័យសិស្សចាស់ៗទាំងអស់ពី Firebase RTDB");
      } catch (e) {
        console.warn("Firebase remove error:", e);
      }
    }
  },

  // Add new student and save to Firebase Realtime Database
  async createStudent(studentData) {
    const students = this.getLocalStudents();

    // Auto-generate ID if not yet generated
    const prefix = (typeof APP_CONFIG !== "undefined" && APP_CONFIG.studentIdPrefix) || "TX";
    if (!studentData.ID) {
      const maxIdNum = students.reduce((max, s) => {
        const match = (s && s.ID ? s.ID : "").match(/(?:TX|STU)-(\d+)/i);
        return match ? Math.max(max, parseInt(match[1], 10)) : max;
      }, 1000);
      studentData.ID = `${prefix}-${maxIdNum + 1}`;
    } else if (/^STU-/i.test(studentData.ID)) {
      studentData.ID = studentData.ID.replace(/^STU-/i, `${prefix}-`);
    }

    if (!studentData.CreatedAt) {
      studentData.CreatedAt = new Date().toISOString();
    }

    studentData = this.normalizeStudent(studentData, students.length);

    // If connected to Firebase, send directly to Firebase Realtime Database
    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`students/${studentData.ID}`).set(studentData);
        console.log(`✅ បានបញ្ចូលទិន្នន័យក្នុង Firebase RTDB: ${studentData.ID}`);
      } catch (err) {
        console.warn("⚠️ បញ្ចូលក្នុង Firebase បរាជ័យ កំពុងរក្សាទុកក្នុង Local:", err);
      }
    }

    // Update local cache
    students.unshift(studentData);
    this.saveLocalStudents(students);

    return studentData;
  },

  // Batch insert multiple students from Excel / CSV import
  async createStudentsBatch(newStudentsList) {
    if (!Array.isArray(newStudentsList) || newStudentsList.length === 0) {
      return { count: 0, students: [] };
    }

    const currentStudents = this.getLocalStudents();
    const prefix = (typeof APP_CONFIG !== "undefined" && APP_CONFIG.studentIdPrefix) || "TX";
    
    // Find current max ID
    let maxIdNum = currentStudents.reduce((max, s) => {
      const match = (s && s.ID ? s.ID : "").match(/(?:TX|STU)-(\d+)/i);
      return match ? Math.max(max, parseInt(match[1], 10)) : max;
    }, 1000);

    const processedList = [];
    const firebaseUpdates = {};

    newStudentsList.forEach((st) => {
      if (!st.ID || String(st.ID).trim() === "" || st.ID === "AUTO") {
        maxIdNum += 1;
        st.ID = `${prefix}-${maxIdNum}`;
      } else {
        if (/^STU-/i.test(st.ID)) {
          st.ID = st.ID.replace(/^STU-/i, `${prefix}-`);
        }
        const match = String(st.ID).match(/(?:TX|STU)-(\d+)/i);
        if (match) {
          maxIdNum = Math.max(maxIdNum, parseInt(match[1], 10));
        }
      }
      if (!st.CreatedAt) {
        st.CreatedAt = new Date().toISOString().split("T")[0];
      }
      const normalized = this.normalizeStudent(st, currentStudents.length + processedList.length);
      processedList.push(normalized);
      firebaseUpdates[`students/${normalized.ID}`] = normalized;
    });

    // Save locally (new students at the top)
    const merged = [...processedList, ...currentStudents];
    this.saveLocalStudents(merged);

    // Save to Firebase in a single multi-path update
    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref().update(firebaseUpdates);
        console.log(`✅ បានបញ្ចូលសិស្សជាក្រុម ${processedList.length} នាក់ ទៅក្នុង Firebase RTDB`);
      } catch (err) {
        console.warn("⚠️ Batch insert Firebase error:", err);
      }
    }

    return { count: processedList.length, students: processedList };
  },

  // Update existing student in Firebase Realtime Database
  async updateStudent(studentData) {
    const students = this.getLocalStudents();
    studentData = this.normalizeStudent(studentData);
    const index = students.findIndex(s => String(s.ID).trim() === String(studentData.ID).trim());

    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`students/${studentData.ID}`).update(studentData);
        console.log(`✅ បានកែប្រែទិន្នន័យក្នុង Firebase RTDB: ${studentData.ID}`);
      } catch (err) {
        console.warn("⚠️ កែប្រែក្នុង Firebase បរាជ័យ:", err);
      }
    }

    if (index !== -1) {
      students[index] = { ...students[index], ...studentData };
    } else {
      students.unshift(studentData);
    }
    this.saveLocalStudents(students);

    return studentData;
  },

  // Delete student from Firebase Realtime Database
  async deleteStudent(studentId) {
    let students = this.getLocalStudents();
    students = students.filter(s => String(s.ID).trim() !== String(studentId).trim());
    this.saveLocalStudents(students);

    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`students/${studentId}`).remove();
        console.log(`✅ បានលុបទិន្នន័យក្នុង Firebase RTDB: ${studentId}`);
      } catch (err) {
        console.warn("⚠️ លុបពី Firebase បរាជ័យ:", err);
      }
    }

    return studentId;
  },

  // Helper: check if a student ID is blocked / dropped out (ID cannot be used)
  isStudentIdBlocked(studentId) {
    if (!studentId) return false;
    const cleanId = String(studentId).trim().toUpperCase();
    const students = this.getLocalStudents();
    const s = students.find(st => st && String(st.ID).trim().toUpperCase() === cleanId);
    if (!s) return false;
    const status = (s.Status || "").toLowerCase();
    return s.isBlocked === true || status === "dropped" || status === "បោះបង់" || status === "បោះបង់ការសិក្សា";
  },

  // Mark student as Dropped Out (ID is locked / deactivated)
  async markStudentDropped(studentId, { dropDate, dropReason, dropNote } = {}) {
    const students = this.getLocalStudents();
    const index = students.findIndex(s => String(s.ID).trim().toUpperCase() === String(studentId).trim().toUpperCase());
    if (index === -1) throw new Error(`រកមិនឃើញសិស្សអត្តលេខ ${studentId} ឡើយ!`);

    const updated = {
      ...students[index],
      Status: "Dropped",
      isBlocked: true,
      DropDate: dropDate || new Date().toISOString().split("T")[0],
      DropReason: dropReason || "រវល់ការងារផ្ទាល់ខ្លួន",
      DropNote: dropNote || "",
      UpdatedAt: new Date().toISOString()
    };

    const result = await this.updateStudent(updated);
    return result;
  },

  // Mark student as Graduated
  async markStudentGraduated(studentId, { graduateDate, finalGrade, course, note, issueCert } = {}) {
    const students = this.getLocalStudents();
    const index = students.findIndex(s => String(s.ID).trim().toUpperCase() === String(studentId).trim().toUpperCase());
    if (index === -1) throw new Error(`រកមិនឃើញសិស្សអត្តលេខ ${studentId} ឡើយ!`);

    const updated = {
      ...students[index],
      Status: "Graduated",
      isBlocked: false,
      GraduateDate: graduateDate || new Date().toISOString().split("T")[0],
      FinalGrade: finalGrade || "ល្អ (Good)",
      GraduateNote: note || "",
      UpdatedAt: new Date().toISOString()
    };
    if (course) updated.Course = course;

    const res = await this.updateStudent(updated);

    // Auto issue certificate if requested
    if (issueCert && typeof this.issueCertificate === "function") {
      try {
        await this.issueCertificate(studentId, {
          certGrade: finalGrade || "Good",
          certDate: graduateDate || new Date().toISOString().split("T")[0]
        });
      } catch (e) {
        console.warn("Auto certificate issue warning:", e);
      }
    }

    return res;
  },

  // Reactivate a dropped student (unlock ID)
  async reactivateStudent(studentId) {
    const students = this.getLocalStudents();
    const index = students.findIndex(s => String(s.ID).trim().toUpperCase() === String(studentId).trim().toUpperCase());
    if (index === -1) throw new Error(`រកមិនឃើញសិស្សអត្តលេខ ${studentId} ឡើយ!`);

    const updated = {
      ...students[index],
      Status: "Active",
      isBlocked: false,
      ReactivatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString()
    };

    return await this.updateStudent(updated);
  },

  // Test connection to Firebase Realtime Database
  async testConnection() {
    if (!this.isCloudConnected()) {
      return { success: false, error: "Firebase មិនទាន់បាន Initialize នៅឡើយទេ!" };
    }
    try {
      const snapshot = await firebase.database().ref("students").once("value");
      const val = snapshot.val();
      let count = 0;
      if (val) {
        count = Array.isArray(val) ? val.filter(Boolean).length : Object.keys(val).length;
      }
      return { success: true, count };
    } catch (err) {
      let msg = err.message || "មិនអាចភ្ជាប់ទៅកាន់ Firebase Realtime Database បានទេ!";
      if (msg.toLowerCase().includes("permission_denied") || msg.toLowerCase().includes("permission denied")) {
        msg = "Permission Denied: សូមចូលទៅ Firebase Console -> Realtime Database -> Rules ហើយកំណត់ \".read\": true, \".write\": true";
      }
      return { success: false, error: msg };
    }
  },

  // Client-Side Image Compression
  compressImage(file, maxWidth = 480, quality = 0.82) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = (e) => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to compressed base64 JPEG
          const dataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(dataUrl);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  },

  // LocalStorage Cache
  getLocalStudents() {
    try {
      const data = localStorage.getItem(APP_CONFIG.STORAGE_KEY_STUDENTS);
      const list = data ? JSON.parse(data) : [];
      if (Array.isArray(list) && list.length > 0) {
        const students = list.map((s, idx) => this.normalizeStudent(s, idx)).filter(Boolean);
        students.sort((a, b) => {
          const timeA = new Date(a.CreatedAt || a.StartDate || 0).getTime();
          const timeB = new Date(b.CreatedAt || b.StartDate || 0).getTime();
          if (timeB !== timeA) return timeB - timeA;
          const numA = parseInt((a.ID || "").replace(/\D/g, ""), 10) || 0;
          const numB = parseInt((b.ID || "").replace(/\D/g, ""), 10) || 0;
          return numB - numA;
        });
        return students;
      }
      return [];
    } catch (e) {
      return [];
    }
  },

  saveLocalStudents(students) {
    localStorage.setItem(APP_CONFIG.STORAGE_KEY_STUDENTS, JSON.stringify(students));
  },

  // ==========================================
  // Attendance Management Service
  // ==========================================
  async fetchAttendanceCloud() {
    if (this.isCloudConnected()) {
      try {
        const snapshot = await firebase.database().ref("attendance").once("value");
        const val = snapshot.val();
        if (val && typeof val === "object") {
          const local = this.getAllAttendance();
          const merged = { ...local, ...val };
          this.saveAllAttendance(merged);
          return merged;
        }
      } catch (e) {
        console.warn("Fetch attendance from Firebase notice:", e);
      }
    }
    return this.getAllAttendance();
  },

  getAllAttendance() {
    try {
      const data = localStorage.getItem(APP_CONFIG.STORAGE_KEY_ATTENDANCE);
      if (data) return JSON.parse(data);
    } catch (e) {}

    return {};
  },

  saveAllAttendance(attendanceMap) {
    localStorage.setItem(APP_CONFIG.STORAGE_KEY_ATTENDANCE, JSON.stringify(attendanceMap));
  },

  getAttendanceForDate(dateStr) {
    const all = this.getAllAttendance();
    return all[dateStr] || {};
  },

  getAttendanceForMonth(year, month) {
    const all = this.getAllAttendance();
    const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    const result = {};
    Object.keys(all).forEach(dateStr => {
      if (dateStr.startsWith(monthPrefix)) {
        result[dateStr] = all[dateStr];
      }
    });
    return result;
  },

  async saveAttendanceForDate(dateStr, records) {
    const all = this.getAllAttendance();
    all[dateStr] = records;
    this.saveAllAttendance(all);

    // Sync to Firebase if connected
    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`attendance/${dateStr}`).set(records);
      } catch (e) {
        console.warn("Firebase attendance sync notice:", e);
      }
    }
    return records;
  },

  async saveMultipleDaysAttendance(daysRecordsMap) {
    const all = this.getAllAttendance();
    Object.assign(all, daysRecordsMap);
    this.saveAllAttendance(all);

    // Sync to Firebase if connected
    if (this.isCloudConnected()) {
      try {
        const updates = {};
        Object.keys(daysRecordsMap).forEach(d => {
          updates[`attendance/${d}`] = daysRecordsMap[d];
        });
        await firebase.database().ref().update(updates);
      } catch (e) {
        console.warn("Firebase batch attendance sync notice:", e);
      }
    }
    return all;
  },

  getStudentAttendanceSummary(studentId) {
    const all = this.getAllAttendance();
    let totalDays = 0;
    let present = 0;
    let permission = 0;
    let absent = 0;

    Object.values(all).forEach(dayRecord => {
      if (dayRecord && dayRecord[studentId]) {
        totalDays++;
        const status = dayRecord[studentId];
        if (status === "Present" || status === "វត្តមាន") present++;
        else if (status === "Permission" || status === "ច្បាប់") permission++;
        else if (status === "Absent" || status === "អវត្តមាន") absent++;
      }
    });

    const rate = totalDays > 0 ? Math.round((present / totalDays) * 100) : 100;
    return {
      totalDays,
      present,
      permission,
      absent,
      rate
    };
  },

  getLocalAttendance() {
    return [];
  },

  _generateDemoAttendance() {
    const result = {};
    const students = this.getLocalStudents();
    const studentIds = (students && students.length > 0) ? students.map(s => s.ID) : DEFAULT_STUDENTS.map(s => s.ID);
    
    // Generate recent 30 days of demo attendance for weekdays (Mon-Fri)
    const today = new Date();
    for (let i = 35; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dayOfWeek = d.getDay();
      // Skip weekends: Sunday (0) and Saturday (6)
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      const dateKey = d.toISOString().split("T")[0];
      const dayRecords = {};

      studentIds.forEach((id, idx) => {
        // High attendance rate: ~85-90% present, ~7% permission, ~3% absent
        const seed = (idx * 3 + i * 7) % 20;
        if (seed === 17) dayRecords[id] = "Permission";
        else if (seed === 19) dayRecords[id] = "Absent";
        else dayRecords[id] = "Present";
      });

      result[dateKey] = dayRecords;
    }
    return result;
  },

  async resetDemoData() {
    const demoData = [...DEFAULT_STUDENTS];
    this.saveLocalStudents(demoData);
    this.saveAllAttendance(this._generateDemoAttendance());
    this.saveAllExams({});

    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref("exams").remove();
        const studentsObj = {};
        demoData.forEach(s => {
          studentsObj[s.ID] = s;
        });
        await firebase.database().ref("students").set(studentsObj);
      } catch (err) {
        console.warn("Reset demo data to Firebase failed:", err);
      }
    }

    return demoData;
  },

  // ==========================================
  // Computer Course Exams & Score Management
  // ==========================================
  getAllExams() {
    try {
      const data = localStorage.getItem(APP_CONFIG.STORAGE_KEY_EXAMS || "master_school_exams_db");
      if (data) return JSON.parse(data);
    } catch (e) {}

    return {};
  },

  saveAllExams(examsMap) {
    localStorage.setItem(APP_CONFIG.STORAGE_KEY_EXAMS || "master_school_exams_db", JSON.stringify(examsMap));
  },

  getStudentExams(studentId) {
    const all = this.getAllExams();
    return all[studentId] || {};
  },

  async saveStudentExam(studentId, courseId, examData) {
    const all = this.getAllExams();
    if (!all[studentId]) all[studentId] = {};
    all[studentId][courseId] = {
      ...all[studentId][courseId],
      ...examData,
      updatedAt: new Date().toISOString()
    };
    this.saveAllExams(all);

    // Sync to Firebase if connected
    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`exams/${studentId}/${courseId}`).set(all[studentId][courseId]);
      } catch (e) {
        console.warn("Firebase exam sync notice:", e);
      }
    }
    return all[studentId][courseId];
  },

  // Promote student to the next module in sequence: Typing -> Word -> Excel -> PowerPoint -> Graduated
  async promoteStudentCourse(studentId) {
    const students = this.getLocalStudents();
    const student = students.find(s => s.ID === studentId);
    if (!student) throw new Error("រកមិនឃើញសិស្សឡើយ");

    const currentCourse = (student.Course || "").trim();
    let nextCourse = "";
    let isGraduated = false;

    if (currentCourse.includes("Typing")) {
      nextCourse = "Microsoft Word";
    } else if (currentCourse.includes("Word")) {
      nextCourse = "Microsoft Excel";
    } else if (currentCourse.includes("Excel")) {
      nextCourse = "Microsoft PowerPoint";
    } else if (currentCourse.includes("PowerPoint")) {
      isGraduated = true;
      nextCourse = "Microsoft PowerPoint";
    } else {
      nextCourse = "Typing";
    }

    student.Course = nextCourse;
    if (isGraduated) {
      student.Status = "Graduated";
    }

    await this.updateStudent(student);
    return { student, nextCourse, isGraduated };
  },

  async clearAllExams() {
    this.saveAllExams({});
    localStorage.removeItem(APP_CONFIG.STORAGE_KEY_EXAMS || "master_school_exams_db");
    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref("exams").remove();
      } catch (e) {
        console.warn("Clear exams from Firebase error:", e);
      }
    }
    return {};
  },

  async fetchExamsCloud() {
    if (this.isCloudConnected()) {
      try {
        const snapshot = await firebase.database().ref("exams").once("value");
        const val = snapshot.val();
        if (val && typeof val === "object") {
          this.saveAllExams(val);
          return val;
        } else {
          this.saveAllExams({});
          return {};
        }
      } catch (e) {
        console.warn("Fetch exams notice:", e);
      }
    }
    return this.getAllExams();
  },

  _generateDemoExams() {
    return {};
  },

  // ==========================================
  // Tuition Fees & Invoicing Service
  // ==========================================
  getAllFees() {
    let fees = {};
    try {
      const data = localStorage.getItem(APP_CONFIG.STORAGE_KEY_FEES || "master_school_fees_db");
      if (data) fees = JSON.parse(data) || {};
    } catch (e) {}

    const students = this.getLocalStudents();
    const defaultPrice = APP_CONFIG.feeConfig?.defaultCoursePrice || 50;
    let hasChanges = false;

    if (Array.isArray(students) && students.length > 0) {
      students.forEach(s => {
        const existing = fees[s.ID];
        // Ensure every student has $50 total, $50 paid, $0 balance, status "Paid"
        if (!existing || existing.status !== "Paid" || existing.balance > 0 || existing.totalAmount !== defaultPrice || existing.paidAmount !== defaultPrice) {
          fees[s.ID] = {
            studentId: s.ID,
            studentNameKh: s.NameKh || "",
            studentNameEn: s.NameEn || "",
            course: s.Course || "Typing",
            totalAmount: defaultPrice,
            paidAmount: defaultPrice,
            discount: 0,
            balance: 0,
            status: "Paid",
            receiptNo: existing?.receiptNo || ("INV-2026-" + String(s.ID).replace(/\D/g, "").padStart(4, "0")),
            date: existing?.date || s.StartDate || "2026-08-10",
            paymentMethod: (existing?.paymentMethod && existing?.paymentMethod !== "—") ? existing.paymentMethod : "ABA KHQR",
            note: "បង់ថ្លៃសិក្សាពេញ $50 រួចរាល់",
            updatedAt: new Date().toISOString()
          };
          hasChanges = true;
        }
      });
    }

    if (hasChanges) {
      this.saveAllFees(fees);
    }
    return fees;
  },

  saveAllFees(feesMap) {
    localStorage.setItem(APP_CONFIG.STORAGE_KEY_FEES || "master_school_fees_db", JSON.stringify(feesMap));
  },

  async fetchFeesCloud() {
    if (this.isCloudConnected()) {
      try {
        const snapshot = await firebase.database().ref("fees").once("value");
        const val = snapshot.val();
        const local = this.getAllFees();
        const defaultPrice = APP_CONFIG.feeConfig?.defaultCoursePrice || 50;

        let merged = { ...local };
        if (val && typeof val === "object") {
          Object.keys(val).forEach(sid => {
            const remote = val[sid];
            // Normalize any remote fee that had debt or old price
            merged[sid] = {
              ...(local[sid] || {}),
              ...remote,
              totalAmount: defaultPrice,
              paidAmount: defaultPrice,
              discount: 0,
              balance: 0,
              status: "Paid",
              paymentMethod: (remote.paymentMethod && remote.paymentMethod !== "—") ? remote.paymentMethod : "ABA KHQR"
            };
          });
        }

        this.saveAllFees(merged);
        // Sync the clean $50 fully paid records back to cloud
        await firebase.database().ref("fees").set(merged);
        return merged;
      } catch (e) {
        console.warn("Fetch fees from Firebase notice:", e);
      }
    }
    return this.getAllFees();
  },

  getStudentFee(studentId) {
    const all = this.getAllFees();
    if (all[studentId]) return all[studentId];

    const defaultPrice = APP_CONFIG.feeConfig?.defaultCoursePrice || 50;
    const students = this.getLocalStudents();
    const student = students.find(s => s.ID === studentId);
    return {
      studentId: studentId,
      studentNameKh: student ? student.NameKh : "",
      studentNameEn: student ? student.NameEn : "",
      course: student ? (student.Course || "Typing") : "Typing",
      totalAmount: defaultPrice,
      paidAmount: defaultPrice,
      discount: 0,
      balance: 0,
      status: "Paid",
      receiptNo: "INV-2026-" + String(studentId).replace(/\D/g, "").padStart(4, "0"),
      date: student?.StartDate || "2026-08-10",
      paymentMethod: "ABA KHQR",
      note: "បង់ថ្លៃសិក្សាពេញ $50 រួចរាល់",
      updatedAt: new Date().toISOString()
    };
  },

  async saveStudentPayment(studentId, paymentData) {
    const all = this.getAllFees();
    const students = this.getLocalStudents();
    const student = students.find(s => s.ID === studentId);

    const total = parseFloat(paymentData.totalAmount) || (APP_CONFIG.feeConfig?.defaultCoursePrice || 50);
    const paid = parseFloat(paymentData.paidAmount) || total;
    const discount = parseFloat(paymentData.discount) || 0;
    const balance = Math.max(0, total - discount - paid);

    let status = "Paid";
    if (balance > 0 && paid > 0) {
      status = "Partial";
    } else if (balance > 0 && paid === 0) {
      status = "Unpaid";
    }

    const receiptNo = paymentData.receiptNo || ("INV-" + new Date().getFullYear() + "-" + String(studentId).replace(/\D/g, "").padStart(4, "0"));

    all[studentId] = {
      studentId: studentId,
      studentNameKh: student ? student.NameKh : (paymentData.studentNameKh || ""),
      studentNameEn: student ? student.NameEn : (paymentData.studentNameEn || ""),
      course: paymentData.course || (student ? student.Course : "Typing"),
      totalAmount: total,
      paidAmount: paid,
      discount: discount,
      balance: balance,
      status: status,
      receiptNo: receiptNo,
      date: paymentData.date || new Date().toISOString().split("T")[0],
      paymentMethod: paymentData.paymentMethod || "ABA KHQR",
      note: paymentData.note || "បង់ថ្លៃសិក្សាគ្រប់ចំនួន ($50)",
      updatedAt: new Date().toISOString()
    };

    this.saveAllFees(all);

    // Sync to Firebase if connected
    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`fees/${studentId}`).set(all[studentId]);
      } catch (e) {
        console.warn("Firebase fee sync notice:", e);
      }
    }

    return all[studentId];
  },

  // ==========================================
  // Digital Certificate Management Service
  // ==========================================
  getAllCertificates() {
    try {
      const data = localStorage.getItem(APP_CONFIG.STORAGE_KEY_CERTIFICATES || "master_school_certificates_db");
      if (data) return JSON.parse(data);
    } catch (e) {}
    return {};
  },

  saveAllCertificates(certsMap) {
    localStorage.setItem(APP_CONFIG.STORAGE_KEY_CERTIFICATES || "master_school_certificates_db", JSON.stringify(certsMap));
  },

  async fetchCertificatesCloud() {
    if (this.isCloudConnected()) {
      try {
        const snapshot = await firebase.database().ref("certificates").once("value");
        const val = snapshot.val();
        if (val && typeof val === "object") {
          const local = this.getAllCertificates();
          const merged = { ...local, ...val };
          this.saveAllCertificates(merged);
          return merged;
        }
      } catch (e) {
        console.warn("Fetch certificates from Firebase notice:", e);
      }
    }
    return this.getAllCertificates();
  },

  getStudentCertificate(studentId) {
    const all = this.getAllCertificates();
    return all[studentId] || null;
  },

  async issueCertificate(studentId, certData = {}) {
    const all = this.getAllCertificates();
    const students = this.getLocalStudents();
    const student = students.find(s => s.ID === studentId);
    const exams = this.getStudentExams(studentId);

    const certId = certData.certId || ("MS-CERT-" + new Date().getFullYear() + "-" + String(studentId).replace(/\D/g, "").padStart(4, "0"));

    const scores = [
      exams.Typing?.score,
      exams.Word?.score,
      exams.Excel?.score,
      exams.PowerPoint?.score
    ].filter(s => typeof s === "number");

    const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : (certData.overallScore || 85);
    let grade = "A";
    if (avg >= 85) grade = "A";
    else if (avg >= 75) grade = "B";
    else if (avg >= 65) grade = "C";
    else grade = "D";

    all[studentId] = {
      certId: certId,
      studentId: studentId,
      studentNameKh: student ? student.NameKh : (certData.studentNameKh || "សិស្ស"),
      studentNameEn: student ? student.NameEn : (certData.studentNameEn || ""),
      gender: student ? student.Gender : (certData.gender || "ប្រុស"),
      courseName: certData.courseName || "វគ្គបណ្តុះបណ្តាលកុំព្យូទ័ររដ្ឋបាល (Administrative Computer Literacy)",
      completionDate: certData.completionDate || new Date().toISOString().split("T")[0],
      issueDate: certData.issueDate || new Date().toISOString().split("T")[0],
      gpa: grade,
      overallScore: avg,
      director: "លោកគ្រូ ខៀន ធូ",
      modules: [
        { name: "Typing", score: exams.Typing?.score ?? 90, grade: exams.Typing?.grade ?? "A" },
        { name: "Microsoft Word", score: exams.Word?.score ?? 88, grade: exams.Word?.grade ?? "A" },
        { name: "Microsoft Excel", score: exams.Excel?.score ?? 85, grade: exams.Excel?.grade ?? "B" },
        { name: "Microsoft PowerPoint", score: exams.PowerPoint?.score ?? 92, grade: exams.PowerPoint?.grade ?? "A" }
      ],
      verified: true,
      issuedAt: new Date().toISOString()
    };

    this.saveAllCertificates(all);

    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`certificates/${studentId}`).set(all[studentId]);
      } catch (e) {
        console.warn("Firebase certificate sync notice:", e);
      }
    }

    return all[studentId];
  },

  // ====================================================
  // PC LAB WORKSTATIONS MAINTENANCE & HEALTH TRACKER
  // ====================================================
  getLabMaintenance() {
    try {
      const saved = localStorage.getItem(APP_CONFIG.STORAGE_KEY_LAB_MAINTENANCE);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  },

  saveAllLabMaintenance(data) {
    try {
      localStorage.setItem(APP_CONFIG.STORAGE_KEY_LAB_MAINTENANCE, JSON.stringify(data));
    } catch (e) {}
  },

  async saveLabMaintenance(pcId, maintenanceData) {
    const all = this.getLabMaintenance();
    all[pcId] = {
      pcId,
      status: maintenanceData.status || "normal", // 'normal' | 'maintenance' | 'broken'
      issueNote: maintenanceData.issueNote || "",
      reportedBy: maintenanceData.reportedBy || "លោកគ្រូ ខៀន ធូ",
      updatedAt: new Date().toISOString()
    };
    this.saveAllLabMaintenance(all);

    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`lab_maintenance/${pcId}`).set(all[pcId]);
      } catch (e) {
        console.warn("Firebase lab maintenance error:", e);
      }
    }
    return all[pcId];
  },

  // ====================================================
  // STUDENT LEAVE REQUESTS (ប្រព័ន្ធសុំច្បាប់អវត្តមាន)
  // ====================================================
  getLeaveRequests() {
    try {
      const saved = localStorage.getItem(APP_CONFIG.STORAGE_KEY_LEAVE_REQUESTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  },

  saveAllLeaveRequests(requests) {
    try {
      localStorage.setItem(APP_CONFIG.STORAGE_KEY_LEAVE_REQUESTS, JSON.stringify(requests));
    } catch (e) {}
  },

  async submitLeaveRequest(requestData) {
    const all = this.getLeaveRequests();
    const newReq = {
      id: "LR-" + Date.now(),
      studentId: requestData.studentId,
      studentNameKh: requestData.studentNameKh,
      startDate: requestData.startDate,
      endDate: requestData.endDate,
      reason: requestData.reason || "មានធុរៈចាំបាច់",
      phone: requestData.phone || "",
      status: "pending", // 'pending' | 'approved' | 'rejected'
      createdAt: new Date().toISOString(),
      approvedBy: null,
      approvedAt: null
    };

    all.unshift(newReq);
    this.saveAllLeaveRequests(all);

    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`leave_requests/${newReq.id}`).set(newReq);
      } catch (e) {
        console.warn("Firebase leave request error:", e);
      }
    }

    if (typeof TelegramService !== "undefined" && TelegramService.sendLeaveRequestAlert) {
      TelegramService.sendLeaveRequestAlert(newReq);
    }

    return newReq;
  },

  async updateLeaveRequestStatus(requestId, status, approverName = "លោកគ្រូ ខៀន ធូ") {
    const all = this.getLeaveRequests();
    const req = all.find(r => r.id === requestId);
    if (!req) return null;

    req.status = status; // 'approved' | 'rejected'
    req.approvedBy = approverName;
    req.approvedAt = new Date().toISOString();

    this.saveAllLeaveRequests(all);

    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`leave_requests/${requestId}`).update({
          status: req.status,
          approvedBy: req.approvedBy,
          approvedAt: req.approvedAt
        });
      } catch (e) {
        console.warn("Firebase leave status error:", e);
      }
    }

    // Auto-mark attendance permission ('P') if approved
    if (status === "approved" && req.studentId) {
      this.autoMarkAttendancePermission(req.studentId, req.startDate, req.endDate);
    }

    if (typeof TelegramService !== "undefined" && TelegramService.sendLeaveStatusAlert) {
      TelegramService.sendLeaveStatusAlert(req);
    }

    return req;
  },

  autoMarkAttendancePermission(studentId, startDate, endDate) {
    try {
      const allAtt = this.getAllAttendance();
      const start = new Date(startDate);
      const end = new Date(endDate || startDate);
      let curr = new Date(start);

      while (curr <= end) {
        const y = curr.getFullYear();
        const m = String(curr.getMonth() + 1).padStart(2, "0");
        const d = String(curr.getDate()).padStart(2, "0");
        const dateStr = `${y}-${m}-${d}`;

        if (!allAtt[dateStr]) allAtt[dateStr] = {};
        allAtt[dateStr][studentId] = "P";

        curr.setDate(curr.getDate() + 1);
      }

      this.saveAllAttendance(allAtt);

      if (this.isCloudConnected()) {
        firebase.database().ref("attendance").update(allAtt).catch(e => {});
      }
    } catch (e) {
      console.warn("Auto mark permission notice:", e);
    }
  },

  // ====================================================
  // PRACTICAL ASSIGNMENTS & HOMEWORK (កិច្ចការអនុវត្តជាក់ស្តែង)
  // ====================================================
  getAssignments() {
    try {
      const saved = localStorage.getItem(APP_CONFIG.STORAGE_KEY_ASSIGNMENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Realistic default assignments for computer training
    return [
      {
        id: "ASN-01",
        course: "Word",
        title: "កិច្ចការទី ១: រៀបចំលិខិតរដ្ឋបាល & តារាងអត្ថបទផ្លូវការ",
        instructions: "ប្រើប្រាស់ MS Word ដើម្បីរៀបចំលិខិតអញ្ជើញ និងតារាងរបាយការណ៍ ដោយកំណត់ Margin 2cm, Font Kantumruy Pro និងដាក់ Header/Footer ផ្លូវការ។",
        dueDate: "2026-10-15",
        createdBy: "លោកគ្រូ ខៀន ធូ",
        createdAt: "2026-09-01"
      },
      {
        id: "ASN-02",
        course: "Excel",
        title: "កិច្ចការទី ២: តារាងគណនាប្រាក់បៀវត្សរ៍ & VLOOKUP/IF",
        instructions: "បង្កើតតារាងគណនាប្រាក់បៀវត្សរ៍បុគ្គលិក ១០ នាក់ ដោយប្រើរូបមន្ត IF, VLOOKUP, SUM, AVERAGE និង Data Validation។",
        dueDate: "2026-10-25",
        createdBy: "លោកគ្រូ ខៀន ធូ",
        createdAt: "2026-09-01"
      },
      {
        id: "ASN-03",
        course: "PowerPoint",
        title: "កិច្ចការទី ៣: រចនាស្លាយបទបង្ហាញអាជីវកម្ម ៥ ស្លាយ",
        instructions: "រចនាស្លាយ Business Pitch Deck ៥ ស្លាយ ដោយមាន SmartArt, Slide Transitions, និង Animation ស្រស់ស្អាត។",
        dueDate: "2026-11-05",
        createdBy: "លោកគ្រូ ខៀន ធូ",
        createdAt: "2026-09-01"
      }
    ];
  },

  saveAllAssignments(list) {
    try {
      localStorage.setItem(APP_CONFIG.STORAGE_KEY_ASSIGNMENTS, JSON.stringify(list));
    } catch (e) {}
  },

  async saveAssignment(assignmentData) {
    const all = this.getAssignments();
    if (!assignmentData.id) {
      assignmentData.id = "ASN-" + String(all.length + 1).padStart(2, "0");
      assignmentData.createdAt = new Date().toISOString().split("T")[0];
      all.unshift(assignmentData);
    } else {
      const idx = all.findIndex(a => a.id === assignmentData.id);
      if (idx !== -1) all[idx] = { ...all[idx], ...assignmentData };
      else all.unshift(assignmentData);
    }
    this.saveAllAssignments(all);

    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`assignments/${assignmentData.id}`).set(assignmentData);
      } catch (e) {}
    }
    return assignmentData;
  },

  async deleteAssignment(id) {
    let all = this.getAssignments();
    all = all.filter(a => a.id !== id);
    this.saveAllAssignments(all);
    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`assignments/${id}`).remove();
      } catch (e) {}
    }
  },

  getAssignmentSubmissions() {
    try {
      const saved = localStorage.getItem(APP_CONFIG.STORAGE_KEY_ASSIGNMENT_SUBS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  },

  saveAllAssignmentSubmissions(subs) {
    try {
      localStorage.setItem(APP_CONFIG.STORAGE_KEY_ASSIGNMENT_SUBS, JSON.stringify(subs));
    } catch (e) {}
  },

  async submitAssignment(subData) {
    const all = this.getAssignmentSubmissions();
    const subId = `SUB-${subData.assignmentId}-${subData.studentId}`;
    const newSub = {
      id: subId,
      assignmentId: subData.assignmentId,
      studentId: subData.studentId,
      studentNameKh: subData.studentNameKh,
      submissionUrl: subData.submissionUrl || "",
      notes: subData.notes || "",
      submittedAt: new Date().toISOString(),
      grade: subData.grade || null, // 'A' | 'B' | 'C' | 'Passed'
      feedback: subData.feedback || ""
    };

    const idx = all.findIndex(s => s.id === subId);
    if (idx !== -1) all[idx] = newSub;
    else all.unshift(newSub);

    this.saveAllAssignmentSubmissions(all);

    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`assignment_submissions/${subId}`).set(newSub);
      } catch (e) {}
    }
    return newSub;
  },

  async gradeAssignmentSubmission(subId, grade, feedback = "") {
    const all = this.getAssignmentSubmissions();
    const sub = all.find(s => s.id === subId);
    if (!sub) return null;

    sub.grade = grade;
    sub.feedback = feedback;
    sub.gradedAt = new Date().toISOString();

    this.saveAllAssignmentSubmissions(all);

    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`assignment_submissions/${subId}`).update({
          grade: sub.grade,
          feedback: sub.feedback,
          gradedAt: sub.gradedAt
        });
      } catch (e) {}
    }
    return sub;
  }
};


