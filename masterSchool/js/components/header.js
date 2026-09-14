/**
 * Component: Top Header Bar
 */
const HeaderComponent = {
  render() {
    const isStudent = typeof AuthService !== "undefined" && AuthService.isStudent();
    const currentUser = (typeof AuthService !== "undefined" && AuthService.getCurrentUser()) || null;

    return `
      <header class="top-header">
        <div class="header-left">
          ${isStudent ? `
            <div class="student-header-brand" style="display: flex; align-items: center; gap: 12px;">
              <div class="login-brand-icon" style="width: 42px; height: 42px; font-size: 1.2rem;">
                <i class="fa-solid fa-graduation-cap"></i>
              </div>
              <div class="page-title">
                <h2>MasterSchool - គណនីសិស្សានុសិស្ស</h2>
                <p>តាមដានការសិក្សា វត្តមាន និងការប្រឡងបញ្ចប់វគ្គ</p>
              </div>
            </div>
          ` : `
            <button type="button" id="mobileToggle" class="mobile-toggle" aria-label="បើកម៉ឺនុយ">
              <i class="fa-solid fa-bars"></i>
            </button>
            <div class="page-title">
              <h2>ប្រព័ន្ធគ្រប់គ្រងសិស្សសាលា</h2>
              <p>គ្រប់គ្រងទិន្នន័យ ស្ថិតិ និងការតាមដានយ៉ាងរហ័ស</p>
            </div>
          `}
        </div>

        <div class="header-right">
          <!-- Hidden Cloud Connection Indicator (for API state compatibility) -->
          <div id="cloudStatusBadge" style="display: none;"></div>
          <button type="button" id="headerSyncBtn" style="display: none;"></button>

          <!-- Real-Time Digital Clock HUD -->
          <div class="digital-hud-clock" id="digitalHudClock" title="ពេលវេលាប្រព័ន្ធបច្ចុប្បន្ន (Live Realtime Clock)">
            <div class="hud-time-val">
              <i class="fa-regular fa-clock"></i>
              <span id="hudLiveTime">--:--:--</span>
              <span class="hud-pulse-dot" title="ប្រព័ន្ធឌីជីថលកំពុងដំណើរការ"></span>
            </div>
            <div class="hud-date-val" id="hudLiveDate">
              --/--/----
            </div>
          </div>

          <!-- Theme Mode Switcher -->
          <button type="button" id="themeToggleBtn" class="theme-btn" title="ប្តូរ Dark / Light Mode" aria-label="ប្តូរពណ៌ Theme">
            <i id="themeIcon" class="fa-solid fa-moon"></i>
          </button>

          ${!isStudent ? `
            <!-- Fast Add Student Button (Teachers Only) -->
            <button type="button" class="btn-primary" data-action="quick-register">
              <i class="fa-solid fa-plus"></i>
              <span>ចុះឈ្មោះសិស្សថ្មី</span>
            </button>
          ` : ''}

          <!-- User Profile & Logout Component -->
          ${(() => {
            const user = currentUser || {
              nameKh: isStudent ? "សិស្ស" : "លោកគ្រូ ខៀន ធូ",
              role: isStudent ? "សិស្សានុសិស្ស" : "គ្រូបង្រៀន & អ្នកគ្រប់គ្រងប្រព័ន្ធ (Admin)",
              avatar: "assets/images/default-male.svg"
            };
            const roleBadge = isStudent ? `🎓 សិស្ស (${user.id || 'TX'})` : (user.role || 'គ្រូបង្រៀន');
            const borderColor = isStudent ? '#10b981' : '#8b5cf6';

            return `
              <div class="header-teacher-profile">
                <div class="teacher-avatar-wrap">
                  <img src="${user.avatar || 'assets/images/default-male.svg'}" alt="${user.nameKh}" class="avatar-sm" style="border: 2px solid ${borderColor};" onerror="this.src='assets/images/default-male.svg'">
                  <span class="online-indicator-dot" title="កំពុង Online"></span>
                </div>
                <div class="teacher-meta-info">
                  <div class="teacher-name-kh font-bold">${user.nameKh}</div>
                  <div class="teacher-role-tag">${roleBadge}</div>
                </div>
                <button type="button" id="headerLogoutBtn" class="btn-logout" title="ចាកចេញពីប្រព័ន្ធ (Sign Out)">
                  <i class="fa-solid fa-right-from-bracket"></i>
                  <span>ចាកចេញ</span>
                </button>
              </div>
            `;
          })()}
        </div>
      </header>
    `;
  },

  initEvents() {
    // Mobile menu toggle
    const mobileToggle = document.getElementById("mobileToggle");
    const sidebar = document.getElementById("sidebar");
    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
      });
    }

    // Quick Add Button (Open Popup Modal)
    document.querySelectorAll("[data-action='quick-register']").forEach(btn => {
      btn.addEventListener("click", () => App.openAddStudentModal());
    });

    // Theme Toggle
    const themeToggle = document.getElementById("themeToggleBtn");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        App.toggleTheme();
      });
    }

    // Live Sync Button in Header
    const headerSyncBtn = document.getElementById("headerSyncBtn");
    if (headerSyncBtn) {
      headerSyncBtn.addEventListener("click", async () => {
        const icon = headerSyncBtn.querySelector("i");
        if (icon) icon.classList.add("fa-spin");
        headerSyncBtn.disabled = true;
        await App.loadData(true);
        if (icon) icon.classList.remove("fa-spin");
        headerSyncBtn.disabled = false;
        App.showToast("បានទាញយកទិន្នន័យពី Firebase ជោគជ័យ!", "success");
      });
    }

    // Teacher Logout Button in Header
    const headerLogoutBtn = document.getElementById("headerLogoutBtn");
    if (headerLogoutBtn) {
      headerLogoutBtn.addEventListener("click", () => {
        App.handleLogout();
      });
    }

    // Initialize Realtime Digital Clock HUD
    this.startDigitalClock();
  },

  startDigitalClock() {
    const updateTime = () => {
      const timeEl = document.getElementById("hudLiveTime");
      const dateEl = document.getElementById("hudLiveDate");
      if (!timeEl) return;

      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      timeEl.textContent = `${hours}:${minutes}:${seconds}`;

      if (dateEl) {
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        dateEl.textContent = `${day}/${month}/${year}`;
      }
    };

    updateTime();
    if (this._clockTimer) clearInterval(this._clockTimer);
    this._clockTimer = setInterval(updateTime, 1000);
  },

  updateCloudBadge(isConnected) {
    const badge = document.getElementById("cloudStatusBadge");
    if (!badge) return;

    if (isConnected) {
      badge.className = "cloud-status-badge status-connected";
      badge.innerHTML = `<i class="fa-solid fa-fire text-amber-500"></i> <span>Firebase (Live)</span>`;
    } else {
      badge.className = "cloud-status-badge status-local";
      badge.innerHTML = `<i class="fa-solid fa-cloud"></i> <span>Local (Demo)</span>`;
    }
  }
};
