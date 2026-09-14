/**
 * View: Settings & Firebase Cloud Sync Configuration
 */
const SettingsView = {
  render() {
    const isConnected = StudentAPI.isCloudConnected();
    const config = APP_CONFIG.firebaseConfig || {};

    return `
      <section id="view-settings" class="page-view">
        <div class="card">
          <div class="card-header-clean">
            <div class="card-title">
              <i class="fa-solid fa-gear" style="color: var(--primary);"></i>
              <span>ការកំណត់ប្រព័ន្ធទូទៅ (System Settings)</span>
            </div>
          </div>

          <p style="margin-bottom: 20px; font-size: 0.92rem; color: var(--text-muted);">
            គ្រប់គ្រងការតភ្ជាប់ Cloud Database, ការជូនដំណឹង Telegram, និងការថែទាំទិន្នន័យប្រព័ន្ធ MasterSchool ឱ្យដំណើរការរលូន និងសុវត្ថិភាពខ្ពស់។
          </p>

          <!-- Cloud Database Status Info Card -->
          <div style="background: var(--border-light); border-radius: var(--border-radius); padding: 20px; border: 1px solid var(--border-color); margin-bottom: 24px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
              <h4 style="font-size: 1rem; margin: 0; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-cloud" style="color: var(--primary);"></i>
                <span>មូលដ្ឋានទិន្នន័យលើពពក (Cloud Database & Live Sync)</span>
              </h4>
              <span class="badge ${isConnected ? 'badge-grade' : ''}" style="${isConnected ? 'background: rgba(16,185,129,0.15); color: #059669;' : 'background: rgba(239,68,68,0.15); color: #dc2626;'} font-size: 0.85rem; padding: 4px 12px; border-radius: 20px;">
                <i class="fa-solid ${isConnected ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
                ${isConnected ? 'ដំណើរការរលូន (Online)' : 'មិនទាន់ភ្ជាប់ (Offline)'}
              </span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; font-size: 0.88rem;">
              <div>
                <span style="color: var(--text-muted); display: block; font-size: 0.8rem;">Project ID:</span>
                <strong style="font-family: monospace;">${config.projectId || "system-student-c2267"}</strong>
              </div>
              <div style="grid-column: span 2;">
                <span style="color: var(--text-muted); display: block; font-size: 0.8rem;">Database URL:</span>
                <strong style="font-family: monospace; word-break: break-all; color: var(--primary);">${config.databaseURL || "https://system-student-c2267-default-rtdb.asia-southeast1.firebasedatabase.app"}</strong>
              </div>
              <div>
                <span style="color: var(--text-muted); display: block; font-size: 0.8rem;">Auth Domain:</span>
                <span style="font-family: monospace;">${config.authDomain || "system-student-c2267.firebaseapp.com"}</span>
              </div>
            </div>
          </div>

          <!-- Actions Grid -->
          <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px;">
            <button type="button" id="testConnectionBtn" class="btn-primary">
              <i class="fa-solid fa-plug"></i>
              <span>សាកល្បងការតភ្ជាប់ (Test Connection)</span>
            </button>
            <button type="button" id="syncNowBtn" class="btn-secondary">
              <i class="fa-solid fa-arrows-rotate"></i>
              <span>Sync ទិន្នន័យពី Firebase ឥឡូវនេះ</span>
            </button>
            <button type="button" id="clearAllExamsBtn" class="btn-secondary" style="color: #ea580c; border-color: #fdba74;">
              <i class="fa-solid fa-eraser"></i>
              <span>សម្អាតពិន្ទុប្រឡងទាំងអស់ (កំណត់ទៅគ្មានពិន្ទុ)</span>
            </button>
            <button type="button" id="clearAllStudentsBtn" class="btn-outline-danger">
              <i class="fa-solid fa-trash-can"></i>
              <span>លុបទិន្នន័យសិស្សទាំងអស់ (ទុកបញ្ចូលថ្មី)</span>
            </button>
          </div>
        </div>

        <!-- ========================================================= -->
        <!-- TELEGRAM BOT NOTIFICATIONS CONFIGURATION                  -->
        <!-- ========================================================= -->
        ${(() => {
          const tgConfig = typeof TelegramService !== "undefined" ? TelegramService.getConfig() : (APP_CONFIG.telegramConfig || {});
          return `
            <div class="card mt-4" style="border-left: 4px solid #0088cc;">
              <div class="card-header-clean" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
                <div class="card-title">
                  <i class="fa-brands fa-telegram" style="color: #0088cc; font-size: 1.3rem;"></i>
                  <span>ការកំណត់ Telegram Bot Notifications (ការជូនដំណឹងស្វ័យប្រវត្តិ)</span>
                </div>
                <span class="badge" id="telegramStatusBadge" style="background: rgba(0, 136, 204, 0.12); color: #0088cc; font-size: 0.85rem; padding: 4px 12px; border-radius: 20px; font-weight: 700;">
                  ${tgConfig.enabled ? '<i class="fa-solid fa-circle-check"></i> បើកដំណើរការ (Active)' : '<i class="fa-solid fa-circle-pause"></i> បិទដំណើរការ (Disabled)'}
                </span>
              </div>

              <p style="margin-bottom: 20px; font-size: 0.92rem; color: var(--text-muted);">
                ផ្ញើសារជូនដំណឹងស្វ័យប្រវត្តិចូល Telegram Channel ឬ Group ភ្លាមៗពេលមានការកត់ត្រាវត្តមានសិស្ស (QR Code), បង់ថ្លៃសិក្សា $50, ប្រឡងជាប់, និងការចេញវិញ្ញាបនបត្រផ្លូវការ។
              </p>

              <form id="telegramConfigForm" autocomplete="off">
                <div style="background: var(--border-light); border-radius: var(--border-radius); padding: 20px; border: 1px solid var(--border-color); margin-bottom: 20px;">
                  
                  <!-- Master Switch -->
                  <div style="margin-bottom: 18px; padding-bottom: 14px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                    <div>
                      <strong style="font-size: 0.95rem; color: var(--text-main);">បើកដំណើរការការជូនដំណឹងតាម Telegram (Enable Telegram Alerts)</strong>
                      <div style="font-size: 0.82rem; color: var(--text-muted);">បើក/បិទការផ្ញើសារស្វ័យប្រវត្តិនៃប្រព័ន្ធទាំងមូល</div>
                    </div>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                      <input type="checkbox" id="tgInputEnabled" ${tgConfig.enabled ? 'checked' : ''} style="width: 20px; height: 20px; accent-color: #0088cc; cursor: pointer;">
                      <span style="font-weight: 700; font-size: 0.88rem; color: var(--text-main);">បើកដំណើរការ</span>
                    </label>
                  </div>

                  <!-- Bot Quick Link & Status Banner -->
                  <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0, 136, 204, 0.08); border: 1px solid rgba(0, 136, 204, 0.25); border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <i class="fa-brands fa-telegram" style="color: #0088cc; font-size: 1.6rem;"></i>
                      <div>
                        <strong style="color: var(--text-main); font-size: 0.95rem;">Telegram Bot: @my_master_kh_bot</strong>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">ចុចបើក Bot ក្នុង Telegram រួចចុច Start ដើម្បីទទួលបានសារជូនដំណឹងភ្លាមៗ</div>
                      </div>
                    </div>
                    <a href="https://t.me/my_master_kh_bot" target="_blank" class="btn-primary" style="background: #0088cc; border-color: #0088cc; padding: 6px 14px; font-size: 0.84rem; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 8px rgba(0, 136, 204, 0.3);">
                      <i class="fa-solid fa-arrow-up-right-from-square"></i> <span>បើក Bot ក្នុង Telegram</span>
                    </a>
                  </div>

                  <!-- Token & Chat ID Inputs -->
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 18px;">
                    <div class="form-group" style="margin-bottom: 0;">
                      <label for="tgInputToken" style="font-weight: 700; font-size: 0.86rem;">
                        <i class="fa-solid fa-key" style="color: #0088cc;"></i> Telegram Bot Token:
                      </label>
                      <input type="text" id="tgInputToken" class="form-control font-mono" placeholder="ឧ. 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ..." value="${App.escapeHtml(tgConfig.botToken || '')}" style="font-size: 0.85rem;">
                      <small style="color: var(--text-muted); font-size: 0.75rem;">ទទួលបានពី <a href="https://t.me/BotFather" target="_blank" style="color: #0088cc; font-weight: 600;">@BotFather</a></small>
                    </div>

                    <div class="form-group" style="margin-bottom: 0;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <label for="tgInputChatId" style="font-weight: 700; font-size: 0.86rem; margin: 0;">
                          <i class="fa-solid fa-bullhorn" style="color: #0088cc;"></i> Chat ID / Group ID:
                        </label>
                        <button type="button" id="autoDetectTgChatIdBtn" style="background: none; border: none; color: #0088cc; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px; padding: 0;" title="ទាញយក Chat ID ដោយស្វ័យប្រវត្តពីសារ Telegram">
                          <i class="fa-solid fa-wand-magic-sparkles"></i> <span>រក Chat ID ស្វ័យប្រវត្តិ</span>
                        </button>
                      </div>
                      <div style="display: flex; gap: 8px;">
                        <input type="text" id="tgInputChatId" class="form-control font-mono" placeholder="ឧ. -1001234567890 ឬ @your_channel" value="${App.escapeHtml(tgConfig.chatId || '')}" style="font-size: 0.85rem; flex: 1;">
                      </div>
                      <small style="color: var(--text-muted); font-size: 0.75rem;">អត្តលេខ Group/Channel ឬ Telegram Username (ចុច 'រក Chat ID ស្វ័យប្រវត្តិ' ពេលផ្ញើសារចូល Bot)</small>
                    </div>
                  </div>

                  <!-- Event Notification Toggles -->
                  <div style="font-weight: 700; font-size: 0.88rem; margin-bottom: 10px; color: var(--text-main);">
                    <i class="fa-solid fa-bell" style="color: #f59e0b;"></i> ជ្រើសរើសព្រឹត្តិការណ៍ដែលត្រូវជូនដំណឹង (Notification Triggers):
                  </div>

                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; font-size: 0.85rem;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; background: var(--bg-surface); padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-color);">
                      <input type="checkbox" id="tgNotifyNewStudent" ${tgConfig.notifyNewStudent !== false ? 'checked' : ''} style="width: 17px; height: 17px; accent-color: #0088cc;">
                      <span><strong>ចុះឈ្មោះសិស្សថ្មី:</strong> ពេលបញ្ចូលសិស្សថ្មី (Enrollment)</span>
                    </label>

                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; background: var(--bg-surface); padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-color);">
                      <input type="checkbox" id="tgNotifyAttendance" ${tgConfig.notifyAttendance ? 'checked' : ''} style="width: 17px; height: 17px; accent-color: #0088cc;">
                      <span><strong>វត្តមានសិស្ស:</strong> ពេលស្កេន QR & គ្រីសវត្តមាន</span>
                    </label>

                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; background: var(--bg-surface); padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-color);">
                      <input type="checkbox" id="tgNotifyPayment" ${tgConfig.notifyPayment ? 'checked' : ''} style="width: 17px; height: 17px; accent-color: #0088cc;">
                      <span><strong>ថ្លៃសិក្សា:</strong> ពេលកត់ត្រាបង់ប្រាក់ $50</span>
                    </label>

                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; background: var(--bg-surface); padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-color);">
                      <input type="checkbox" id="tgNotifyExam" ${tgConfig.notifyExam ? 'checked' : ''} style="width: 17px; height: 17px; accent-color: #0088cc;">
                      <span><strong>ប្រឡងកុំព្យូទ័រ:</strong> ពេលសិស្សប្រឡងជាប់</span>
                    </label>

                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; background: var(--bg-surface); padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-color);">
                      <input type="checkbox" id="tgNotifyCertificate" ${tgConfig.notifyCertificate ? 'checked' : ''} style="width: 17px; height: 17px; accent-color: #0088cc;">
                      <span><strong>វិញ្ញាបនបត្រ:</strong> ពេលចេញ Certificate ថ្មី</span>
                    </label>
                  </div>
                </div>

                <!-- Telegram Buttons -->
                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                  <button type="button" id="saveTelegramConfigBtn" class="btn-primary" style="background: #0088cc; border-color: #0088cc; box-shadow: 0 4px 14px rgba(0, 136, 204, 0.35);">
                    <i class="fa-solid fa-floppy-disk"></i>
                    <span>រក្សាទុកការកំណត់ Telegram</span>
                  </button>
                  <button type="button" id="testTelegramBtn" class="btn-secondary" style="color: #0088cc; border-color: #0088cc;">
                    <i class="fa-solid fa-paper-plane"></i>
                    <span>សាកល្បងផ្ញើសារ (Send Test Message)</span>
                  </button>
                </div>
              </form>
            </div>
          `;
        })()}

        <!-- ========================================================= -->
        <!-- TEACHER & STAFF MANAGEMENT SECTION (គ្រប់គ្រងឈ្មោះគ្រូ) -->
        <!-- ========================================================= -->
        <div class="card mt-4">
          <div class="card-header-clean" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
            <div class="card-title">
              <i class="fa-solid fa-chalkboard-user text-indigo-500"></i>
              <span>គ្រប់គ្រងគណនីគ្រូបង្រៀន & បុគ្គលិក (Teacher & Staff Management)</span>
            </div>
            <button type="button" id="addNewTeacherBtn" class="btn-primary" style="background: linear-gradient(135deg, #4f46e5, #7c3aed); border: none; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);">
              <i class="fa-solid fa-user-plus"></i>
              <span>+ បន្ថែមគ្រូបង្រៀនថ្មី</span>
            </button>
          </div>

          <p style="margin-bottom: 20px; font-size: 0.92rem; color: var(--text-muted);">
            បញ្ជីឈ្មោះគ្រូបង្រៀន និងបុគ្គលិកដែលមានសិទ្ធិ Login ចូលប្រព័ន្ធ ដើម្បីគ្រប់គ្រងទិន្នន័យសិស្ស កត់ត្រាវត្តមាន និងបញ្ចូលពិន្ទុប្រឡង។
          </p>

          <!-- Teachers Grid List -->
          <div id="teachersGridContainer" class="teachers-grid-container">
            ${this.renderTeachersList()}
          </div>
        </div>

        <!-- MODAL: ADD / EDIT TEACHER -->
        <div id="teacherManageModal" class="modal-overlay">
          <div class="modal-card" style="max-width: 580px;">
            <div class="modal-header">
              <h3 id="teacherModalTitle"><i class="fa-solid fa-user-tie text-indigo-500"></i> បន្ថែមគ្រូបង្រៀនថ្មី</h3>
              <button type="button" class="modal-close-btn" id="closeTeacherModalBtn">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div class="modal-body">
              <form id="teacherManageForm" autocomplete="off">
                <input type="hidden" id="teacherEditId" value="">

                <!-- Avatar Preview & Selection -->
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px; background: var(--border-light); padding: 14px; border-radius: var(--border-radius);">
                  <img id="teacherAvatarPreview" src="assets/images/default-male.svg" alt="Avatar" style="width: 70px; height: 70px; border-radius: 50%; object-fit: cover; border: 3px solid #8b5cf6;" onerror="this.src='assets/images/default-male.svg'">
                  <div style="flex: 1;">
                    <label style="font-size: 0.8rem; font-weight: 700; display: block; margin-bottom: 4px;">រូបថតគ្រូបង្រៀន (Avatar URL ឬ Upload)</label>
                    <div style="display: flex; gap: 8px;">
                      <input type="text" id="teacherInputAvatar" class="form-control" placeholder="https://... ឬទុកទទេដើម្បីប្រើរូបលំនាំដើម" style="font-size: 0.82rem;">
                      <label class="btn-secondary" style="margin: 0; cursor: pointer; padding: 0 12px; display: inline-flex; align-items: center;" title="Upload រូបភាពពីកុំព្យូទ័រ">
                        <i class="fa-solid fa-upload"></i>
                        <input type="file" id="teacherAvatarFileInput" accept="image/*" style="display: none;">
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Row 1: Name Kh & Name En -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
                  <div class="form-group">
                    <label for="teacherInputNameKh">ឈ្មោះខ្មែរ <span style="color: #ef4444;">*</span></label>
                    <input type="text" id="teacherInputNameKh" class="form-control" placeholder="ឧ. លោកគ្រូ ហុង វណ្ណា" required>
                  </div>
                  <div class="form-group">
                    <label for="teacherInputNameEn">ឈ្មោះឡាតាំង (English Name)</label>
                    <input type="text" id="teacherInputNameEn" class="form-control" placeholder="ឧ. Mr. Hong Vanna">
                  </div>
                </div>

                <!-- Row 2: Gender & Role -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
                  <div class="form-group">
                    <label for="teacherInputGender">ភេទ</label>
                    <select id="teacherInputGender" class="form-control">
                      <option value="ប្រុស">ប្រុស (Male)</option>
                      <option value="ស្រី">ស្រី (Female)</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="teacherInputRole">តួនាទី / មុខតំណែង <span style="color: #ef4444;">*</span></label>
                    <input type="text" id="teacherInputRole" class="form-control" placeholder="ឧ. គ្រូបង្រៀនកុំព្យូទ័ររដ្ឋបាល" value="គ្រូបង្រៀន" required>
                  </div>
                </div>

                <!-- Row 3: Username & Password -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; background: rgba(99, 102, 241, 0.06); padding: 12px; border-radius: 10px; border: 1px dashed rgba(99, 102, 241, 0.3);">
                  <div class="form-group" style="margin-bottom: 0;">
                    <label for="teacherInputUsername">ឈ្មោះគណនី Login (Username) <span style="color: #ef4444;">*</span></label>
                    <input type="text" id="teacherInputUsername" class="form-control" placeholder="ឧ. vanna ឬ teacher2" required>
                  </div>
                  <div class="form-group" style="margin-bottom: 0;">
                    <label for="teacherInputPassword">លេខសម្ងាត់ Login (Password) <span style="color: #ef4444;">*</span></label>
                    <input type="text" id="teacherInputPassword" class="form-control" placeholder="លេខសម្ងាត់..." value="123" required>
                  </div>
                </div>

                <!-- Row 4: Phone & Email -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px;">
                  <div class="form-group">
                    <label for="teacherInputPhone">លេខទូរស័ព្ទ</label>
                    <input type="text" id="teacherInputPhone" class="form-control" placeholder="ឧ. 012 345 678">
                  </div>
                  <div class="form-group">
                    <label for="teacherInputEmail">អ៊ីមែល (Email)</label>
                    <input type="email" id="teacherInputEmail" class="form-control" placeholder="ឧ. vanna@masterschool.edu.kh">
                  </div>
                </div>

                <!-- Modal Actions -->
                <div style="display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid var(--border-color); padding-top: 16px;">
                  <button type="button" class="btn-secondary" id="cancelTeacherModalBtn">បោះបង់</button>
                  <button type="submit" class="btn-primary" id="saveTeacherSubmitBtn" style="background: linear-gradient(135deg, #4f46e5, #7c3aed); border: none;">
                    <i class="fa-solid fa-floppy-disk"></i>
                    <span>រក្សាទុកព័ត៌មានគ្រូ</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

      </section>
    `;
  },

  renderTeachersList() {
    const teachers = (typeof AuthService !== "undefined") ? AuthService.getTeachers() : [];
    const currentUser = (typeof AuthService !== "undefined") ? AuthService.getCurrentUser() : null;

    if (!teachers || teachers.length === 0) {
      return `
        <div style="text-align: center; padding: 30px; color: var(--text-muted);">
          <i class="fa-solid fa-user-slash fa-2x mb-2"></i>
          <p>មិនទាន់មានគណនីគ្រូបង្រៀននៅឡើយទេ។ សូមចុចប៊ូតុងខាងលើដើម្បីបន្ថែម។</p>
        </div>
      `;
    }

    return `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;">
        ${teachers.map(t => {
          const isMe = currentUser && currentUser.id === t.id;
          return `
            <div class="teacher-card-item" style="background: var(--bg-surface); border: 1.5px solid ${isMe ? '#8b5cf6' : 'var(--border-color)'}; border-radius: 16px; padding: 18px; position: relative; box-shadow: var(--shadow-xs); transition: var(--transition);">
              ${isMe ? `
                <span style="position: absolute; top: 12px; right: 12px; background: rgba(139, 92, 246, 0.15); color: #8b5cf6; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 12px;">
                  <i class="fa-solid fa-circle-check"></i> គណនីរបស់អ្នក
                </span>
              ` : ''}
              
              <div style="display: flex; gap: 14px; align-items: center; margin-bottom: 14px;">
                <img src="${t.avatar || (t.gender === 'ស្រី' ? 'assets/images/default-female.svg' : 'assets/images/default-male.svg')}" 
                     alt="${t.nameKh}" 
                     style="width: 56px; height: 56px; border-radius: 50%; object-fit: cover; border: 2px solid #8b5cf6;"
                     onerror="this.src='assets/images/default-male.svg'">
                <div>
                  <h4 style="margin: 0 0 2px 0; font-size: 1rem; font-weight: 800; color: var(--text-main);">${t.nameKh}</h4>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">${t.nameEn || ''}</div>
                  <span style="display: inline-block; background: rgba(99, 102, 241, 0.1); color: #4f46e5; font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 6px; margin-top: 4px;">
                    ${t.role || 'គ្រូបង្រៀន'}
                  </span>
                </div>
              </div>

              <div style="background: var(--border-light); border-radius: 10px; padding: 10px 12px; font-size: 0.8rem; margin-bottom: 14px; display: flex; flex-direction: column; gap: 4px;">
                <div><span style="color: var(--text-muted);">Username (Login):</span> <strong class="font-mono text-indigo-600">${t.username}</strong></div>
                <div><span style="color: var(--text-muted);">Password:</span> <strong class="font-mono">${t.password || '123'}</strong></div>
                <div><span style="color: var(--text-muted);">ទូរស័ព្ទ:</span> <strong>${t.phone || '—'}</strong></div>
                <div><span style="color: var(--text-muted);">អ៊ីមែល:</span> <span style="font-size: 0.75rem;">${t.email || '—'}</span></div>
              </div>

              <div style="display: flex; gap: 8px; justify-content: flex-end;">
                <button type="button" class="btn-secondary btn-sm" onclick="SettingsView.openEditTeacherModal('${t.id}')" title="កែប្រែព័ត៌មានគ្រូ">
                  <i class="fa-solid fa-pen-to-square"></i> <span>កែប្រែ</span>
                </button>
                ${!isMe ? `
                  <button type="button" class="btn-outline-danger btn-sm" onclick="SettingsView.handleDeleteTeacher('${t.id}', '${App.escapeHtml(t.nameKh)}')" title="លុបគណនីគ្រូ">
                    <i class="fa-solid fa-trash-can"></i> <span>លុប</span>
                  </button>
                ` : ''}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  },

  openAddTeacherModal() {
    const modal = document.getElementById("teacherManageModal");
    const title = document.getElementById("teacherModalTitle");
    const form = document.getElementById("teacherManageForm");
    const idInput = document.getElementById("teacherEditId");
    const preview = document.getElementById("teacherAvatarPreview");

    if (form) form.reset();
    if (idInput) idInput.value = "";
    if (title) title.innerHTML = `<i class="fa-solid fa-user-plus text-indigo-500"></i> បន្ថែមគ្រូបង្រៀនថ្មី`;
    if (preview) preview.src = "assets/images/default-male.svg";

    const passInput = document.getElementById("teacherInputPassword");
    if (passInput) passInput.value = "123";

    if (modal) {
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  },

  openEditTeacherModal(teacherId) {
    const teachers = (typeof AuthService !== "undefined") ? AuthService.getTeachers() : [];
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;

    const modal = document.getElementById("teacherManageModal");
    const title = document.getElementById("teacherModalTitle");
    const idInput = document.getElementById("teacherEditId");
    const nameKhInput = document.getElementById("teacherInputNameKh");
    const nameEnInput = document.getElementById("teacherInputNameEn");
    const genderInput = document.getElementById("teacherInputGender");
    const roleInput = document.getElementById("teacherInputRole");
    const userInput = document.getElementById("teacherInputUsername");
    const passInput = document.getElementById("teacherInputPassword");
    const phoneInput = document.getElementById("teacherInputPhone");
    const emailInput = document.getElementById("teacherInputEmail");
    const avatarInput = document.getElementById("teacherInputAvatar");
    const preview = document.getElementById("teacherAvatarPreview");

    if (title) title.innerHTML = `<i class="fa-solid fa-user-pen text-indigo-500"></i> កែប្រែព័ត៌មានគ្រូ៖ ${teacher.nameKh}`;
    if (idInput) idInput.value = teacher.id;
    if (nameKhInput) nameKhInput.value = teacher.nameKh || "";
    if (nameEnInput) nameEnInput.value = teacher.nameEn || "";
    if (genderInput) genderInput.value = teacher.gender || "ប្រុស";
    if (roleInput) roleInput.value = teacher.role || "គ្រូបង្រៀន";
    if (userInput) userInput.value = teacher.username || "";
    if (passInput) passInput.value = teacher.password || "123";
    if (phoneInput) phoneInput.value = teacher.phone || "";
    if (emailInput) emailInput.value = teacher.email || "";
    if (avatarInput) avatarInput.value = teacher.avatar || "";
    if (preview) preview.src = teacher.avatar || (teacher.gender === "ស្រី" ? "assets/images/default-female.svg" : "assets/images/default-male.svg");

    if (modal) {
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  },

  closeTeacherModal() {
    const modal = document.getElementById("teacherManageModal");
    if (modal) {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }
  },

  async handleDeleteTeacher(teacherId, teacherName) {
    if (!confirm(`តើអ្នកពិតជាចង់លុបគណនីគ្រូបង្រៀន "${teacherName}" នេះមែនទេ?`)) {
      return;
    }

    try {
      await AuthService.deleteTeacher(teacherId);
      App.showToast(`បានលុបគណនី ${teacherName} ដោយជោគជ័យ!`, "success");
      this.refreshTeachersGrid();
    } catch (err) {
      App.showToast(err.message || "លុបមិនបានជោគជ័យ!", "error");
    }
  },

  async refreshTeachersGrid() {
    if (typeof AuthService !== "undefined" && AuthService.fetchTeachersCloud) {
      await AuthService.fetchTeachersCloud();
    }
    const container = document.getElementById("teachersGridContainer");
    if (container) {
      container.innerHTML = this.renderTeachersList();
    }
  },

  initEvents() {
    const testConnBtn = document.getElementById("testConnectionBtn");
    const syncNowBtn = document.getElementById("syncNowBtn");
    const clearStudentsBtn = document.getElementById("clearAllStudentsBtn");

    if (testConnBtn) {
      testConnBtn.addEventListener("click", async () => {
        testConnBtn.disabled = true;
        testConnBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> កំពុងសាកល្បង...`;

        const result = await StudentAPI.testConnection();
        testConnBtn.disabled = false;
        testConnBtn.innerHTML = `<i class="fa-solid fa-plug"></i> សាកល្បងការតភ្ជាប់ (Test Connection)`;

        if (result.success) {
          App.showToast(`ការតភ្ជាប់ Firebase ជោគជ័យ! ទិន្នន័យសិស្សសរុប: ${result.count} នាក់`, "success");
        } else {
          App.showToast("ការតភ្ជាប់ Firebase បរាជ័យ: " + result.error, "error");
        }
      });
    }

    if (syncNowBtn) {
      syncNowBtn.addEventListener("click", async () => {
        syncNowBtn.disabled = true;
        syncNowBtn.innerHTML = `<i class="fa-solid fa-arrows-rotate fa-spin"></i> កំពុង Sync...`;
        await App.loadData(true);
        if (typeof AuthService !== "undefined" && AuthService.fetchTeachersCloud) {
          await AuthService.fetchTeachersCloud();
        }
        await this.refreshTeachersGrid();
        syncNowBtn.disabled = false;
        syncNowBtn.innerHTML = `<i class="fa-solid fa-arrows-rotate"></i> Sync ទិន្នន័យពី Firebase ឥឡូវនេះ`;
        App.showToast("បានធ្វើសមកាលកម្មទិន្នន័យសិស្ស និងគ្រូពី Firebase ជោគជ័យ!", "success");
      });
    }

    if (clearStudentsBtn) {
      clearStudentsBtn.addEventListener("click", async () => {
        if (confirm("តើអ្នកពិតជាចង់លុបទិន្នន័យសិស្សទាំងអស់ចោល ដើម្បីទុកបញ្ចូលសិស្សថ្មីមែនទេ?")) {
          clearStudentsBtn.disabled = true;
          await StudentAPI.clearAllStudents();
          await App.loadData(false);
          clearStudentsBtn.disabled = false;
          App.showToast("បានលុបទិន្នន័យសិស្សទាំងអស់រួចរាល់ ទុកឲ្យលោកគ្រូជាអ្នកបញ្ចូលថ្មី!", "success");
        }
      });
    }

    const clearExamsBtn = document.getElementById("clearAllExamsBtn");
    if (clearExamsBtn) {
      clearExamsBtn.addEventListener("click", async () => {
        if (confirm("តើអ្នកពិតជាចង់កំណត់ពិន្ទុប្រឡងទាំងអស់ទៅគ្មាន (អត់ទាន់ប្រឡង) មែនទេ?")) {
          clearExamsBtn.disabled = true;
          await StudentAPI.clearAllExams();
          await App.loadData(false);
          clearExamsBtn.disabled = false;
          App.showToast("បានសម្អាតពិន្ទុប្រឡងទាំងអស់រួចរាល់ (គ្មានពិន្ទុទាំងអស់)! ", "success");
        }
      });
    }

    // ----------------------------------------------------
    // TEACHER MANAGEMENT MODAL & FORM EVENTS
    // ----------------------------------------------------
    const addTeacherBtn = document.getElementById("addNewTeacherBtn");
    const closeTeacherBtn = document.getElementById("closeTeacherModalBtn");
    const cancelTeacherBtn = document.getElementById("cancelTeacherModalBtn");
    const teacherForm = document.getElementById("teacherManageForm");
    const teacherGender = document.getElementById("teacherInputGender");
    const teacherAvatarInput = document.getElementById("teacherInputAvatar");
    const teacherAvatarPreview = document.getElementById("teacherAvatarPreview");
    const teacherAvatarFile = document.getElementById("teacherAvatarFileInput");

    if (addTeacherBtn) {
      addTeacherBtn.addEventListener("click", () => this.openAddTeacherModal());
    }

    if (closeTeacherBtn) {
      closeTeacherBtn.addEventListener("click", () => this.closeTeacherModal());
    }

    if (cancelTeacherBtn) {
      cancelTeacherBtn.addEventListener("click", () => this.closeTeacherModal());
    }

    // Dynamic avatar preview when typing URL
    if (teacherAvatarInput && teacherAvatarPreview) {
      teacherAvatarInput.addEventListener("input", () => {
        const val = teacherAvatarInput.value.trim();
        if (val) {
          teacherAvatarPreview.src = val;
        } else {
          teacherAvatarPreview.src = teacherGender?.value === "ស្រី" ? "assets/images/default-female.svg" : "assets/images/default-male.svg";
        }
      });
    }

    // Dynamic avatar preview when changing gender
    if (teacherGender && teacherAvatarPreview) {
      teacherGender.addEventListener("change", () => {
        if (!teacherAvatarInput || !teacherAvatarInput.value.trim()) {
          teacherAvatarPreview.src = teacherGender.value === "ស្រី" ? "assets/images/default-female.svg" : "assets/images/default-male.svg";
        }
      });
    }

    // Upload and compress teacher avatar file
    if (teacherAvatarFile && teacherAvatarPreview) {
      teacherAvatarFile.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            teacherAvatarPreview.style.opacity = "0.5";
            const compressed = await StudentAPI.compressImage(file, 400, 0.82);
            teacherAvatarPreview.src = compressed;
            if (teacherAvatarInput) teacherAvatarInput.value = compressed;
            App.showToast("បានបញ្ចូលរូបថតរួចរាល់!", "info");
          } catch (err) {
            App.showToast("មិនអាចដំណើរការរូបភាពបានទេ!", "error");
          } finally {
            teacherAvatarPreview.style.opacity = "1";
          }
        }
      });
    }

    // Teacher Form Submit
    if (teacherForm) {
      teacherForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = document.getElementById("teacherEditId")?.value.trim();
        const nameKh = document.getElementById("teacherInputNameKh")?.value.trim();
        const nameEn = document.getElementById("teacherInputNameEn")?.value.trim();
        const gender = document.getElementById("teacherInputGender")?.value;
        const role = document.getElementById("teacherInputRole")?.value.trim();
        const username = document.getElementById("teacherInputUsername")?.value.trim();
        const password = document.getElementById("teacherInputPassword")?.value.trim();
        const phone = document.getElementById("teacherInputPhone")?.value.trim();
        const email = document.getElementById("teacherInputEmail")?.value.trim();
        const avatar = document.getElementById("teacherInputAvatar")?.value.trim();

        const submitBtn = document.getElementById("saveTeacherSubmitBtn");
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> កំពុងរក្សាទុក...`;
        }

        try {
          const teacherData = {
            nameKh,
            nameEn,
            gender,
            role,
            username,
            password,
            phone,
            email,
            avatar
          };

          if (id) {
            await AuthService.updateTeacher(id, teacherData);
            App.showToast(`បានកែសម្រួលព័ត៌មានគ្រូ ${nameKh} ជោគជ័យ!`, "success");
          } else {
            await AuthService.addTeacher(teacherData);
            App.showToast(`🎉 បានបន្ថែមគ្រូបង្រៀនថ្មី ${nameKh} ដោយជោគជ័យ!`, "success");
          }

          this.closeTeacherModal();
          this.refreshTeachersGrid();
        } catch (err) {
          App.showToast(err.message || "រក្សាទុកបរាជ័យ!", "error");
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> <span>រក្សាទុកព័ត៌មានគ្រូ</span>`;
          }
        }
      });
    }

    // ----------------------------------------------------
    // TELEGRAM BOT NOTIFICATIONS EVENTS
    // ----------------------------------------------------
    const saveTgBtn = document.getElementById("saveTelegramConfigBtn");
    const testTgBtn = document.getElementById("testTelegramBtn");

    if (saveTgBtn) {
      saveTgBtn.addEventListener("click", () => {
        const enabled = document.getElementById("tgInputEnabled")?.checked ?? false;
        const botToken = document.getElementById("tgInputToken")?.value.trim() || "";
        const chatId = document.getElementById("tgInputChatId")?.value.trim() || "";
        const notifyNewStudent = document.getElementById("tgNotifyNewStudent")?.checked ?? true;
        const notifyAttendance = document.getElementById("tgNotifyAttendance")?.checked ?? true;
        const notifyPayment = document.getElementById("tgNotifyPayment")?.checked ?? true;
        const notifyExam = document.getElementById("tgNotifyExam")?.checked ?? true;
        const notifyCertificate = document.getElementById("tgNotifyCertificate")?.checked ?? true;

        const newConfig = {
          enabled,
          botToken,
          chatId,
          notifyNewStudent,
          notifyAttendance,
          notifyPayment,
          notifyExam,
          notifyCertificate
        };

        if (typeof TelegramService !== "undefined") {
          TelegramService.saveConfig(newConfig);
        }

        const badge = document.getElementById("telegramStatusBadge");
        if (badge) {
          badge.innerHTML = enabled 
            ? '<i class="fa-solid fa-circle-check"></i> បើកដំណើរការ (Active)' 
            : '<i class="fa-solid fa-circle-pause"></i> បិទដំណើរការ (Disabled)';
        }

        App.showToast("បានរក្សាទុកការកំណត់ Telegram Bot ដោយជោគជ័យ!", "success");
      });
    }

    // Auto-detect Telegram Chat ID button
    const autoDetectTgBtn = document.getElementById("autoDetectTgChatIdBtn");
    if (autoDetectTgBtn) {
      autoDetectTgBtn.addEventListener("click", async () => {
        const origText = autoDetectTgBtn.innerHTML;
        autoDetectTgBtn.disabled = true;
        autoDetectTgBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> កំពុងស្វែងរក...`;

        try {
          if (typeof TelegramService !== "undefined") {
            const res = await TelegramService.autoDetectChatId();
            const chatIdInput = document.getElementById("tgInputChatId");
            if (chatIdInput) {
              chatIdInput.value = res.chatId;
            }
            const enabledCheckbox = document.getElementById("tgInputEnabled");
            if (enabledCheckbox) {
              enabledCheckbox.checked = true;
            }
            const badge = document.getElementById("telegramStatusBadge");
            if (badge) {
              badge.innerHTML = '<i class="fa-solid fa-circle-check"></i> បើកដំណើរការ (Active)';
            }

            App.showToast(`🎉 រកឃើញ Chat ID ជោគជ័យ: ${res.chatId} (${res.chatTitle})!`, "success");
            App.triggerConfetti();

            // Send test message
            const botToken = document.getElementById("tgInputToken")?.value.trim() || APP_CONFIG.telegramConfig.botToken;
            await TelegramService.sendTestMessage(botToken, res.chatId);
          }
        } catch (err) {
          App.showToast(err.message, "warning");
        } finally {
          autoDetectTgBtn.disabled = false;
          autoDetectTgBtn.innerHTML = origText;
        }
      });
    }

    if (testTgBtn) {
      testTgBtn.addEventListener("click", async () => {
        const botToken = document.getElementById("tgInputToken")?.value.trim() || "";
        const chatId = document.getElementById("tgInputChatId")?.value.trim() || "";

        if (!botToken || !chatId) {
          App.showToast("សូមបញ្ចូល Bot Token និង Chat ID ជាមុនសិន!", "warning");
          return;
        }

        const origHtml = testTgBtn.innerHTML;
        testTgBtn.disabled = true;
        testTgBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> កំពុងផ្ញើសារសាកល្បង...`;

        try {
          if (typeof TelegramService !== "undefined") {
            const success = await TelegramService.sendTestMessage(botToken, chatId);
            if (success) {
              App.showToast("🎉 បានផ្ញើសារសាកល្បងទៅកាន់ Telegram ជោគជ័យ!", "success");
              App.triggerConfetti();
            } else {
              App.showToast("⚠️ មិនអាចផ្ញើសារបានទេ! សូមពិនិត្យមើល Bot Token និង Chat ID ម្តងទៀត។", "error");
            }
          }
        } catch (e) {
          App.showToast("កំហុសក្នុងការផ្ញើសារ: " + e.message, "error");
        } finally {
          testTgBtn.disabled = false;
          testTgBtn.innerHTML = origHtml;
        }
      });
    }
  }
};


