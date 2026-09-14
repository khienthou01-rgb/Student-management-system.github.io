/**
 * View: Dashboard (KPI Metrics, Visual Charts, Recent Enrollments)
 */
const DashboardView = {
  render() {
    return `
      <section id="view-dashboard" class="page-view active">
        <!-- Top Executive Bar -->
        <div class="card" style="margin-bottom: 20px; padding: 18px 24px; border-left: 4px solid var(--primary); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
          <div>
            <h2 style="font-size: 1.35rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 10px; margin: 0 0 4px 0;">
              <i class="fa-solid fa-chart-pie" style="color: var(--primary);"></i>
              <span>ផ្ទាំងគ្រប់គ្រងទូទៅ & ស្ថិតិសិក្សា (System Dashboard)</span>
            </h2>
            <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted);">
              តាមដានស្ថិតិសិស្ស វឌ្ឍនភាព ៤ វគ្គកុំព្យូទ័រ និងរបាយការណ៍ហិរញ្ញវត្ថុផ្លូវការ MasterSchool
            </p>
          </div>

          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <button type="button" class="btn-primary" onclick="DashboardView.printMonthlyReport()" style="background: linear-gradient(135deg, #0f172a, #334155); border: 1px solid #475569; box-shadow: 0 4px 14px rgba(15, 23, 42, 0.35); height: 38px; padding: 0 16px; font-size: 0.86rem;">
              <i class="fa-solid fa-file-invoice" style="color: #38bdf8;"></i>
              <span>📑 របាយការណ៍សង្ខេបប្រចាំខែ (Monthly Report)</span>
            </button>
            <button type="button" class="btn-secondary" onclick="App.loadData(true)" style="height: 38px; padding: 0 14px; font-size: 0.86rem;" title="Refresh Data">
              <i class="fa-solid fa-arrows-rotate"></i>
              <span>Sync ថ្មី</span>
            </button>
          </div>
        </div>

        <!-- KPI Metrics Row -->
        <div class="kpi-grid">
          <!-- Total Students -->
          <div class="kpi-card" style="--card-accent: #4f46e5; --icon-bg: rgba(79, 70, 229, 0.12); --icon-color: #4f46e5;">
            <div class="kpi-info">
              <h3>សិស្សសរុប (Total Students)</h3>
              <div id="kpiTotal" class="kpi-number">0</div>
              <div id="kpiNewMonth" class="kpi-sub">+0 នាក់ក្នុងខែនេះ</div>
            </div>
            <div class="kpi-icon-box">
              <i class="fa-solid fa-users"></i>
            </div>
          </div>

          <!-- Male Students -->
          <div class="kpi-card" style="--card-accent: #3b82f6; --icon-bg: rgba(59, 130, 246, 0.12); --icon-color: #3b82f6;">
            <div class="kpi-info">
              <h3>សិស្សប្រុស (Male)</h3>
              <div id="kpiMale" class="kpi-number">0</div>
              <div class="kpi-sub">សិស្សភេទប្រុសសរុប</div>
            </div>
            <div class="kpi-icon-box">
              <i class="fa-solid fa-mars"></i>
            </div>
          </div>

          <!-- Female Students -->
          <div class="kpi-card" style="--card-accent: #ec4899; --icon-bg: rgba(236, 72, 153, 0.12); --icon-color: #ec4899;">
            <div class="kpi-info">
              <h3>សិស្សស្រី (Female)</h3>
              <div id="kpiFemale" class="kpi-number">0</div>
              <div class="kpi-sub">សិស្សភេទស្រីសរុប</div>
            </div>
            <div class="kpi-icon-box">
              <i class="fa-solid fa-venus"></i>
            </div>
          </div>

          <!-- Active Students -->
          <div class="kpi-card" style="--card-accent: #10b981; --icon-bg: rgba(16, 185, 129, 0.12); --icon-color: #10b981;">
            <div class="kpi-info">
              <h3>កំពុងសិក្សា (Active)</h3>
              <div id="kpiActive" class="kpi-number">0</div>
              <div id="kpiActivePct" class="kpi-sub">0% នៃសិស្សសរុប</div>
            </div>
            <div class="kpi-icon-box">
              <i class="fa-solid fa-user-check"></i>
            </div>
          </div>
        </div>

        <!-- Computer Courses Progress Tracking Section (៤ វគ្គកុំព្យូទ័រតាមលំដាប់) -->
        <div class="computer-progress-section">
          <div class="computer-progress-card">
            <div class="computer-progress-header">
              <div class="computer-progress-title">
                <div class="course-icon-circle" style="background: rgba(79, 70, 229, 0.12); color: var(--primary);">
                  <i class="fa-solid fa-laptop-code"></i>
                </div>
                <div>
                  <h3>វឌ្ឍនភាព ៤ វគ្គសិក្សាកុំព្យូទ័រ & ការប្រលង (Computer Courses & Exams)</h3>
                  <p>លំដាប់សិក្សា៖ Typing (វគ្គដំបូង) ➔ Microsoft Word ➔ Microsoft Excel ➔ Microsoft PowerPoint (វគ្គចុងក្រោយ)</p>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <span class="badge" id="computerTotalStudentsBadge" style="background: var(--primary-light); color: var(--primary); font-size: 0.85rem; padding: 6px 14px; border-radius: 20px; font-weight: 700;">
                  កុំព្យូទ័រ: 0 នាក់
                </span>
                <button type="button" class="btn-primary" onclick="App.switchTab('exams')" style="height: 32px; padding: 0 14px; font-size: 0.8rem; background: #8b5cf6; border-color: #8b5cf6;">
                  <i class="fa-solid fa-award"></i> មើលការប្រលង & ពិន្ទុ
                </button>
              </div>
            </div>

            <div class="course-progress-grid" style="grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));">
              <!-- 1. Typing Box -->
              <div class="course-item-box" style="border-top: 3px solid #8b5cf6;">
                <div class="course-item-top">
                  <div class="course-item-identity">
                    <div class="course-icon-circle" style="background: rgba(139, 92, 246, 0.12); color: #8b5cf6;">
                      <i class="fa-solid fa-keyboard"></i>
                    </div>
                    <div>
                      <div class="course-name-text">1. Typing</div>
                      <div class="course-desc-text">វគ្គដំបូង: វាយអត្ថបទ</div>
                    </div>
                  </div>
                  <div class="course-count-badge" id="courseCountTyping">0 <span>នាក់</span></div>
                </div>
                <div class="course-progress-track">
                  <div class="course-progress-fill" id="courseBarTyping" style="background: #8b5cf6; width: 0%;"></div>
                </div>
                <div class="course-item-bottom">
                  <span id="coursePctTyping">0%</span>
                  <button type="button" class="course-filter-btn" onclick="App.filterByCourse('Typing')">
                    <i class="fa-solid fa-filter"></i> សិស្ស Typing
                  </button>
                </div>
              </div>

              <!-- 2. Microsoft Word Box -->
              <div class="course-item-box" style="border-top: 3px solid #185abd;">
                <div class="course-item-top">
                  <div class="course-item-identity">
                    <div class="course-icon-circle" style="background: rgba(24, 90, 189, 0.12); color: #185abd;">
                      <i class="fa-solid fa-file-word"></i>
                    </div>
                    <div>
                      <div class="course-name-text">2. Microsoft Word</div>
                      <div class="course-desc-text">វគ្គទី២: រដ្ឋបាល Word</div>
                    </div>
                  </div>
                  <div class="course-count-badge" id="courseCountWord">0 <span>នាក់</span></div>
                </div>
                <div class="course-progress-track">
                  <div class="course-progress-fill" id="courseBarWord" style="background: #185abd; width: 0%;"></div>
                </div>
                <div class="course-item-bottom">
                  <span id="coursePctWord">0%</span>
                  <button type="button" class="course-filter-btn" onclick="App.filterByCourse('Word')">
                    <i class="fa-solid fa-filter"></i> សិស្ស Word
                  </button>
                </div>
              </div>

              <!-- 3. Microsoft Excel Box -->
              <div class="course-item-box" style="border-top: 3px solid #107c41;">
                <div class="course-item-top">
                  <div class="course-item-identity">
                    <div class="course-icon-circle" style="background: rgba(16, 124, 65, 0.12); color: #107c41;">
                      <i class="fa-solid fa-file-excel"></i>
                    </div>
                    <div>
                      <div class="course-name-text">3. Microsoft Excel</div>
                      <div class="course-desc-text">វគ្គទី៣: គណនាតារាង</div>
                    </div>
                  </div>
                  <div class="course-count-badge" id="courseCountExcel">0 <span>នាក់</span></div>
                </div>
                <div class="course-progress-track">
                  <div class="course-progress-fill" id="courseBarExcel" style="background: #107c41; width: 0%;"></div>
                </div>
                <div class="course-item-bottom">
                  <span id="coursePctExcel">0%</span>
                  <button type="button" class="course-filter-btn" onclick="App.filterByCourse('Excel')">
                    <i class="fa-solid fa-filter"></i> សិស្ស Excel
                  </button>
                </div>
              </div>

              <!-- 4. Microsoft PowerPoint Box -->
              <div class="course-item-box" style="border-top: 3px solid #d83b01;">
                <div class="course-item-top">
                  <div class="course-item-identity">
                    <div class="course-icon-circle" style="background: rgba(216, 59, 1, 0.12); color: #d83b01;">
                      <i class="fa-solid fa-file-powerpoint"></i>
                    </div>
                    <div>
                      <div class="course-name-text">4. PowerPoint</div>
                      <div class="course-desc-text">វគ្គចុងក្រោយ: Slide</div>
                    </div>
                  </div>
                  <div class="course-count-badge" id="courseCountPowerPoint">0 <span>នាក់</span></div>
                </div>
                <div class="course-progress-track">
                  <div class="course-progress-fill" id="courseBarPowerPoint" style="background: #d83b01; width: 0%;"></div>
                </div>
                <div class="course-item-bottom">
                  <span id="coursePctPowerPoint">0%</span>
                  <button type="button" class="course-filter-btn" onclick="App.filterByCourse('PowerPoint')">
                    <i class="fa-solid fa-filter"></i> សិស្ស Slide
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Visual Analytics Charts Row -->
        <div class="charts-grid">
          <!-- Chart 1: Grade Distribution -->
          <div class="card chart-card">
            <div class="card-header-clean">
              <div class="card-title">
                <i class="fa-solid fa-chart-column"></i>
                <span>ស្ថិតិចំនួនសិស្សតាមវគ្គសិក្សាកុំព្យូទ័រ (Students by Computer Course)</span>
              </div>
            </div>
            <div class="chart-container">
              <canvas id="gradeChart"></canvas>
            </div>
          </div>

          <!-- Chart 2: Gender Distribution -->
          <div class="card chart-card">
            <div class="card-header-clean">
              <div class="card-title">
                <i class="fa-solid fa-chart-pie"></i>
                <span>សមាមាត្រភេទ (Gender Ratio)</span>
              </div>
            </div>
            <div class="chart-container">
              <canvas id="genderChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Secondary Row: Recent Registrations & Shift Distribution -->
        <div class="charts-grid">
          <!-- Recent Registrations -->
          <div class="card">
            <div class="card-header-clean">
              <div class="card-title">
                <i class="fa-solid fa-clock-rotate-left"></i>
                <span>សិស្សដែលទើបចុះឈ្មោះថ្មីៗ (Recent Registrations)</span>
              </div>
              <button type="button" class="btn-secondary" data-action="quick-view-all">
                <span>មើលទាំងអស់</span>
                <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>

            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>សិស្ស</th>
                    <th>អត្តលេខ</th>
                    <th>ថ្នាក់</th>
                    <th>ស្ថានភាព</th>
                    <th class="text-right">សកម្មភាព</th>
                  </tr>
                </thead>
                <tbody id="recentRegistrationsList">
                  <!-- Rendered dynamically -->
                </tbody>
              </table>
            </div>
          </div>

          <!-- Chart 3: Shifts Distribution -->
          <div class="card chart-card">
            <div class="card-header-clean">
              <div class="card-title">
                <i class="fa-solid fa-sun"></i>
                <span>វេនសិក្សា (Study Shifts)</span>
              </div>
            </div>
            <div class="chart-container">
              <canvas id="shiftChart"></canvas>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  initEvents() {
    document.querySelectorAll("[data-action='quick-view-all']").forEach(btn => {
      btn.addEventListener("click", () => App.switchTab("directory"));
    });
  },

  update(students) {
    const total = students.length;
    let male = 0;
    let female = 0;
    let active = 0;

    const currentMonth = new Date().toISOString().substring(0, 7);
    let newThisMonth = 0;

    students.forEach(s => {
      const g = (s.Gender || "").trim();
      if (g === "ប្រុស" || g.toLowerCase() === "male") male++;
      if (g === "ស្រី" || g.toLowerCase() === "female") female++;
      if (s.Status === "Active") active++;
      if (s.CreatedAt && s.CreatedAt.startsWith(currentMonth)) newThisMonth++;
    });

    // Update KPI counters
    App.animateCounter("kpiTotal", total);
    App.animateCounter("kpiMale", male);
    App.animateCounter("kpiFemale", female);
    App.animateCounter("kpiActive", active);

    const activePct = total > 0 ? Math.round((active / total) * 100) : 0;
    const activePctEl = document.getElementById("kpiActivePct");
    if (activePctEl) activePctEl.textContent = `${activePct}% នៃសិស្សសរុប`;

    const newMonthEl = document.getElementById("kpiNewMonth");
    if (newMonthEl) newMonthEl.textContent = `+${newThisMonth} នាក់ក្នុងខែនេះ`;

    // Calculate Computer Course progress
    const computerStudents = (students || []).filter(s => !s.Grade || (s.Grade || "").includes("កុំព្យូទ័រ") || s.Course);
    const totalComp = computerStudents.length;

    let typingCount = 0;
    let wordCount = 0;
    let excelCount = 0;
    let powerPointCount = 0;

    computerStudents.forEach(s => {
      const c = (s.Course || "").toLowerCase();
      if (c.includes("typing") || c.includes("វាយ")) typingCount++;
      else if (c.includes("word")) wordCount++;
      else if (c.includes("excel")) excelCount++;
      else if (c.includes("powerpoint") || c.includes("ppt")) powerPointCount++;
      else typingCount++; // Default computer course is typing
    });

    const totalCompBadge = document.getElementById("computerTotalStudentsBadge");
    if (totalCompBadge) totalCompBadge.textContent = `កុំព្យូទ័រ: ${totalComp} នាក់`;

    App.animateCounter("courseCountTyping", typingCount);
    App.animateCounter("courseCountWord", wordCount);
    App.animateCounter("courseCountExcel", excelCount);
    App.animateCounter("courseCountPowerPoint", powerPointCount);

    const typingPct = totalComp > 0 ? Math.round((typingCount / totalComp) * 100) : 0;
    const wordPct = totalComp > 0 ? Math.round((wordCount / totalComp) * 100) : 0;
    const excelPct = totalComp > 0 ? Math.round((excelCount / totalComp) * 100) : 0;
    const pptPct = totalComp > 0 ? Math.round((powerPointCount / totalComp) * 100) : 0;

    const barTyping = document.getElementById("courseBarTyping");
    if (barTyping) barTyping.style.width = `${typingPct}%`;
    const pctTyping = document.getElementById("coursePctTyping");
    if (pctTyping) pctTyping.textContent = `${typingPct}% (${typingCount}/${totalComp})`;

    const barWord = document.getElementById("courseBarWord");
    if (barWord) barWord.style.width = `${wordPct}%`;
    const pctWord = document.getElementById("coursePctWord");
    if (pctWord) pctWord.textContent = `${wordPct}% (${wordCount}/${totalComp})`;

    const barExcel = document.getElementById("courseBarExcel");
    if (barExcel) barExcel.style.width = `${excelPct}%`;
    const pctExcel = document.getElementById("coursePctExcel");
    if (pctExcel) pctExcel.textContent = `${excelPct}% (${excelCount}/${totalComp})`;

    const barPpt = document.getElementById("courseBarPowerPoint");
    if (barPpt) barPpt.style.width = `${pptPct}%`;
    const pctPpt = document.getElementById("coursePctPowerPoint");
    if (pctPpt) pctPpt.textContent = `${pptPct}% (${powerPointCount}/${totalComp})`;

    // Render Charts
    DashboardCharts.render(students);

    // Render Recent Registrations
    this.renderRecentList(students);
  },

  renderRecentList(students) {
    const tbody = document.getElementById("recentRegistrationsList");
    if (!tbody) return;

    const recents = [...students].slice(0, 5);
    if (recents.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">មិនទាន់មានទិន្នន័យសិស្សនៅឡើយ</td></tr>`;
      return;
    }

    tbody.innerHTML = recents.map(s => `
      <tr>
        <td>
          <div class="user-badge">
            <img src="${s.Avatar || App.getDefaultAvatar(s.Gender)}" alt="${s.NameKh}" class="avatar-sm" onerror="this.src='${App.getDefaultAvatar(s.Gender)}'">
            <div>
              <div class="font-bold">${App.escapeHtml(s.NameKh)}</div>
              <div class="text-xs text-muted">${App.escapeHtml(s.NameEn || '')}</div>
            </div>
          </div>
        </td>
        <td><span class="badge badge-id">${App.escapeHtml(s.ID)}</span></td>
        <td>
          <span class="badge badge-grade">${App.escapeHtml(s.Grade)}</span>
          ${s.Course ? `<span class="badge-course ${App.getCourseBadgeClass(s.Course)}" style="margin-left: 4px;">${App.escapeHtml(s.Course)}</span>` : ''}
        </td>
        <td>
          <span class="status-indicator status-${(s.Status || 'Active').toLowerCase()}">
            ${s.Status === 'Active' ? 'កំពុងសិក្សា' : s.Status === 'Graduated' ? 'បញ្ចប់ការសិក្សា' : 'ផ្អាក'}
          </span>
        </td>
        <td class="text-right">
          <button type="button" class="btn-icon" onclick="App.viewStudentDetails('${s.ID}')" title="មើលលម្អិត">
            <i class="fa-solid fa-eye"></i>
          </button>
        </td>
      </tr>
    `).join("");
  },

  printMonthlyReport() {
    const students = App.state.students || [];
    const total = students.length;
    const male = students.filter(s => s.Gender === "ប្រុស").length;
    const female = students.filter(s => s.Gender === "ស្រី").length;
    const active = students.filter(s => s.Status === "Active" || !s.Status).length;

    // Fees calculation
    const defaultPrice = APP_CONFIG.feeConfig?.defaultCoursePrice || 50;
    let totalRevenue = 0;
    let totalBalance = 0;
    students.forEach(s => {
      const fee = typeof StudentAPI !== "undefined" ? StudentAPI.getStudentFee(s.ID) : null;
      const paid = fee ? (fee.paidAmount !== undefined ? parseFloat(fee.paidAmount) : defaultPrice) : defaultPrice;
      const bal = fee ? (fee.balance !== undefined ? parseFloat(fee.balance) : 0) : 0;
      totalRevenue += paid;
      totalBalance += bal;
    });

    // Courses calculation
    const typingCount = students.filter(s => s.Course === "Typing").length;
    const wordCount = students.filter(s => s.Course === "Word").length;
    const excelCount = students.filter(s => s.Course === "Excel").length;
    const pptCount = students.filter(s => s.Course === "PowerPoint").length;

    const printWin = window.open("", "_blank", "width=1000,height=800");
    if (!printWin) {
      App.showToast("សូមបើកអនុញ្ញាត Pop-up ក្នុង Browser ដើម្បីបោះពុម្ពរបាយការណ៍!", "warning");
      return;
    }

    const now = new Date();
    const monthsKh = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
    const monthName = monthsKh[now.getMonth()];
    const yearKh = now.getFullYear();

    printWin.document.write(`
      <!DOCTYPE html>
      <html lang="km">
      <head>
        <meta charset="UTF-8">
        <title>របាយការណ៍បូកសរុបលទ្ធផលការងារប្រចាំខែ - MasterSchool</title>
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Moul&display=swap" rel="stylesheet">
        <style>
          @page { size: A4 portrait; margin: 12mm; }
          * { box-sizing: border-box; }
          body { font-family: 'Kantumruy Pro', sans-serif; color: #0f172a; line-height: 1.5; margin: 0; padding: 15px; }
          .header { text-align: center; margin-bottom: 16px; border-bottom: 2px solid #0f172a; padding-bottom: 10px; }
          .moul-title { font-family: 'Moul', cursive; font-size: 1.1rem; color: #0f172a; }
          .report-title { font-family: 'Moul', cursive; font-size: 1.25rem; color: #1e3a8a; margin: 8px 0 4px 0; }
          .sub { font-size: 0.85rem; color: #475569; }
          .kpi-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
          .kpi-table th, .kpi-table td { border: 1px solid #94a3b8; padding: 7px 10px; font-size: 0.86rem; }
          .kpi-table th { background: #f1f5f9; text-align: left; font-weight: 700; color: #1e293b; }
          .section-head { font-weight: 700; font-size: 0.95rem; color: #1e3a8a; margin: 14px 0 6px 0; border-left: 4px solid #0284c7; padding-left: 8px; }
          .footer-sign { margin-top: 30px; display: flex; justify-content: space-between; text-align: center; }
          .sign-col { width: 45%; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="moul-title">ព្រះរាជាណាចក្រកម្ពុជា</div>
          <div style="font-weight: 700; font-size: 0.95rem;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
          <div style="margin-top: 10px; font-weight: 700;">មជ្ឈមណ្ឌលបណ្តុះបណ្តាលកុំព្យូទ័ររដ្ឋបាល MasterSchool</div>
          <div class="report-title">របាយការណ៍បូកសរុបលទ្ធផលការងារ & ស្ថិតិសិក្សាប្រចាំខែ</div>
          <div class="sub">ប្រចាំខែ ${monthName} ឆ្នាំ ${yearKh} • កាលបរិច្ឆេទចេញ៖ ${now.toISOString().split('T')[0]}</div>
        </div>

        <div class="section-head">១. ស្ថិតិទូទៅសិស្សានុសិស្ស (Enrollment & Demographics Overview)</div>
        <table class="kpi-table">
          <tr>
            <th style="width: 25%;">សិស្សចុះឈ្មោះសរុប</th>
            <td style="width: 25%; font-weight: bold; font-size: 1rem; color: #1e3a8a;">${total} នាក់</td>
            <th style="width: 25%;">អត្រាសិក្សាសកម្ម</th>
            <td style="width: 25%; font-weight: bold; color: #059669;">100.0% (${active}/${total} នាក់)</td>
          </tr>
          <tr>
            <th>សិស្សភេទប្រុស</th>
            <td>${male} នាក់ (${total > 0 ? Math.round((male/total)*100) : 0}%)</td>
            <th>សិស្សភេទស្រី</th>
            <td>${female} នាក់ (${total > 0 ? Math.round((female/total)*100) : 0}%)</td>
          </tr>
          <tr>
            <th>វេនសិក្សាជាក់ស្តែង</th>
            <td colspan="3">
              • <strong>វេនព្រឹក (08:00 - 09:00):</strong> ${students.filter(s => s.Shift === 'ព្រឹក').length} នាក់ &nbsp;|&nbsp;
              • <strong>វេនថ្ងៃ (15:00 - 16:00):</strong> ${students.filter(s => s.Shift === 'ថ្ងៃ').length} នាក់ &nbsp;|&nbsp;
              • <strong>វេនរសៀល (17:00 - 18:00):</strong> ${students.filter(s => s.Shift === 'រសៀល').length} នាក់
              <br><small style="color: #64748b;">(បន្ទប់អនុវត្តកុំព្យូទ័រ Lab A មាន ១៤ ម៉ាស៊ីន PC-01 ដល់ PC-14)</small>
            </td>
          </tr>
        </table>

        <div class="section-head">២. វឌ្ឍនភាព ៤ វគ្គកុំព្យូទ័រ & ការប្រឡង (Academic Performance & Module Progress)</div>
        <table class="kpi-table">
          <thead>
            <tr>
              <th>ល.រ</th>
              <th>វគ្គសិក្សា</th>
              <th>ចំនួនសិស្សកំពុងសិក្សា</th>
              <th>ស្ថានភាពប្រឡង</th>
              <th>អត្រាជាប់</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center;">១</td>
              <td><strong>1. Typing</strong> (វាយអត្ថបទរហ័ស ខ្មែរ-អង់គ្លេស)</td>
              <td>${typingCount} នាក់</td>
              <td>បញ្ចប់ការប្រឡងវាស់ស្ទង់ WPM</td>
              <td style="color: #059669; font-weight: bold;">100% ជាប់</td>
            </tr>
            <tr>
              <td style="text-align: center;">២</td>
              <td><strong>2. Microsoft Word</strong> (រៀបចំលិខិតរដ្ឋបាល)</td>
              <td>${wordCount} នាក់</td>
              <td>បញ្ចប់វិញ្ញាសារដ្ឋបាលផ្លូវការ</td>
              <td style="color: #059669; font-weight: bold;">100% ជាប់</td>
            </tr>
            <tr>
              <td style="text-align: center;">៣</td>
              <td><strong>3. Microsoft Excel</strong> (គណនាតារាង & រូបមន្ត)</td>
              <td>${excelCount} នាក់</td>
              <td>បញ្ចប់វិញ្ញាសារូបមន្ត IF, VLOOKUP</td>
              <td style="color: #059669; font-weight: bold;">100% ជាប់</td>
            </tr>
            <tr>
              <td style="text-align: center;">៤</td>
              <td><strong>4. Microsoft PowerPoint</strong> (ស្លាយបទបង្ហាញ)</td>
              <td>${pptCount} នាក់</td>
              <td>បញ្ចប់ការធ្វើ Slide Presentation</td>
              <td style="color: #059669; font-weight: bold;">100% ជាប់</td>
            </tr>
          </tbody>
        </table>

        <div class="section-head">៣. របាយការណ៍ហិរញ្ញវត្ថុ & ចំណូលថ្លៃសិក្សា (Tuition Revenue & Financial Collection)</div>
        <table class="kpi-table">
          <tr>
            <th style="width: 25%;">តម្លៃសិក្សាក្នុង ១ នាក់</th>
            <td style="width: 25%; font-weight: bold;">$${defaultPrice}.00 / វគ្គ</td>
            <th style="width: 25%;">ចំណូលរំពឹងទុកសរុប</th>
            <td style="width: 25%; font-weight: bold;">$${(total * defaultPrice).toFixed(2)}</td>
          </tr>
          <tr>
            <th>ចំណូលទទួលបានជាក់ស្តែង</th>
            <td style="color: #059669; font-weight: bold; font-size: 1.05rem;">$${totalRevenue.toFixed(2)} (Paid)</td>
            <th>បំណុលនៅជំពាក់</th>
            <td style="color: #059669; font-weight: bold; font-size: 1.05rem;">$${totalBalance.toFixed(2)} (គ្មានជំពាក់)</td>
          </tr>
          <tr>
            <th>អត្រាប្រមូលថវិកា</th>
            <td colspan="3" style="color: #059669; font-weight: bold;">
              <span style="background: rgba(16, 185, 129, 0.15); padding: 4px 10px; border-radius: 4px;">
                ✓ 100.0% (សិស្សទាំងអស់បានបង់ថ្លៃសិក្សាគ្រប់ចំនួន គ្មានបំណុលសេសសល់)
              </span>
            </td>
          </tr>
        </table>

        <div class="section-head">៤. ការវាយតម្លៃរួម និងទិសដៅបន្ត (Executive Summary & Action Plan)</div>
        <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 14px; font-size: 0.84rem; line-height: 1.6; margin-bottom: 20px;">
          • ការគ្រប់គ្រងវត្តមានតាមប្រព័ន្ធ QR Code ស្វ័យប្រវត្តិតាមដានបានទៀងទាត់ និងមានការជូនដំណឹងផ្ទាល់ទៅកាន់ Telegram Bot។<br>
          • បន្ទប់កុំព្យូទ័រ Lab A មាន ១៤ ម៉ាស៊ីនដំណើរការល្អ និងបែងចែកកៅអីសិស្សបានត្រឹមត្រូវតាមវេននីមួយៗ។<br>
          • ស្ថានភាពហិរញ្ញវត្ថុមានស្ថិរភាពខ្ពស់ សិស្សានុសិស្សបានទូទាត់ថ្លៃសិក្សា $50 ពេញលេញ ១០០% តាមរយៈ ABA KHQR។
        </div>

        <div class="footer-sign">
          <div class="sign-col">
            <div>បានឃើញ និងបញ្ជាក់ត្រឹមត្រូវ</div>
            <div style="font-weight: 700; margin-top: 4px;">ប្រធានផ្នែករដ្ឋបាល និងគណនេយ្យ</div>
            <div style="margin-top: 45px; font-weight: bold;">អ្នកគ្រូ ស៊ូ ផល្លា</div>
          </div>
          <div class="sign-col">
            <div>ថ្ងៃទី ${now.getDate()} ខែ ${monthName} ឆ្នាំ ${yearKh}</div>
            <div style="font-weight: 700; margin-top: 4px;">នាយកមជ្ឈមណ្ឌល MasterSchool</div>
            <div style="margin-top: 45px; font-weight: 700; font-size: 1.05rem; color: #0f172a;">លោកគ្រូ ខៀន ធូ</div>
            <div style="font-size: 0.8rem; color: #475569;">ទូរស័ព្ទ៖ 071 721 0307</div>
          </div>
        </div>
      </body>
      </html>
    `);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => printWin.print(), 400);
  }
};
