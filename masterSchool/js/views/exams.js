/**
 * View: Computer Course Exams Management (ប្រព័ន្ធប្រលងបញ្ចប់វគ្គកុំព្យូទ័រ ៤ វគ្គ)
 * Typing ➔ Word ➔ Excel ➔ PowerPoint
 */
const ExamsView = {
  currentTab: "Typing", // 'Typing' | 'Word' | 'Excel' | 'PowerPoint' | 'all'
  filters: {
    status: "",
    shift: "",
    search: ""
  },
  pendingScores: {},

  // Live Multi-Module Exam Arena State
  activeArenaCourse: "Typing",
  activeArenaStudentId: null,
  typingState: {
    isRunning: false,
    paper: null,
    targetText: "",
    segments: [],
    startTime: null,
    totalTime: 180,
    timeLeft: 180,
    timerInterval: null,
    errors: 0,
    wpm: 0,
    accuracy: 100,
    typedLength: 0,
    finalScore: 0,
    finalGrade: "F",
    finalStatus: "Fail"
  },
  courseExamState: {
    course: "Word",
    paper: null,
    questions: [],
    answers: {},
    timeLeft: 600,
    totalTime: 600,
    timerInterval: null,
    isFinished: false,
    finalScore: 0,
    finalGrade: "F",
    finalStatus: "Fail"
  },

  render() {
    return `
      <section id="view-exams" class="page-view">
        <!-- Top Bar Header -->
        <div class="card" style="margin-bottom: 20px; padding: 20px 24px; border-left: 4px solid #8b5cf6; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div>
            <h2 style="font-size: 1.35rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 10px; margin: 0 0 6px 0;">
              <i class="fa-solid fa-award" style="color: #8b5cf6;"></i>
              <span>ប្រព័ន្ធប្រលងបញ្ចប់វគ្គកុំព្យូទ័រទាំង ៤ វគ្គ (Computer Module Exams)</span>
            </h2>
            <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted);">
              គ្រប់គ្រងការប្រលងវាស់ស្ទង់សមត្ថភាពសិស្សបញ្ចប់វគ្គ Typing ➔ Word ➔ Excel ➔ PowerPoint និងបញ្ចូលពិន្ទុស្វ័យប្រវត្ត
            </p>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <button type="button" id="openLiveExamArenaBtn" class="btn-primary" style="height: 38px; padding: 0 16px; font-size: 0.88rem; background: linear-gradient(135deg, #10b981, #059669); border: none; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);">
              <i class="fa-solid fa-play"></i>
              <span>🚀 សាលប្រឡងផ្ទាល់ (Live Exam Arena)</span>
            </button>
            <button type="button" id="openExamPapersBtn" class="btn-primary" style="height: 38px; padding: 0 16px; font-size: 0.88rem; background: linear-gradient(135deg, #0284c7, #2563eb); border: none; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);">
              <i class="fa-solid fa-file-signature"></i>
              <span>📑 ឃ្លាំងវិញ្ញាសាប្រឡង</span>
            </button>
            <button type="button" id="saveAllExamsBtn" class="btn-primary" style="height: 38px; padding: 0 18px; font-size: 0.88rem; background: #8b5cf6; border-color: #8b5cf6; box-shadow: 0 4px 14px rgba(139, 92, 246, 0.35);">
              <i class="fa-solid fa-floppy-disk"></i>
              <span>រក្សាទុកពិន្ទុទាំងអស់</span>
            </button>
            <button type="button" id="printExamReportBtn" class="btn-secondary" style="height: 38px; padding: 0 14px; font-size: 0.85rem;" title="បោះពុម្ពតារាងពិន្ទុប្រលង">
              <i class="fa-solid fa-print"></i>
              <span>បោះពុម្ពតារាងពិន្ទុ</span>
            </button>
          </div>
        </div>

        <!-- Exam KPIs Row -->
        <div class="exam-kpi-grid">
          <!-- Total Computer Students -->
          <div class="att-kpi-box" style="border-left: 3px solid #4f46e5;">
            <div class="att-kpi-icon" style="background: rgba(79, 70, 229, 0.12); color: #4f46e5;">
              <i class="fa-solid fa-laptop-code"></i>
            </div>
            <div class="att-kpi-info">
              <h4>សិស្សកុំព្យូទ័រសរុប</h4>
              <div class="att-kpi-num" id="examKpiTotal">0</div>
            </div>
          </div>

          <!-- Passed Typing -->
          <div class="att-kpi-box" style="border-left: 3px solid #8b5cf6;">
            <div class="att-kpi-icon" style="background: rgba(139, 92, 246, 0.12); color: #8b5cf6;">
              <i class="fa-solid fa-keyboard"></i>
            </div>
            <div class="att-kpi-info">
              <h4>ជាប់វគ្គ Typing (១)</h4>
              <div class="att-kpi-num" id="examKpiTyping" style="color: #8b5cf6;">0</div>
            </div>
          </div>

          <!-- Passed Word -->
          <div class="att-kpi-box" style="border-left: 3px solid #185abd;">
            <div class="att-kpi-icon" style="background: rgba(24, 90, 189, 0.12); color: #185abd;">
              <i class="fa-solid fa-file-word"></i>
            </div>
            <div class="att-kpi-info">
              <h4>ជាប់វគ្គ Word (២)</h4>
              <div class="att-kpi-num" id="examKpiWord" style="color: #185abd;">0</div>
            </div>
          </div>

          <!-- Passed Excel -->
          <div class="att-kpi-box" style="border-left: 3px solid #107c41;">
            <div class="att-kpi-icon" style="background: rgba(16, 124, 65, 0.12); color: #107c41;">
              <i class="fa-solid fa-file-excel"></i>
            </div>
            <div class="att-kpi-info">
              <h4>ជាប់វគ្គ Excel (៣)</h4>
              <div class="att-kpi-num" id="examKpiExcel" style="color: #107c41;">0</div>
            </div>
          </div>

          <!-- Passed PowerPoint (Graduates) -->
          <div class="att-kpi-box" style="border-left: 3px solid #d83b01;">
            <div class="att-kpi-icon" style="background: rgba(216, 59, 1, 0.12); color: #d83b01;">
              <i class="fa-solid fa-graduation-cap"></i>
            </div>
            <div class="att-kpi-info">
              <h4>បញ្ចប់វគ្គទាំង ៤ (Graduates)</h4>
              <div class="att-kpi-num" id="examKpiPowerPoint" style="color: #d83b01;">0</div>
            </div>
          </div>
        </div>

        <!-- Module Navigation Tabs -->
        <div class="exam-tabs-bar">
          <button type="button" class="exam-tab-btn active" data-tab="Typing">
            <i class="fa-solid fa-keyboard" style="color: #8b5cf6;"></i>
            <span>វគ្គទី ១: Typing</span>
            <span class="badge badge-sub" id="badgeTabTyping">0</span>
          </button>

          <button type="button" class="exam-tab-btn" data-tab="Word">
            <i class="fa-solid fa-file-word" style="color: #185abd;"></i>
            <span>វគ្គទី ២: Word</span>
            <span class="badge badge-sub" id="badgeTabWord">0</span>
          </button>

          <button type="button" class="exam-tab-btn" data-tab="Excel">
            <i class="fa-solid fa-file-excel" style="color: #107c41;"></i>
            <span>វគ្គទី ៣: Excel</span>
            <span class="badge badge-sub" id="badgeTabExcel">0</span>
          </button>

          <button type="button" class="exam-tab-btn" data-tab="PowerPoint">
            <i class="fa-solid fa-file-powerpoint" style="color: #d83b01;"></i>
            <span>វគ្គទី ៤: PowerPoint</span>
            <span class="badge badge-sub" id="badgeTabPowerPoint">0</span>
          </button>

          <button type="button" class="exam-tab-btn" data-tab="all">
            <i class="fa-solid fa-table-list" style="color: #4f46e5;"></i>
            <span>ព្រឹត្តិបត្រពិន្ទុរួមទាំង ៤ វគ្គ</span>
          </button>
        </div>

        <!-- Filter Bar -->
        <div class="filter-bar" style="margin-bottom: 16px;">
          <!-- Filter Shift -->
          <select id="examFilterShift" class="filter-select">
            <option value="">-- គ្រប់វេនសិក្សា --</option>
            ${APP_CONFIG.shifts.map(s => `<option value="${s.id}">${s.label}</option>`).join('')}
          </select>

          <!-- Filter Status -->
          <select id="examFilterStatus" class="filter-select">
            <option value="">-- គ្រប់ស្ថានភាពលទ្ធផល --</option>
            <option value="Pass">ជាប់ (Pass)</option>
            <option value="Fail">ធ្លាក់ (Fail)</option>
            <option value="Pending">មិនទាន់ប្រលង / កំពុងសិក្សា</option>
          </select>

          <!-- Search Input -->
          <div style="position: relative; flex: 1; max-width: 280px;">
            <input type="text" id="examSearchInput" class="form-control" placeholder="ស្វែងរកតាមឈ្មោះ ឬអត្តលេខ..." style="height: 36px; padding-left: 32px; font-size: 0.84rem;">
            <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 10px; top: 11px; color: var(--text-muted); font-size: 0.85rem;"></i>
          </div>

          <span class="text-xs text-muted" style="margin-left: auto; display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-circle-info text-indigo-500"></i>
            <span>ពិន្ទុជាប់ចាប់ពី ៥០ ឡើងទៅ (និទ្ទេស A: 85-100, B: 75-84, C: 65-74, D: 50-64, F: <50)</span>
          </span>
        </div>

        <!-- Dynamic Exam Table Container -->
        <div class="att-table-wrapper" id="examTableContainer">
          <!-- Rendered dynamically -->
        </div>
      </section>
    `;
  },

  initEvents() {
    // Tab switching
    const tabBtns = document.querySelectorAll(".exam-tab-btn");
    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        tabBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentTab = btn.getAttribute("data-tab");
        this.renderTable();
      });
    });

    // Filter Shift
    const shiftFilter = document.getElementById("examFilterShift");
    if (shiftFilter) {
      shiftFilter.addEventListener("change", (e) => {
        this.filters.shift = e.target.value;
        this.renderTable();
      });
    }

    // Filter Status
    const statusFilter = document.getElementById("examFilterStatus");
    if (statusFilter) {
      statusFilter.addEventListener("change", (e) => {
        this.filters.status = e.target.value;
        this.renderTable();
      });
    }

    // Search Input
    const searchInput = document.getElementById("examSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.filters.search = e.target.value.toLowerCase().trim();
        this.renderTable();
      });
    }

    // Save All Exams Button
    const saveAllBtn = document.getElementById("saveAllExamsBtn");
    if (saveAllBtn) {
      saveAllBtn.addEventListener("click", async () => {
        await this.saveAllPendingScores();
      });
    }

    // Open Live Exam Arena Button
    const liveArenaBtn = document.getElementById("openLiveExamArenaBtn");
    if (liveArenaBtn) {
      liveArenaBtn.addEventListener("click", () => {
        this.openLiveExamArena(this.currentTab === "all" ? "Typing" : this.currentTab);
      });
    }

    // Open Exam Papers Repository Button
    const papersBtn = document.getElementById("openExamPapersBtn");
    if (papersBtn) {
      papersBtn.addEventListener("click", () => {
        this.openExamPapersModal(this.currentTab === "all" ? "Typing" : this.currentTab);
      });
    }

    // Print Button
    const printBtn = document.getElementById("printExamReportBtn");
    if (printBtn) {
      printBtn.addEventListener("click", () => {
        window.print();
      });
    }

    // Initial table render
    this.renderTable();
  },

  getComputerStudents() {
    let students = App.state.students || [];
    // All students in MasterSchool are computer students
    students = students.filter(s => !s.Grade || (s.Grade || "").includes("កុំព្យូទ័រ") || s.Course);

    if (this.filters.shift) {
      students = students.filter(s => s.Shift === this.filters.shift);
    }

    if (this.filters.search) {
      const q = this.filters.search;
      students = students.filter(s => 
        (s.NameKh && s.NameKh.toLowerCase().includes(q)) ||
        (s.NameEn && s.NameEn.toLowerCase().includes(q)) ||
        (s.ID && s.ID.toLowerCase().includes(q))
      );
    }

    return students;
  },

  calculateGrade(score) {
    if (score === null || score === undefined || score === "") return null;
    const num = parseFloat(score);
    if (isNaN(num)) return null;
    if (num >= 85) return "A";
    if (num >= 75) return "B";
    if (num >= 65) return "C";
    if (num >= 50) return "D";
    return "F";
  },

  updateKpiStats() {
    const students = (App.state.students || []).filter(s => !s.Grade || (s.Grade || "").includes("កុំព្យូទ័រ") || s.Course);
    const allExams = StudentAPI.getAllExams();

    let countTyping = 0;
    let countWord = 0;
    let countExcel = 0;
    let countPowerPoint = 0;

    students.forEach(s => {
      const exams = allExams[s.ID] || {};
      if (exams.Typing && exams.Typing.status === "Pass") countTyping++;
      if (exams.Word && exams.Word.status === "Pass") countWord++;
      if (exams.Excel && exams.Excel.status === "Pass") countExcel++;
      if (exams.PowerPoint && exams.PowerPoint.status === "Pass") countPowerPoint++;
    });

    const elTotal = document.getElementById("examKpiTotal");
    const elTyping = document.getElementById("examKpiTyping");
    const elWord = document.getElementById("examKpiWord");
    const elExcel = document.getElementById("examKpiExcel");
    const elPowerPoint = document.getElementById("examKpiPowerPoint");

    if (elTotal) elTotal.textContent = students.length;
    if (elTyping) elTyping.textContent = `${countTyping} នាក់`;
    if (elWord) elWord.textContent = `${countWord} នាក់`;
    if (elExcel) elExcel.textContent = `${countExcel} នាក់`;
    if (elPowerPoint) elPowerPoint.textContent = `${countPowerPoint} នាក់`;

    // Badges on tabs
    const bTyping = document.getElementById("badgeTabTyping");
    const bWord = document.getElementById("badgeTabWord");
    const bExcel = document.getElementById("badgeTabExcel");
    const bPowerPoint = document.getElementById("badgeTabPowerPoint");

    if (bTyping) bTyping.textContent = `${countTyping}/${students.length}`;
    if (bWord) bWord.textContent = `${countWord}/${students.length}`;
    if (bExcel) bExcel.textContent = `${countExcel}/${students.length}`;
    if (bPowerPoint) bPowerPoint.textContent = `${countPowerPoint}/${students.length}`;
  },

  // Called when teacher types in score input
  handleScoreChange(studentId, courseId, inputEl) {
    const rawVal = inputEl.value.trim();
    const score = rawVal !== "" ? parseFloat(rawVal) : null;
    const row = document.querySelector(`tr[data-exam-row="${studentId}"]`);

    let status = "Pending";
    let grade = null;

    if (score !== null && !isNaN(score)) {
      status = score >= 50 ? "Pass" : "Fail";
      grade = this.calculateGrade(score);
    }

    // Update row elements immediately
    if (row) {
      const statusEl = row.querySelector(".exam-status-cell");
      const gradeEl = row.querySelector(".exam-grade-cell");
      const promoteBtn = row.querySelector(".btn-promote-course");

      if (statusEl) {
        statusEl.innerHTML = this.renderStatusBadge(status);
      }
      if (gradeEl) {
        gradeEl.innerHTML = grade ? `<span class="badge badge-grade-letter grade-${grade}">${grade}</span>` : "—";
      }
      if (promoteBtn) {
        promoteBtn.style.display = status === "Pass" ? "inline-flex" : "none";
      }
    }

    // Cache in pending
    if (!this.pendingScores[studentId]) this.pendingScores[studentId] = {};
    const dateInput = row ? row.querySelector(".exam-date-input") : null;
    const examDate = dateInput ? dateInput.value : new Date().toISOString().split("T")[0];

    this.pendingScores[studentId][courseId] = {
      score: score,
      date: examDate,
      status: status,
      grade: grade
    };
  },

  renderStatusBadge(status) {
    if (status === "Pass" || status === "ជាប់") {
      return `<span class="status-indicator status-active"><i class="fa-solid fa-check"></i> ជាប់ (Pass)</span>`;
    }
    if (status === "Fail" || status === "ធ្លាក់") {
      return `<span class="status-indicator status-inactive"><i class="fa-solid fa-xmark"></i> ធ្លាក់ (Fail)</span>`;
    }
    if (status === "InProgress" || status === "កំពុងសិក្សា") {
      return `<span class="status-indicator" style="background: rgba(14, 165, 233, 0.12); color: #0284c7;"><i class="fa-solid fa-book-open"></i> កំពុងរៀន</span>`;
    }
    return `<span class="status-indicator" style="background: var(--border-light); color: var(--text-muted);"><i class="fa-regular fa-clock"></i> មិនទាន់ប្រលង</span>`;
  },

  async saveSingleExam(studentId, courseId) {
    const row = document.querySelector(`tr[data-exam-row="${studentId}"]`);
    if (!row) return;

    const scoreInput = row.querySelector(".exam-score-input");
    const dateInput = row.querySelector(".exam-date-input");
    const notesInput = row.querySelector(".exam-notes-input");

    const rawScore = scoreInput ? scoreInput.value.trim() : "";
    const score = rawScore !== "" ? parseFloat(rawScore) : null;
    const date = dateInput ? dateInput.value : new Date().toISOString().split("T")[0];
    const notes = notesInput ? notesInput.value.trim() : "";

    let status = "Pending";
    let grade = null;
    if (score !== null && !isNaN(score)) {
      status = score >= 50 ? "Pass" : "Fail";
      grade = this.calculateGrade(score);
    }

    try {
      await StudentAPI.saveStudentExam(studentId, courseId, {
        score,
        date,
        status,
        grade,
        notes
      });
      App.showToast(`បានរក្សាទុកពិន្ទុប្រលងវគ្គ ${courseId} សម្រាប់សិស្ស ${studentId} ជោគជ័យ!`, "success");
      this.updateKpiStats();
    } catch (e) {
      App.showToast("កំហុសរក្សាទុក: " + e.message, "error");
    }
  },

  async saveAllPendingScores() {
    const saveBtn = document.getElementById("saveAllExamsBtn");
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> កំពុងរក្សាទុក...`;
    }

    try {
      const allExams = StudentAPI.getAllExams();
      const currentCourseId = this.currentTab === "all" ? "Typing" : this.currentTab;

      // Scrape table inputs
      const rows = document.querySelectorAll("tr[data-exam-row]");
      rows.forEach(row => {
        const studentId = row.getAttribute("data-exam-row");
        const scoreInput = row.querySelector(".exam-score-input");
        const dateInput = row.querySelector(".exam-date-input");
        const notesInput = row.querySelector(".exam-notes-input");

        if (scoreInput) {
          const rawScore = scoreInput.value.trim();
          const score = rawScore !== "" ? parseFloat(rawScore) : null;
          const date = dateInput ? dateInput.value : new Date().toISOString().split("T")[0];
          const notes = notesInput ? notesInput.value.trim() : "";

          let status = "Pending";
          let grade = null;
          if (score !== null && !isNaN(score)) {
            status = score >= 50 ? "Pass" : "Fail";
            grade = this.calculateGrade(score);
          }

          if (!allExams[studentId]) allExams[studentId] = {};
          allExams[studentId][currentCourseId] = {
            score,
            date,
            status,
            grade,
            notes,
            updatedAt: new Date().toISOString()
          };
        }
      });

      StudentAPI.saveAllExams(allExams);

      // Sync to Firebase
      if (StudentAPI.isCloudConnected()) {
        try {
          await firebase.database().ref("exams").set(allExams);
        } catch (fbErr) {
          console.warn("Firebase exams batch sync notice:", fbErr);
        }
      }

      App.showToast(`បានរក្សាទុកពិន្ទុប្រលងទាំងអស់ដោយជោគជ័យ!`, "success");
      App.triggerConfetti();
      this.updateKpiStats();
      this.renderTable();
    } catch (err) {
      App.showToast("កំហុសក្នុងការរក្សាទុកពិន្ទុ: " + err.message, "error");
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> <span>រក្សាទុកពិន្ទុទាំងអស់</span>`;
      }
    }
  },

  async promoteStudent(studentId) {
    try {
      const res = await StudentAPI.promoteStudentCourse(studentId);
      if (res.isGraduated) {
        App.showToast(`🎉 អបអរសាទរ! សិស្ស ${res.student.NameKh} បានបញ្ចប់វគ្គសិក្សាកុំព្យូទ័រទាំង ៤ ដោយជោគជ័យ!`, "success");
        App.triggerConfetti();
      } else {
        App.showToast(`បានតម្លើងសិស្ស ${res.student.NameKh} ឱ្យឡើងទៅរៀនវគ្គ [${res.nextCourse}] ដោយជោគជ័យ!`, "success");
      }
      this.updateKpiStats();
      this.renderTable();
      if (DashboardView) DashboardView.update(App.state.students);
    } catch (err) {
      App.showToast("កំហុសក្នុងការឡើងវគ្គ: " + err.message, "error");
    }
  },

  printStudentTranscript(studentId) {
    const student = (App.state.students || []).find(s => s.ID === studentId);
    if (!student) return;

    const exams = StudentAPI.getStudentExams(studentId);
    const modalRoot = document.getElementById("modalRoot");
    if (!modalRoot) return;

    const printWin = window.open("", "_blank");
    if (!printWin) {
      App.showToast("សូមបើកអនុញ្ញាត Pop-up ក្នុង Browser ដើម្បីបោះពុម្ព!", "warning");
      return;
    }

    const typingScore = exams.Typing?.score ?? "—";
    const typingGrade = exams.Typing?.grade ?? "—";
    const wordScore = exams.Word?.score ?? "—";
    const wordGrade = exams.Word?.grade ?? "—";
    const excelScore = exams.Excel?.score ?? "—";
    const excelGrade = exams.Excel?.grade ?? "—";
    const ppScore = exams.PowerPoint?.score ?? "—";
    const ppGrade = exams.PowerPoint?.grade ?? "—";

    let avgScore = "—";
    const validScores = [exams.Typing?.score, exams.Word?.score, exams.Excel?.score, exams.PowerPoint?.score].filter(s => typeof s === "number");
    if (validScores.length > 0) {
      avgScore = Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length);
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html lang="km">
      <head>
        <meta charset="UTF-8">
        <title>ព្រឹត្តិបត្រពិន្ទុ & លិខិតបញ្ជាក់ការសិក្សា - ${student.NameKh}</title>
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Kantumruy Pro', sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #8b5cf6; padding-bottom: 20px; margin-bottom: 24px; }
          .header h1 { font-size: 22px; margin: 0 0 6px 0; color: #4f46e5; }
          .header h2 { font-size: 17px; margin: 0 0 6px 0; color: #0f172a; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; background: #f8fafc; padding: 18px; border-radius: 8px; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px; }
          th, td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; }
          th { background: #f1f5f9; font-weight: 700; }
          .text-center { text-align: center; }
          .badge-pass { color: #059669; font-weight: 700; }
          .badge-fail { color: #dc2626; font-weight: 700; }
          .footer-sign { display: flex; justify-content: space-between; margin-top: 50px; text-align: center; }
          .sign-box { width: 220px; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>សាលាអន្តរជាតិ MASTERSCHOOL</h1>
          <h2>ព្រឹត្តិបត្រពិន្ទុបញ្ចប់វគ្គកុំព្យូទ័ររដ្ឋបាល (OFFICIAL COMPUTER TRANSCRIPT)</h2>
          <p style="font-size: 12px; color: #64748b; margin: 0;">កាលបរិច្ឆេទចេញ៖ ${new Date().toLocaleDateString('km-KH')}</p>
        </div>

        <div class="info-grid">
          <div><strong>អត្តលេខសិស្ស:</strong> ${student.ID}</div>
          <div><strong>ភេទ:</strong> ${student.Gender}</div>
          <div><strong>ឈ្មោះខ្មែរ:</strong> ${student.NameKh}</div>
          <div><strong>ឈ្មោះឡាតាំង:</strong> ${student.NameEn || '—'}</div>
          <div><strong>ថ្នាក់សិក្សា:</strong> ${student.Grade}</div>
          <div><strong>វេនសិក្សា:</strong> ${App.getShiftLabel(student.Shift)}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th class="text-center" style="width: 50px;">ល.រ</th>
              <th>វគ្គសិក្សាកុំព្យូទ័រ</th>
              <th class="text-center" style="width: 110px;">ពិន្ទុ (Max 100)</th>
              <th class="text-center" style="width: 90px;">និទ្ទេស</th>
              <th class="text-center" style="width: 120px;">លទ្ធផល</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-center font-bold">1</td>
              <td><strong>វគ្គទី ១: Typing</strong> (វាយអត្ថបទខ្មែរ-អង់គ្លេស)</td>
              <td class="text-center font-bold">${typingScore}</td>
              <td class="text-center font-bold">${typingGrade}</td>
              <td class="text-center ${exams.Typing?.status === 'Pass' ? 'badge-pass' : 'badge-fail'}">${exams.Typing?.status === 'Pass' ? '✓ ជាប់ (Pass)' : 'មិនទាន់ជាប់'}</td>
            </tr>
            <tr>
              <td class="text-center font-bold">2</td>
              <td><strong>វគ្គទី ២: Microsoft Word</strong> (រដ្ឋបាល & តាក់តែងអត្ថបទ)</td>
              <td class="text-center font-bold">${wordScore}</td>
              <td class="text-center font-bold">${wordGrade}</td>
              <td class="text-center ${exams.Word?.status === 'Pass' ? 'badge-pass' : 'badge-fail'}">${exams.Word?.status === 'Pass' ? '✓ ជាប់ (Pass)' : 'មិនទាន់ជាប់'}</td>
            </tr>
            <tr>
              <td class="text-center font-bold">3</td>
              <td><strong>វគ្គទី ៣: Microsoft Excel</strong> (គណនាតារាង & រូបមន្ត)</td>
              <td class="text-center font-bold">${excelScore}</td>
              <td class="text-center font-bold">${excelGrade}</td>
              <td class="text-center ${exams.Excel?.status === 'Pass' ? 'badge-pass' : 'badge-fail'}">${exams.Excel?.status === 'Pass' ? '✓ ជាប់ (Pass)' : 'មិនទាន់ជាប់'}</td>
            </tr>
            <tr>
              <td class="text-center font-bold">4</td>
              <td><strong>វគ្គទី ៤: Microsoft PowerPoint</strong> (Slide & បទបង្ហាញ)</td>
              <td class="text-center font-bold">${ppScore}</td>
              <td class="text-center font-bold">${ppGrade}</td>
              <td class="text-center ${exams.PowerPoint?.status === 'Pass' ? 'badge-pass' : 'badge-fail'}">${exams.PowerPoint?.status === 'Pass' ? '✓ ជាប់ (Pass)' : 'មិនទាន់ជាប់'}</td>
            </tr>
            <tr style="background: #f8fafc; font-weight: 700;">
              <td colspan="2" style="text-align: right; font-size: 15px;">ពិន្ទុមធ្យមភាគរួម (Overall Average):</td>
              <td class="text-center" style="font-size: 16px; color: #4f46e5;">${avgScore}</td>
              <td class="text-center" style="font-size: 16px; color: #4f46e5;">${this.calculateGrade(avgScore) || '—'}</td>
              <td class="text-center" style="color: #059669;">${student.Status === 'Graduated' ? '🎓 បញ្ចប់ការសិក្សា' : 'កំពុងសិក្សា'}</td>
            </tr>
          </tbody>
        </table>

        <div class="footer-sign">
          <div class="sign-box">
            <p>បានឃើញ និងពិនិត្យត្រឹមត្រូវ<br><strong>ប្រធានផ្នែកបណ្តុះបណ្តាល</strong></p>
            <div style="height: 60px;"></div>
            <p>.......................................</p>
          </div>
          <div class="sign-box">
            <p>រាជធានីភ្នំពេញ, ថ្ងៃទី....... ខែ....... ឆ្នាំ២០២៦<br><strong>នាយកសាលា MasterSchool</strong></p>
            <div style="height: 60px;"></div>
            <p>.......................................</p>
          </div>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWin.document.close();
  },

  renderTable() {
    const container = document.getElementById("examTableContainer");
    if (!container) return;

    this.updateKpiStats();
    const students = this.getComputerStudents();
    const allExams = StudentAPI.getAllExams();

    if (this.currentTab === "all") {
      // Render Master Transcripts Table across all 4 courses
      this.renderMasterTranscriptTable(container, students, allExams);
      return;
    }

    const currentCourse = this.currentTab; // Typing, Word, Excel, PowerPoint
    const courseMeta = APP_CONFIG.computerCourses.find(c => c.id === currentCourse) || APP_CONFIG.computerCourses[0];

    // Filter by exam status if filter selected
    let filteredStudents = students;
    if (this.filters.status) {
      filteredStudents = filteredStudents.filter(s => {
        const ex = allExams[s.ID]?.[currentCourse];
        const st = ex?.status || "Pending";
        return st === this.filters.status;
      });
    }

    container.innerHTML = `
      <!-- Module Exam Quick Action Banner -->
      <div class="exam-module-banner" style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9)); border: 1px solid var(--border-color); border-left: 4px solid ${courseMeta.color}; border-radius: 10px; padding: 12px 18px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; box-shadow: var(--shadow-xs);">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 40px; height: 40px; border-radius: 8px; background: ${courseMeta.color}15; color: ${courseMeta.color}; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
            <i class="fa-solid ${courseMeta.icon}"></i>
          </div>
          <div>
            <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
              <span>វិញ្ញាសាប្រឡងវាស់ស្ទង់សមត្ថភាពវគ្គ ${courseMeta.name}</span>
              <span class="badge" style="background: ${courseMeta.color}20; color: ${courseMeta.color}; font-size: 0.74rem; font-weight: 700;">
                ${(EXAM_PAPERS_DATA[currentCourse] || []).length} វិញ្ញាសាផ្លូវការ
              </span>
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">
              ${courseMeta.description || 'កិច្ចការប្រឡងបញ្ចប់វគ្គ'} • ពិន្ទុអតិបរមា 100 • ជាប់ចាប់ពី 50 ឡើងទៅ
            </div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <button type="button" class="btn-secondary" style="height: 32px; padding: 0 12px; font-size: 0.8rem;" onclick="ExamsView.openExamPapersModal('${currentCourse}')">
            <i class="fa-solid fa-file-lines" style="color: ${courseMeta.color};"></i>
            <span>មើលវិញ្ញាសា (${(EXAM_PAPERS_DATA[currentCourse] || []).length})</span>
          </button>
          <button type="button" class="btn-secondary" style="height: 32px; padding: 0 12px; font-size: 0.8rem;" onclick="ExamsView.printOfficialExamPaper(null, '${currentCourse}')">
            <i class="fa-solid fa-print"></i>
            <span>🖨️ បោះពុម្ពក្រដាសប្រឡង A4</span>
          </button>
          <button type="button" class="btn-primary" style="height: 32px; padding: 0 14px; font-size: 0.8rem; background: linear-gradient(135deg, ${courseMeta.color}, #4f46e5); border: none; box-shadow: 0 2px 8px ${courseMeta.color}40;" onclick="ExamsView.openLiveExamArena('${currentCourse}')">
            <i class="fa-solid fa-play"></i>
            <span>🚀 ចូលប្រឡង ${courseMeta.name} ផ្ទាល់</span>
          </button>
        </div>
      </div>

      <table class="att-table-5days">
        <thead>
          <tr>
            <th class="text-center" style="width: 45px;">#</th>
            <th style="width: 95px;">អត្តលេខ</th>
            <th style="width: 220px;">ព័ត៌មានសិស្ស</th>
            <th style="width: 140px;">វគ្គកំពុងរៀន</th>
            <th style="width: 120px;">វេនសិក្សា</th>
            <th class="text-center" style="width: 120px;">
              ពិន្ទុប្រលង (${courseMeta.name})
              <div style="font-size: 0.7rem; font-weight: 500; color: var(--text-muted);">Max: 100</div>
            </th>
            <th class="text-center" style="width: 140px;">កាលបរិច្ឆេទប្រលង</th>
            <th class="text-center" style="width: 120px;">លទ្ធផល</th>
            <th class="text-center" style="width: 70px;">និទ្ទេស</th>
            <th class="text-center" style="width: 180px;">សកម្មភាព & ការឡើងវគ្គ</th>
          </tr>
        </thead>
        <tbody>
          ${filteredStudents.length === 0 ? `
            <tr><td colspan="10" class="text-center py-5 text-muted">មិនមានសិស្សតាមលក្ខខណ្ឌតម្រងឡើយ</td></tr>
          ` : filteredStudents.map((s, idx) => {
            const ex = allExams[s.ID]?.[currentCourse] || {};
            const scoreVal = ex.score !== null && ex.score !== undefined ? ex.score : "";
            const dateVal = ex.date || "";
            const status = ex.status || (scoreVal !== "" ? (scoreVal >= 50 ? "Pass" : "Fail") : "Pending");
            const grade = ex.grade || this.calculateGrade(scoreVal);
            const notesVal = ex.notes || "";
            const isPassed = status === "Pass" || status === "ជាប់";

            // Next course promotion label
            let nextStepLabel = "ឡើងវគ្គបន្ទាប់";
            if (currentCourse === "Typing") nextStepLabel = "ឡើងរៀន Word ➔";
            else if (currentCourse === "Word") nextStepLabel = "ឡើងរៀន Excel ➔";
            else if (currentCourse === "Excel") nextStepLabel = "ឡើងរៀន PowerPoint ➔";
            else if (currentCourse === "PowerPoint") nextStepLabel = "បញ្ចប់ការសិក្សា 🎓";

            return `
              <tr data-exam-row="${s.ID}">
                <td class="text-center font-semibold text-muted">${idx + 1}</td>
                <td><span class="badge badge-id font-mono">${App.escapeHtml(s.ID)}</span></td>
                <td>
                  <div class="user-badge">
                    <img src="${s.Avatar || App.getDefaultAvatar(s.Gender)}" alt="${s.NameKh}" class="avatar-sm" onerror="this.src='${App.getDefaultAvatar(s.Gender)}'">
                    <div>
                      <div class="font-bold student-name-link" onclick="App.viewStudentDetails('${s.ID}')">${App.escapeHtml(s.NameKh)}</div>
                      <div class="text-xs text-muted font-sans">${App.escapeHtml(s.NameEn || '')}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge-course ${App.getCourseBadgeClass(s.Course)}">
                    ${App.getCourseIcon(s.Course)} ${App.escapeHtml(s.Course || 'Typing')}
                  </span>
                </td>
                <td>
                  <span class="text-xs font-semibold">${App.getShiftLabel(s.Shift)}</span>
                </td>
                <td class="text-center">
                  <input type="number" 
                    class="form-control exam-score-input" 
                    min="0" max="100" 
                    value="${scoreVal}" 
                    placeholder="0 - 100"
                    style="width: 85px; text-align: center; font-weight: 800; font-size: 0.95rem; margin: 0 auto;"
                    oninput="ExamsView.handleScoreChange('${s.ID}', '${currentCourse}', this)"
                    onchange="ExamsView.handleScoreChange('${s.ID}', '${currentCourse}', this)">
                </td>
                <td class="text-center">
                  <input type="date" class="form-control exam-date-input" value="${dateVal}" style="width: auto; font-size: 0.8rem; padding: 4px 6px; margin: 0 auto;">
                </td>
                <td class="text-center exam-status-cell">
                  ${this.renderStatusBadge(status)}
                </td>
                <td class="text-center exam-grade-cell">
                  ${grade ? `<span class="badge badge-grade-letter grade-${grade}">${grade}</span>` : '—'}
                </td>
                <td class="text-center">
                  <div style="display: flex; align-items: center; justify-content: center; gap: 6px; flex-wrap: wrap;">
                    <button type="button" class="btn-action" style="background: rgba(16, 185, 129, 0.12); color: #059669; border-color: rgba(16, 185, 129, 0.3);" onclick="ExamsView.openLiveExamArena('${currentCourse}', null, '${s.ID}')" title="ចូលប្រឡងផ្ទាល់ (Live Exam)">
                      <i class="fa-solid fa-play"></i>
                    </button>

                    <button type="button" class="btn-action btn-view" onclick="ExamsView.saveSingleExam('${s.ID}', '${currentCourse}')" title="រក្សាទុកពិន្ទុសិស្សនេះ">
                      <i class="fa-solid fa-floppy-disk"></i>
                    </button>
                    
                    <button type="button" class="btn-promote-course" 
                      style="display: ${isPassed ? 'inline-flex' : 'none'};" 
                      onclick="ExamsView.promoteStudent('${s.ID}')" 
                      title="តម្លើងសិស្សឡើងវគ្គបន្ទាប់">
                      <i class="fa-solid fa-arrow-up-right-from-square"></i> ${nextStepLabel}
                    </button>

                    <button type="button" class="btn-action btn-edit" onclick="ExamsView.printStudentTranscript('${s.ID}')" title="បោះពុម្ពព្រឹត្តិបត្រពិន្ទុ">
                      <i class="fa-solid fa-print"></i>
                    </button>
                  </div>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    `;
  },

  renderMasterTranscriptTable(container, students, allExams) {
    container.innerHTML = `
      <table class="att-table-5days">
        <thead>
          <tr>
            <th class="text-center" style="width: 45px;">#</th>
            <th style="width: 95px;">អត្តលេខ</th>
            <th style="width: 200px;">ព័ត៌មានសិស្ស</th>
            <th class="text-center" style="width: 110px; background: rgba(139, 92, 246, 0.08) !important;">
              <i class="fa-solid fa-keyboard text-purple-500"></i> Typing
            </th>
            <th class="text-center" style="width: 110px; background: rgba(24, 90, 189, 0.08) !important;">
              <i class="fa-solid fa-file-word text-blue-500"></i> Word
            </th>
            <th class="text-center" style="width: 110px; background: rgba(16, 124, 65, 0.08) !important;">
              <i class="fa-solid fa-file-excel text-emerald-500"></i> Excel
            </th>
            <th class="text-center" style="width: 110px; background: rgba(216, 59, 1, 0.08) !important;">
              <i class="fa-solid fa-file-powerpoint text-amber-600"></i> PowerPoint
            </th>
            <th class="text-center" style="width: 100px;">មធ្យមភាគ</th>
            <th class="text-center" style="width: 120px;">ស្ថានភាពបញ្ចប់</th>
            <th class="text-center" style="width: 80px;">ព្រឹត្តិបត្រ</th>
          </tr>
        </thead>
        <tbody>
          ${students.length === 0 ? `
            <tr><td colspan="10" class="text-center py-5 text-muted">មិនមានទិន្នន័យសិស្សកុំព្យូទ័រឡើយ</td></tr>
          ` : students.map((s, idx) => {
            const ex = allExams[s.ID] || {};
            const typing = ex.Typing || {};
            const word = ex.Word || {};
            const excel = ex.Excel || {};
            const pp = ex.PowerPoint || {};

            const scores = [typing.score, word.score, excel.score, pp.score].filter(sc => typeof sc === "number");
            const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
            const isAllPassed = typing.status === "Pass" && word.status === "Pass" && excel.status === "Pass" && pp.status === "Pass";

            return `
              <tr>
                <td class="text-center font-semibold text-muted">${idx + 1}</td>
                <td><span class="badge badge-id font-mono">${App.escapeHtml(s.ID)}</span></td>
                <td>
                  <div class="user-badge">
                    <img src="${s.Avatar || App.getDefaultAvatar(s.Gender)}" alt="${s.NameKh}" class="avatar-sm" onerror="this.src='${App.getDefaultAvatar(s.Gender)}'">
                    <div>
                      <div class="font-bold student-name-link" onclick="App.viewStudentDetails('${s.ID}')">${App.escapeHtml(s.NameKh)}</div>
                      <div class="text-xs text-muted">${App.getShiftLabel(s.Shift)}</div>
                    </div>
                  </div>
                </td>
                
                <!-- Typing -->
                <td class="text-center">
                  ${typing.score !== undefined && typing.score !== null ? `
                    <div style="font-weight: 700; color: ${typing.status === 'Pass' ? '#8b5cf6' : '#ef4444'};">
                      ${typing.score} (${typing.grade || '—'})
                    </div>
                  ` : `<span class="text-muted text-xs">—</span>`}
                </td>

                <!-- Word -->
                <td class="text-center">
                  ${word.score !== undefined && word.score !== null ? `
                    <div style="font-weight: 700; color: ${word.status === 'Pass' ? '#185abd' : '#ef4444'};">
                      ${word.score} (${word.grade || '—'})
                    </div>
                  ` : `<span class="text-muted text-xs">—</span>`}
                </td>

                <!-- Excel -->
                <td class="text-center">
                  ${excel.score !== undefined && excel.score !== null ? `
                    <div style="font-weight: 700; color: ${excel.status === 'Pass' ? '#107c41' : '#ef4444'};">
                      ${excel.score} (${excel.grade || '—'})
                    </div>
                  ` : `<span class="text-muted text-xs">—</span>`}
                </td>

                <!-- PowerPoint -->
                <td class="text-center">
                  ${pp.score !== undefined && pp.score !== null ? `
                    <div style="font-weight: 700; color: ${pp.status === 'Pass' ? '#d83b01' : '#ef4444'};">
                      ${pp.score} (${pp.grade || '—'})
                    </div>
                  ` : `<span class="text-muted text-xs">—</span>`}
                </td>

                <!-- Average -->
                <td class="text-center">
                  ${avg !== null ? `
                    <span class="badge" style="background: rgba(79, 70, 229, 0.12); color: #4f46e5; font-size: 0.85rem; font-weight: 800;">
                      ${avg}
                    </span>
                  ` : '<span class="text-muted">—</span>'}
                </td>

                <!-- Status -->
                <td class="text-center">
                  ${isAllPassed || s.Status === 'Graduated' ? `
                    <span class="status-indicator status-graduated">
                      <i class="fa-solid fa-graduation-cap"></i> បញ្ចប់ការសិក្សា
                    </span>
                  ` : `
                    <span class="status-indicator status-active">
                      <i class="fa-solid fa-book-open"></i> កំពុងសិក្សា
                    </span>
                  `}
                </td>

                <!-- Action -->
                <td class="text-center">
                  <button type="button" class="btn-action btn-view" onclick="ExamsView.printStudentTranscript('${s.ID}')" title="បោះពុម្ពព្រឹត្តិបត្រពិន្ទុផ្លូវការ">
                    <i class="fa-solid fa-print"></i>
                  </button>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    `;
  },

  // ==========================================
  // EXAM PAPERS BANK & LIVE TYPING TEST ARENA
  // ==========================================
  typingState: {
    timerInterval: null,
    timeLeft: 180,
    totalTime: 180,
    isRunning: false,
    startTime: null,
    targetText: "",
    paper: null,
    wpm: 0,
    accuracy: 100,
    errors: 0,
    typedLength: 0,
    finalScore: 0,
    finalGrade: null,
    finalStatus: "Pending"
  },

  openExamPapersModal(courseFilter) {
    const defaultCourse = courseFilter || (this.currentTab === "all" ? "Typing" : this.currentTab);
    
    // Bind tab clicks inside papers modal
    const filterBtns = document.querySelectorAll(".exam-papers-filter-tabs .btn-paper-filter");
    filterBtns.forEach(btn => {
      btn.onclick = () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const c = btn.getAttribute("data-paper-course");
        this.renderExamPapersList(c);
      };
    });

    // Set active tab
    const targetBtn = document.querySelector(`.exam-papers-filter-tabs .btn-paper-filter[data-paper-course="${defaultCourse}"]`) ||
                      document.querySelector(`.exam-papers-filter-tabs .btn-paper-filter[data-paper-course="all"]`);
    if (targetBtn) {
      filterBtns.forEach(b => b.classList.remove("active"));
      targetBtn.classList.add("active");
    }

    this.renderExamPapersList(defaultCourse);
    ModalsComponent.open("examPapersModal");
  },

  renderExamPapersList(courseFilter) {
    const container = document.getElementById("examPapersListContainer");
    if (!container) return;

    if (typeof EXAM_PAPERS_DATA === "undefined") {
      container.innerHTML = `<div class="text-center py-5 text-muted">មិនអាចទាញទិន្នន័យវិញ្ញាសាបានឡើយ</div>`;
      return;
    }

    let papers = [];
    if (!courseFilter || courseFilter === "all") {
      Object.keys(EXAM_PAPERS_DATA).forEach(k => {
        papers = papers.concat(EXAM_PAPERS_DATA[k] || []);
      });
    } else {
      papers = EXAM_PAPERS_DATA[courseFilter] || [];
    }

    if (papers.length === 0) {
      container.innerHTML = `<div class="text-center py-5 text-muted">មិនមានវិញ្ញាសាក្នុងវគ្គនេះឡើយ</div>`;
      return;
    }

    const courseColorMap = {
      Typing: { color: "#8b5cf6", icon: "fa-keyboard", label: "វគ្គទី ១: Typing" },
      Word: { color: "#185abd", icon: "fa-file-word", label: "វគ្គទី ២: Word" },
      Excel: { color: "#107c41", icon: "fa-file-excel", label: "វគ្គទី ៣: Excel" },
      PowerPoint: { color: "#d83b01", icon: "fa-file-powerpoint", label: "វគ្គទី ៤: PowerPoint" }
    };

    container.innerHTML = papers.map((p) => {
      const meta = courseColorMap[p.courseId] || { color: "#4f46e5", icon: "fa-book", label: p.courseId };

      return `
        <div class="exam-paper-card" style="border-left: 4px solid ${meta.color};">
          <!-- Card Top Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
              <span class="badge font-mono" style="background: ${meta.color}18; color: ${meta.color}; font-weight: 800; font-size: 0.85rem; padding: 4px 8px; border-radius: 6px;">
                ${p.id}
              </span>
              <span class="badge" style="background: var(--border-light); color: var(--text-main); font-weight: 700; font-size: 0.78rem;">
                <i class="fa-solid ${meta.icon}" style="color: ${meta.color};"></i> ${meta.label}
              </span>
              <span class="badge" style="background: rgba(14, 165, 233, 0.1); color: #0284c7; font-size: 0.75rem;">
                <i class="fa-regular fa-clock"></i> ថិរវេលា: ${p.duration} នាទី
              </span>
              <span class="badge" style="background: rgba(16, 185, 129, 0.1); color: #059669; font-size: 0.75rem;">
                <i class="fa-solid fa-award"></i> ពិន្ទុពេញ: ${p.maxScore} (ជាប់ ≥ 50)
              </span>
            </div>

            <!-- Card Actions -->
            <div style="display: flex; gap: 8px;">
              <button type="button" class="btn-secondary" style="height: 32px; padding: 0 12px; font-size: 0.78rem;" onclick="ExamsView.printOfficialExamPaper('${p.id}', '${p.courseId}')" title="បោះពុម្ពក្រដាសវិញ្ញាសា A4">
                <i class="fa-solid fa-print"></i> <span>បោះពុម្ព A4</span>
              </button>
              <button type="button" class="btn-primary" style="height: 32px; padding: 0 12px; font-size: 0.78rem; background: linear-gradient(135deg, ${meta.color}, #4f46e5); border: none; box-shadow: 0 2px 8px ${meta.color}35;" onclick="ExamsView.openLiveExamArena('${p.courseId}', '${p.id}')">
                <i class="fa-solid fa-play"></i> <span>ធ្វើតេស្តផ្ទាល់</span>
              </button>
            </div>
          </div>

          <!-- Title & Description -->
          <h4 style="margin: 0 0 6px 0; font-size: 1.05rem; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
            <span>${App.escapeHtml(p.title)}</span>
          </h4>
          <p style="margin: 0 0 14px 0; font-size: 0.85rem; color: var(--text-muted); line-height: 1.6;">
            ${App.escapeHtml(p.description)}
          </p>

          <!-- Paper Details Section -->
          ${p.courseId === 'Typing' ? `
            <div style="background: var(--border-light); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px 16px; margin-bottom: 14px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <strong style="font-size: 0.82rem; color: var(--text-main);"><i class="fa-solid fa-keyboard text-purple-500"></i> អត្ថបទសម្រាប់វាយ (${p.lang || 'ខ្មែរ'}):</strong>
                <button type="button" class="btn-action" style="font-size: 0.75rem; padding: 2px 8px; height: auto;" onclick="navigator.clipboard.writeText(\`${p.sampleText.replace(/`/g, '\\`')}\`); App.showToast('បានចម្លងអត្ថបទរួចរាល់!', 'info');" title="ចម្លងអត្ថបទ">
                  <i class="fa-solid fa-copy"></i> ចម្លងអត្ថបទ
                </button>
              </div>
              <div style="font-size: 0.88rem; line-height: 1.8; color: var(--text-main); font-family: 'Kantumruy Pro', sans-serif;">
                ${App.escapeHtml(p.sampleText)}
              </div>
            </div>
          ` : ''}

          ${p.requirements ? `
            <div style="background: var(--border-light); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px 16px; margin-bottom: 14px;">
              <strong style="display: block; font-size: 0.82rem; color: var(--text-main); margin-bottom: 8px;">
                <i class="fa-solid fa-list-check" style="color: ${meta.color};"></i> កិច្ចការ និងលក្ខខណ្ឌបច្ចេកទេសត្រូវអនុវត្ត (Exam Tasks & Requirements):
              </strong>
              <ul style="margin: 0; padding-left: 20px; font-size: 0.84rem; line-height: 1.7; color: var(--text-main);">
                ${p.requirements.map(req => `<li>${App.escapeHtml(req)}</li>`).join("")}
              </ul>
            </div>
          ` : ''}

          ${p.slideList ? `
            <div style="background: var(--border-light); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px 16px; margin-bottom: 14px;">
              <strong style="display: block; font-size: 0.82rem; color: var(--text-main); margin-bottom: 8px;">
                <i class="fa-solid fa-images text-amber-600"></i> រចនាសម្ព័ន្ធ Slide ត្រូវរៀបចំ (Slide Structure):
              </strong>
              <ul style="margin: 0; padding-left: 20px; font-size: 0.84rem; line-height: 1.7; color: var(--text-main);">
                ${p.slideList.map(sl => `<li>${App.escapeHtml(sl)}</li>`).join("")}
              </ul>
            </div>
          ` : ''}

          <!-- Scoring Rubric Breakdown Table -->
          <div style="margin-top: 10px;">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-scale-balanced" style="color: ${meta.color};"></i>
              <span>តារាងបែងចែកពិន្ទុវាយតម្លៃ (Grading Rubric Breakdown):</span>
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 6px; overflow: hidden;">
              <thead>
                <tr style="background: var(--border-light); text-align: left;">
                  <th style="padding: 6px 12px; border-bottom: 1px solid var(--border-color); width: 70%;">លក្ខខណ្ឌវាយតម្លៃ (Criteria)</th>
                  <th style="padding: 6px 12px; border-bottom: 1px solid var(--border-color); width: 30%; text-align: right;">កម្រិតពិន្ទុ (Score)</th>
                </tr>
              </thead>
              <tbody>
                ${(p.rubric || []).map(r => `
                  <tr>
                    <td style="padding: 6px 12px; border-bottom: 1px dashed var(--border-color); color: var(--text-main);">${App.escapeHtml(r.criteria)}</td>
                    <td style="padding: 6px 12px; border-bottom: 1px dashed var(--border-color); text-align: right; font-weight: 700; color: ${meta.color};">${App.escapeHtml(r.score)}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }).join("");
  },

  printOfficialExamPaper(paperId, courseId) {
    let paper = null;

    if (paperId) {
      Object.keys(EXAM_PAPERS_DATA).forEach(k => {
        const found = EXAM_PAPERS_DATA[k].find(p => p.id === paperId);
        if (found) paper = found;
      });
    } else if (courseId && EXAM_PAPERS_DATA[courseId]) {
      paper = EXAM_PAPERS_DATA[courseId][0];
    } else {
      paper = EXAM_PAPERS_DATA.Typing[0];
    }

    if (!paper) {
      App.showToast("រកមិនឃើញវិញ្ញាសាសម្រាប់បោះពុម្ពឡើយ", "warning");
      return;
    }

    const printWin = window.open("", "_blank");
    if (!printWin) {
      App.showToast("សូមបើកអនុញ្ញាត Pop-up ក្នុង Browser ដើម្បីបោះពុម្ព!", "warning");
      return;
    }

    const courseNames = {
      Typing: "វគ្គទី ១: ជំនាញវាយអត្ថបទកុំព្យូទ័រ (Computer Touch Typing)",
      Word: "វគ្គទី ២: ការរៀបចំឯកសាររដ្ឋបាល (Microsoft Word Processing)",
      Excel: "វគ្គទី ៣: ការគ្រប់គ្រងតារាង និងគណនារូបមន្ត (Microsoft Excel Spreadsheets)",
      PowerPoint: "វគ្គទី ៤: ការរចនាស្លាយ & បទបង្ហាញវិជ្ជាជីវៈ (Microsoft PowerPoint Presentations)"
    };

    printWin.document.write(`
      <!DOCTYPE html>
      <html lang="km">
      <head>
        <meta charset="UTF-8">
        <title>ក្រដាសវិញ្ញាសាប្រឡង - ${paper.id} (${paper.courseId})</title>
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
        <style>
          @page { size: A4; margin: 20mm 15mm 15mm 15mm; }
          body {
            font-family: 'Kantumruy Pro', sans-serif;
            color: #0f172a;
            max-width: 820px;
            margin: 0 auto;
            padding: 10px;
            line-height: 1.5;
            font-size: 13.5px;
          }
          .national-header {
            text-align: center;
            margin-bottom: 20px;
          }
          .national-header h2 {
            font-size: 16px;
            margin: 0 0 4px 0;
            font-weight: 700;
          }
          .national-header h3 {
            font-size: 14px;
            margin: 0;
            font-weight: 700;
          }
          .school-header-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 12px;
            margin-bottom: 16px;
          }
          .school-info h1 {
            font-size: 17px;
            margin: 0 0 4px 0;
            color: #1e3a8a;
            font-weight: 800;
          }
          .school-info p {
            margin: 0;
            font-size: 12px;
            color: #475569;
          }
          .exam-meta-box {
            text-align: right;
            font-size: 12px;
          }
          .exam-title-badge {
            text-align: center;
            background: #f1f5f9;
            border: 1px solid #cbd5e1;
            padding: 8px 12px;
            border-radius: 6px;
            margin-bottom: 16px;
          }
          .exam-title-badge h2 {
            margin: 0 0 4px 0;
            font-size: 16px;
            color: #0f172a;
          }
          .exam-title-badge p {
            margin: 0;
            font-size: 12.5px;
            color: #334155;
            font-weight: 600;
          }
          .candidate-box {
            border: 1.5px solid #0f172a;
            border-radius: 6px;
            padding: 12px 16px;
            margin-bottom: 18px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            font-size: 13px;
          }
          .candidate-row {
            display: flex;
            align-items: center;
          }
          .dots {
            flex: 1;
            border-bottom: 1px dotted #64748b;
            margin-left: 6px;
            height: 14px;
          }
          .section-title {
            font-size: 14px;
            font-weight: 700;
            color: #1e3a8a;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 4px;
            margin: 16px 0 8px 0;
            text-transform: uppercase;
          }
          .instructions-box {
            background: #fafafa;
            border-left: 3px solid #3b82f6;
            padding: 8px 12px;
            font-size: 12px;
            margin-bottom: 14px;
          }
          .task-box {
            border: 1px solid #cbd5e1;
            padding: 12px 14px;
            border-radius: 6px;
            margin-bottom: 14px;
          }
          .rubric-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            margin-bottom: 24px;
          }
          .rubric-table th, .rubric-table td {
            border: 1px solid #94a3b8;
            padding: 6px 10px;
          }
          .rubric-table th {
            background: #f1f5f9;
            font-weight: 700;
          }
          .signature-grid {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
            page-break-inside: avoid;
          }
          .sig-box {
            width: 200px;
            text-align: center;
            font-size: 12.5px;
          }
          .sig-space {
            height: 60px;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <!-- National Cambodian Header -->
        <div class="national-header">
          <h2>ព្រះរាជាណាចក្រកម្ពុជា</h2>
          <h3>ជាតិ សាសនា ព្រះមហាក្សត្រ</h3>
          <div style="font-size: 14px; letter-spacing: 2px;">***</div>
        </div>

        <!-- School Header -->
        <div class="school-header-row">
          <div class="school-info">
            <h1>សាលាអន្តរជាតិ MASTERSCHOOL</h1>
            <p>វិទ្យាស្ថានបណ្តុះបណ្តាលព័ត៌មានវិទ្យា & កុំព្យូទ័ររដ្ឋបាល</p>
            <p style="font-weight: 700; color: #0f172a; margin-top: 2px;">${courseNames[paper.courseId] || paper.courseId}</p>
          </div>
          <div class="exam-meta-box">
            <div><strong>កូដវិញ្ញាសា:</strong> ${paper.id}</div>
            <div><strong>ថិរវេលា:</strong> ${paper.duration} នាទី</div>
            <div><strong>ពិន្ទុសរុប:</strong> ${paper.maxScore} ពិន្ទុ (ជាប់ ≥ 50)</div>
            <div><strong>កាលបរិច្ឆេទ:</strong> ថ្ងៃទី....... ខែ....... ឆ្នាំ២០២៦</div>
          </div>
        </div>

        <!-- Exam Title -->
        <div class="exam-title-badge">
          <h2>ក្រដាសវិញ្ញាសាប្រឡងបញ្ចប់វគ្គ (OFFICIAL EXAMINATION PAPER)</h2>
          <p>${paper.title}</p>
        </div>

        <!-- Candidate Details Form -->
        <div class="candidate-box">
          <div class="candidate-row"><strong>អត្តលេខសិស្ស (ID):</strong><div class="dots"></div></div>
          <div class="candidate-row"><strong>ភេទ:</strong><div class="dots" style="max-width: 60px;"></div> <strong style="margin-left: 10px;">វេនសិក្សា:</strong><div class="dots"></div></div>
          <div class="candidate-row"><strong>ឈ្មោះជាភាសាខ្មែរ:</strong><div class="dots"></div></div>
          <div class="candidate-row"><strong>ឈ្មោះជាឡាតាំង:</strong><div class="dots"></div></div>
          <div class="candidate-row"><strong>បន្ទប់ប្រឡងលេខ:</strong><div class="dots"></div></div>
          <div class="candidate-row"><strong>លេខតុប្រឡង:</strong><div class="dots"></div></div>
        </div>

        <!-- Section 1: Instructions -->
        <div class="section-title">ផ្នែកទី ១៖ សេចក្តីណែនាំទូទៅ (EXAM INSTRUCTIONS)</div>
        <div class="instructions-box">
          1. បេក្ខជនត្រូវបិទទូរស័ព្ទដៃ និងរក្សាភាពស្ងប់ស្ងាត់ក្នុងបន្ទប់ប្រឡងជានិច្ច។<br>
          2. រាល់ឯកសារកិច្ចការប្រឡង ត្រូវបង្កើត Folder រក្សាទុកលើ Desktop ដោយដាក់ឈ្មោះ៖ <strong>[អត្តលេខ_ឈ្មោះសិស្ស]</strong>។<br>
          3. មិនអនុញ្ញាតឱ្យលួចចម្លងគ្នា ឬប្រើប្រាស់ឧបករណ៍ជំនួយពីខាងក្រៅដោយគ្មានការអនុញ្ញាតឡើយ។
        </div>

        <!-- Section 2: Tasks -->
        <div class="section-title">ផ្នែកទី ២៖ ប្រធានវិញ្ញាសា & កិច្ចការត្រូវអនុវត្ត (EXAM TASKS)</div>
        <div class="task-box">
          <p style="margin: 0 0 10px 0; font-weight: 600;">${paper.description}</p>

          ${paper.courseId === 'Typing' ? `
            <div style="background: #f8fafc; border: 1px dashed #64748b; padding: 12px; border-radius: 6px; font-size: 13.5px; line-height: 1.8;">
              <strong>អត្ថបទត្រូវវាយ៖</strong><br>
              ${paper.sampleText}
            </div>
          ` : ''}

          ${paper.requirements ? `
            <div style="margin-top: 8px;">
              <strong>កិច្ចការ និងលក្ខខណ្ឌបច្ចេកទេសត្រូវបំពេញ៖</strong>
              <ol style="margin: 6px 0; padding-left: 20px; line-height: 1.7;">
                ${paper.requirements.map(req => `<li>${req}</li>`).join("")}
              </ol>
            </div>
          ` : ''}

          ${paper.slideList ? `
            <div style="margin-top: 8px;">
              <strong>រចនាសម្ព័ន្ធ Slide ត្រូវរៀបចំ៖</strong>
              <ul style="margin: 6px 0; padding-left: 20px; line-height: 1.7;">
                ${paper.slideList.map(sl => `<li>${sl}</li>`).join("")}
              </ul>
            </div>
          ` : ''}
        </div>

        <!-- Section 3: Rubric -->
        <div class="section-title">ផ្នែកទី ៣៖ តារាងបែងចែកពិន្ទុវាយតម្លៃ (SCORING RUBRIC)</div>
        <table class="rubric-table">
          <thead>
            <tr>
              <th style="width: 50px; text-align: center;">ល.រ</th>
              <th>លក្ខខណ្ឌវាយតម្លៃបច្ចេកទេស (Evaluation Criteria)</th>
              <th style="width: 140px; text-align: center;">ពិន្ទុទទួលបាន (Max 100)</th>
            </tr>
          </thead>
          <tbody>
            ${(paper.rubric || []).map((r, i) => `
              <tr>
                <td style="text-align: center; font-weight: 700;">${i + 1}</td>
                <td>${r.criteria}</td>
                <td style="text-align: center; font-weight: 700;">${r.score}</td>
              </tr>
            `).join("")}
            <tr style="background: #f8fafc; font-weight: 800;">
              <td colspan="2" style="text-align: right;">ពិន្ទុសរុបទទួលបាន (TOTAL SCORE):</td>
              <td style="text-align: center; font-size: 14px;">........ / 100</td>
            </tr>
          </tbody>
        </table>

        <!-- Section 4: Signatures -->
        <div class="signature-grid">
          <div class="sig-box">
            <p>ហត្ថលេខាបេក្ខជន<br><strong>(Candidate Signature)</strong></p>
            <div class="sig-space"></div>
            <p>............................................</p>
          </div>
          <div class="sig-box">
            <div style="border: 2px solid #0f172a; padding: 6px; border-radius: 6px; font-weight: 800;">
              ពិន្ទុបូកសរុប៖ ......... / 100<br>
              និទ្ទេសរួម៖ [ ........... ]
            </div>
          </div>
          <div class="sig-box">
            <p>ហត្ថលេខា & ឈ្មោះគ្រូវាយតម្លៃ<br><strong>(Examiner Signature)</strong></p>
            <div class="sig-space"></div>
            <p>............................................</p>
          </div>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWin.document.close();
  },

  // ==========================================
  // MULTI-MODULE LIVE EXAM ARENA & AUTO-RECORDING
  // Typing ➔ Word ➔ Excel ➔ PowerPoint
  // ==========================================
  openLiveTypingModal(paperId, studentId) {
    this.openLiveExamArena("Typing", paperId, studentId);
  },

  openLiveExamArena(courseKey, paperId, studentId) {
    const validCourse = ["Typing", "Word", "Excel", "PowerPoint"].includes(courseKey) ? courseKey : "Typing";
    this.activeArenaCourse = validCourse;

    ModalsComponent.close("examPapersModal");
    ModalsComponent.open("liveTypingModal");

    // Resolve student
    const computerStudents = this.getComputerStudents();
    let selectedStudentId = studentId;
    if (!selectedStudentId && computerStudents.length > 0) {
      selectedStudentId = computerStudents[0].ID;
    }
    this.activeArenaStudentId = selectedStudentId;

    // Populate student select dropdown
    const studentSelect = document.getElementById("typingStudentSelect");
    if (studentSelect) {
      studentSelect.innerHTML = computerStudents.map(s => `
        <option value="${s.ID}" ${selectedStudentId === s.ID ? 'selected' : ''}>
          ★ ${s.ID} - ${s.NameKh} (${App.getShiftLabel(s.Shift)} | វគ្គ ${s.Course || 'Typing'})
        </option>
      `).join("");
      studentSelect.value = selectedStudentId;
    }

    // Update modal header aesthetics based on course
    const metaMap = {
      Typing: { color: "#8b5cf6", icon: "fa-keyboard", gradient: "linear-gradient(135deg, #1e1b4b, #312e81)", badge: "វគ្គទី ១: Typing" },
      Word: { color: "#185abd", icon: "fa-file-word", gradient: "linear-gradient(135deg, #172554, #1e3a8a)", badge: "វគ្គទី ២: Word" },
      Excel: { color: "#107c41", icon: "fa-file-excel", gradient: "linear-gradient(135deg, #052e16, #065f46)", badge: "វគ្គទី ៣: Excel" },
      PowerPoint: { color: "#d83b01", icon: "fa-file-powerpoint", gradient: "linear-gradient(135deg, #431407, #7c2d12)", badge: "វគ្គទី ៤: PowerPoint" }
    };
    const cMeta = metaMap[validCourse] || metaMap.Typing;

    const headerEl = document.getElementById("arenaHeader");
    const iconBox = document.getElementById("arenaIconBox");
    const badgeEl = document.getElementById("arenaCourseBadge");
    if (headerEl) {
      headerEl.style.background = cMeta.gradient;
      headerEl.style.borderBottom = `2px solid ${cMeta.color}`;
    }
    if (iconBox) {
      iconBox.innerHTML = `<i class="fa-solid ${cMeta.icon}"></i>`;
      iconBox.style.color = cMeta.color;
      iconBox.style.background = `${cMeta.color}25`;
      iconBox.style.borderColor = `${cMeta.color}60`;
    }
    if (badgeEl) {
      badgeEl.textContent = cMeta.badge;
      badgeEl.style.background = cMeta.color;
    }

    // Update course tab buttons
    document.querySelectorAll(".arena-course-tab").forEach(tab => {
      if (tab.getAttribute("data-arena-course") === validCourse) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });

    // Reset result view
    const resultBox = document.getElementById("arenaResultContainer");
    if (resultBox) resultBox.style.display = "none";

    const typingContainer = document.getElementById("arenaTypingContainer");
    const practicalContainer = document.getElementById("arenaPracticalContainer");

    if (validCourse === "Typing") {
      if (typingContainer) typingContainer.style.display = "block";
      if (practicalContainer) practicalContainer.style.display = "none";

      // Set paper select
      const paperSelect = document.getElementById("typingPaperSelect");
      if (paperSelect) {
        paperSelect.value = paperId || "TYP-01";
        paperSelect.onchange = () => this.loadTypingPaper(paperSelect.value);
      }

      // Duration select
      const durationSelect = document.getElementById("typingDurationSelect");
      if (durationSelect) {
        durationSelect.onchange = () => {
          const secs = parseInt(durationSelect.value, 10) || 180;
          this.typingState.totalTime = secs;
          this.typingState.timeLeft = secs;
          this.updateTimerDisplay();
        };
      }

      const inputArea = document.getElementById("typingInputField");
      if (inputArea) {
        inputArea.value = "";
        inputArea.disabled = true;
        inputArea.oninput = (e) => this.handleTypingInput(e);
      }

      this.loadTypingPaper(paperId || "TYP-01");
      this.resetTypingTest();
    } else {
      if (typingContainer) typingContainer.style.display = "none";
      if (practicalContainer) practicalContainer.style.display = "block";

      this.setupPracticalCourseExam(validCourse, paperId);
    }
  },

  switchExamArenaCourse(courseKey) {
    this.stopTypingTest();
    this.stopPracticalTimer();
    this.openLiveExamArena(courseKey, null, this.activeArenaStudentId);
  },

  onStudentCandidateChanged(studentId) {
    this.activeArenaStudentId = studentId;
    App.showToast(`បានជ្រើសរើសបេក្ខជន៖ ${studentId}`, "info");
  },

  setupPracticalCourseExam(courseKey, paperId) {
    this.stopPracticalTimer();

    const papers = EXAM_PAPERS_DATA[courseKey] || [];
    const paper = (paperId ? papers.find(p => p.id === paperId) : null) || papers[0];

    if (!paper || !paper.questions || paper.questions.length === 0) {
      const qMount = document.getElementById("practicalQuestionsList");
      if (qMount) {
        qMount.innerHTML = `<div class="card p-4 text-center text-muted">មិនមានសំណួរប្រឡងសម្រាប់វគ្គនេះឡើយ</div>`;
      }
      return;
    }

    this.courseExamState.course = courseKey;
    this.courseExamState.paper = paper;
    this.courseExamState.questions = paper.questions || [];
    this.courseExamState.answers = {};
    this.courseExamState.isFinished = false;
    this.courseExamState.totalTime = 600; // 10 minutes
    this.courseExamState.timeLeft = 600;

    // Header info
    const titleEl = document.getElementById("practicalExamTitle");
    const subEl = document.getElementById("practicalExamSubtitle");
    if (titleEl) {
      titleEl.innerHTML = `<span>${App.escapeHtml(paper.title)}</span>`;
    }
    if (subEl) {
      subEl.textContent = `វគ្គ ${courseKey} • សរុប ${paper.questions.length} សំណួរ • ពិន្ទុពេញ ${paper.maxScore} (ជាប់ ≥ 50) • ថិរវេលា ១០ នាទី`;
    }

    // Progress
    const progVal = document.getElementById("practicalProgressVal");
    if (progVal) progVal.textContent = `0/${paper.questions.length}`;

    // Render questions list
    const qMount = document.getElementById("practicalQuestionsList");
    if (qMount) {
      qMount.innerHTML = paper.questions.map((q, qIndex) => {
        return `
          <div class="exam-q-card" id="examQCard_${q.id}">
            <div class="exam-q-header">
              <span class="exam-q-num">សំណួរទី ${qIndex + 1} / ${paper.questions.length} (១០ ពិន្ទុ)</span>
              <span class="badge" style="background: rgba(79, 70, 229, 0.1); color: #4f46e5; font-size: 0.72rem;">
                ${App.escapeHtml(q.scenario)}
              </span>
            </div>

            <h5 class="exam-q-text">${App.escapeHtml(q.question)}</h5>

            <div class="exam-options-grid">
              ${q.options.map((optText, optIdx) => {
                const optLetter = String.fromCharCode(65 + optIdx);
                return `
                  <label class="exam-opt-label" id="optLabel_${q.id}_${optIdx}">
                    <input type="radio" name="q_${q.id}" value="${optIdx}" onchange="ExamsView.handleOptionSelect(${q.id}, ${optIdx})">
                    <span style="font-weight: 700; color: #4f46e5; min-width: 22px;">[${optLetter}]</span>
                    <span>${App.escapeHtml(optText)}</span>
                  </label>
                `;
              }).join("")}
            </div>
          </div>
        `;
      }).join("");
    }

    this.startPracticalTimer();
  },

  handleOptionSelect(qId, optIdx) {
    this.courseExamState.answers[qId] = optIdx;

    // Highlight selected label
    const labels = document.querySelectorAll(`[id^="optLabel_${qId}_"]`);
    labels.forEach(l => l.classList.remove("selected"));

    const targetLabel = document.getElementById(`optLabel_${qId}_${optIdx}`);
    if (targetLabel) targetLabel.classList.add("selected");

    // Update progress
    const answeredCount = Object.keys(this.courseExamState.answers).length;
    const totalCount = this.courseExamState.questions.length;
    const progVal = document.getElementById("practicalProgressVal");
    if (progVal) progVal.textContent = `${answeredCount}/${totalCount}`;
  },

  startPracticalTimer() {
    this.stopPracticalTimer();
    this.updatePracticalTimerDisplay();

    this.courseExamState.timerInterval = setInterval(() => {
      this.courseExamState.timeLeft--;
      this.updatePracticalTimerDisplay();

      if (this.courseExamState.timeLeft <= 0) {
        this.stopPracticalTimer();
        App.showToast("អស់ថិរវេលាប្រឡងហើយ! ប្រព័ន្ធកំពុងគណនាពិន្ទុ និងបញ្ចូលស្វ័យប្រវត្តិ...", "warning");
        this.submitCourseExam();
      }
    }, 1000);
  },

  stopPracticalTimer() {
    if (this.courseExamState.timerInterval) {
      clearInterval(this.courseExamState.timerInterval);
      this.courseExamState.timerInterval = null;
    }
  },

  updatePracticalTimerDisplay() {
    const timerEl = document.getElementById("practicalTimerVal");
    if (!timerEl) return;
    const mins = Math.floor(this.courseExamState.timeLeft / 60);
    const secs = this.courseExamState.timeLeft % 60;
    timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    if (this.courseExamState.timeLeft <= 60) {
      timerEl.style.color = "#dc2626";
      timerEl.style.fontWeight = "800";
    } else {
      timerEl.style.color = "#ef4444";
    }
  },

  async submitCourseExam() {
    if (this.courseExamState.isFinished) return;
    this.courseExamState.isFinished = true;
    this.stopPracticalTimer();

    const questions = this.courseExamState.questions || [];
    let totalScore = 0;
    let correctCount = 0;

    const reviewItems = questions.map(q => {
      const userAns = this.courseExamState.answers[q.id];
      const isCorrect = userAns !== undefined && userAns === q.correct;
      if (isCorrect) {
        totalScore += (q.points || 10);
        correctCount++;
      }
      return {
        question: q,
        userAns: userAns,
        isCorrect: isCorrect
      };
    });

    if (totalScore > 100) totalScore = 100;
    if (totalScore < 0) totalScore = 0;

    const grade = this.calculateGrade(totalScore);
    const status = totalScore >= 50 ? "Pass" : "Fail";
    const courseKey = this.courseExamState.course;

    const studentSelect = document.getElementById("typingStudentSelect");
    const studentId = this.activeArenaStudentId || studentSelect?.value;
    const selectedOption = studentSelect ? studentSelect.options[studentSelect.selectedIndex] : null;
    const studentName = selectedOption ? selectedOption.text : studentId;

    // 1. AUTOMATIC SCORE INGESTION (បញ្ចូលពិន្ទុទៅតាមភាពជាក់ស្តែងដែលសិស្សធ្វើបានចូលទៅក្នងប្រព័ន្ធខ្លួនឯងតែម្តង)
    const notes = `ប្រឡងផ្ទាល់តាមប្រព័ន្ធ (${courseKey}): ទទួលបានពិន្ទុជាក់ស្តែង ${totalScore}/100 និទ្ទេស [${grade}] (${correctCount}/${questions.length} សំណួរត្រូវ)`;
    await this.autoSaveExamResult(studentId, courseKey, totalScore, grade, status, notes);

    // 2. Display Results Section
    const practicalContainer = document.getElementById("arenaPracticalContainer");
    const resultBox = document.getElementById("arenaResultContainer");
    if (practicalContainer) practicalContainer.style.display = "none";
    if (resultBox) {
      resultBox.style.display = "block";
      resultBox.scrollIntoView({ behavior: "smooth" });
    }

    const resTitle = document.getElementById("arenaResultHeaderTitle");
    const resInfo = document.getElementById("arenaResultStudentInfo");
    const resScore = document.getElementById("arenaResultScore");
    const resGrade = document.getElementById("arenaResultGrade");
    const resStatus = document.getElementById("arenaResultStatus");
    const resExtraLbl = document.getElementById("arenaResultExtraLbl");
    const resExtraVal = document.getElementById("arenaResultExtraVal");
    const bannerText = document.getElementById("autoSaveBannerText");

    if (resTitle) resTitle.textContent = `🎉 លទ្ធផលការប្រឡងបញ្ចប់វគ្គ ${courseKey}!`;
    if (resInfo) resInfo.textContent = `បេក្ខជន៖ ${studentName}`;
    if (resScore) resScore.textContent = `${totalScore} / 100`;
    if (resGrade) resGrade.innerHTML = grade ? `<span class="badge badge-grade-letter grade-${grade}">${grade}</span>` : "—";
    if (resStatus) {
      resStatus.innerHTML = status === "Pass"
        ? `<span style="color: #059669;"><i class="fa-solid fa-circle-check"></i> ជាប់ (Pass)</span>`
        : `<span style="color: #dc2626;"><i class="fa-solid fa-circle-xmark"></i> ធ្លាក់ (Fail)</span>`;
    }
    if (resExtraLbl) resExtraLbl.textContent = "ភាពត្រឹមត្រូវនៃចម្លើយ";
    if (resExtraVal) resExtraVal.textContent = `ត្រូវ ${correctCount}/${questions.length} សំណួរ (${totalScore}%)`;

    if (bannerText) {
      bannerText.innerHTML = `✅ ប្រព័ន្ធបានបញ្ចូលពិន្ទុជាក់ស្តែង <strong>${totalScore}/100</strong> និទ្ទេស <strong>[${grade}]</strong> ចូលទៅក្នុងប្រព័ន្ធ និង Firebase Database ដោយស្វ័យប្រវត្តរួចរាល់!`;
    }

    // 3. Render Answer Review Mount
    const reviewMount = document.getElementById("arenaAnswerReviewMount");
    if (reviewMount) {
      reviewMount.style.display = "block";
      reviewMount.innerHTML = `
        <h5 style="margin: 0 0 12px 0; font-size: 0.92rem; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-list-check text-indigo-600"></i>
          <span>ការពិនិត្យចម្លើយលម្អិត (Answer Review Breakdown):</span>
        </h5>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${reviewItems.map((item, idx) => {
            const q = item.question;
            const isCor = item.isCorrect;
            const userLetter = item.userAns !== undefined ? String.fromCharCode(65 + item.userAns) : "មិនបានឆ្លើយ";
            const corLetter = String.fromCharCode(65 + q.correct);

            return `
              <div style="background: var(--bg-surface); border-left: 4px solid ${isCor ? '#10b981' : '#ef4444'}; border-radius: 6px; padding: 10px 14px; font-size: 0.84rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <strong style="color: var(--text-main);">សំណួរទី ${idx + 1}: ${App.escapeHtml(q.question)}</strong>
                  <span class="badge ${isCor ? 'badge-pass' : 'badge-fail'}" style="font-size: 0.72rem;">
                    ${isCor ? '✓ ត្រូវ (+១០ ពិន្ទុ)' : '✗ ខុស (០ ពិន្ទុ)'}
                  </span>
                </div>
                <div style="color: var(--text-muted); margin-bottom: 4px; line-height: 1.5;">
                  <span>ចម្លើយរបស់អ្នក៖ <strong style="color: ${isCor ? '#059669' : '#dc2626'};">[${userLetter}] ${item.userAns !== undefined ? App.escapeHtml(q.options[item.userAns] || '') : ''}</strong></span>
                  ${!isCor ? `<span style="margin-left: 12px;">ចម្លើយត្រឹមត្រូវ៖ <strong style="color: #059669;">[${corLetter}] ${App.escapeHtml(q.options[q.correct])}</strong></span>` : ''}
                </div>
                <div style="font-size: 0.78rem; color: #64748b; background: var(--border-light); padding: 4px 8px; border-radius: 4px;">
                  💡 <strong>ពន្យល់៖</strong> ${App.escapeHtml(q.explanation)}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      `;
    }
  },

  // ==========================================
  // LIVE TYPING TEST ARENA LOGIC
  // ==========================================
  getGraphemeSegments(text) {
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      try {
        const segmenter = new Intl.Segmenter("km", { granularity: "grapheme" });
        return Array.from(segmenter.segment(text)).map(s => s.segment);
      } catch (err) {
        return Array.from(text);
      }
    }
    return Array.from(text);
  },

  loadTypingPaper(paperId) {
    const paper = (EXAM_PAPERS_DATA.Typing || []).find(p => p.id === paperId) || EXAM_PAPERS_DATA.Typing[0];
    this.typingState.paper = paper;
    this.typingState.targetText = (paper.sampleText || "").trim();
    this.typingState.segments = this.getGraphemeSegments(this.typingState.targetText);

    const display = document.getElementById("typingTargetDisplay");
    const meta = document.getElementById("typingTargetMeta");

    if (meta) {
      meta.textContent = `${paper.lang} • ចំនួនតួអក្សរ៖ ${this.typingState.targetText.length} តួ • ល្បឿនជាប់៖ ≥${paper.passWpm} WPM`;
    }

    if (display) {
      display.innerHTML = this.typingState.segments.map((seg, idx) => `
        <span class="tchar ${idx === 0 ? 'typing-char-current' : ''}" data-idx="${idx}">${seg === ' ' ? '&nbsp;' : App.escapeHtml(seg)}</span>
      `).join("");
    }
  },

  updateTimerDisplay() {
    const timerEl = document.getElementById("typingTimerVal");
    if (!timerEl) return;
    const mins = Math.floor(this.typingState.timeLeft / 60);
    const secs = this.typingState.timeLeft % 60;
    timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    if (this.typingState.timeLeft <= 30) {
      timerEl.style.color = "#dc2626";
    } else {
      timerEl.style.color = "#ef4444";
    }
  },

  startTypingTest() {
    if (this.typingState.isRunning) return;

    const durationSelect = document.getElementById("typingDurationSelect");
    const secs = parseInt(durationSelect?.value, 10) || 180;

    this.typingState.isRunning = true;
    this.typingState.totalTime = secs;
    this.typingState.timeLeft = secs;
    this.typingState.startTime = Date.now();
    this.typingState.errors = 0;
    this.typingState.wpm = 0;
    this.typingState.accuracy = 100;
    this.typingState.typedLength = 0;

    const inputArea = document.getElementById("typingInputField");
    if (inputArea) {
      inputArea.disabled = false;
      inputArea.value = "";
      inputArea.focus();
    }

    const startBtn = document.getElementById("startTypingBtn");
    if (startBtn) {
      startBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>កំពុងប្រឡង...</span>`;
      startBtn.disabled = true;
    }

    const resultBox = document.getElementById("arenaResultContainer");
    if (resultBox) resultBox.style.display = "none";

    this.updateTimerDisplay();

    clearInterval(this.typingState.timerInterval);
    this.typingState.timerInterval = setInterval(() => {
      this.typingState.timeLeft--;
      this.updateTimerDisplay();

      if (this.typingState.timeLeft <= 0) {
        this.finishTypingTest();
      }
    }, 1000);
  },

  handleTypingInput(e) {
    if (!this.typingState.isRunning) return;

    const typed = e.target.value;
    const typedSegments = this.getGraphemeSegments(typed);
    const targetSegments = this.typingState.segments || this.getGraphemeSegments(this.typingState.targetText);

    let errors = 0;
    const charEls = document.querySelectorAll("#typingTargetDisplay .tchar");

    targetSegments.forEach((targetSeg, i) => {
      const el = charEls[i];
      if (!el) return;

      el.classList.remove("typing-char-correct", "typing-char-error", "typing-char-current");

      if (i < typedSegments.length) {
        if (typedSegments[i] === targetSeg) {
          el.classList.add("typing-char-correct");
        } else {
          el.classList.add("typing-char-error");
          errors++;
        }
      } else if (i === typedSegments.length) {
        el.classList.add("typing-char-current");
      }
    });

    this.typingState.errors = errors;
    this.typingState.typedLength = typed.length;

    const elapsedMinutes = (Date.now() - this.typingState.startTime) / 60000;
    const wordsTyped = typed.length / 5;
    const wpm = elapsedMinutes > 0.02 ? Math.round(wordsTyped / elapsedMinutes) : 0;
    const accuracy = typedSegments.length > 0 
      ? Math.max(0, Math.round(((typedSegments.length - errors) / typedSegments.length) * 100)) 
      : 100;

    this.typingState.wpm = wpm;
    this.typingState.accuracy = accuracy;

    const elWpm = document.getElementById("typingWpmVal");
    const elAcc = document.getElementById("typingAccuracyVal");
    const elChars = document.getElementById("typingCharsVal");
    const elErr = document.getElementById("typingErrorsVal");

    if (elWpm) elWpm.textContent = wpm;
    if (elAcc) elAcc.textContent = `${accuracy}%`;
    if (elChars) elChars.textContent = `${typedSegments.length}/${targetSegments.length}`;
    if (elErr) elErr.textContent = errors;

    if (typedSegments.length >= targetSegments.length) {
      this.finishTypingTest();
    }
  },

  async finishTypingTest() {
    clearInterval(this.typingState.timerInterval);
    this.typingState.isRunning = false;

    const inputArea = document.getElementById("typingInputField");
    if (inputArea) inputArea.disabled = true;

    const startBtn = document.getElementById("startTypingBtn");
    if (startBtn) {
      startBtn.innerHTML = `<i class="fa-solid fa-check"></i> <span>បានបញ្ចប់</span>`;
      startBtn.disabled = false;
    }

    const targetWpm = this.typingState.paper?.passWpm || 35;
    const wpm = this.typingState.wpm;
    const acc = this.typingState.accuracy;

    const speedScore = Math.min(60, (wpm / targetWpm) * 60);
    const accScore = (acc / 100) * 40;
    let finalScore = Math.round(speedScore + accScore);
    if (finalScore > 100) finalScore = 100;
    if (finalScore < 0) finalScore = 0;

    const grade = this.calculateGrade(finalScore);
    const status = finalScore >= 50 ? "Pass" : "Fail";

    this.typingState.finalScore = finalScore;
    this.typingState.finalGrade = grade;
    this.typingState.finalStatus = status;

    const studentSelect = document.getElementById("typingStudentSelect");
    const studentId = this.activeArenaStudentId || studentSelect?.value;
    const selectedOption = studentSelect ? studentSelect.options[studentSelect.selectedIndex] : null;
    const studentName = selectedOption ? selectedOption.text : studentId;

    // 1. AUTOMATIC SCORE INGESTION (បញ្ចូលពិន្ទុទៅតាមភាពជាក់ស្តែងដែលសិស្សធ្វើបានចូលទៅក្នងប្រព័ន្ធខ្លួនឯងតែម្តង)
    const notes = `ប្រឡងផ្ទាល់តាមប្រព័ន្ធ (Typing): ${wpm} WPM, ភាពត្រឹមត្រូវ ${acc}%, កំហុស ${this.typingState.errors}, ${this.typingState.paper?.id || ''}`;
    await this.autoSaveExamResult(studentId, "Typing", finalScore, grade, status, notes);

    // 2. Display Result Card
    const typingContainer = document.getElementById("arenaTypingContainer");
    const resultBox = document.getElementById("arenaResultContainer");
    if (typingContainer) typingContainer.style.display = "none";
    if (resultBox) {
      resultBox.style.display = "block";
      resultBox.scrollIntoView({ behavior: "smooth" });
    }

    const resTitle = document.getElementById("arenaResultHeaderTitle");
    const resInfo = document.getElementById("arenaResultStudentInfo");
    const resScore = document.getElementById("arenaResultScore");
    const resGrade = document.getElementById("arenaResultGrade");
    const resStatus = document.getElementById("arenaResultStatus");
    const resExtraLbl = document.getElementById("arenaResultExtraLbl");
    const resExtraVal = document.getElementById("arenaResultExtraVal");
    const bannerText = document.getElementById("autoSaveBannerText");
    const reviewMount = document.getElementById("arenaAnswerReviewMount");

    if (resTitle) resTitle.textContent = "🎉 លទ្ធផលការប្រឡងវាយអត្ថបទកុំព្យូទ័រ!";
    if (resInfo) resInfo.textContent = `បេក្ខជន៖ ${studentName}`;
    if (resScore) resScore.textContent = `${finalScore} / 100`;
    if (resGrade) resGrade.innerHTML = grade ? `<span class="badge badge-grade-letter grade-${grade}">${grade}</span>` : "—";
    if (resStatus) {
      resStatus.innerHTML = status === "Pass" 
        ? `<span style="color: #059669;"><i class="fa-solid fa-circle-check"></i> ជាប់ (Pass)</span>`
        : `<span style="color: #dc2626;"><i class="fa-solid fa-circle-xmark"></i> ធ្លាក់ (Fail)</span>`;
    }
    if (resExtraLbl) resExtraLbl.textContent = "ល្បឿន & ភាពសុក្រឹត";
    if (resExtraVal) resExtraVal.textContent = `${wpm} WPM • ${acc}% • ${this.typingState.errors} Errors`;

    if (bannerText) {
      bannerText.innerHTML = `✅ ប្រព័ន្ធបានបញ្ចូលពិន្ទុជាក់ស្តែង <strong>${finalScore}/100</strong> និទ្ទេស <strong>[${grade}]</strong> ចូលទៅក្នុងប្រព័ន្ធ និង Firebase Database ដោយស្វ័យប្រវត្តរួចរាល់!`;
    }
    if (reviewMount) reviewMount.style.display = "none";
  },

  async autoSaveExamResult(studentId, courseKey, score, grade, status, notes) {
    if (!studentId) {
      const sel = document.getElementById("typingStudentSelect");
      studentId = sel ? sel.value : null;
    }
    if (!studentId) return false;

    const examData = {
      score: score,
      grade: grade,
      status: status,
      date: new Date().toISOString().split("T")[0],
      autoSaved: true,
      notes: notes || `ប្រឡងផ្ទាល់តាមប្រព័ន្ធ (${courseKey}): ទទួលបានពិន្ទុជាក់ស្តែង ${score}/100 និទ្ទេស [${grade}]`
    };

    try {
      await StudentAPI.saveStudentExam(studentId, courseKey, examData);

      const students = App.state.students || [];
      const student = students.find(s => s.ID === studentId);

      // Auto promote to next course if passed
      if (status === "Pass") {
        try {
          await StudentAPI.promoteStudentCourse(studentId);
        } catch (e) {
          console.warn("Auto promote course note:", e);
        }

        // Notify telegram
        if (typeof TelegramService !== "undefined" && student) {
          const courseTitles = {
            Typing: "វគ្គទី ១: ជំនាញវាយអត្ថបទ (Typing)",
            Word: "វគ្គទី ២: ការរៀបចំឯកសាររដ្ឋបាល (Microsoft Word)",
            Excel: "វគ្គទី ៣: តារាង និងរូបមន្តគណនា (Microsoft Excel)",
            PowerPoint: "វគ្គទី ៤: ការរចនាស្លាយ & បទបង្ហាញ (Microsoft PowerPoint)"
          };
          TelegramService.notifyExamPassed(student, courseTitles[courseKey] || courseKey, score, grade);
        }

        App.triggerConfetti();
      }

      // Update UI tables and KPIs live
      this.updateKpiStats();
      this.renderTable();

      if (typeof StudentPortalView !== "undefined" && StudentPortalView.currentStudent?.ID === studentId) {
        StudentPortalView.init(studentId);
      }
      if (typeof DashboardView !== "undefined" && App.currentView === "dashboard") {
        DashboardView.render();
      }

      App.showToast(`✅ ប្រព័ន្ធបានបញ្ចូលពិន្ទុជាក់ស្តែង ${score}/100 និទ្ទេស [${grade}] ចូលប្រព័ន្ធ និង Firebase ដោយស្វ័យប្រវត្តរួចរាល់!`, "success");
      return true;
    } catch (err) {
      console.error("Auto save exam result error:", err);
      App.showToast("កំហុសក្នុងការបញ្ចូលពិន្ទុស្វ័យប្រវត្តិ: " + err.message, "error");
      return false;
    }
  },

  async saveTypingScoreToStudent() {
    const studentSelect = document.getElementById("typingStudentSelect");
    const studentId = this.activeArenaStudentId || studentSelect?.value;
    if (!studentId) {
      App.showToast("សូមជ្រើសរើសសិស្សដើម្បីកត់ត្រាពិន្ទុ!", "warning");
      return;
    }

    const notes = `ប្រឡងផ្ទាល់: ${this.typingState.wpm} WPM, ភាពត្រឹមត្រូវ ${this.typingState.accuracy}%, ${this.typingState.paper?.id || ''}`;
    await this.autoSaveExamResult(studentId, "Typing", this.typingState.finalScore, this.typingState.finalGrade, this.typingState.finalStatus, notes);
    ModalsComponent.close("liveTypingModal");
  },

  retakeCurrentExam() {
    if (this.activeArenaCourse === "Typing") {
      const typingContainer = document.getElementById("arenaTypingContainer");
      const resultBox = document.getElementById("arenaResultContainer");
      if (typingContainer) typingContainer.style.display = "block";
      if (resultBox) resultBox.style.display = "none";
      this.resetTypingTest();
    } else {
      const practicalContainer = document.getElementById("arenaPracticalContainer");
      const resultBox = document.getElementById("arenaResultContainer");
      if (practicalContainer) practicalContainer.style.display = "block";
      if (resultBox) resultBox.style.display = "none";
      this.setupPracticalCourseExam(this.activeArenaCourse);
    }
  },

  resetTypingTest() {
    clearInterval(this.typingState.timerInterval);
    this.typingState.isRunning = false;

    const durationSelect = document.getElementById("typingDurationSelect");
    const secs = parseInt(durationSelect?.value, 10) || 180;
    this.typingState.timeLeft = secs;
    this.typingState.totalTime = secs;
    this.typingState.wpm = 0;
    this.typingState.accuracy = 100;
    this.typingState.errors = 0;
    this.typingState.typedLength = 0;

    const inputArea = document.getElementById("typingInputField");
    if (inputArea) {
      inputArea.value = "";
      inputArea.disabled = true;
    }

    const startBtn = document.getElementById("startTypingBtn");
    if (startBtn) {
      startBtn.innerHTML = `<i class="fa-solid fa-play"></i> <span>ចាប់ផ្តើម</span>`;
      startBtn.disabled = false;
    }

    const resultBox = document.getElementById("arenaResultContainer");
    if (resultBox) resultBox.style.display = "none";

    const elWpm = document.getElementById("typingWpmVal");
    const elAcc = document.getElementById("typingAccuracyVal");
    const elChars = document.getElementById("typingCharsVal");
    const elErr = document.getElementById("typingErrorsVal");

    if (elWpm) elWpm.textContent = "0";
    if (elAcc) elAcc.textContent = "100%";
    if (elChars) elChars.textContent = "0";
    if (elErr) elErr.textContent = "0";

    this.updateTimerDisplay();

    const charEls = document.querySelectorAll("#typingTargetDisplay .tchar");
    charEls.forEach((el, idx) => {
      el.classList.remove("typing-char-correct", "typing-char-error", "typing-char-current");
      if (idx === 0) el.classList.add("typing-char-current");
    });
  },

  stopTypingTest() {
    if (this.typingState.timerInterval) {
      clearInterval(this.typingState.timerInterval);
      this.typingState.timerInterval = null;
    }
    this.typingState.isRunning = false;
  },

  stopExamSession() {
    this.stopTypingTest();
    this.stopPracticalTimer();
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    ModalsComponent.close("liveTypingModal");
  },

  toggleBrowserFullscreen() {
    const btn = document.getElementById("btnArenaFullscreenToggle");
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        if (btn) btn.innerHTML = `<i class="fa-solid fa-compress"></i> <span>កាត់បន្ថយ</span>`;
      }).catch(err => console.warn("Fullscreen request error:", err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          if (btn) btn.innerHTML = `<i class="fa-solid fa-expand"></i> <span>ពេញអេក្រង់</span>`;
        }).catch(err => console.warn("Fullscreen exit error:", err));
      }
    }
  }
};

