/**
 * View: 5-Day Weekly Roll-Call & Monthly Attendance Tracking (វត្តមានប្រចាំសប្តាហ៍ ៥ ថ្ងៃ និងតាមផ្នែកខែៗ)
 */
const AttendanceView = {
  // Calendar & Navigation State
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth(), // 0 to 11
  currentWeekIndex: 0,
  
  // Data State
  records: {}, // Cache of dateStr -> { studentId -> status }
  hasUnsavedChanges: false,
  
  // Filters
  filters: {
    course: "",
    shift: "",
    search: ""
  },

  // Khmer Constants
  khmerMonths: [
    "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
    "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"
  ],
  khmerDays: ["ចន្ទ", "អង្គារ", "ពុធ", "ព្រហស្បតិ៍", "សុក្រ"],

  formatLocalDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  },

  // Calculate 5-Day School Weeks (Mon - Fri) for Selected Month
  getWeeksForMonth(year, month) {
    const weeks = [];
    const firstDayOfMonth = new Date(year, month, 1, 12, 0, 0);
    const lastDayOfMonth = new Date(year, month + 1, 0, 12, 0, 0);

    // Find the Monday on or before the 1st day of the month
    let curr = new Date(firstDayOfMonth);
    const dayOfWeek = curr.getDay(); // 0: Sun, 1: Mon, ... 6: Sat
    const mondayOffset = dayOfWeek === 0 ? -6 : (1 - dayOfWeek);
    curr.setDate(curr.getDate() + mondayOffset);

    const now = new Date();
    const todayStr = this.formatLocalDate(now);

    while (true) {
      const monday = new Date(curr);
      const friday = new Date(curr);
      friday.setDate(friday.getDate() + 4);

      // Stop if Monday is past the end of the month
      if (monday > lastDayOfMonth) break;

      const weekDays = [];
      let containsToday = false;

      for (let i = 0; i < 5; i++) {
        const d = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate() + i, 12, 0, 0);
        const dateStr = this.formatLocalDate(d);
        const dayNum = d.getDate();
        const monthNum = d.getMonth();
        const isToday = dateStr === todayStr;
        if (isToday) containsToday = true;

        weekDays.push({
          date: d,
          dateStr: dateStr,
          dayNameKh: this.khmerDays[i],
          dayNameEn: ["Mon", "Tue", "Wed", "Thu", "Fri"][i],
          dayNum: dayNum,
          monthNum: monthNum,
          isCurrentMonth: monthNum === month,
          isToday: isToday,
          displayLabel: `${String(dayNum).padStart(2, '0')}/${String(monthNum + 1).padStart(2, '0')}`
        });
      }

      const startDayStr = `${String(weekDays[0].dayNum).padStart(2, '0')}/${String(weekDays[0].monthNum + 1).padStart(2, '0')}`;
      const endDayStr = `${String(weekDays[4].dayNum).padStart(2, '0')}/${String(weekDays[4].monthNum + 1).padStart(2, '0')}`;

      weeks.push({
        index: weeks.length,
        label: `សប្តាហ៍ទី ${weeks.length + 1}`,
        rangeText: `${startDayStr} - ${endDayStr}`,
        days: weekDays,
        containsToday: containsToday
      });

      // Move to next Monday
      curr.setDate(curr.getDate() + 7);
    }

    return weeks;
  },

  getCurrentWeek() {
    const weeks = this.getWeeksForMonth(this.currentYear, this.currentMonth);
    if (!weeks.length) return null;
    if (this.currentWeekIndex < 0 || this.currentWeekIndex >= weeks.length) {
      this.currentWeekIndex = 0;
    }
    return weeks[this.currentWeekIndex] || weeks[0];
  },

  render() {
    const weeks = this.getWeeksForMonth(this.currentYear, this.currentMonth);
    
    // Auto-select week that contains today if current month
    const today = new Date();
    if (this.currentYear === today.getFullYear() && this.currentMonth === today.getMonth()) {
      const todayWeekIdx = weeks.findIndex(w => w.containsToday);
      if (todayWeekIdx !== -1 && this.currentWeekIndex === 0) {
        this.currentWeekIndex = todayWeekIdx;
      }
    }

    const currentWeek = weeks[this.currentWeekIndex] || weeks[0];
    const monthNameKh = this.khmerMonths[this.currentMonth];

    return `
      <section id="view-attendance" class="page-view">
        <!-- Main Top Bar & Month Navigation -->
        <div class="card" style="margin-bottom: 18px; padding: 20px 24px; border-left: 4px solid #10b981;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 16px;">
            <div>
              <h2 style="font-size: 1.35rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 10px; margin: 0 0 6px 0;">
                <i class="fa-solid fa-calendar-check" style="color: #10b981;"></i>
                <span>កត់ត្រាវត្តមានសិស្ស ៥ ថ្ងៃប្រចាំសប្តាហ៍ (Weekly Attendance Checklist)</span>
              </h2>
              <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted);">
                គ្រីសវត្តមានពីថ្ងៃចន្ទដល់សុក្រ រៀបចំតាមផ្នែកខែៗ គណនាស្ថិតិ និងរក្សាទុកចូលប្រព័ន្ធដោយស្វ័យប្រវត្តិ
              </p>
            </div>

            <!-- Save & Action Controls -->
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
              <!-- Leave Requests Inbox Button -->
              ${(() => {
                const leaveReqs = typeof StudentAPI !== "undefined" ? StudentAPI.getLeaveRequests() : [];
                const pendingCount = leaveReqs.filter(r => r.status === "pending").length;
                return `
                  <button type="button" id="openLeaveRequestsModalBtn" class="btn-secondary" style="height: 38px; padding: 0 14px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px;" title="សំណើសុំច្បាប់ពីសិស្ស">
                    <i class="fa-solid fa-envelope-open-text text-indigo-500"></i>
                    <span>សំណើសុំច្បាប់</span>
                    ${pendingCount > 0 ? `
                      <span class="badge" style="background: #ef4444; color: #ffffff; border-radius: 12px; padding: 2px 7px; font-size: 0.72rem; font-weight: 800;">
                        ${pendingCount} ថ្មី
                      </span>
                    ` : ''}
                  </button>
                `;
              })()}

              <button type="button" id="openQrScannerBtn" class="btn-primary" style="height: 38px; padding: 0 16px; font-size: 0.88rem; background: #6366f1; border-color: #6366f1; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);" title="ស្កេនកាតសិស្ស QR & Barcode ដើម្បីកត់ត្រាវត្តមានរហ័ស">
                <i class="fa-solid fa-qrcode"></i>
                <span>ស្កេន QR កាតសិស្ស</span>
              </button>

              <button type="button" id="markAllWeekPresentBtn" class="btn-secondary" style="height: 38px; padding: 0 14px; font-size: 0.85rem;" title="គ្រីសវត្តមានសិស្សទាំងអស់សម្រាប់ ៥ ថ្ងៃក្នុងសប្តាហ៍នេះ">
                <i class="fa-solid fa-check-double text-emerald-500"></i>
                <span>គ្រីសវត្តមានទាំងអស់ (សប្តាហ៍នេះ)</span>
              </button>

              <button type="button" id="saveAttendanceBtn" class="btn-primary" style="height: 38px; padding: 0 18px; font-size: 0.88rem; background: #10b981; border-color: #10b981; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);">
                <i class="fa-solid fa-floppy-disk"></i>
                <span>រក្សាទុកវត្តមាន</span>
              </button>

              <button type="button" id="printAttendanceBtn" class="btn-secondary" style="height: 38px; padding: 0 12px;" title="បោះពុម្ពតារាងវត្តមាន">
                <i class="fa-solid fa-print"></i>
              </button>
            </div>
          </div>

          <!-- Month Selector Toolbar (ផ្នែកខែៗ) -->
          <div class="att-month-bar">
            <div class="att-month-controls">
              <button type="button" id="prevMonthBtn" class="att-nav-btn" title="ខែមុន">
                <i class="fa-solid fa-chevron-left"></i>
              </button>

              <div class="att-month-selector-group">
                <i class="fa-regular fa-calendar" style="color: #10b981;"></i>
                <select id="attMonthSelect" class="form-control" style="border: none; background: transparent; font-weight: 700; font-size: 0.95rem; cursor: pointer; color: var(--text-main); padding: 4px 8px;">
                  ${this.khmerMonths.map((m, idx) => `
                    <option value="${idx}" ${idx === this.currentMonth ? "selected" : ""}>ខែ ${m}</option>
                  `).join("")}
                </select>

                <select id="attYearSelect" class="form-control" style="border: none; background: transparent; font-weight: 700; font-size: 0.95rem; cursor: pointer; color: var(--text-main); padding: 4px 8px;">
                  ${[2024, 2025, 2026, 2027, 2028].map(y => `
                    <option value="${y}" ${y === this.currentYear ? "selected" : ""}>ឆ្នាំ ${y}</option>
                  `).join("")}
                </select>
              </div>

              <button type="button" id="nextMonthBtn" class="att-nav-btn" title="ខែបន្ទាប់">
                <i class="fa-solid fa-chevron-right"></i>
              </button>

              <button type="button" id="todayMonthBtn" class="att-today-pill">
                <i class="fa-solid fa-bullseye"></i>
                <span>ខែបច្ចុប្បន្ន</span>
              </button>
            </div>

            <!-- Month Title Badge -->
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="badge" style="background: rgba(16, 185, 129, 0.12); color: #059669; font-size: 0.85rem; padding: 6px 14px;">
                <i class="fa-solid fa-calendar-days"></i> ផ្នែក: ខែ${monthNameKh} ឆ្នាំ${this.currentYear} (${weeks.length} សប្តាហ៍)
              </span>
            </div>
          </div>

          <!-- Week Navigation Tabs (សប្តាហ៍ទី ១, ២, ៣, ៤, ៥) -->
          <div class="att-week-tabs-container" id="attWeekTabs">
            ${this.renderWeekTabs(weeks)}
          </div>
        </div>

        <!-- Attendance KPIs (ស្ថិតិវត្តមានប្រចាំខែ & សប្តាហ៍) -->
        <div class="att-kpi-grid">
          <!-- Total Students -->
          <div class="att-kpi-box">
            <div class="att-kpi-icon" style="background: rgba(99, 102, 241, 0.12); color: #4f46e5;">
              <i class="fa-solid fa-users"></i>
            </div>
            <div class="att-kpi-info">
              <h4>សិស្សត្រូវចូលរៀន</h4>
              <div class="att-kpi-num" id="attKpiTotal">0</div>
            </div>
          </div>

          <!-- Total Present -->
          <div class="att-kpi-box">
            <div class="att-kpi-icon" style="background: rgba(16, 185, 129, 0.12); color: #10b981;">
              <i class="fa-solid fa-user-check"></i>
            </div>
            <div class="att-kpi-info">
              <h4>វត្តមាន (Present)</h4>
              <div class="att-kpi-num" id="attKpiPresent" style="color: #10b981;">0</div>
            </div>
          </div>

          <!-- Total Permission -->
          <div class="att-kpi-box">
            <div class="att-kpi-icon" style="background: rgba(245, 158, 11, 0.12); color: #f59e0b;">
              <i class="fa-solid fa-envelope-open-text"></i>
            </div>
            <div class="att-kpi-info">
              <h4>សុំច្បាប់ (Excused)</h4>
              <div class="att-kpi-num" id="attKpiPermission" style="color: #f59e0b;">0</div>
            </div>
          </div>

          <!-- Total Absent -->
          <div class="att-kpi-box">
            <div class="att-kpi-icon" style="background: rgba(239, 68, 68, 0.12); color: #ef4444;">
              <i class="fa-solid fa-user-xmark"></i>
            </div>
            <div class="att-kpi-info">
              <h4>អវត្តមាន (Absent)</h4>
              <div class="att-kpi-num" id="attKpiAbsent" style="color: #ef4444;">0</div>
            </div>
          </div>

          <!-- Attendance Rate -->
          <div class="att-kpi-box">
            <div class="att-kpi-icon" style="background: rgba(14, 165, 233, 0.12); color: #0284c7;">
              <i class="fa-solid fa-chart-pie"></i>
            </div>
            <div class="att-kpi-info">
              <h4>អត្រាវត្តមានសប្តាហ៍នេះ</h4>
              <div class="att-kpi-num" id="attKpiRate" style="color: #0284c7;">0%</div>
            </div>
          </div>
        </div>

        <!-- Filter & Search Bar -->
        <div class="filter-bar" style="margin-bottom: 16px;">
          <!-- Filter Course (Only Computer Courses) -->
          <select id="attFilterCourse" class="filter-select">
            <option value="">-- គ្រប់វគ្គសិក្សាកុំព្យូទ័រ --</option>
            ${APP_CONFIG.computerCourses.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
          </select>

          <!-- Filter Shift -->
          <select id="attFilterShift" class="filter-select">
            <option value="">-- គ្រប់វេន --</option>
            ${APP_CONFIG.shifts.map(s => `<option value="${s.id}">${s.label}</option>`).join('')}
          </select>

          <!-- Search Student -->
          <div style="position: relative; flex: 1; max-width: 280px;">
            <input type="text" id="attSearchInput" class="form-control" placeholder="ស្វែងរកតាមឈ្មោះ ឬអត្តលេខ..." style="height: 36px; padding-left: 32px; font-size: 0.84rem;">
            <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 10px; top: 11px; color: var(--text-muted); font-size: 0.85rem;"></i>
          </div>

          <span class="text-xs text-muted" style="margin-left: auto; display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-circle-info text-emerald-500"></i>
            <span>ចុចលើប្រអប់ថ្ងៃដើម្បីគ្រីសវត្តមាន (វត្តមាន ➔ ច្បាប់ ➔ អវត្តមាន ➔ សម្អាត)</span>
          </span>
        </div>

        <!-- 5-Day Weekly Roll Call Checklist Table (Monday to Friday) -->
        <div class="att-table-wrapper" id="attendanceTableContainer">
          <!-- Rendered dynamically -->
        </div>

        <!-- Help & Status Legend -->
        <div class="att-legend-bar">
          <div class="att-legend-items">
            <span style="font-weight: 700; color: var(--text-main);">កំណត់សម្គាល់:</span>
            <div class="att-legend-item">
              <span class="badge" style="background: #10b981; color: #ffffff; padding: 3px 8px;"><i class="fa-solid fa-check"></i> វត្តមាន</span>
              <span>មានវត្តមាន (Present)</span>
            </div>
            <div class="att-legend-item">
              <span class="badge" style="background: #f59e0b; color: #ffffff; padding: 3px 8px;"><i class="fa-solid fa-envelope-open-text"></i> ច្បាប់</span>
              <span>មានច្បាប់អនុញ្ញាត (Excused)</span>
            </div>
            <div class="att-legend-item">
              <span class="badge" style="background: #ef4444; color: #ffffff; padding: 3px 8px;"><i class="fa-solid fa-xmark"></i> អវត្តមាន</span>
              <span>អវត្តមានឥតច្បាប់ (Absent)</span>
            </div>
            <div class="att-legend-item">
              <span class="badge" style="background: var(--border-light); color: var(--text-muted); border: 1px dashed var(--border-color); padding: 3px 8px;"><i class="fa-solid fa-plus"></i> គ្រីស</span>
              <span>មិនទាន់កត់ត្រា</span>
            </div>
          </div>

          <div style="font-size: 0.75rem;">
            <i class="fa-solid fa-cloud-arrow-up text-emerald-500"></i> ទិន្នន័យត្រូវបាន Sync ទៅកាន់ Firebase Realtime Database
          </div>
        </div>
      </section>
    `;
  },

  renderWeekTabs(weeks) {
    if (!weeks) weeks = this.getWeeksForMonth(this.currentYear, this.currentMonth);

    return weeks.map((w, idx) => {
      const isActive = idx === this.currentWeekIndex;
      return `
        <button type="button" class="att-week-tab-btn ${isActive ? "active" : ""}" data-week-idx="${idx}">
          ${w.containsToday ? `<span class="att-week-badge-today"><i class="fa-solid fa-star"></i> សប្តាហ៍នេះ</span>` : ""}
          <div class="att-week-tab-title">
            <i class="fa-regular fa-calendar-check"></i>
            <span>${w.label}</span>
          </div>
          <div class="att-week-tab-dates">${w.rangeText}</div>
        </button>
      `;
    }).join("");
  },

  initEvents() {
    // Month Selector Change
    const monthSelect = document.getElementById("attMonthSelect");
    if (monthSelect) {
      monthSelect.addEventListener("change", (e) => {
        this.currentMonth = parseInt(e.target.value, 10);
        this.currentWeekIndex = 0;
        this.refreshWeekTabsAndTable();
      });
    }

    // Year Selector Change
    const yearSelect = document.getElementById("attYearSelect");
    if (yearSelect) {
      yearSelect.addEventListener("change", (e) => {
        this.currentYear = parseInt(e.target.value, 10);
        this.currentWeekIndex = 0;
        this.refreshWeekTabsAndTable();
      });
    }

    // Previous Month Button
    const prevMonthBtn = document.getElementById("prevMonthBtn");
    if (prevMonthBtn) {
      prevMonthBtn.addEventListener("click", () => {
        if (this.currentMonth === 0) {
          this.currentMonth = 11;
          this.currentYear--;
        } else {
          this.currentMonth--;
        }
        this.currentWeekIndex = 0;
        this.updateMonthSelectUI();
        this.refreshWeekTabsAndTable();
      });
    }

    // Next Month Button
    const nextMonthBtn = document.getElementById("nextMonthBtn");
    if (nextMonthBtn) {
      nextMonthBtn.addEventListener("click", () => {
        if (this.currentMonth === 11) {
          this.currentMonth = 0;
          this.currentYear++;
        } else {
          this.currentMonth++;
        }
        this.currentWeekIndex = 0;
        this.updateMonthSelectUI();
        this.refreshWeekTabsAndTable();
      });
    }

    // Today / Current Month Button
    const todayMonthBtn = document.getElementById("todayMonthBtn");
    if (todayMonthBtn) {
      todayMonthBtn.addEventListener("click", () => {
        const now = new Date();
        this.currentYear = now.getFullYear();
        this.currentMonth = now.getMonth();
        const weeks = this.getWeeksForMonth(this.currentYear, this.currentMonth);
        const todayWeekIdx = weeks.findIndex(w => w.containsToday);
        this.currentWeekIndex = todayWeekIdx !== -1 ? todayWeekIdx : 0;
        this.updateMonthSelectUI();
        this.refreshWeekTabsAndTable();
      });
    }

    // Week Tabs Delegation
    const tabsContainer = document.getElementById("attWeekTabs");
    if (tabsContainer) {
      tabsContainer.addEventListener("click", (e) => {
        const tabBtn = e.target.closest(".att-week-tab-btn");
        if (tabBtn) {
          const idx = parseInt(tabBtn.getAttribute("data-week-idx"), 10);
          this.currentWeekIndex = idx;
          document.querySelectorAll(".att-week-tab-btn").forEach(b => b.classList.remove("active"));
          tabBtn.classList.add("active");
          this.renderTable();
        }
      });
    }

    // Filter Course
    const courseFilter = document.getElementById("attFilterCourse");
    if (courseFilter) {
      courseFilter.addEventListener("change", (e) => {
        this.filters.course = e.target.value;
        this.renderTable();
      });
    }

    // Filter Shift
    const shiftFilter = document.getElementById("attFilterShift");
    if (shiftFilter) {
      shiftFilter.addEventListener("change", (e) => {
        this.filters.shift = e.target.value;
        this.renderTable();
      });
    }

    // Search Input
    const searchInput = document.getElementById("attSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.filters.search = e.target.value.toLowerCase().trim();
        this.renderTable();
      });
    }

    // Mark All Week Present
    const markWeekBtn = document.getElementById("markAllWeekPresentBtn");
    if (markWeekBtn) {
      markWeekBtn.addEventListener("click", () => {
        this.markAllWeekPresent();
      });
    }

    // Save Attendance
    const saveBtn = document.getElementById("saveAttendanceBtn");
    if (saveBtn) {
      saveBtn.addEventListener("click", async () => {
        await this.saveAttendance();
      });
    }

    // Print Button
    const printBtn = document.getElementById("printAttendanceBtn");
    if (printBtn) {
      printBtn.addEventListener("click", () => {
        window.print();
      });
    }

    // Leave Requests Modal Button
    const leaveReqBtn = document.getElementById("openLeaveRequestsModalBtn");
    if (leaveReqBtn) {
      leaveReqBtn.addEventListener("click", () => {
        this.openLeaveRequestsModal();
      });
    }

    // QR Code Scanner Button
    const qrBtn = document.getElementById("openQrScannerBtn");
    if (qrBtn) {
      qrBtn.addEventListener("click", () => {
        this.openQrScannerModal();
      });
    }

    // Initial Table Render
    this.renderTable();
  },

  qrScannerInstance: null,

  openQrScannerModal() {
    ModalsComponent.open("qrAttendanceModal");
    const manualInput = document.getElementById("qrManualInput");
    if (manualInput) {
      manualInput.value = "";
      setTimeout(() => manualInput.focus(), 250);
    }
    const feedback = document.getElementById("qrScanFeedbackBox");
    if (feedback) feedback.style.display = "none";
  },

  async startQrScanner() {
    const startBtn = document.getElementById("startCamBtn");
    const stopBtn = document.getElementById("stopCamBtn");

    if (typeof Html5Qrcode === "undefined") {
      App.showToast("មិនទាន់អាចដំណើរការ Camera Library បានទេ សូមប្រើប្រអប់ Barcode ខាងក្រោម!", "warning");
      return;
    }

    try {
      if (this.qrScannerInstance) {
        await this.stopQrScanner();
      }

      this.qrScannerInstance = new Html5Qrcode("qrReaderContainer");
      if (startBtn) startBtn.style.display = "none";
      if (stopBtn) stopBtn.style.display = "inline-flex";

      await this.qrScannerInstance.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          this.handleScannedCode(decodedText);
        },
        () => {
          // Frame errors during scan can be ignored
        }
      );
    } catch (err) {
      console.warn("Camera scan notice:", err);
      App.showToast("មិនអាចបើកកាមេរ៉ាបានទេ! សូមប្រើប្រអប់ Barcode ឬវាយអត្តលេខសិស្សផ្ទាល់។", "warning");
      if (startBtn) startBtn.style.display = "inline-flex";
      if (stopBtn) stopBtn.style.display = "none";
    }
  },

  async stopQrScanner() {
    const startBtn = document.getElementById("startCamBtn");
    const stopBtn = document.getElementById("stopCamBtn");
    if (this.qrScannerInstance) {
      try {
        await this.qrScannerInstance.stop();
        this.qrScannerInstance.clear();
      } catch (e) {}
      this.qrScannerInstance = null;
    }
    if (startBtn) startBtn.style.display = "inline-flex";
    if (stopBtn) stopBtn.style.display = "none";
  },

  handleManualQrSubmit() {
    const input = document.getElementById("qrManualInput");
    if (!input) return;
    const val = input.value.trim();
    if (!val) {
      App.showToast("សូមបញ្ចូល ឬស្កេនអត្តលេខសិស្ស!", "warning");
      return;
    }
    this.handleScannedCode(val);
    input.value = "";
    input.focus();
  },

  playSuccessChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  },

  handleScannedCode(rawCode) {
    if (!rawCode) return;
    const text = String(rawCode).trim();
    
    // Parse student ID from QR payload or raw barcode
    let studentId = "";
    const stuMatch = text.match(/(?:TX|STU)-\d+/i);
    const prefix = (typeof APP_CONFIG !== "undefined" && APP_CONFIG.studentIdPrefix) || "TX";
    if (stuMatch) {
      studentId = stuMatch[0].toUpperCase();
    } else if (/^\d+$/.test(text)) {
      studentId = `${prefix}-` + text;
    } else {
      studentId = text.toUpperCase();
    }

    const students = App.state.students || [];
    const student = students.find(s => (s.ID && s.ID.toUpperCase() === studentId));

    if (!student) {
      App.showToast(`⚠️ រកមិនឃើញសិស្សតាមកូដ "${text}" នេះទេ!`, "warning");
      return;
    }

    // Check if student ID is locked / student has dropped out
    const isDropped = (typeof StudentAPI !== "undefined" && StudentAPI.isStudentIdBlocked(student.ID)) ||
                      student.Status === "Dropped" || student.Status === "បោះបង់" || student.Status === "បោះបង់ការសិក្សា" || student.isBlocked === true;

    if (isDropped) {
      // Play harsh warning tone
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } catch (e) {}

      // Show locked feedback card in modal
      const feedback = document.getElementById("qrScanFeedbackBox");
      if (feedback) {
        feedback.style.display = "block";
        feedback.innerHTML = `
          <div style="display: flex; align-items: center; gap: 14px; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; padding: 14px; border-radius: 12px;">
            <img src="${student.Avatar || App.getDefaultAvatar(student.Gender)}" alt="${student.NameKh}" style="width: 52px; height: 52px; border-radius: 50%; object-fit: cover; border: 2px solid #ef4444;" onerror="this.src='${App.getDefaultAvatar(student.Gender)}'">
            <div style="flex: 1;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <h4 style="margin: 0; font-size: 1.05rem; color: #ef4444; font-weight: 700;">${student.NameKh}</h4>
                <span class="badge" style="background: #ef4444; color: #ffffff; font-weight: 700; font-size: 0.78rem;">
                  <i class="fa-solid fa-lock"></i> អត្តលេខចាក់សោរ (Locked)
                </span>
              </div>
              <div style="font-size: 0.85rem; color: #ef4444; font-weight: 700; margin-top: 4px;">
                ⛔ សិស្សនេះបានបោះបង់ការសិក្សា! អត្តលេខ ${student.ID} ប្រើប្រាស់លែងកើតឡើយ។
              </div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
                កាលបរិច្ឆេទបោះបង់៖ ${student.DropDate || 'មិនបានបញ្ជាក់'} • មូលហេតុ៖ ${student.DropReason || 'រវល់ផ្ទាល់ខ្លួន'}
              </div>
            </div>
          </div>
        `;
      }

      App.showToast(`⛔ អត្តលេខ ${student.ID} (${student.NameKh}) បានបោះបង់ការសិក្សា! អត្តលេខនេះត្រូវបានចាក់សោរ ប្រើលែងកើតឡើយ។`, "error");
      return;
    }

    // Set today's attendance as Present
    const today = new Date();
    const todayStr = this.formatLocalDate(today);
    this.setDayStatus(student.ID, todayStr, "Present");

    // Play pleasant chime
    this.playSuccessChime();

    // Show instant feedback card in modal
    const feedback = document.getElementById("qrScanFeedbackBox");
    if (feedback) {
      const timeStr = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      feedback.style.display = "block";
      feedback.innerHTML = `
        <div style="display: flex; align-items: center; gap: 14px;">
          <img src="${student.Avatar || App.getDefaultAvatar(student.Gender)}" alt="${student.NameKh}" style="width: 52px; height: 52px; border-radius: 50%; object-fit: cover; border: 2px solid #10b981;" onerror="this.src='${App.getDefaultAvatar(student.Gender)}'">
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h4 style="margin: 0; font-size: 1.05rem; color: var(--text-main); font-weight: 700;">${student.NameKh}</h4>
              <span class="badge" style="background: #10b981; color: #ffffff; font-weight: 700;">
                <i class="fa-solid fa-check-circle"></i> វត្តមាន (Present)
              </span>
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
              <span class="font-mono font-bold" style="color: var(--primary);">${student.ID}</span> • ${student.Course || 'Typing'} (${student.Shift || 'ព្រឹក'})
            </div>
            <div style="font-size: 0.76rem; color: #059669; font-weight: 600; margin-top: 4px;">
              <i class="fa-regular fa-clock"></i> ម៉ោងកត់ត្រា៖ ${timeStr} • ${todayStr}
            </div>
          </div>
        </div>
      `;
    }

    App.showToast(`🎉 វត្តមានជោគជ័យ៖ ${student.NameKh} (${student.ID})`, "success");
    App.triggerConfetti();

    // Trigger Telegram Notification
    if (typeof TelegramService !== "undefined") {
      const timeStr = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      TelegramService.notifyAttendance(student, timeStr, todayStr);
    }
  },

  updateMonthSelectUI() {
    const mSelect = document.getElementById("attMonthSelect");
    const ySelect = document.getElementById("attYearSelect");
    if (mSelect) mSelect.value = this.currentMonth;
    if (ySelect) ySelect.value = this.currentYear;
  },

  refreshWeekTabsAndTable() {
    const weeks = this.getWeeksForMonth(this.currentYear, this.currentMonth);
    const tabsContainer = document.getElementById("attWeekTabs");
    if (tabsContainer) {
      tabsContainer.innerHTML = this.renderWeekTabs(weeks);
    }
    this.renderTable();
  },

  loadAllAttendance() {
    const local = StudentAPI.getAllAttendance() || {};
    this.records = { ...local, ...(this.records || {}) };
  },

  getFilteredStudents() {
    let students = App.state.students || [];
    // Only active students attend classes! Exclude dropped out students whose ID is locked
    students = students.filter(s => {
      if (!s) return false;
      const status = (s.Status || "").toLowerCase();
      if (s.isBlocked === true || status === "dropped" || status === "បោះបង់" || status === "បោះបង់ការសិក្សា" || (typeof StudentAPI !== "undefined" && StudentAPI.isStudentIdBlocked(s.ID))) return false;
      return true;
    });

    if (this.filters.course) {
      students = students.filter(s => (s.Course || "").includes(this.filters.course));
    }
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

  _syncTimeout: null,
  syncToFirebase() {
    clearTimeout(this._syncTimeout);
    this._syncTimeout = setTimeout(async () => {
      if (typeof StudentAPI !== "undefined" && StudentAPI.isCloudConnected()) {
        try {
          await StudentAPI.saveMultipleDaysAttendance(this.records);
          console.log("☁️ បាន Sync វត្តមានទៅ Firebase RTDB ដោយស្វ័យប្រវត្តិ");
        } catch (e) {
          console.warn("Auto sync attendance to cloud notice:", e);
        }
      }
    }, 600);
  },

  // 1-Click Intuitive Toggle: Empty -> Present -> Untick
  toggleDayStatus(studentId, dateStr) {
    if (!this.records[dateStr]) this.records[dateStr] = {};
    const current = this.records[dateStr][studentId] || "";

    let nextStatus = "";
    if (current === "Present" || current === "វត្តមាន" || (current && current.toLowerCase() === "present")) {
      nextStatus = ""; // If already Present, clicking again unticks it
    } else {
      nextStatus = "Present"; // If empty/permission/absent, clicking marks Present
    }

    this.setDayStatus(studentId, dateStr, nextStatus);
  },

  setDayStatus(studentId, dateStr, status) {
    if (typeof StudentAPI !== "undefined" && StudentAPI.isStudentIdBlocked(studentId)) {
      App.showToast(`⛔ អត្តលេខ ${studentId} ត្រូវបានចាក់សោរ (បោះបង់ការសិក្សា) ប្រើលែងកើតឡើយ!`, "error");
      return;
    }

    if (!this.records[dateStr]) this.records[dateStr] = {};
    if (status) {
      this.records[dateStr][studentId] = status;
    } else {
      delete this.records[dateStr][studentId];
    }
    this.hasUnsavedChanges = true;

    // 1. Immediately persist to localStorage so it NEVER disappears on reload/re-render!
    StudentAPI.saveAllAttendance(this.records);

    // 2. Debounced auto-sync to Firebase Cloud
    this.syncToFirebase();

    // Update single cell DOM for seamless UX
    const cellBtn = document.querySelector(`.att-tick-btn[data-student-id="${studentId}"][data-date="${dateStr}"]`);
    if (cellBtn) {
      cellBtn.className = `att-tick-btn ${this.getStatusClass(status)}`;
      cellBtn.innerHTML = this.getStatusBtnInner(status);
    }

    // Update row summary
    this.updateStudentRowSummary(studentId);

    // Update overall KPIs
    this.updateKpiCounters();

    // Trigger Telegram notification for attendance
    if (status && typeof TelegramService !== "undefined") {
      const student = (App.state.students || []).find(s => String(s.ID).trim() === String(studentId).trim());
      if (student) {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const teacher = (typeof AuthService !== "undefined" && AuthService.getCurrentUser()) ? AuthService.getCurrentUser().nameKh : null;
        TelegramService.notifyAttendance(student, timeStr, dateStr, status, teacher);
      }
    }
  },

  getStatusClass(status) {
    const s = (status || "").toLowerCase();
    if (status === "Present" || status === "វត្តមាន" || s === "present") return "state-present";
    if (status === "Permission" || status === "ច្បាប់" || s === "permission") return "state-permission";
    if (status === "Absent" || status === "អវត្តមាន" || s === "absent") return "state-absent";
    return "state-empty";
  },

  getStatusBtnInner(status) {
    const s = (status || "").toLowerCase();
    if (status === "Present" || status === "វត្តមាន" || s === "present") {
      return `<i class="fa-solid fa-check"></i> វត្តមាន`;
    }
    if (status === "Permission" || status === "ច្បាប់" || s === "permission") {
      return `<i class="fa-solid fa-envelope-open-text"></i> ច្បាប់`;
    }
    if (status === "Absent" || status === "អវត្តមាន" || s === "absent") {
      return `<i class="fa-solid fa-xmark"></i> អវត្តមាន`;
    }
    return `<i class="fa-solid fa-plus"></i> គ្រីស`;
  },

  // Mark all students present for a single day column
  markAllPresentForDay(dateStr) {
    if (!this.records[dateStr]) this.records[dateStr] = {};
    const students = this.getFilteredStudents();
    students.forEach(s => {
      const id = s.ID || s.id;
      if (id) {
        this.records[dateStr][id] = "Present";
      }
    });
    this.hasUnsavedChanges = true;
    StudentAPI.saveAllAttendance(this.records);
    this.syncToFirebase();
    this.renderTable();
    App.showToast(`បានគ្រីសវត្តមានសិស្សទាំងអស់ (${students.length} នាក់) សម្រាប់ថ្ងៃទី ${dateStr}`, "info");
  },

  // Mark all students present for all 5 days of current week
  markAllWeekPresent() {
    const currentWeek = this.getCurrentWeek();
    if (!currentWeek) return;

    const students = this.getFilteredStudents();
    currentWeek.days.forEach(day => {
      if (!this.records[day.dateStr]) this.records[day.dateStr] = {};
      students.forEach(s => {
        const id = s.ID || s.id;
        if (id) {
          this.records[day.dateStr][id] = "Present";
        }
      });
    });

    this.hasUnsavedChanges = true;
    StudentAPI.saveAllAttendance(this.records);
    this.syncToFirebase();
    this.renderTable();
    App.showToast(`បានគ្រីសវត្តមានសិស្សទាំងអស់ (${students.length} នាក់) ពេញមួយសប្តាហ៍ទាំង ៥ ថ្ងៃជោគជ័យ!`, "success");
    App.triggerConfetti();
  },

  updateStudentRowSummary(studentId) {
    const currentWeek = this.getCurrentWeek();
    if (!currentWeek) return;

    let present = 0;
    let permission = 0;
    let absent = 0;
    let recorded = 0;

    currentWeek.days.forEach(d => {
      const st = this.records[d.dateStr]?.[studentId];
      const sLower = (st || "").toLowerCase();
      if (st === "Present" || st === "វត្តមាន" || sLower === "present") { present++; recorded++; }
      else if (st === "Permission" || st === "ច្បាប់" || sLower === "permission") { permission++; recorded++; }
      else if (st === "Absent" || st === "អវត្តមាន" || sLower === "absent") { absent++; recorded++; }
    });

    const rate = recorded > 0 ? Math.round((present / recorded) * 100) : 100;

    const row = document.querySelector(`tr[data-row-student-id="${studentId}"]`);
    if (row) {
      const summaryCell = row.querySelector(".att-weekly-summary-cell");
      if (summaryCell) {
        summaryCell.innerHTML = `
          <div class="att-weekly-pill-box">
            <div class="att-weekly-counts">
              <span class="att-cnt-pres" title="វត្តមាន">${present} វ</span>
              <span class="att-cnt-perm" title="ច្បាប់">${permission} ច</span>
              <span class="att-cnt-abs" title="អវត្តមាន">${absent} អ</span>
            </div>
            <span class="badge-attendance-rate ${rate >= 85 ? 'rate-high' : rate >= 70 ? 'rate-medium' : 'rate-low'}">
              ${rate}% (${present}/5)
            </span>
          </div>
        `;
      }
    }
  },

  updateKpiCounters() {
    const currentWeek = this.getCurrentWeek();
    const students = this.getFilteredStudents();
    const totalStudents = students.length;

    let totalPossible = 0;
    let totalPresent = 0;
    let totalPermission = 0;
    let totalAbsent = 0;

    if (currentWeek) {
      currentWeek.days.forEach(d => {
        students.forEach(s => {
          totalPossible++;
          const id = s.ID || s.id;
          const st = this.records[d.dateStr]?.[id];
          const sLower = (st || "").toLowerCase();
          if (st === "Present" || st === "វត្តមាន" || sLower === "present") totalPresent++;
          else if (st === "Permission" || st === "ច្បាប់" || sLower === "permission") totalPermission++;
          else if (st === "Absent" || st === "អវត្តមាន" || sLower === "absent") totalAbsent++;
        });
      });
    }

    const recordedDays = totalPresent + totalPermission + totalAbsent;
    const rate = recordedDays > 0 ? Math.round((totalPresent / recordedDays) * 100) : 100;

    const elTotal = document.getElementById("attKpiTotal");
    const elPresent = document.getElementById("attKpiPresent");
    const elPerm = document.getElementById("attKpiPermission");
    const elAbsent = document.getElementById("attKpiAbsent");
    const elRate = document.getElementById("attKpiRate");

    if (elTotal) elTotal.textContent = totalStudents;
    if (elPresent) elPresent.textContent = totalPresent;
    if (elPerm) elPerm.textContent = totalPermission;
    if (elAbsent) elAbsent.textContent = totalAbsent;
    if (elRate) elRate.textContent = `${rate}%`;
  },

  async saveAttendance() {
    const saveBtn = document.getElementById("saveAttendanceBtn");
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> កំពុងរក្សាទុក...`;
    }

    try {
      // Save all in-memory days records
      await StudentAPI.saveMultipleDaysAttendance(this.records);
      this.hasUnsavedChanges = false;
      App.showToast(`បានរក្សាទុកវត្តមានសិស្សប្រចាំសប្តាហ៍ និងខែដោយជោគជ័យ!`, "success");
      App.triggerConfetti();
      if (typeof DashboardView !== "undefined" && DashboardView.update) {
        DashboardView.update(App.state.students);
      }
    } catch (err) {
      App.showToast("កំហុសក្នុងការរក្សាទុកវត្តមាន: " + err.message, "error");
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> <span>រក្សាទុកវត្តមាន</span>`;
      }
    }
  },

  renderTable() {
    const container = document.getElementById("attendanceTableContainer");
    if (!container) return;

    this.loadAllAttendance();
    const students = this.getFilteredStudents();
    const currentWeek = this.getCurrentWeek();

    if (!currentWeek) {
      container.innerHTML = `<div class="p-5 text-center text-muted">មិនមានទិន្នន័យសប្តាហ៍សម្រាប់ខែនេះឡើយ</div>`;
      return;
    }

    this.updateKpiCounters();

    const weekDays = currentWeek.days;

    container.innerHTML = `
      <table class="att-table-5days">
        <thead>
          <tr>
            <th class="text-center" style="width: 45px;">#</th>
            <th style="width: 90px;">អត្តលេខ</th>
            <th style="width: 220px;">ព័ត៌មានសិស្ស</th>
            <th style="width: 130px;">ថ្នាក់ & វេន</th>
            
            <!-- 5 Days Columns: Monday to Friday (ចន្ទ ដល់ សុក្រ) -->
            ${weekDays.map(day => `
              <th class="att-th-day ${day.isToday ? 'is-today' : ''}">
                <div class="att-day-name">
                  ${day.dayNameKh}
                  ${day.isToday ? '<span style="color: #10b981; font-size: 0.72rem; margin-left: 2px;">(ថ្ងៃនេះ)</span>' : ''}
                </div>
                <div class="att-day-date">${day.displayLabel}</div>
                <button type="button" class="att-day-mark-all" onclick="AttendanceView.markAllPresentForDay('${day.dateStr}')" title="គ្រីសវត្តមានទាំងអស់ថ្ងៃ${day.dayNameKh}">
                  <i class="fa-solid fa-check text-emerald-500"></i> គ្រីសទាំងអស់
                </button>
              </th>
            `).join("")}

            <!-- Weekly Summary Column -->
            <th class="text-center" style="width: 120px;">សរុបសប្តាហ៍</th>
          </tr>
        </thead>
        <tbody>
          ${students.length === 0 ? `
            <tr>
              <td colspan="10" class="text-center py-5 text-muted">មិនមានសិស្សតាមតម្រងដែលបានជ្រើសរើសឡើយ</td>
            </tr>
          ` : students.map((s, idx) => {
            let present = 0;
            let permission = 0;
            let absent = 0;
            let recorded = 0;

            weekDays.forEach(d => {
              const id = s.ID || s.id;
              const st = this.records[d.dateStr]?.[id];
              const sLower = (st || "").toLowerCase();
              if (st === "Present" || st === "វត្តមាន" || sLower === "present") { present++; recorded++; }
              else if (st === "Permission" || st === "ច្បាប់" || sLower === "permission") { permission++; recorded++; }
              else if (st === "Absent" || st === "អវត្តមាន" || sLower === "absent") { absent++; recorded++; }
            });

            const rate = recorded > 0 ? Math.round((present / recorded) * 100) : 100;

            const id = s.ID || s.id;
            return `
              <tr data-row-student-id="${id}">
                <td class="text-center font-semibold text-muted">${idx + 1}</td>
                <td><span class="badge badge-id font-mono">${App.escapeHtml(id)}</span></td>
                <td>
                  <div class="user-badge">
                    <img src="${s.Avatar || App.getDefaultAvatar(s.Gender)}" alt="${s.NameKh}" class="avatar-sm" onerror="this.src='${App.getDefaultAvatar(s.Gender)}'">
                    <div>
                      <div class="font-bold student-name-link" onclick="App.viewStudentDetails('${id}')">${App.escapeHtml(s.NameKh)}</div>
                      <div style="display: flex; align-items: center; gap: 6px;">
                        <span class="text-xs text-muted font-sans">${App.escapeHtml(s.NameEn || '')}</span>
                        ${s.Phone || s.GuardianPhone ? `
                          <a href="tel:${s.Phone || s.GuardianPhone}" style="color: #10b981; font-size: 0.72rem;" title="Call ទៅសិស្ស/អាណាព្យាបាល"><i class="fa-solid fa-phone"></i></a>
                          <a href="https://t.me/+855${String(s.Phone || s.GuardianPhone).replace(/^0/, '').replace(/\s+/g, '')}" target="_blank" style="color: #0088cc; font-size: 0.76rem;" title="ផ្ញើសារ Telegram ទៅអាណាព្យាបាល"><i class="fa-brands fa-telegram"></i></a>
                        ` : ''}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style="display: flex; flex-direction: column; gap: 3px; align-items: flex-start;">
                    <span class="badge-course ${App.getCourseBadgeClass(s.Course || 'Typing')}" style="font-size: 0.72rem; padding: 2px 6px;">${App.escapeHtml(s.Course || 'Typing')}</span>
                    <span class="text-xs text-muted font-semibold">${App.getShiftLabel(s.Shift)}</span>
                  </div>
                </td>

                <!-- 5 Interactive Day Tick Cells (ចន្ទ ដល់ សុក្រ) -->
                ${weekDays.map(day => {
                  const status = this.records[day.dateStr]?.[id] || "";
                  const statusClass = this.getStatusClass(status);
                  const btnInner = this.getStatusBtnInner(status);

                  return `
                    <td class="att-day-cell">
                      <div style="position: relative; display: inline-block; width: 100%;">
                        <button type="button" 
                          class="att-tick-btn ${statusClass}" 
                          data-student-id="${id}" 
                          data-date="${day.dateStr}"
                          onclick="AttendanceView.toggleDayStatus('${id}', '${day.dateStr}')"
                          title="ចុចដើម្បីគ្រីសវត្តមាន">
                          ${btnInner}
                        </button>

                        <!-- Quick Hover Status Chooser -->
                        <div class="att-quick-popover">
                          <button type="button" class="att-pop-btn p-pres" onclick="event.stopPropagation(); AttendanceView.setDayStatus('${id}', '${day.dateStr}', 'Present')">
                            <i class="fa-solid fa-check"></i> វត្តមាន
                          </button>
                          <button type="button" class="att-pop-btn p-perm" onclick="event.stopPropagation(); AttendanceView.setDayStatus('${id}', '${day.dateStr}', 'Permission')">
                            <i class="fa-solid fa-envelope-open-text"></i> ច្បាប់
                          </button>
                          <button type="button" class="att-pop-btn p-abs" onclick="event.stopPropagation(); AttendanceView.setDayStatus('${id}', '${day.dateStr}', 'Absent')">
                            <i class="fa-solid fa-xmark"></i> អវត្តមាន
                          </button>
                          <button type="button" class="att-pop-btn p-clr" onclick="event.stopPropagation(); AttendanceView.setDayStatus('${id}', '${day.dateStr}', '')">
                            <i class="fa-solid fa-trash-can"></i> លុប
                          </button>
                        </div>
                      </div>
                    </td>
                  `;
                }).join("")}

                <!-- Weekly Summary Column -->
                <td class="text-center att-weekly-summary-cell">
                  <div class="att-weekly-pill-box">
                    <div class="att-weekly-counts">
                      <span class="att-cnt-pres" title="វត្តមាន">${present} វ</span>
                      <span class="att-cnt-perm" title="ច្បាប់">${permission} ច</span>
                      <span class="att-cnt-abs" title="អវត្តមាន">${absent} អ</span>
                    </div>
                    <span class="badge-attendance-rate ${rate >= 85 ? 'rate-high' : rate >= 70 ? 'rate-medium' : 'rate-low'}">
                      ${rate}% (${present}/5)
                    </span>
                  </div>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    `;
  },

  // ====================================================
  // LEAVE REQUESTS ADMINISTRATIVE CONTROLS
  // ====================================================
  openLeaveRequestsModal() {
    ModalsComponent.open("leaveRequestAdminModal");
    this.renderLeaveRequestsList("all");
  },

  renderLeaveRequestsList(filter = "all") {
    const container = document.getElementById("adminLeaveRequestsListContainer");
    if (!container) return;

    let requests = typeof StudentAPI !== "undefined" ? StudentAPI.getLeaveRequests() : [];
    if (filter !== "all") {
      requests = requests.filter(r => r.status === filter);
    }

    if (requests.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
          <i class="fa-solid fa-envelope-circle-check fa-3x mb-3" style="color: #94a3b8;"></i>
          <h4>មិនមានសំណើសុំច្បាប់ ${filter === "pending" ? "ដែលរង់ចាំពិនិត្យ" : ""} ឡើយ</h4>
          <p style="font-size: 0.85rem;">សិស្សអាចដាក់ពាក្យសុំច្បាប់តាមរយៈ Student Portal ដោយខ្លួនឯង។</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${requests.map(req => {
          const isPending = req.status === "pending";
          const isApproved = req.status === "approved";
          const isRejected = req.status === "rejected";

          return `
            <div style="background: var(--bg-surface); border: 1.5px solid ${isPending ? '#f59e0b' : isApproved ? '#10b981' : '#ef4444'}; border-radius: 12px; padding: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; box-shadow: var(--shadow-xs);">
              <div style="flex: 1; min-width: 260px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                  <span class="font-mono font-bold" style="background: rgba(99, 102, 241, 0.1); color: #4f46e5; padding: 2px 8px; border-radius: 6px; font-size: 0.8rem;">${req.studentId}</span>
                  <h4 style="margin: 0; font-size: 1rem; color: var(--text-main); font-weight: 700;">${req.studentNameKh}</h4>
                  <span class="badge" style="background: ${isPending ? '#fef3c7' : isApproved ? '#d1fae5' : '#fee2e2'}; color: ${isPending ? '#d97706' : isApproved ? '#059669' : '#dc2626'}; font-size: 0.72rem; font-weight: 700; padding: 3px 8px;">
                    ${isPending ? '⏳ រង់ចាំពិនិត្យ' : isApproved ? '✓ បានយល់ព្រម' : '✕ បានបដិសេធ'}
                  </span>
                </div>

                <div style="font-size: 0.86rem; color: var(--text-main); margin-bottom: 4px;">
                  <i class="fa-regular fa-calendar-days text-emerald-600"></i> សុំឈប់ពីថ្ងៃ៖ <strong>${req.startDate}</strong> ដល់ <strong>${req.endDate}</strong>
                </div>

                <div style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 4px;">
                  <i class="fa-solid fa-comment-dots text-indigo-500"></i> មូលហេតុ៖ <em>"${App.escapeHtml(req.reason || '')}"</em>
                </div>

                <div style="font-size: 0.76rem; color: var(--text-muted); display: flex; gap: 14px; flex-wrap: wrap;">
                  <span><i class="fa-regular fa-clock"></i> ពេលស្នើសុំ៖ ${new Date(req.createdAt).toLocaleString('km-KH')}</span>
                  ${req.phone ? `<span><i class="fa-solid fa-phone"></i> ទាក់ទង៖ <a href="tel:${req.phone}">${req.phone}</a></span>` : ''}
                  ${req.approvedBy ? `<span><i class="fa-solid fa-user-check"></i> ពិនិត្យដោយ៖ ${req.approvedBy}</span>` : ''}
                </div>
              </div>

              <!-- Action Buttons -->
              <div style="display: flex; gap: 8px;">
                ${isPending ? `
                  <button type="button" class="btn-primary" style="background: #10b981; border-color: #10b981; padding: 6px 14px; font-size: 0.84rem;" onclick="AttendanceView.handleApproveLeave('${req.id}')">
                    <i class="fa-solid fa-check"></i> យល់ព្រម (Approve)
                  </button>
                  <button type="button" class="btn-outline-danger" style="padding: 6px 14px; font-size: 0.84rem;" onclick="AttendanceView.handleRejectLeave('${req.id}')">
                    <i class="fa-solid fa-xmark"></i> បដិសេធ (Reject)
                  </button>
                ` : `
                  <span style="font-size: 0.82rem; color: var(--text-muted); font-weight: 600;">
                    ${isApproved ? '✅ បានកត់ត្រា "ច្បាប់" រួចរាល់' : '❌ បានបដិសេធ'}
                  </span>
                `}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  },

  async handleApproveLeave(reqId) {
    if (typeof StudentAPI === "undefined") return;
    try {
      const updated = await StudentAPI.updateLeaveRequestStatus(reqId, "approved", "លោកគ្រូ ខៀន ធូ");
      if (updated) {
        App.showToast(`🎉 បានយល់ព្រមច្បាប់ឈប់របស់សិស្ស ${updated.studentNameKh} និងគ្រីសវត្តមាន "P" ជោគជ័យ!`, "success");
        App.triggerConfetti();
        this.renderLeaveRequestsList("all");
        this.renderTable();
      }
    } catch (err) {
      App.showToast("កំហុសក្នុងការយល់ព្រមច្បាប់: " + err.message, "error");
    }
  },

  async handleRejectLeave(reqId) {
    if (typeof StudentAPI === "undefined") return;
    try {
      const updated = await StudentAPI.updateLeaveRequestStatus(reqId, "rejected", "លោកគ្រូ ខៀន ធូ");
      if (updated) {
        App.showToast(`បានបដិសេធច្បាប់ឈប់របស់សិស្ស ${updated.studentNameKh}`, "info");
        this.renderLeaveRequestsList("all");
      }
    } catch (err) {
      App.showToast("កំហុស: " + err.message, "error");
    }
  }
};
