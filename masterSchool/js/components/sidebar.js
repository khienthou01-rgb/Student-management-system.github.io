/**
 * Component: Sidebar Navigation
 */
const SidebarComponent = {
  render() {
    return `
      <aside id="sidebar" class="sidebar">
        <div class="sidebar-header">
          <div class="brand-logo">
            <i class="fa-solid fa-graduation-cap"></i>
          </div>
          <div class="brand-info">
            <h1>MasterSchool</h1>
            <p>ប្រព័ន្ធគ្រប់គ្រងសិស្ស</p>
          </div>
        </div>

        <nav class="sidebar-menu">
          <div class="menu-category">ម៉ឺនុយមេ (Main Menu)</div>
          
          <button type="button" class="nav-link active" data-tab="dashboard" id="nav-dashboard">
            <i class="fa-solid fa-chart-pie"></i>
            <span>ផ្ទាំងគ្រប់គ្រង (Dashboard)</span>
          </button>

          <button type="button" class="nav-link" data-tab="register" id="nav-register">
            <i class="fa-solid fa-user-plus"></i>
            <span>ចុះឈ្មោះសិស្ស (Enrollment)</span>
          </button>

          <button type="button" class="nav-link" data-tab="directory" id="nav-directory">
            <i class="fa-solid fa-users"></i>
            <span>បញ្ជីសិស្ស (Student List)</span>
          </button>

          <button type="button" class="nav-link" data-tab="dropped" id="nav-dropped">
            <i class="fa-solid fa-user-xmark" style="color: #ef4444;"></i>
            <span>សិស្សបោះបង់ (Dropouts)</span>
            <span id="sidebarDroppedCount" class="badge" style="margin-left: auto; background: rgba(239, 68, 68, 0.2); color: #ef4444; font-size: 0.72rem; padding: 2px 7px; border-radius: 12px; font-weight: 700;">0</span>
          </button>

          <button type="button" class="nav-link" data-tab="graduated" id="nav-graduated">
            <i class="fa-solid fa-user-graduate" style="color: #10b981;"></i>
            <span>សិស្សបញ្ចប់ (Graduated)</span>
            <span id="sidebarGraduatedCount" class="badge" style="margin-left: auto; background: rgba(16, 185, 129, 0.2); color: #10b981; font-size: 0.72rem; padding: 2px 7px; border-radius: 12px; font-weight: 700;">0</span>
          </button>

          <button type="button" class="nav-link" data-tab="attendance" id="nav-attendance">
            <i class="fa-solid fa-calendar-check"></i>
            <span>កត់ត្រាវត្តមាន (Attendance)</span>
          </button>

          <button type="button" class="nav-link" data-tab="timetable" id="nav-timetable">
            <i class="fa-solid fa-calendar-days" style="color: #06b6d4;"></i>
            <span>កាលវិភាគ & PC Lab</span>
          </button>

          <button type="button" class="nav-link" data-tab="exams" id="nav-exams">
            <i class="fa-solid fa-award" style="color: #8b5cf6;"></i>
            <span>ប្រលងកុំព្យូទ័រ (Computer Exams)</span>
          </button>

          <button type="button" class="nav-link" data-tab="fees" id="nav-fees">
            <i class="fa-solid fa-file-invoice-dollar" style="color: #10b981;"></i>
            <span>ថ្លៃសិក្សា & វិក្កយបត្រ (Fees)</span>
          </button>

          <button type="button" class="nav-link" data-tab="certificates" id="nav-certificates">
            <i class="fa-solid fa-certificate" style="color: #f59e0b;"></i>
            <span>វិញ្ញាបនបត្រ (Certificates)</span>
          </button>

          <button type="button" class="nav-link" data-tab="resources" id="nav-resources">
            <i class="fa-solid fa-book-bookmark" style="color: #8b5cf6;"></i>
            <span>ឃ្លាំងមេរៀន (Resources)</span>
          </button>

          <div class="menu-category">ការកំណត់ (Settings)</div>

          <button type="button" class="nav-link" data-tab="settings" id="nav-settings">
            <i class="fa-solid fa-gear" style="color: #06b6d4;"></i>
            <span>ការកំណត់ (Settings)</span>
          </button>
        </nav>

        <div class="sidebar-footer">
          <!-- Active Teacher Account Card -->
          ${(() => {
            const user = (typeof AuthService !== "undefined" && AuthService.getCurrentUser()) || {
              nameKh: "លោកគ្រូ ចាន់ វិសាល",
              role: "Admin",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
            };
            return `
              <div class="sidebar-teacher-card">
                <div style="display: flex; align-items: center; gap: 10px; overflow: hidden;">
                  <div class="teacher-avatar-wrap">
                    <img src="${user.avatar || 'assets/images/default-male.svg'}" alt="${user.nameKh}" class="avatar-sm" style="border: 2px solid #10b981;" onerror="this.src='assets/images/default-male.svg'">
                    <span class="online-indicator-dot" style="background: #10b981;"></span>
                  </div>
                  <div style="overflow: hidden;">
                    <div style="font-size: 0.82rem; font-weight: 700; color: #ffffff; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${user.nameKh}</div>
                    <div style="font-size: 0.7rem; color: #10b981; font-weight: 600;"><i class="fa-solid fa-circle-check"></i> កំពុងគ្រប់គ្រង</div>
                  </div>
                </div>
                <button type="button" id="sidebarLogoutBtn" class="btn-sidebar-logout" title="ចាកចេញ (Logout)">
                  <i class="fa-solid fa-right-from-bracket"></i>
                </button>
              </div>
            `;
          })()}

          <div class="system-status-widget">
            <div>
              <div style="color: #ffffff; font-weight: 600; font-size: 0.78rem;">កំណែប្រព័ន្ធ v2.0</div>
              <div style="font-size: 0.7rem; color: #10b981;"><i class="fa-solid fa-circle-check"></i> ប្រព័ន្ធដំណើរការរលូន</div>
            </div>
            <i class="fa-solid fa-shield-halved" style="font-size: 1.1rem; color: #10b981;"></i>
          </div>
        </div>
      </aside>
    `;
  },

  initEvents() {
    const navLinks = document.querySelectorAll(".nav-link[data-tab]");
    navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const tab = link.getAttribute("data-tab");
        if (tab === "register") {
          App.switchTab("directory");
          App.openAddStudentModal();
        } else {
          App.switchTab(tab);
        }
        
        // Close mobile sidebar if open
        const sidebar = document.getElementById("sidebar");
        if (sidebar && sidebar.classList.contains("open")) {
          sidebar.classList.remove("open");
        }
      });
    });

    // Sidebar Logout button
    const sidebarLogoutBtn = document.getElementById("sidebarLogoutBtn");
    if (sidebarLogoutBtn) {
      sidebarLogoutBtn.addEventListener("click", () => {
        App.handleLogout();
      });
    }
  }
};
