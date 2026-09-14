/**
 * View: Graduated Students (បញ្ជីសិស្សបញ្ចប់ការសិក្សា & អតីតសិស្ស Alumni)
 */
const GraduatedStudentsView = {
  searchQuery: "",
  filters: {
    course: "",
    grade: "",
    gender: ""
  },
  pagination: {
    page: 1,
    limit: 10
  },

  render() {
    return `
      <section id="view-graduated" class="page-view">
        <!-- Header & Action Bar -->
        <div class="card" style="margin-bottom: 18px; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; border-left: 4px solid #10b981;">
          <div>
            <h2 style="font-size: 1.3rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 10px; margin: 0 0 4px 0;">
              <i class="fa-solid fa-user-graduate" style="color: #10b981;"></i>
              <span>បញ្ជីសិស្សបញ្ចប់ការសិក្សា (Graduated Alumni)</span>
              <span id="graduatedCountBadge" class="badge" style="background: rgba(16, 185, 129, 0.15); color: #10b981; font-size: 0.82rem; padding: 4px 12px; border-radius: 20px; font-weight: 700;">0 នាក់</span>
            </h2>
            <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted);">
              គ្រប់គ្រងសិស្សដែលបានបញ្ចប់ការសិក្សាដោយជោគជ័យ ចេញវិញ្ញាបនបត្រ និងរក្សាទុកប្រវត្តិអតីតសិស្ស (Alumni Network)
            </p>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button type="button" id="openMarkGraduateModalBtn" class="btn-primary" style="background: #10b981; border-color: #10b981; padding: 10px 20px; font-size: 0.92rem; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35); border-radius: var(--border-radius); font-weight: 600;">
              <i class="fa-solid fa-graduation-cap"></i>
              <span>+ កត់ត្រាសិស្សបញ្ចប់ (Mark Graduate)</span>
            </button>
          </div>
        </div>

        <!-- KPI Summary Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin-bottom: 18px;">
          <div class="kpi-card" style="border-top: 3px solid #10b981;">
            <div class="kpi-content">
              <span class="kpi-label">សិស្សបញ្ចប់សរុប</span>
              <div class="kpi-value" id="kpiGraduatedTotal" style="color: #10b981;">0</div>
              <span class="kpi-trend" style="color: var(--text-muted); font-size: 0.78rem;">អតីតសិស្សបានបញ្ចប់វគ្គ</span>
            </div>
            <div class="kpi-icon" style="background: rgba(16, 185, 129, 0.12); color: #10b981;">
              <i class="fa-solid fa-user-graduate"></i>
            </div>
          </div>

          <div class="kpi-card" style="border-top: 3px solid #3b82f6;">
            <div class="kpi-content">
              <span class="kpi-label">សិស្សប្រុសបញ្ចប់</span>
              <div class="kpi-value" id="kpiGraduatedMale" style="color: #3b82f6;">0</div>
              <span class="kpi-trend" style="color: var(--text-muted); font-size: 0.78rem;">ភេទប្រុស</span>
            </div>
            <div class="kpi-icon" style="background: rgba(59, 130, 246, 0.12); color: #3b82f6;">
              <i class="fa-solid fa-mars"></i>
            </div>
          </div>

          <div class="kpi-card" style="border-top: 3px solid #ec4899;">
            <div class="kpi-content">
              <span class="kpi-label">សិស្សស្រីបញ្ចប់</span>
              <div class="kpi-value" id="kpiGraduatedFemale" style="color: #ec4899;">0</div>
              <span class="kpi-trend" style="color: var(--text-muted); font-size: 0.78rem;">ភេទស្រី</span>
            </div>
            <div class="kpi-icon" style="background: rgba(236, 72, 153, 0.12); color: #ec4899;">
              <i class="fa-solid fa-venus"></i>
            </div>
          </div>

          <div class="kpi-card" style="border-top: 3px solid #f59e0b;">
            <div class="kpi-content">
              <span class="kpi-label">វិញ្ញាបនបត្របានចេញ</span>
              <div class="kpi-value" id="kpiGraduatedCerts" style="color: #f59e0b;">0</div>
              <span class="kpi-trend" style="color: #10b981; font-weight: 600; font-size: 0.78rem;">📜 វិញ្ញាបនបត្រឌីជីថល</span>
            </div>
            <div class="kpi-icon" style="background: rgba(245, 158, 11, 0.12); color: #f59e0b;">
              <i class="fa-solid fa-certificate"></i>
            </div>
          </div>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="filter-bar">
          <div class="search-box-wrapper">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="graduatedSearchInput" class="search-input" placeholder="ស្វែងរកតាមឈ្មោះ, អត្តលេខ, ឬទូរស័ព្ទ...">
          </div>

          <div class="filter-controls-group">
            <select id="graduatedFilterCourse" class="filter-select">
              <option value="">-- គ្រប់វគ្គសិក្សា --</option>
              ${APP_CONFIG.computerCourses.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
            </select>

            <select id="graduatedFilterGender" class="filter-select">
              <option value="">-- ភេទទាំងអស់ --</option>
              <option value="ប្រុស">ប្រុស</option>
              <option value="ស្រី">ស្រី</option>
            </select>

            <select id="graduatedFilterGrade" class="filter-select">
              <option value="">-- គ្រប់និទ្ទេស --</option>
              <option value="A">និទ្ទេស A (ល្អប្រសើរ)</option>
              <option value="B">និទ្ទេស B (ល្អណាស់)</option>
              <option value="C">និទ្ទេស C (ល្អ)</option>
              <option value="D">និទ្ទេស D (មធ្យម)</option>
            </select>

            <button type="button" id="graduatedClearFilterBtn" class="btn-secondary" title="ជម្រះតម្រង">
              <i class="fa-solid fa-filter-circle-xmark"></i>
            </button>

            <button type="button" id="graduatedExportCsvBtn" class="btn-secondary" title="ទាញយកជា Excel/CSV">
              <i class="fa-solid fa-file-excel" style="color: #10b981;"></i>
              <span>Export CSV</span>
            </button>

            <button type="button" id="graduatedPrintBtn" class="btn-secondary" title="បោះពុម្ពបញ្ជីសិស្សបញ្ចប់">
              <i class="fa-solid fa-print"></i>
              <span>Print</span>
            </button>
          </div>
        </div>

        <!-- Graduated Students Data Table -->
        <div class="card" style="padding: 0; overflow: hidden;">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 50px; text-align: center;">ល.រ</th>
                  <th style="width: 130px;">អត្តលេខ (ID)</th>
                  <th>ឈ្មោះសិស្ស</th>
                  <th>ភេទ</th>
                  <th>វគ្គសិក្សាដែលបានបញ្ចប់</th>
                  <th>ថ្ងៃបញ្ចប់ការសិក្សា</th>
                  <th style="text-align: center;">និទ្ទេស / លទ្ធផល</th>
                  <th style="text-align: center;">វិញ្ញាបនបត្រ</th>
                  <th style="text-align: center; width: 140px;">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody id="graduatedTableBody">
                <!-- Dynamic rows rendered here -->
              </tbody>
            </table>
          </div>

          <!-- Table Pagination & Footer -->
          <div class="table-footer-bar">
            <div id="graduatedCountDisplay">បង្ហាញ 0-0 ក្នុងចំណោម 0 នាក់</div>
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span>ជួរក្នុងមួយទំព័រ:</span>
                <select id="graduatedPageLimitSelect" class="filter-select" style="height: 32px; padding: 0 8px;">
                  <option value="5">5</option>
                  <option value="10" selected>10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
              <div id="graduatedPaginationControls" class="pagination-wrapper"></div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  initEvents() {
    const openBtn = document.getElementById("openMarkGraduateModalBtn");
    if (openBtn) {
      openBtn.addEventListener("click", () => {
        this.openMarkGraduateModal();
      });
    }

    const searchInput = document.getElementById("graduatedSearchInput");
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

    const courseFilter = document.getElementById("graduatedFilterCourse");
    const genderFilter = document.getElementById("graduatedFilterGender");
    const gradeFilter = document.getElementById("graduatedFilterGrade");

    [courseFilter, genderFilter, gradeFilter].forEach(el => {
      if (el) {
        el.addEventListener("change", () => {
          this.filters.course = courseFilter ? courseFilter.value : "";
          this.filters.gender = genderFilter ? genderFilter.value : "";
          this.filters.grade = gradeFilter ? gradeFilter.value : "";
          this.pagination.page = 1;
          this.renderTable();
        });
      }
    });

    const clearBtn = document.getElementById("graduatedClearFilterBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (searchInput) searchInput.value = "";
        if (courseFilter) courseFilter.value = "";
        if (genderFilter) genderFilter.value = "";
        if (gradeFilter) gradeFilter.value = "";
        this.searchQuery = "";
        this.filters = { course: "", grade: "", gender: "" };
        this.pagination.page = 1;
        this.renderTable();
        App.showToast("បានជម្រះតម្រងស្វែងរក", "info");
      });
    }

    const limitSelect = document.getElementById("graduatedPageLimitSelect");
    if (limitSelect) {
      limitSelect.addEventListener("change", (e) => {
        this.pagination.limit = parseInt(e.target.value, 10);
        this.pagination.page = 1;
        this.renderTable();
      });
    }

    const exportBtn = document.getElementById("graduatedExportCsvBtn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => this.exportCsv());
    }

    const printBtn = document.getElementById("graduatedPrintBtn");
    if (printBtn) {
      printBtn.addEventListener("click", () => this.printReport());
    }
  },

  getGraduatedStudents() {
    const all = (App && App.state && App.state.students) ? App.state.students : [];
    return all.filter(s => s.Status === "Graduated");
  },

  getFilteredStudents() {
    let list = this.getGraduatedStudents();

    if (this.searchQuery) {
      const q = this.searchQuery;
      list = list.filter(s => {
        const id = (s.ID || "").toLowerCase();
        const kh = (s.NameKh || "").toLowerCase();
        const en = (s.NameEn || "").toLowerCase();
        const phone = (s.Phone || "").toLowerCase();
        const course = (s.Course || "").toLowerCase();
        const cert = (s.CertificateId || "").toLowerCase();
        return id.includes(q) || kh.includes(q) || en.includes(q) || phone.includes(q) || course.includes(q) || cert.includes(q);
      });
    }

    if (this.filters.course) {
      list = list.filter(s => (s.Course || "") === this.filters.course);
    }
    if (this.filters.gender) {
      list = list.filter(s => (s.Gender || "") === this.filters.gender);
    }
    if (this.filters.grade) {
      list = list.filter(s => (s.FinalGrade || "").startsWith(this.filters.grade));
    }

    return list;
  },

  renderTable() {
    const tbody = document.getElementById("graduatedTableBody");
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

    const countDisplay = document.getElementById("graduatedCountDisplay");
    if (countDisplay) {
      countDisplay.textContent = `បង្ហាញ ${total > 0 ? startIndex + 1 : 0}-${Math.min(startIndex + limit, total)} ក្នុងចំណោម ${total} នាក់`;
    }
    const countBadge = document.getElementById("graduatedCountBadge");
    if (countBadge) {
      countBadge.textContent = `${total} នាក់`;
    }

    // Also update sidebar counter
    const sidebarCount = document.getElementById("sidebarGraduatedCount");
    if (sidebarCount) {
      sidebarCount.textContent = `${this.getGraduatedStudents().length}`;
    }

    if (pageData.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="empty-state-cell" style="padding: 40px 20px; text-align: center;">
            <i class="fa-solid fa-graduation-cap text-muted" style="font-size: 2.5rem; margin-bottom: 12px; display: block; color: #10b981;"></i>
            <p class="font-bold">មិនទាន់មានទិន្នន័យសិស្សបញ្ចប់ការសិក្សាឡើយ</p>
            <span class="text-sm text-muted">ចុចប៊ូតុង "+ កត់ត្រាសិស្សបញ្ចប់" ខាងលើដើម្បីកត់ត្រាសិស្សបញ្ចប់វគ្គ</span>
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
          <span class="badge font-mono" style="background: rgba(16, 185, 129, 0.12); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); font-weight: 700;">
            ${App.escapeHtml(s.ID)}
          </span>
        </td>
        <td>
          <div class="user-badge">
            <img src="${s.Avatar || App.getDefaultAvatar(s.Gender)}" alt="${s.NameKh}" class="avatar-sm" onerror="this.src='${App.getDefaultAvatar(s.Gender)}'">
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
        </td>
        <td>
          <div style="font-size: 0.85rem; font-weight: 600; color: #10b981;">
            <i class="fa-regular fa-calendar-check"></i> ${s.GraduateDate || s.UpdatedAt || '—'}
          </div>
        </td>
        <td class="text-center">
          <span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #d97706; font-weight: 700; padding: 4px 10px; border-radius: 6px; font-size: 0.82rem;">
            ${App.escapeHtml(s.FinalGrade || 'A (ល្អប្រសើរ)')}
          </span>
        </td>
        <td class="text-center">
          ${s.CertificateId ? `
            <button type="button" class="btn-action" onclick="App.viewCertificate('${s.CertificateId}', '${s.ID}')" style="background: rgba(245, 158, 11, 0.12); color: #d97706; padding: 4px 8px; border-radius: 6px; font-size: 0.78rem; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;" title="មើលវិញ្ញាបនបត្រ">
              <i class="fa-solid fa-certificate"></i> ${App.escapeHtml(s.CertificateId)}
            </button>
          ` : `
            <button type="button" class="btn-action" onclick="GraduatedStudentsView.issueCertificateForStudent('${s.ID}')" style="background: rgba(16, 185, 129, 0.12); color: #10b981; padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 600;" title="ចេញវិញ្ញាបនបត្រ">
              <i class="fa-solid fa-award"></i> ចេញប័ណ្ណ
            </button>
          `}
        </td>
        <td class="text-center actions-cell">
          <div class="action-buttons-group" style="justify-content: center;">
            <button type="button" class="btn-action" onclick="App.viewStudentDetails('${s.ID}')" title="មើលព័ត៌មានលម្អិត">
              <i class="fa-solid fa-id-card"></i>
            </button>
            <button type="button" class="btn-action" onclick="GraduatedStudentsView.printTranscript('${s.ID}')" title="ព្រឹត្តិបត្រពិន្ទុ" style="background: rgba(59, 130, 246, 0.12); color: #3b82f6;">
              <i class="fa-solid fa-file-invoice"></i>
            </button>
            <button type="button" class="btn-action" onclick="App.openEditModal('${s.ID}')" title="កែប្រែទិន្នន័យ">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    this.renderPagination(total, totalPages);
  },

  renderPagination(total, totalPages) {
    const container = document.getElementById("graduatedPaginationControls");
    if (!container) return;

    if (total === 0 || totalPages <= 1) {
      container.innerHTML = "";
      return;
    }

    const { page } = this.pagination;
    let html = `
      <button type="button" class="page-btn" ${page <= 1 ? 'disabled' : ''} onclick="GraduatedStudentsView.goToPage(${page - 1})">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        html += `
          <button type="button" class="page-btn ${i === page ? 'active' : ''}" onclick="GraduatedStudentsView.goToPage(${i})">
            ${i}
          </button>
        `;
      } else if (i === page - 2 || i === page + 2) {
        html += `<span class="page-dots">...</span>`;
      }
    }

    html += `
      <button type="button" class="page-btn" ${page >= totalPages ? 'disabled' : ''} onclick="GraduatedStudentsView.goToPage(${page + 1})">
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
    const allGraduated = this.getGraduatedStudents();
    const total = allGraduated.length;
    const males = allGraduated.filter(s => s.Gender === "ប្រុស").length;
    const females = allGraduated.filter(s => s.Gender === "ស្រី").length;
    const certsCount = allGraduated.filter(s => !!s.CertificateId).length;

    const elTotal = document.getElementById("kpiGraduatedTotal");
    const elMale = document.getElementById("kpiGraduatedMale");
    const elFemale = document.getElementById("kpiGraduatedFemale");
    const elCerts = document.getElementById("kpiGraduatedCerts");

    if (elTotal) elTotal.textContent = total;
    if (elMale) elMale.textContent = males;
    if (elFemale) elFemale.textContent = females;
    if (elCerts) elCerts.textContent = certsCount;
  },

  // Open the dedicated Mark Graduate Modal
  openMarkGraduateModal(preselectedId = null) {
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.open) {
      const modal = document.getElementById("markGraduateModal");
      if (!modal) {
        App.showToast("ផ្ទាំងកត់ត្រាសិស្សបញ្ចប់មិនទាន់បានបង្កើតឡើយ!", "error");
        return;
      }

      // Populate student select dropdown with active students
      const select = document.getElementById("graduateSelectStudent");
      if (select) {
        const activeStudents = (App.state.students || []).filter(s => s.Status !== "Graduated" && s.Status !== "Dropped" && !s.isBlocked);
        select.innerHTML = `<option value="">-- ជ្រើសរើសសិស្សដែលបញ្ចប់ការសិក្សា --</option>` +
          activeStudents.map(s => `
            <option value="${s.ID}" ${preselectedId === s.ID ? 'selected' : ''}>
              ${s.ID} - ${s.NameKh} (${s.Course || 'វគ្គសិក្សា'})
            </option>
          `).join('');
      }

      // Set default graduation date to today
      const dateInput = document.getElementById("graduateDate");
      if (dateInput) {
        dateInput.value = new Date().toISOString().split("T")[0];
      }

      const gradeSelect = document.getElementById("graduateFinalGrade");
      if (gradeSelect) gradeSelect.value = "A (ល្អប្រសើរ)";

      const certCheckbox = document.getElementById("graduateAutoIssueCert");
      if (certCheckbox) certCheckbox.checked = true;

      const noteInput = document.getElementById("graduateNote");
      if (noteInput) noteInput.value = "";

      if (preselectedId) {
        this.onStudentSelectChanged(preselectedId);
      } else {
        const preview = document.getElementById("graduateStudentPreview");
        if (preview) preview.style.display = "none";
      }

      ModalsComponent.open("markGraduateModal");
    }
  },

  onStudentSelectChanged(studentId) {
    const preview = document.getElementById("graduateStudentPreview");
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
          <span>វគ្គបញ្ចប់: <strong>${student.Course || '—'}</strong></span>
          <span>•</span>
          <span>ទូរស័ព្ទ: <strong>${student.Phone || '—'}</strong></span>
        </div>
      </div>
    `;
  },

  async handleGraduateSubmit() {
    const select = document.getElementById("graduateSelectStudent");
    const studentId = select ? select.value : "";
    if (!studentId) {
      App.showToast("សូមជ្រើសរើសសិស្សដែលបញ្ចប់ការសិក្សា!", "warning");
      return;
    }

    const dateInput = document.getElementById("graduateDate");
    const graduateDate = (dateInput && dateInput.value) ? dateInput.value : new Date().toISOString().split("T")[0];

    const gradeSelect = document.getElementById("graduateFinalGrade");
    const finalGrade = gradeSelect ? gradeSelect.value : "A (ល្អប្រសើរ)";

    const certCheckbox = document.getElementById("graduateAutoIssueCert");
    const autoIssueCert = certCheckbox ? certCheckbox.checked : true;

    const student = (App.state.students || []).find(s => s.ID === studentId);
    const name = student ? student.NameKh : studentId;

    let certId = student ? student.CertificateId : null;
    if (autoIssueCert && !certId) {
      certId = "CERT-" + Date.now().toString().slice(-6);
    }

    App.showLoader(true);
    try {
      await StudentAPI.markStudentGraduated(studentId, {
        GraduateDate: graduateDate,
        FinalGrade: finalGrade,
        CertificateId: certId
      });

      // If auto-issue cert is enabled, register into certificates storage
      if (autoIssueCert && certId && typeof CertificatesView !== "undefined") {
        try {
          const certRecord = {
            id: certId,
            studentId: studentId,
            studentNameKh: student.NameKh,
            studentNameEn: student.NameEn || "",
            course: student.Course || "Computer",
            issueDate: graduateDate,
            grade: finalGrade,
            status: "Issued",
            createdAt: new Date().toISOString()
          };
          if (StudentAPI.saveCertificateRecord) {
            await StudentAPI.saveCertificateRecord(certRecord);
          }
        } catch (e) {
          console.warn("Cert save notice:", e);
        }
      }

      if (typeof ModalsComponent !== "undefined") {
        ModalsComponent.close("markGraduateModal");
        ModalsComponent.close("studentDetailsModal");
      }

      await App.loadData(false);
      App.showToast(`🎉 អបអរសាទរ! បានកត់ត្រាសិស្ស ${name} បញ្ចប់ការសិក្សាដោយជោគជ័យ!`, "success");
      App.triggerConfetti();
      this.renderTable();
    } catch (err) {
      App.showToast("កំហុសក្នុងការកត់ត្រា: " + err.message, "error");
    } finally {
      App.showLoader(false);
    }
  },

  issueCertificateForStudent(studentId) {
    if (typeof CertificatesView !== "undefined" && CertificatesView.openIssueModal) {
      CertificatesView.openIssueModal(studentId);
    } else {
      App.showToast("សូមចូលទៅកាន់ផ្ទាំង 'វិញ្ញាបនបត្រ' ដើម្បីចេញប័ណ្ណ!", "info");
    }
  },

  printTranscript(studentId) {
    if (typeof ExamsView !== "undefined" && ExamsView.printStudentTranscript) {
      ExamsView.printStudentTranscript(studentId);
    } else {
      App.showToast("មិនអាចបើកព្រឹត្តិបត្រពិន្ទុបានទេ!", "error");
    }
  },

  exportCsv() {
    const list = this.getFilteredStudents();
    if (list.length === 0) {
      App.showToast("មិនមានទិន្នន័យដើម្បី Export ឡើយ!", "warning");
      return;
    }

    const headers = ["ID", "ឈ្មោះខ្មែរ", "ឈ្មោះឡាតាំង", "ភេទ", "វគ្គបញ្ចប់", "ថ្ងៃបញ្ចប់", "និទ្ទេស", "វិញ្ញាបនបត្រ", "ទូរស័ព្ទ"];
    const rows = list.map((s, i) => [
      s.ID,
      `"${(s.NameKh || '').replace(/"/g, '""')}"`,
      `"${(s.NameEn || '').replace(/"/g, '""')}"`,
      s.Gender || '',
      `"${(s.Course || '').replace(/"/g, '""')}"`,
      s.GraduateDate || '',
      `"${(s.FinalGrade || '').replace(/"/g, '""')}"`,
      s.CertificateId || '—',
      s.Phone || s.GuardianPhone || ''
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `MasterSchool_Graduated_Students_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    App.showToast(`បានទាញយក CSV សិស្សបញ្ចប់ ${list.length} នាក់ជោគជ័យ!`, "success");
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
        <td style="text-align: center; border: 1px solid #333; padding: 6px; font-weight: bold; color: #047857;">${s.ID}</td>
        <td style="border: 1px solid #333; padding: 6px; font-weight: bold;">${s.NameKh}</td>
        <td style="text-align: center; border: 1px solid #333; padding: 6px;">${s.Gender}</td>
        <td style="border: 1px solid #333; padding: 6px;">${s.Course || '—'}</td>
        <td style="text-align: center; border: 1px solid #333; padding: 6px; color: #047857;">${s.GraduateDate || '—'}</td>
        <td style="text-align: center; border: 1px solid #333; padding: 6px; font-weight: bold;">${s.FinalGrade || 'A'}</td>
        <td style="text-align: center; border: 1px solid #333; padding: 6px;">${s.CertificateId || '—'}</td>
      </tr>
    `).join('');

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>របាយការណ៍សិស្សបញ្ចប់ការសិក្សា - MasterSchool</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700&display=swap');
          body { font-family: 'Kantumruy Pro', sans-serif; margin: 30px; color: #000; }
          .header { text-align: center; margin-bottom: 24px; }
          .header h2 { margin: 0; font-size: 20px; color: #047857; }
          .header p { margin: 4px 0 0 0; font-size: 13px; color: #555; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 16px; }
          th { background: #d1fae5; border: 1px solid #333; padding: 8px; color: #065f46; }
          .footer { margin-top: 30px; display: flex; justify-content: space-between; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>របាយការណ៍សិស្សបញ្ចប់ការសិក្សា (Graduated Alumni Report)</h2>
          <p>ប្រព័ន្ធគ្រប់គ្រងសាលា MasterSchool • បញ្ជីអតីតសិស្សជោគជ័យ</p>
          <p>កាលបរិច្ឆេទបោះពុម្ព: ${nowStr} • សរុប: ${list.length} នាក់</p>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 40px;">ល.រ</th>
              <th style="width: 90px;">អត្តលេខ</th>
              <th>ឈ្មោះសិស្ស</th>
              <th style="width: 50px;">ភេទ</th>
              <th>វគ្គសិក្សាដែលបញ្ចប់</th>
              <th style="width: 90px;">ថ្ងៃបញ្ចប់</th>
              <th style="width: 80px;">និទ្ទេស</th>
              <th style="width: 100px;">វិញ្ញាបនបត្រ</th>
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
