/**
 * Service: Authentication & Teacher Management (ប្រព័ន្ធគ្រប់គ្រងគណនីគ្រូបង្រៀន)
 */
const AuthService = {
  _currentUser: null,

  init() {
    try {
      const storedTeachers = localStorage.getItem(APP_CONFIG.STORAGE_KEY_TEACHERS);
      let currentList = storedTeachers ? JSON.parse(storedTeachers) : [];
      if (!Array.isArray(currentList)) currentList = [];
      
      const existingKhien = currentList.find(t => (t.username || "").toLowerCase() === "khienthou");
      const cleanKhien = existingKhien ? {
        ...existingKhien,
        id: "TCH-001",
        username: "khienthou",
        password: existingKhien.password || "11112222",
        nameKh: existingKhien.nameKh || "លោកគ្រូ ខៀន ធូ",
        nameEn: existingKhien.nameEn || "Mr. KHIEN THOU",
        role: "គ្រូបង្រៀន & អ្នកគ្រប់គ្រងប្រព័ន្ធ (Admin)",
        email: existingKhien.email || "khienthou01@gmail.com",
        phone: existingKhien.phone || "0717210307",
        gender: "ប្រុស",
        permissions: ["all"]
      } : APP_CONFIG.defaultTeachers[0];

      // Keep all custom added teachers, only remove old mock accounts
      const otherTeachers = currentList.filter(t => 
        (t.username || "").toLowerCase() !== "khienthou" && 
        !["teacher", "computer", "admin"].includes((t.username || "").toLowerCase())
      );

      const fullList = [cleanKhien, ...otherTeachers];
      localStorage.setItem(APP_CONFIG.STORAGE_KEY_TEACHERS, JSON.stringify(fullList));

      // Asynchronously sync from cloud if connected
      this.fetchTeachersCloud();
    } catch (e) {
      console.warn("Storage init warning:", e);
    }

    // Check existing session
    try {
      const session = localStorage.getItem(APP_CONFIG.STORAGE_KEY_AUTH) || 
                      sessionStorage.getItem(APP_CONFIG.STORAGE_KEY_AUTH);
      if (session) {
        this._currentUser = JSON.parse(session);
        // If current logged-in user is a teacher, keep their active session
        if (this._currentUser && this._currentUser.role !== "student") {
          const teachers = this.getTeachers();
          const found = teachers.find(t => t.id === this._currentUser.id || (t.username && t.username.toLowerCase() === (this._currentUser.username || "").toLowerCase()));
          if (found) {
            this._currentUser = {
              ...this._currentUser,
              nameKh: found.nameKh,
              nameEn: found.nameEn,
              role: found.role,
              email: found.email,
              phone: found.phone,
              avatar: found.avatar,
              gender: found.gender
            };
            const storage = localStorage.getItem(APP_CONFIG.STORAGE_KEY_AUTH) ? localStorage : sessionStorage;
            storage.setItem(APP_CONFIG.STORAGE_KEY_AUTH, JSON.stringify(this._currentUser));
          }
        }
      }
    } catch (e) {
      this._currentUser = null;
    }

    return this._currentUser;
  },

  async fetchTeachersCloud() {
    if (typeof StudentAPI === "undefined" || !StudentAPI.isCloudConnected()) return [];
    try {
      const snapshot = await firebase.database().ref("teachers").once("value");
      const val = snapshot.val();
      if (val) {
        let cloudTeachers = [];
        if (Array.isArray(val)) {
          cloudTeachers = val.filter(Boolean);
        } else if (typeof val === "object") {
          cloudTeachers = Object.values(val);
        }

        if (cloudTeachers.length > 0) {
          const localTeachers = this.getTeachers();
          const map = {};
          localTeachers.forEach(t => { map[t.id || t.username] = t; });
          cloudTeachers.forEach(t => {
            const user = (t.username || "").toLowerCase();
            if (!["teacher", "computer", "admin"].includes(user)) {
              map[t.id || t.username] = { ...(map[t.id || t.username] || {}), ...t };
            }
          });
          const merged = Object.values(map);
          localStorage.setItem(APP_CONFIG.STORAGE_KEY_TEACHERS, JSON.stringify(merged));
          return merged;
        }
      } else {
        // If Firebase is empty, upload current local teachers
        const localTeachers = this.getTeachers();
        await this.saveTeachers(localTeachers);
      }
    } catch (err) {
      console.warn("⚠️ មិនអាច Sync គ្រូពី Firebase:", err);
    }
    return this.getTeachers();
  },

  getTeachers() {
    try {
      const raw = localStorage.getItem(APP_CONFIG.STORAGE_KEY_TEACHERS);
      let list = raw ? JSON.parse(raw) : (APP_CONFIG.defaultTeachers || []);
      if (!Array.isArray(list)) list = [];
      // Filter out any old demo teachers if they linger
      const filtered = list.filter(t => !["teacher", "computer", "admin"].includes((t.username || "").toLowerCase()));
      // Ensure Khien Thou is always present
      if (!filtered.some(t => (t.username || "").toLowerCase() === "khienthou")) {
        filtered.unshift(APP_CONFIG.defaultTeachers[0]);
      }
      return filtered;
    } catch (e) {
      return APP_CONFIG.defaultTeachers || [];
    }
  },

  async saveTeachers(teachers) {
    try {
      localStorage.setItem(APP_CONFIG.STORAGE_KEY_TEACHERS, JSON.stringify(teachers));
    } catch (e) {
      console.error("Failed to save teachers to localStorage:", e);
    }

    // Sync to Firebase RTDB if connected
    if (typeof StudentAPI !== "undefined" && StudentAPI.isCloudConnected()) {
      try {
        const teachersObj = {};
        teachers.forEach(t => { 
          const key = t.id || t.username || ("TCH-" + Date.now());
          teachersObj[key] = t; 
        });
        await firebase.database().ref("teachers").set(teachersObj);
        console.log(`✅ បាន Sync គ្រូបង្រៀនទៅ Firebase RTDB ជោគជ័យ: ${teachers.length} នាក់`);
      } catch (e) {
        console.warn("Firebase teacher sync warning:", e);
      }
    }
  },

  async addTeacher(teacherData) {
    if (!teacherData.nameKh || !teacherData.nameKh.trim()) {
      throw new Error("សូមបញ្ចូលឈ្មោះខ្មែររបស់គ្រូបង្រៀន!");
    }
    if (!teacherData.username || !teacherData.username.trim()) {
      throw new Error("សូមបញ្ចូលឈ្មោះគណនី (Username) សម្រាប់ Login!");
    }

    const cleanUser = teacherData.username.trim().toLowerCase();
    const teachers = this.getTeachers();

    if (teachers.some(t => (t.username || "").toLowerCase() === cleanUser)) {
      throw new Error(`ឈ្មោះគណនី (Username) "${cleanUser}" នេះមានរួចហើយ! សូមជ្រើសរើសឈ្មោះផ្សេង។`);
    }

    const newTeacher = {
      id: teacherData.id || "TCH-" + Date.now().toString().slice(-4),
      username: cleanUser,
      password: teacherData.password ? teacherData.password.trim() : "123",
      nameKh: teacherData.nameKh.trim(),
      nameEn: teacherData.nameEn ? teacherData.nameEn.trim() : "",
      role: teacherData.role ? teacherData.role.trim() : "គ្រូបង្រៀន",
      email: teacherData.email ? teacherData.email.trim() : "",
      phone: teacherData.phone ? teacherData.phone.trim() : "",
      gender: teacherData.gender || "ប្រុស",
      avatar: teacherData.avatar ? teacherData.avatar.trim() : (teacherData.gender === "ស្រី" ? "assets/images/default-female.svg" : "assets/images/default-male.svg"),
      permissions: ["all"],
      createdAt: new Date().toISOString()
    };

    teachers.push(newTeacher);
    await this.saveTeachers(teachers);
    return newTeacher;
  },

  async updateTeacher(id, teacherData) {
    if (!teacherData.nameKh || !teacherData.nameKh.trim()) {
      throw new Error("សូមបញ្ចូលឈ្មោះខ្មែររបស់គ្រូបង្រៀន!");
    }
    if (!teacherData.username || !teacherData.username.trim()) {
      throw new Error("សូមបញ្ចូលឈ្មោះគណនី (Username) សម្រាប់ Login!");
    }

    const cleanUser = teacherData.username.trim().toLowerCase();
    const teachers = this.getTeachers();
    const index = teachers.findIndex(t => t.id === id);

    if (index === -1) throw new Error("រកមិនឃើញព័ត៌មានគ្រូបង្រៀនឡើយ!");

    if (teachers.some((t, i) => i !== index && (t.username || "").toLowerCase() === cleanUser)) {
      throw new Error(`ឈ្មោះគណនី (Username) "${cleanUser}" នេះត្រូវបានប្រើប្រាស់រួចហើយ!`);
    }

    teachers[index] = {
      ...teachers[index],
      ...teacherData,
      username: cleanUser,
      password: teacherData.password ? teacherData.password.trim() : teachers[index].password,
      nameKh: teacherData.nameKh.trim(),
      nameEn: teacherData.nameEn ? teacherData.nameEn.trim() : "",
      role: teacherData.role ? teacherData.role.trim() : teachers[index].role,
      phone: teacherData.phone ? teacherData.phone.trim() : "",
      email: teacherData.email ? teacherData.email.trim() : "",
      gender: teacherData.gender || teachers[index].gender,
      avatar: teacherData.avatar ? teacherData.avatar.trim() : teachers[index].avatar,
      updatedAt: new Date().toISOString()
    };

    await this.saveTeachers(teachers);

    // If currently logged-in user is this teacher, update session
    if (this._currentUser && this._currentUser.id === id) {
      this._currentUser = {
        ...this._currentUser,
        nameKh: teachers[index].nameKh,
        nameEn: teachers[index].nameEn,
        role: teachers[index].role,
        avatar: teachers[index].avatar,
        phone: teachers[index].phone
      };
      const storage = localStorage.getItem(APP_CONFIG.STORAGE_KEY_AUTH) ? localStorage : sessionStorage;
      storage.setItem(APP_CONFIG.STORAGE_KEY_AUTH, JSON.stringify(this._currentUser));
    }

    return teachers[index];
  },

  async deleteTeacher(id) {
    if (this._currentUser && this._currentUser.id === id) {
      throw new Error("មិនអាចលុបគណនីដែលអ្នកកំពុង Login ប្រើប្រាស់បានឡើយ!");
    }

    let teachers = this.getTeachers();
    const toDelete = teachers.find(t => t.id === id || t.username === id);
    if (toDelete && (toDelete.username || "").toLowerCase() === "khienthou") {
      throw new Error("មិនអាចលុបគណនីរបស់លោកគ្រូ ខៀន ធូ (Admin ចម្បង) បានឡើយ!");
    }

    if (teachers.length <= 1) {
      throw new Error("ប្រព័ន្ធត្រូវតែមានគណនីគ្រូបង្រៀនយ៉ាងហោចណាស់ ១ នាក់!");
    }

    teachers = teachers.filter(t => t.id !== id && t.username !== id);
    await this.saveTeachers(teachers);

    if (typeof StudentAPI !== "undefined" && StudentAPI.isCloudConnected()) {
      try {
        await firebase.database().ref(`teachers/${id}`).remove();
      } catch (e) {}
    }

    return id;
  },

  async login(username, password, rememberMe = true) {
    if (!username || !username.trim()) {
      throw new Error("សូមបញ្ចូលឈ្មោះគណនី (Username)!");
    }
    if (!password || !password.trim()) {
      throw new Error("សូមបញ្ចូលលេខសម្ងាត់ (Password)!");
    }

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Sync latest teachers from Firebase if connected
    if (typeof StudentAPI !== "undefined" && StudentAPI.isCloudConnected()) {
      try {
        await this.fetchTeachersCloud();
      } catch (e) {}
    }

    const teachers = this.getTeachers();
    const teacher = teachers.find(t => 
      ((t.username && t.username.toLowerCase() === cleanUser) || (t.email && t.email.toLowerCase() === cleanUser)) && 
      String(t.password).trim() === cleanPass
    );

    if (!teacher) {
      throw new Error("ឈ្មោះគណនី ឬលេខសម្ងាត់មិនត្រឹមត្រូវឡើយ! សូមពិនិត្យមើលម្តងទៀត។");
    }

    const safeUser = {
      id: teacher.id,
      username: teacher.username,
      nameKh: teacher.nameKh,
      nameEn: teacher.nameEn,
      role: teacher.role,
      email: teacher.email,
      phone: teacher.phone,
      avatar: teacher.avatar,
      gender: teacher.gender,
      permissions: teacher.permissions || ["all"],
      loggedInAt: new Date().toISOString()
    };

    this._currentUser = safeUser;

    try {
      if (rememberMe) {
        localStorage.setItem(APP_CONFIG.STORAGE_KEY_AUTH, JSON.stringify(safeUser));
        sessionStorage.removeItem(APP_CONFIG.STORAGE_KEY_AUTH);
      } else {
        sessionStorage.setItem(APP_CONFIG.STORAGE_KEY_AUTH, JSON.stringify(safeUser));
        localStorage.removeItem(APP_CONFIG.STORAGE_KEY_AUTH);
      }
    } catch (e) {
      console.warn("Storage session write error:", e);
    }

    return safeUser;
  },

  async loginStudent(idOrPhone, pin = "123", rememberMe = true) {
    if (!idOrPhone || !idOrPhone.trim()) {
      throw new Error("សូមបញ្ចូលអត្តលេខសិស្ស (Student ID) ឬលេខទូរស័ព្ទ!");
    }
    if (!pin || !pin.trim()) {
      throw new Error("សូមបញ្ចូលលេខកូដសម្ងាត់ (PIN/Password)!");
    }

    const cleanInput = idOrPhone.trim().toLowerCase();
    const cleanDigits = idOrPhone.replace(/\D/g, "");
    const cleanPin = pin.trim();

    // Fetch students list
    let students = [];
    if (typeof StudentAPI !== "undefined") {
      students = StudentAPI.getLocalStudents();
    }
    if (!students || students.length === 0) {
      if (typeof StudentAPI !== "undefined" && StudentAPI.isCloudConnected()) {
        try {
          students = await StudentAPI.getStudents(true);
        } catch (e) {}
      }
    }
    if (!students || students.length === 0) {
      students = (typeof DEFAULT_STUDENTS !== "undefined") ? DEFAULT_STUDENTS : [];
    }

    // Helper to find student by ID or Phone
    const findStudentMatch = (list) => (list || []).find(s => {
      const sId = (s.ID || "").toLowerCase();
      const sIdNum = sId.replace(/\D/g, "");
      const sPhone = (s.Phone || "").replace(/\D/g, "");
      const sGuardianPhone = (s.GuardianPhone || "").replace(/\D/g, "");

      return (
        sId === cleanInput ||
        (cleanDigits && sIdNum === cleanDigits) ||
        (cleanDigits && sPhone.endsWith(cleanDigits)) ||
        (cleanDigits && sGuardianPhone.endsWith(cleanDigits))
      );
    });

    let student = findStudentMatch(students);

    // If still not found, try refreshing from Firebase once more
    if (!student && typeof StudentAPI !== "undefined" && StudentAPI.isCloudConnected()) {
      try {
        students = await StudentAPI.getStudents(true);
        student = findStudentMatch(students);
      } catch (e) {}
    }

    if (!student) {
      throw new Error(`រកមិនឃើញសិស្សដែលមានអត្តលេខ ឬលេខទូរស័ព្ទ "${idOrPhone}" ឡើយ! សូមពិនិត្យមើលម្តងទៀត។`);
    }

    // Check if student is Dropped or ID is Blocked
    const isDropped = (student.Status === "Dropped" || student.Status === "Drop" || student.isBlocked === true);
    const isBlocked = (typeof StudentAPI !== "undefined" && StudentAPI.isStudentIdBlocked) ? StudentAPI.isStudentIdBlocked(student.ID) : isDropped;
    if (isDropped || isBlocked) {
      throw new Error(`⛔ គណនីអត្តលេខ ${student.ID} (${student.NameKh}) ត្រូវបានចាក់សោរ និងប្រើប្រាស់លែងកើត ដោយសារសិស្សបានបោះបង់ការសិក្សា!`);
    }

    // PIN Verification: default is "123", custom PIN, student's phone number, or ID
    const validPins = ["123", "1234"];
    if (student.PIN) validPins.push(String(student.PIN).trim());
    if (student.pin) validPins.push(String(student.pin).trim());
    if (student.Password) validPins.push(String(student.Password).trim());
    if (student.password) validPins.push(String(student.password).trim());
    if (student.Phone) validPins.push(student.Phone.replace(/\D/g, ""));
    if (student.ID) validPins.push(student.ID.toLowerCase());

    if (!validPins.includes(cleanPin)) {
      throw new Error("លេខកូដសម្ងាត់ PIN មិនត្រឹមត្រូវឡើយ!");
    }

    const safeStudent = {
      role: "student",
      id: student.ID,
      nameKh: student.NameKh,
      nameEn: student.NameEn,
      gender: student.Gender,
      grade: student.Grade,
      course: student.Course,
      shift: student.Shift,
      phone: student.Phone,
      avatar: student.Avatar,
      studentData: student,
      loggedInAt: new Date().toISOString()
    };

    this._currentUser = safeStudent;

    try {
      if (rememberMe) {
        localStorage.setItem(APP_CONFIG.STORAGE_KEY_AUTH, JSON.stringify(safeStudent));
        sessionStorage.removeItem(APP_CONFIG.STORAGE_KEY_AUTH);
      } else {
        sessionStorage.setItem(APP_CONFIG.STORAGE_KEY_AUTH, JSON.stringify(safeStudent));
        localStorage.removeItem(APP_CONFIG.STORAGE_KEY_AUTH);
      }
    } catch (e) {
      console.warn("Storage session write error:", e);
    }

    return safeStudent;
  },

  logout() {
    this._currentUser = null;
    try {
      localStorage.removeItem(APP_CONFIG.STORAGE_KEY_AUTH);
      sessionStorage.removeItem(APP_CONFIG.STORAGE_KEY_AUTH);
    } catch (e) {
      console.warn("Storage session clear error:", e);
    }
  },

  getCurrentUser() {
    if (!this._currentUser) {
      this.init();
    }
    return this._currentUser;
  },

  isAuthenticated() {
    return !!this.getCurrentUser();
  },

  isStudent() {
    const user = this.getCurrentUser();
    return !!(user && user.role === "student");
  },

  isTeacher() {
    const user = this.getCurrentUser();
    return !!(user && user.role !== "student");
  }
};
