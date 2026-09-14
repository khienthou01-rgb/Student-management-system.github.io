/**
 * View: Official Digital Certificate of Completion Management (គ្រប់គ្រង & ចេញវិញ្ញាបនបត្របញ្ចប់ការសិក្សាឌីជីថល)
 */
const CertificatesView = {
  filters: {
    status: "",
    course: "",
    search: ""
  },

  render() {
    return `
      <section id="view-certificates" class="page-view">
        <!-- Top Action & Title Header -->
        <div class="card" style="margin-bottom: 20px; padding: 20px 24px; border-left: 4px solid #f59e0b; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div>
            <h2 style="font-size: 1.35rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 10px; margin: 0 0 6px 0;">
              <i class="fa-solid fa-graduation-cap" style="color: #f59e0b;"></i>
              <span>វិញ្ញាបនបត្របញ្ចប់ការសិក្សាឌីជីថល (Digital Certificates)</span>
            </h2>
            <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted);">
              គ្រប់គ្រងការចេញវិញ្ញាបនបត្រផ្លូវការមាន Verification QR Code និងបោះពុម្ព A4 Landscape សម្រាប់សិស្សបញ្ចប់វគ្គ
            </p>
          </div>

          <!-- Top Actions -->
          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <button type="button" id="openVerifyCertModalBtn" class="btn-secondary" style="height: 38px; padding: 0 16px; font-size: 0.88rem;">
              <i class="fa-solid fa-qrcode text-indigo-500"></i>
              <span>ផ្ទៀងផ្ទាត់វិញ្ញាបនបត្រ (Verify)</span>
            </button>
            <button type="button" id="exportCertificatesCsvBtn" class="btn-secondary" style="height: 38px; padding: 0 14px; font-size: 0.85rem;" title="Export CSV">
              <i class="fa-solid fa-file-excel text-emerald-500"></i>
              <span>Export CSV</span>
            </button>
            <button type="button" id="printCertTableBtn" class="btn-secondary" style="height: 38px; padding: 0 14px; font-size: 0.85rem;" title="បោះពុម្ពតារាង">
              <i class="fa-solid fa-print"></i>
              <span>Print Table</span>
            </button>
          </div>
        </div>

        <!-- KPI Metrics Row -->
        <div class="kpi-grid">
          <!-- Total Issued -->
          <div class="kpi-card" style="--card-accent: #f59e0b; --icon-bg: rgba(245, 158, 11, 0.12); --icon-color: #f59e0b;">
            <div class="kpi-info">
              <h3>វិញ្ញាបនបត្របានចេញ (Issued)</h3>
              <div id="certKpiIssuedCount" class="kpi-number">0</div>
              <div class="kpi-sub">សិស្សទទួលបានវិញ្ញាបនបត្រផ្លូវការ</div>
            </div>
            <div class="kpi-icon-box">
              <i class="fa-solid fa-certificate"></i>
            </div>
          </div>

          <!-- Eligible Pending Issuance -->
          <div class="kpi-card" style="--card-accent: #10b981; --icon-bg: rgba(16, 185, 129, 0.12); --icon-color: #10b981;">
            <div class="kpi-info">
              <h3>គ្រប់លក្ខខណ្ឌ (Eligible)</h3>
              <div id="certKpiEligibleCount" class="kpi-number" style="color: #10b981;">0</div>
              <div class="kpi-sub">បានប្រឡងជាប់គ្រប់វគ្គ & ត្រៀមចេញ</div>
            </div>
            <div class="kpi-icon-box">
              <i class="fa-solid fa-user-graduate"></i>
            </div>
          </div>

          <!-- Distinction Grade A -->
          <div class="kpi-card" style="--card-accent: #8b5cf6; --icon-bg: rgba(139, 92, 246, 0.12); --icon-color: #8b5cf6;">
            <div class="kpi-info">
              <h3>និទ្ទេស A - ល្អប្រសើរ (Distinction)</h3>
              <div id="certKpiGradeACount" class="kpi-number">0</div>
              <div class="kpi-sub">ពិន្ទុមធ្យម ≥ ៨៥%</div>
            </div>
            <div class="kpi-icon-box">
              <i class="fa-solid fa-award"></i>
            </div>
          </div>

          <!-- Total Active Students -->
          <div class="kpi-card" style="--card-accent: #3b82f6; --icon-bg: rgba(59, 130, 246, 0.12); --icon-color: #3b82f6;">
            <div class="kpi-info">
              <h3>សិស្សកំពុងរៀន (In Progress)</h3>
              <div id="certKpiInProgressCount" class="kpi-number">0</div>
              <div class="kpi-sub">កំពុងបន្តការសិក្សា ៤ វគ្គ</div>
            </div>
            <div class="kpi-icon-box">
              <i class="fa-solid fa-laptop-code"></i>
            </div>
          </div>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="filter-bar" style="margin-bottom: 16px;">
          <!-- Filter Status -->
          <select id="certFilterStatus" class="filter-select">
            <option value="">-- គ្រប់ស្ថានភាពវិញ្ញាបនបត្រ --</option>
            <option value="issued">បានចេញរួច (Issued)</option>
            <option value="eligible">គ្រប់លក្ខខណ្ឌ (Eligible for Certificate)</option>
            <option value="studying">កំពុងសិក្សា (Studying)</option>
          </select>

          <!-- Filter Course -->
          <select id="certFilterCourse" class="filter-select">
            <option value="">-- គ្រប់វគ្គសិក្សា --</option>
            ${APP_CONFIG.computerCourses.map(c => `<option value="${c.name}">${c.name} (${c.desc})</option>`).join('')}
          </select>

          <!-- Search Input -->
          <div class="search-box" style="flex: 1; min-width: 240px;">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="certSearchInput" placeholder="ស្វែងរកតាមឈ្មោះ, អត្តលេខ, ឬលេខកូដវិញ្ញាបនបត្រ..." />
          </div>

          <!-- Clear Filters -->
          <button type="button" id="certClearFilterBtn" class="btn-secondary" title="ជម្រះតម្រង">
            <i class="fa-solid fa-filter-circle-xmark"></i>
            <span>ជម្រះតម្រង</span>
          </button>
        </div>

        <!-- Certificates Table Card -->
        <div class="card" style="padding: 0; overflow: hidden;">
          <div class="table-responsive">
            <table class="data-table" id="certificatesTable">
              <thead>
                <tr>
                  <th style="width: 70px;">រូបថត</th>
                  <th style="width: 110px;">អត្តលេខ</th>
                  <th>ឈ្មោះសិស្ស</th>
                  <th>ភេទ</th>
                  <th>វគ្គសិក្សាបច្ចុប្បន្ន</th>
                  <th class="text-center" style="width: 130px;">វឌ្ឍនភាព ៤ វគ្គ</th>
                  <th class="text-center" style="width: 100px;">ពិន្ទុមធ្យម</th>
                  <th class="text-center" style="width: 110px;">និទ្ទេស</th>
                  <th class="text-center" style="width: 140px;">ស្ថានភាពវិញ្ញាបនបត្រ</th>
                  <th class="text-center" style="width: 130px;">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody id="certificatesTableBody">
                <!-- Filled dynamically by renderTable() -->
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  },

  initEvents() {
    // Status filter
    const statusSel = document.getElementById("certFilterStatus");
    if (statusSel) {
      statusSel.addEventListener("change", (e) => {
        this.filters.status = e.target.value;
        this.renderTable();
      });
    }

    // Course filter
    const courseSel = document.getElementById("certFilterCourse");
    if (courseSel) {
      courseSel.addEventListener("change", (e) => {
        this.filters.course = e.target.value;
        this.renderTable();
      });
    }

    // Search input
    const searchInput = document.getElementById("certSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.filters.search = e.target.value.toLowerCase().trim();
        this.renderTable();
      });
    }

    // Clear filter
    const clearBtn = document.getElementById("certClearFilterBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.filters = { status: "", course: "", search: "" };
        if (statusSel) statusSel.value = "";
        if (courseSel) courseSel.value = "";
        if (searchInput) searchInput.value = "";
        this.renderTable();
        App.showToast("បានជម្រះតម្រងស្វែងរក", "info");
      });
    }

    // Export CSV
    const exportBtn = document.getElementById("exportCertificatesCsvBtn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => this.exportToCsv());
    }

    // Print table
    const printBtn = document.getElementById("printCertTableBtn");
    if (printBtn) {
      printBtn.addEventListener("click", () => window.print());
    }

    // Verify Certificate Modal Button
    const verifyBtn = document.getElementById("openVerifyCertModalBtn");
    if (verifyBtn) {
      verifyBtn.addEventListener("click", () => this.openVerifyModal());
    }

    // Initial table render
    this.renderTable();
  },

  renderTable() {
    const tbody = document.getElementById("certificatesTableBody");
    if (!tbody) return;

    const students = App.state.students || [];
    const allCerts = StudentAPI.getAllCertificates();
    const courseKeys = ["Typing", "Word", "Excel", "PowerPoint"];

    let issuedCount = 0;
    let eligibleCount = 0;
    let gradeACount = 0;
    let inProgressCount = 0;

    // Filter students
    const filtered = students.filter(s => {
      const cert = allCerts[s.ID];
      const exams = StudentAPI.getStudentExams(s.ID);
      const passedCount = courseKeys.filter(k => exams[k] && exams[k].status === "Pass").length;
      const isEligible = passedCount === 4 || s.Status === "Graduated";
      const isIssued = !!cert;

      let studentStatusCategory = "studying";
      if (isIssued) studentStatusCategory = "issued";
      else if (isEligible) studentStatusCategory = "eligible";

      if (this.filters.status && studentStatusCategory !== this.filters.status) return false;
      if (this.filters.course && !(s.Course || "").includes(this.filters.course)) return false;
      if (this.filters.search) {
        const q = this.filters.search;
        const matchNameKh = s.NameKh && s.NameKh.toLowerCase().includes(q);
        const matchNameEn = s.NameEn && s.NameEn.toLowerCase().includes(q);
        const matchId = s.ID && s.ID.toLowerCase().includes(q);
        const matchCert = cert && cert.certId && cert.certId.toLowerCase().includes(q);
        if (!matchNameKh && !matchNameEn && !matchId && !matchCert) return false;
      }
      return true;
    });

    // Count KPIs across entire dataset
    students.forEach(s => {
      const cert = allCerts[s.ID];
      const exams = StudentAPI.getStudentExams(s.ID);
      const passedCount = courseKeys.filter(k => exams[k] && exams[k].status === "Pass").length;
      const isEligible = passedCount === 4 || s.Status === "Graduated";

      if (cert) {
        issuedCount++;
        if (cert.gpa === "A" || cert.overallScore >= 85) gradeACount++;
      } else if (isEligible) {
        eligibleCount++;
      } else {
        inProgressCount++;
      }
    });

    // Update KPI elements
    const elIssued = document.getElementById("certKpiIssuedCount");
    const elEligible = document.getElementById("certKpiEligibleCount");
    const elGradeA = document.getElementById("certKpiGradeACount");
    const elInProgress = document.getElementById("certKpiInProgressCount");

    if (elIssued) elIssued.textContent = issuedCount;
    if (elEligible) elEligible.textContent = eligibleCount;
    if (elGradeA) elGradeA.textContent = gradeACount;
    if (elInProgress) elInProgress.textContent = inProgressCount;

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="10" class="text-center py-5 text-muted">
            <i class="fa-solid fa-graduation-cap fa-3x mb-3" style="opacity: 0.3;"></i>
            <p>មិនមានទិន្នន័យសិស្ស ឬវិញ្ញាបនបត្រស្របតាមការស្វែងរកនេះឡើយ</p>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(s => {
      const cert = allCerts[s.ID];
      const exams = StudentAPI.getStudentExams(s.ID);
      const passedCount = courseKeys.filter(k => exams[k] && exams[k].status === "Pass").length;
      const isEligible = passedCount === 4 || s.Status === "Graduated";
      const isIssued = !!cert;

      // Calculate Average Score
      const scores = courseKeys.map(k => exams[k]?.score).filter(sc => typeof sc === "number");
      const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : (cert?.overallScore || 0);

      let grade = "—";
      if (avgScore >= 85) grade = "A";
      else if (avgScore >= 75) grade = "B";
      else if (avgScore >= 65) grade = "C";
      else if (avgScore >= 50) grade = "D";

      const defaultAvatar = s.Gender === "ស្រី" ? "assets/images/default-female.svg" : "assets/images/default-male.svg";
      const avatarSrc = s.Avatar || defaultAvatar;

      return `
        <tr>
          <td>
            <img src="${avatarSrc}" alt="${s.NameKh}" class="avatar-sm" style="border-radius: 50%; object-fit: cover; width: 38px; height: 38px;" onerror="this.src='${defaultAvatar}'">
          </td>
          <td class="font-mono font-bold text-xs">${s.ID}</td>
          <td>
            <div class="font-bold text-sm" style="color: var(--text-main);">${s.NameKh}</div>
            <div class="text-xs text-muted">${s.NameEn || '—'}</div>
          </td>
          <td>
            <span class="badge ${s.Gender === 'ស្រី' ? 'badge-female' : 'badge-male'}">${s.Gender || 'ប្រុស'}</span>
          </td>
          <td>
            <span class="badge-course ${App.getCourseBadgeClass(s.Course || 'Typing')}">
              <i class="fa-solid ${App.getCourseIcon(s.Course || 'Typing')}"></i> ${s.Course || 'Typing'}
            </span>
          </td>
          <td class="text-center">
            <div style="font-weight: 700; font-size: 0.85rem; color: ${passedCount === 4 ? '#10b981' : 'var(--primary)'};">
              ${passedCount}/4 វគ្គ
            </div>
            <div class="progress-bar-wrap" style="height: 5px; background: #e2e8f0; border-radius: 4px; overflow: hidden; margin-top: 3px;">
              <div style="width: ${(passedCount / 4) * 100}%; height: 100%; background: ${passedCount === 4 ? '#10b981' : '#6366f1'}; border-radius: 4px;"></div>
            </div>
          </td>
          <td class="text-center font-mono font-bold ${avgScore >= 85 ? 'text-amber-600' : 'text-main'}">
            ${avgScore > 0 ? `${avgScore}%` : '—'}
          </td>
          <td class="text-center">
            ${grade !== '—' ? `<span class="badge-grade grade-${grade}">${grade}</span>` : '<span class="text-muted text-xs">—</span>'}
          </td>
          <td class="text-center">
            ${isIssued ? `
              <span class="status-indicator status-active" style="background: rgba(245, 158, 11, 0.12); color: #d97706; border-color: rgba(245, 158, 11, 0.3);">
                <i class="fa-solid fa-certificate"></i> បានចេញ (${cert.certId || 'CERT'})
              </span>
            ` : (isEligible ? `
              <span class="status-indicator" style="background: rgba(16, 185, 129, 0.12); color: #059669; border: 1px solid rgba(16, 185, 129, 0.4); animation: pulse 2s infinite;">
                <i class="fa-solid fa-circle-check"></i> គ្រប់លក្ខខណ្ឌ (Ready)
              </span>
            ` : `
              <span class="status-indicator status-inactive" style="opacity: 0.7;">
                <i class="fa-solid fa-clock"></i> កំពុងសិក្សា
              </span>
            `)}
          </td>
          <td class="text-center">
            <div class="action-buttons-group">
              ${isIssued ? `
                <button type="button" class="btn-action" style="background: rgba(245, 158, 11, 0.15); color: #b45309;" onclick="CertificatesView.printOfficialCertificate('${s.ID}')" title="បោះពុម្ពវិញ្ញាបនបត្រ A4 Landscape">
                  <i class="fa-solid fa-print"></i>
                </button>
                <button type="button" class="btn-action btn-view" onclick="CertificatesView.previewCertificate('${s.ID}')" title="មើលគំរូ Preview">
                  <i class="fa-solid fa-eye"></i>
                </button>
              ` : (isEligible ? `
                <button type="button" class="btn-primary" style="height: 30px; padding: 0 10px; font-size: 0.78rem; background: #10b981; border: none;" onclick="CertificatesView.issueCertificateForStudent('${s.ID}')" title="ចេញវិញ្ញាបនបត្រភ្លាមៗ">
                  <i class="fa-solid fa-file-signature"></i> ចេញ
                </button>
              ` : `
                <button type="button" class="btn-action" style="opacity: 0.5; cursor: not-allowed;" title="សិស្សត្រូវប្រឡងជាប់ទាំង ៤ វគ្គសិន">
                  <i class="fa-solid fa-lock"></i>
                </button>
              `)}
            </div>
          </td>
        </tr>
      `;
    }).join("");
  },

  async issueCertificateForStudent(studentId) {
    const student = (App.state.students || []).find(s => s.ID === studentId);
    if (!student) return;

    const confirmed = confirm(`តើអ្នកពិតជាចង់ចេញវិញ្ញាបនបត្របញ្ចប់ការសិក្សាផ្លូវការជូនសិស្ស "${student.NameKh}" (${student.ID}) មែនទេ?`);
    if (!confirmed) return;

    try {
      App.showLoader(true);
      const cert = await StudentAPI.issueCertificate(studentId);
      App.showToast(`🎉 បានចេញវិញ្ញាបនបត្រ ${cert.certId} ជូនសិស្ស ${student.NameKh} ដោយជោគជ័យ!`, "success");
      App.triggerConfetti();

      // Trigger Telegram Notification
      if (typeof TelegramService !== "undefined") {
        TelegramService.notifyCertificateIssued(student, cert);
      }

      this.renderTable();
      this.previewCertificate(studentId);
    } catch (err) {
      App.showToast("កំហុសក្នុងការចេញវិញ្ញាបនបត្រ: " + err.message, "error");
    } finally {
      App.showLoader(false);
    }
  },

  previewCertificate(studentId) {
    this.printOfficialCertificate(studentId, false);
  },

  printOfficialCertificate(studentId, autoPrint = true) {
    const student = (App.state.students || []).find(s => s.ID === studentId);
    if (!student) {
      App.showToast("រកមិនឃើញព័ត៌មានសិស្សឡើយ", "warning");
      return;
    }

    let cert = StudentAPI.getStudentCertificate(studentId);
    if (!cert) {
      // Auto generate certificate preview data if eligible
      const exams = StudentAPI.getStudentExams(studentId);
      const scores = [exams.Typing?.score, exams.Word?.score, exams.Excel?.score, exams.PowerPoint?.score].filter(s => typeof s === "number");
      const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 85;
      let gpa = avg >= 85 ? "A" : (avg >= 75 ? "B" : (avg >= 65 ? "C" : "D"));

      cert = {
        certId: "MS-CERT-2026-" + String(studentId).replace(/\D/g, "").padStart(4, "0"),
        studentId: student.ID,
        studentNameKh: student.NameKh,
        studentNameEn: student.NameEn || "Student",
        gender: student.Gender || "ប្រុស",
        courseName: "វគ្គបណ្តុះបណ្តាលកុំព្យូទ័ររដ្ឋបាល & ការិយាល័យ (Administrative Computer Literacy)",
        issueDate: new Date().toISOString().split("T")[0],
        overallScore: avg,
        gpa: gpa,
        director: "លោកគ្រូ ខៀន ធូ"
      };
    }

    const defaultAvatar = student.Gender === "ស្រី" ? "assets/images/default-female.svg" : "assets/images/default-male.svg";
    const avatarSrc = student.Avatar || defaultAvatar;

    const distinctionMap = {
      "A": "និទ្ទេស ល្អប្រសើរ (Distinction / Grade A)",
      "B": "និទ្ទេស ល្អណាស់ (Very Good / Grade B)",
      "C": "និទ្ទេស ល្អ (Good / Grade C)",
      "D": "និទ្ទេស មធ្យម (Fair / Grade D)"
    };
    const distinctionLabel = distinctionMap[cert.gpa] || "និទ្ទេស ល្អ (Good)";

    // Verification URL simulation
    const verifyCode = cert.certId;
    const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`MASTERSCHOOL_CERTIFICATE|${verifyCode}|${student.ID}|${student.NameKh}|GPA:${cert.gpa}|VERIFIED`)}`;

    const printWin = window.open("", "_blank", "width=1100,height=800");
    if (!printWin) {
      App.showToast("សូមបើកអនុញ្ញាត Pop-up ក្នុង Browser ដើម្បីមើល និងបោះពុម្ពវិញ្ញាបនបត្រ!", "warning");
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html lang="km">
      <head>
        <meta charset="UTF-8">
        <title>វិញ្ញាបនបត្របញ្ចប់ការសិក្សា - ${student.NameKh} (${cert.certId})</title>
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Moul&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
        <style>
          @page {
            size: A4 landscape;
            margin: 0;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 20px;
            background: #f1f5f9;
            font-family: 'Kantumruy Pro', sans-serif;
            color: #1e293b;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .cert-container {
            width: 297mm;
            height: 210mm;
            background: #ffffff;
            padding: 16mm 18mm;
            position: relative;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            overflow: hidden;
          }
          /* Ornate Dual Border Frame */
          .cert-outer-border {
            position: absolute;
            top: 8mm;
            left: 8mm;
            right: 8mm;
            bottom: 8mm;
            border: 3px solid #b45309;
            pointer-events: none;
          }
          .cert-inner-border {
            position: absolute;
            top: 10.5mm;
            left: 10.5mm;
            right: 10.5mm;
            bottom: 10.5mm;
            border: 1px solid #d97706;
            pointer-events: none;
          }
          /* Corner Ornaments */
          .corner-ornament {
            position: absolute;
            width: 32px;
            height: 32px;
            color: #b45309;
            font-size: 24px;
            line-height: 1;
          }
          .corner-tl { top: 6mm; left: 6mm; }
          .corner-tr { top: 6mm; right: 6mm; text-align: right; }
          .corner-bl { bottom: 6mm; left: 6mm; }
          .corner-br { bottom: 6mm; right: 6mm; text-align: right; }

          /* Watermark */
          .cert-watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 140px;
            opacity: 0.035;
            color: #b45309;
            pointer-events: none;
            z-index: 0;
            user-select: none;
          }

          /* Header Styling */
          .cert-header {
            text-align: center;
            position: relative;
            z-index: 1;
          }
          .cert-motto-kh {
            font-size: 15px;
            font-weight: 700;
            color: #1e3a8a;
            letter-spacing: 1px;
            margin: 0;
          }
          .cert-motto-sub {
            font-size: 13px;
            color: #b45309;
            margin: 2px 0 10px 0;
          }
          .cert-school-brand {
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 2px;
            color: #475569;
            text-transform: uppercase;
          }
          .cert-main-title {
            font-family: 'Moul', 'Kantumruy Pro', cursive;
            font-size: 28px;
            color: #b45309;
            margin: 8px 0 4px 0;
            text-shadow: 0 1px 2px rgba(180, 83, 9, 0.2);
          }
          .cert-sub-title {
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 14px;
            font-weight: 700;
            color: #1e3a8a;
            letter-spacing: 3px;
            text-transform: uppercase;
          }

          /* Body Content */
          .cert-body {
            text-align: center;
            position: relative;
            z-index: 1;
            padding: 0 30px;
          }
          .cert-certifies-text {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 6px;
          }
          .cert-student-name-kh {
            font-family: 'Moul', 'Kantumruy Pro', cursive;
            font-size: 26px;
            color: #0f172a;
            margin: 4px 0;
          }
          .cert-student-name-en {
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 17px;
            font-weight: 700;
            color: #334155;
            letter-spacing: 1px;
            margin-bottom: 10px;
          }
          .cert-text-desc {
            font-size: 13.5px;
            line-height: 1.8;
            color: #334155;
            max-width: 780px;
            margin: 0 auto 12px auto;
          }
          .cert-course-highlight {
            font-weight: 700;
            color: #b45309;
            font-size: 15px;
          }
          .cert-modules-pill-row {
            display: flex;
            justify-content: center;
            gap: 12px;
            margin: 10px 0;
          }
          .cert-module-pill {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            color: #475569;
          }
          .cert-honors-badge {
            display: inline-block;
            background: linear-gradient(135deg, #fef3c7, #fde68a);
            border: 1px solid #f59e0b;
            color: #92400e;
            padding: 4px 18px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 13px;
            margin-top: 6px;
          }

          /* Footer Columns */
          .cert-footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            position: relative;
            z-index: 1;
            padding: 0 10px;
          }
          .cert-qr-block {
            display: flex;
            align-items: center;
            gap: 12px;
            text-align: left;
          }
          .cert-qr-img {
            width: 72px;
            height: 72px;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 3px;
            background: #ffffff;
          }
          .cert-qr-info {
            font-size: 11px;
            color: #64748b;
            line-height: 1.5;
          }
          .cert-qr-info strong {
            color: #0f172a;
            font-family: monospace;
          }

          /* Gold Seal */
          .cert-seal-wrap {
            text-align: center;
          }
          .cert-seal {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: radial-gradient(circle, #fde68a 0%, #d97706 70%, #b45309 100%);
            box-shadow: 0 4px 14px rgba(180, 83, 9, 0.4);
            border: 2px dashed #ffffff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-weight: 800;
            text-transform: uppercase;
            font-size: 8px;
            letter-spacing: 1px;
            line-height: 1.2;
            text-shadow: 0 1px 2px rgba(0,0,0,0.4);
            margin: 0 auto;
          }
          .cert-seal span { font-size: 18px; margin-bottom: 2px; }

          /* Signatures */
          .cert-sign-block {
            text-align: center;
            width: 200px;
          }
          .cert-sign-date {
            font-size: 11.5px;
            color: #64748b;
            margin-bottom: 30px;
          }
          .cert-sign-name {
            font-weight: 700;
            font-size: 14px;
            color: #0f172a;
            border-top: 1px solid #94a3b8;
            padding-top: 4px;
          }
          .cert-sign-role {
            font-size: 11px;
            color: #64748b;
          }

          /* Action Bar (Screen Only) */
          .screen-actions {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #ffffff;
            padding: 10px 16px;
            border-radius: 30px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.25);
            display: flex;
            gap: 10px;
            z-index: 1000;
          }
          .btn-print {
            background: #b45309;
            color: #ffffff;
            border: none;
            padding: 8px 18px;
            border-radius: 20px;
            font-weight: 700;
            cursor: pointer;
            font-family: 'Kantumruy Pro', sans-serif;
          }
          .btn-close {
            background: #e2e8f0;
            color: #334155;
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            cursor: pointer;
            font-family: 'Kantumruy Pro', sans-serif;
          }

          @media print {
            body { background: transparent; padding: 0; }
            .screen-actions { display: none; }
            .cert-container { box-shadow: none; width: 100%; height: 100%; page-break-after: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="screen-actions">
          <button class="btn-print" onclick="window.print()">🖨️ បោះពុម្ពវិញ្ញាបនបត្រ (Print A4)</button>
          <button class="btn-close" onclick="window.close()">បិទផ្ទាំង</button>
        </div>

        <div class="cert-container">
          <div class="cert-outer-border"></div>
          <div class="cert-inner-border"></div>
          <div class="corner-ornament corner-tl">❖</div>
          <div class="corner-ornament corner-tr">❖</div>
          <div class="corner-ornament corner-bl">❖</div>
          <div class="corner-ornament corner-br">❖</div>
          <div class="cert-watermark">MASTERSCHOOL</div>

          <!-- Header -->
          <div class="cert-header">
            <h3 class="cert-motto-kh">ព្រះរាជាណាចក្រកម្ពុជា</h3>
            <div class="cert-motto-sub">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
            <div class="cert-school-brand">MASTERSCHOOL COMPUTER ACADEMY</div>
            <h1 class="cert-main-title">វិញ្ញាបនបត្របញ្ចប់ការសិក្សា</h1>
            <div class="cert-sub-title">CERTIFICATE OF COMPLETION</div>
          </div>

          <!-- Body Content -->
          <div class="cert-body">
            <div class="cert-certifies-text">វិញ្ញាបនបត្រនេះបញ្ជាក់ទទួលស្គាល់ថា៖ / This is to certify that:</div>
            <div class="cert-student-name-kh">${student.NameKh}</div>
            <div class="cert-student-name-en">${student.NameEn || ''}</div>

            <div class="cert-text-desc">
              បានបញ្ចប់ដោយជោគជ័យនូវវគ្គបណ្តុះបណ្តាលជំនាញកុំព្យូទ័ររដ្ឋបាល & ការិយាល័យ<br>
              <span class="cert-course-highlight">Administrative Computer Literacy & Office Management Program</span><br>
              ស្របតាមកម្មវិធីសិក្សា និងបទដ្ឋានបណ្តុះបណ្តាលរបស់សាលាអន្តរជាតិ MasterSchool
            </div>

            <div class="cert-modules-pill-row">
              <span class="cert-module-pill">⌨️ Typing Master</span>
              <span class="cert-module-pill">📄 MS Word</span>
              <span class="cert-module-pill">📊 MS Excel</span>
              <span class="cert-module-pill">📽️ MS PowerPoint</span>
            </div>

            <div>
              <span class="cert-honors-badge">🏆 ${distinctionLabel} • ពិន្ទុមធ្យម៖ ${cert.overallScore}%</span>
            </div>
          </div>

          <!-- Footer -->
          <div class="cert-footer">
            <!-- Left: QR Code Verification -->
            <div class="cert-qr-block">
              <img src="${qrDataUrl}" alt="Verification QR" class="cert-qr-img">
              <div class="cert-qr-info">
                <div>លេខវិញ្ញាបនបត្រ៖<br><strong>${cert.certId}</strong></div>
                <div>អត្តលេខសិស្ស៖ <strong>${student.ID}</strong></div>
                <div style="color: #059669; font-weight: 700;">✓ ផ្ទៀងផ្ទាត់ផ្លូវការ</div>
              </div>
            </div>

            <!-- Middle: Official Gold Seal -->
            <div class="cert-seal-wrap">
              <div class="cert-seal">
                <span>🎓</span>
                <div>OFFICIAL</div>
                <div>SEAL</div>
                <div style="font-size: 7px;">2026</div>
              </div>
            </div>

            <!-- Right: Signature & Date -->
            <div class="cert-sign-block">
              <div class="cert-sign-date">រាជធានីភ្នំពេញ, ថ្ងៃទី ${new Date(cert.issueDate).getDate()} ខែ ${new Date(cert.issueDate).getMonth() + 1} ឆ្នាំ ${new Date(cert.issueDate).getFullYear()}</div>
              <div class="cert-sign-name">${cert.director || 'លោកគ្រូ ខៀន ធូ'}</div>
              <div class="cert-sign-role">នាយកមជ្ឈមណ្ឌលបណ្តុះបណ្តាល</div>
            </div>
          </div>
        </div>

        ${autoPrint ? `<script>window.onload = () => { setTimeout(() => window.print(), 600); };<\/script>` : ''}
      </body>
      </html>
    `);
    printWin.document.close();
  },

  openVerifyModal() {
    const code = prompt("សូមបញ្ចូលលេខកូដវិញ្ញាបនបត្រ (Certificate ID) ឬ អត្តលេខសិស្ស (Student ID) ដើម្បីផ្ទៀងផ្ទាត់៖\n(ឧទាហរណ៍: TX-1001 ឬ MS-CERT-2026-1001)");
    if (!code) return;

    const trimmed = code.trim().toUpperCase();
    const allCerts = StudentAPI.getAllCertificates();
    const students = App.state.students || [];

    // Search by certId or studentId
    let foundCert = null;
    let foundStudent = null;

    Object.values(allCerts).forEach(c => {
      if (c.certId && c.certId.toUpperCase() === trimmed) {
        foundCert = c;
      }
    });

    if (!foundCert) {
      // Try finding by student ID
      foundCert = allCerts[trimmed];
    }

    if (foundCert) {
      foundStudent = students.find(s => s.ID === foundCert.studentId);
    } else {
      foundStudent = students.find(s => s.ID.toUpperCase() === trimmed);
      if (foundStudent) {
        foundCert = allCerts[foundStudent.ID];
      }
    }

    if (foundCert && foundStudent) {
      alert(`✅ វិញ្ញាបនបត្រត្រឹមត្រូវស្របច្បាប់ (VERIFIED OFFICIAL CERTIFICATE):\n\n` +
            `• លេខកូដវិញ្ញាបនបត្រ៖ ${foundCert.certId}\n` +
            `• អត្តលេខសិស្ស៖ ${foundStudent.ID}\n` +
            `• ឈ្មោះសិស្ស៖ ${foundStudent.NameKh} (${foundStudent.NameEn || ''})\n` +
            `• វគ្គសិក្សា៖ ${foundCert.courseName || 'វគ្គកុំព្យូទ័ររដ្ឋបាល'}\n` +
            `• និទ្ទេស / GPA៖ ${foundCert.gpa} (ពិន្ទុ៖ ${foundCert.overallScore}%)\n` +
            `• កាលបរិច្ឆេទចេញ៖ ${foundCert.issueDate}\n` +
            `• នាយកសាលា៖ ${foundCert.director || 'លោកគ្រូ ខៀន ធូ'}\n\n` +
            `ស្ថានភាព៖ មានតម្លៃជាផ្លូវការក្នុងប្រព័ន្ធ MasterSchool!`);
    } else {
      alert(`⚠️ មិនមានទិន្នន័យវិញ្ញាបនបត្រសម្រាប់លេខកូដ "${code}" នេះឡើយ!\nសូមពិនិត្យអក្ខរាវិរុទ្ធឡើងវិញ។`);
    }
  },

  exportToCsv() {
    const students = App.state.students || [];
    const allCerts = StudentAPI.getAllCertificates();
    const headers = ["ID", "NameKh", "NameEn", "Gender", "Course", "CertId", "GPA", "Score", "IssueDate", "Status"];

    const rows = students.map(s => {
      const cert = allCerts[s.ID];
      return [
        s.ID,
        `"${s.NameKh || ''}"`,
        `"${s.NameEn || ''}"`,
        s.Gender || '',
        `"${s.Course || 'Typing'}"`,
        cert ? cert.certId : 'Not Issued',
        cert ? cert.gpa : '—',
        cert ? `${cert.overallScore}%` : '—',
        cert ? cert.issueDate : '—',
        cert ? 'Issued' : (s.Status === 'Graduated' ? 'Eligible' : 'Studying')
      ].join(",");
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MasterSchool_Certificates_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    App.showToast("បានទាញយកទិន្នន័យវិញ្ញាបនបត្រជា CSV ជោគជ័យ!", "success");
  }
};
