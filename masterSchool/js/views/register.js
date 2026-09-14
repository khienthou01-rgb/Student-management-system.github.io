/**
 * View: Student Registration Form (Enrollment)
 */
const RegisterView = {
  render() {
    return `
      <section id="view-register" class="page-view">
        <div class="card">
          <div class="card-header-clean">
            <div class="card-title">
              <i class="fa-solid fa-user-plus"></i>
              <span>ទម្រង់បែបបទចុះឈ្មោះសិស្សថ្មី (Student Registration Form)</span>
            </div>
            <span class="text-sm text-muted">សូមបំពេញព័ត៌មានដែលចាំបាច់ (*)</span>
          </div>

          <form id="studentForm" method="dialog" onsubmit="event.preventDefault(); return false;">
            <!-- Avatar Profile Section -->
            <div class="avatar-upload-box">
              <img id="avatarPreview" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&fit=crop&crop=faces" alt="រូបថតសិស្ស" class="avatar-preview-img">
              <div class="avatar-upload-actions">
                <label class="form-label">រូបថតសិស្ស (Student Photo)</label>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                  <label class="btn-secondary" style="cursor: pointer;">
                    <i class="fa-solid fa-upload"></i> ជ្រើសរើសរូបភាពពីម៉ាស៊ីន
                    <input type="file" id="avatarFile" accept="image/*" style="display: none;">
                  </label>
                  <input type="url" id="avatarInput" name="avatar" class="form-control" style="flex: 1; min-width: 240px;" placeholder="ឬបិទភ្ជាប់ Image URL (https://...)">
                </div>
                <span class="text-xs text-muted">ទំហំអនុញ្ញាតអតិបរមា 2MB (ប្រភេទ JPG, PNG, WebP)</span>
              </div>
            </div>

            <!-- Form Inputs Grid -->
            <div class="form-grid">
              <!-- Name in Khmer -->
              <div class="form-group">
                <label class="form-label">
                  <span>ឈ្មោះជាភាសាខ្មែរ (Khmer Name)</span>
                  <span class="required">*</span>
                </label>
                <input type="text" name="nameKh" class="form-control" placeholder="ឧទាហរណ៍៖ ចាន់ សុខា" required>
              </div>

              <!-- Name in Latin -->
              <div class="form-group">
                <label class="form-label">ឈ្មោះជាអក្សរឡាតាំង (Latin Name)</label>
                <input type="text" name="nameEn" class="form-control" placeholder="ឧទាហរណ៍៖ Chan Sokha">
              </div>

              <!-- Gender -->
              <div class="form-group">
                <label class="form-label">
                  <span>ភេទ (Gender)</span>
                  <span class="required">*</span>
                </label>
                <select name="gender" id="genderSelect" class="form-control" required>
                  <option value="ប្រុស">ប្រុស (Male)</option>
                  <option value="ស្រី">ស្រី (Female)</option>
                </select>
              </div>


              <!-- Course / Module (Only Computer Courses) -->
              <div class="form-group" id="regCourseGroup">
                <label class="form-label">
                  <span><i class="fa-solid fa-laptop-code text-indigo-500"></i> វគ្គសិក្សាកុំព្យូទ័រ (Computer Course)</span>
                  <span class="required">*</span>
                </label>
                <select name="course" class="form-control" id="regCourseSelect" required>
                  <option value="">-- សូមជ្រើសរើសវគ្គសិក្សាកុំព្យូទ័រ --</option>
                  ${APP_CONFIG.computerCourses.map(c => `<option value="${c.name}">${c.name} (${c.desc})</option>`).join('')}
                </select>
                <input type="hidden" name="grade" value="ថ្នាក់កុំព្យូទ័រ">
              </div>

              <!-- Shift -->
              <div class="form-group">
                <label class="form-label">វេនសិក្សា (Study Shift)</label>
                <select name="shift" class="form-control">
                  ${APP_CONFIG.shifts.map(s => `<option value="${s.id}">${s.label}</option>`).join('')}
                </select>
              </div>

              <!-- Phone -->
              <div class="form-group">
                <label class="form-label">លេខទូរស័ព្ទសិស្ស (Student Phone)</label>
                <input type="tel" name="phone" class="form-control" placeholder="012 345 678">
              </div>


              <!-- Status -->
              <div class="form-group">
                <label class="form-label">ស្ថានភាពសិស្ស (Enrollment Status)</label>
                <select name="status" class="form-control">
                  <option value="Active">កំពុងសិក្សា (Active)</option>
                  <option value="Inactive">ផ្អាកការសិក្សា (Suspended/Leave)</option>
                  <option value="Graduated">បញ្ចប់ការសិក្សា (Graduated)</option>
                </select>
              </div>

              <!-- Study Date -->
              <div class="form-group">
                <label class="form-label">ថ្ងៃចូលរៀន (Start Date)</label>
                <input type="date" name="startDate" class="form-control" value="${new Date().toISOString().split('T')[0]}">
              </div>

              <!-- Address / Province -->
              <div class="form-group">
                <label class="form-label">រាជធានី/ខេត្ត (Province/City)</label>
                <select name="address" class="form-control">
                  ${APP_CONFIG.provinces.map(p => `<option value="${p}">${p}</option>`).join('')}
                </select>
              </div>

              <!-- Student Login PIN / Password -->
              <div class="form-group">
                <label class="form-label">
                  <span><i class="fa-solid fa-key text-purple-500"></i> លេខកូដសម្ងាត់សិស្ស (Student Login PIN)</span>
                  <span class="text-xs text-muted">(លំនាំដើម: 123)</span>
                </label>
                <input type="text" name="pin" class="form-control" placeholder="កំណត់លេខកូដសម្ងាត់ (ឧ. 123 ឬ 123456)" value="123">
              </div>
            </div>

            <!-- Form Action Buttons -->
            <div style="margin-top: 30px; display: flex; gap: 14px; justify-content: flex-end;">
              <button type="button" id="resetFormBtn" class="btn-secondary">
                <i class="fa-solid fa-arrow-rotate-left"></i>
                <span>សម្អាតទម្រង់ (Clear)</span>
              </button>
              <button type="submit" class="btn-primary">
                <i class="fa-solid fa-check"></i>
                <span>រក្សាទុកទិន្នន័យ (Save Student)</span>
              </button>
            </div>
          </form>
        </div>
      </section>
    `;
  },

  initEvents() {
    const form = document.getElementById("studentForm");
    const avatarInput = document.getElementById("avatarInput");
    const avatarFile = document.getElementById("avatarFile");
    const avatarPreview = document.getElementById("avatarPreview");

    // Avatar URL input change
    if (avatarInput && avatarPreview) {
      avatarInput.addEventListener("input", (e) => {
        const url = e.target.value.trim();
        if (url) {
          avatarPreview.src = url;
        } else {
          avatarPreview.src = App.getDefaultAvatar(document.getElementById("genderSelect")?.value);
        }
      });
    }

    // Avatar File upload change (Automatic compression for Firebase storage)
    if (avatarFile && avatarPreview) {
      avatarFile.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            avatarPreview.style.opacity = "0.5";
            const compressedDataUrl = await StudentAPI.compressImage(file, 480, 0.82);
            avatarPreview.src = compressedDataUrl;
            if (avatarInput) avatarInput.value = compressedDataUrl;
            App.showToast("បានបង្រួមរូបភាពរួចរាល់ ត្រៀមរក្សាទុកក្នុង Firebase!", "info");
          } catch (err) {
            App.showToast("មិនអាចដំណើរការរូបភាពបានទេ!", "error");
          } finally {
            avatarPreview.style.opacity = "1";
          }
        }
      });
    }

    // Clear Form
    const resetBtn = document.getElementById("resetFormBtn");
    if (resetBtn && form) {
      resetBtn.addEventListener("click", () => {
        this.reset();
      });
    }

    // Submit Form
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        await App.handleRegisterFormSubmit(form);
      });
    }
  },

  reset() {
    const form = document.getElementById("studentForm");
    if (form) form.reset();
    const avatarPreview = document.getElementById("avatarPreview");
    if (avatarPreview) avatarPreview.src = App.getDefaultAvatar("ប្រុស");
  }
};
