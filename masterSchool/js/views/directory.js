/**
 * View: Student Directory & Data Viewer (Search, Filter, Table, Pagination)
 */
const DirectoryView = {
  render() {
    return `
      <section id="view-directory" class="page-view">
        <!-- Directory Header & Add Student Action Bar -->
        <div class="card" style="margin-bottom: 18px; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; border-left: 4px solid var(--primary);">
          <div>
            <h2 style="font-size: 1.3rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 10px; margin: 0 0 4px 0;">
              <i class="fa-solid fa-users" style="color: var(--primary);"></i>
              <span>បញ្ជីសិស្ស (Student List)</span>
              <span id="directoryStudentCountBadge" class="badge" style="background: var(--primary-light); color: var(--primary); font-size: 0.82rem; padding: 4px 12px; border-radius: 20px; font-weight: 700;">0 នាក់</span>
            </h2>
            <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted);">
              តារាងមើលឈ្មោះសិស្ស ស្វែងរកព័ត៌មាន និងចុចបើកផ្ទាំង Popup ដើម្បីបញ្ចូលសិស្សថ្មី
            </p>
          </div>
          <button type="button" id="openAddStudentModalBtn" class="btn-primary" style="padding: 10px 22px; font-size: 0.92rem; box-shadow: 0 4px 14px var(--primary-glow); border-radius: var(--border-radius); font-weight: 600;">
            <i class="fa-solid fa-user-plus"></i>
            <span>+ បញ្ចូលទិន្នន័យសិស្សថ្មី (Popup)</span>
          </button>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="filter-bar">
          <!-- Search Box -->
          <div class="search-box-wrapper">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="tableSearchInput" class="search-input" placeholder="ស្វែងរកតាមឈ្មោះ, អត្តលេខ, ឬទូរស័ព្ទ...">
          </div>

          <!-- Filter Controls -->
          <div class="filter-controls-group">
            <!-- Filter Course (Only Computer Courses) -->
            <select id="filterCourse" class="filter-select">
              <option value="">-- គ្រប់វគ្គសិក្សាកុំព្យូទ័រ --</option>
              ${APP_CONFIG.computerCourses.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
            </select>

            <!-- Filter Gender -->
            <select id="filterGender" class="filter-select">
              <option value="">-- ភេទទាំងអស់ --</option>
              <option value="ប្រុស">ប្រុស</option>
              <option value="ស្រី">ស្រី</option>
            </select>

            <!-- Filter Shift -->
            <select id="filterShift" class="filter-select">
              <option value="">-- គ្រប់វេន --</option>
              ${APP_CONFIG.shifts.map(s => `<option value="${s.id}">${s.label}</option>`).join('')}
            </select>

            <!-- Filter Status -->
            <select id="filterStatus" class="filter-select">
              <option value="">-- គ្រប់ស្ថានភាព --</option>
              <option value="Active">កំពុងសិក្សា</option>
              <option value="Inactive">ផ្អាក</option>
              <option value="Graduated">បញ្ចប់ការសិក្សា</option>
              <option value="Dropped">បោះបង់ (ID ចាក់សោរ)</option>
            </select>

            <!-- Clear Filter Button -->
            <button type="button" id="clearFilterBtn" class="btn-secondary" title="ជម្រះតម្រងទាំងអស់">
              <i class="fa-solid fa-filter-circle-xmark"></i>
            </button>

            <!-- Export CSV Button -->
            <button type="button" id="exportCsvBtn" class="btn-secondary" title="ទាញយកជា Excel/CSV">
              <i class="fa-solid fa-file-excel" style="color: #10b981;"></i>
              <span>Export CSV</span>
            </button>

            <!-- Import Excel/CSV Button -->
            <button type="button" id="importExcelBtn" class="btn-primary" style="height: 38px; padding: 0 16px; font-size: 0.85rem; background: #10b981; border-color: #10b981; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);" title="នាំចូលទិន្នន័យពី Excel/CSV">
              <i class="fa-solid fa-file-excel"></i>
              <span>Import Excel</span>
            </button>

            <!-- Print Table Button -->
            <button type="button" id="printTableBtn" class="btn-secondary" title="បោះពុម្ពរបាយការណ៍តារាង">
              <i class="fa-solid fa-print"></i>
              <span>Print</span>
            </button>
          </div>
        </div>

        <!-- Main Student Data Table -->
        <div class="card" style="padding: 0; overflow: hidden;">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 50px; text-align: center;">ល.រ</th>
                  <th class="sortable-th" data-sort="ID">
                    អត្តលេខ <i class="sort-icon fa-solid fa-sort text-muted"></i>
                  </th>
                  <th class="sortable-th" data-sort="NameKh">
                    ឈ្មោះសិស្ស <i class="sort-icon fa-solid fa-sort text-muted"></i>
                  </th>
                  <th class="sortable-th" data-sort="Gender">
                    ភេទ <i class="sort-icon fa-solid fa-sort text-muted"></i>
                  </th>
                  <th class="sortable-th" data-sort="Course">
                    វគ្គសិក្សាកុំព្យូទ័រ <i class="sort-icon fa-solid fa-sort text-muted"></i>
                  </th>
                  <th style="min-width: 160px;">រយៈពេល & ថ្ងៃបានរៀន</th>
                  <th>ទំនាក់ទំនង & អាសយដ្ឋាន</th>
                  <th class="sortable-th" data-sort="Status">
                    ស្ថានភាព <i class="sort-icon fa-solid fa-sort text-muted"></i>
                  </th>
                  <th style="text-align: center; width: 120px;">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody id="studentTableBody">
                <!-- Dynamic rows rendered here -->
              </tbody>
            </table>
          </div>

          <!-- Table Pagination & Footer Controls -->
          <div class="table-footer-bar">
            <div id="tableCountDisplay">បង្ហាញ 0-0 ក្នុងចំណោម 0 នាក់</div>

            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span>ជួរក្នុងមួយទំព័រ:</span>
                <select id="pageLimitSelect" class="filter-select" style="height: 32px; padding: 0 8px;">
                  <option value="5">5</option>
                  <option value="10" selected>10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>

              <div id="paginationControls" class="pagination-wrapper">
                <!-- Pagination buttons generated here -->
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  initEvents() {
    // Open Add Student Modal Button
    const openAddBtn = document.getElementById("openAddStudentModalBtn");
    if (openAddBtn) {
      openAddBtn.addEventListener("click", () => {
        App.openAddStudentModal();
      });
    }

    // Search input
    const searchInput = document.getElementById("tableSearchInput");
    let searchTimeout = null;
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          App.state.searchQuery = e.target.value.trim().toLowerCase();
          App.state.pagination.page = 1;
          App.applyFiltersAndSearch();
          this.renderTable();
        }, 250);
      });
    }

    // Filter selects
    const courseFilter = document.getElementById("filterCourse");
    const genderFilter = document.getElementById("filterGender");
    const shiftFilter = document.getElementById("filterShift");
    const statusFilter = document.getElementById("filterStatus");

    [courseFilter, genderFilter, shiftFilter, statusFilter].forEach(el => {
      if (el) {
        el.addEventListener("change", () => {
          App.state.filters.grade = "";
          App.state.filters.course = courseFilter ? courseFilter.value : "";
          App.state.filters.gender = genderFilter ? genderFilter.value : "";
          App.state.filters.shift = shiftFilter ? shiftFilter.value : "";
          App.state.filters.status = statusFilter ? statusFilter.value : "";
          App.state.pagination.page = 1;
          App.applyFiltersAndSearch();
          this.renderTable();
        });
      }
    });

    // Clear filters
    const clearFilterBtn = document.getElementById("clearFilterBtn");
    if (clearFilterBtn) {
      clearFilterBtn.addEventListener("click", () => {
        if (searchInput) searchInput.value = "";
        if (courseFilter) courseFilter.value = "";
        if (genderFilter) genderFilter.value = "";
        if (shiftFilter) shiftFilter.value = "";
        if (statusFilter) statusFilter.value = "";

        App.state.searchQuery = "";
        App.state.filters = { grade: "", course: "", gender: "", shift: "", status: "" };
        App.state.pagination.page = 1;
        App.applyFiltersAndSearch();
        this.renderTable();
        App.showToast("បានជម្រះតម្រងស្វែងរកទាំងអស់", "info");
      });
    }

    // Limit select
    const pageLimitSelect = document.getElementById("pageLimitSelect");
    if (pageLimitSelect) {
      pageLimitSelect.addEventListener("change", (e) => {
        App.state.pagination.limit = parseInt(e.target.value, 10);
        App.state.pagination.page = 1;
        this.renderTable();
      });
    }

    // Sorting headers
    document.querySelectorAll(".sortable-th").forEach(th => {
      th.addEventListener("click", () => {
        const field = th.getAttribute("data-sort");
        if (App.state.sort.field === field) {
          App.state.sort.order = App.state.sort.order === "asc" ? "desc" : "asc";
        } else {
          App.state.sort.field = field;
          App.state.sort.order = field === "ID" ? "desc" : "asc";
        }
        App.applySorting();
        this.renderTable();
      });
    });

    // Export, Import & Print
    const exportBtn = document.getElementById("exportCsvBtn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => App.exportToCsv());
    }

    const importBtn = document.getElementById("importExcelBtn");
    if (importBtn) {
      importBtn.addEventListener("click", () => {
        ModalsComponent.open("importExcelModal");
      });
    }

    const printTableBtn = document.getElementById("printTableBtn");
    if (printTableBtn) {
      printTableBtn.addEventListener("click", () => App.printStudentTable());
    }
  },

  renderTable() {
    const tbody = document.getElementById("studentTableBody");
    if (!tbody) return;

    const total = App.state.filteredStudents.length;
    const { page, limit } = App.state.pagination;
    const totalPages = Math.ceil(total / limit) || 1;
    const currentPage = Math.min(page, totalPages);
    App.state.pagination.page = currentPage;

    const startIndex = (currentPage - 1) * limit;
    const pageData = App.state.filteredStudents.slice(startIndex, startIndex + limit);

    // Update count display
    const countDisplay = document.getElementById("tableCountDisplay");
    if (countDisplay) {
      countDisplay.textContent = `បង្ហាញ ${total > 0 ? startIndex + 1 : 0}-${Math.min(startIndex + limit, total)} ក្នុងចំណោមសិស្សសរុប ${total} នាក់`;
    }
    const countBadge = document.getElementById("directoryStudentCountBadge");
    if (countBadge) {
      countBadge.textContent = `${total} នាក់`;
    }

    if (pageData.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="empty-state-cell" style="padding: 40px 20px; text-align: center;">
            <i class="fa-solid fa-user-slash text-muted" style="font-size: 2.5rem; margin-bottom: 12px; display: block;"></i>
            <p class="font-bold">រកមិនឃើញទិន្នន័យសិស្សឡើយ</p>
            <span class="text-sm text-muted">សូមសាកល្បងផ្លាស់ប្តូរពាក្យស្វែងរក ឬដោះតម្រងចេញ</span>
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
          <span class="badge badge-id font-mono">${App.escapeHtml(s.ID)}</span>
        </td>
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
          ${(() => {
            const daysInfo = App.getStudentDaysInfo(s);
            const attSummary = StudentAPI.getStudentAttendanceSummary(s.ID);
            return `
              <div style="font-size: 0.82rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                  <span class="badge-days-studied"><i class="fa-regular fa-calendar-days"></i> បានរៀន ${daysInfo.daysElapsed} ថ្ងៃ</span>
                  <span class="text-xs text-muted font-bold">${daysInfo.percent}%</span>
                </div>
                <div class="duration-progress-bar">
                  <div class="duration-progress-fill" style="width: ${daysInfo.percent}%;"></div>
                </div>
                <div class="text-xs text-muted" style="margin-top: 3px; display: flex; justify-content: space-between; align-items: center;">
                  <span>ចូលរៀន: ${daysInfo.startDate}</span>
                  <span class="badge-attendance-rate ${attSummary.rate >= 85 ? 'rate-high' : attSummary.rate >= 70 ? 'rate-medium' : 'rate-low'}" title="អត្រាវត្តមាន">វត្តមាន ${attSummary.rate}%</span>
                </div>
              </div>
            `;
          })()}
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 6px;">
            <div class="font-sans text-sm font-semibold">${App.escapeHtml(s.Phone || s.GuardianPhone || '—')}</div>
            ${s.Phone || s.GuardianPhone ? `
              <div style="display: inline-flex; gap: 4px;">
                <a href="tel:${s.Phone || s.GuardianPhone}" class="btn-action" style="width: 24px; height: 24px; font-size: 0.72rem; color: #10b981; background: rgba(16, 185, 129, 0.12); display: inline-flex; align-items: center; justify-content: center; border-radius: 4px;" title="Call ទៅសិស្ស/អាណាព្យាបាល">
                  <i class="fa-solid fa-phone"></i>
                </a>
                <a href="https://t.me/+855${String(s.Phone || s.GuardianPhone).replace(/^0/, '').replace(/\s+/g, '')}" target="_blank" class="btn-action" style="width: 24px; height: 24px; font-size: 0.72rem; color: #0088cc; background: rgba(0, 136, 204, 0.12); display: inline-flex; align-items: center; justify-content: center; border-radius: 4px;" title="ផ្ញើសារតាម Telegram">
                  <i class="fa-brands fa-telegram"></i>
                </a>
              </div>
            ` : ''}
          </div>
          <div class="text-xs text-muted">
            ${App.escapeHtml(s.Address || '')}
            ${s.GuardianPhone ? `<span style="color: #6366f1; display: block;">អាណាព្យាបាល: ${s.GuardianPhone}</span>` : ''}
          </div>
        </td>
        <td>
          ${(() => {
            const isDropped = (s.Status === "Dropped" || s.Status === "Drop" || s.isBlocked === true);
            if (isDropped) {
              return `<span class="status-indicator" style="background: rgba(239, 68, 68, 0.12); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); font-weight: 700; font-size: 0.78rem;"><i class="fa-solid fa-lock"></i> បោះបង់ (🔒 ប្រើលែងកើត)</span>`;
            } else if (s.Status === 'Graduated') {
              return `<span class="status-indicator" style="background: rgba(16, 185, 129, 0.12); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); font-weight: 700; font-size: 0.78rem;"><i class="fa-solid fa-graduation-cap"></i> បញ្ចប់ការសិក្សា</span>`;
            } else if (s.Status === 'Inactive') {
              return `<span class="status-indicator status-inactive">ផ្អាក</span>`;
            }
            return `<span class="status-indicator status-active">កំពុងសិក្សា</span>`;
          })()}
        </td>
        <td class="text-center actions-cell">
          <div class="action-buttons-group">
            <button type="button" class="btn-action btn-view" onclick="App.viewStudentDetails('${s.ID}')" title="មើលព័ត៌មានលម្អិត & កាតសិស្ស">
              <i class="fa-solid fa-id-card"></i>
            </button>
            <button type="button" class="btn-action" onclick="App.openAttendanceForStudent('${s.ID}')" title="កត់ត្រាវត្តមានសិស្ស" style="background: rgba(16, 185, 129, 0.12); color: #059669;">
              <i class="fa-solid fa-calendar-check"></i>
            </button>
            <button type="button" class="btn-action btn-edit" onclick="App.openEditModal('${s.ID}')" title="កែប្រែទិន្នន័យ">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button type="button" class="btn-action btn-delete" onclick="App.confirmDeleteStudent('${s.ID}')" title="លុបទិន្នន័យ">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join("");

    this.renderPagination(totalPages, currentPage);
  },

  renderPagination(totalPages, currentPage) {
    const container = document.getElementById("paginationControls");
    if (!container) return;

    if (totalPages <= 1) {
      container.innerHTML = "";
      return;
    }

    let html = `
      <button type="button" class="pagination-btn" ${currentPage === 1 ? "disabled" : ""} onclick="App.changePage(${currentPage - 1})">
        <i class="fa-solid fa-angle-left"></i> មុន
      </button>
    `;

    for (let p = 1; p <= totalPages; p++) {
      if (p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
        html += `
          <button type="button" class="pagination-btn ${p === currentPage ? "active" : ""}" onclick="App.changePage(${p})">
            ${p}
          </button>
        `;
      } else if (p === currentPage - 2 || p === currentPage + 2) {
        html += `<span class="pagination-dots">...</span>`;
      }
    }

    html += `
      <button type="button" class="pagination-btn" ${currentPage === totalPages ? "disabled" : ""} onclick="App.changePage(${currentPage + 1})">
        បន្ទាប់ <i class="fa-solid fa-angle-right"></i>
      </button>
    `;

    container.innerHTML = html;
  }
};
