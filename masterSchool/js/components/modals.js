/**
 * Component: Modals (Student Details & ID Card, Edit, Delete Confirmation)
 */
const ModalsComponent = {
  render() {
    return `
      <!-- 1. Modal: Upgraded Modern Student Profile & Additional Payment Popup -->
      <div id="studentDetailsModal" class="modal-overlay">
        <div class="modal-card">
          <!-- 1.1 Modal Header: Burgundy / Deep Wine #851349 -->
          <div class="student-modal-header">
            <div class="header-title-box">
              <i class="fa-solid fa-circle-info"></i>
              <span id="modalStudentTitle">ព័ត៌មានលម្អិតរបស់សិស្ស និងបង់ប្រាក់បន្ថែម</span>
            </div>
            <button type="button" class="header-close-btn" data-close-modal="studentDetailsModal" title="បិទផ្ទាំង">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- 1.2 Modal Scrollable Body -->
          <div class="student-modal-body">
            <!-- Top Profile Summary Card -->
            <div class="student-profile-header-card">
              <!-- Left: Avatar with Camera Badge -->
              <div class="profile-avatar-wrapper">
                <img id="profileHeaderAvatar" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23e2e8f0'/%3E%3Cpath d='M50 48a16 16 0 100-32 16 16 0 000 32zm0 8c-18 0-32 12-32 26v4h64v-4c0-14-14-26-32-26z' fill='%2394a3b8'/%3E%3C/svg%3E" alt="Avatar" class="profile-avatar-img">
                <label for="profileAvatarFileInput" class="profile-camera-badge" title="ផ្លាស់ប្តូររូបថតសិស្ស">
                  <i class="fa-solid fa-camera"></i>
                  <input type="file" id="profileAvatarFileInput" accept="image/*" style="display: none;">
                </label>
              </div>

              <!-- Center: Student Name & Badges -->
              <div class="profile-info-center">
                <h2 id="profileHeaderNameKh" class="profile-name-title">ឈ្មោះសិស្ស</h2>
                <div class="profile-badges-row">
                  <span class="profile-badge-pill profile-badge-id">
                    <i class="fa-solid fa-id-card"></i> ID: <strong id="profileHeaderId" class="font-mono">TX-1001</strong>
                  </span>
                  <span class="profile-badge-pill profile-badge-course">
                    <i class="fa-solid fa-graduation-cap"></i> <span id="profileHeaderCourse">ថ្នាក់កុំព្យូទ័រ</span>
                  </span>
                  <span id="profileHeaderFeeStatus" class="profile-badge-pill profile-badge-fee-paid">
                    <i class="fa-solid fa-circle-info"></i> <i class="fa-solid fa-check"></i> <span id="profileHeaderFeeStatusText">បង់រួចរាល់</span>
                  </span>
                </div>
              </div>

              <!-- Right: Action Buttons Group -->
              <div class="profile-actions-right">
                <button type="button" id="profileBtnAddPayment" class="btn-pill-action btn-pill-blue" title="កត់ត្រាការបង់ប្រាក់បន្ថែម">
                  <i class="fa-solid fa-plus-circle"></i> <span>បង់ប្រាក់បន្ថែម</span>
                </button>
                <button type="button" id="profileBtnEdit" class="btn-pill-action btn-pill-amber" title="កែប្រែទិន្នន័យសិស្ស">
                  <i class="fa-solid fa-pen-to-square"></i> <span>កែប្រែ</span>
                </button>
                <button type="button" id="profileBtnMarkDrop" class="btn-pill-action" style="border: 1px solid #ef4444; color: #ef4444; background: rgba(239, 68, 68, 0.08);" title="កំណត់ជាសិស្សបោះបង់ការសិក្សា (ID នឹងត្រូវចាក់សោរ)">
                  <i class="fa-solid fa-user-xmark"></i> <span>បោះបង់</span>
                </button>
                <button type="button" id="profileBtnMarkGraduate" class="btn-pill-action" style="border: 1px solid #10b981; color: #10b981; background: rgba(16, 185, 129, 0.08);" title="កំណត់ជាសិស្សបញ្ចប់ការសិក្សា">
                  <i class="fa-solid fa-user-graduate"></i> <span>បញ្ចប់</span>
                </button>
                <button type="button" id="profileBtnToggleStatus" class="btn-pill-action btn-pill-outline-yellow" title="ផ្លាស់ប្តូរស្ថានភាពសិស្ស">
                  <i class="fa-regular fa-circle-pause"></i> <span id="profileBtnStatusText">ផ្អាកការសិក្សា</span>
                </button>
                <div class="dropdown-wrapper">
                  <button type="button" id="profileBtnMore" class="btn-pill-action btn-pill-grey" title="ជម្រើសផ្សេងៗ">
                    <i class="fa-solid fa-ellipsis-vertical"></i> <span>ផ្សេងៗ</span> <i class="fa-solid fa-caret-down" style="font-size: 11px;"></i>
                  </button>
                  <div id="profileMoreMenu" class="dropdown-menu-custom">
                    <button type="button" class="dropdown-item-custom" id="menuItemPrintIdCard">
                      <i class="fa-solid fa-id-card text-indigo-500"></i> <span>បោះពុម្ពកាតសិស្ស</span>
                    </button>
                    <button type="button" class="dropdown-item-custom" id="menuItemPrintTranscript">
                      <i class="fa-solid fa-file-invoice text-emerald-500"></i> <span>ព្រឹត្តិបត្រពិន្ទុ</span>
                    </button>
                    <button type="button" class="dropdown-item-custom" id="menuItemIssueCert">
                      <i class="fa-solid fa-award text-amber-500"></i> <span>ចេញវិញ្ញាបនបត្រឌីជីថល</span>
                    </button>
                    <button type="button" class="dropdown-item-custom" id="menuItemResetPin">
                      <i class="fa-solid fa-key text-blue-500"></i> <span>កំណត់ PIN ឡើងវិញ</span>
                    </button>
                    <button type="button" class="dropdown-item-custom" id="menuItemMarkDrop" style="color: #ef4444;">
                      <i class="fa-solid fa-user-xmark" style="color: #ef4444;"></i> <span>បោះបង់ការសិក្សា (ចាក់សោរ ID)</span>
                    </button>
                    <button type="button" class="dropdown-item-custom" id="menuItemMarkGraduate" style="color: #10b981;">
                      <i class="fa-solid fa-user-graduate" style="color: #10b981;"></i> <span>បញ្ចប់ការសិក្សា & ចេញប័ណ្ណ</span>
                    </button>
                    <button type="button" class="dropdown-item-custom" id="menuItemReactivateStudent" style="color: #3b82f6;">
                      <i class="fa-solid fa-rotate-left" style="color: #3b82f6;"></i> <span>ស្តារចូលរៀនវិញ (បើកសោរ ID)</span>
                    </button>
                    <div style="height: 1px; background: #e2e8f0; margin: 4px 0;"></div>
                    <button type="button" class="dropdown-item-custom danger" id="menuItemDeleteStudent">
                      <i class="fa-solid fa-trash"></i> <span>លុបទិន្នន័យសិស្ស</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Navigation Tabs Bar -->
            <div class="student-nav-tabs-bar">
              <button type="button" class="student-tab-btn" data-student-tab="general">
                <i class="fa-regular fa-user"></i> <span>ព័ត៌មានទូទៅ</span>
              </button>
              <button type="button" class="student-tab-btn" data-student-tab="family">
                <i class="fa-solid fa-users"></i> <span>គ្រួសារ</span>
              </button>
              <button type="button" class="student-tab-btn active" data-student-tab="finance">
                <i class="fa-solid fa-money-bill-wave"></i> <span>ហិរញ្ញវត្ថុ</span>
              </button>
              <button type="button" class="student-tab-btn" data-student-tab="exams">
                <i class="fa-regular fa-newspaper"></i> <span>លទ្ធផលសិក្សា</span>
              </button>
              <button type="button" class="student-tab-btn" data-student-tab="attendance">
                <i class="fa-regular fa-calendar-check"></i> <span>អវត្តមាន</span>
              </button>
              <button type="button" class="student-tab-btn" data-student-tab="services">
                <i class="fa-solid fa-id-card"></i> <span>សេវាផ្សេងៗ</span> <i class="fa-solid fa-caret-down" style="font-size: 10px;"></i>
              </button>
            </div>

            <!-- Tab Panes Container -->
            <div class="student-tab-panes-wrapper">
              <!-- ========================================== -->
              <!-- Tab 1: ហិរញ្ញវត្ថុ (Finance) - DEFAULT ACTIVE -->
              <!-- ========================================== -->
              <div class="student-tab-pane active" id="pane-finance">
                <!-- Inline Quick Payment Drawer/Form -->
                <div id="inlineQuickPayBox" class="inline-quick-pay-form">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <strong style="color: #1e40af; font-size: 0.95rem; display: flex; align-items: center; gap: 8px;">
                      <i class="fa-solid fa-cash-register"></i> កត់ត្រាការបង់ប្រាក់បន្ថែម (Record Payment)
                    </strong>
                    <button type="button" id="closeQuickPayBtn" style="background: none; border: none; font-size: 1.1rem; color: #64748b; cursor: pointer;">✕</button>
                  </div>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; font-size: 0.85rem;">
                    <div>
                      <label style="display: block; font-weight: 600; margin-bottom: 4px; color: #334155;">ចំនួនទឹកប្រាក់បង់ ($) *</label>
                      <input type="number" id="quickPayAmount" class="form-control" value="50" step="1" min="1" required style="font-weight: 700;">
                    </div>
                    <div>
                      <label style="display: block; font-weight: 600; margin-bottom: 4px; color: #334155;">វិធីសាស្ត្របង់ប្រាក់</label>
                      <select id="quickPayMethod" class="form-control">
                        <option value="Cash">Cash (សាច់ប្រាក់សុទ្ធ)</option>
                        <option value="ABA KHQR">ABA KHQR</option>
                        <option value="Wing">Wing Bank</option>
                        <option value="ACLEDA">ACLEDA Bank</option>
                      </select>
                    </div>
                    <div>
                      <label style="display: block; font-weight: 600; margin-bottom: 4px; color: #334155;">ថ្ងៃខែបង់ប្រាក់</label>
                      <input type="date" id="quickPayDate" class="form-control">
                    </div>
                    <div>
                      <label style="display: block; font-weight: 600; margin-bottom: 4px; color: #334155;">ចំណាំ (Note)</label>
                      <input type="text" id="quickPayNote" class="form-control" placeholder="ឧ. បង់ថ្លៃវគ្គសិក្សាពេញ">
                    </div>
                  </div>
                  <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px;">
                    <button type="button" id="cancelQuickPayBtn" class="btn-secondary" style="height: 34px; padding: 0 14px; font-size: 0.82rem;">បោះបង់</button>
                    <button type="button" id="submitQuickPayBtn" class="btn-primary" style="height: 34px; padding: 0 18px; font-size: 0.82rem; background: #0284c7; border-color: #0284c7;">
                      <i class="fa-solid fa-check"></i> រក្សាទុកការបង់ប្រាក់
                    </button>
                  </div>
                </div>

                <!-- 2-Column Finance Layout -->
                <div class="finance-tab-layout">
                  <!-- Left: Blue Financial Summary Card -->
                  <div class="finance-blue-card">
                    <div>
                      <div class="finance-blue-card-header">
                        <div class="finance-blue-icon-box">
                          <i class="fa-solid fa-wallet"></i>
                        </div>
                        <h3 class="finance-blue-title">សង្ខេបហិរញ្ញវត្ថុ</h3>
                      </div>

                      <div class="finance-breakdown-box">
                        <div class="finance-breakdown-subhead">ការបែងចែកថ្លៃសិក្សា</div>
                        <div class="finance-breakdown-item">
                          <span><i class="fa-solid fa-id-badge"></i> ថ្លៃសិក្សា</span>
                          <span id="financeCardTuition">$250.00</span>
                        </div>
                        <div class="finance-breakdown-item">
                          <span><i class="fa-solid fa-box-archive"></i> ថ្លៃសម្ភារៈ</span>
                          <span id="financeCardMaterials">$0.00</span>
                        </div>
                        <div class="finance-breakdown-item">
                          <span><i class="fa-solid fa-receipt"></i> ថ្លៃរដ្ឋបាល</span>
                          <span id="financeCardAdmin">$0.00</span>
                        </div>
                      </div>
                    </div>

                    <div class="finance-summary-bottom">
                      <div class="finance-total-row">
                        <span>សរុបត្រូវបង់</span>
                        <span id="financeCardTotal" class="finance-total-amount">$250.00</span>
                      </div>
                      <div class="finance-paid-row">
                        <span><i class="fa-regular fa-circle-check"></i> បានបង់រួច</span>
                        <span id="financeCardPaid" class="font-mono">$250.00</span>
                      </div>
                      <div class="finance-due-row">
                        <span>នៅខ្វះ (BALANCE DUE)</span>
                        <span id="financeCardBalance" class="font-mono">$0.00</span>
                      </div>
                    </div>
                  </div>

                  <!-- Right: Payment History Panel -->
                  <div class="finance-history-panel">
                    <div class="history-panel-header">
                      <div class="history-title-box">
                        <i class="fa-solid fa-clock-rotate-left"></i>
                        <div>
                          <h4>ប្រវត្តិការបង់ប្រាក់</h4>
                          <p>ការបង់ប្រាក់ទាំងអស់ដែលបានធ្វើឡើង</p>
                        </div>
                      </div>

                      <div class="history-header-actions">
                        <button type="button" id="financeAddPaymentBtn" class="btn-history-add">
                          <i class="fa-solid fa-plus"></i> <span>បង់ប្រាក់បន្ថែម</span>
                        </button>
                        <button type="button" id="financePrintHistoryBtn" class="btn-history-print" title="បោះពុម្ពប្រវត្តិបង់ប្រាក់">
                          <i class="fa-solid fa-print"></i>
                        </button>
                        <span class="badge-history-count" id="financeCountBadge">
                          <i class="fa-regular fa-newspaper"></i> <span>1 លើក</span>
                        </span>
                        <span class="badge-history-total" id="financeTotalPaidBadge">
                          <i class="fa-solid fa-dollar-sign"></i> <span>$250.00</span>
                        </span>
                      </div>
                    </div>

                    <!-- Payment History Table -->
                    <div class="history-table-wrapper">
                      <table class="history-table">
                        <thead>
                          <tr>
                            <th>ដំណាក់កាល</th>
                            <th><i class="fa-regular fa-calendar-days"></i> ថ្ងៃខែបង់ប្រាក់</th>
                            <th><i class="fa-solid fa-history"></i> ចំនួនខែ</th>
                            <th><i class="fa-solid fa-dollar-sign"></i> សរុប/បានបង់/ជំពាក់</th>
                            <th><i class="fa-solid fa-user-shield"></i> អ្នកទទួល</th>
                            <th style="text-align: right;"><i class="fa-solid fa-gear"></i> សកម្មភាព</th>
                          </tr>
                        </thead>
                        <tbody id="financePaymentTableBody">
                          <!-- Filled dynamically by JavaScript -->
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ========================================== -->
              <!-- Tab 2: ព័ត៌មានទូទៅ (General Information) -->
              <!-- ========================================== -->
              <div class="student-tab-pane" id="pane-general">
                <div class="general-info-grid">
                  <!-- Section A: Personal Details -->
                  <div class="info-card-section">
                    <h4 class="info-card-title"><i class="fa-solid fa-user-check text-indigo-500"></i> ព័ត៌មានផ្ទាល់ខ្លួន (Personal Info)</h4>
                    <div class="info-field-row">
                      <span class="info-field-label">អត្តលេខសិស្ស (ID)</span>
                      <span id="modalDetailId" class="info-field-val font-mono">TX-1001</span>
                    </div>
                    <div class="info-field-row">
                      <span class="info-field-label">ឈ្មោះជាភាសាខ្មែរ</span>
                      <span id="modalDetailNameKh" class="info-field-val">ឈ្មោះសិស្ស</span>
                    </div>
                    <div class="info-field-row">
                      <span class="info-field-label">ឈ្មោះជាអក្សរឡាតាំង</span>
                      <span id="modalDetailNameEn" class="info-field-val">—</span>
                    </div>
                    <div class="info-field-row">
                      <span class="info-field-label">ភេទ</span>
                      <span id="modalDetailGender" class="info-field-val">ប្រុស</span>
                    </div>
                    <div class="info-field-row">
                      <span class="info-field-label">ថ្ងៃខែឆ្នាំកំណើត</span>
                      <span id="modalDetailDob" class="info-field-val">2006-01-01</span>
                    </div>
                    <div class="info-field-row">
                      <span class="info-field-label">លេខទូរស័ព្ទផ្ទាល់ខ្លួន</span>
                      <span id="modalDetailPhone" class="info-field-val">—</span>
                    </div>
                    <div class="info-field-row">
                      <span class="info-field-label">អាសយដ្ឋាន/ខេត្ត</span>
                      <span id="modalDetailAddress" class="info-field-val">—</span>
                    </div>
                    <div class="info-field-row">
                      <span class="info-field-label">កាលបរិច្ឆេទចុះឈ្មោះ</span>
                      <span id="modalDetailCreatedAt" class="info-field-val">—</span>
                    </div>
                  </div>

                  <!-- Section B: Academic & Credentials -->
                  <div class="info-card-section">
                    <h4 class="info-card-title"><i class="fa-solid fa-laptop-code text-indigo-500"></i> ព័ត៌មានការសិក្សា & គណនី (Academic & Account)</h4>
                    <div class="info-field-row">
                      <span class="info-field-label">ថ្នាក់សិក្សា</span>
                      <span id="modalDetailGrade" class="info-field-val badge badge-grade">ថ្នាក់កុំព្យូទ័រ</span>
                    </div>
                    <div class="info-field-row">
                      <span class="info-field-label">វគ្គសិក្សា</span>
                      <span id="modalDetailCourse" class="info-field-val badge-course">Typing</span>
                    </div>
                    <div class="info-field-row">
                      <span class="info-field-label">វេនសិក្សា</span>
                      <span id="modalDetailShift" class="info-field-val">ព្រឹក</span>
                    </div>
                    <div class="info-field-row">
                      <span class="info-field-label">ថ្ងៃចូលរៀន</span>
                      <span id="modalDetailStartDate" class="info-field-val">—</span>
                    </div>
                    <div class="info-field-row">
                      <span class="info-field-label">ស្ថានភាពសិស្ស</span>
                      <span id="modalDetailStatus" class="info-field-val status-indicator">កំពុងសិក្សា</span>
                    </div>

                    <!-- Credentials Box -->
                    <div style="background: rgba(99, 102, 241, 0.08); border: 1.5px dashed rgba(99, 102, 241, 0.35); border-radius: 10px; padding: 12px 14px; margin-top: 14px;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <span style="font-weight: 700; color: #4338ca; font-size: 0.85rem;"><i class="fa-solid fa-key"></i> គណនីចូលប្រព័ន្ធ (Student Login)</span>
                        <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #059669; font-size: 0.72rem; padding: 2px 8px; border-radius: 10px;">
                          <i class="fa-solid fa-check-circle"></i> Ready
                        </span>
                      </div>
                      <div style="display: flex; gap: 14px; flex-wrap: wrap; font-size: 0.85rem;">
                        <span>Username: <code id="modalDetailLoginUser" class="font-mono font-bold" style="background: rgba(0,0,0,0.06); padding: 2px 6px; border-radius: 4px; color: #4338ca;">TX-1001</code></span>
                        <span>PIN: <code id="modalDetailLoginPin" class="font-mono font-bold" style="background: rgba(0,0,0,0.06); padding: 2px 6px; border-radius: 4px; color: #4338ca;">123</code></span>
                      </div>
                    </div>
                  </div>

                  <!-- Section C: Study Duration Progress Bar (Full Width) -->
                  <div class="info-card-section" style="grid-column: 1 / -1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                      <strong style="color: var(--text-main); font-size: 0.9rem;"><i class="fa-solid fa-clock-rotate-left text-indigo-500"></i> វឌ្ឍនភាពថ្ងៃសិក្សា (Study Duration):</strong>
                      <span id="modalDetailDaysStudied" class="badge-days-studied"></span>
                    </div>
                    <div class="duration-progress-bar" style="height: 8px;">
                      <div class="duration-progress-fill" id="modalDetailProgressBar" style="width: 0%;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-muted); margin-top: 6px;">
                      <span>ថ្ងៃបញ្ចប់ (ប៉ាន់ស្មាន): <strong id="modalDetailEndDate" style="color: var(--text-main);">—</strong></span>
                      <span id="modalDetailDaysRemaining" style="font-weight: 600; color: var(--primary);">បានរៀន — ថ្ងៃ</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ========================================== -->
              <!-- Tab 3: គ្រួសារ (Family / Guardian) -->
              <!-- ========================================== -->
              <div class="student-tab-pane" id="pane-family">
                <div class="info-card-section">
                  <h4 class="info-card-title"><i class="fa-solid fa-people-roof text-indigo-500"></i> ព័ត៌មានអាណាព្យាបាល & ទំនាក់ទំនងបន្ទាន់ (Family & Guardian)</h4>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
                    <div class="info-field-row" style="border-bottom: 1px solid #f1f5f9;">
                      <span class="info-field-label">ឈ្មោះឪពុក (Father's Name)</span>
                      <span id="familyFatherName" class="info-field-val">—</span>
                    </div>
                    <div class="info-field-row" style="border-bottom: 1px solid #f1f5f9;">
                      <span class="info-field-label">ឈ្មោះម្តាយ (Mother's Name)</span>
                      <span id="familyMotherName" class="info-field-val">—</span>
                    </div>
                    <div class="info-field-row" style="border-bottom: 1px solid #f1f5f9;">
                      <span class="info-field-label">លេខទូរស័ព្ទអាណាព្យាបាល</span>
                      <span id="modalDetailGuardianPhone" class="info-field-val">—</span>
                    </div>
                    <div class="info-field-row" style="border-bottom: 1px solid #f1f5f9;">
                      <span class="info-field-label">ទំនាក់ទំនងពេលមានអាសន្ន</span>
                      <span id="familyEmergencyContact" class="info-field-val">—</span>
                    </div>
                    <div class="info-field-row" style="border-bottom: 1px solid #f1f5f9; grid-column: 1 / -1;">
                      <span class="info-field-label">អាសយដ្ឋានគ្រួសារ</span>
                      <span id="familyAddress" class="info-field-val">—</span>
                    </div>
                    <div class="info-field-row" style="grid-column: 1 / -1;">
                      <span class="info-field-label">កំណត់ចំណាំបន្ថែម</span>
                      <span id="familyNote" class="info-field-val text-muted">មិនមានកំណត់ចំណាំពិសេសទេ</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ========================================== -->
              <!-- Tab 4: លទ្ធផលសិក្សា (Academic & Exams Ladder) -->
              <!-- ========================================== -->
              <div class="student-tab-pane" id="pane-exams">
                <div class="info-card-section">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                    <h4 class="info-card-title" style="margin: 0; border: none; padding: 0;">
                      <i class="fa-solid fa-award" style="color: #8b5cf6;"></i> លទ្ធផលប្រលងបញ្ចប់វគ្គកុំព្យូទ័រទាំង ៤ (Computer Module Exams)
                    </h4>
                    <button type="button" id="modalPrintTranscriptBtn" class="btn-secondary" style="height: 30px; padding: 0 12px; font-size: 0.78rem;">
                      <i class="fa-solid fa-print"></i> ព្រឹត្តិបត្រពិន្ទុ
                    </button>
                  </div>

                  <div id="modalDetailExamSection">
                    <div class="exam-ladder-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; text-align: center;">
                      <!-- Step 1: Typing -->
                      <div class="exam-ladder-step" id="modalExamTyping" style="background: var(--border-light); padding: 12px 8px; border-radius: 8px; border-top: 3px solid #8b5cf6;">
                        <div style="font-size: 0.75rem; font-weight: 700; color: #8b5cf6;">1. Typing</div>
                        <div class="ladder-score" style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin: 4px 0;">—</div>
                        <div class="ladder-badge text-xs text-muted">មិនទាន់ប្រលង</div>
                      </div>

                      <!-- Step 2: Word -->
                      <div class="exam-ladder-step" id="modalExamWord" style="background: var(--border-light); padding: 12px 8px; border-radius: 8px; border-top: 3px solid #185abd;">
                        <div style="font-size: 0.75rem; font-weight: 700; color: #185abd;">2. Word</div>
                        <div class="ladder-score" style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin: 4px 0;">—</div>
                        <div class="ladder-badge text-xs text-muted">មិនទាន់ប្រលង</div>
                      </div>

                      <!-- Step 3: Excel -->
                      <div class="exam-ladder-step" id="modalExamExcel" style="background: var(--border-light); padding: 12px 8px; border-radius: 8px; border-top: 3px solid #107c41;">
                        <div style="font-size: 0.75rem; font-weight: 700; color: #107c41;">3. Excel</div>
                        <div class="ladder-score" style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin: 4px 0;">—</div>
                        <div class="ladder-badge text-xs text-muted">មិនទាន់ប្រលង</div>
                      </div>

                      <!-- Step 4: PowerPoint -->
                      <div class="exam-ladder-step" id="modalExamPowerPoint" style="background: var(--border-light); padding: 12px 8px; border-radius: 8px; border-top: 3px solid #d83b01;">
                        <div style="font-size: 0.75rem; font-weight: 700; color: #d83b01;">4. PowerPoint</div>
                        <div class="ladder-score" style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin: 4px 0;">—</div>
                        <div class="ladder-badge text-xs text-muted">មិនទាន់ប្រលង</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ========================================== -->
              <!-- Tab 5: អវត្តមាន (Attendance & Absence) -->
              <!-- ========================================== -->
              <div class="student-tab-pane" id="pane-attendance">
                <div class="info-card-section">
                  <h4 class="info-card-title"><i class="fa-regular fa-calendar-check text-emerald-500"></i> សង្ខេបវត្តមាន & អវត្តមាន (Attendance Breakdown)</h4>
                  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; text-align: center; margin-bottom: 16px;">
                    <div style="background: var(--border-light); padding: 10px 12px; border-radius: 8px;">
                      <div class="text-muted" style="font-size: 0.75rem;">កត់ត្រាសរុប</div>
                      <strong id="modalDetailAttTotal" style="font-size: 1.25rem; color: var(--text-main);">0 ថ្ងៃ</strong>
                    </div>
                    <div style="background: rgba(16, 185, 129, 0.1); padding: 10px 12px; border-radius: 8px; color: #059669;">
                      <div style="font-size: 0.75rem;">វត្តមាន (Present)</div>
                      <strong id="modalDetailAttPresent" style="font-size: 1.25rem;">0 ថ្ងៃ</strong>
                    </div>
                    <div style="background: rgba(245, 158, 11, 0.1); padding: 10px 12px; border-radius: 8px; color: #d97706;">
                      <div style="font-size: 0.75rem;">ច្បាប់ (Permission)</div>
                      <strong id="modalDetailAttPerm" style="font-size: 1.25rem;">0 ថ្ងៃ</strong>
                    </div>
                    <div style="background: rgba(239, 68, 68, 0.1); padding: 10px 12px; border-radius: 8px; color: #dc2626;">
                      <div style="font-size: 0.75rem;">អវត្តមាន (Absent)</div>
                      <strong id="modalDetailAttAbsent" style="font-size: 1.25rem;">0 ថ្ងៃ</strong>
                    </div>
                  </div>

                  <!-- Recent Attendance Log List -->
                  <div id="modalAttendanceLogContainer" style="max-height: 200px; overflow-y: auto; font-size: 0.84rem;">
                    <!-- Filled dynamically -->
                  </div>
                </div>
              </div>

              <!-- ========================================== -->
              <!-- Tab 6: សេវាផ្សេងៗ (Other Services & ID Card) -->
              <!-- ========================================== -->
              <div class="student-tab-pane" id="pane-services">
                <div class="info-card-section" style="text-align: center;">
                  <h4 class="info-card-title" style="justify-content: center;"><i class="fa-solid fa-id-card text-indigo-500"></i> កាតសិស្សផ្លូវការ (Official Student ID Card)</h4>
                  <!-- Printable Student ID Card Preview -->
                  <div class="id-card-preview-wrapper" style="margin: 12px auto;">
                    <div id="printableIdCard" class="id-card-element">
                      <div class="id-card-header">
                        <div>
                          <div class="school-name">សាលាអន្តរជាតិ MASTERSCHOOL</div>
                          <div class="card-tag">STUDENT IDENTITY CARD</div>
                        </div>
                        <div style="font-size: 20px;">🎓</div>
                      </div>
                      <div class="id-card-body">
                        <img id="cardPreviewAvatar" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23e2e8f0'/%3E%3Cpath d='M50 48a16 16 0 100-32 16 16 0 000 32zm0 8c-18 0-32 12-32 26v4h64v-4c0-14-14-26-32-26z' fill='%2394a3b8'/%3E%3C/svg%3E" alt="Avatar" class="id-card-avatar">
                        <div class="id-card-details">
                          <h4 id="cardPreviewNameKh">ឈ្មោះសិស្ស</h4>
                          <div id="cardPreviewNameEn" class="id-en">Student Name</div>
                          <div class="info-row">អត្តលេខ: <strong id="cardPreviewId" class="font-mono">TX-1001</strong></div>
                          <div class="info-row">ថ្នាក់: <strong id="cardPreviewGrade">ថ្នាក់កុំព្យូទ័រ</strong> <span id="cardPreviewCourse" class="badge-course badge-course-word" style="display:none;"></span></div>
                          <div class="info-row">ថ្ងៃកំណើត: <span id="cardPreviewDob">2006-05-12</span></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style="margin-top: 14px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
                    <button type="button" id="printIdCardBtn" class="btn-primary" style="height: 36px; padding: 0 18px; font-size: 0.85rem;">
                      <i class="fa-solid fa-print"></i> <span>បោះពុម្ពកាតសិស្ស (Print ID Card)</span>
                    </button>
                    <button type="button" id="servicesCertBtn" class="btn-secondary" style="height: 36px; padding: 0 16px; font-size: 0.85rem;">
                      <i class="fa-solid fa-award text-amber-500"></i> <span>ចេញវិញ្ញាបនបត្រឌីជីថល</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 1.3 Modal Bottom Footer -->
          <div class="student-modal-footer">
            <button type="button" class="btn-footer-close" data-close-modal="studentDetailsModal">
              <i class="fa-solid fa-xmark"></i> <span>បិទ</span>
            </button>
            <div class="footer-right-buttons">
              <button type="button" id="modalFooterEditBtn" class="btn-footer-edit">
                <i class="fa-solid fa-pen-to-square"></i> <span>កែប្រែ</span>
              </button>
              <button type="button" id="modalFooterPrintBtn" class="btn-footer-print">
                <i class="fa-solid fa-print"></i> <span>បោះពុម្ព</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 1.5 Modal: Add New Student Fullscreen 3-Step Wizard -->
      <div id="addStudentModal" class="modal-overlay enroll-fullscreen-overlay">
        <div class="modal-card enroll-fullscreen-card">
          <!-- Header Bar: Burgundy #851349 -->
          <div class="enroll-fs-header">
            <div class="enroll-fs-title-box">
              <i class="fa-solid fa-user-plus"></i>
              <h2>ទម្រង់បែបបទចុះឈ្មោះសិស្សថ្មី</h2>
            </div>
            <div class="enroll-fs-header-right">
              <div id="enrollWelcomeAlert" class="enroll-welcome-alert">
                <i class="fa-solid fa-circle-info" style="color: #1890ff;"></i>
                <span>សូមស្វាគមន៍មកកាន់ប្រព័ន្ធគ្រប់គ្រងសាលា សូមចុះឈ្មោះសិស្សថ្មី។</span>
                <button type="button" class="enroll-alert-close-btn" onclick="App.dismissEnrollAlert()" title="បិទការជូនដំណឹង">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div class="enroll-header-btns">
                <button type="button" id="btnToggleEnrollFullscreen" class="enroll-hdr-action-btn" onclick="App.toggleEnrollFullscreen()" title="ប្តូរទំហំពេញអេក្រង់/ផ្ទាំងតូច">
                  <i class="fa-solid fa-expand"></i>
                </button>
                <button type="button" class="enroll-hdr-action-btn" data-close-modal="addStudentModal" title="បិទផ្ទាំងចុះឈ្មោះ">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Stepper Navigation Bar: 3 Steps -->
          <div class="enroll-stepper-bar">
            <div class="enroll-stepper-container">
              <div class="enroll-stepper-track">
                <div id="enrollStepperProgress" class="enroll-stepper-progress" style="width: 0%;"></div>
              </div>
              <!-- Step 1: ព័ត៌មានផ្ទាល់ខ្លួន -->
              <button type="button" class="enroll-step-node active" id="enrollStepNode1" onclick="App.goToEnrollStep(1)">
                <div class="enroll-step-circle">១</div>
                <span class="enroll-step-label">ព័ត៌មានផ្ទាល់ខ្លួន</span>
              </button>
              <!-- Step 2: ព័ត៌មានការសិក្សា -->
              <button type="button" class="enroll-step-node" id="enrollStepNode2" onclick="App.goToEnrollStep(2)">
                <div class="enroll-step-circle">២</div>
                <span class="enroll-step-label">ព័ត៌មានការសិក្សា</span>
              </button>
              <!-- Step 3: ព័ត៌មានហិរញ្ញវត្ថុ -->
              <button type="button" class="enroll-step-node" id="enrollStepNode3" onclick="App.goToEnrollStep(3)">
                <div class="enroll-step-circle">៣</div>
                <span class="enroll-step-label">ព័ត៌មានហិរញ្ញវត្ថុ</span>
              </button>
            </div>
          </div>

          <!-- Form Area -->
          <form id="modalAddStudentForm" method="dialog" onsubmit="event.preventDefault(); return false;" style="display: flex; flex-direction: column; flex: 1; overflow: hidden; margin: 0;">
            <div class="enroll-fs-body">
              <div class="enroll-fs-content-wrapper">
                <!-- Sub-header: Title and Student ID -->
                <div class="enroll-subheader-row">
                  <div class="enroll-sub-title">
                    <i id="enrollSubheaderIcon" class="fa-regular fa-user"></i>
                    <span id="enrollSubheaderText">ព័ត៌មានអំពីសិស្ស</span>
                  </div>
                  <div class="enroll-id-pill">
                    <span class="enroll-id-label">អត្តលេខ:</span>
                    <div class="enroll-id-box">
                      <input type="text" id="modalAddStudentIdInput" name="studentId" value="TX-1024" class="enroll-id-input" readonly>
                      <button type="button" id="btnRefreshEnrollStudentId" class="enroll-id-refresh-btn" onclick="App.refreshEnrollStudentId()" title="បង្កើតអត្តលេខថ្មីឡើងវិញ">
                        <i class="fa-solid fa-arrows-rotate"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- STEP 1: ព័ត៌មានផ្ទាល់ខ្លួន (Personal Info) -->
                <div id="enrollStepSection1" class="enroll-step-section">
                  <!-- Circular Avatar Upload in Center -->
                  <div class="enroll-avatar-center-container">
                    <div class="enroll-avatar-circle" id="enrollAvatarCircleTrigger" onclick="document.getElementById('modalAddAvatarFile').click()" title="ចុចដើម្បីជ្រើសរើសរូបថតសិស្ស">
                      <img id="modalAddAvatarPreview" class="enroll-avatar-img" src="" alt="រូបថតសិស្ស" style="display: none;">
                      <div id="enrollAvatarPlaceholder" class="enroll-avatar-placeholder">
                        <i class="fa-solid fa-camera"></i>
                        <span>រូបថតសិស្ស</span>
                      </div>
                      <div class="enroll-avatar-hover-overlay">
                        <i class="fa-solid fa-cloud-arrow-up"></i>
                        <span>ផ្លាស់ប្តូររូបថត</span>
                      </div>
                    </div>
                    <input type="file" id="modalAddAvatarFile" accept="image/*" style="display: none;">
                    <input type="hidden" id="modalAddAvatarInput" name="avatar" value="">
                    <span class="enroll-avatar-hint">(ទំហំអតិបរមា 5MB)</span>
                  </div>

                  <!-- Row 1: ឈ្មោះជាភាសាខ្មែរ & ឈ្មោះជាភាសាអង់គ្លេស (2 cols) -->
                  <div class="enroll-grid-row enroll-cols-2">
                    <div class="enroll-field">
                      <label><i class="fa-regular fa-user"></i> <span>ឈ្មោះជាភាសាខ្មែរ</span> <span class="enroll-req-star">*</span></label>
                      <input type="text" id="enrollInputNameKh" name="nameKh" class="enroll-input-ctrl" placeholder="បញ្ចូលឈ្មោះពេញជាភាសាខ្មែរ" required>
                    </div>
                    <div class="enroll-field">
                      <label><i class="fa-regular fa-id-card"></i> <span>ឈ្មោះជាភាសាអង់គ្លេស (English)</span></label>
                      <input type="text" name="nameEn" class="enroll-input-ctrl" placeholder="Enter Full Name in English">
                    </div>
                  </div>

                  <!-- Row 2: ភេទ (Gender), ថ្ងៃខែឆ្នាំកំណើត (DOB), សញ្ជាតិ (Nationality) -->
                  <div class="enroll-grid-row enroll-cols-3">
                    <div class="enroll-field">
                      <label><span>ភេទ</span> <span class="enroll-req-star">*</span></label>
                      <select name="gender" id="modalAddGenderSelect" class="enroll-input-ctrl" required>
                        <option value="ប្រុស">ប្រុស (Male)</option>
                        <option value="ស្រី">ស្រី (Female)</option>
                      </select>
                    </div>
                    <div class="enroll-field">
                      <label><i class="fa-regular fa-calendar"></i> <span>ថ្ងៃខែឆ្នាំកំណើត</span></label>
                      <input type="date" name="dob" class="enroll-input-ctrl" placeholder="DD/MM/YYYY">
                    </div>
                    <div class="enroll-field">
                      <label><i class="fa-regular fa-flag"></i> <span>សញ្ជាតិ</span></label>
                      <input type="text" name="nationality" class="enroll-input-ctrl" value="ខ្មែរ" placeholder="ឧ. ខ្មែរ">
                    </div>
                  </div>

                  <!-- Row 3: លេខទូរស័ព្ទ & រាជធានី/ខេត្ត (2 cols) -->
                  <div class="enroll-grid-row enroll-cols-2">
                    <div class="enroll-field">
                      <label><i class="fa-solid fa-phone"></i> <span>លេខទូរស័ព្ទសិស្ស</span> <span class="enroll-req-star">*</span></label>
                      <input type="tel" name="phone" class="enroll-input-ctrl" placeholder="012 345 678">
                    </div>
                    <div class="enroll-field">
                      <label><i class="fa-solid fa-location-dot"></i> <span>រាជធានី/ខេត្ត (Province/City)</span></label>
                      <select name="address" class="enroll-input-ctrl">
                        ${APP_CONFIG.provinces.map(p => `<option value="${p}" ${p === 'រាជធានីភ្នំពេញ' ? 'selected' : ''}>${p}</option>`).join('')}
                      </select>
                    </div>
                  </div>

                  <!-- Row 4: ព័ត៌មានសុខភាព (អាឡែស៊ី/ជំងឺប្រចាំកាយ) -->
                  <div class="enroll-grid-row enroll-cols-1">
                    <div class="enroll-field">
                      <label><span>ព័ត៌មានសុខភាព (អាឡែស៊ី/ជំងឺប្រចាំកាយ)</span></label>
                      <input type="text" name="healthNotes" class="enroll-input-ctrl" placeholder="បញ្ជាក់ប្រសិនបើមានប្រតិកម្មអាឡែស៊ី ឬជំងឺប្រចាំកាយ...">
                    </div>
                  </div>
                </div>

                <!-- STEP 2: ព័ត៌មានការសិក្សា (Academic Info) -->
                <div id="enrollStepSection2" class="enroll-step-section" style="display: none;">
                  <!-- Row 1: វគ្គសិក្សាកុំព្យូទ័រ & វេនសិក្សា -->
                  <div class="enroll-grid-row enroll-cols-2">
                    <div class="enroll-field">
                      <label><i class="fa-solid fa-laptop-code"></i> <span>វគ្គសិក្សាកុំព្យូទ័រ (Computer Course)</span> <span class="enroll-req-star">*</span></label>
                      <select name="course" id="modalAddCourseSelect" class="enroll-input-ctrl" required onchange="App.calculateEnrollFees()">
                        <option value="">-- សូមជ្រើសរើសវគ្គសិក្សាកុំព្យូទ័រ --</option>
                        ${APP_CONFIG.computerCourses.map(c => `<option value="${c.name}">${c.name} (${c.desc})</option>`).join('')}
                      </select>
                      <input type="hidden" name="grade" value="ថ្នាក់កុំព្យូទ័រ">
                    </div>
                    <div class="enroll-field">
                      <label><i class="fa-regular fa-clock"></i> <span>វេនសិក្សា (Study Shift)</span> <span class="enroll-req-star">*</span></label>
                      <select name="shift" class="enroll-input-ctrl">
                        ${APP_CONFIG.shifts.map(s => `<option value="${s.id}">${s.label}</option>`).join('')}
                      </select>
                    </div>
                  </div>

                  <!-- Row 2: ថ្ងៃចូលរៀន & ថ្ងៃបញ្ចប់វគ្គ -->
                  <div class="enroll-grid-row enroll-cols-2">
                    <div class="enroll-field">
                      <label><i class="fa-regular fa-calendar-check"></i> <span>ថ្ងៃចូលរៀន (Start Date)</span> <span class="enroll-req-star">*</span></label>
                      <input type="date" name="startDate" id="modalAddStartDate" class="enroll-input-ctrl" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="enroll-field">
                      <label><i class="fa-regular fa-calendar-xmark"></i> <span>ថ្ងៃបញ្ចប់វគ្គ (Estimated End Date)</span></label>
                      <input type="date" name="endDate" class="enroll-input-ctrl">
                    </div>
                  </div>

                  <!-- Row 3: ស្ថានភាពសិស្ស & PIN -->
                  <div class="enroll-grid-row enroll-cols-2">
                    <div class="enroll-field">
                      <label><span>ស្ថានភាពសិស្ស (Status)</span></label>
                      <select name="status" class="enroll-input-ctrl">
                        <option value="Active">កំពុងសិក្សា (Active)</option>
                        <option value="Inactive">ផ្អាកការសិក្សា (Inactive)</option>
                        <option value="Graduated">បញ្ចប់ការសិក្សា (Graduated)</option>
                      </select>
                    </div>
                    <div class="enroll-field">
                      <label><i class="fa-solid fa-key"></i> <span>លេខកូដសម្ងាត់សិស្ស (Student Login PIN)</span> <span class="text-xs text-muted">(លំនាំដើម: 123)</span></label>
                      <input type="text" name="pin" class="enroll-input-ctrl" placeholder="123" value="123">
                    </div>
                  </div>
                </div>

                <!-- STEP 3: ព័ត៌មានហិរញ្ញវត្ថុ (Financial Info) -->
                <div id="enrollStepSection3" class="enroll-step-section" style="display: none;">
                  <!-- Financial KPI Cards -->
                  <div class="enroll-kpi-row">
                    <div class="enroll-kpi-card enroll-kpi-total">
                      <span class="enroll-kpi-label"><i class="fa-solid fa-tags"></i> ថ្លៃសិក្សាសរុប (Course Fee)</span>
                      <span class="enroll-kpi-value" id="enrollDisplayTotalFee">$50.00</span>
                      <input type="hidden" name="totalFee" id="enrollInputTotalFee" value="50">
                    </div>
                    <div class="enroll-kpi-card enroll-kpi-paid">
                      <span class="enroll-kpi-label"><i class="fa-solid fa-money-bill-wave"></i> ទឹកប្រាក់បង់ដំបូង (Initial Payment)</span>
                      <div style="display: flex; align-items: center; gap: 4px;">
                        <span style="font-size: 1.2rem; font-weight: 700; color: #16a34a;">$</span>
                        <input type="number" step="0.5" min="0" max="500" name="paidFee" id="enrollInputPaidFee" value="50" oninput="App.calculateEnrollFees()" style="border: 1px solid #86efac; border-radius: 6px; padding: 4px 8px; font-weight: 800; font-size: 1.2rem; color: #16a34a; width: 100px; outline: none; background: #fff;">
                      </div>
                    </div>
                    <div class="enroll-kpi-card enroll-kpi-balance zero" id="enrollKpiBalanceCard">
                      <span class="enroll-kpi-label"><i class="fa-solid fa-scale-balanced"></i> នៅខ្វះ (Balance Due)</span>
                      <span class="enroll-kpi-value" id="enrollDisplayBalance">$0.00</span>
                    </div>
                  </div>

                  <!-- Row 1: វិធីសាស្ត្រទូទាត់ & ស្ថានភាពទូទាត់ -->
                  <div class="enroll-grid-row enroll-cols-2">
                    <div class="enroll-field">
                      <label><i class="fa-solid fa-credit-card"></i> <span>វិធីសាស្ត្រទូទាត់ (Payment Method)</span></label>
                      <select name="paymentMethod" class="enroll-input-ctrl">
                        <option value="ABA KHQR">ABA KHQR</option>
                        <option value="សាច់ប្រាក់ផ្ទាល់ (Cash)">សាច់ប្រាក់ផ្ទាល់ (Cash)</option>
                        <option value="Wing Bank">Wing Bank</option>
                        <option value="ACLEDA Bank">ACLEDA Bank</option>
                      </select>
                    </div>
                    <div class="enroll-field">
                      <label><i class="fa-solid fa-circle-check"></i> <span>ស្ថានភាពទូទាត់ (Payment Status)</span></label>
                      <select name="paymentStatus" id="enrollSelectPaymentStatus" class="enroll-input-ctrl">
                        <option value="Paid">បានបង់គ្រប់ចំនួន (Paid in Full)</option>
                        <option value="Partial">បានបង់មួយចំនួន (Partial Payment)</option>
                        <option value="Pending">មិនទាន់បង់ (Pending Payment)</option>
                      </select>
                    </div>
                  </div>

                  <!-- Row 2: លេខវិក្កយបត្រ & កំណត់សម្គាល់បន្ថែម -->
                  <div class="enroll-grid-row enroll-cols-2">
                    <div class="enroll-field">
                      <label><i class="fa-solid fa-receipt"></i> <span>លេខវិក្កយបត្រ (Invoice No.)</span></label>
                      <input type="text" name="receiptNo" id="enrollInputReceiptNo" class="enroll-input-ctrl font-mono" readonly value="INV-2026-1024">
                    </div>
                    <div class="enroll-field">
                      <label><span>កំណត់សម្គាល់បន្ថែម (Payment Note)</span></label>
                      <input type="text" name="paymentNote" class="enroll-input-ctrl" placeholder="សម្គាល់បន្ថែមលើការបង់ប្រាក់..." value="បង់ថ្លៃសិក្សាពេលចុះឈ្មោះ">
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Action Controls: Step 1, 2, 3 buttons -->
            <div class="enroll-fs-footer">
              <!-- Left Action Button -->
              <div id="enrollFooterLeft">
                <button type="button" class="btn-enroll-cancel" data-close-modal="addStudentModal">
                  <i class="fa-solid fa-xmark"></i>
                  <span>បោះបង់</span>
                </button>
              </div>

              <!-- Right Action Buttons -->
              <div id="enrollFooterRight">
                <button type="button" id="btnEnrollNextStep" class="btn-enroll-next" onclick="App.nextEnrollStep()">
                  <span>បន្ទាប់: ព័ត៌មានការសិក្សា</span>
                  <i class="fa-solid fa-arrow-right"></i>
                </button>
                <button type="submit" id="btnEnrollSubmit" class="btn-enroll-submit" style="display: none;">
                  <i class="fa-solid fa-check"></i>
                  <span>រក្សាទុក និងចុះឈ្មោះសិស្ស</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- 2. Modal: Edit Student Fullscreen / Modern Wizard -->
      <div id="editModal" class="modal-overlay enroll-fullscreen-overlay">
        <div class="modal-card enroll-fullscreen-card">
          <!-- Header Bar: Burgundy #851349 -->
          <div class="enroll-fs-header">
            <div class="enroll-fs-title-box">
              <i class="fa-solid fa-user-pen"></i>
              <h2>ទម្រង់កែប្រែទិន្នន័យសិស្ស</h2>
            </div>
            <div class="enroll-fs-header-right">
              <div class="enroll-header-btns">
                <button type="button" id="btnToggleEditFullscreen" class="enroll-hdr-action-btn" onclick="App.toggleEditFullscreen()" title="ប្តូរទំហំពេញអេក្រង់/ផ្ទាំងតូច">
                  <i class="fa-solid fa-expand"></i>
                </button>
                <button type="button" class="enroll-hdr-action-btn" data-close-modal="editModal" title="បិទផ្ទាំងកែប្រែ">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Stepper Navigation Bar: 2 Steps -->
          <div class="enroll-stepper-bar">
            <div class="enroll-stepper-container" style="max-width: 520px;">
              <div class="enroll-stepper-track" style="left: 45px; right: 45px;">
                <div id="editStepperProgress" class="enroll-stepper-progress" style="width: 0%;"></div>
              </div>
              <!-- Step 1: ព័ត៌មានផ្ទាល់ខ្លួន -->
              <button type="button" class="enroll-step-node active" id="editStepNode1" onclick="App.goToEditStep(1)">
                <div class="enroll-step-circle">១</div>
                <span class="enroll-step-label">ព័ត៌មានផ្ទាល់ខ្លួន</span>
              </button>
              <!-- Step 2: ព័ត៌មានការសិក្សា -->
              <button type="button" class="enroll-step-node" id="editStepNode2" onclick="App.goToEditStep(2)">
                <div class="enroll-step-circle">២</div>
                <span class="enroll-step-label">ព័ត៌មានការសិក្សា</span>
              </button>
            </div>
          </div>

          <!-- Form Area -->
          <form id="editStudentForm" method="dialog" onsubmit="event.preventDefault(); return false;" style="display: flex; flex-direction: column; flex: 1; overflow: hidden; margin: 0;">
            <input type="hidden" name="id">
            <input type="hidden" name="createdAt">

            <div class="enroll-fs-body">
              <div class="enroll-fs-content-wrapper">
                <!-- Sub-header: Title and Student ID -->
                <div class="enroll-subheader-row">
                  <div class="enroll-sub-title">
                    <i id="editSubheaderIcon" class="fa-regular fa-user"></i>
                    <span id="editSubheaderText">ព័ត៌មានអំពីសិស្ស</span>
                  </div>
                  <div class="enroll-id-pill">
                    <span class="enroll-id-label">អត្តលេខ:</span>
                    <div class="enroll-id-box">
                      <input type="text" id="editModalStudentIdDisplay" class="enroll-id-input" readonly value="TX-1001">
                    </div>
                  </div>
                </div>

                <!-- STEP 1: ព័ត៌មានផ្ទាល់ខ្លួន (Personal Info) -->
                <div id="editStepSection1" class="enroll-step-section">
                  <!-- Circular Avatar Upload in Center -->
                  <div class="enroll-avatar-center-container">
                    <div class="enroll-avatar-circle" id="editAvatarCircleTrigger" onclick="document.getElementById('editAvatarFile').click()" title="ចុចដើម្បីផ្លាស់ប្តូររូបថតសិស្ស">
                      <img id="editAvatarPreview" class="enroll-avatar-img" src="" alt="រូបថតសិស្ស" style="display: none;">
                      <div id="editAvatarPlaceholder" class="enroll-avatar-placeholder">
                        <i class="fa-solid fa-camera"></i>
                        <span>រូបថតសិស្ស</span>
                      </div>
                      <div class="enroll-avatar-hover-overlay">
                        <i class="fa-solid fa-cloud-arrow-up"></i>
                        <span>ផ្លាស់ប្តូររូបថត</span>
                      </div>
                    </div>
                    <input type="file" id="editAvatarFile" accept="image/*" style="display: none;">
                    <input type="hidden" id="editAvatarInput" name="avatar" value="">
                    <span class="enroll-avatar-hint">(ទំហំអតិបរមា 5MB)</span>
                  </div>

                  <!-- Row 1: ឈ្មោះជាភាសាខ្មែរ & ឈ្មោះជាភាសាអង់គ្លេស (2 cols) -->
                  <div class="enroll-grid-row enroll-cols-2">
                    <div class="enroll-field">
                      <label><i class="fa-regular fa-user"></i> <span>ឈ្មោះជាភាសាខ្មែរ</span> <span class="enroll-req-star">*</span></label>
                      <input type="text" id="editInputNameKh" name="nameKh" class="enroll-input-ctrl" placeholder="បញ្ចូលឈ្មោះពេញជាភាសាខ្មែរ" required>
                    </div>
                    <div class="enroll-field">
                      <label><i class="fa-regular fa-id-card"></i> <span>ឈ្មោះជាភាសាអង់គ្លេស (English)</span></label>
                      <input type="text" name="nameEn" class="enroll-input-ctrl" placeholder="Enter Full Name in English">
                    </div>
                  </div>

                  <!-- Row 2: ភេទ (Gender), ថ្ងៃខែឆ្នាំកំណើត (DOB), សញ្ជាតិ (Nationality) -->
                  <div class="enroll-grid-row enroll-cols-3">
                    <div class="enroll-field">
                      <label><span>ភេទ</span> <span class="enroll-req-star">*</span></label>
                      <select name="gender" class="enroll-input-ctrl" required>
                        <option value="ប្រុស">ប្រុស (Male)</option>
                        <option value="ស្រី">ស្រី (Female)</option>
                      </select>
                    </div>
                    <div class="enroll-field">
                      <label><i class="fa-regular fa-calendar"></i> <span>ថ្ងៃខែឆ្នាំកំណើត</span></label>
                      <input type="date" name="dob" class="enroll-input-ctrl" placeholder="DD/MM/YYYY">
                    </div>
                    <div class="enroll-field">
                      <label><i class="fa-regular fa-flag"></i> <span>សញ្ជាតិ</span></label>
                      <input type="text" name="nationality" class="enroll-input-ctrl" value="ខ្មែរ" placeholder="ឧ. ខ្មែរ">
                    </div>
                  </div>

                  <!-- Row 3: លេខទូរស័ព្ទ & រាជធានី/ខេត្ត (2 cols) -->
                  <div class="enroll-grid-row enroll-cols-2">
                    <div class="enroll-field">
                      <label><i class="fa-solid fa-phone"></i> <span>លេខទូរស័ព្ទសិស្ស</span> <span class="enroll-req-star">*</span></label>
                      <input type="tel" name="phone" class="enroll-input-ctrl" placeholder="012 345 678">
                    </div>
                    <div class="enroll-field">
                      <label><i class="fa-solid fa-location-dot"></i> <span>រាជធានី/ខេត្ត (Province/City)</span></label>
                      <select name="address" class="enroll-input-ctrl">
                        ${APP_CONFIG.provinces.map(p => `<option value="${p}">${p}</option>`).join('')}
                      </select>
                    </div>
                  </div>

                  <!-- Row 4: ព័ត៌មានសុខភាព (អាឡែស៊ី/ជំងឺប្រចាំកាយ) -->
                  <div class="enroll-grid-row enroll-cols-1">
                    <div class="enroll-field">
                      <label><span>ព័ត៌មានសុខភាព (អាឡែស៊ី/ជំងឺប្រចាំកាយ)</span></label>
                      <input type="text" name="healthNotes" class="enroll-input-ctrl" placeholder="បញ្ជាក់ប្រសិនបើមានប្រតិកម្មអាឡែស៊ី ឬជំងឺប្រចាំកាយ...">
                    </div>
                  </div>
                </div>

                <!-- STEP 2: ព័ត៌មានការសិក្សា (Academic Info) -->
                <div id="editStepSection2" class="enroll-step-section" style="display: none;">
                  <!-- Row 1: វគ្គសិក្សាកុំព្យូទ័រ & វេនសិក្សា -->
                  <div class="enroll-grid-row enroll-cols-2">
                    <div class="enroll-field">
                      <label><i class="fa-solid fa-laptop-code"></i> <span>វគ្គសិក្សាកុំព្យូទ័រ (Computer Course)</span> <span class="enroll-req-star">*</span></label>
                      <select name="course" id="modalEditCourseSelect" class="enroll-input-ctrl" required>
                        <option value="">-- សូមជ្រើសរើសវគ្គសិក្សាកុំព្យូទ័រ --</option>
                        ${APP_CONFIG.computerCourses.map(c => `<option value="${c.name}">${c.name} (${c.desc})</option>`).join('')}
                      </select>
                      <input type="hidden" name="grade" value="ថ្នាក់កុំព្យូទ័រ">
                    </div>
                    <div class="enroll-field">
                      <label><i class="fa-regular fa-clock"></i> <span>វេនសិក្សា (Study Shift)</span> <span class="enroll-req-star">*</span></label>
                      <select name="shift" class="enroll-input-ctrl">
                        ${APP_CONFIG.shifts.map(s => `<option value="${s.id}">${s.label}</option>`).join('')}
                      </select>
                    </div>
                  </div>

                  <!-- Row 2: ថ្ងៃចូលរៀន & ថ្ងៃបញ្ចប់វគ្គ -->
                  <div class="enroll-grid-row enroll-cols-2">
                    <div class="enroll-field">
                      <label><i class="fa-regular fa-calendar-check"></i> <span>ថ្ងៃចូលរៀន (Start Date)</span> <span class="enroll-req-star">*</span></label>
                      <input type="date" name="startDate" class="enroll-input-ctrl">
                    </div>
                    <div class="enroll-field">
                      <label><i class="fa-regular fa-calendar-xmark"></i> <span>ថ្ងៃបញ្ចប់វគ្គ (Estimated End Date)</span></label>
                      <input type="date" name="endDate" class="enroll-input-ctrl">
                    </div>
                  </div>

                  <!-- Row 3: ស្ថានភាពសិស្ស & PIN -->
                  <div class="enroll-grid-row enroll-cols-2">
                    <div class="enroll-field">
                      <label><span>ស្ថានភាពសិស្ស (Status)</span></label>
                      <select name="status" class="enroll-input-ctrl">
                        <option value="Active">កំពុងសិក្សា (Active)</option>
                        <option value="Inactive">ផ្អាកការសិក្សា (Inactive)</option>
                        <option value="Graduated">បញ្ចប់ការសិក្សា (Graduated)</option>
                      </select>
                    </div>
                    <div class="enroll-field">
                      <label><i class="fa-solid fa-key"></i> <span>លេខកូដសម្ងាត់សិស្ស (Student Login PIN)</span> <span class="text-xs text-muted">(លំនាំដើម: 123)</span></label>
                      <input type="text" name="pin" class="enroll-input-ctrl" placeholder="123" value="123">
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Action Controls -->
            <div class="enroll-fs-footer">
              <!-- Left Action Button -->
              <div id="editFooterLeft">
                <button type="button" class="btn-enroll-cancel" data-close-modal="editModal">
                  <i class="fa-solid fa-xmark"></i>
                  <span>បោះបង់</span>
                </button>
              </div>

              <!-- Right Action Buttons -->
              <div id="editFooterRight" style="display: flex; gap: 10px; align-items: center;">
                <button type="button" id="btnEditPrevStep" class="btn-enroll-prev" onclick="App.prevEditStep()" style="display: none;">
                  <i class="fa-solid fa-arrow-left"></i>
                  <span>ត្រឡប់ក្រោយ</span>
                </button>
                <button type="button" id="btnEditNextStep" class="btn-enroll-next" onclick="App.nextEditStep()">
                  <span>បន្ទាប់: ព័ត៌មានការសិក្សា</span>
                  <i class="fa-solid fa-arrow-right"></i>
                </button>
                <button type="submit" id="btnEditSubmit" class="btn-enroll-submit">
                  <i class="fa-solid fa-floppy-disk"></i>
                  <span>រក្សាទុកការកែប្រែ</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- 4. Modal: Official Exam Papers & Test Bank (ឃ្លាំងវិញ្ញាសាប្រឡងកុំព្យូទ័រ) -->
      <div id="examPapersModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 960px; max-height: 90vh; display: flex; flex-direction: column;">
          <div class="modal-header" style="background: linear-gradient(135deg, #0284c7, #2563eb); color: #ffffff;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(255, 255, 255, 0.2); display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
                <i class="fa-solid fa-file-signature"></i>
              </div>
              <div>
                <h3 style="color: #ffffff; margin: 0; font-size: 1.15rem;">📑 ឃ្លាំងវិញ្ញាសាប្រឡងកុំព្យូទ័រផ្លូវការ (Official Exam Papers Bank)</h3>
                <p style="margin: 2px 0 0 0; font-size: 0.78rem; color: rgba(255, 255, 255, 0.85);">
                  វិញ្ញាសាប្រឡងវាស់ស្ទង់សមត្ថភាពសិស្សបញ្ចប់វគ្គ Typing, Word, Excel, PowerPoint ស្របតាមស្តង់ដារបណ្តុះបណ្តាល
                </p>
              </div>
            </div>
            <button type="button" class="modal-close-btn" data-close-modal="examPapersModal" style="color: #ffffff;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Filter course tabs inside modal -->
          <div style="padding: 12px 24px; background: var(--border-light); border-bottom: 1px solid var(--border-color); display: flex; gap: 8px; flex-wrap: wrap; align-items: center; justify-content: space-between;">
            <div class="exam-papers-filter-tabs" style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button type="button" class="btn-paper-filter active" data-paper-course="all">
                <i class="fa-solid fa-layer-group"></i> ទាំងអស់ (11)
              </button>
              <button type="button" class="btn-paper-filter" data-paper-course="Typing">
                <i class="fa-solid fa-keyboard" style="color: #8b5cf6;"></i> Typing (3)
              </button>
              <button type="button" class="btn-paper-filter" data-paper-course="Word">
                <i class="fa-solid fa-file-word" style="color: #185abd;"></i> Word (3)
              </button>
              <button type="button" class="btn-paper-filter" data-paper-course="Excel">
                <i class="fa-solid fa-file-excel" style="color: #107c41;"></i> Excel (3)
              </button>
              <button type="button" class="btn-paper-filter" data-paper-course="PowerPoint">
                <i class="fa-solid fa-file-powerpoint" style="color: #d83b01;"></i> PowerPoint (2)
              </button>
            </div>

            <button type="button" class="btn-secondary" style="height: 32px; padding: 0 12px; font-size: 0.8rem;" onclick="ExamsView.printOfficialExamPaper()">
              <i class="fa-solid fa-print"></i> <span>បោះពុម្ពក្រដាសប្រឡង A4</span>
            </button>
          </div>

          <!-- Papers List Container -->
          <div class="modal-body" id="examPapersListContainer" style="padding: 20px 24px; overflow-y: auto; flex: 1; max-height: calc(90vh - 180px);">
            <!-- Rendered by ExamsView.renderPapersList() -->
          </div>

          <div class="modal-footer" style="padding: 12px 24px; background: var(--border-light); justify-content: space-between;">
            <div class="text-xs text-muted">
              <i class="fa-solid fa-circle-info text-indigo-500"></i> វិញ្ញាសានីមួយៗមានពិន្ទុសរុប ១០០ និងមានតារាង Grading Rubric វាយតម្លៃជាក់លាក់។
            </div>
            <button type="button" class="btn-secondary" data-close-modal="examPapersModal">បិទផ្ទាំង</button>
          </div>
        </div>
      </div>

      <!-- 5. Modal: Interactive Live Typing Test Arena (បន្ទប់ធ្វើតេស្តវាយអត្ថបទកុំព្យូទ័រផ្ទាល់) -->
      <!-- 5. Modal: Interactive Live Exam Arena (សាលប្រឡងផ្ទាល់តាមវគ្គកុំព្យូទ័រ Fullscreen Arena) -->
      <div id="liveTypingModal" class="modal-overlay exam-arena-overlay">
        <div class="modal-card exam-arena-fullscreen-card">
          <!-- Modal Header with Course Selector Tabs -->
          <div class="exam-arena-header" id="arenaHeader">
            <!-- Left: Title, Icon, Subtitle, Badge -->
            <div class="exam-arena-header-left">
              <div id="arenaIconBox" class="exam-arena-icon-box">
                <i class="fa-solid fa-graduation-cap"></i>
              </div>
              <div class="exam-arena-title-area">
                <h3>
                  <span>🚀 សាលប្រឡងផ្ទាល់តាមវគ្គកុំព្យូទ័រ (Live Exam Arena)</span>
                  <span class="badge font-mono" id="arenaCourseBadge" style="background: #8b5cf6; color: #ffffff; font-size: 0.75rem; padding: 3px 10px; border-radius: 6px;">Typing</span>
                </h3>
                <p>ប្រឡងវាស់ស្ទង់សមត្ថភាពជាក់ស្តែង &amp; បញ្ចូលពិន្ទុស្វ័យប្រវត្តិទៅក្នុងប្រព័ន្ធ &amp; Firebase ភ្លាមៗ</p>
              </div>
            </div>

            <!-- Center: 4 Course Tabs Bar -->
            <div class="exam-arena-header-center">
              <div class="arena-course-tabs">
                <button type="button" class="arena-course-tab active" data-arena-course="Typing" onclick="ExamsView.switchExamArenaCourse('Typing')">
                  <i class="fa-solid fa-keyboard" style="color: #8b5cf6;"></i>
                  <span>វគ្គទី ១: Typing</span>
                </button>
                <button type="button" class="arena-course-tab" data-arena-course="Word" onclick="ExamsView.switchExamArenaCourse('Word')">
                  <i class="fa-solid fa-file-word" style="color: #185abd;"></i>
                  <span>វគ្គទី ២: Word</span>
                </button>
                <button type="button" class="arena-course-tab" data-arena-course="Excel" onclick="ExamsView.switchExamArenaCourse('Excel')">
                  <i class="fa-solid fa-file-excel" style="color: #107c41;"></i>
                  <span>វគ្គទី ៣: Excel</span>
                </button>
                <button type="button" class="arena-course-tab" data-arena-course="PowerPoint" onclick="ExamsView.switchExamArenaCourse('PowerPoint')">
                  <i class="fa-solid fa-file-powerpoint" style="color: #d83b01;"></i>
                  <span>វគ្គទី ៤: PowerPoint</span>
                </button>
              </div>
            </div>

            <!-- Right: Fullscreen Toggle & Exit Buttons -->
            <div class="exam-arena-header-right">
              <button type="button" class="btn-arena-fs" id="btnArenaFullscreenToggle" onclick="ExamsView.toggleBrowserFullscreen()" title="ពង្រីកពេញអេក្រង់ (Toggle Fullscreen)">
                <i class="fa-solid fa-expand"></i> <span>ពេញអេក្រង់</span>
              </button>
              <button type="button" class="btn-arena-close" data-close-modal="liveTypingModal" onclick="ExamsView.stopExamSession()" title="ចាកចេញពីសាលប្រឡង (Esc)">
                <i class="fa-solid fa-xmark"></i> <span>ចាកចេញ</span>
              </button>
            </div>
          </div>

          <div class="modal-body exam-arena-body">
            <div class="exam-arena-body-inner">
              <!-- Candidate & Shift Selector Bar -->
            <div style="background: var(--border-light); border-radius: var(--border-radius); padding: 12px 18px; margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 14px; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 12px; flex: 1; min-width: 260px;">
                <label class="form-label" style="margin: 0; font-size: 0.85rem; font-weight: 700; white-space: nowrap;">
                  <i class="fa-solid fa-user-graduate text-purple-600"></i> បេក្ខជនប្រឡង៖
                </label>
                <select id="typingStudentSelect" class="form-control" style="height: 38px; font-size: 0.88rem; font-weight: 600; flex: 1;" onchange="ExamsView.onStudentCandidateChanged(this.value)">
                  <!-- Filled dynamically with students -->
                </select>
              </div>

              <!-- Live Auto-Save Indicator Tag -->
              <div style="display: flex; align-items: center; gap: 8px; background: rgba(16, 185, 129, 0.12); padding: 6px 12px; border-radius: 6px; border: 1px solid rgba(16, 185, 129, 0.3);">
                <i class="fa-solid fa-cloud-arrow-up text-emerald-600" style="font-size: 0.9rem;"></i>
                <span style="font-size: 0.78rem; font-weight: 700; color: #059669;">Auto-Save Live Sync ទៅ Firebase</span>
              </div>
            </div>

            <!-- SECTION A: TYPING ARENA CONTAINER -->
            <div id="arenaTypingContainer">
              <!-- Setup & Config Row -->
              <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--border-radius); padding: 12px 16px; margin-bottom: 14px; display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-end; justify-content: space-between;">
                <!-- Paper Selector -->
                <div style="flex: 1.4; min-width: 220px;">
                  <label class="form-label" style="margin-bottom: 4px; font-size: 0.8rem; font-weight: 700;">ជ្រើសរើសវិញ្ញាសា Typing:</label>
                  <select id="typingPaperSelect" class="form-control" style="height: 38px; font-size: 0.85rem; width: 100%;">
                    <option value="TYP-01">វិញ្ញាសាទី ១: អត្ថបទរឿងនិទានខ្មែរ (Khmer)</option>
                    <option value="TYP-02">វិញ្ញាសាទី ២: អត្ថបទផ្លូវការ (English)</option>
                    <option value="TYP-03">វិញ្ញាសាទី ៣: អត្ថបទចម្រុះខ្មែរ-អង់គ្លេស (Bilingual)</option>
                  </select>
                </div>

                <!-- Time Limit Selector -->
                <div style="width: 140px;">
                  <label class="form-label" style="margin-bottom: 4px; font-size: 0.8rem; font-weight: 700;">ថិរវេលាប្រឡង:</label>
                  <select id="typingDurationSelect" class="form-control" style="height: 38px; font-size: 0.85rem; width: 100%;">
                    <option value="60">១ នាទី (Quick 1m)</option>
                    <option value="180" selected>៣ នាទី (Standard 3m)</option>
                    <option value="300">៥ នាទី (Official 5m)</option>
                  </select>
                </div>

                <!-- Action Controls -->
                <div style="display: flex; gap: 8px;">
                  <button type="button" id="startTypingBtn" class="btn-primary" style="height: 38px; padding: 0 18px; background: #8b5cf6; border-color: #8b5cf6; box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4);" onclick="ExamsView.startTypingTest()">
                    <i class="fa-solid fa-play"></i> <span>ចាប់ផ្តើម</span>
                  </button>
                  <button type="button" id="resetTypingBtn" class="btn-secondary" style="height: 38px; padding: 0 12px;" onclick="ExamsView.resetTypingTest()" title="កំណត់ឡើងវិញ">
                    <i class="fa-solid fa-rotate-right"></i>
                  </button>
                </div>
              </div>

              <!-- Live KPI Counters Bar -->
              <div class="typing-kpi-bar">
                <div class="typing-stat-badge" style="border-left: 4px solid #ef4444;">
                  <div class="typing-stat-val" id="typingTimerVal" style="color: #ef4444; font-family: monospace;">03:00</div>
                  <div class="typing-stat-lbl"><i class="fa-regular fa-clock"></i> ពេលនៅសល់</div>
                </div>

                <div class="typing-stat-badge" style="border-left: 4px solid #8b5cf6;">
                  <div class="typing-stat-val" id="typingWpmVal" style="color: #8b5cf6;">0</div>
                  <div class="typing-stat-lbl"><i class="fa-solid fa-gauge-high"></i> ល្បឿន (WPM)</div>
                </div>

                <div class="typing-stat-badge" style="border-left: 4px solid #10b981;">
                  <div class="typing-stat-val" id="typingAccuracyVal" style="color: #10b981;">100%</div>
                  <div class="typing-stat-lbl"><i class="fa-solid fa-bullseye"></i> ភាពត្រឹមត្រូវ</div>
                </div>

                <div class="typing-stat-badge" style="border-left: 4px solid #f59e0b;">
                  <div class="typing-stat-val" id="typingCharsVal" style="color: #f59e0b;">0</div>
                  <div class="typing-stat-lbl"><i class="fa-solid fa-font"></i> ចំនួនតួអក្សរ</div>
                </div>

                <div class="typing-stat-badge" style="border-left: 4px solid #dc2626;">
                  <div class="typing-stat-val" id="typingErrorsVal" style="color: #dc2626;">0</div>
                  <div class="typing-stat-lbl"><i class="fa-solid fa-triangle-exclamation"></i> កំហុសខុស</div>
                </div>
              </div>

              <!-- Target Text Arena Box -->
              <div style="margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
                <label class="form-label" style="margin: 0; font-size: 0.9rem; font-weight: 700; color: var(--text-main);">
                  <i class="fa-solid fa-quote-left text-purple-500"></i> អត្ថបទវិញ្ញាសាត្រូវវាយ (Target Text):
                </label>
                <span class="text-xs text-muted font-mono font-semibold" id="typingTargetMeta"></span>
              </div>
              <div id="typingTargetDisplay" class="typing-arena-box">
                <!-- Character by character rendered by ExamsView -->
              </div>

              <!-- Student Input Textarea -->
              <div style="margin-bottom: 16px;">
                <label class="form-label" style="margin-bottom: 6px; font-size: 0.9rem; font-weight: 700; color: var(--text-main);">
                  <i class="fa-solid fa-pen-nib text-indigo-500"></i> កន្លែងសិស្សវាយអត្ថបទ (Typing Input Area):
                </label>
                <textarea id="typingInputField" class="form-control typing-input-area" 
                  placeholder="ចុចប៊ូតុង [ចាប់ផ្តើម] ខាងលើ រួចចាប់ផ្តើមវាយអត្ថបទតាមវិញ្ញាសានៅទីនេះ..." 
                  disabled></textarea>
              </div>
            </div>

            <!-- SECTION B: PRACTICAL & THEORY EXAM CONTAINER (Word, Excel, PowerPoint) -->
            <div id="arenaPracticalContainer" style="display: none;">
              <!-- Meta Header Box -->
              <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 10px; padding: 14px 18px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                <div>
                  <h4 style="margin: 0 0 4px 0; font-size: 1.05rem; color: var(--text-main); display: flex; align-items: center; gap: 8px;" id="practicalExamTitle">
                    <span>វិញ្ញាសាប្រឡងអនុវត្តជាក់ស្តែង</span>
                  </h4>
                  <div class="text-xs text-muted" id="practicalExamSubtitle">
                    សរុប ១០ សំណួរ • ពិន្ទុពេញ ១០០ (ជាប់ ≥ ៥០) • ជ្រើសរើសចម្លើយត្រឹមត្រូវ
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
                  <!-- Countdown Timer -->
                  <div class="typing-stat-badge" style="border-left: 3px solid #ef4444; padding: 6px 14px;">
                    <div class="typing-stat-val" id="practicalTimerVal" style="color: #ef4444; font-family: monospace; font-size: 1.25rem;">10:00</div>
                    <div class="typing-stat-lbl"><i class="fa-regular fa-clock"></i> ពេលនៅសល់</div>
                  </div>

                  <!-- Progress Counter -->
                  <div class="typing-stat-badge" style="border-left: 3px solid #10b981; padding: 6px 14px;">
                    <div class="typing-stat-val" id="practicalProgressVal" style="color: #059669; font-size: 1.25rem;">0/10</div>
                    <div class="typing-stat-lbl"><i class="fa-solid fa-check-double"></i> ឆ្លើយបាន</div>
                  </div>
                </div>
              </div>

              <!-- Questions List Mount -->
              <div id="practicalQuestionsList" style="margin-bottom: 20px;">
                <!-- 10 Questions rendered dynamically -->
              </div>

              <!-- Bottom Submit Bar -->
              <div style="background: var(--border-light); border-radius: 10px; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                <span class="text-xs text-muted">
                  💡 គន្លឹះ៖ ពិនិត្យចម្លើយឱ្យបានសព្វគ្រប់មុនពេលចុចប្រគល់។ ប្រព័ន្ធនឹងគណនាពិន្ទុ និងបញ្ចូលទៅក្នុងប្រព័ន្ធសិស្សដោយស្វ័យប្រវត្តិ។
                </span>

                <button type="button" id="btnSubmitPracticalExam" class="btn-primary" style="height: 40px; padding: 0 22px; font-size: 0.9rem; background: linear-gradient(135deg, #10b981, #059669); border: none; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);" onclick="ExamsView.submitCourseExam()">
                  <i class="fa-solid fa-paper-plane"></i> <span>🚀 ប្រគល់កិច្ចការប្រឡង & បញ្ចូលពិន្ទុស្វ័យប្រវត្តិ</span>
                </button>
              </div>
            </div>

            <!-- SECTION C: UNIFIED AUTO-SAVED RESULT CONTAINER -->
            <div id="arenaResultContainer" style="display: none; background: var(--bg-surface); border: 2px solid #10b981; border-radius: 14px; padding: 22px 26px; text-align: center; margin-top: 14px; animation: fadeIn 0.3s ease;">
              <!-- Auto-Save Success Banner (Mandatory Requirement) -->
              <div class="auto-save-success-banner">
                <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
                <span id="autoSaveBannerText">✅ ប្រព័ន្ធបានបញ្ចូលពិន្ទុជាក់ស្តែងចូលទៅក្នុងប្រព័ន្ធ និង Firebase Database ដោយស្វ័យប្រវត្តរួចរាល់!</span>
              </div>

              <div style="display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; border-radius: 50%; background: #10b981; color: #ffffff; font-size: 2rem; margin-bottom: 12px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);">
                <i class="fa-solid fa-trophy"></i>
              </div>
              <h3 style="font-size: 1.35rem; margin: 0 0 6px 0; color: var(--text-main);" id="arenaResultHeaderTitle">🎉 លទ្ធផលការប្រឡងជាក់ស្តែង</h3>
              <p style="margin: 0 0 18px 0; font-size: 0.92rem; color: var(--text-muted);" id="arenaResultStudentInfo">បេក្ខជន៖ ...</p>
              
              <!-- Result KPI Stat Cards -->
              <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; margin-bottom: 20px;">
                <div style="background: var(--border-light); padding: 12px 20px; border-radius: 10px; border: 1px solid var(--border-color); min-width: 120px;">
                  <div style="font-size: 0.76rem; color: var(--text-muted); font-weight: 700;">ពិន្ទុសរុប (Score)</div>
                  <div style="font-size: 1.9rem; font-weight: 800; color: #4f46e5;" id="arenaResultScore">0</div>
                </div>

                <div style="background: var(--border-light); padding: 12px 20px; border-radius: 10px; border: 1px solid var(--border-color); min-width: 120px;">
                  <div style="font-size: 0.76rem; color: var(--text-muted); font-weight: 700;">និទ្ទេស (Grade)</div>
                  <div style="font-size: 1.9rem; font-weight: 800;" id="arenaResultGrade">—</div>
                </div>

                <div style="background: var(--border-light); padding: 12px 20px; border-radius: 10px; border: 1px solid var(--border-color); min-width: 140px;">
                  <div style="font-size: 0.76rem; color: var(--text-muted); font-weight: 700;">លទ្ធផល (Result)</div>
                  <div style="font-size: 1.35rem; font-weight: 800; margin-top: 4px;" id="arenaResultStatus">—</div>
                </div>

                <div style="background: var(--border-light); padding: 12px 20px; border-radius: 10px; border: 1px solid var(--border-color); min-width: 160px;" id="arenaResultExtraBox">
                  <div style="font-size: 0.76rem; color: var(--text-muted); font-weight: 700;" id="arenaResultExtraLbl">ព័ត៌មានលម្អិត</div>
                  <div style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-top: 6px;" id="arenaResultExtraVal">—</div>
                </div>
              </div>

              <!-- Answer Review Mount (For Word, Excel, PowerPoint) -->
              <div id="arenaAnswerReviewMount" style="display: none; text-align: left; margin-bottom: 20px; max-height: 260px; overflow-y: auto; background: var(--border-light); border-radius: 10px; padding: 14px 18px; border: 1px solid var(--border-color);">
                <!-- Review list -->
              </div>

              <!-- Action Controls -->
              <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
                <button type="button" class="btn-secondary" style="height: 40px; padding: 0 18px;" onclick="ExamsView.retakeCurrentExam()">
                  <i class="fa-solid fa-rotate-right"></i> <span>ប្រឡងឡើងវិញម្តងទៀត</span>
                </button>
                <button type="button" class="btn-primary" style="height: 40px; padding: 0 22px; background: #4f46e5; border-color: #4f46e5;" data-close-modal="liveTypingModal" onclick="ExamsView.stopExamSession()">
                  <i class="fa-solid fa-check"></i> <span>✓ រួចរាល់ (Close & Return)</span>
                </button>
              </div>
              </div>
            </div>
          </div>

          <div class="exam-arena-footer">
            <div class="text-xs text-muted" id="arenaFooterHint" style="font-size: 0.84rem; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-lightbulb text-amber-500"></i>
              <span>ប្រព័ន្ធនឹងធ្វើការបញ្ចូលពិន្ទុ និងកត់ត្រាចូលទៅក្នុងប្រវត្តិសិស្ស និង Firebase ដោយស្វ័យប្រវត្តភ្លាមៗពេលបញ្ចប់។ ចុច [Esc] ដើម្បីចាកចេញ។</span>
            </div>
            <button type="button" class="btn-secondary" data-close-modal="liveTypingModal" onclick="ExamsView.stopExamSession()" style="height: 38px; padding: 0 20px; font-weight: 700;">
              <i class="fa-solid fa-xmark"></i> បិទផ្ទាំងសាលប្រឡង
            </button>
          </div>
        </div>
      </div>

      <!-- 6. Modal: Delete Confirmation Dialog -->
      <div id="deleteConfirmModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 420px; text-align: center;">
          <div class="modal-body" style="padding: 32px 24px 20px;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--danger-light); color: var(--danger); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin: 0 auto 16px;">
              <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <h3 style="font-size: 1.15rem; margin-bottom: 8px;">តើអ្នកពិតជាចង់លុបទិន្នន័យនេះមែនទេ?</h3>
            <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;">
              សិស្ស៖ <strong id="deleteStudentName" style="color: var(--text-main);"></strong>
            </p>
            <p style="font-size: 0.78rem; color: var(--danger);">
              * ទិន្នន័យដែលបានលុបនឹងមិនអាចត្រឡប់វិញបានឡើយ!
            </p>
          </div>
          <div class="modal-footer" style="justify-content: center; background: var(--border-light);">
            <button type="button" class="btn-secondary" data-close-modal="deleteConfirmModal">បោះបង់</button>
            <button type="button" id="confirmDeleteBtn" class="btn-primary" style="background: var(--danger);">
              <i class="fa-solid fa-trash"></i>
              <span>យល់ព្រមលុប</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 7. Modal: Record Tuition Payment & Issue Invoice -->
      <div id="recordPaymentModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 600px;">
          <div class="modal-header" style="background: linear-gradient(135deg, #10b981, #059669); color: #ffffff;">
            <h3 style="color: #ffffff; display: flex; align-items: center; gap: 8px; margin: 0; font-size: 1.15rem;">
              <i class="fa-solid fa-cash-register"></i>
              <span>កត់ត្រាការបង់ថ្លៃសិក្សា (Record Tuition Fee)</span>
            </h3>
            <button type="button" class="modal-close-btn" data-close-modal="recordPaymentModal" style="color: #ffffff;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <form id="recordPaymentForm" method="dialog" onsubmit="event.preventDefault(); return false;">
            <div class="modal-body" style="padding: 20px 24px; max-height: 75vh; overflow-y: auto;">
              <div class="form-grid">
                <!-- Student Select -->
                <div class="form-group" style="grid-column: 1 / -1;">
                  <label class="form-label"><span>សិស្សត្រូវបង់ថ្លៃសិក្សា (Student)</span> <span class="required">*</span></label>
                  <select id="payStudentSelect" class="form-control" required style="font-weight: 600;">
                    <!-- Filled dynamically -->
                  </select>
                </div>

                <!-- Course Select -->
                <div class="form-group">
                  <label class="form-label"><span>វគ្គសិក្សាកុំព្យូទ័រ (Course)</span></label>
                  <select id="payCourseSelect" class="form-control">
                    <option value="Typing">Typing (វាយអត្ថបទ)</option>
                    <option value="Microsoft Word">Microsoft Word</option>
                    <option value="Microsoft Excel">Microsoft Excel</option>
                    <option value="Microsoft PowerPoint">Microsoft PowerPoint</option>
                  </select>
                </div>

                <!-- Total Amount -->
                <div class="form-group">
                  <label class="form-label"><span>តម្លៃវគ្គសរុប (Total Amount)</span></label>
                  <div style="position: relative;">
                    <span style="position: absolute; left: 12px; top: 9px; font-weight: 700; color: var(--text-muted);">$</span>
                    <input type="number" id="payTotalAmount" class="form-control" value="50" step="0.5" style="padding-left: 28px; font-weight: 700;" required>
                  </div>
                </div>

                <!-- Paid Amount -->
                <div class="form-group">
                  <label class="form-label"><span>ចំនួនប្រាក់បានបង់ (Paid Amount)</span> <span class="required">*</span></label>
                  <div style="position: relative;">
                    <span style="position: absolute; left: 12px; top: 9px; font-weight: 700; color: #10b981;">$</span>
                    <input type="number" id="payPaidAmount" class="form-control" value="50" step="0.5" style="padding-left: 28px; font-weight: 700; color: #10b981;" required>
                  </div>
                </div>

                <!-- Discount -->
                <div class="form-group">
                  <label class="form-label"><span>បញ្ចុះតម្លៃ (Discount)</span></label>
                  <div style="position: relative;">
                    <span style="position: absolute; left: 12px; top: 9px; font-weight: 700; color: var(--text-muted);">$</span>
                    <input type="number" id="payDiscount" class="form-control" value="0" step="0.5" style="padding-left: 28px;">
                  </div>
                </div>

                <!-- Payment Method -->
                <div class="form-group">
                  <label class="form-label"><span>វិធីសាស្ត្រទូទាត់ (Payment Method)</span></label>
                  <select id="payMethodSelect" class="form-control" style="font-weight: 600;">
                    <option value="ABA KHQR">ABA KHQR (Bakong)</option>
                    <option value="Wing Bank">Wing Bank / WingPay</option>
                    <option value="ACLEDA ToanChet">ACLEDA ទាន់ចិត្ត</option>
                    <option value="សាច់ប្រាក់ផ្ទាល់ (Cash)">សាច់ប្រាក់ផ្ទាល់ (Cash)</option>
                  </select>
                </div>

                <!-- Payment Date -->
                <div class="form-group">
                  <label class="form-label"><span>កាលបរិច្ឆេទបង់ (Payment Date)</span></label>
                  <input type="date" id="payDateInput" class="form-control" value="${new Date().toISOString().split('T')[0]}">
                </div>

                <!-- Note -->
                <div class="form-group" style="grid-column: 1 / -1;">
                  <label class="form-label"><span>កំណត់សម្គាល់ (Note)</span></label>
                  <input type="text" id="payNoteInput" class="form-control" placeholder="ឧ. បង់ថ្លៃវគ្គពេញ ឬបង់មុនពាក់កណ្តាល">
                </div>
              </div>
            </div>
            <div class="modal-footer" style="padding: 14px 24px;">
              <button type="button" class="btn-secondary" data-close-modal="recordPaymentModal">បោះបង់</button>
              <button type="submit" class="btn-primary" style="background: #10b981; border-color: #10b981; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);">
                <i class="fa-solid fa-check"></i>
                <span>កត់ត្រាការបង់ប្រាក់ & ចេញវិក្កយបត្រ</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- 8. Modal: QR Code & Barcode Attendance Fast Scanner -->
      <div id="qrAttendanceModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 580px; text-align: center;">
          <div class="modal-header" style="background: linear-gradient(135deg, #6366f1, #4f46e5); color: #ffffff;">
            <h3 style="color: #ffffff; display: flex; align-items: center; gap: 8px; margin: 0; font-size: 1.15rem;">
              <i class="fa-solid fa-qrcode"></i>
              <span>ស្កេនកាតសិស្សកត់ត្រាវត្តមាន (QR & Barcode Scanner)</span>
            </h3>
            <button type="button" class="modal-close-btn" data-close-modal="qrAttendanceModal" onclick="AttendanceView.stopQrScanner()" style="color: #ffffff;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body" style="padding: 20px 24px;">
            <!-- Camera Viewfinder Box -->
            <div class="qr-scanner-viewport-box">
              <div id="qrReaderContainer" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 0.85rem;">
                <span>ចុច [បើកកាមេរ៉ា] ដើម្បីចាប់ផ្តើមស្កេន</span>
              </div>
              <div class="qr-scan-crosshair"></div>
            </div>

            <!-- Live Camera Controls -->
            <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 16px;">
              <button type="button" id="startCamBtn" class="btn-primary" style="height: 34px; padding: 0 16px; font-size: 0.82rem; background: #6366f1; border-color: #6366f1;" onclick="AttendanceView.startQrScanner()">
                <i class="fa-solid fa-camera"></i> <span>បើកកាមេរ៉ាស្កេន</span>
              </button>
              <button type="button" id="stopCamBtn" class="btn-secondary" style="height: 34px; padding: 0 14px; font-size: 0.82rem; display: none;" onclick="AttendanceView.stopQrScanner()">
                <i class="fa-solid fa-camera-rotate"></i> <span>បិទកាមេរ៉ា</span>
              </button>
            </div>

            <!-- Quick USB Barcode Gun / Manual Input -->
            <div style="background: var(--border-light); padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; text-align: left;">
              <label class="form-label" style="font-weight: 700; font-size: 0.8rem; margin-bottom: 6px;">
                <i class="fa-solid fa-barcode text-indigo-500"></i> ឬស្កេនតាមកាំភ្លើងបាកូដ / វាយអត្តលេខសិស្សផ្ទាល់ (Barcode Gun / ID):
              </label>
              <form id="qrManualScanForm" onsubmit="event.preventDefault(); AttendanceView.handleManualQrSubmit(); return false;" style="display: flex; gap: 8px;">
                <input type="text" id="qrManualInput" class="form-control" placeholder="ស្កេនបាកូដ ឬវាយ TX-1001 រួច Enter..." style="font-family: monospace; font-size: 0.95rem; font-weight: 700;">
                <button type="submit" class="btn-primary" style="height: 38px; padding: 0 16px; font-size: 0.85rem; background: #10b981; border-color: #10b981;">
                  <i class="fa-solid fa-arrow-right"></i>
                </button>
              </form>
            </div>

            <!-- Instant Scan Result Feedback Card -->
            <div id="qrScanFeedbackBox" style="display: none; padding: 14px 18px; border-radius: 10px; border: 2px solid #10b981; background: rgba(16, 185, 129, 0.08); text-align: left; animation: fadeIn 0.3s ease;">
              <!-- Filled dynamically on scan -->
            </div>
          </div>
          <div class="modal-footer" style="justify-content: space-between;">
            <span class="text-xs text-muted"><i class="fa-solid fa-volume-high text-indigo-500"></i> មានសំឡេងបន្លឺ Ding! ស្វ័យប្រវត្តិនឹងគ្រីសវត្តមានភ្លាម</span>
            <button type="button" class="btn-secondary" data-close-modal="qrAttendanceModal" onclick="AttendanceView.stopQrScanner()">បិទផ្ទាំង</button>
          </div>
        </div>
      </div>

      <!-- 9. Modal: Bulk Import Students from Excel / CSV -->
      <div id="importExcelModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 860px; max-height: 90vh; display: flex; flex-direction: column;">
          <div class="modal-header" style="background: linear-gradient(135deg, #10b981, #059669); color: #ffffff;">
            <h3 style="color: #ffffff; display: flex; align-items: center; gap: 10px; margin: 0; font-size: 1.15rem;">
              <i class="fa-solid fa-file-excel"></i>
              <span>នាំចូលទិន្នន័យសិស្សពី Excel / CSV (Bulk Import Students)</span>
            </h3>
            <button type="button" class="modal-close-btn" data-close-modal="importExcelModal" style="color: #ffffff;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="modal-body" style="padding: 20px; overflow-y: auto; flex: 1;">
            <!-- Top Step Guidance & Template Download -->
            <div style="background: var(--border-light); border-radius: 12px; padding: 16px 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; border: 1px solid var(--border-color);">
              <div>
                <h4 style="margin: 0 0 4px 0; font-size: 0.95rem; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-circle-info text-emerald-600"></i>
                  <span>ជំហានទី ១៖ ទាញយកទម្រង់គំរូ (Template)</span>
                </h4>
                <p style="margin: 0; font-size: 0.82rem; color: var(--text-muted);">
                  ទាញយកឯកសារគំរូដែលមានជួរឈរត្រឹមត្រូវ (ឈ្មោះខ្មែរ, ឈ្មោះឡាតាំង, ភេទ, វគ្គ, វេន, លេខទូរស័ព្ទ)
                </p>
              </div>
              <button type="button" id="btnDownloadExcelTemplate" class="btn-secondary" style="font-size: 0.85rem; height: 38px; color: #059669; border-color: #10b981;">
                <i class="fa-solid fa-download text-emerald-600"></i>
                <span>ទាញយកគំរូ Template (.CSV)</span>
              </button>
            </div>

            <!-- Upload Drag-and-Drop Dropzone -->
            <div id="excelDropZone" style="border: 2px dashed #10b981; border-radius: 12px; background: rgba(16, 185, 129, 0.04); padding: 30px 20px; text-align: center; cursor: pointer; transition: all 0.2s ease; margin-bottom: 20px;">
              <input type="file" id="excelFileInput" accept=".xlsx, .xls, .csv" style="display: none;">
              <div style="font-size: 2.8rem; color: #10b981; margin-bottom: 10px;">
                <i class="fa-solid fa-cloud-arrow-up"></i>
              </div>
              <h4 style="margin: 0 0 6px 0; font-size: 1.05rem; color: var(--text-main);">
                ជ្រើសរើស ឬអូសទម្លាក់ឯកសារ Excel ឬ CSV មកទីនេះ
              </h4>
              <p style="margin: 0 0 12px 0; font-size: 0.84rem; color: var(--text-muted);">
                គាំទ្រឯកសារប្រភេទ <code>.xlsx</code>, <code>.xls</code>, និង <code>.csv</code> (UTF-8)
              </p>
              <button type="button" class="btn-primary" style="height: 36px; padding: 0 20px; font-size: 0.85rem; background: #10b981; border-color: #10b981;" onclick="document.getElementById('excelFileInput').click()">
                <i class="fa-solid fa-folder-open"></i> ជ្រើសរើសឯកសារ
              </button>
            </div>

            <!-- Preview Container (Hidden initially until file chosen) -->
            <div id="excelImportPreviewContainer" style="display: none;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
                <div style="font-size: 0.92rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-table text-emerald-600"></i>
                  <span>ទិន្នន័យត្រៀមបញ្ចូល៖</span>
                  <span id="importPreviewCountBadge" class="badge" style="background: rgba(16,185,129,0.15); color: #059669; font-size: 0.82rem;">0 នាក់</span>
                </div>
                <div style="font-size: 0.8rem; color: var(--text-muted);" id="importPreviewFileInfo"></div>
              </div>

              <!-- Table View of Parsed Rows -->
              <div style="max-height: 260px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 16px;">
                <table class="data-table" style="font-size: 0.82rem; margin: 0;">
                  <thead style="position: sticky; top: 0; background: var(--bg-surface); z-index: 2;">
                    <tr>
                      <th style="width: 40px; text-align: center;">ល.រ</th>
                      <th>អត្តលេខ (ID)</th>
                      <th>ឈ្មោះខ្មែរ (NameKh)</th>
                      <th>ឈ្មោះឡាតាំង (NameEn)</th>
                      <th>ភេទ</th>
                      <th>វគ្គសិក្សា (Course)</th>
                      <th>វេន</th>
                      <th>លេខទូរស័ព្ទ</th>
                    </tr>
                  </thead>
                  <tbody id="importPreviewTableBody">
                    <!-- Injected dynamically -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="modal-footer" style="padding: 14px 20px; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
            <button type="button" class="btn-secondary" data-close-modal="importExcelModal">បោះបង់</button>
            <button type="button" id="btnConfirmBatchImport" class="btn-primary" style="background: #10b981; border-color: #10b981; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);" disabled>
              <i class="fa-solid fa-check"></i>
              <span id="btnConfirmBatchImportText">បញ្ជាក់ការបញ្ចូលសិស្ស</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 10. Modal: Admin Review & Manage Student Leave Requests -->
      <div id="leaveRequestAdminModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 780px; max-height: 90vh; display: flex; flex-direction: column;">
          <div class="modal-header" style="background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #ffffff;">
            <h3 style="color: #ffffff; display: flex; align-items: center; gap: 10px; margin: 0; font-size: 1.15rem;">
              <i class="fa-solid fa-envelope-open-text"></i>
              <span>គ្រប់គ្រងសំណើសុំច្បាប់អវត្តមាន (Leave Requests)</span>
            </h3>
            <button type="button" class="modal-close-btn" data-close-modal="leaveRequestAdminModal" style="color: #ffffff;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="modal-body" style="padding: 20px; overflow-y: auto; flex: 1;">
            <!-- Filter Bar -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
              <div class="leave-filter-tabs" style="display: flex; gap: 6px;">
                <button type="button" class="btn-paper-filter active" data-leave-filter="all">ទាំងអស់</button>
                <button type="button" class="btn-paper-filter" data-leave-filter="pending">
                  <i class="fa-solid fa-clock text-amber-500"></i> រង់ចាំពិនិត្យ
                </button>
                <button type="button" class="btn-paper-filter" data-leave-filter="approved">
                  <i class="fa-solid fa-circle-check text-emerald-500"></i> បានយល់ព្រម
                </button>
                <button type="button" class="btn-paper-filter" data-leave-filter="rejected">
                  <i class="fa-solid fa-circle-xmark text-rose-500"></i> បានបដិសេធ
                </button>
              </div>
              <span class="text-xs text-muted">💡 ពេលយល់ព្រម ប្រព័ន្ធនឹងគ្រីស "ច្បាប់ (P)" ក្នុងតារាងវត្តមានស្វ័យប្រវត្តិ</span>
            </div>

            <!-- List Container -->
            <div id="adminLeaveRequestsListContainer">
              <!-- Rendered dynamically -->
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-secondary" data-close-modal="leaveRequestAdminModal">បិទផ្ទាំង</button>
          </div>
        </div>
      </div>

      <!-- 11. Modal: Mark Student Dropout (កត់ត្រាសិស្សបោះបង់ & ចាក់សោរ ID) -->
      <div id="markDropoutModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 580px; border-top: 4px solid #ef4444;">
          <div class="modal-header" style="background: linear-gradient(135deg, #ef4444, #b91c1c); color: #ffffff;">
            <h3 style="color: #ffffff; display: flex; align-items: center; gap: 10px; margin: 0; font-size: 1.15rem;">
              <i class="fa-solid fa-user-xmark"></i>
              <span>កត់ត្រាសិស្សបោះបង់ការសិក្សា (Mark Dropout)</span>
            </h3>
            <button type="button" class="modal-close-btn" data-close-modal="markDropoutModal" style="color: #ffffff;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <form id="markDropoutForm" method="dialog" onsubmit="event.preventDefault(); return false;">
            <div class="modal-body" style="padding: 22px 24px; max-height: 75vh; overflow-y: auto;">
              <!-- ID Lock Alert Warning -->
              <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 12px 16px; margin-bottom: 18px; display: flex; align-items: flex-start; gap: 12px;">
                <i class="fa-solid fa-triangle-exclamation" style="color: #ef4444; font-size: 1.3rem; margin-top: 2px;"></i>
                <div style="font-size: 0.84rem; color: var(--text-main); line-height: 1.5;">
                  <strong style="color: #ef4444; display: block; margin-bottom: 2px;">ការព្រមានសំខាន់អំពីការចាក់សោរ ID:</strong>
                  នៅពេលសិស្សត្រូវបានកំណត់ជា "បោះបង់ការសិក្សា" នោះ <strong style="color: #ef4444;">អត្តលេខ (ID) របស់សិស្សនឹងត្រូវចាក់សោរជាអចិន្ត្រៃយ៍</strong> ហើយប្រើប្រាស់លែងកើត (មិនអាចស្កេនវត្តមាន ឬ Login បានឡើយ)។
                </div>
              </div>

              <!-- Select Student -->
              <div class="form-group" style="margin-bottom: 16px;">
                <label class="form-label" style="font-weight: 600;"><span>ជ្រើសរើសសិស្សបោះបង់ (Student)</span> <span class="required" style="color: #ef4444;">*</span></label>
                <select id="dropoutSelectStudent" class="form-control" required style="font-weight: 600;">
                  <option value="">-- ជ្រើសរើសសិស្ស --</option>
                </select>
              </div>

              <!-- Student Preview Card -->
              <div id="dropoutStudentPreview" style="display: none; align-items: center; gap: 12px; background: var(--border-light); padding: 10px 14px; border-radius: 8px; margin-bottom: 16px; border: 1px solid var(--border-color);">
              </div>

              <!-- Grid: Drop Date & Reason -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px;">
                <div class="form-group">
                  <label class="form-label" style="font-weight: 600;"><span>កាលបរិច្ឆេទបោះបង់ (Drop Date)</span> <span class="required" style="color: #ef4444;">*</span></label>
                  <input type="date" id="dropoutDate" class="form-control" required>
                </div>

                <div class="form-group">
                  <label class="form-label" style="font-weight: 600;"><span>មូលហេតុបោះបង់ (Reason)</span></label>
                  <select id="dropoutReason" class="form-control">
                    <option value="ជាប់រវល់ការងារ">ជាប់រវល់ការងារ</option>
                    <option value="ប្តូរទីលំនៅ">ប្តូរទីលំនៅ / ផ្លាស់ទៅខេត្ត</option>
                    <option value="បញ្ហាគ្រួសារ">បញ្ហាគ្រួសារ</option>
                    <option value="គ្មានលទ្ធភាពបង់ថ្លៃ">គ្មានលទ្ធភាពបង់ថ្លៃសិក្សា</option>
                    <option value="តាមមិនទាន់មេរៀន">តាមមិនទាន់មេរៀន</option>
                    <option value="ផ្សេងៗ">ផ្សេងៗ</option>
                  </select>
                </div>
              </div>

              <!-- Detailed Note -->
              <div class="form-group">
                <label class="form-label" style="font-weight: 600;"><span>កំណត់សម្គាល់បន្ថែម (Note / Details)</span></label>
                <textarea id="dropoutNote" class="form-control" rows="3" placeholder="បញ្ជាក់លម្អិតអំពីមូលហេតុបោះបង់ ឬព័ត៌មានផ្សេងៗ..."></textarea>
              </div>
            </div>

            <div class="modal-footer" style="padding: 14px 24px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color);">
              <button type="button" class="btn-secondary" data-close-modal="markDropoutModal">បោះបង់</button>
              <button type="button" id="btnSubmitDropout" class="btn-primary" style="background: #ef4444; border-color: #ef4444; box-shadow: 0 4px 14px rgba(239, 68, 68, 0.35);">
                <i class="fa-solid fa-lock"></i>
                <span>បញ្ជាក់ការបោះបង់ & ចាក់សោរ ID</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- 12. Modal: Mark Student Graduate (កត់ត្រាសិស្សបញ្ចប់ការសិក្សា & ចេញប័ណ្ណ) -->
      <div id="markGraduateModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 580px; border-top: 4px solid #10b981;">
          <div class="modal-header" style="background: linear-gradient(135deg, #10b981, #059669); color: #ffffff;">
            <h3 style="color: #ffffff; display: flex; align-items: center; gap: 10px; margin: 0; font-size: 1.15rem;">
              <i class="fa-solid fa-user-graduate"></i>
              <span>កត់ត្រាសិស្សបញ្ចប់ការសិក្សា (Mark Graduate)</span>
            </h3>
            <button type="button" class="modal-close-btn" data-close-modal="markGraduateModal" style="color: #ffffff;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <form id="markGraduateForm" method="dialog" onsubmit="event.preventDefault(); return false;">
            <div class="modal-body" style="padding: 22px 24px; max-height: 75vh; overflow-y: auto;">
              <!-- Congratulations Banner -->
              <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 12px 16px; margin-bottom: 18px; display: flex; align-items: flex-start; gap: 12px;">
                <i class="fa-solid fa-award" style="color: #10b981; font-size: 1.4rem; margin-top: 2px;"></i>
                <div style="font-size: 0.84rem; color: var(--text-main); line-height: 1.5;">
                  <strong style="color: #10b981; display: block; margin-bottom: 2px;">អបអរសាទរសិស្សបញ្ចប់ការសិក្សា:</strong>
                  សិស្សនឹងត្រូវបានប្តូរទៅកាន់បញ្ជី "សិស្សបញ្ចប់ការសិក្សា (Alumni)" និងអាចចេញវិញ្ញាបនបត្រឌីជីថលជាផ្លូវការបានភ្លាមៗ។
                </div>
              </div>

              <!-- Select Student -->
              <div class="form-group" style="margin-bottom: 16px;">
                <label class="form-label" style="font-weight: 600;"><span>ជ្រើសរើសសិស្សបញ្ចប់ (Student)</span> <span class="required" style="color: #ef4444;">*</span></label>
                <select id="graduateSelectStudent" class="form-control" required style="font-weight: 600;">
                  <option value="">-- ជ្រើសរើសសិស្ស --</option>
                </select>
              </div>

              <!-- Student Preview Card -->
              <div id="graduateStudentPreview" style="display: none; align-items: center; gap: 12px; background: var(--border-light); padding: 10px 14px; border-radius: 8px; margin-bottom: 16px; border: 1px solid var(--border-color);">
              </div>

              <!-- Grid: Grad Date & Grade -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px;">
                <div class="form-group">
                  <label class="form-label" style="font-weight: 600;"><span>ថ្ងៃបញ្ចប់ការសិក្សា (Date)</span> <span class="required" style="color: #ef4444;">*</span></label>
                  <input type="date" id="graduateDate" class="form-control" required>
                </div>

                <div class="form-group">
                  <label class="form-label" style="font-weight: 600;"><span>និទ្ទេស / លទ្ធផល (Final Grade)</span></label>
                  <select id="graduateFinalGrade" class="form-control">
                    <option value="A (ល្អប្រសើរ)">A (ល្អប្រសើរ - 90-100%)</option>
                    <option value="B (ល្អណាស់)">B (ល្អណាស់ - 80-89%)</option>
                    <option value="C (ល្អ)">C (ល្អ - 70-79%)</option>
                    <option value="D (មធ្យម)">D (មធ្យម - 60-69%)</option>
                  </select>
                </div>
              </div>

              <!-- Checkbox: Auto Issue Certificate -->
              <div style="margin-bottom: 16px; background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: 8px; padding: 12px 16px;">
                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-weight: 600; color: var(--text-main); font-size: 0.88rem;">
                  <input type="checkbox" id="graduateAutoIssueCert" checked style="width: 18px; height: 18px; accent-color: #10b981;">
                  <span>ចេញវិញ្ញាបនបត្រឌីជីថល (Digital Certificate) ដោយស្វ័យប្រវត្តិ</span>
                </label>
                <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px; padding-left: 28px;">
                  ប្រព័ន្ធនឹងបង្កើតលេខកូដវិញ្ញាបនបត្រ (CERT-xxxx) និងភ្ជាប់ទៅកាន់ទម្រង់បោះពុម្ពវិញ្ញាបនបត្រ។
                </div>
              </div>

              <!-- Detailed Note -->
              <div class="form-group">
                <label class="form-label" style="font-weight: 600;"><span>កំណត់សម្គាល់បន្ថែម (Note)</span></label>
                <textarea id="graduateNote" class="form-control" rows="2" placeholder="ព័ត៌មានបន្ថែមអំពីការបញ្ចប់វគ្គ..."></textarea>
              </div>
            </div>

            <div class="modal-footer" style="padding: 14px 24px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color);">
              <button type="button" class="btn-secondary" data-close-modal="markGraduateModal">បោះបង់</button>
              <button type="button" id="btnSubmitGraduate" class="btn-primary" style="background: #10b981; border-color: #10b981; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);">
                <i class="fa-solid fa-graduation-cap"></i>
                <span>បញ្ជាក់ការបញ្ចប់ការសិក្សា</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  initEvents() {
    // Close button listeners
    document.querySelectorAll("[data-close-modal]").forEach(btn => {
      btn.addEventListener("click", () => {
        const modalId = btn.getAttribute("data-close-modal");
        ModalsComponent.close(modalId);
      });
    });

    // Close on clicking backdrop
    document.querySelectorAll(".modal-overlay").forEach(overlay => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          overlay.classList.remove("open");
          document.body.style.overflow = "";
        }
      });
    });

    // Print ID Card listener
    const printBtn = document.getElementById("printIdCardBtn");
    if (printBtn) {
      printBtn.addEventListener("click", () => {
        App.printStudentIdCard();
      });
    }

    // Edit form submission
    const editForm = document.getElementById("editStudentForm");
    if (editForm) {
      editForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        await App.handleEditFormSubmit(editForm);
      });
    }

    // Edit Avatar File change listener
    const editAvatarFile = document.getElementById("editAvatarFile");
    const editAvatarPreview = document.getElementById("editAvatarPreview");
    const editAvatarInput = document.getElementById("editAvatarInput");
    const editAvatarPlaceholder = document.getElementById("editAvatarPlaceholder");
    if (editAvatarFile && editAvatarPreview) {
      editAvatarFile.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            editAvatarPreview.style.opacity = "0.5";
            const compressed = await StudentAPI.compressImage(file, 480, 0.82);
            editAvatarPreview.src = compressed;
            editAvatarPreview.style.display = "block";
            if (editAvatarPlaceholder) editAvatarPlaceholder.style.display = "none";
            if (editAvatarInput) editAvatarInput.value = compressed;
            App.showToast("បានបង្រួមរូបភាពរួចរាល់ ត្រៀមរក្សាទុក!", "info");
          } catch (err) {
            App.showToast("មិនអាចដំណើរការរូបភាពបានទេ!", "error");
          } finally {
            editAvatarPreview.style.opacity = "1";
          }
        }
      });
    }

    // Add Student Form submission (Popup Modal)
    const addForm = document.getElementById("modalAddStudentForm");
    if (addForm) {
      addForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        await App.handleModalAddStudentSubmit(addForm);
      });
    }

    // Add Student Avatar File & Compression
    const addAvatarFile = document.getElementById("modalAddAvatarFile");
    const addAvatarPreview = document.getElementById("modalAddAvatarPreview");
    const addAvatarInput = document.getElementById("modalAddAvatarInput");
    const addGenderSelect = document.getElementById("modalAddGenderSelect");

    if (addAvatarFile && addAvatarPreview) {
      addAvatarFile.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            addAvatarPreview.style.opacity = "0.5";
            const compressed = await StudentAPI.compressImage(file, 480, 0.82);
            addAvatarPreview.src = compressed;
            addAvatarPreview.style.display = "block";
            const placeholder = document.getElementById("enrollAvatarPlaceholder");
            if (placeholder) placeholder.style.display = "none";
            if (addAvatarInput) addAvatarInput.value = compressed;
            App.showToast("បានបង្រួមរូបភាពរួចរាល់ ត្រៀម Save ទៅ Firebase!", "info");
          } catch (err) {
            App.showToast("មិនអាចដំណើរការរូបភាពបានទេ!", "error");
          } finally {
            addAvatarPreview.style.opacity = "1";
          }
        }
      });
    }

    if (addAvatarInput && addAvatarPreview) {
      addAvatarInput.addEventListener("input", (e) => {
        const url = e.target.value.trim();
        const placeholder = document.getElementById("enrollAvatarPlaceholder");
        if (url) {
          addAvatarPreview.src = url;
          addAvatarPreview.style.display = "block";
          if (placeholder) placeholder.style.display = "none";
        } else {
          addAvatarPreview.src = "";
          addAvatarPreview.style.display = "none";
          if (placeholder) placeholder.style.display = "flex";
        }
      });
    }

    if (addGenderSelect && addAvatarPreview) {
      addGenderSelect.addEventListener("change", (e) => {
        if (!addAvatarInput || !addAvatarInput.value) {
          addAvatarPreview.src = App.getDefaultAvatar(e.target.value);
        }
      });
    }

    // Record Payment Form submission
    const payForm = document.getElementById("recordPaymentForm");
    if (payForm) {
      payForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (typeof FeesView !== "undefined" && FeesView.handlePaymentFormSubmit) {
          await FeesView.handlePaymentFormSubmit(payForm);
        }
      });
    }

    // ----------------------------------------------------
    // EXCEL / CSV BULK IMPORT LOGIC
    // ----------------------------------------------------
    let parsedStudentsImportList = [];

    const btnDownloadTmpl = document.getElementById("btnDownloadExcelTemplate");
    if (btnDownloadTmpl) {
      btnDownloadTmpl.addEventListener("click", () => {
        const header = "ID,NameKh,NameEn,Gender,Dob,Phone,GuardianPhone,Grade,Course,Shift,Address,PIN,Status";
        const sampleRows = [
          "TX-1001,សុខ ចាន់ដារ៉ា,SOK CHANDARA,ប្រុស,2006-05-12,012345678,098765432,ថ្នាក់កុំព្យូទ័រ,Typing,ព្រឹក,ភ្នំពេញ,123,Active",
          "TX-1002,គង់ ម៉ារីណា,KONG MARINA,ស្រី,2007-08-20,011223344,077889900,ថ្នាក់កុំព្យូទ័រ,Microsoft Word,ថ្ងៃ,កណ្តាល,123,Active",
          "TX-1003,សេង វិបុល,SENG VIBOL,ប្រុស,2005-11-15,088990011,099112233,ថ្នាក់កុំព្យូទ័រ,Microsoft Excel,រសៀល,សៀមរាប,123,Active",
          "TX-1004,លឹម ស្រីនាង,LIM SREINEANG,ស្រី,2006-02-28,097665544,015443322,ថ្នាក់កុំព្យូទ័រ,Microsoft PowerPoint,ព្រឹក,បាត់ដំបង,123,Active"
        ];
        // Add UTF-8 BOM so Excel opens Khmer font correctly
        const csvContent = "\uFEFF" + [header, ...sampleRows].join("\r\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "MasterSchool_Students_Template.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        App.showToast("បានទាញយកទម្រង់គំរូ Template CSV ជោគជ័យ!", "success");
      });
    }

    const fileInput = document.getElementById("excelFileInput");
    const dropZone = document.getElementById("excelDropZone");
    const previewContainer = document.getElementById("excelImportPreviewContainer");
    const previewTableBody = document.getElementById("importPreviewTableBody");
    const previewCountBadge = document.getElementById("importPreviewCountBadge");
    const previewFileInfo = document.getElementById("importPreviewFileInfo");
    const btnConfirmImport = document.getElementById("btnConfirmBatchImport");
    const btnConfirmText = document.getElementById("btnConfirmBatchImportText");

    const processFile = async (file) => {
      if (!file) return;
      try {
        if (dropZone) dropZone.style.opacity = "0.6";
        const fileName = file.name;
        const fileExt = fileName.split(".").pop().toLowerCase();

        let rawRows = [];

        if (typeof XLSX !== "undefined" && (fileExt === "xlsx" || fileExt === "xls" || fileExt === "csv")) {
          const data = await file.arrayBuffer();
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        } else {
          // Fallback text CSV parser
          const text = await file.text();
          const lines = text.split(/\r?\n/).filter(line => line.trim());
          if (lines.length > 1) {
            const headers = lines[0].replace(/^\uFEFF/, "").split(",").map(h => h.trim().replace(/^["']|["']$/g, ""));
            for (let i = 1; i < lines.length; i++) {
              const cols = lines[i].split(",").map(c => c.trim().replace(/^["']|["']$/g, ""));
              const rowObj = {};
              headers.forEach((h, idx) => { rowObj[h] = cols[idx] || ""; });
              rawRows.push(rowObj);
            }
          }
        }

        if (!rawRows || rawRows.length === 0) {
          App.showToast("ឯកសារនេះមិនមានទិន្នន័យសិស្សឡើយ!", "warning");
          return;
        }

        // Normalize and map columns
        parsedStudentsImportList = rawRows.map((r, idx) => {
          const keys = Object.keys(r);
          const findVal = (possibleKeys, fallback = "") => {
            for (const pk of possibleKeys) {
              const found = keys.find(k => k.trim().toLowerCase() === pk.toLowerCase());
              if (found && r[found] !== undefined && String(r[found]).trim() !== "") {
                return String(r[found]).trim();
              }
            }
            return fallback;
          };

          const nameKh = findVal(["NameKh", "ឈ្មោះខ្មែរ", "ឈ្មោះ", "Name", "StudentName"], `សិស្សថ្មី ${idx + 1}`);
          const nameEn = findVal(["NameEn", "ឈ្មោះឡាតាំង", "EnglishName", "LatinName"], "");
          let gender = findVal(["Gender", "ភេទ", "Sex"], "ប្រុស");
          if (gender.includes("F") || gender.includes("ស្រី")) gender = "ស្រី";
          else gender = "ប្រុស";

          let course = findVal(["Course", "វគ្គ", "វគ្គសិក្សា", "CourseName"], "Typing");
          if (course.toLowerCase().includes("word")) course = "Microsoft Word";
          else if (course.toLowerCase().includes("excel")) course = "Microsoft Excel";
          else if (course.toLowerCase().includes("powerpoint") || course.toLowerCase().includes("ppt")) course = "Microsoft PowerPoint";
          else course = "Typing";

          let shift = findVal(["Shift", "វេន", "វេនសិក្សា"], "ព្រឹក");
          if (shift.includes("ថ្ងៃ") || shift.includes("15")) shift = "ថ្ងៃ";
          else if (shift.includes("រសៀល") || shift.includes("17")) shift = "រសៀល";
          else shift = "ព្រឹក";

          const id = findVal(["ID", "អត្តលេខ", "StudentId"], "AUTO");
          const dob = findVal(["Dob", "ថ្ងៃកំណើត", "BirthDate"], "2006-01-01");
          const phone = findVal(["Phone", "ទូរស័ព្ទ", "លេខទូរស័ព្ទ"], "");
          const guardianPhone = findVal(["GuardianPhone", "លេខអាណាព្យាបាល", "អាណាព្យាបាល"], "");
          const address = findVal(["Address", "អាសយដ្ឋាន", "ខេត្ត"], "ភ្នំពេញ");
          const pin = findVal(["PIN", "លេខសម្ងាត់"], "123");
          const status = findVal(["Status", "ស្ថានភាព"], "Active");

          return {
            ID: id,
            NameKh: nameKh,
            NameEn: nameEn,
            Gender: gender,
            Dob: dob,
            Phone: phone,
            GuardianPhone: guardianPhone,
            Grade: "ថ្នាក់កុំព្យូទ័រ",
            Course: course,
            Shift: shift,
            Address: address,
            PIN: pin,
            Status: status,
            StartDate: new Date().toISOString().split("T")[0]
          };
        }).filter(s => s.NameKh && s.NameKh.trim());

        if (parsedStudentsImportList.length === 0) {
          App.showToast("រកមិនឃើញទិន្នន័យសិស្សត្រឹមត្រូវក្នុងឯកសារនេះទេ!", "error");
          return;
        }

        // Render preview table
        if (previewTableBody) {
          previewTableBody.innerHTML = parsedStudentsImportList.map((st, idx) => `
            <tr>
              <td style="text-align: center; color: var(--text-muted);">${idx + 1}</td>
              <td><span class="font-mono font-bold text-indigo-600">${st.ID === 'AUTO' ? '<em style="color:#94a3b8;">ស្វ័យប្រវត្ត</em>' : st.ID}</span></td>
              <td><strong>${st.NameKh}</strong></td>
              <td>${st.NameEn || '—'}</td>
              <td><span class="badge ${st.Gender === 'ស្រី' ? 'badge-gender-female' : 'badge-gender-male'}">${st.Gender}</span></td>
              <td><span class="badge badge-course">${st.Course}</span></td>
              <td>${st.Shift}</td>
              <td>${st.Phone || '—'}</td>
            </tr>
          `).join('');
        }

        if (previewCountBadge) previewCountBadge.textContent = `${parsedStudentsImportList.length} នាក់`;
        if (previewFileInfo) previewFileInfo.innerHTML = `ឯកសារ៖ <strong>${fileName}</strong> (${(file.size / 1024).toFixed(1)} KB)`;
        if (previewContainer) previewContainer.style.display = "block";

        if (btnConfirmImport && btnConfirmText) {
          btnConfirmImport.disabled = false;
          btnConfirmText.textContent = `បញ្ជាក់ការបញ្ចូលសិស្ស (${parsedStudentsImportList.length} នាក់)`;
        }

        App.showToast(`បានអានទិន្នន័យជោគជ័យ៖ សិស្សសរុប ${parsedStudentsImportList.length} នាក់!`, "info");
      } catch (err) {
        App.showToast("កំហុសក្នុងការអានឯកសារ Excel: " + err.message, "error");
      } finally {
        if (dropZone) dropZone.style.opacity = "1";
      }
    };

    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) processFile(file);
      });
    }

    if (dropZone) {
      dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.style.borderColor = "#059669";
        dropZone.style.background = "rgba(16, 185, 129, 0.12)";
      });
      dropZone.addEventListener("dragleave", () => {
        dropZone.style.borderColor = "#10b981";
        dropZone.style.background = "rgba(16, 185, 129, 0.04)";
      });
      dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.style.borderColor = "#10b981";
        dropZone.style.background = "rgba(16, 185, 129, 0.04)";
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
      });
    }

    // Confirm Batch Import button
    if (btnConfirmImport) {
      btnConfirmImport.addEventListener("click", async () => {
        if (!parsedStudentsImportList || parsedStudentsImportList.length === 0) return;

        btnConfirmImport.disabled = true;
        btnConfirmImport.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> កំពុងបញ្ចូលទិន្នន័យ...`;

        try {
          const result = await StudentAPI.createStudentsBatch(parsedStudentsImportList);
          App.showToast(`🎉 បានបញ្ចូលសិស្ស ${result.count} នាក់ ទៅកាន់ Firebase និងប្រព័ន្ធដោយជោគជ័យ!`, "success");
          App.triggerConfetti();

          // Refresh application state
          await App.loadData(false);
          App.renderView();

          // Close modal and reset
          ModalsComponent.close("importExcelModal");
          parsedStudentsImportList = [];
          if (fileInput) fileInput.value = "";
          if (previewContainer) previewContainer.style.display = "none";
        } catch (err) {
          App.showToast("បញ្ចូលសិស្សបរាជ័យ: " + err.message, "error");
        } finally {
          btnConfirmImport.disabled = false;
          btnConfirmImport.innerHTML = `<i class="fa-solid fa-check"></i> <span id="btnConfirmBatchImportText">បញ្ជាក់ការបញ្ចូលសិស្ស</span>`;
        }
      });
    }

    // Filter tabs in Leave Request Admin Modal
    document.querySelectorAll("[data-leave-filter]").forEach(tabBtn => {
      tabBtn.addEventListener("click", () => {
        document.querySelectorAll("[data-leave-filter]").forEach(b => b.classList.remove("active"));
        tabBtn.classList.add("active");
        const filter = tabBtn.getAttribute("data-leave-filter");
        if (typeof AttendanceView !== "undefined" && AttendanceView.renderLeaveRequestsList) {
          AttendanceView.renderLeaveRequestsList(filter);
        }
      });
    });

    // =========================================================================
    // Upgraded Student Profile & Finance Modal Interactive Listeners
    // =========================================================================
    // 1. Student Details Tab Switching (Zero-lag instantaneous toggle)
    document.querySelectorAll("[data-student-tab]").forEach(tabBtn => {
      tabBtn.addEventListener("click", () => {
        const targetTab = tabBtn.getAttribute("data-student-tab");
        document.querySelectorAll("[data-student-tab]").forEach(b => b.classList.remove("active"));
        tabBtn.classList.add("active");

        document.querySelectorAll(".student-tab-pane").forEach(pane => pane.classList.remove("active"));
        const targetPane = document.getElementById(`pane-${targetTab}`);
        if (targetPane) targetPane.classList.add("active");
      });
    });

    // 2. Student Profile "ផ្សេងៗ" Dropdown Menu
    const moreBtn = document.getElementById("profileBtnMore");
    const moreMenu = document.getElementById("profileMoreMenu");
    if (moreBtn && moreMenu) {
      moreBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        moreMenu.classList.toggle("show");
      });
      document.addEventListener("click", () => {
        moreMenu.classList.remove("show");
      });
    }

    // 3. Edit Student Button Listeners
    const profileEditBtn = document.getElementById("profileBtnEdit");
    if (profileEditBtn) {
      profileEditBtn.addEventListener("click", () => {
        if (App.state.selectedStudent) {
          App.openEditModal(App.state.selectedStudent.ID);
        }
      });
    }

    const modalFooterEditBtn = document.getElementById("modalFooterEditBtn");
    if (modalFooterEditBtn) {
      modalFooterEditBtn.addEventListener("click", () => {
        if (App.state.selectedStudent) {
          App.openEditModal(App.state.selectedStudent.ID);
        }
      });
    }

    // 4. Toggle Student Status (ផ្អាកការសិក្សា / បន្តការសិក្សា)
    const profileToggleStatusBtn = document.getElementById("profileBtnToggleStatus");
    if (profileToggleStatusBtn) {
      profileToggleStatusBtn.addEventListener("click", async () => {
        if (App.state.selectedStudent) {
          await App.toggleStudentStatus(App.state.selectedStudent.ID);
        }
      });
    }

    // 5. Change Avatar directly from camera badge
    const avatarInput = document.getElementById("profileAvatarFileInput");
    const avatarImg = document.getElementById("profileHeaderAvatar");
    if (avatarInput && avatarImg) {
      avatarInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (file && App.state.selectedStudent) {
          try {
            avatarImg.style.opacity = "0.5";
            const compressed = await StudentAPI.compressImage(file, 480, 0.82);
            avatarImg.src = compressed;
            App.state.selectedStudent.Avatar = compressed;
            await StudentAPI.updateStudent(App.state.selectedStudent);
            App.showToast("បានផ្លាស់ប្តូររូបថតសិស្សដោយជោគជ័យ!", "success");
            await App.loadData(false);
          } catch (err) {
            App.showToast("មិនអាចផ្លាស់ប្តូររូបភាពបានទេ!", "error");
          } finally {
            avatarImg.style.opacity = "1";
          }
        }
      });
    }

    // 6. Quick Payment Form Controls in Finance Tab
    const openQuickPay = () => {
      // Ensure Finance tab is active
      const finTabBtn = document.querySelector("[data-student-tab='finance']");
      if (finTabBtn) finTabBtn.click();

      const box = document.getElementById("inlineQuickPayBox");
      if (box) {
        box.style.display = "block";
        const dateInput = document.getElementById("quickPayDate");
        if (dateInput && !dateInput.value) {
          dateInput.value = new Date().toISOString().split("T")[0];
        }
        const amtInput = document.getElementById("quickPayAmount");
        if (amtInput) amtInput.focus();
      }
    };

    const addPayBtn1 = document.getElementById("profileBtnAddPayment");
    const addPayBtn2 = document.getElementById("financeAddPaymentBtn");
    if (addPayBtn1) addPayBtn1.addEventListener("click", openQuickPay);
    if (addPayBtn2) addPayBtn2.addEventListener("click", openQuickPay);

    const closeQuickPay = () => {
      const box = document.getElementById("inlineQuickPayBox");
      if (box) box.style.display = "none";
    };
    const closePayBtn = document.getElementById("closeQuickPayBtn");
    const cancelPayBtn = document.getElementById("cancelQuickPayBtn");
    if (closePayBtn) closePayBtn.addEventListener("click", closeQuickPay);
    if (cancelPayBtn) cancelPayBtn.addEventListener("click", closeQuickPay);

    const submitQuickPayBtn = document.getElementById("submitQuickPayBtn");
    if (submitQuickPayBtn) {
      submitQuickPayBtn.addEventListener("click", async () => {
        await App.handleQuickPaymentSubmit();
      });
    }

    // 7. Dropdown Menu Items
    const itemPrintId = document.getElementById("menuItemPrintIdCard");
    if (itemPrintId) {
      itemPrintId.addEventListener("click", () => {
        App.printStudentIdCard();
      });
    }

    const itemPrintTrans = document.getElementById("menuItemPrintTranscript");
    if (itemPrintTrans) {
      itemPrintTrans.addEventListener("click", () => {
        if (typeof ExamsView !== "undefined" && App.state.selectedStudent) {
          ExamsView.printStudentTranscript(App.state.selectedStudent.ID);
        }
      });
    }

    const itemIssueCert = document.getElementById("menuItemIssueCert");
    const servicesCertBtn = document.getElementById("servicesCertBtn");
    const handleIssueCert = () => {
      if (typeof CertificatesView !== "undefined" && App.state.selectedStudent) {
        CertificatesView.openIssueModal(App.state.selectedStudent.ID);
      } else {
        App.showToast("សូមចូលទៅកាន់ទំព័រវិញ្ញាបនបត្រដើម្បីចេញប័ណ្ណ!", "info");
      }
    };
    if (itemIssueCert) itemIssueCert.addEventListener("click", handleIssueCert);
    if (servicesCertBtn) servicesCertBtn.addEventListener("click", handleIssueCert);

    const itemResetPin = document.getElementById("menuItemResetPin");
    if (itemResetPin) {
      itemResetPin.addEventListener("click", async () => {
        if (App.state.selectedStudent) {
          await App.resetStudentPin(App.state.selectedStudent.ID);
        }
      });
    }

    const itemDeleteStudent = document.getElementById("menuItemDeleteStudent");
    if (itemDeleteStudent) {
      itemDeleteStudent.addEventListener("click", () => {
        if (App.state.selectedStudent) {
          ModalsComponent.close("studentDetailsModal");
          App.confirmDeleteStudent(App.state.selectedStudent.ID);
        }
      });
    }

    // 8. Print Modal / Fee Receipts
    const financePrintBtn = document.getElementById("financePrintHistoryBtn");
    if (financePrintBtn) {
      financePrintBtn.addEventListener("click", () => {
        if (App.state.selectedStudent && typeof FeesView !== "undefined") {
          FeesView.printOfficialReceipt(App.state.selectedStudent.ID);
        }
      });
    }

    const footerPrintBtn = document.getElementById("modalFooterPrintBtn");
    if (footerPrintBtn) {
      footerPrintBtn.addEventListener("click", () => {
        if (App.state.selectedStudent && typeof FeesView !== "undefined") {
          FeesView.printOfficialReceipt(App.state.selectedStudent.ID);
        } else {
          App.printStudentIdCard();
        }
      });
    }

    // 9. Mark Dropout and Mark Graduate Action Listeners
    const profileBtnMarkDrop = document.getElementById("profileBtnMarkDrop");
    if (profileBtnMarkDrop) {
      profileBtnMarkDrop.addEventListener("click", () => {
        if (App.state.selectedStudent && typeof DroppedStudentsView !== "undefined") {
          DroppedStudentsView.openMarkDropoutModal(App.state.selectedStudent.ID);
        }
      });
    }

    const menuItemMarkDrop = document.getElementById("menuItemMarkDrop");
    if (menuItemMarkDrop) {
      menuItemMarkDrop.addEventListener("click", () => {
        if (App.state.selectedStudent && typeof DroppedStudentsView !== "undefined") {
          DroppedStudentsView.openMarkDropoutModal(App.state.selectedStudent.ID);
        }
      });
    }

    const profileBtnMarkGraduate = document.getElementById("profileBtnMarkGraduate");
    if (profileBtnMarkGraduate) {
      profileBtnMarkGraduate.addEventListener("click", () => {
        if (App.state.selectedStudent && typeof GraduatedStudentsView !== "undefined") {
          GraduatedStudentsView.openMarkGraduateModal(App.state.selectedStudent.ID);
        }
      });
    }

    const menuItemMarkGraduate = document.getElementById("menuItemMarkGraduate");
    if (menuItemMarkGraduate) {
      menuItemMarkGraduate.addEventListener("click", () => {
        if (App.state.selectedStudent && typeof GraduatedStudentsView !== "undefined") {
          GraduatedStudentsView.openMarkGraduateModal(App.state.selectedStudent.ID);
        }
      });
    }

    const menuItemReactivateStudent = document.getElementById("menuItemReactivateStudent");
    if (menuItemReactivateStudent) {
      menuItemReactivateStudent.addEventListener("click", () => {
        if (App.state.selectedStudent && typeof DroppedStudentsView !== "undefined") {
          DroppedStudentsView.confirmReactivate(App.state.selectedStudent.ID);
        }
      });
    }

    // Dropout Modal Event Listeners
    const dropoutSelect = document.getElementById("dropoutSelectStudent");
    if (dropoutSelect) {
      dropoutSelect.addEventListener("change", (e) => {
        if (typeof DroppedStudentsView !== "undefined") {
          DroppedStudentsView.onStudentSelectChanged(e.target.value);
        }
      });
    }

    const btnSubmitDropout = document.getElementById("btnSubmitDropout");
    if (btnSubmitDropout) {
      btnSubmitDropout.addEventListener("click", async () => {
        if (typeof DroppedStudentsView !== "undefined") {
          await DroppedStudentsView.handleDropoutSubmit();
        }
      });
    }

    // Graduate Modal Event Listeners
    const graduateSelect = document.getElementById("graduateSelectStudent");
    if (graduateSelect) {
      graduateSelect.addEventListener("change", (e) => {
        if (typeof GraduatedStudentsView !== "undefined") {
          GraduatedStudentsView.onStudentSelectChanged(e.target.value);
        }
      });
    }

    const btnSubmitGraduate = document.getElementById("btnSubmitGraduate");
    if (btnSubmitGraduate) {
      btnSubmitGraduate.addEventListener("click", async () => {
        if (typeof GraduatedStudentsView !== "undefined") {
          await GraduatedStudentsView.handleGraduateSubmit();
        }
      });
    }
  },

  open(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  },

  close(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }
  }
};
