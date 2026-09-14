/**
 * ==========================================================================
 * MasterSchool - Application Orchestrator & Controller
 * ==========================================================================
 */

const App = {
  // Global Application State
  state: {
    currentTab: "dashboard",
    students: [],
    filteredStudents: [],
    searchQuery: "",
    filters: {
      grade: "",
      course: "",
      gender: "",
      shift: "",
      status: ""
    },
    pagination: {
      page: 1,
      limit: 10
    },
    sort: {
      field: "ID",
      order: "desc"
    },
    selectedStudent: null
  },

  // Bootstrap the application
  async init() {
    this.initTheme();

    // Support #logout hash or #student-login hash
    if (window.location.hash === "#logout") {
      history.replaceState(null, "", window.location.pathname);
      if (typeof AuthService !== "undefined") {
        AuthService.logout();
      }
    } else if (window.location.hash === "#student-login") {
      history.replaceState(null, "", window.location.pathname);
      if (typeof AuthService !== "undefined") {
        AuthService.logout();
      }
      this.mountLoginScreen("student");
      return;
    }

    window.addEventListener("hashchange", () => {
      if (window.location.hash === "#logout") {
        history.replaceState(null, "", window.location.pathname);
        this.handleLogout(true);
      } else if (window.location.hash === "#student-login") {
        history.replaceState(null, "", window.location.pathname);
        this.handleLogout(true);
        this.mountLoginScreen("student");
      }
    });

    if (typeof AuthService !== "undefined") {
      AuthService.init();
      this.state.currentUser = AuthService.getCurrentUser();
    }

    if (typeof AuthService !== "undefined" && !AuthService.isAuthenticated()) {
      this.mountLoginScreen();
      return;
    }

    this.mountDOM();
    this.bindEvents();

    // Ensure all exam scores are completely empty per user requirement: no student has taken any exam yet
    if (localStorage.getItem("ms_exams_cleared_all_v4") !== "true") {
      if (typeof StudentAPI !== "undefined" && StudentAPI.clearAllExams) {
        await StudentAPI.clearAllExams();
      }
      localStorage.setItem("ms_exams_cleared_all_v4", "true");
    }

    if (typeof AuthService === "undefined" || !AuthService.isStudent()) {
      this.setupAutoSync();
      await this.loadData();
    }
  },

  // Edit Student Wizard Helpers (2-Step Fullscreen / Responsive Wizard)
  editStep: 1,

  toggleEditFullscreen() {
    const card = document.querySelector("#editModal .modal-card");
    const btn = document.getElementById("btnToggleEditFullscreen");
    if (card) {
      card.classList.toggle("windowed");
      const isWindowed = card.classList.contains("windowed");
      if (btn) {
        btn.innerHTML = isWindowed ? `<i class="fa-solid fa-expand"></i>` : `<i class="fa-solid fa-compress"></i>`;
        btn.title = isWindowed ? "ពង្រីកពេញអេក្រង់" : "បង្រួមផ្ទាំង";
      }
    }
  },

  goToEditStep(step) {
    if (step > 1 && this.editStep === 1) {
      const nameKhInput = document.getElementById("editInputNameKh");
      if (!nameKhInput || !nameKhInput.value.trim()) {
        this.showToast("សូមបញ្ចូលឈ្មោះសិស្សជាភាសាខ្មែរ!", "warning");
        if (nameKhInput) nameKhInput.focus();
        return;
      }
    }

    this.editStep = step;
    this.updateEditStepUI();
  },

  nextEditStep() {
    if (this.editStep < 2) {
      this.goToEditStep(this.editStep + 1);
    }
  },

  prevEditStep() {
    if (this.editStep > 1) {
      this.goToEditStep(this.editStep - 1);
    }
  },

  updateEditStepUI() {
    // 1. Progress Bar & Stepper Nodes
    const progressPercent = (this.editStep === 1) ? 0 : 100;
    const progressBar = document.getElementById("editStepperProgress");
    if (progressBar) progressBar.style.width = `${progressPercent}%`;

    for (let i = 1; i <= 2; i++) {
      const node = document.getElementById(`editStepNode${i}`);
      const section = document.getElementById(`editStepSection${i}`);
      if (node) {
        node.classList.remove("active", "completed");
        if (i === this.editStep) {
          node.classList.add("active");
        } else if (i < this.editStep) {
          node.classList.add("completed");
        }
      }
      if (section) {
        section.style.display = (i === this.editStep) ? "block" : "none";
      }
    }

    // 2. Subheader Icon & Text
    const subheaderIcon = document.getElementById("editSubheaderIcon");
    const subheaderText = document.getElementById("editSubheaderText");
    if (this.editStep === 1) {
      if (subheaderIcon) subheaderIcon.className = "fa-regular fa-user";
      if (subheaderText) subheaderText.textContent = "ព័ត៌មានអំពីសិស្ស";
    } else {
      if (subheaderIcon) subheaderIcon.className = "fa-solid fa-graduation-cap";
      if (subheaderText) subheaderText.textContent = "ព័ត៌មានវគ្គសិក្សាកុំព្យូទ័រ";
    }

    // 3. Footer Action Buttons
    const prevBtn = document.getElementById("btnEditPrevStep");
    const nextBtn = document.getElementById("btnEditNextStep");
    const submitBtn = document.getElementById("btnEditSubmit");

    if (prevBtn) {
      prevBtn.style.display = (this.editStep === 2) ? "inline-flex" : "none";
    }
    if (nextBtn) {
      nextBtn.style.display = (this.editStep === 1) ? "inline-flex" : "none";
    }
    if (submitBtn) {
      submitBtn.style.display = "inline-flex";
    }
  },

  mountLoginScreen(role = null) {
    const appEl = document.getElementById("app");
    const modalRoot = document.getElementById("modalRoot");
    if (modalRoot) modalRoot.innerHTML = "";
    if (appEl && typeof LoginView !== "undefined") {
      if (role) LoginView.currentRole = role;
      appEl.innerHTML = LoginView.render();
      LoginView.initEvents();
    }
  },

  async handleLogin(username, password, rememberMe) {
    const user = await AuthService.login(username, password, rememberMe);
    this.state.currentUser = user;
    this.showToast(`🎉 ស្វាគមន៍ ${user.nameKh} មកកាន់ MasterSchool!`, "success");
    this.triggerConfetti();

    this.mountDOM();
    this.bindEvents();
    this.setupAutoSync();
    await this.loadData();
  },

  async handleStudentLogin(idOrPhone, pin, rememberMe) {
    const studentUser = await AuthService.loginStudent(idOrPhone, pin, rememberMe);
    this.state.currentUser = studentUser;
    this.showToast(`🎉 ស្វាគមន៍ប្អូន ${studentUser.nameKh} មកកាន់ប្រព័ន្ធគណនីសិស្ស!`, "success");
    this.triggerConfetti();

    this.mountDOM();
    this.bindEvents();
  },

  handleLogout(skipConfirm = false) {
    const user = typeof AuthService !== "undefined" ? AuthService.getCurrentUser() : null;
    const isStudent = typeof AuthService !== "undefined" && AuthService.isStudent();
    const displayName = user ? user.nameKh : (isStudent ? "ប្អូន" : "លោកគ្រូ/អ្នកគ្រូ");
    
    let confirmed = true;
    if (!skipConfirm) {
      try {
        confirmed = confirm(isStudent 
          ? `តើប្អូន ${displayName} ពិតជាចង់ចាកចេញពីគណនីសិស្សមែនទេ?` 
          : `តើ${displayName} ពិតជាចង់ចាកចេញពីប្រព័ន្ធមែនទេ?`);
      } catch (e) {
        confirmed = true;
      }
    }

    if (confirmed) {
      if (typeof AuthService !== "undefined") {
        AuthService.logout();
      }
      this.state.currentUser = null;
      this.showToast("បានចាកចេញពីប្រព័ន្ធដោយជោគជ័យ!", "info");
      this.mountLoginScreen();
    }
  },

  // Mount modular components and views into the DOM shell
  mountDOM() {
    const appEl = document.getElementById("app");
    const modalRoot = document.getElementById("modalRoot");
    const isStudent = typeof AuthService !== "undefined" && AuthService.isStudent();

    if (appEl) {
      if (isStudent) {
        appEl.innerHTML = `
          <!-- Student Portal Shell (No Teacher Admin Sidebar) -->
          <main class="main-wrapper student-main-wrapper" style="margin-left: 0; width: 100%; min-height: 100vh;">
            <!-- Top Header Component -->
            ${HeaderComponent.render()}

            <!-- Dynamic Student Portal Body -->
            <div class="content-body student-content-body" style="max-width: 1300px; margin: 0 auto; padding: 24px;">
              ${typeof StudentPortalView !== "undefined" ? StudentPortalView.render() : '<p>កំពុងដំណើរការ...</p>'}
            </div>
          </main>
        `;
      } else {
        appEl.innerHTML = `
          <!-- Sidebar Navigation Component -->
          ${SidebarComponent.render()}

          <!-- Main Content Area -->
          <main class="main-wrapper">
            <!-- Top Header Component -->
            ${HeaderComponent.render()}

            <!-- Cloud Status Notification Banner -->
            <div id="cloudBannerNotice" class="cloud-banner-notice"></div>

            <!-- Dynamic Views Body -->
            <div class="content-body">
              ${DashboardView.render()}
              ${RegisterView.render()}
              ${DirectoryView.render()}
              ${typeof DroppedStudentsView !== "undefined" ? DroppedStudentsView.render() : ""}
              ${typeof GraduatedStudentsView !== "undefined" ? GraduatedStudentsView.render() : ""}
              ${AttendanceView.render()}
              ${typeof TimetableLabView !== "undefined" ? TimetableLabView.render() : ""}
              ${ExamsView.render()}
              ${typeof FeesView !== "undefined" ? FeesView.render() : ""}
              ${typeof CertificatesView !== "undefined" ? CertificatesView.render() : ""}
              ${typeof ResourcesView !== "undefined" ? ResourcesView.render() : ""}
              ${SettingsView.render()}
            </div>
          </main>
        `;
      }
    }

    if (modalRoot) {
      modalRoot.innerHTML = ModalsComponent.render();
    }
  },

  // Bind all event handlers from components & views
  bindEvents() {
    const isStudent = typeof AuthService !== "undefined" && AuthService.isStudent();

    HeaderComponent.initEvents();
    ModalsComponent.initEvents();

    if (isStudent) {
      if (typeof StudentPortalView !== "undefined") {
        StudentPortalView.initEvents();
      }
      if (typeof ExamsView !== "undefined") {
        ExamsView.initEvents();
      }
    } else {
      SidebarComponent.initEvents();
      DashboardView.initEvents();
      RegisterView.initEvents();
      DirectoryView.initEvents();
      if (typeof DroppedStudentsView !== "undefined") DroppedStudentsView.initEvents();
      if (typeof GraduatedStudentsView !== "undefined") GraduatedStudentsView.initEvents();
      AttendanceView.initEvents();
      if (typeof TimetableLabView !== "undefined") TimetableLabView.initEvents();
      ExamsView.initEvents();
      if (typeof FeesView !== "undefined") FeesView.initEvents();
      if (typeof CertificatesView !== "undefined") CertificatesView.initEvents();
      if (typeof ResourcesView !== "undefined") ResourcesView.initEvents();
      SettingsView.initEvents();
    }
  },

  // Dynamic Background Polling for Firebase Realtime Database changes
  setupAutoSync() {
    // Check for updates from Firebase every 60 seconds
    setInterval(() => {
      if (StudentAPI.isCloudConnected() && !StudentAPI._isFetching) {
        this.loadData(true, true); // silent background fetch
      }
    }, 60000);
  },

  // Update Dynamic Cloud Notice Banner (Kept clean & hidden per user request)
  updateCloudBanner() {
    const banner = document.getElementById("cloudBannerNotice");
    if (!banner) return;
    banner.innerHTML = "";
    banner.style.display = "none";
  },

  // Load and sync data dynamically from Google Sheets
  async loadData(forceRefresh = true, silent = false) {
    if (!silent) this.showLoader(true);
    try {
      this.state.students = await StudentAPI.getStudents(forceRefresh);
      if (typeof StudentAPI !== "undefined" && StudentAPI.fetchAttendanceCloud) {
        await StudentAPI.fetchAttendanceCloud();
      }
      this.applyFiltersAndSearch();
      DashboardView.update(this.state.students);
      DirectoryView.renderTable();
      if (typeof AttendanceView !== "undefined" && AttendanceView.renderTable) {
        // Only re-render if user is not actively on attendance view during silent background sync
        if (!silent || this.state.currentTab !== "attendance") {
          AttendanceView.renderTable();
        }
      }
      if (typeof StudentAPI !== "undefined" && StudentAPI.fetchExamsCloud) {
        await StudentAPI.fetchExamsCloud();
      }
      if (typeof ExamsView !== "undefined" && ExamsView.renderTable) {
        ExamsView.renderTable();
      }
      if (typeof StudentAPI !== "undefined" && StudentAPI.fetchFeesCloud) {
        await StudentAPI.fetchFeesCloud();
      }
      if (typeof FeesView !== "undefined" && FeesView.renderTable) {
        FeesView.renderTable();
      }
      if (typeof StudentAPI !== "undefined" && StudentAPI.fetchCertificatesCloud) {
        await StudentAPI.fetchCertificatesCloud();
      }
      if (typeof CertificatesView !== "undefined" && CertificatesView.renderTable) {
        CertificatesView.renderTable();
      }
      if (typeof DroppedStudentsView !== "undefined" && DroppedStudentsView.renderTable) {
        DroppedStudentsView.renderTable();
      }
      if (typeof GraduatedStudentsView !== "undefined" && GraduatedStudentsView.renderTable) {
        GraduatedStudentsView.renderTable();
      }
      this.updateSidebarCounters();
      HeaderComponent.updateCloudBadge(StudentAPI.isCloudConnected());
      this.updateCloudBanner();
      if (typeof AuthService !== "undefined" && AuthService.fetchTeachersCloud) {
        await AuthService.fetchTeachersCloud();
      }
    } catch (err) {
      if (!silent) this.showToast("កំហុសក្នុងការទាញយកទិន្នន័យ: " + err.message, "error");
    } finally {
      if (!silent) this.showLoader(false);
    }
  },

  // Navigation & View Routing
  switchTab(tabId) {
    this.state.currentTab = tabId;

    // Update nav links
    document.querySelectorAll(".nav-link").forEach(item => {
      if (item.getAttribute("data-tab") === tabId) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Update active view
    document.querySelectorAll(".page-view").forEach(view => {
      view.classList.remove("active");
    });

    const targetView = document.getElementById(`view-${tabId}`);
    if (targetView) {
      targetView.classList.add("active");
    }

    if (tabId === "dashboard") {
      DashboardView.update(this.state.students);
    } else if (tabId === "register") {
      this.openAddStudentModal();
    } else if (tabId === "directory") {
      DirectoryView.renderTable();
    } else if (tabId === "dropped") {
      if (typeof DroppedStudentsView !== "undefined" && DroppedStudentsView.renderTable) {
        DroppedStudentsView.renderTable();
      }
    } else if (tabId === "graduated") {
      if (typeof GraduatedStudentsView !== "undefined" && GraduatedStudentsView.renderTable) {
        GraduatedStudentsView.renderTable();
      }
    } else if (tabId === "attendance") {
      AttendanceView.renderTable();
    } else if (tabId === "timetable") {
      if (typeof TimetableLabView !== "undefined") {
        const mount = document.getElementById("timetableContentMount");
        if (mount) {
          mount.innerHTML = TimetableLabView.activeTab === 'timetable' ? TimetableLabView.renderTimetableSection() : TimetableLabView.renderLabMapSection();
          TimetableLabView.initEvents();
        }
      }
    } else if (tabId === "exams") {
      ExamsView.renderTable();
    } else if (tabId === "fees") {
      if (typeof FeesView !== "undefined") FeesView.renderTable();
    } else if (tabId === "certificates") {
      if (typeof CertificatesView !== "undefined") CertificatesView.renderTable();
    } else if (tabId === "resources") {
      if (typeof ResourcesView !== "undefined") {
        const container = document.getElementById("resourcesContentContainer");
        if (container) container.innerHTML = ResourcesView.renderResourcesGrid();
      }
    } else if (tabId === "settings") {
      if (typeof SettingsView !== "undefined" && SettingsView.refreshTeachersGrid) {
        SettingsView.refreshTeachersGrid();
      }
    }

    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {}
  },

  // Update sidebar counter badges
  updateSidebarCounters() {
    const droppedBadge = document.getElementById("sidebarDroppedCount");
    if (droppedBadge && typeof DroppedStudentsView !== "undefined" && DroppedStudentsView.getDroppedStudents) {
      droppedBadge.textContent = `${DroppedStudentsView.getDroppedStudents().length}`;
    }
    const gradBadge = document.getElementById("sidebarGraduatedCount");
    if (gradBadge && typeof GraduatedStudentsView !== "undefined" && GraduatedStudentsView.getGraduatedStudents) {
      gradBadge.textContent = `${GraduatedStudentsView.getGraduatedStudents().length}`;
    }
  },

  // Calculate days studied and duration info for student
  getStudentDaysInfo(student) {
    if (!student) {
      return { daysElapsed: 0, daysRemaining: 45, percent: 0, totalCourseDays: 45, startDate: "—", endDate: "—" };
    }
    const startStr = student.StartDate || student.CreatedAt || new Date().toISOString().split("T")[0];
    const startDate = new Date(startStr);
    const now = new Date();
    startDate.setHours(0, 0, 0, 0);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let endDate;
    if (student.EndDate) {
      endDate = new Date(student.EndDate);
      endDate.setHours(0, 0, 0, 0);
    } else {
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + (APP_CONFIG.DEFAULT_COURSE_DURATION_DAYS || 45));
      endDate.setHours(0, 0, 0, 0);
    }

    const diffTime = today.getTime() - startDate.getTime();
    const daysElapsed = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    const totalDiff = Math.max(1, Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const daysRemaining = Math.max(0, Math.floor((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    const percent = Math.min(100, Math.max(0, Math.round((daysElapsed / totalDiff) * 100)));

    return {
      daysElapsed,
      daysRemaining,
      percent,
      totalCourseDays: totalDiff,
      startDate: startStr,
      endDate: endDate.toISOString().split("T")[0]
    };
  },

  // Open attendance view and filter by student's course
  openAttendanceForStudent(studentId) {
    const student = this.state.students.find(s => String(s.ID).trim() === String(studentId).trim());
    this.switchTab("attendance");
    if (student && typeof AttendanceView !== "undefined" && AttendanceView.filters) {
      AttendanceView.filters.course = student.Course || "";
      const sel = document.getElementById("attFilterCourse");
      if (sel) sel.value = student.Course || "";
      AttendanceView.renderTable();
    }
  },

  // Search & Filter Algorithm
  applyFiltersAndSearch() {
    const query = this.state.searchQuery;
    const { grade, course, gender, shift, status } = this.state.filters;

    this.state.filteredStudents = this.state.students.filter(s => {
      const matchQuery = !query || 
        (s.NameKh && s.NameKh.toLowerCase().includes(query)) ||
        (s.NameEn && s.NameEn.toLowerCase().includes(query)) ||
        (s.ID && s.ID.toLowerCase().includes(query)) ||
        (s.Phone && s.Phone.includes(query)) ||
        (s.Address && s.Address.toLowerCase().includes(query));

      const matchGrade = !grade || (s.Grade && s.Grade.includes(grade));
      const matchCourse = !course || (s.Course && s.Course.toLowerCase().includes(course.toLowerCase()));
      const matchGender = !gender || s.Gender === gender;
      const matchShift = !shift || (s.Shift && s.Shift.includes(shift));
      const matchStatus = !status || s.Status === status;

      return matchQuery && matchGrade && matchCourse && matchGender && matchShift && matchStatus;
    });

    this.applySorting();
  },

  applySorting() {
    const { field, order } = this.state.sort;
    const factor = order === "asc" ? 1 : -1;

    this.state.filteredStudents.sort((a, b) => {
      // 1. Numeric ID Sorting (STU-1023 vs STU-1018)
      if (field === "ID") {
        const numA = parseInt((a.ID || "").replace(/\D/g, ""), 10) || 0;
        const numB = parseInt((b.ID || "").replace(/\D/g, ""), 10) || 0;
        if (numA !== numB) {
          return (numA - numB) * factor;
        }
      }

      // 2. Date/Timestamp Sorting
      if (field === "CreatedAt" || field === "StartDate") {
        const timeA = new Date(a[field] || a.CreatedAt || a.StartDate || 0).getTime();
        const timeB = new Date(b[field] || b.CreatedAt || b.StartDate || 0).getTime();
        if (timeA !== timeB) {
          return (timeA - timeB) * factor;
        }
      }

      // 3. General field string comparison
      const valA = (a[field] || "").toString().toLowerCase();
      const valB = (b[field] || "").toString().toLowerCase();
      const cmp = valA.localeCompare(valB, "km") * factor;
      if (cmp !== 0) return cmp;

      // Tie-breaker: Always place newly added student (highest numeric ID) at the top!
      const numA = parseInt((a.ID || "").replace(/\D/g, ""), 10) || 0;
      const numB = parseInt((b.ID || "").replace(/\D/g, ""), 10) || 0;
      return numB - numA;
    });

    // Update header icons
    document.querySelectorAll(".sortable-th").forEach(th => {
      const icon = th.querySelector(".sort-icon");
      if (th.getAttribute("data-sort") === field) {
        th.classList.add("active-sort");
        if (icon) {
          icon.className = `sort-icon fa-solid fa-arrow-${order === "asc" ? "up" : "down"}`;
        }
      } else {
        th.classList.remove("active-sort");
        if (icon) {
          icon.className = "sort-icon fa-solid fa-sort text-muted";
        }
      }
    });
  },

  getShiftLabel(shiftId) {
    const found = (APP_CONFIG.shifts || []).find(s => s.id === shiftId || s.label === shiftId);
    return found ? found.label : (shiftId || "—");
  },

  getCourseBadgeClass(courseName) {
    if (!courseName) return "";
    const c = courseName.toLowerCase();
    if (c.includes("typing")) return "badge-course-typing";
    if (c.includes("word")) return "badge-course-word";
    if (c.includes("excel")) return "badge-course-excel";
    if (c.includes("powerpoint")) return "badge-course-powerpoint";
    return "badge-course-english";
  },

  getCourseIcon(courseName) {
    if (!courseName) return "";
    const c = courseName.toLowerCase();
    if (c.includes("typing")) return '<i class="fa-solid fa-keyboard"></i>';
    if (c.includes("word")) return '<i class="fa-solid fa-file-word"></i>';
    if (c.includes("excel")) return '<i class="fa-solid fa-file-excel"></i>';
    if (c.includes("powerpoint")) return '<i class="fa-solid fa-file-powerpoint"></i>';
    return '<i class="fa-solid fa-language"></i>';
  },

  filterByCourse(courseKeyword) {
    this.switchTab("directory");
    this.state.filters.course = courseKeyword;
    const courseSelect = document.getElementById("filterCourse");
    if (courseSelect) {
      const matchingOpt = Array.from(courseSelect.options).find(opt => opt.value.toLowerCase().includes(courseKeyword.toLowerCase()));
      courseSelect.value = matchingOpt ? matchingOpt.value : "";
    }
    this.state.pagination.page = 1;
    this.applyFiltersAndSearch();
    DirectoryView.renderTable();
  },

  filterByGrade(gradeKeyword) {
    this.switchTab("directory");
    this.state.filters.grade = gradeKeyword;
    const gradeSelect = document.getElementById("filterGrade");
    if (gradeSelect) gradeSelect.value = gradeKeyword;
    this.state.pagination.page = 1;
    this.applyFiltersAndSearch();
    DirectoryView.renderTable();
  },

  changePage(page) {
    this.state.pagination.page = page;
    DirectoryView.renderTable();
  },

  // Enrollment Wizard State & Methods
  enrollStep: 1,

  getNextStudentId() {
    const students = StudentAPI.getLocalStudents() || [];
    const prefix = APP_CONFIG.studentIdPrefix || "TX";
    const maxIdNum = students.reduce((max, s) => {
      const match = (s && s.ID ? s.ID : "").match(/(?:TX|STU)-(\d+)/i);
      return match ? Math.max(max, parseInt(match[1], 10)) : max;
    }, 1000);
    return `${prefix}-${maxIdNum + 1}`;
  },

  refreshEnrollStudentId() {
    const nextId = this.getNextStudentId();
    const idInput = document.getElementById("modalAddStudentIdInput");
    if (idInput) idInput.value = nextId;
    const receiptInput = document.getElementById("enrollInputReceiptNo");
    if (receiptInput) receiptInput.value = `INV-2026-${String(nextId).replace(/\D/g, "").padStart(4, "0")}`;
    this.showToast(`បានកំណត់អត្តលេខបន្ទាប់: ${nextId}`, "info");
  },

  dismissEnrollAlert() {
    const alert = document.getElementById("enrollWelcomeAlert");
    if (alert) alert.classList.add("hidden");
  },

  toggleEnrollFullscreen() {
    const card = document.querySelector("#addStudentModal .modal-card");
    const btn = document.getElementById("btnToggleEnrollFullscreen");
    if (card) {
      card.classList.toggle("windowed");
      const isWindowed = card.classList.contains("windowed");
      if (btn) {
        btn.innerHTML = isWindowed ? `<i class="fa-solid fa-expand"></i>` : `<i class="fa-solid fa-compress"></i>`;
        btn.title = isWindowed ? "ពង្រីកពេញអេក្រង់" : "បង្រួមផ្ទាំង";
      }
    }
  },

  goToEnrollStep(step) {
    // Validate before moving forward
    if (step > 1 && this.enrollStep === 1) {
      const nameKhInput = document.getElementById("enrollInputNameKh");
      if (!nameKhInput || !nameKhInput.value.trim()) {
        this.showToast("សូមបញ្ចូលឈ្មោះសិស្សជាភាសាខ្មែរ!", "warning");
        if (nameKhInput) nameKhInput.focus();
        return;
      }
    }
    if (step > 2 && this.enrollStep === 2) {
      const courseSelect = document.getElementById("modalAddCourseSelect");
      if (!courseSelect || !courseSelect.value) {
        this.showToast("សូមជ្រើសរើសវគ្គសិក្សាកុំព្យូទ័រ!", "warning");
        if (courseSelect) courseSelect.focus();
        return;
      }
    }

    this.enrollStep = step;
    this.updateEnrollStepUI();
  },

  nextEnrollStep() {
    if (this.enrollStep < 3) {
      this.goToEnrollStep(this.enrollStep + 1);
    }
  },

  prevEnrollStep() {
    if (this.enrollStep > 1) {
      this.goToEnrollStep(this.enrollStep - 1);
    }
  },

  updateEnrollStepUI() {
    // 1. Update Stepper Nodes & Progress Bar
    const progressPercent = ((this.enrollStep - 1) / 2) * 100;
    const progressBar = document.getElementById("enrollStepperProgress");
    if (progressBar) progressBar.style.width = `${progressPercent}%`;

    for (let i = 1; i <= 3; i++) {
      const node = document.getElementById(`enrollStepNode${i}`);
      const section = document.getElementById(`enrollStepSection${i}`);
      if (node) {
        node.classList.remove("active", "completed");
        if (i === this.enrollStep) {
          node.classList.add("active");
        } else if (i < this.enrollStep) {
          node.classList.add("completed");
        }
      }
      if (section) {
        section.style.display = (i === this.enrollStep) ? "block" : "none";
      }
    }

    // 2. Update Subheader Title & Icon
    const subheaderIcon = document.getElementById("enrollSubheaderIcon");
    const subheaderText = document.getElementById("enrollSubheaderText");
    if (this.enrollStep === 1) {
      if (subheaderIcon) subheaderIcon.className = "fa-regular fa-user";
      if (subheaderText) subheaderText.textContent = "ព័ត៌មានអំពីសិស្ស";
    } else if (this.enrollStep === 2) {
      if (subheaderIcon) subheaderIcon.className = "fa-solid fa-graduation-cap";
      if (subheaderText) subheaderText.textContent = "ព័ត៌មានវគ្គសិក្សាកុំព្យូទ័រ";
    } else if (this.enrollStep === 3) {
      if (subheaderIcon) subheaderIcon.className = "fa-solid fa-file-invoice-dollar";
      if (subheaderText) subheaderText.textContent = "ព័ត៌មានថ្លៃសិក្សា និងការទូទាត់";
      this.calculateEnrollFees();
    }

    // 3. Update Footer Buttons
    const footerLeft = document.getElementById("enrollFooterLeft");
    const nextBtn = document.getElementById("btnEnrollNextStep");
    const submitBtn = document.getElementById("btnEnrollSubmit");

    if (footerLeft) {
      if (this.enrollStep === 1) {
        footerLeft.innerHTML = `
          <button type="button" class="btn-enroll-cancel" data-close-modal="addStudentModal">
            <i class="fa-solid fa-xmark"></i>
            <span>បោះបង់</span>
          </button>
        `;
      } else {
        footerLeft.innerHTML = `
          <button type="button" class="btn-enroll-prev" onclick="App.prevEnrollStep()">
            <i class="fa-solid fa-arrow-left"></i>
            <span>ថយក្រោយ</span>
          </button>
        `;
      }
    }

    if (nextBtn && submitBtn) {
      if (this.enrollStep === 1) {
        nextBtn.style.display = "inline-flex";
        nextBtn.innerHTML = `<span>បន្ទាប់: ព័ត៌មានការសិក្សា</span> <i class="fa-solid fa-arrow-right"></i>`;
        submitBtn.style.display = "none";
      } else if (this.enrollStep === 2) {
        nextBtn.style.display = "inline-flex";
        nextBtn.innerHTML = `<span>បន្ទាប់: ព័ត៌មានហិរញ្ញវត្ថុ</span> <i class="fa-solid fa-arrow-right"></i>`;
        submitBtn.style.display = "none";
      } else if (this.enrollStep === 3) {
        nextBtn.style.display = "none";
        submitBtn.style.display = "inline-flex";
      }
    }
  },

  calculateEnrollFees() {
    const totalFeeInput = document.getElementById("enrollInputTotalFee");
    const displayTotalFee = document.getElementById("enrollDisplayTotalFee");
    const paidFeeInput = document.getElementById("enrollInputPaidFee");
    const displayBalance = document.getElementById("enrollDisplayBalance");
    const balanceCard = document.getElementById("enrollKpiBalanceCard");
    const statusSelect = document.getElementById("enrollSelectPaymentStatus");

    // Standard fee is $50.00
    const totalFee = 50;
    if (totalFeeInput) totalFeeInput.value = totalFee;
    if (displayTotalFee) displayTotalFee.textContent = `${totalFee.toFixed(2)}`;

    const paidFee = paidFeeInput ? (parseFloat(paidFeeInput.value) || 0) : 50;
    const balance = Math.max(0, totalFee - paidFee);

    if (displayBalance) displayBalance.textContent = `${balance.toFixed(2)}`;
    if (balanceCard) {
      if (balance === 0) {
        balanceCard.className = "enroll-kpi-card enroll-kpi-balance zero";
      } else {
        balanceCard.className = "enroll-kpi-card enroll-kpi-balance";
      }
    }

    if (statusSelect) {
      if (paidFee >= totalFee) {
        statusSelect.value = "Paid";
      } else if (paidFee > 0) {
        statusSelect.value = "Partial";
      } else {
        statusSelect.value = "Pending";
      }
    }
  },

  // Open Add Student Popup Modal
  openAddStudentModal() {
    const form = document.getElementById("modalAddStudentForm");
    if (form) {
      form.reset();
    }
    const avatarPreview = document.getElementById("modalAddAvatarPreview");
    if (avatarPreview) {
      avatarPreview.src = "";
      avatarPreview.style.display = "none";
    }
    const placeholder = document.getElementById("enrollAvatarPlaceholder");
    if (placeholder) {
      placeholder.style.display = "flex";
    }
    const avatarInput = document.getElementById("modalAddAvatarInput");
    if (avatarInput) {
      avatarInput.value = "";
    }

    // Reset alert notice
    const alert = document.getElementById("enrollWelcomeAlert");
    if (alert) alert.classList.remove("hidden");

    // Reset Next Student ID
    const nextId = this.getNextStudentId();
    const idInput = document.getElementById("modalAddStudentIdInput");
    if (idInput) idInput.value = nextId;
    const receiptInput = document.getElementById("enrollInputReceiptNo");
    if (receiptInput) receiptInput.value = `INV-2026-${String(nextId).replace(/\D/g, "").padStart(4, "0")}`;

    // Reset step to 1
    this.enrollStep = 1;
    this.updateEnrollStepUI();

    ModalsComponent.open("addStudentModal");
  },

  // Handle Modal Add Student Submission
  async handleModalAddStudentSubmit(form) {
    const submitBtn = document.getElementById("btnEnrollSubmit") || form.querySelector("button[type='submit']");
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : "";

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> កំពុងរក្សាទុកក្នុង Firebase...`;
      }

      const formData = new FormData(form);
      const studentId = formData.get("studentId")?.trim() || this.getNextStudentId();
      const studentData = {
        ID: studentId,
        NameKh: formData.get("nameKh")?.trim() || "",
        NameEn: formData.get("nameEn")?.trim() || "",
        NameCh: formData.get("nameCh")?.trim() || "",
        Gender: formData.get("gender") || "ប្រុស",
        DOB: formData.get("dob") || "",
        Nationality: formData.get("nationality")?.trim() || "ខ្មែរ",
        Phone: formData.get("phone")?.trim() || "",
        EmergencyPhone: formData.get("emergencyPhone")?.trim() || "",
        HealthNotes: formData.get("healthNotes")?.trim() || "",
        Address: formData.get("address")?.trim() || "រាជធានីភ្នំពេញ",
        CurrentAddress: formData.get("currentAddress")?.trim() || "",
        Grade: "ថ្នាក់កុំព្យូទ័រ",
        Course: formData.get("course")?.trim() || "Typing",
        Shift: formData.get("shift") || "ព្រឹក",
        Status: formData.get("status") || "Active",
        StartDate: formData.get("startDate") || new Date().toISOString().split("T")[0],
        EndDate: formData.get("endDate") || "",
        PIN: formData.get("pin")?.trim() || "123",
        Avatar: formData.get("avatar")?.trim() || document.getElementById("modalAddAvatarPreview")?.src || "",
        CreatedAt: new Date().toISOString()
      };

      if (!studentData.NameKh) {
        this.goToEnrollStep(1);
        throw new Error("សូមបញ្ចូលឈ្មោះសិស្សជាភាសាខ្មែរ!");
      }
      if (!studentData.Course) {
        this.goToEnrollStep(2);
        throw new Error("សូមជ្រើសរើសវគ្គសិក្សាកុំព្យូទ័រ!");
      }

      const created = await StudentAPI.createStudent(studentData);

      // Record fee in StudentAPI and sync to Firebase
      try {
        const totalAmount = parseFloat(formData.get("totalFee")) || 50;
        const paidAmount = parseFloat(formData.get("paidFee")) || 50;
        const fees = StudentAPI.getAllFees();
        fees[created.ID] = {
          studentId: created.ID,
          studentNameKh: created.NameKh,
          studentNameEn: created.NameEn || "",
          course: created.Course || "Typing",
          totalAmount: totalAmount,
          paidAmount: paidAmount,
          discount: 0,
          balance: Math.max(0, totalAmount - paidAmount),
          status: formData.get("paymentStatus") || (paidAmount >= totalAmount ? "Paid" : "Partial"),
          receiptNo: formData.get("receiptNo") || `INV-2026-${String(created.ID).replace(/\D/g, "").padStart(4, "0")}`,
          date: created.StartDate || new Date().toISOString().split("T")[0],
          paymentMethod: formData.get("paymentMethod") || "ABA KHQR",
          note: formData.get("paymentNote") || "បង់ថ្លៃសិក្សាពេលចុះឈ្មោះ",
          updatedAt: new Date().toISOString()
        };
        StudentAPI.saveAllFees(fees);
        if (StudentAPI.isCloudConnected()) {
          firebase.database().ref(`fees/${created.ID}`).set(fees[created.ID]).catch(e => console.warn(e));
        }
      } catch (fe) {
        console.warn("Fee record notice:", fe);
      }

      this.showToast(`បានបញ្ចូលទិន្នន័យសិស្ស ${created.NameKh} (${created.ID}) ជោគជ័យ!`, "success");
      this.triggerConfetti();

      // Trigger Telegram notification for new student enrollment
      if (typeof TelegramService !== "undefined") {
        const teacher = (typeof AuthService !== "undefined" && AuthService.getCurrentUser()) ? AuthService.getCurrentUser().nameKh : null;
        TelegramService.notifyNewStudent(created, teacher);
      }

      ModalsComponent.close("addStudentModal");
      form.reset();

      // Ensure sort is newest first (ID desc) so newly added student is right at the top
      this.state.sort.field = "ID";
      this.state.sort.order = "desc";
      this.state.pagination.page = 1;

      // Refresh data dynamically
      await this.loadData(false);
    } catch (err) {
      this.showToast(err.message || "មានបញ្ហាក្នុងការរក្សាទុក!", "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }
  },

  // Student CRUD Operations
  async handleRegisterFormSubmit(form) {
    const submitBtn = form.querySelector("button[type='submit']");
    const originalBtnHtml = submitBtn.innerHTML;

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> កំពុងរក្សាទុក...`;

      const formData = new FormData(form);
      const studentData = {
        ID: "",
        NameKh: formData.get("nameKh")?.trim() || "",
        NameEn: formData.get("nameEn")?.trim() || "",
        Gender: formData.get("gender") || "ប្រុស",
        Grade: "ថ្នាក់កុំព្យូទ័រ",
        Phone: formData.get("phone")?.trim() || "",
        Course: formData.get("course")?.trim() || "Typing",
        Shift: formData.get("shift") || "ព្រឹក",
        Status: formData.get("status") || "Active",
        StartDate: formData.get("startDate") || new Date().toISOString().split("T")[0],
        EndDate: formData.get("endDate") || "",
        Address: formData.get("address")?.trim() || "",
        PIN: formData.get("pin")?.trim() || "123",
        Avatar: formData.get("avatar")?.trim() || document.getElementById("avatarPreview")?.src || "",
        CreatedAt: new Date().toISOString()
      };

      if (!studentData.NameKh) {
        throw new Error("សូមបញ្ចូលឈ្មោះសិស្សជាភាសាខ្មែរ!");
      }
      if (!studentData.Course) {
        throw new Error("សូមជ្រើសរើសវគ្គសិក្សាកុំព្យូទ័រ!");
      }

      const created = await StudentAPI.createStudent(studentData);
      this.showToast(`បានចុះឈ្មោះសិស្ស ${created.NameKh} (${created.ID}) ជោគជ័យ!`, "success");
      this.triggerConfetti();

      // Trigger Telegram notification for new student enrollment
      if (typeof TelegramService !== "undefined") {
        const teacher = (typeof AuthService !== "undefined" && AuthService.getCurrentUser()) ? AuthService.getCurrentUser().nameKh : null;
        TelegramService.notifyNewStudent(created, teacher);
      }

      RegisterView.reset();

      // Ensure sort is newest first (ID desc) so newly added student is right at the top
      this.state.sort.field = "ID";
      this.state.sort.order = "desc";
      this.state.pagination.page = 1;

      await this.loadData(false);
    } catch (err) {
      this.showToast(err.message || "មានបញ្ហាក្នុងការរក្សាទុក!", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }
  },

  async handleEditFormSubmit(form) {
    const submitBtn = form.querySelector("button[type='submit']");
    const originalBtnHtml = submitBtn.innerHTML;

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> កំពុងរក្សាទុក...`;

      const formData = new FormData(form);
      const studentData = {
        ID: formData.get("id")?.trim(),
        NameKh: formData.get("nameKh")?.trim() || "",
        NameEn: formData.get("nameEn")?.trim() || "",
        Gender: formData.get("gender") || "ប្រុស",
        DOB: formData.get("dob") || "",
        Nationality: formData.get("nationality")?.trim() || "ខ្មែរ",
        Phone: formData.get("phone")?.trim() || "",
        HealthNotes: formData.get("healthNotes")?.trim() || "",
        Grade: "ថ្នាក់កុំព្យូទ័រ",
        Course: formData.get("course")?.trim() || "Typing",
        Shift: formData.get("shift") || "ព្រឹក",
        Status: formData.get("status") || "Active",
        StartDate: formData.get("startDate") || formData.get("createdAt") || new Date().toISOString().split("T")[0],
        EndDate: formData.get("endDate") || "",
        Address: formData.get("address")?.trim() || "រាជធានីភ្នំពេញ",
        PIN: formData.get("pin")?.trim() || "123",
        Avatar: formData.get("avatar")?.trim() || "",
        CreatedAt: formData.get("createdAt") || new Date().toISOString().split("T")[0]
      };

      if (!studentData.NameKh) {
        this.goToEditStep(1);
        throw new Error("សូមបញ្ចូលឈ្មោះសិស្សជាភាសាខ្មែរ!");
      }
      if (!studentData.Course) {
        this.goToEditStep(2);
        throw new Error("សូមជ្រើសរើសវគ្គសិក្សាកុំព្យូទ័រ!");
      }

      await StudentAPI.updateStudent(studentData);
      this.showToast("បានកែប្រែទិន្នន័យសិស្សដោយជោគជ័យ!", "success");
      ModalsComponent.close("editModal");
      await this.loadData(false);
    } catch (err) {
      this.showToast(err.message || "មានកំហុសក្នុងការកែប្រែ!", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }
  },

  viewStudentDetails(studentId) {
    const student = this.state.students.find(s => String(s.ID).trim() === String(studentId).trim());
    if (!student) return;

    this.state.selectedStudent = student;

    // 1. Top Profile Summary Card
    const profAvatar = document.getElementById("profileHeaderAvatar");
    if (profAvatar) profAvatar.src = student.Avatar || this.getDefaultAvatar(student.Gender);

    const profName = document.getElementById("profileHeaderNameKh");
    if (profName) profName.textContent = student.NameKh;

    const isDropped = (student.Status === "Dropped" || student.Status === "Drop" || student.isBlocked === true);
    const profId = document.getElementById("profileHeaderId");
    if (profId) {
      if (isDropped) {
        profId.innerHTML = `${student.ID} <span style="color: #ef4444; font-size: 0.72rem; background: rgba(239, 68, 68, 0.15); padding: 2px 6px; border-radius: 4px; margin-left: 4px; font-weight: 700;"><i class="fa-solid fa-lock"></i> ប្រើលែងកើត</span>`;
      } else if (student.Status === "Graduated") {
        profId.innerHTML = `${student.ID} <span style="color: #10b981; font-size: 0.72rem; background: rgba(16, 185, 129, 0.15); padding: 2px 6px; border-radius: 4px; margin-left: 4px; font-weight: 700;"><i class="fa-solid fa-user-graduate"></i> Alumni</span>`;
      } else {
        profId.textContent = student.ID;
      }
    }

    const profCourse = document.getElementById("profileHeaderCourse");
    if (profCourse) {
      profCourse.textContent = student.Course ? (student.Course + (student.Shift ? ` (${student.Shift})` : '')) : (student.Grade || 'ថ្នាក់កុំព្យូទ័រ');
    }

    const statusToggleText = document.getElementById("profileBtnStatusText");
    if (statusToggleText) {
      statusToggleText.textContent = student.Status === "Inactive" ? "បន្តការសិក្សា" : "ផ្អាកការសិក្សា";
    }

    // Toggle button visibilities based on status
    const profMarkDrop = document.getElementById("profileBtnMarkDrop");
    const profMarkGrad = document.getElementById("profileBtnMarkGraduate");
    const menuItemReactivate = document.getElementById("menuItemReactivateStudent");
    if (profMarkDrop) profMarkDrop.style.display = isDropped ? "none" : "inline-flex";
    if (profMarkGrad) profMarkGrad.style.display = (student.Status === "Graduated" || isDropped) ? "none" : "inline-flex";
    if (menuItemReactivate) menuItemReactivate.style.display = isDropped ? "flex" : "none";

    // 2. Financial Summary & Payment History
    const fee = typeof StudentAPI !== "undefined" ? StudentAPI.getStudentFee(student.ID) : null;
    const defaultPrice = 250;
    const tuition = fee ? (parseFloat(fee.totalAmount) || defaultPrice) : defaultPrice;
    const paid = fee ? (parseFloat(fee.paidAmount) || tuition) : tuition;
    const balance = Math.max(0, tuition - paid);
    const feeStatus = balance <= 0 ? "Paid" : (paid > 0 ? "Partial" : "Unpaid");

    const profFeeStatus = document.getElementById("profileHeaderFeeStatus");
    if (profFeeStatus) {
      if (feeStatus === "Paid") {
        profFeeStatus.className = "profile-badge-pill profile-badge-fee-paid";
        profFeeStatus.innerHTML = `<i class="fa-solid fa-circle-info"></i> <i class="fa-solid fa-check"></i> <span>បង់រួចរាល់</span>`;
      } else if (feeStatus === "Partial") {
        profFeeStatus.className = "profile-badge-pill profile-badge-fee-partial";
        profFeeStatus.innerHTML = `<i class="fa-solid fa-circle-info"></i> <span>នៅខ្វះ ${balance.toFixed(2)}</span>`;
      } else {
        profFeeStatus.className = "profile-badge-pill profile-badge-fee-unpaid";
        profFeeStatus.innerHTML = `<i class="fa-solid fa-circle-info"></i> <span>មិនទាន់បង់</span>`;
      }
    }

    // Blue Financial Summary Card (សង្ខេបហិរញ្ញវត្ថុ)
    const elCardTuition = document.getElementById("financeCardTuition");
    if (elCardTuition) elCardTuition.textContent = `${tuition.toFixed(2)}`;
    const elCardMaterials = document.getElementById("financeCardMaterials");
    if (elCardMaterials) elCardMaterials.textContent = "$0.00";
    const elCardAdmin = document.getElementById("financeCardAdmin");
    if (elCardAdmin) elCardAdmin.textContent = "$0.00";
    const elCardTotal = document.getElementById("financeCardTotal");
    if (elCardTotal) elCardTotal.textContent = `${tuition.toFixed(2)}`;
    const elCardPaid = document.getElementById("financeCardPaid");
    if (elCardPaid) elCardPaid.textContent = `${paid.toFixed(2)}`;
    const elCardBalance = document.getElementById("financeCardBalance");
    if (elCardBalance) elCardBalance.textContent = `${balance.toFixed(2)}`;

    // Payment History Table & Badges
    const allFees = typeof StudentAPI !== "undefined" ? StudentAPI.getAllFees() : {};
    const rawFee = allFees[student.ID];
    const payments = (rawFee && Array.isArray(rawFee.payments) && rawFee.payments.length > 0)
      ? rawFee.payments
      : [
          {
            stage: "#1",
            date: fee?.date || student.StartDate || new Date().toISOString().split("T")[0],
            label: "បង់ដំបូង (Initial)",
            months: "12 ខែ",
            method: fee?.paymentMethod || "Cash",
            amount: paid,
            total: tuition,
            status: balance <= 0 ? "រួចរាល់" : "នៅខ្វះ",
            receiver: "System"
          }
        ];

    const elCountBadge = document.getElementById("financeCountBadge");
    if (elCountBadge) elCountBadge.innerHTML = `<i class="fa-regular fa-newspaper"></i> <span>${payments.length} លើក</span>`;
    const elTotalBadge = document.getElementById("financeTotalPaidBadge");
    if (elTotalBadge) elTotalBadge.innerHTML = `<i class="fa-solid fa-dollar-sign"></i> <span>${paid.toFixed(2)}</span>`;

    const tbody = document.getElementById("financePaymentTableBody");
    if (tbody) {
      tbody.innerHTML = payments.map((p, idx) => `
        <tr>
          <td><span class="badge" style="background: #e0f2fe; color: #0369a1; font-weight: 700; border-radius: 6px; padding: 2px 8px;">${p.stage || `#${idx + 1}`}</span></td>
          <td>
            <div style="font-weight: 600; color: var(--text-main);">${p.date}</div>
            <span style="font-size: 0.72rem; background: #e0f2fe; color: #0284c7; padding: 1px 6px; border-radius: 4px;">${p.label || 'បង់បន្ថែម'}</span>
          </td>
          <td>
            <div style="font-weight: 600;"><i class="fa-solid fa-clock-rotate-left text-muted"></i> ${p.months || '1 ខែ'}</div>
            <span class="text-xs text-muted">${p.method || 'Cash'}</span>
          </td>
          <td>
            <div style="font-size: 0.95rem; font-weight: 800; color: #059669; font-family: 'Plus Jakarta Sans', monospace;">${parseFloat(p.amount || 0).toFixed(2)}</div>
            <div class="text-xs text-muted">សរុប: ${parseFloat(p.total || tuition).toFixed(2)} <span class="badge ${p.status === 'រួចរាល់' ? 'status-active' : 'status-pending'}" style="font-size: 0.68rem; padding: 1px 5px;">${p.status || 'រួចរាល់'}</span></div>
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="width: 22px; height: 22px; border-radius: 50%; background: #0284c7; color: white; font-size: 10px; display: inline-flex; align-items: center; justify-content: center; font-weight: 700;">SY</span>
              <span style="font-weight: 600; font-size: 0.82rem;">${p.receiver || 'System'}</span>
            </div>
          </td>
          <td style="text-align: right;">
            <div class="history-action-btns" style="justify-content: flex-end;">
              <button type="button" class="btn-tbl-action view" onclick="FeesView.printOfficialReceipt('${student.ID}')" title="មើលវិក្កយបត្រ"><i class="fa-regular fa-eye"></i></button>
              <button type="button" class="btn-tbl-action edit" onclick="FeesView.openRecordPaymentModal('${student.ID}')" title="កែប្រែ"><i class="fa-solid fa-pen"></i></button>
              <button type="button" class="btn-tbl-action print" onclick="FeesView.printOfficialReceipt('${student.ID}')" title="បោះពុម្ព"><i class="fa-solid fa-print"></i></button>
              <button type="button" class="btn-tbl-action delete" onclick="App.deleteStudentPaymentRow('${student.ID}', ${idx})" title="លុប"><i class="fa-regular fa-trash-can"></i></button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    // 3. Tab: ព័ត៌មានទូទៅ (General Info)
    const detailAvatar = document.getElementById("modalDetailAvatar");
    if (detailAvatar) detailAvatar.src = student.Avatar || this.getDefaultAvatar(student.Gender);
    const detNameKh = document.getElementById("modalDetailNameKh");
    if (detNameKh) detNameKh.textContent = student.NameKh;
    const detNameEn = document.getElementById("modalDetailNameEn");
    if (detNameEn) detNameEn.textContent = student.NameEn || "—";
    const detId = document.getElementById("modalDetailId");
    if (detId) detId.textContent = student.ID;
    const detGender = document.getElementById("modalDetailGender");
    if (detGender) detGender.textContent = student.Gender;
    const dobEl = document.getElementById("modalDetailDob");
    if (dobEl) dobEl.textContent = student.Dob || "—";
    const detGrade = document.getElementById("modalDetailGrade");
    if (detGrade) detGrade.textContent = student.Grade || "ថ្នាក់កុំព្យូទ័រ";
    const courseEl = document.getElementById("modalDetailCourse");
    if (courseEl) {
      if (student.Course) {
        courseEl.className = `badge-course ${this.getCourseBadgeClass(student.Course)}`;
        courseEl.innerHTML = `${this.getCourseIcon(student.Course)} ${this.escapeHtml(student.Course)}`;
        courseEl.style.display = "inline-flex";
      } else {
        courseEl.textContent = "—";
        courseEl.className = "text-muted";
        courseEl.style.display = "inline";
      }
    }
    const detShift = document.getElementById("modalDetailShift");
    if (detShift) detShift.textContent = this.getShiftLabel(student.Shift);
    const detPhone = document.getElementById("modalDetailPhone");
    if (detPhone) detPhone.textContent = student.Phone || "—";
    const guardPhoneEl = document.getElementById("modalDetailGuardianPhone");
    if (guardPhoneEl) guardPhoneEl.textContent = student.GuardianPhone || "—";
    const loginUserEl = document.getElementById("modalDetailLoginUser");
    if (loginUserEl) loginUserEl.textContent = student.ID || "—";
    const loginPinEl = document.getElementById("modalDetailLoginPin");
    if (loginPinEl) loginPinEl.textContent = student.PIN || student.pin || "123";
    const detAddr = document.getElementById("modalDetailAddress");
    if (detAddr) detAddr.textContent = student.Address || "—";
    const detCreated = document.getElementById("modalDetailCreatedAt");
    if (detCreated) detCreated.textContent = student.CreatedAt || "—";

    const statusEl = document.getElementById("modalDetailStatus");
    if (statusEl) {
      statusEl.className = `status-indicator status-${(student.Status || 'Active').toLowerCase()}`;
      statusEl.textContent = student.Status === 'Active' ? 'កំពុងសិក្សា' : student.Status === 'Graduated' ? 'បញ្ចប់ការសិក្សា' : 'ផ្អាក';
    }

    // Study Duration & Attendance Stats Breakdown
    const daysInfo = this.getStudentDaysInfo(student);
    const attSummary = StudentAPI.getStudentAttendanceSummary(student.ID);

    const elDaysStudied = document.getElementById("modalDetailDaysStudied");
    if (elDaysStudied) elDaysStudied.innerHTML = `<i class="fa-regular fa-calendar-days"></i> បានរៀន ${daysInfo.daysElapsed} ថ្ងៃ (${daysInfo.percent}%)`;

    const elProgressBar = document.getElementById("modalDetailProgressBar");
    if (elProgressBar) elProgressBar.style.width = `${daysInfo.percent}%`;

    const elStartDate = document.getElementById("modalDetailStartDate");
    if (elStartDate) elStartDate.textContent = daysInfo.startDate || "—";

    const elDaysRemaining = document.getElementById("modalDetailDaysRemaining");
    if (elDaysRemaining) elDaysRemaining.textContent = `បានរៀន ${daysInfo.daysElapsed} ថ្ងៃ`;

    const elEndDate = document.getElementById("modalDetailEndDate");
    if (elEndDate) elEndDate.textContent = daysInfo.endDate || "—";

    // 4. Tab: គ្រួសារ (Family)
    const fatherEl = document.getElementById("familyFatherName");
    if (fatherEl) fatherEl.textContent = student.FatherName || "—";
    const motherEl = document.getElementById("familyMotherName");
    if (motherEl) motherEl.textContent = student.MotherName || "—";
    const emgEl = document.getElementById("familyEmergencyContact");
    if (emgEl) emgEl.textContent = student.EmergencyPhone || student.GuardianPhone || "—";
    const famAddr = document.getElementById("familyAddress");
    if (famAddr) famAddr.textContent = student.Address || "—";

    // 5. Tab: អវត្តមាន (Attendance Breakdown)
    const elAttTotal = document.getElementById("modalDetailAttTotal");
    if (elAttTotal) elAttTotal.textContent = `${attSummary.totalDays} ថ្ងៃ`;

    const elAttPresent = document.getElementById("modalDetailAttPresent");
    if (elAttPresent) elAttPresent.textContent = `${attSummary.present} ថ្ងៃ (${attSummary.rate}%)`;

    const elAttPerm = document.getElementById("modalDetailAttPerm");
    if (elAttPerm) elAttPerm.textContent = `${attSummary.permission} ថ្ងៃ`;

    const elAttAbsent = document.getElementById("modalDetailAttAbsent");
    if (elAttAbsent) elAttAbsent.textContent = `${attSummary.absent} ថ្ងៃ`;

    const attLogContainer = document.getElementById("modalAttendanceLogContainer");
    if (attLogContainer) {
      const allAtt = typeof StudentAPI !== "undefined" ? StudentAPI.getAllAttendance() : {};
      const studentRecords = [];
      Object.keys(allAtt || {}).sort().reverse().slice(0, 10).forEach(date => {
        const dayMap = allAtt[date];
        if (dayMap && dayMap[student.ID]) {
          studentRecords.push({
            date: date,
            status: dayMap[student.ID],
            note: "—"
          });
        }
      });

      if (studentRecords.length === 0) {
        attLogContainer.innerHTML = `<div class="text-muted text-center" style="padding: 12px;">មិនទាន់មានកំណត់ត្រាវត្តមានលម្អិតទេ</div>`;
      } else {
        attLogContainer.innerHTML = `
          <table class="history-table" style="font-size: 0.8rem; margin-top: 6px;">
            <thead>
              <tr>
                <th><i class="fa-regular fa-calendar"></i> កាលបរិច្ឆេទ</th>
                <th>ស្ថានភាពវត្តមាន</th>
                <th>កំណត់ចំណាំ</th>
              </tr>
            </thead>
            <tbody>
              ${studentRecords.map(r => `
                <tr>
                  <td><strong>${r.date}</strong></td>
                  <td><span class="badge ${r.status === 'Present' ? 'status-active' : (r.status === 'Permission' ? 'status-pending' : 'status-inactive')}">${r.status === 'Present' ? '✓ វត្តមាន' : (r.status === 'Permission' ? 'P ច្បាប់' : '✗ អវត្តមាន')}</span></td>
                  <td class="text-muted">${r.note || '—'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      }
    }

    // 6. Tab: សេវាផ្សេងៗ (Printable Student ID Card)
    const cardNameKh = document.getElementById("cardPreviewNameKh");
    const cardNameEn = document.getElementById("cardPreviewNameEn");
    const cardId = document.getElementById("cardPreviewId");
    const cardGrade = document.getElementById("cardPreviewGrade");
    const cardAvatar = document.getElementById("cardPreviewAvatar");
    const cardDob = document.getElementById("cardPreviewDob");

    if (cardNameKh) cardNameKh.textContent = student.NameKh;
    if (cardNameEn) cardNameEn.textContent = student.NameEn || "";
    if (cardId) cardId.textContent = student.ID;
    if (cardGrade) cardGrade.textContent = student.Grade || "ថ្នាក់កុំព្យូទ័រ";
    const cardPreviewCourse = document.getElementById("cardPreviewCourse");
    if (cardPreviewCourse) {
      if (student.Course) {
        cardPreviewCourse.textContent = student.Course;
        cardPreviewCourse.className = `badge-course ${this.getCourseBadgeClass(student.Course)}`;
        cardPreviewCourse.style.display = "inline-flex";
      } else {
        cardPreviewCourse.style.display = "none";
      }
    }
    if (cardAvatar) cardAvatar.src = student.Avatar || this.getDefaultAvatar(student.Gender);
    if (cardDob) cardDob.textContent = student.Dob || "2006-01-01";

    // 7. Tab: លទ្ធផលសិក្សា (4-Course Computer Exam Results & Ladder)
    const examSection = document.getElementById("modalDetailExamSection");
    const isComp = !student.Grade || (student.Grade || "").includes("កុំព្យូទ័រ") || student.Course;
    if (examSection) {
      examSection.style.display = isComp ? "block" : "none";
      if (isComp) {
        const exams = StudentAPI.getStudentExams(student.ID);
        const steps = [
          { id: "Typing", elId: "modalExamTyping", name: "Typing" },
          { id: "Word", elId: "modalExamWord", name: "Word" },
          { id: "Excel", elId: "modalExamExcel", name: "Excel" },
          { id: "PowerPoint", elId: "modalExamPowerPoint", name: "PowerPoint" }
        ];
        steps.forEach(st => {
          const stepEl = document.getElementById(st.elId);
          if (stepEl) {
            const ex = exams[st.id];
            const scoreEl = stepEl.querySelector(".ladder-score");
            const badgeEl = stepEl.querySelector(".ladder-badge");
            if (ex && ex.score !== null && ex.score !== undefined) {
              if (scoreEl) scoreEl.textContent = `${ex.score} (${ex.grade || ''})`;
              if (badgeEl) {
                badgeEl.className = `ladder-badge text-xs font-bold ${ex.status === 'Pass' ? 'text-emerald-600' : 'text-rose-600'}`;
                badgeEl.textContent = ex.status === 'Pass' ? '✓ ជាប់ (Pass)' : '✗ ធ្លាក់ (Fail)';
              }
            } else {
              if (scoreEl) scoreEl.textContent = "—";
              if (badgeEl) {
                badgeEl.className = "ladder-badge text-xs text-muted";
                badgeEl.textContent = (student.Course || '').includes(st.name) ? 'កំពុងរៀន' : 'មិនទាន់ប្រលង';
              }
            }
          }
        });

        const printTransBtn = document.getElementById("modalPrintTranscriptBtn");
        if (printTransBtn) {
          printTransBtn.onclick = () => {
            if (typeof ExamsView !== "undefined") ExamsView.printStudentTranscript(student.ID);
          };
        }
      }
    }

    // Set active tab to 'finance' by default
    const finTabBtn = document.querySelector("[data-student-tab='finance']");
    if (finTabBtn) {
      document.querySelectorAll("[data-student-tab]").forEach(b => b.classList.remove("active"));
      finTabBtn.classList.add("active");
      document.querySelectorAll(".student-tab-pane").forEach(pane => pane.classList.remove("active"));
      const finPane = document.getElementById("pane-finance");
      if (finPane) finPane.classList.add("active");
    }

    ModalsComponent.open("studentDetailsModal");
  },

  async handleQuickPaymentSubmit() {
    if (!this.state.selectedStudent) return;
    const student = this.state.selectedStudent;

    const amtInput = document.getElementById("quickPayAmount");
    const methodInput = document.getElementById("quickPayMethod");
    const dateInput = document.getElementById("quickPayDate");
    const noteInput = document.getElementById("quickPayNote");

    const amount = parseFloat(amtInput?.value) || 0;
    if (amount <= 0) {
      this.showToast("សូមបញ្ចូលចំនួនទឹកប្រាក់ដែលត្រូវបង់!", "warning");
      return;
    }

    const method = methodInput?.value || "Cash";
    const date = dateInput?.value || new Date().toISOString().split("T")[0];
    const note = noteInput?.value?.trim() || `បង់ថ្លៃសិក្សា ${amount}`;

    try {
      const allFees = StudentAPI.getAllFees();
      const currentFee = allFees[student.ID] || StudentAPI.getStudentFee(student.ID);
      const totalAmount = parseFloat(currentFee.totalAmount) || 250;
      const currentPaid = parseFloat(currentFee.paidAmount) || 0;
      const newPaid = Math.min(totalAmount, currentPaid + amount);
      const newBalance = Math.max(0, totalAmount - newPaid);

      const payments = Array.isArray(currentFee.payments) ? [...currentFee.payments] : [];
      payments.push({
        stage: `#${payments.length + 1}`,
        date: date,
        label: payments.length === 0 ? "បង់ដំបូង (Initial)" : "បង់បន្ថែម (Additional)",
        months: "1 ខែ",
        method: method,
        amount: amount,
        total: totalAmount,
        status: newBalance <= 0 ? "រួចរាល់" : "នៅខ្វះ",
        receiver: "System"
      });

      const updatedFee = {
        ...currentFee,
        studentId: student.ID,
        studentNameKh: student.NameKh,
        course: student.Course || "Typing",
        totalAmount: totalAmount,
        paidAmount: newPaid,
        balance: newBalance,
        status: newBalance <= 0 ? "Paid" : "Partial",
        paymentMethod: method,
        date: date,
        note: note,
        payments: payments,
        updatedAt: new Date().toISOString()
      };

      allFees[student.ID] = updatedFee;
      StudentAPI.saveAllFees(allFees);

      if (StudentAPI.isCloudConnected()) {
        try {
          await firebase.database().ref(`fees/${student.ID}`).set(updatedFee);
        } catch (e) {
          console.warn("Fee cloud sync notice:", e);
        }
      }

      this.showToast(`🎉 បានកត់ត្រាការបង់ប្រាក់ ${amount} ជូនសិស្ស ${student.NameKh} ជោគជ័យ!`, "success");
      this.triggerConfetti();

      // Hide Quick Pay Drawer
      const box = document.getElementById("inlineQuickPayBox");
      if (box) box.style.display = "none";

      // Refresh view
      this.viewStudentDetails(student.ID);

      // Trigger Telegram Notification
      if (typeof TelegramService !== "undefined") {
        TelegramService.notifyPayment(student, {
          course: student.Course || "Typing",
          paidAmount: amount,
          receiptNo: `INV-${new Date().getFullYear()}-${student.ID.replace(/\D/g, '').padStart(3, '0')}`,
          paymentMethod: method,
          date: date
        });
      }
    } catch (err) {
      this.showToast("កំហុសក្នុងការកត់ត្រាការបង់ប្រាក់: " + err.message, "error");
    }
  },

  async deleteStudentPaymentRow(studentId, index) {
    if (!confirm("តើអ្នកពិតជាចង់លុបកំណត់ត្រាបង់ប្រាក់នេះមែនទេ?")) return;

    try {
      const allFees = StudentAPI.getAllFees();
      const currentFee = allFees[studentId];
      if (currentFee && Array.isArray(currentFee.payments) && currentFee.payments[index]) {
        const removed = currentFee.payments.splice(index, 1)[0];
        const newPaid = Math.max(0, (currentFee.paidAmount || 0) - (removed.amount || 0));
        currentFee.paidAmount = newPaid;
        currentFee.balance = Math.max(0, (currentFee.totalAmount || 250) - newPaid);
        currentFee.status = currentFee.balance <= 0 ? "Paid" : (newPaid > 0 ? "Partial" : "Unpaid");

        allFees[studentId] = currentFee;
        StudentAPI.saveAllFees(allFees);

        if (StudentAPI.isCloudConnected()) {
          await firebase.database().ref(`fees/${studentId}`).set(currentFee);
        }

        this.showToast("បានលុបកំណត់ត្រាបង់ប្រាក់រួចរាល់!", "info");
        this.viewStudentDetails(studentId);
      }
    } catch (err) {
      this.showToast("មិនអាចលុបបានទេ: " + err.message, "error");
    }
  },

  async toggleStudentStatus(studentId) {
    const student = this.state.students.find(s => s.ID === studentId);
    if (!student) return;

    const newStatus = student.Status === "Inactive" ? "Active" : "Inactive";
    student.Status = newStatus;

    try {
      await StudentAPI.updateStudent(student);
      this.showToast(`បានប្តូរស្ថានភាពសិស្សទៅជា៖ ${newStatus === 'Active' ? 'កំពុងសិក្សា' : 'ផ្អាកការសិក្សា'}`, "success");
      this.viewStudentDetails(student.ID);
      await this.loadData(false);
    } catch (err) {
      this.showToast("កំហុសក្នុងការប្តូរស្ថានភាព: " + err.message, "error");
    }
  },

  async resetStudentPin(studentId) {
    const student = this.state.students.find(s => s.ID === studentId);
    if (!student) return;

    const newPin = "123";
    student.PIN = newPin;
    student.pin = newPin;

    try {
      await StudentAPI.updateStudent(student);
      this.showToast(`បានកំណត់លេខកូដ PIN ឡើងវិញជា "${newPin}" ដោយជោគជ័យ!`, "success");
      const pinEl = document.getElementById("modalDetailLoginPin");
      if (pinEl) pinEl.textContent = newPin;
    } catch (err) {
      this.showToast("កំហុសក្នុងការកំណត់ PIN: " + err.message, "error");
    }
  },

  openEditModal(studentId) {
    const student = this.state.students.find(s => String(s.ID).trim() === String(studentId).trim());
    if (!student) return;

    this.state.selectedStudent = student;

    const form = document.getElementById("editStudentForm");
    if (!form) return;

    form.querySelector("[name='id']").value = student.ID;
    form.querySelector("[name='nameKh']").value = student.NameKh || "";
    form.querySelector("[name='nameEn']").value = student.NameEn || "";
    form.querySelector("[name='gender']").value = student.Gender || "ប្រុស";
    const dobInput = form.querySelector("[name='dob']");
    if (dobInput) dobInput.value = student.Dob || student.DOB || "";
    const natInput = form.querySelector("[name='nationality']");
    if (natInput) natInput.value = student.Nationality || "ខ្មែរ";
    form.querySelector("[name='phone']").value = student.Phone || "";
    const healthInput = form.querySelector("[name='healthNotes']");
    if (healthInput) healthInput.value = student.HealthNotes || "";
    const addressSelect = form.querySelector("[name='address']");
    if (addressSelect) addressSelect.value = student.Address || "រាជធានីភ្នំពេញ";
    form.querySelector("[name='grade']").value = student.Grade || "ថ្នាក់កុំព្យូទ័រ";
    const courseSelect = form.querySelector("[name='course']");
    if (courseSelect) courseSelect.value = student.Course || "Typing";
    const shiftVal = student.Shift || "ព្រឹក";
    const shiftSelect = form.querySelector("[name='shift']");
    if (shiftSelect) {
      const matchOpt = Array.from(shiftSelect.options).find(opt => opt.value === shiftVal || opt.value.includes(shiftVal) || (opt.text && opt.text.includes(shiftVal)));
      shiftSelect.value = matchOpt ? matchOpt.value : (shiftSelect.options[0]?.value || "ព្រឹក");
    }
    form.querySelector("[name='status']").value = student.Status || "Active";
    const startInput = form.querySelector("[name='startDate']");
    if (startInput) startInput.value = student.StartDate || student.CreatedAt || "";
    const endInput = form.querySelector("[name='endDate']");
    if (endInput) endInput.value = student.EndDate || "";
    const pinInput = form.querySelector("[name='pin']");
    if (pinInput) pinInput.value = student.PIN || student.pin || "123";
    form.querySelector("[name='avatar']").value = student.Avatar || "";
    form.querySelector("[name='createdAt']").value = student.CreatedAt || "";

    const idDisplay = document.getElementById("editModalStudentIdDisplay");
    if (idDisplay) idDisplay.value = student.ID;

    const preview = document.getElementById("editAvatarPreview");
    const placeholder = document.getElementById("editAvatarPlaceholder");
    if (preview) {
      if (student.Avatar) {
        preview.src = student.Avatar;
        preview.style.display = "block";
        if (placeholder) placeholder.style.display = "none";
      } else {
        preview.src = "";
        preview.style.display = "none";
        if (placeholder) placeholder.style.display = "flex";
      }
    }

    this.editStep = 1;
    this.updateEditStepUI();
    ModalsComponent.open("editModal");
  },

  confirmDeleteStudent(studentId) {
    const student = this.state.students.find(s => String(s.ID).trim() === String(studentId).trim());
    if (!student) return;

    document.getElementById("deleteStudentName").textContent = `${student.NameKh} (${student.ID})`;

    const confirmBtn = document.getElementById("confirmDeleteBtn");
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    newConfirmBtn.addEventListener("click", async () => {
      try {
        newConfirmBtn.disabled = true;
        newConfirmBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> កំពុងលុប...`;

        await StudentAPI.deleteStudent(student.ID);
        this.showToast(`បានលុបទិន្នន័យសិស្ស ${student.NameKh} រួចរាល់!`, "info");
        ModalsComponent.close("deleteConfirmModal");
        await this.loadData(false);
      } catch (err) {
        this.showToast(err.message || "មានកំហុសក្នុងការលុប!", "error");
      } finally {
        newConfirmBtn.disabled = false;
        newConfirmBtn.innerHTML = `<i class="fa-solid fa-trash"></i> យល់ព្រមលុប`;
      }
    });

    ModalsComponent.open("deleteConfirmModal");
  },

  // Print Student ID Card
  printStudentIdCard(targetStudentId = null) {
    let student = null;
    if (targetStudentId) {
      student = (this.state.students || []).find(s => String(s.ID).trim() === String(targetStudentId).trim());
    }
    if (!student) {
      student = this.state.selectedStudent;
    }
    if (!student && typeof AuthService !== "undefined" && AuthService.isStudent()) {
      const u = AuthService.getCurrentUser();
      student = u?.studentData || u;
    }
    if (!student) {
      this.showToast("រកមិនឃើញទិន្នន័យសិស្សសម្រាប់បោះពុម្ពកាតឡើយ!", "warning");
      return;
    }

    let printWindow = null;
    try {
      printWindow = window.open("", "_blank", "width=800,height=600");
    } catch (e) {
      printWindow = null;
    }

    if (!printWindow) {
      window.print();
      return;
    }

    try {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>បោះពុម្ពកាតសិស្ស - ${student?.NameKh || ''}</title>
          <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700&family=Plus+Jakarta+Sans:wght@600;800&display=swap" rel="stylesheet">
          <style>
            body {
              margin: 0; padding: 40px; display: flex; justify-content: center; align-items: center;
              background: #f8fafc; font-family: 'Kantumruy Pro', sans-serif;
            }
            .id-card-print {
              width: 380px; height: 240px; border-radius: 16px;
              background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
              color: #ffffff; padding: 16px 20px; box-sizing: border-box;
              display: flex; flex-direction: column; justify-content: space-between;
              box-shadow: 0 10px 25px rgba(0,0,0,0.15);
              -webkit-print-color-adjust: exact; print-color-adjust: exact;
            }
            .card-header {
              display: flex; align-items: center; justify-content: space-between;
              border-bottom: 1px solid rgba(255,255,255,0.25); padding-bottom: 8px;
            }
            .school-title { font-size: 14px; font-weight: 700; letter-spacing: 0.5px; }
            .school-sub { font-size: 10px; opacity: 0.85; text-transform: uppercase; }
            .card-body { display: flex; gap: 16px; align-items: center; margin-top: 6px; }
            .card-avatar {
              width: 80px; height: 95px; border-radius: 8px;
              object-fit: cover; border: 2px solid #ffffff; background: #ffffff;
            }
            .card-info { flex: 1; }
            .card-name-kh { font-size: 17px; font-weight: 700; color: #fef08a; margin-bottom: 2px; }
            .card-name-en { font-size: 12px; font-family: 'Plus Jakarta Sans', sans-serif; opacity: 0.9; margin-bottom: 6px; }
            .card-row { font-size: 11px; display: flex; margin-bottom: 3px; opacity: 0.95; }
            .card-row span:first-child { width: 60px; opacity: 0.8; }
            .card-footer {
              display: flex; justify-content: space-between; align-items: flex-end;
              border-top: 1px solid rgba(255,255,255,0.2); padding-top: 6px; font-size: 9px; opacity: 0.85;
            }
            .barcode {
              font-family: monospace; letter-spacing: 3px; font-weight: bold;
              font-size: 12px; background: rgba(255,255,255,0.15); padding: 2px 6px; border-radius: 4px;
            }
            @media print { body { background: transparent; padding: 0; } }
          </style>
        </head>
        <body>
          <div class="id-card-print">
            <div class="card-header">
              <div>
                <div class="school-title">សាលាអន្តរជាតិ MASTERSCHOOL</div>
                <div class="school-sub">STUDENT IDENTITY CARD</div>
              </div>
              <div style="font-size: 22px;">🎓</div>
            </div>
            <div class="card-body">
              <img src="${student?.Avatar || this.getDefaultAvatar(student?.Gender)}" class="card-avatar">
              <div class="card-info">
                <div class="card-name-kh">${student?.NameKh}</div>
                <div class="card-name-en">${student?.NameEn || ''}</div>
                <div class="card-row"><span>អត្តលេខ:</span> <strong>${student?.ID}</strong></div>
                <div class="card-row"><span>ថ្នាក់សិក្សា:</span> <strong>${student?.Grade}</strong></div>
                <div class="card-row"><span>ថ្ងៃកំណើត:</span> <span>${student?.Dob || '—'}</span></div>
              </div>
            </div>
            <div class="card-footer">
              <div>សុពលភាព: 2026 - 2027</div>
              <div class="barcode">${student?.ID}</div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          <\/script>
        </body>
        </html>
      `);
      printWindow.document.close();
    } catch (e) {
      window.print();
    }
  },

  // Print Table Report
  printStudentTable() {
    let printWindow = null;
    try {
      printWindow = window.open("", "_blank", "width=1000,height=700");
    } catch (e) {
      printWindow = null;
    }

    if (!printWindow) {
      window.print();
      return;
    }

    const rows = this.state.filteredStudents.map((s, i) => {
      const days = this.getStudentDaysInfo(s);
      const att = StudentAPI.getStudentAttendanceSummary(s.ID);
      return `
        <tr>
          <td style="text-align:center;">${i + 1}</td>
          <td style="font-weight:bold;">${this.escapeHtml(s.ID)}</td>
          <td>${this.escapeHtml(s.NameKh)}</td>
          <td>${this.escapeHtml(s.NameEn || '')}</td>
          <td style="text-align:center;">${this.escapeHtml(s.Gender)}</td>
          <td>${this.escapeHtml(s.Grade)} ${s.Course ? `(${this.escapeHtml(s.Course)})` : ''}</td>
          <td>${this.escapeHtml(s.Shift)}</td>
          <td>រៀនបាន ${days.daysElapsed} ថ្ងៃ (${days.percent}%)</td>
          <td style="text-align:center; font-weight: bold; color: ${att.rate >= 80 ? '#059669' : '#d97706'};">${att.rate}%</td>
          <td>${this.escapeHtml(s.Phone || '—')}</td>
          <td>${s.Status === 'Active' ? 'កំពុងសិក្សា' : s.Status === 'Graduated' ? 'បញ្ចប់' : 'ផ្អាក'}</td>
        </tr>
      `;
    }).join("");

    try {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>បញ្ជីរាយនាមសិស្ស - MasterSchool</title>
          <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Kantumruy Pro', sans-serif; padding: 25px; color: #1e293b; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #2563eb; padding-bottom: 12px; }
            h1 { margin: 0 0 6px 0; font-size: 20px; color: #1e3a8a; }
            p { margin: 0; font-size: 13px; color: #64748b; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 10px; }
            th { background: #f1f5f9; font-weight: 700; text-align: left; }
            tr:nth-child(even) { background: #f8fafc; }
            .summary { margin-top: 15px; font-size: 13px; font-weight: bold; text-align: right; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>របាយការណ៍បញ្ជីរាយនាមសិស្ស (STUDENT REPORT)</h1>
            <p>កាលបរិច្ឆេទចេញរបាយការណ៍: ${new Date().toLocaleDateString('km-KH')} | សិស្សសរុប: ${this.state.filteredStudents.length} នាក់</p>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 40px; text-align: center;">ល.រ</th>
                <th>អត្តលេខ</th>
                <th>ឈ្មោះជាភាសាខ្មែរ</th>
                <th>ឈ្មោះជាឡាតាំង</th>
                <th style="text-align: center;">ភេទ</th>
                <th>ថ្នាក់សិក្សា</th>
                <th>វេន</th>
                <th>រយៈពេលសិក្សា</th>
                <th style="text-align: center;">អត្រាវត្តមាន</th>
                <th>លេខទូរស័ព្ទ</th>
                <th>ស្ថានភាព</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
          <div class="summary">សិស្សសរុបក្នុងតារាងនេះ: ${this.state.filteredStudents.length} នាក់</div>
          <script>window.onload = function() { window.print(); };<\/script>
        </body>
        </html>
      `);
      printWindow.document.close();
    } catch (e) {
      window.print();
    }
  },

  // Export CSV
  exportToCsv() {
    const students = this.state.filteredStudents;
    if (students.length === 0) {
      this.showToast("គ្មានទិន្នន័យសម្រាប់ទាញយកឡើយ!", "warning");
      return;
    }

    const headers = [
      "ID", "ឈ្មោះខ្មែរ", "ឈ្មោះអង់គ្លេស", "ភេទ", "ថ្ងៃខែឆ្នាំកំណើត",
      "ថ្នាក់សិក្សា", "វគ្គសិក្សា", "វេនសិក្សា", "ថ្ងៃចូលរៀន", "ថ្ងៃបញ្ចប់",
      "ថ្ងៃបានរៀន", "នៅសល់(ថ្ងៃ)", "វឌ្ឍនភាព(%)", "អត្រាវត្តមាន(%)",
      "លេខទូរស័ព្ទ", "លេខអាណាព្យាបាល", "អាសយដ្ឋាន", "ស្ថានភាព", "កាលបរិច្ឆេទចុះឈ្មោះ"
    ];
    
    const rows = students.map(s => {
      const days = this.getStudentDaysInfo(s);
      const att = StudentAPI.getStudentAttendanceSummary(s.ID);
      return [
        `"${(s.ID || '').replace(/"/g, '""')}"`,
        `"${(s.NameKh || '').replace(/"/g, '""')}"`,
        `"${(s.NameEn || '').replace(/"/g, '""')}"`,
        `"${(s.Gender || '').replace(/"/g, '""')}"`,
        `"${(s.Dob || '').replace(/"/g, '""')}"`,
        `"${(s.Grade || '').replace(/"/g, '""')}"`,
        `"${(s.Course || '').replace(/"/g, '""')}"`,
        `"${(s.Shift || '').replace(/"/g, '""')}"`,
        `"${days.startDate}"`,
        `"${days.endDate}"`,
        `"${days.daysElapsed}"`,
        `"${days.daysRemaining}"`,
        `"${days.percent}%"`,
        `"${att.rate}%"`,
        `"${(s.Phone || '').replace(/"/g, '""')}"`,
        `"${(s.GuardianPhone || '').replace(/"/g, '""')}"`,
        `"${(s.Address || '').replace(/"/g, '""')}"`,
        `"${(s.Status || '').replace(/"/g, '""')}"`,
        `"${(s.CreatedAt || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Students_List_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast("បានទាញយកឯកសារ CSV រួចរាល់!", "success");
  },

  // Themes & UI Utilities
  initTheme() {
    const savedTheme = localStorage.getItem(APP_CONFIG.STORAGE_KEY_THEME) || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(APP_CONFIG.STORAGE_KEY_THEME, next);

    const icon = document.getElementById("themeIcon");
    if (icon) {
      icon.className = next === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }

    DashboardCharts.updateTheme();
  },

  animateCounter(elementId, targetValue) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const start = parseInt(el.textContent, 10) || 0;
    if (start === targetValue) {
      el.textContent = targetValue;
      return;
    }
    const duration = 600;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (targetValue - start) * easeOut);
      el.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = targetValue;
      }
    }
    requestAnimationFrame(update);
  },

  showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast-message toast-${type}`;
    
    let iconClass = "fa-circle-info";
    if (type === "success") iconClass = "fa-circle-check";
    else if (type === "error") iconClass = "fa-circle-exclamation";
    else if (type === "warning") iconClass = "fa-triangle-exclamation";

    toast.innerHTML = `
      <i class="fa-solid ${iconClass}"></i>
      <span>${this.escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  },

  showLoader(show) {
    const loader = document.getElementById("globalLoader");
    if (!loader) return;
    if (show) loader.classList.add("active");
    else loader.classList.remove("active");
  },

  triggerConfetti() {
    if (typeof confetti === "function") {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  },

  getDefaultAvatar(gender) {
    if (gender === "ស្រី" || gender === "Female") {
      return "assets/images/default-female.svg";
    }
    return "assets/images/default-male.svg";
  },

  escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
};

// Start application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
