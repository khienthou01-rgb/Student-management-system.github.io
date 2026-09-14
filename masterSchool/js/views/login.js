/**
 * View: Professional Dual-Role Authentication Portal (ទម្រង់ចូលប្រព័ន្ធកម្រិតអាជីពសម្រាប់គ្រូ និងសិស្ស)
 */
const LoginView = {
  currentRole: "teacher", // "teacher" | "student"

  render() {
    return `
      <div class="login-page-wrapper">
        <!-- Ambient Glowing Lights -->
        <div class="login-ambient-orb orb-1"></div>
        <div class="login-ambient-orb orb-2"></div>
        <div class="login-ambient-orb orb-3"></div>

        <!-- Master Professional Centered Authentication Card -->
        <div class="login-master-container">
          <div class="login-card-inner">

            <!-- Brand & Academy Header -->
            <div class="login-brand-header">
              <div class="login-brand-icon">
                <i class="fa-solid fa-graduation-cap"></i>
              </div>
              <h1 class="login-brand-title">MasterSchool</h1>
              <p class="login-brand-subtitle">ប្រព័ន្ធគ្រប់គ្រងសិស្ស & ការប្រឡងកុំព្យូទ័ររដ្ឋបាល</p>
            </div>

            <!-- Segmented Dual-Role Tab Switcher -->
            <div class="login-segmented-control">
              <button type="button" class="btn-segmented ${this.currentRole === 'teacher' ? 'active' : ''}" data-role="teacher">
                <i class="fa-solid fa-chalkboard-user"></i>
                <span>👨‍🏫 គ្រូបង្រៀន</span>
              </button>
              <button type="button" class="btn-segmented ${this.currentRole === 'student' ? 'active' : ''}" data-role="student">
                <i class="fa-solid fa-user-graduate"></i>
                <span>🎓 សិស្សានុសិស្ស</span>
              </button>
            </div>

            <!-- ======================================== -->
            <!-- 1. TEACHER AUTHENTICATION FORM           -->
            <!-- ======================================== -->
            <div id="teacherLoginSection" style="display: ${this.currentRole === 'teacher' ? 'block' : 'none'};">

              <!-- Teacher Error Alert Banner -->
              <div id="loginErrorAlert" class="login-error-alert" style="display: none;">
                <i class="fa-solid fa-circle-exclamation"></i>
                <span id="loginErrorMsg">ឈ្មោះគណនី ឬលេខសម្ងាត់មិនត្រឹមត្រូវ!</span>
              </div>

              <!-- Form -->
              <form id="teacherLoginForm" autocomplete="off">
                <div class="form-field-group">
                  <label for="loginUsername">ឈ្មោះគណនីគ្រូ (Username ឬ Email)</label>
                  <div class="input-container-pro">
                    <i class="fa-solid fa-user-tie field-icon"></i>
                    <input type="text" id="loginUsername" class="input-pro" placeholder="បញ្ចូលឈ្មោះគណនី ឬអ៊ីមែល..." required>
                  </div>
                </div>

                <div class="form-field-group">
                  <label for="loginPassword">លេខសម្ងាត់ (Password)</label>
                  <div class="input-container-pro">
                    <i class="fa-solid fa-lock field-icon"></i>
                    <input type="password" id="loginPassword" class="input-pro" placeholder="បញ្ចូលលេខសម្ងាត់..." required>
                    <button type="button" id="togglePasswordVisibility" class="btn-eye-pro" aria-label="បង្ហាញលេខសម្ងាត់">
                      <i class="fa-regular fa-eye"></i>
                    </button>
                  </div>
                </div>

                <div class="form-meta-row">
                  <label class="remember-checkbox-label">
                    <input type="checkbox" id="loginRememberMe" checked>
                    <span>ចងចាំការចូលប្រើ (Remember Me)</span>
                  </label>
                </div>

                <button type="submit" id="loginSubmitBtn" class="btn-submit-pro">
                  <span>ចូលប្រព័ន្ធគ្រប់គ្រង (Sign In)</span>
                  <i class="fa-solid fa-arrow-right"></i>
                </button>
              </form>
            </div>

            <!-- ======================================== -->
            <!-- 2. STUDENT AUTHENTICATION FORM           -->
            <!-- ======================================== -->
            <div id="studentLoginSection" style="display: ${this.currentRole === 'student' ? 'block' : 'none'};">

              <!-- Student Error Alert Banner -->
              <div id="studentLoginErrorAlert" class="login-error-alert" style="display: none;">
                <i class="fa-solid fa-circle-exclamation"></i>
                <span id="studentLoginErrorMsg">អត្តលេខសិស្ស ឬលេខសម្ងាត់មិនត្រឹមត្រូវ!</span>
              </div>

              <!-- Form -->
              <form id="studentLoginForm" autocomplete="off">
                <div class="form-field-group">
                  <label for="studentLoginId">អត្តលេខសិស្ស (Student ID) ឬលេខទូរស័ព្ទ</label>
                  <div class="input-container-pro">
                    <i class="fa-solid fa-id-card field-icon text-purple-500"></i>
                    <input type="text" id="studentLoginId" class="input-pro" placeholder="បញ្ចូលអត្តលេខសិស្ស ឬលេខទូរស័ព្ទ..." required>
                  </div>
                </div>

                <div class="form-field-group">
                  <label for="studentLoginPin">លេខកូដសម្ងាត់ (PIN / Password)</label>
                  <div class="input-container-pro">
                    <i class="fa-solid fa-key field-icon text-purple-500"></i>
                    <input type="password" id="studentLoginPin" class="input-pro" placeholder="បញ្ចូលលេខកូដសម្ងាត់..." required>
                    <button type="button" id="toggleStudentPinVisibility" class="btn-eye-pro" aria-label="បង្ហាញលេខសម្ងាត់">
                      <i class="fa-regular fa-eye"></i>
                    </button>
                  </div>
                </div>

                <div class="form-meta-row">
                  <label class="remember-checkbox-label">
                    <input type="checkbox" id="studentRememberMe" checked>
                    <span>ចងចាំការចូលប្រើ (Remember Me)</span>
                  </label>
                </div>

                <button type="submit" id="studentLoginSubmitBtn" class="btn-submit-pro btn-submit-student">
                  <span>🚀 ចូលទៅកាន់គណនីសិស្ស (Sign In)</span>
                  <i class="fa-solid fa-arrow-right"></i>
                </button>
              </form>
            </div>

            <!-- Card Bottom Security Guarantee Footer -->
            <div class="login-form-footer">
              <div class="footer-security-tag">
                <i class="fa-solid fa-shield-halved text-emerald-500"></i>
                <span>256-Bit SSL Encrypted & Secured</span>
              </div>
              <div class="footer-version">MasterSchool v2.5</div>
            </div>

          </div>
        </div>
      </div>
    `;
  },

  initEvents() {
    // Role Tab Switching (Dual Roles: Teacher & Student)
    const roleBtns = document.querySelectorAll(".btn-segmented");
    const teacherSec = document.getElementById("teacherLoginSection");
    const studentSec = document.getElementById("studentLoginSection");

    roleBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const role = btn.getAttribute("data-role");
        this.currentRole = role;

        roleBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        if (role === "student") {
          if (teacherSec) teacherSec.style.display = "none";
          if (studentSec) studentSec.style.display = "block";
          const sInput = document.getElementById("studentLoginId");
          if (sInput) sInput.focus();
        } else {
          if (teacherSec) teacherSec.style.display = "block";
          if (studentSec) studentSec.style.display = "none";
          const tInput = document.getElementById("loginUsername");
          if (tInput) tInput.focus();
        }
      });
    });

    // ----------------------------------------------------
    // TEACHER LOGIN EVENTS
    // ----------------------------------------------------
    const form = document.getElementById("teacherLoginForm");
    const usernameInput = document.getElementById("loginUsername");
    const passwordInput = document.getElementById("loginPassword");
    const rememberMeCheck = document.getElementById("loginRememberMe");
    const errorAlert = document.getElementById("loginErrorAlert");
    const errorMsg = document.getElementById("loginErrorMsg");
    const eyeBtn = document.getElementById("togglePasswordVisibility");

    if (eyeBtn && passwordInput) {
      eyeBtn.addEventListener("click", () => {
        const isPass = passwordInput.type === "password";
        passwordInput.type = isPass ? "text" : "password";
        eyeBtn.innerHTML = isPass ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
      });
    }

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = usernameInput?.value.trim();
        const password = passwordInput?.value.trim();
        const rememberMe = rememberMeCheck ? rememberMeCheck.checked : true;

        if (errorAlert) errorAlert.style.display = "none";

        const submitBtn = document.getElementById("loginSubmitBtn");
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<span>កំពុងផ្ទៀងផ្ទាត់...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>`;
        }

        try {
          await App.handleLogin(username, password, rememberMe);
        } catch (err) {
          if (errorAlert && errorMsg) {
            errorMsg.textContent = err.message || "ឈ្មោះគណនី ឬលេខសម្ងាត់មិនត្រឹមត្រូវ!";
            errorAlert.style.display = "flex";
            errorAlert.classList.add("shake-animation");
            setTimeout(() => errorAlert.classList.remove("shake-animation"), 600);
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span>ចូលប្រព័ន្ធគ្រប់គ្រង (Sign In)</span> <i class="fa-solid fa-arrow-right"></i>`;
          }
        }
      });
    }

    // ----------------------------------------------------
    // STUDENT LOGIN EVENTS
    // ----------------------------------------------------
    const studentForm = document.getElementById("studentLoginForm");
    const studentIdInput = document.getElementById("studentLoginId");
    const studentPinInput = document.getElementById("studentLoginPin");
    const studentRememberCheck = document.getElementById("studentRememberMe");
    const studentErrorAlert = document.getElementById("studentLoginErrorAlert");
    const studentErrorMsg = document.getElementById("studentLoginErrorMsg");
    const studentEyeBtn = document.getElementById("toggleStudentPinVisibility");

    if (studentEyeBtn && studentPinInput) {
      studentEyeBtn.addEventListener("click", () => {
        const isPass = studentPinInput.type === "password";
        studentPinInput.type = isPass ? "text" : "password";
        studentEyeBtn.innerHTML = isPass ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
      });
    }

    if (studentForm) {
      studentForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const idOrPhone = studentIdInput?.value.trim();
        const pin = studentPinInput?.value.trim();
        const rememberMe = studentRememberCheck ? studentRememberCheck.checked : true;

        if (studentErrorAlert) studentErrorAlert.style.display = "none";

        const submitBtn = document.getElementById("studentLoginSubmitBtn");
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<span>កំពុងផ្ទៀងផ្ទាត់...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>`;
        }

        try {
          await App.handleStudentLogin(idOrPhone, pin, rememberMe);
        } catch (err) {
          if (studentErrorAlert && studentErrorMsg) {
            studentErrorMsg.textContent = err.message || "អត្តលេខសិស្ស ឬលេខកូដមិនត្រឹមត្រូវ!";
            studentErrorAlert.style.display = "flex";
            studentErrorAlert.classList.add("shake-animation");
            setTimeout(() => studentErrorAlert.classList.remove("shake-animation"), 600);
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span>🚀 ចូលទៅកាន់គណនីសិស្ស (Sign In)</span> <i class="fa-solid fa-arrow-right"></i>`;
          }
        }
      });
    }

  }
};


