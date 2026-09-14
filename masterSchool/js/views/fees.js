/**
 * View: Tuition Fees, Billing & Invoicing Management (គ្រប់គ្រងថ្លៃសិក្សា & ចេញវិក្កយបត្រ)
 */
const FeesView = {
  filters: {
    status: "",
    course: "",
    shift: "",
    search: ""
  },

  render() {
    return `
      <section id="view-fees" class="page-view">
        <!-- Top Action & Title Header -->
        <div class="card" style="margin-bottom: 20px; padding: 20px 24px; border-left: 4px solid #10b981; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div>
            <h2 style="font-size: 1.35rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 10px; margin: 0 0 6px 0;">
              <i class="fa-solid fa-file-invoice-dollar" style="color: #10b981;"></i>
              <span>គ្រប់គ្រងការបង់ថ្លៃសិក្សា & ចេញវិក្កយបត្រ (Tuition Fees & Invoicing)</span>
            </h2>
            <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted);">
              តាមដានការបង់ថ្លៃសាលា ចេញវិក្កយបត្រផ្លូវការមាន KHQR Bakong និងគ្រប់គ្រងចំណូលប្រចាំខែ
            </p>
          </div>

          <!-- Top Actions -->
          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <button type="button" id="openRecordPaymentBtn" class="btn-primary" style="height: 38px; padding: 0 18px; font-size: 0.88rem; background: #10b981; border-color: #10b981; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);">
              <i class="fa-solid fa-cash-register"></i>
              <span>+ កត់ត្រាការបង់ប្រាក់ (Record Payment)</span>
            </button>
            <button type="button" id="exportFeesCsvBtn" class="btn-secondary" style="height: 38px; padding: 0 14px; font-size: 0.85rem;" title="Export CSV">
              <i class="fa-solid fa-file-excel text-emerald-500"></i>
              <span>Export CSV</span>
            </button>
            <button type="button" id="printFeesTableBtn" class="btn-secondary" style="height: 38px; padding: 0 14px; font-size: 0.85rem;" title="បោះពុម្ពតារាងចំណូល">
              <i class="fa-solid fa-print"></i>
              <span>Print</span>
            </button>
          </div>
        </div>

        <!-- KPI Metrics Row -->
        <div class="kpi-grid">
          <!-- Total Revenue -->
          <div class="kpi-card" style="--card-accent: #10b981; --icon-bg: rgba(16, 185, 129, 0.12); --icon-color: #10b981;">
            <div class="kpi-info">
              <h3>ប្រាក់ចំណូលសរុប (Total Revenue)</h3>
              <div id="feeKpiTotalRevenue" class="kpi-number">$0</div>
              <div class="kpi-sub" id="feeKpiTotalPaidCount">សិស្សបង់រួច៖ 0 នាក់</div>
            </div>
            <div class="kpi-icon-box">
              <i class="fa-solid fa-hand-holding-dollar"></i>
            </div>
          </div>

          <!-- Pending / Outstanding Due -->
          <div class="kpi-card" style="--card-accent: #ef4444; --icon-bg: rgba(239, 68, 68, 0.12); --icon-color: #ef4444;">
            <div class="kpi-info">
              <h3>ប្រាក់ជំពាក់នៅសល់ (Pending Due)</h3>
              <div id="feeKpiPendingDue" class="kpi-number" style="color: #ef4444;">$0</div>
              <div class="kpi-sub" id="feeKpiUnpaidCount">សិស្សជំពាក់៖ 0 នាក់</div>
            </div>
            <div class="kpi-icon-box">
              <i class="fa-solid fa-clock-rotate-left"></i>
            </div>
          </div>

          <!-- Collection Rate -->
          <div class="kpi-card" style="--card-accent: #4f46e5; --icon-bg: rgba(79, 70, 229, 0.12); --icon-color: #4f46e5;">
            <div class="kpi-info">
              <h3>អត្រាប្រមូលប្រាក់ (Collection Rate)</h3>
              <div id="feeKpiCollectionRate" class="kpi-number">0%</div>
              <div class="kpi-sub">នៃថ្លៃសិក្សាសរុបទាំងអស់</div>
            </div>
            <div class="kpi-icon-box">
              <i class="fa-solid fa-chart-line"></i>
            </div>
          </div>

          <!-- Average Fee per Student -->
          <div class="kpi-card" style="--card-accent: #f59e0b; --icon-bg: rgba(245, 158, 11, 0.12); --icon-color: #f59e0b;">
            <div class="kpi-info">
              <h3>តម្លៃវគ្គមធ្យម (Avg Fee / Course)</h3>
              <div id="feeKpiAvgFee" class="kpi-number">$50</div>
              <div class="kpi-sub">សម្រាប់ ១ វគ្គសិក្សាកុំព្យូទ័រ</div>
            </div>
            <div class="kpi-icon-box">
              <i class="fa-solid fa-tags"></i>
            </div>
          </div>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="filter-bar" style="margin-bottom: 16px;">
          <!-- Filter Status -->
          <select id="feeFilterStatus" class="filter-select">
            <option value="">-- គ្រប់ស្ថានភាពបង់ប្រាក់ --</option>
            <option value="Paid">បានបង់រួចរាល់ (Paid)</option>
            <option value="Partial">បង់មួយចំនួន (Partial)</option>
            <option value="Unpaid">មិនទាន់បង់/ជំពាក់ (Unpaid)</option>
          </select>

          <!-- Filter Course -->
          <select id="feeFilterCourse" class="filter-select">
            <option value="">-- គ្រប់វគ្គសិក្សា --</option>
            ${APP_CONFIG.computerCourses.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
          </select>

          <!-- Filter Shift -->
          <select id="feeFilterShift" class="filter-select">
            <option value="">-- គ្រប់វេន --</option>
            ${APP_CONFIG.shifts.map(s => `<option value="${s.id}">${s.label}</option>`).join('')}
          </select>

          <!-- Search Input -->
          <div style="position: relative; flex: 1; max-width: 280px;">
            <input type="text" id="feeSearchInput" class="form-control" placeholder="ស្វែងរកតាមឈ្មោះ ឬអត្តលេខ..." style="height: 36px; padding-left: 32px; font-size: 0.84rem;">
            <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 10px; top: 11px; color: var(--text-muted); font-size: 0.85rem;"></i>
          </div>

          <button type="button" id="feeClearFilterBtn" class="btn-secondary" title="ជម្រះតម្រង">
            <i class="fa-solid fa-filter-circle-xmark"></i>
          </button>
        </div>

        <!-- Main Fees Data Table -->
        <div class="card" style="padding: 0; overflow: hidden;">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 45px; text-align: center;">#</th>
                  <th style="width: 95px;">អត្តលេខ</th>
                  <th>ព័ត៌មានសិស្ស</th>
                  <th>វគ្គសិក្សា</th>
                  <th class="text-right" style="width: 100px;">តម្លៃវគ្គ</th>
                  <th class="text-right" style="width: 105px;">បានបង់</th>
                  <th class="text-right" style="width: 100px;">នៅសល់</th>
                  <th>កាលបរិច្ឆេទ</th>
                  <th>មធ្យោបាយ</th>
                  <th class="text-center" style="width: 120px;">ស្ថានភាព</th>
                  <th class="text-center" style="width: 130px;">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody id="feesTableBody">
                <!-- Rendered dynamically -->
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  },

  initEvents() {
    // Open Record Payment Modal
    const openRecordBtn = document.getElementById("openRecordPaymentBtn");
    if (openRecordBtn) {
      openRecordBtn.addEventListener("click", () => {
        this.openRecordPaymentModal();
      });
    }

    // Filter Status
    const statusSel = document.getElementById("feeFilterStatus");
    if (statusSel) {
      statusSel.addEventListener("change", (e) => {
        this.filters.status = e.target.value;
        this.renderTable();
      });
    }

    // Filter Course
    const courseSel = document.getElementById("feeFilterCourse");
    if (courseSel) {
      courseSel.addEventListener("change", (e) => {
        this.filters.course = e.target.value;
        this.renderTable();
      });
    }

    // Filter Shift
    const shiftSel = document.getElementById("feeFilterShift");
    if (shiftSel) {
      shiftSel.addEventListener("change", (e) => {
        this.filters.shift = e.target.value;
        this.renderTable();
      });
    }

    // Search Input
    const searchInput = document.getElementById("feeSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.filters.search = e.target.value.toLowerCase().trim();
        this.renderTable();
      });
    }

    // Clear Filter
    const clearBtn = document.getElementById("feeClearFilterBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.filters = { status: "", course: "", shift: "", search: "" };
        if (statusSel) statusSel.value = "";
        if (courseSel) courseSel.value = "";
        if (shiftSel) shiftSel.value = "";
        if (searchInput) searchInput.value = "";
        this.renderTable();
        App.showToast("បានជម្រះតម្រងស្វែងរក", "info");
      });
    }

    // Export CSV
    const exportBtn = document.getElementById("exportFeesCsvBtn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => this.exportToCsv());
    }

    // Print Table
    const printBtn = document.getElementById("printFeesTableBtn");
    if (printBtn) {
      printBtn.addEventListener("click", () => window.print());
    }

    // Initial table render
    this.renderTable();
  },

  renderTable() {
    const tbody = document.getElementById("feesTableBody");
    if (!tbody) return;

    const students = App.state.students || [];
    const allFees = StudentAPI.getAllFees();

    let totalRevenue = 0;
    let pendingDue = 0;
    let paidCount = 0;
    let unpaidCount = 0;
    const defaultPrice = APP_CONFIG.feeConfig?.defaultCoursePrice || 50;

    // Filter students
    let filtered = students.filter(s => {
      const fee = allFees[s.ID] || {
        totalAmount: defaultPrice,
        paidAmount: defaultPrice,
        balance: 0,
        status: "Paid"
      };

      if (this.filters.status && fee.status !== this.filters.status) return false;
      if (this.filters.course && !(s.Course || "").includes(this.filters.course)) return false;
      if (this.filters.shift && s.Shift !== this.filters.shift) return false;
      if (this.filters.search) {
        const q = this.filters.search;
        const matchNameKh = s.NameKh && s.NameKh.toLowerCase().includes(q);
        const matchNameEn = s.NameEn && s.NameEn.toLowerCase().includes(q);
        const matchId = s.ID && s.ID.toLowerCase().includes(q);
        if (!matchNameKh && !matchNameEn && !matchId) return false;
      }
      return true;
    });

    // Compute overall statistics across all students
    students.forEach(s => {
      const fee = allFees[s.ID];
      const total = (fee && fee.totalAmount !== undefined) ? (parseFloat(fee.totalAmount) || defaultPrice) : defaultPrice;
      const paid = (fee && fee.paidAmount !== undefined) ? (parseFloat(fee.paidAmount) || 0) : defaultPrice;
      const balance = (fee && fee.balance !== undefined) ? (parseFloat(fee.balance) || 0) : Math.max(0, total - paid);

      totalRevenue += paid;
      pendingDue += balance;

      if (balance === 0 || fee?.status === "Paid") {
        paidCount++;
      } else {
        unpaidCount++;
      }
    });

    // Update KPI counters
    const elRevenue = document.getElementById("feeKpiTotalRevenue");
    const elPending = document.getElementById("feeKpiPendingDue");
    const elPaidCount = document.getElementById("feeKpiTotalPaidCount");
    const elUnpaidCount = document.getElementById("feeKpiUnpaidCount");
    const elRate = document.getElementById("feeKpiCollectionRate");

    if (elRevenue) elRevenue.textContent = `$${totalRevenue.toLocaleString()}`;
    if (elPending) elPending.textContent = `$${pendingDue.toLocaleString()}`;
    if (elPaidCount) elPaidCount.textContent = `សិស្សបង់រួច៖ ${paidCount} នាក់`;
    if (elUnpaidCount) elUnpaidCount.textContent = `សិស្សជំពាក់៖ ${unpaidCount} នាក់`;

    const totalPotential = totalRevenue + pendingDue;
    const rate = totalPotential > 0 ? Math.round((totalRevenue / totalPotential) * 100) : 0;
    if (elRate) elRate.textContent = `${rate}%`;

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="11" class="text-center py-5 text-muted">
            <i class="fa-solid fa-receipt text-muted fa-2x mb-2" style="display: block;"></i>
            <span>មិនមានទិន្នន័យបង់ប្រាក់ស្របតាមលក្ខខណ្ឌតម្រងឡើយ</span>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map((s, idx) => {
      const fee = allFees[s.ID] || {
        totalAmount: defaultPrice,
        paidAmount: defaultPrice,
        discount: 0,
        balance: 0,
        status: "Paid",
        date: s.StartDate || s.CreatedAt || "2026-08-10",
        paymentMethod: "ABA KHQR",
        receiptNo: "INV-2026-" + String(s.ID).replace(/\D/g, "").padStart(4, "0")
      };

      const total = parseFloat(fee.totalAmount) || defaultPrice;
      const paid = parseFloat(fee.paidAmount) || defaultPrice;
      const balance = parseFloat(fee.balance) || 0;
      const isPaid = fee.status === "Paid" || balance === 0;
      const isPartial = fee.status === "Partial" || (paid > 0 && balance > 0);

      return `
        <tr>
          <td class="text-center font-semibold text-muted">${idx + 1}</td>
          <td><span class="badge badge-id font-mono">${App.escapeHtml(s.ID)}</span></td>
          <td>
            <div class="user-badge">
              <img src="${s.Avatar || App.getDefaultAvatar(s.Gender)}" alt="${s.NameKh}" class="avatar-sm" onerror="this.src='${App.getDefaultAvatar(s.Gender)}'">
              <div>
                <div class="font-bold student-name-link" onclick="App.viewStudentDetails('${s.ID}')">${App.escapeHtml(s.NameKh)}</div>
                <div class="text-xs text-muted font-sans">${App.getShiftLabel(s.Shift)}</div>
              </div>
            </div>
          </td>
          <td>
            <span class="badge-course ${App.getCourseBadgeClass(s.Course || 'Typing')}">
              ${App.getCourseIcon(s.Course || 'Typing')} ${App.escapeHtml(s.Course || 'Typing')}
            </span>
          </td>
          <td class="text-right font-mono font-bold">$${total}</td>
          <td class="text-right font-mono font-bold text-emerald-600">$${paid}</td>
          <td class="text-right font-mono font-bold ${balance > 0 ? 'text-rose-600' : 'text-muted'}">$${balance}</td>
          <td class="text-xs">${fee.date || '—'}</td>
          <td class="text-xs font-semibold">
            ${fee.paymentMethod && fee.paymentMethod !== '—' 
              ? `<span class="badge" style="background: rgba(14, 165, 233, 0.1); color: #0284c7;"><i class="fa-solid fa-wallet"></i> ${fee.paymentMethod}</span>` 
              : '—'}
          </td>
          <td class="text-center">
            ${isPaid 
              ? '<span class="status-indicator status-active"><i class="fa-solid fa-circle-check"></i> បានបង់ (Paid)</span>' 
              : (isPartial 
                  ? '<span class="status-indicator" style="background: rgba(245, 158, 11, 0.12); color: #d97706;"><i class="fa-solid fa-clock"></i> បង់ខ្លះ (Partial)</span>' 
                  : '<span class="status-indicator status-inactive"><i class="fa-solid fa-circle-xmark"></i> ជំពាក់ (Due)</span>')}
          </td>
          <td class="text-center">
            <div class="action-buttons-group">
              <button type="button" class="btn-action" style="background: rgba(16, 185, 129, 0.12); color: #059669;" onclick="FeesView.openRecordPaymentModal('${s.ID}')" title="កត់ត្រាការបង់ប្រាក់">
                <i class="fa-solid fa-cash-register"></i>
              </button>
              <button type="button" class="btn-action btn-view" onclick="FeesView.printOfficialReceipt('${s.ID}')" title="បោះពុម្ពវិក្កយបត្រ / Receipt">
                <i class="fa-solid fa-receipt"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  },

  openRecordPaymentModal(studentId = null) {
    const modal = document.getElementById("recordPaymentModal");
    if (!modal) return;

    const studentSelect = document.getElementById("payStudentSelect");
    const courseSelect = document.getElementById("payCourseSelect");
    const totalInput = document.getElementById("payTotalAmount");
    const paidInput = document.getElementById("payPaidAmount");
    const discountInput = document.getElementById("payDiscount");
    const methodSelect = document.getElementById("payMethodSelect");
    const dateInput = document.getElementById("payDateInput");
    const noteInput = document.getElementById("payNoteInput");

    const students = App.state.students || [];
    const defaultPrice = APP_CONFIG.feeConfig?.defaultCoursePrice || 50;

    // Populate student select
    if (studentSelect) {
      studentSelect.innerHTML = `
        <option value="">-- សូមជ្រើសរើសសិស្ស --</option>
        ${students.map(s => `<option value="${s.ID}" ${studentId === s.ID ? 'selected' : ''}>${s.ID} - ${s.NameKh} (${s.Course || 'Typing'})</option>`).join('')}
      `;

      studentSelect.onchange = () => {
        const selId = studentSelect.value;
        const target = students.find(s => s.ID === selId);
        if (target) {
          if (courseSelect) courseSelect.value = target.Course || "Typing";
          const fee = StudentAPI.getStudentFee(selId);
          if (fee) {
            if (totalInput) totalInput.value = fee.totalAmount || defaultPrice;
            if (paidInput) paidInput.value = fee.paidAmount || defaultPrice;
            if (discountInput) discountInput.value = fee.discount || 0;
            if (methodSelect) methodSelect.value = fee.paymentMethod || "ABA KHQR";
            if (dateInput) dateInput.value = fee.date || new Date().toISOString().split("T")[0];
            if (noteInput) noteInput.value = fee.note || "";
          } else {
            if (totalInput) totalInput.value = defaultPrice;
            if (paidInput) paidInput.value = defaultPrice;
            if (discountInput) discountInput.value = 0;
            if (dateInput) dateInput.value = new Date().toISOString().split("T")[0];
          }
        }
      };
    }

    if (studentId) {
      const fee = StudentAPI.getStudentFee(studentId);
      const student = students.find(s => s.ID === studentId);
      if (courseSelect && student) courseSelect.value = student.Course || "Typing";
      if (totalInput) totalInput.value = fee?.totalAmount || defaultPrice;
      if (paidInput) paidInput.value = fee?.paidAmount || defaultPrice;
      if (discountInput) discountInput.value = fee?.discount || 0;
      if (methodSelect) methodSelect.value = fee?.paymentMethod || "ABA KHQR";
      if (dateInput) dateInput.value = fee?.date || new Date().toISOString().split("T")[0];
      if (noteInput) noteInput.value = fee?.note || "";
    } else {
      if (totalInput) totalInput.value = defaultPrice;
      if (paidInput) paidInput.value = defaultPrice;
      if (discountInput) discountInput.value = 0;
      if (dateInput) dateInput.value = new Date().toISOString().split("T")[0];
    }

    ModalsComponent.open("recordPaymentModal");
  },

  async handlePaymentFormSubmit(form) {
    const studentId = form.querySelector("#payStudentSelect")?.value;
    if (!studentId) {
      App.showToast("សូមជ្រើសរើសសិស្សដែលត្រូវបង់ប្រាក់!", "warning");
      return;
    }

    const course = form.querySelector("#payCourseSelect")?.value || "Typing";
    const totalAmount = parseFloat(form.querySelector("#payTotalAmount")?.value) || 35;
    const paidAmount = parseFloat(form.querySelector("#payPaidAmount")?.value) || 0;
    const discount = parseFloat(form.querySelector("#payDiscount")?.value) || 0;
    const paymentMethod = form.querySelector("#payMethodSelect")?.value || "ABA KHQR";
    const date = form.querySelector("#payDateInput")?.value || new Date().toISOString().split("T")[0];
    const note = form.querySelector("#payNoteInput")?.value?.trim() || "";

    const submitBtn = form.querySelector("button[type='submit']");
    const origHtml = submitBtn ? submitBtn.innerHTML : "";

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> កំពុងរក្សាទុក...`;
      }

      await StudentAPI.saveStudentPayment(studentId, {
        course,
        totalAmount,
        paidAmount,
        discount,
        paymentMethod,
        date,
        note
      });

      App.showToast(`បានកត់ត្រាការបង់ប្រាក់ $${paidAmount} សម្រាប់សិស្សជោគជ័យ!`, "success");
      App.triggerConfetti();
      ModalsComponent.close("recordPaymentModal");
      this.renderTable();

      // Trigger Telegram Notification
      if (typeof TelegramService !== "undefined") {
        const student = (App.state.students || []).find(s => s.ID === studentId);
        if (student) {
          TelegramService.notifyPayment(student, {
            course,
            paidAmount,
            receiptNo: `INV-${new Date().getFullYear()}-${studentId.replace(/\D/g, '').padStart(3, '0')}`,
            paymentMethod,
            date
          });
        }
      }
    } catch (err) {
      App.showToast("កំហុសក្នុងការកត់ត្រាការបង់ប្រាក់: " + err.message, "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origHtml;
      }
    }
  },

  printOfficialReceipt(studentId) {
    const student = (App.state.students || []).find(s => s.ID === studentId);
    if (!student) {
      App.showToast("រកមិនឃើញព័ត៌មានសិស្សឡើយ", "warning");
      return;
    }

    const defaultPrice = APP_CONFIG.feeConfig?.defaultCoursePrice || 50;
    const fee = StudentAPI.getStudentFee(studentId) || {
      totalAmount: defaultPrice,
      paidAmount: defaultPrice,
      discount: 0,
      balance: 0,
      status: "Paid",
      receiptNo: "INV-2026-" + String(studentId).replace(/\D/g, "").padStart(4, "0"),
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "ABA KHQR",
      note: "ថ្លៃសិក្សាកុំព្យូទ័ររដ្ឋបាល"
    };

    const printWin = window.open("", "_blank", "width=850,height=750");
    if (!printWin) {
      App.showToast("សូមបើកអនុញ្ញាត Pop-up ក្នុង Browser ដើម្បីបោះពុម្ព!", "warning");
      return;
    }

    const subtotal = (fee.totalAmount || defaultPrice);
    const discount = (fee.discount || 0);
    const paid = (fee.paidAmount || 0);
    const balance = Math.max(0, subtotal - discount - paid);

    printWin.document.write(`
      <!DOCTYPE html>
      <html lang="km">
      <head>
        <meta charset="UTF-8">
        <title>វិក្កយបត្រផ្លូវការ / Official Receipt - ${student.NameKh}</title>
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
        <style>
          @page { size: A5 landscape; margin: 10mm; }
          body { font-family: 'Kantumruy Pro', sans-serif; color: #1e293b; padding: 25px; margin: 0; font-size: 12.5px; background: #ffffff; }
          .receipt-box { border: 2px solid #10b981; border-radius: 12px; padding: 22px; position: relative; }
          .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-25deg); font-size: 65px; color: rgba(16, 185, 129, 0.06); font-weight: 900; pointer-events: none; z-index: 0; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e2e8f0; padding-bottom: 14px; margin-bottom: 16px; }
          .school-info h1 { margin: 0 0 4px 0; font-size: 18px; color: #047857; }
          .school-info p { margin: 0; color: #64748b; font-size: 11px; }
          .receipt-title { text-align: right; }
          .receipt-title h2 { margin: 0 0 4px 0; font-size: 17px; color: #1e293b; font-family: 'Plus Jakarta Sans', sans-serif; }
          .receipt-badge { display: inline-block; background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; padding: 3px 8px; border-radius: 6px; font-weight: 700; font-size: 11px; }
          .meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; font-size: 12px; }
          .meta-item { display: flex; justify-content: space-between; }
          .meta-lbl { color: #64748b; }
          .meta-val { font-weight: 700; color: #0f172a; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 12px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 12px; }
          th { background: #f1f5f9; font-weight: 700; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .summary-table { width: 280px; margin-left: auto; margin-bottom: 16px; font-size: 12px; }
          .summary-table td { padding: 5px 10px; border: none; }
          .summary-table tr.total-row td { font-weight: 800; font-size: 14px; border-top: 1px solid #cbd5e1; color: #047857; }
          .footer-signs { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 20px; text-align: center; }
          .sign-col { width: 170px; }
          .khqr-box { display: flex; align-items: center; gap: 10px; background: #f8fafc; padding: 6px 10px; border-radius: 6px; border: 1px dashed #cbd5e1; font-size: 10px; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="receipt-box">
          <div class="watermark">PAID</div>
          
          <div class="header">
            <div class="school-info">
              <h1>🎓 សាលាអន្តរជាតិ MASTERSCHOOL</h1>
              <p>មជ្ឈមណ្ឌលបណ្តុះបណ្តាលកុំព្យូទ័ររដ្ឋបាល & ព័ត៌មានវិទ្យា</p>
              <p>ទូរស័ព្ទ៖ 071 721 0307 | រាជធានីភ្នំពេញ</p>
            </div>
            <div class="receipt-title">
              <h2>RECEIPT / វិក្កយបត្រ</h2>
              <div class="receipt-badge">លេខ៖ ${fee.receiptNo || 'INV-2026-001'}</div>
              <div style="font-size: 10.5px; color: #64748b; margin-top: 4px;">កាលបរិច្ឆេទ៖ ${fee.date || new Date().toISOString().split('T')[0]}</div>
            </div>
          </div>

          <div class="meta-grid">
            <div class="meta-item"><span class="meta-lbl">អត្តលេខសិស្ស៖</span> <span class="meta-val">${student.ID}</span></div>
            <div class="meta-item"><span class="meta-lbl">ភេទ៖</span> <span class="meta-val">${student.Gender}</span></div>
            <div class="meta-item"><span class="meta-lbl">ឈ្មោះសិស្ស៖</span> <span class="meta-val">${student.NameKh} (${student.NameEn || ''})</span></div>
            <div class="meta-item"><span class="meta-lbl">វេនសិក្សា៖</span> <span class="meta-val">${App.getShiftLabel(student.Shift)}</span></div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 35px;" class="text-center">ល.រ</th>
                <th>បរិយាយមុខវិជ្ជា / វគ្គសិក្សា</th>
                <th class="text-center" style="width: 90px;">ថិរវេលា</th>
                <th class="text-right" style="width: 100px;">ចំនួនទឹកប្រាក់</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-center font-bold">1</td>
                <td>
                  <strong>វគ្គសិក្សាកុំព្យូទ័រ៖ ${student.Course || 'Typing'}</strong>
                  <div style="font-size: 11px; color: #64748b;">${fee.note || 'វគ្គបណ្តុះបណ្តាលកុំព្យូទ័ររដ្ឋបាលអាជីព MasterSchool'}</div>
                </td>
                <td class="text-center">៤៥ ថ្ងៃ</td>
                <td class="text-right font-mono font-bold">$${subtotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="khqr-box">
              <div style="width: 48px; height: 48px; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                <i class="fa-solid fa-qrcode" style="color: #ef4444;"></i>
              </div>
              <div>
                <div style="font-weight: 700; color: #ef4444;"><i class="fa-solid fa-building-columns"></i> KHQR / ABA Bank</div>
                <div>A/C: 071 721 0307</div>
                <div style="color: #64748b;">KHIEN THOU</div>
              </div>
            </div>

            <table class="summary-table">
              <tr>
                <td class="text-right text-muted">សរុប (Subtotal):</td>
                <td class="text-right font-mono font-bold">$${subtotal.toFixed(2)}</td>
              </tr>
              ${discount > 0 ? `
                <tr>
                  <td class="text-right text-muted">បញ្ចុះតម្លៃ (Discount):</td>
                  <td class="text-right font-mono text-emerald-600 font-bold">-$${discount.toFixed(2)}</td>
                </tr>
              ` : ''}
              <tr class="total-row">
                <td class="text-right">បានបង់ (Total Paid):</td>
                <td class="text-right font-mono font-bold">$${paid.toFixed(2)}</td>
              </tr>
              <tr>
                <td class="text-right text-muted">នៅសល់ (Balance Due):</td>
                <td class="text-right font-mono font-bold ${balance > 0 ? 'color: #dc2626;' : 'color: #059669;'}">$${balance.toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <div class="footer-signs">
            <div class="sign-col">
              <p>ហត្ថលេខាសិស្ស / អាណាព្យាបាល</p>
              <div style="height: 40px;"></div>
              <p>.......................................</p>
            </div>
            <div class="sign-col">
              <p>បេឡាធិការ / អ្នកប្រមូលប្រាក់</p>
              <div style="height: 40px;"></div>
              <p><strong>លោកគ្រូ ខៀន ធូ</strong></p>
            </div>
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

  exportToCsv() {
    const students = App.state.students || [];
    const allFees = StudentAPI.getAllFees();
    const defaultPrice = APP_CONFIG.feeConfig?.defaultCoursePrice || 35;

    const headers = ["អត្តលេខ", "ឈ្មោះខ្មែរ", "ឈ្មោះអង់គ្លេស", "វគ្គសិក្សា", "វេន", "តម្លៃសរុប ($)", "បានបង់ ($)", "នៅសល់ ($)", "ស្ថានភាព", "កាលបរិច្ឆេទ", "មធ្យោបាយបង់ប្រាក់", "លេខវិក្កយបត្រ"];

    const rows = students.map(s => {
      const f = allFees[s.ID] || {};
      const total = f.totalAmount || defaultPrice;
      const paid = f.paidAmount || 0;
      const balance = f.balance || Math.max(0, total - paid);
      return [
        `"${s.ID}"`,
        `"${s.NameKh}"`,
        `"${s.NameEn || ''}"`,
        `"${s.Course || 'Typing'}"`,
        `"${s.Shift || 'ព្រឹក'}"`,
        `"${total}"`,
        `"${paid}"`,
        `"${balance}"`,
        `"${f.status || 'Unpaid'}"`,
        `"${f.date || s.StartDate || ''}"`,
        `"${f.paymentMethod || '—'}"`,
        `"${f.receiptNo || '—'}"`
      ];
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `MasterSchool_Tuition_Fees_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    App.showToast("បានទាញយករបាយការណ៍ថ្លៃសិក្សាជា CSV ជោគជ័យ!", "success");
  }
};
