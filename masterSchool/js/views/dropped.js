/**
 * View: Dropped Out Students (បញ្ជីសិស្សបោះបង់ការសិក្សា & ចាក់សោរ ID ប្រើលែងកើត)
 */
const DroppedStudentsView = {
  searchQuery: "",
  filters: {
    course: "",
    reason: "",
    gender: ""
  },
  pagination: {
    page: 1,
    limit: 10
  },

  render() {
    return `
      <section id="view-dropped" class="page-view">
        <!-- Header & Action Bar -->
        <div class="card" style="margin-bottom: 18px; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; border-left: 4px solid #ef4444;">
          <div>
            <h2 style="font-size: 1.3rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 10px; margin: 0 0 4px 0;">
              <i class="fa-solid fa-user-xmark" style="color: #ef4444;"></i>
              <span>បញ្ជីសិស្សបោះបង់ការសិក្សា (Dropped Students)</span>
              <span id="droppedCountBadge" class="badge" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; font-size: 0.82rem; padding: 4px 12px; border-radius: 20px; font-weight: 700;">0 នាក់</span>
            </h2>
            <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted);">
              គ្រប់គ្រងសិស្សដែលបានបោះបង់ — <strong style="color: #ef4444;"><i class="fa-solid fa-lock"></i> រាល់អត្តលេខ (ID) ក្នុងបញ្ជីនេះ ត្រូវបានចាក់សោរ និងប្រើប្រាស់លែងកើត</strong> (មិនអាចស្កេនវត្តមាន ឬ Login បានឡើយ)
            </p>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button type="button" id="openMarkDropoutModalBtn" class="btn-primary" style="background: #ef4444; border-color: #ef4444; padding: 10px 20px; font-size: 0.92rem; box-shadow: 0 4px 14px rgba(239, 68, 68, 0.35); border-radius: var(--border-radius); font-weight: 600;">
              <i class="fa-solid fa-user-slash"></i>
              <span>+ កត់ត្រាសិស្សបោះបង់ (Mark Dropout)</span>
            </button>
          </div>
        </div>

        <!-- KPI Summary Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin-bottom: 18px;">
          <div class="kpi-card" style="border-top: 3px solid #ef4444;">
            <div class="kpi-content">
              <span class="kpi-label">សិស្សបោះបង់សរុប</span>
              <div class="kpi-value" id="kpiDroppedTotal" style="color: #ef4444;">0</div>
              <span class="kpi-trend" style="color: var(--text-muted); font-size: 0.78rem;">សិស្សទាំងអស់ដែលបានបោះបង់</span>
            </div>
            <div class="kpi-icon" style="background: rgba(239, 68, 68, 0.12); color: #ef4444;">
              <i class="fa-solid fa-user-xmark"></i>
            </div>
          </div>

          <div class="kpi-card" style="border-top: 3px solid #3b82f6;">
            <div class="kpi-content">
              <span class="kpi-label">សិស្សប្រុសបោះបង់</span>
              <div class="kpi-value" id="kpiDroppedMale" style="color: #3b82f6;">0</div>
              <span class="kpi-trend" style="color: var(--text-muted); font-size: 0.78rem;">ភេទប្រុស</span>
            </div>
            <div class="kpi-icon" style="background: rgba(59, 130, 246, 0.12); color: #3b82f6;">
              <i class="fa-solid fa-mars"></i>
            </div>
          </div>

          <div class="kpi-card" style="border-top: 3px solid #ec4899;">
            <div class="kpi-content">
              <span class="kpi-label">សិស្សស្រីបោះបង់</span>
              <div class="kpi-value" id="kpiDroppedFemale" style="color: #ec4899;">0</div>
              <span class="kpi-trend" style="color: var(--text-muted); font-size: 0.78rem;">ភេទស្រី</span>
            </div>
            <div class="kpi-icon" style="background: rgba(236, 72, 153, 0.12); color: #ec4899;">
              <i class="fa-solid fa-venus"></i>
            </div>
          </div>

          <div class="kpi-card" style="border-top: 3px solid #f59e0b;">
            <div class="kpi-content">
              <span class="kpi-label">ស្ថានភាព ID</span>
              <div class="kpi-value" id="kpiDroppedLockedRate" style="color: #ef4444; font-size: 1.25rem;">🔒 ចាក់សោរ</div>
              <span class="kpi-trend" style="color: #ef4444; font-weight: 600; font-size: 0.78rem;">⛔ ប្រើលែងកើត 100%</span>
            </div>
            <div class="kpi-icon" style="background: rgba(239, 68, 68, 0.12); color: #ef4444;">
              <i class="fa-solid fa-lock"></i>
            </div>
          </div>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="filter-bar">
          <div class="search-box-wrapper">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="droppedSearchInput" class="search-input" placeholder="ស្វែងរកតាមឈ្មោះ, អត្តលេខ, មូលហេតុ, ឬទូរស័ព្ទ...">
          </div>

          <div class="filter-controls-group">
            <select id="droppedFilterCourse" class="filter-select">
              <option value="">-- គ្រប់វគ្គសិក្សា --</option>
              ${APP_CONFIG.computerCourses.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
            </select>

            <select id="droppedFilterGender" class="filter-select">
              <option value="">-- ភេទទាំងអស់ --</option>
              <option value="ប្រុស">ប្រុស</option>
              <option value="ស្រី">ស្រី</option>
            </select>

            <select id="droppedFilterReason" class="filter-select">
              <option value="">-- គ្រប់មូលហេតុ --</option>
              <option value="ជាប់រវល់ការងារ">ជាប់រវល់ការងារ</option>
              <option value="ប្តូរទីលំនៅ">ប្តូរទីលំនៅ / ផ្លាស់ទៅខេត្ត</option>
              <option value="បញ្ហាគ្រួសារ">បញ្ហាគ្រួសារ</option>
              <option value="គ្មានលទ្ធភាពបង់ថ្លៃ">គ្មានលទ្ធភាពបង់ថ្លៃសិក្សា</option>
              <option value="តាមមិនទាន់មេរៀន">តាមមិនទាន់មេរៀន</option>
              <option value="ផ្សេងៗ">ផ្សេងៗ</option>
            </select>

            <button type="button" id="droppedClearFilterBtn" class="btn-secondary" title="ជម្រះតម្រង">
              <i class="fa-solid fa-filter-circle-xmark"></i>
            </button>

            <button type="button" id="droppedExportCsvBtn" class="btn-secondary" title="ទាញយកជា Excel/CSV">
              <i class="fa-solid fa-file-excel" style="color: #10b981;"></i>
              <span>Export CSV</span>
            </button>

            <button type="button" id="droppedPrintBtn" class="btn-secondary" title="បោះពុម្ពបញ្ជីសិស្សបោះបង់">
              <i class="fa-solid fa-print"></i>
              <span>Print</span>
            </button>
          </div>
        </div>

        <!-- Dropped Students Data Table -->
        <div class="card" style="padding: 0; overflow: hidden;">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 50px; text-align: center;">ល.រ</th>
                  <th style="width: 130px;">អត្តលេខ (ID)</th>
                  <th>ឈ្មោះសិស្ស</th>
                  <th>ភេទ</th>
                  <th>វគ្គសិក្សា & វេន</th>
                  <th>ថ្ងៃបោះបង់</th>
                  <th>មូលហេតុ & ចំណាំ</th>
                  <th style="text-align: center; width: 140px;">ស្ថានភាព ID</th>
                  <th style="text-align: center; width: 150px;">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody id="droppedTableBody">
                <!-- Dynamic rows rendered here -->
              </tbody>
            </table>
          </div>

          <!-- Table Pagination & Footer -->
          <div class="table-footer-bar">
            <div id="droppedCountDisplay">បង្ហាញ 0-0 ក្នុងចំណោម 0 នាក់</div>
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span>ជួរក្នុងមួយទំព័រ:</span>
                <select id="droppedPageLimitSelect" class="filter-select" style="height: 32px; padding: 0 8px;">
                  <option value="5">5</option>
                  <option value="10" selected>10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
              <div id="droppedPaginationControls" class="pagination-wrapper"></div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  initEvents() {
    const openBtn = document.getElementById("openMarkDropoutModalBtn");
    if (openBtn) {
      openBtn.addEventListener("click", () => {
        this.openMarkDropoutModal();
      });
    }

    const searchInput = document.getElementById("droppedSearchInput");
    let searchTimeout = null;
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.searchQuery = e.target.value.trim().toLowerCase();
          this.pagination.page = 1;
          this.renderTable();
        }, 250);
      });
    }

    const courseFilter = document.getElementById("droppedFilterCourse");
    const genderFilter = document.getElementById("droppedFilterGender");
    const reasonFilter = document.getElementById("droppedFilterReason");

    [courseFilter, genderFilter, reasonFilter].forEach(el => {
      if (el) {
        el.addEventListener("change", () => {
          this.filters.course = courseFilter ? courseFilter.value : "";
          this.filters.gender = genderFilter ? genderFilter.value : "";
          this.filters.reason = reasonFilter ? reasonFilter.value : "";
          this.pagination.page = 1;
          this.renderTable();
        });
      }
    });

    const clearBtn = document.getElementById("droppedClearFilterBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (searchInput) searchInput.value = "";
        if (courseFilter) courseFilter.value = "";
        if (genderFilter) genderFilter.value = "";
        if (reasonFilter) reasonFilter.value = "";
        this.searchQuery = "";
        this.filters = { course: "", reason: "", gender: "" };
        this.pagination.page = 1;
        this.renderTable();
        App.showToast("បានជម្រះតម្រងស្វែងរក", "info");
      });
    }

    const limitSelect = document.getElementById("droppedPageLimitSelect");
    if (limitSelect) {
      limitSelect.addEventListener("change", (e) => {
        this.pagination.limit = parseInt(e.target.value, 10);
        this.pagination.page = 1;
        this.renderTable();
      });
    }

    const exportBtn = document.getElementById("droppedExportCsvBtn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => this.exportCsv());
    }

    const printBtn = document.getElementById("droppedPrintBtn");
    if (printBtn) {
      printBtn.addEventListener("click", () => this.printReport());
    }
  },

  getDroppedStudents() {
    const all = (App && App.state && App.state.students) ? App.state.students : [];
    return all.filter(s => {
      const isStatusDropped = (s.Status === "Dropped" || s.Status === "Drop");
      const isIdBlocked = (s.isBlocked === true);
      const isRegisteredBlocked = (typeof StudentAPI !== "undefined" && StudentAPI.isStudentIdBlocked) ? StudentAPI.isStudentIdBlocked(s.ID) : false;
      return isStatusDropped || isIdBlocked || isRegisteredBlocked;
    });
  },

  getFilteredStudents() {
    let list = this.getDroppedStudents();

    if (this.searchQuery) {
      const q = this.searchQuery;
      list = list.filter(s => {
        const id = (s.ID || "").toLowerCase();
        const kh = (s.NameKh || "").toLowerCase();
        const en = (s.NameEn || "").toLowerCase();
        const phone = (s.Phone || "").toLowerCase();
        const reason = (s.DropReason || "").toLowerCase();
        const note = (s.DropNote || "").toLowerCase();
        return id.includes(q) || kh.includes(q) || en.includes(q) || phone.includes(q) || reason.includes(q) || note.includes(q);
      });
    }

    if (this.filters.course) {
      list = list.filter(s => (s.Course || "") === this.filters.course);
    }
    if (this.filters.gender) {
      list = list.filter(s => (s.Gender || "") === this.filters.gender);
    }
    if (this.filters.reason) {
      list = list.filter(s => (s.DropReason || "").includes(this.filters.reason));
    }

    return list;
  },

  renderTable() {
    const tbody = document.getElementById("droppedTableBody");
    if (!tbody) return;

    this.updateKpiCounters();

    const filtered = this.getFilteredStudents();
    const total = filtered.length;
    const { page, limit } = this.pagination;
    const totalPages = Math.ceil(total / limit) || 1;
    const currentPage = Math.min(page, totalPages);
    this.pagination.page = currentPage;

    const startIndex = (currentPage - 1) * limit;
    const pageData = filtered.slice(startIndex, startIndex + limit);

    const countDisplay = document.getElementById("droppedCountDisplay");
    if (countDisplay) {
      countDisplay.textContent = `បង្ហាញ ${total > 0 ? startIndex + 1 : 0}-${Math.min(startIndex + limit, total)} ក្នុងចំណោម ${total} នាក់`;
    }
    const countBadge = document.getElementById("droppedCountBadge");
    if (countBadge) {
      countBadge.textContent = `${total} នាក់`;
    }

    // Also update sidebar counter
    const sidebarCount = document.getElementById("sidebarDroppedCount");
    if (sidebarCount) {
      sidebarCount.textContent = `${this.getDroppedStudents().length}`;
    }

    if (pageData.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="empty-state-cell" style="padding: 40px 20px; text-align: center;">
            <i class="fa-solid fa-user-check text-muted" style="font-size: 2.5rem; margin-bottom: 12px; display: block; color: #10b981;"></i>
            <p class="font-bold">មិនមានទិន្នន័យសិស្សបោះបង់ការសិក្សាឡើយ</p>
            <span class="text-sm text-muted">ប្រសិនបើមានសិស្សបោះបង់ អ្នកអាចចុចប៊ូតុង "+ កត់ត្រាសិស្សបោះបង់" ខាងលើ</span>
          </td>
        </tr>
      `;
      this.renderPagination(0, 1);
      return;
    }

    tbody.innerHTML = pageData.map((s, idx) => `
      <tr class="table-row-item">
        <td class="text-center font-semibold text-muted">${startIndex + idx + 1}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span class="badge font-mono" style="background: rgba(239, 68, 68, 0.12); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); font-weight: 700;">
              ${App.escapeHtml(s.ID)}
            </span>
            <i class="fa-solid fa-lock" style="color: #ef4444; font-size: 0.85rem;" title="ID ត្រូវបានចាក់សោរ"></i>
          </div>
        </td>
        <td>
          <div class="user-badge">
            <img src="${s.Avatar || App.getDefaultAvatar(s.Gender)}" alt="${s.NameKh}" class="avatar-sm" style="filter: grayscale(40%);" onerror="this.src='${App.getDefaultAvatar(s.Gender)}'">
            <div>
              <div class="font-bold student-name-link" onclick="App.viewStudentDetails('${s.ID}')" style="color: var(--text-main);">
                ${App.escapeHtml(s.NameKh)}
              </div>
              <div class="text-xs text-muted font-sans">${App.escapeHtml(s.NameEn || '')}</div>
            </div>
          </div>
        </td>
        <td>
          <span class="gender-tag gender-${s.Gender === 'ប្រុស' ? 'male' : 'female'}">
            <i class="fa-solid fa-${s.Gender === 'ប្រុស' ? 'mars' : 'venus'}"></i>
            ${App.escapeHtml(s.Gender)}
          </span>
        </td>
        <td>
          <span class="badge-course ${App.getCourseBadgeClass(s.Course || 'Typing')}">
            ${App.getCourseIcon(s.Course || 'Typing')} ${App.escapeHtml(s.Course || 'Typing')}
          </span>
          <div class="text-xs text-muted" style="margin-top: 2px;">
            ${App.getShiftLabel ? App.getShiftLabel(s.Shift) : (s.Shift || 'វេន')}
          </div>
        </td>
        <td>
          <div style="font-size: 0.85rem; font-weight: 600; color: #ef4444;">
            <i class="fa-regular fa-calendar-xmark"></i> ${s.DropDate || s.UpdatedAt || '—'}
          </div>
        </td>
        <td>
          <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-main);">
            ${App.escapeHtml(s.DropReason || 'បោះបង់ការសិក្សា')}
          </div>
          ${s.DropNote ? `<div class="text-xs text-muted" style="margin-top: 2px; font-style: italic;">ចំណាំ: ${App.escapeHtml(s.DropNote)}</div>` : ''}
        </td>
        <td class="text-center">
          <span class="status-indicator" style="background: rgba(239, 68, 68, 0.12); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); font-weight: 700; padding: 4px 8px; border-radius: 6px; font-size: 0.78rem; display: inline-flex; align-items: center; gap: 4px;">
            <i class="fa-solid fa-lock"></i> ប្រើលែងកើត
          </span>
        </td>
        <td class="text-center actions-cell">
          <div class="action-buttons-group" style="justify-content: center;">
            <button type="button" class="btn-action" onclick="DroppedStudentsView.confirmReactivate('${s.ID}')" title="ស្តារសិស្សចូលរៀនវិញ (បើកសោរ ID)" style="background: rgba(16, 185, 129, 0.12); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); width: 32px; height: 32px; border-radius: 6px;">
              <i class="fa-solid fa-rotate-left"></i>
            </button>
            <button type="button" class="btn-action btn-view" onclick="App.viewStudentDetails('${s.ID}')" title="មើលព័ត៌មានលម្អិត">
              <i class="fa-solid fa-id-card"></i>
            </button>
            <button type="button" class="btn-action btn-delete" onclick="App.confirmDeleteStudent('${s.ID}')" title="លុបទិន្នន័យ">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    this.renderPagination(total, totalPages);
  },

  renderPagination(total, totalPages) {
    const container = document.getElementById("droppedPaginationControls");
    if (!container) return;

    if (total === 0 || totalPages <= 1) {
      container.innerHTML = "";
      return;
    }

    const { page } = this.pagination;
    let html = `
      <button type="button" class="page-btn" ${page <= 1 ? 'disabled' : ''} onclick="DroppedStudentsView.goToPage(${page - 1})">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        html += `
          <button type="button" class="page-btn ${i === page ? 'active' : ''}" onclick="DroppedStudentsView.goToPage(${i})">
            ${i}
          </button>
        `;
      } else if (i === page - 2 || i === page + 2) {
        html += `<span class="page-dots">...</span>`;
      }
    }

    html += `
      <button type="button" class="page-btn" ${page >= totalPages ? 'disabled' : ''} onclick="DroppedStudentsView.goToPage(${page + 1})">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    `;

    container.innerHTML = html;
  },

  goToPage(p) {
    this.pagination.page = p;
    this.renderTable();
  },

  updateKpiCounters() {
    const allDropped = this.getDroppedStudents();
    const total = allDropped.length;
    const males = allDropped.filter(s => s.Gender === "ប្រុស").length;
    const females = allDropped.filter(s => s.Gender === "ស្រី").length;

    const elTotal = document.getElementById("kpiDroppedTotal");
    const elMale = document.getElementById("kpiDroppedMale");
    const elFemale = document.getElementById("kpiDroppedFemale");

    if (elTotal) elTotal.textContent = total;
    if (elMale) elMale.textContent = males;
    if (elFemale) elFemale.textContent = females;
  },

  // Open the dedicated Mark Dropout Modal
  openMarkDropoutModal(preselectedId = null) {
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.open) {
      const modal = document.getElementById("markDropoutModal");
      if (!modal) {
        App.showToast("ផ្ទាំងកត់ត្រាសិស្សបោះបង់មិនទាន់បានបង្កើតឡើយ!", "error");
        return;
      }

      // Populate student select dropdown with active students
      const select = document.getElementById("dropoutSelectStudent");
      if (select) {
        const activeStudents = (App.state.students || []).filter(s => s.Status !== "Dropped" && !s.isBlocked);
        select.innerHTML = `<option value="">-- ជ្រើសរើសសិស្សដែលបោះបង់ --</option>` +
          activeStudents.map(s => `
            <option value="${s.ID}" ${preselectedId === s.ID ? 'selected' : ''}>
              ${s.ID} - ${s.NameKh} (${s.Course || 'វគ្គសិក្សា'})
            </option>
          `).join('');
      }

      // Set default drop date to today
      const dateInput = document.getElementById("dropoutDate");
      if (dateInput) {
        dateInput.value = new Date().toISOString().split("T")[0];
      }

      const reasonSelect = document.getElementById("dropoutReason");
      if (reasonSelect) reasonSelect.value = "ជាប់រវល់ការងារ";

      const noteInput = document.getElementById("dropoutNote");
      if (noteInput) noteInput.value = "";

      // Trigger student change to show details
      if (preselectedId) {
        this.onStudentSelectChanged(preselectedId);
      } else {
        const preview = document.getElementById("dropoutStudentPreview");
        if (preview) preview.style.display = "none";
      }

      ModalsComponent.open("markDropoutModal");
    }
  },

  onStudentSelectChanged(studentId) {
    const preview = document.getElementById("dropoutStudentPreview");
    if (!preview) return;

    if (!studentId) {
      preview.style.display = "none";
      return;
    }

    const student = (App.state.students || []).find(s => s.ID === studentId);
    if (!student) {
      preview.style.display = "none";
      return;
    }

    preview.style.display = "flex";
    preview.innerHTML = `
      <img src="${student.Avatar || App.getDefaultAvatar(student.Gender)}" class="avatar-sm" onerror="this.src='${App.getDefaultAvatar(student.Gender)}'">
      <div>
        <strong style="color: var(--text-main); font-size: 0.95rem;">${student.NameKh} (${student.NameEn || ''})</strong>
        <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; gap: 8px; margin-top: 2px;">
          <span>អត្តលេខ: <strong class="font-mono text-primary">${student.ID}</strong></span>
          <span>•</span>
          <span>វគ្គ: <strong>${student.Course || '—'}</strong></span>
          <span>•</span>
          <span>ទូរស័ព្ទ: <strong>${student.Phone || '—'}</strong></span>
        </div>
      </div>
    `;
  },

  async handleDropoutSubmit() {
    const select = document.getElementById("dropoutSelectStudent");
    const studentId = select ? select.value : "";
    if (!studentId) {
      App.showToast("សូមជ្រើសរើសសិស្សដែលបោះបង់ការសិក្សា!", "warning");
      return;
    }

    const dateInput = document.getElementById("dropoutDate");
    const dropDate = (dateInput && dateInput.value) ? dateInput.value : new Date().toISOString().split("T")[0];

    const reasonSelect = document.getElementById("dropoutReason");
    const dropReason = reasonSelect ? reasonSelect.value : "បោះបង់ការសិក្សា";

    const noteInput = document.getElementById("dropoutNote");
    const dropNote = noteInput ? noteInput.value.trim() : "";

    const student = (App.state.students || []).find(s => s.ID === studentId);
    const name = student ? student.NameKh : studentId;

    const confirmed = confirm(
      `⚠️ តើលោកគ្រូ/អ្នកគ្រូ ពិតជាចង់កំណត់សិស្ស "${name}" (អត្តលេខ ${studentId}) ជា "សិស្សបោះបង់ការសិក្សា" មែនទេ?\n\n` +
      `ចំណាំសំខាន់: អត្តលេខ (ID) របស់សិស្សនឹងត្រូវចាក់សោរជាអចិន្ត្រៃយ៍ ប្រើប្រាស់លែងកើត (មិនអាចស្កេនវត្តមាន ឬ Login បានឡើយ)!`
    );

    if (!confirmed) return;

    App.showLoader(true);
    try {
      await StudentAPI.markStudentDropped(studentId, {
        DropDate: dropDate,
        DropReason: dropReason,
        DropNote: dropNote
      });

      if (typeof ModalsComponent !== "undefined") {
        ModalsComponent.close("markDropoutModal");
        ModalsComponent.close("studentDetailsModal");
      }

      await App.loadData(false);
      App.showToast(`✅ បានកត់ត្រាសិស្ស ${name} ជាសិស្សបោះបង់ និងចាក់សោរ ID រួចរាល់!`, "success");
      this.renderTable();
    } catch (err) {
      App.showToast("កំហុសក្នុងការកត់ត្រា: " + err.message, "error");
    } finally {
      App.showLoader(false);
    }
  },

  async confirmReactivate(studentId) {
    const student = (App.state.students || []).find(s => s.ID === studentId);
    const name = student ? student.NameKh : studentId;

    const confirmed = confirm(
      `🔄 តើលោកគ្រូ/អ្នកគ្រូ ពិតជាចង់ "ស្តារចូលរៀនវិញ" សម្រាប់សិស្ស "${name}" (អត្តលេខ ${studentId}) មែនទេ?\n\n` +
      `អត្តលេខ (ID) របស់សិស្សនឹងត្រូវបានបើកសោរវិញ ហើយអាចស្កេនវត្តមាន និង Login ចូលប្រព័ន្ធបានឡើងវិញធម្មតា។`
    );

    if (!confirmed) return;

    App.showLoader(true);
    try {
      await StudentAPI.reactivateStudent(studentId);
      await App.loadData(false);
      App.showToast(`✅ បានស្តារសិស្ស ${name} ចូលរៀនវិញ និងបើកសោរ ID ជោគជ័យ!`, "success");
      this.renderTable();
    } catch (err) {
      App.showToast("កំហុសក្នុងការស្តារសិស្ស: " + err.message, "error");
    } finally {
      App.showLoader(false);
    }
  },

  exportCsv() {
    const list = this.getFilteredStudents();
    if (list.length === 0) {
      App.showToast("មិនមានទិន្នន័យដើម្បី Export ឡើយ!", "warning");
      return;
    }

    const headers = ["ID", "ឈ្មោះខ្មែរ", "ឈ្មោះឡាតាំង", "ភេទ", "វគ្គសិក្សា", "វេន", "ទូរស័ព្ទ", "ថ្ងៃបោះបង់", "មូលហេតុ", "ចំណាំ", "ស្ថានភាព ID"];
    const rows = list.map((s, i) => [
      s.ID,
      `"${(s.NameKh || '').replace(/"/g, '""')}"`,
      `"${(s.NameEn || '').replace(/"/g, '""')}"`,
      s.Gender || '',
      `"${(s.Course || '').replace(/"/g, '""')}"`,
      `"${(s.Shift || '').replace(/"/g, '""')}"`,
      s.Phone || s.GuardianPhone || '',
      s.DropDate || '',
      `"${(s.DropReason || '').replace(/"/g, '""')}"`,
      `"${(s.DropNote || '').replace(/"/g, '""')}"`,
      "🔒 ចាក់សោរ (ប្រើលែងកើត)"
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `MasterSchool_Dropped_Students_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    App.showToast(`បានទាញយក CSV សិស្សបោះបង់ ${list.length} នាក់ជោគជ័យ!`, "success");
  },

  printReport() {
    const list = this.getFilteredStudents();
    if (list.length === 0) {
      App.showToast("មិនមានទិន្នន័យដើម្បីបោះពុម្ពឡើយ!", "warning");
      return;
    }

    const printWin = window.open("", "_blank");
    if (!printWin) {
      App.showToast("សូមអនុញ្ញាត Popup Browser ដើម្បីបោះពុម្ព!", "warning");
      return;
    }

    const nowStr = new Date().toLocaleDateString("km-KH", { year: "numeric", month: "long", day: "numeric" });
    const tableRows = list.map((s, i) => `
      <tr>
        <td style="text-align: center; border: 1px solid #333; padding: 6px;">${i + 1}</td>
        <td style="text-align: center; border: 1px solid #333; padding: 6px; font-weight: bold; color: #b91c1c;">${s.ID}</td>
        <td style="border: 1px solid #333; padding: 6px; font-weight: bold;">${s.NameKh}</td>
        <td style="text-align: center; border: 1px solid #333; padding: 6px;">${s.Gender}</td>
        <td style="border: 1px solid #333; padding: 6px;">${s.Course || '—'}</td>
        <td style="text-align: center; border: 1px solid #333; padding: 6px; color: #b91c1c;">${s.DropDate || '—'}</td>
        <td style="border: 1px solid #333; padding: 6px;">${s.DropReason || '—'} ${s.DropNote ? `(${s.DropNote})` : ''}</td>
        <td style="text-align: center; border: 1px solid #333; padding: 6px; font-weight: bold; color: #b91c1c;">🔒 ប្រើលែងកើត</td>
      </tr>
    `).join('');

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>របាយការណ៍សិស្សបោះបង់ការសិក្សា - MasterSchool</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700&display=swap');
          body { font-family: 'Kantumruy Pro', sans-serif; margin: 30px; color: #000; }
          .header { text-align: center; margin-bottom: 24px; }
          .header h2 { margin: 0; font-size: 20px; color: #b91c1c; }
          .header p { margin: 4px 0 0 0; font-size: 13px; color: #555; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 16px; }
          th { background: #fee2e2; border: 1px solid #333; padding: 8px; color: #991b1b; }
          .footer { margin-top: 30px; display: flex; justify-content: space-between; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>របាយការណ៍សិស្សបោះបង់ការសិក្សា (Dropped Students Report)</h2>
          <p>ប្រព័ន្ធគ្រប់គ្រងសាលា MasterSchool • បញ្ជីអត្តលេខ (ID) ចាក់សោរប្រើប្រាស់លែងកើត</p>
          <p>កាលបរិច្ឆេទបោះពុម្ព: ${nowStr} • សរុប: ${list.length} នាក់</p>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 40px;">ល.រ</th>
              <th style="width: 90px;">អត្តលេខ</th>
              <th>ឈ្មោះសិស្ស</th>
              <th style="width: 50px;">ភេទ</th>
              <th>វគ្គសិក្សា</th>
              <th style="width: 90px;">ថ្ងៃបោះបង់</th>
              <th>មូលហេតុ & ចំណាំ</th>
              <th style="width: 100px;">ស្ថានភាព ID</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <div class="footer">
          <div>អ្នករៀបចំរបាយការណ៍: .................................</div>
          <div>បានឃើញ និងឯកភាព: .................................</div>
        </div>
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
      </html>
    `);
    printWin.document.close();
  }
};
