/**
 * View: Student Portal (ប្រព័ន្ធគណនីសិស្ស & ការប្រឡងកុំព្យូទ័រផ្ទាល់ខ្លួន)
 */
const StudentPortalView = {
  getStudent() {
    const user = typeof AuthService !== "undefined" ? AuthService.getCurrentUser() : null;
    if (user && user.role === "student") {
      // Re-fetch fresh student data if available
      const allStudents = typeof StudentAPI !== "undefined" ? StudentAPI.getLocalStudents() : [];
      const fresh = allStudents.find(s => s.ID === user.id);
      return fresh || user.studentData || user;
    }
    return null;
  },

  getStudentExams(studentId) {
    if (typeof StudentAPI !== "undefined" && studentId) {
      return StudentAPI.getStudentExams(studentId);
    }
    return {};
  },

  getStudentAttendance(studentId) {
    if (typeof StudentAPI !== "undefined" && studentId) {
      return StudentAPI.getStudentAttendanceSummary(studentId);
    }
    return { totalDays: 0, present: 0, permission: 0, absent: 0, rate: 100 };
  },

  normalizeCourse(courseStr = "") {
    const str = courseStr.toLowerCase();
    if (str.includes("typing") || str.includes("វាយ")) return "Typing";
    if (str.includes("word")) return "Word";
    if (str.includes("excel")) return "Excel";
    if (str.includes("powerpoint") || str.includes("ppt")) return "PowerPoint";
    return "Typing";
  },

  render() {
    const student = this.getStudent();
    if (!student) {
      return `
        <div class="student-portal-wrapper">
          <div class="alert alert-danger" style="text-align: center; margin: 40px auto; max-width: 500px; padding: 30px; border-radius: 16px;">
            <i class="fa-solid fa-triangle-exclamation fa-3x mb-3" style="color: #ef4444;"></i>
            <h3>រកមិនឃើញទិន្នន័យគណនីសិស្សឡើយ</h3>
            <p>សូមចូលប្រព័ន្ធម្តងទៀតតាមរយៈទម្រង់ចូលរបស់សិស្ស។</p>
            <button class="btn-primary mt-3" onclick="App.mountLoginScreen()">ត្រឡប់ទៅផ្ទាំង Login</button>
          </div>
        </div>
      `;
    }

    const exams = this.getStudentExams(student.ID);
    const att = this.getStudentAttendance(student.ID);
    const activeCourseKey = this.normalizeCourse(student.Course);
    const fee = typeof StudentAPI !== "undefined" ? StudentAPI.getStudentFee(student.ID) : null;
    const cert = typeof StudentAPI !== "undefined" ? StudentAPI.getStudentCertificate(student.ID) : null;

    // Calculate Completed Modules
    const courseKeys = ["Typing", "Word", "Excel", "PowerPoint"];
    const passedCount = courseKeys.filter(k => exams[k] && exams[k].status === "Pass").length;
    const progressPercent = Math.round((passedCount / 4) * 100);

    // Course Meta Information
    const courseMeta = {
      Typing: { title: "វគ្គទី ១: Typing", fullName: "ជំនាញវាយអត្ថបទកុំព្យូទ័រខ្មែរ-អង់គ្លេស", icon: "fa-keyboard", color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.1)" },
      Word: { title: "វគ្គទី ២: Microsoft Word", fullName: "រដ្ឋបាលឯកសារ & របាយការណ៍", icon: "fa-file-word", color: "#2563eb", bg: "rgba(37, 99, 235, 0.1)" },
      Excel: { title: "វគ្គទី ៣: Microsoft Excel", fullName: "គណនាតារាង & រូបមន្តកម្រិតខ្ពស់", icon: "fa-file-excel", color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" },
      PowerPoint: { title: "វគ្គទី ៤: Microsoft PowerPoint", fullName: "រចនាស្លាយបទបង្ហាញអាជីព", icon: "fa-file-powerpoint", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" }
    };

    const currentCourseInfo = courseMeta[activeCourseKey] || courseMeta.Typing;
    const activeExam = exams[activeCourseKey] || {};

    return `
      <div class="student-portal-wrapper animate-fadeIn">
        <!-- 1. TOP WELCOME HERO BANNER -->
        <div class="portal-hero-banner">
          <div class="portal-hero-ambient"></div>
          
          <div class="portal-hero-content">
            <div class="portal-avatar-wrap">
              <img src="${student.Avatar || (student.Gender === 'ស្រី' ? 'assets/images/default-female.svg' : 'assets/images/default-male.svg')}" 
                   alt="${student.NameKh}" 
                   class="portal-avatar" 
                   onerror="this.src='assets/images/default-male.svg'">
              <span class="portal-status-badge ${student.Status === 'Graduated' ? 'badge-graduated' : 'badge-active'}">
                ${student.Status === 'Graduated' ? '🎓 បញ្ចប់ការសិក្សា' : '🟢 កំពុងសិក្សា'}
              </span>
            </div>

            <div class="portal-student-identity">
              <div class="portal-badge-row">
                <span class="portal-id-badge"><i class="fa-solid fa-id-card"></i> ${student.ID}</span>
                <span class="portal-shift-badge"><i class="fa-solid fa-clock"></i> វេន${student.Shift || 'ព្រឹក'}</span>
                <span class="portal-grade-badge"><i class="fa-solid fa-graduation-cap"></i> ${student.Grade || 'ថ្នាក់កុំព្យូទ័រ'}</span>
              </div>
              <h1 class="portal-name-kh">${student.NameKh}</h1>
              <div class="portal-name-en">${student.NameEn || ''}</div>
              <p class="portal-welcome-quote">
                <i class="fa-solid fa-quote-left text-purple-400"></i>
                ស្វាគមន៍មកកាន់ប្រព័ន្ធគ្រប់គ្រងការសិក្សា និងការប្រឡងផ្ទាល់ខ្លួន។ អ្នកអាចចូលប្រឡង តាមដានពិន្ទុ និងបោះពុម្ពកាតសិស្សបាននៅទីនេះ។
              </p>
            </div>

            <!-- Header Quick Action Buttons -->
            <div class="portal-hero-actions">
              <button type="button" class="btn-portal-action btn-print-id" id="portalPrintIdCardBtn" title="បោះពុម្ពកាតសិស្សឌីជីថល">
                <i class="fa-solid fa-address-card"></i>
                <span>បោះពុម្ពកាតសិស្ស</span>
              </button>
              <button type="button" class="btn-portal-action btn-print-transcript" id="portalPrintTranscriptBtn" title="បោះពុម្ពព្រឹត្តិបត្រពិន្ទុផ្លូវការ">
                <i class="fa-solid fa-file-invoice"></i>
                <span>ព្រឹត្តិបត្រពិន្ទុ</span>
              </button>
            </div>
          </div>

          <!-- Progress Bar Strip -->
          <div class="portal-ladder-strip">
            <div class="ladder-strip-header">
              <span><i class="fa-solid fa-chart-line"></i> វឌ្ឍនភាពនៃការប្រឡង ៤ វគ្គ៖ <strong>${passedCount}/4 វគ្គ (${progressPercent}%)</strong></span>
              <span>វគ្គបច្ចុប្បន្ន៖ <strong style="color: ${currentCourseInfo.color}">${currentCourseInfo.title}</strong></span>
            </div>
            <div class="portal-progress-bar-bg">
              <div class="portal-progress-bar-fill" style="width: ${progressPercent}%;"></div>
            </div>
          </div>
        </div>

        <!-- 2. CURRENT COURSE EXAM ACTION HUB (HERO ACTION) -->
        <div class="portal-section-header">
          <div class="section-title-wrap">
            <div class="section-icon-bubble" style="background: ${currentCourseInfo.bg}; color: ${currentCourseInfo.color};">
              <i class="fa-solid ${currentCourseInfo.icon}"></i>
            </div>
            <div>
              <h2 class="section-title">មជ្ឈមណ្ឌលប្រឡងវគ្គបច្ចុប្បន្ន (Current Course Exam Hub)</h2>
              <p class="section-desc">មុខវិជ្ជាកំពុងសិក្សា និងលទ្ធភាពចូលប្រឡងបញ្ចប់វគ្គជាក់ស្តែង</p>
            </div>
          </div>
          <span class="badge badge-course-status ${activeExam.status === 'Pass' ? 'badge-pass' : 'badge-in-progress'}">
            ${activeExam.status === 'Pass' ? '✓ បានប្រឡងជាប់រួចរាល់' : '⏳ ដល់ពេលប្រឡងបញ្ចប់វគ្គ'}
          </span>
        </div>

        <div class="portal-exam-hero-card" style="border-left: 5px solid ${currentCourseInfo.color};">
          <div class="exam-hero-left">
            <div class="exam-hero-course-tag" style="background: ${currentCourseInfo.bg}; color: ${currentCourseInfo.color};">
              <i class="fa-solid ${currentCourseInfo.icon}"></i> ${currentCourseInfo.title}
            </div>
            <h3 class="exam-hero-course-name">${currentCourseInfo.fullName}</h3>
            <p class="exam-hero-desc">
              ${activeCourseKey === 'Typing' 
                ? 'ការប្រឡងវាស់ស្ទង់ល្បឿន និងភាពត្រឹមត្រូវនៃការវាយអត្ថបទខ្មែរ-អង់គ្លេស ផ្ទាល់លើកម្មវិធី (Live Typing Test) ជាមួយប្រព័ន្ធគណនាពិន្ទុស្វ័យប្រវត្តិ។' 
                : 'វិញ្ញាសាអនុវត្តជាក់ស្តែងតាមស្តង់ដាររដ្ឋបាល។ សិស្សត្រូវអនុវត្តកិច្ចការតាមក្រដាសវិញ្ញាសា និងបញ្ជូនការងារជូនគ្រូបង្រៀន។'}
            </p>

            <div class="exam-hero-stats-row">
              <div class="exam-stat-item">
                <span class="stat-label">ស្ថានភាពប្រឡង</span>
                <span class="stat-value ${activeExam.status === 'Pass' ? 'text-emerald-500' : 'text-amber-500'}">
                  ${activeExam.status === 'Pass' ? '✓ បានជាប់ (Pass)' : (activeExam.status === 'Fail' ? '✗ ធ្លាក់ (ត្រូវប្រឡងសង)' : 'មិនទាន់ប្រឡង')}
                </span>
              </div>
              <div class="exam-stat-item">
                <span class="stat-label">ពិន្ទុទទួលបាន</span>
                <span class="stat-value font-bold ${activeExam.score >= 50 ? 'text-purple-600' : ''}">
                  ${activeExam.score !== undefined && activeExam.score !== null ? `${activeExam.score}/100` : '—'}
                </span>
              </div>
              <div class="exam-stat-item">
                <span class="stat-label">និទ្ទេស (Grade)</span>
                <span class="stat-value font-bold">
                  ${activeExam.grade ? `<span class="badge-grade grade-${activeExam.grade}">${activeExam.grade}</span>` : '—'}
                </span>
              </div>
              <div class="exam-stat-item">
                <span class="stat-label">កាលបរិច្ឆេទប្រឡង</span>
                <span class="stat-value">${activeExam.date || '—'}</span>
              </div>
            </div>
          </div>

          <!-- Hero Action Buttons -->
          <div class="exam-hero-right">
            <button type="button" class="btn-hero-exam-start" onclick="StudentPortalView.launchCourseExam('${activeCourseKey}', '${student.ID}')">
              <div class="btn-icon-circle"><i class="fa-solid fa-play"></i></div>
              <div class="btn-text-content">
                <span class="btn-label-sup">ចាប់ផ្តើមឥឡូវនេះ</span>
                <span class="btn-label-main">🚀 ចូលប្រឡងផ្ទាល់ ${currentCourseInfo.title}</span>
              </div>
            </button>
            <button type="button" class="btn-hero-exam-secondary" onclick="ExamsView.openExamPapersModal('${activeCourseKey}')">
              <i class="fa-solid fa-file-lines"></i>
              <span>📑 មើលវិញ្ញាសា ${activeCourseKey}</span>
            </button>
            <button type="button" class="btn-hero-exam-secondary" onclick="ExamsView.printOfficialExamPaper(null, '${activeCourseKey}')">
              <i class="fa-solid fa-print"></i>
              <span>🖨️ បោះពុម្ពក្រដាសវិញ្ញាសា A4</span>
            </button>
          </div>
        </div>

        <!-- 3. FOUR-STEP COMPUTER EXAMS PROGRESS LADDER -->
        <div class="portal-section-header mt-5">
          <div class="section-title-wrap">
            <div class="section-icon-bubble" style="background: rgba(139, 92, 246, 0.1); color: #8b5cf6;">
              <i class="fa-solid fa-stairs"></i>
            </div>
            <div>
              <h2 class="section-title">ដំណើរការប្រឡង ៤ វគ្គ (4-Step Computer Exam Ladder)</h2>
              <p class="section-desc">តារាងតាមដានលទ្ធផលប្រឡងពីវគ្គទី ១ ដល់វគ្គទី ៤ និងការចេញវិញ្ញាបនបត្រ</p>
            </div>
          </div>
        </div>

        <div class="portal-ladder-grid">
          ${courseKeys.map((cKey, idx) => {
            const meta = courseMeta[cKey];
            const ex = exams[cKey] || {};
            const isPassed = ex.status === "Pass";
            const isCurrent = activeCourseKey === cKey;

            return `
              <div class="portal-ladder-card ${isPassed ? 'card-passed' : (isCurrent ? 'card-current' : 'card-pending')}">
                <div class="ladder-card-top">
                  <span class="ladder-step-num">វគ្គទី ${idx + 1}</span>
                  <span class="ladder-status-badge ${isPassed ? 'badge-pass' : (isCurrent ? 'badge-in-progress' : 'badge-pending')}">
                    ${isPassed ? '✓ ជាប់ (Pass)' : (isCurrent ? '● កំពុងរៀន' : '○ រង់ចាំ')}
                  </span>
                </div>

                <div class="ladder-card-icon" style="background: ${meta.bg}; color: ${meta.color};">
                  <i class="fa-solid ${meta.icon}"></i>
                </div>

                <h4 class="ladder-card-title">${meta.title}</h4>
                <p class="ladder-card-subtitle">${meta.fullName}</p>

                <div class="ladder-card-score-box">
                  <div class="ladder-score-val">
                    ${ex.score !== undefined && ex.score !== null ? `${ex.score}` : '—'}
                    <span class="ladder-score-unit">/100</span>
                  </div>
                  <div class="ladder-grade-val">
                    ${ex.grade ? `និទ្ទេស <strong class="badge-grade grade-${ex.grade}">${ex.grade}</strong>` : '<span class="text-muted">មិនទាន់ប្រឡង</span>'}
                  </div>
                </div>

                <div class="ladder-card-footer">
                  <button type="button" class="btn-ladder-action" onclick="StudentPortalView.launchCourseExam('${cKey}', '${student.ID}')">
                    <i class="fa-solid ${meta.icon}"></i>
                    <span>${isPassed ? 'ប្រឡងឡើងវិញ' : `ចូលប្រឡង ${meta.title}`}</span>
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>

        <!-- 4. PROFILE DETAILS & ATTENDANCE STATS SECTION -->
        <div class="portal-bottom-grid mt-5">
          <!-- Left: Digital ID Card Preview -->
          <div class="portal-card-box id-preview-box">
            <div class="box-header">
              <h3><i class="fa-solid fa-address-card text-purple-500"></i> កាតសិស្សឌីជីថល (Digital Student ID)</h3>
              <button type="button" class="btn-secondary btn-sm" onclick="App.printStudentIdCard('${student.ID}')">
                <i class="fa-solid fa-print"></i> បោះពុម្ពកាត
              </button>
            </div>

            <div class="student-id-card-render-wrap">
              <div class="id-card-preview-mini">
                <div class="id-mini-top">
                  <div class="id-mini-school">MASTERSCHOOL</div>
                  <div class="id-mini-badge">STUDENT CARD</div>
                </div>
                <div class="id-mini-body">
                  <img src="${student.Avatar || (student.Gender === 'ស្រី' ? 'assets/images/default-female.svg' : 'assets/images/default-male.svg')}" 
                       alt="${student.NameKh}" class="id-mini-avatar" onerror="this.src='assets/images/default-male.svg'">
                  <div class="id-mini-info">
                    <div class="id-mini-name">${student.NameKh}</div>
                    <div class="id-mini-name-en">${student.NameEn || ''}</div>
                    <div class="id-mini-code">ID: <strong>${student.ID}</strong></div>
                    <div class="id-mini-detail">ថ្នាក់: ${student.Grade || 'ថ្នាក់កុំព្យូទ័រ'}</div>
                    <div class="id-mini-detail">វេន: ${student.Shift || 'ព្រឹក'}</div>
                  </div>
                </div>
                <div class="id-mini-barcode">
                  <i class="fa-solid fa-barcode fa-2x text-gray-700"></i>
                  <span>${student.ID}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Personal Information & Attendance KPIs -->
          <div class="portal-card-box profile-info-box">
            <div class="box-header">
              <h3><i class="fa-solid fa-user-check text-emerald-500"></i> ព័ត៌មានលម្អិត & វត្តមានសរុប</h3>
              <span class="badge badge-sub"><i class="fa-solid fa-calendar-check"></i> វត្តមាន ${att.rate}%</span>
            </div>

            <!-- Attendance Stats 4 Mini Cards -->
            <div class="portal-att-mini-grid">
              <div class="att-mini-card">
                <span class="att-mini-num text-purple-600">${att.totalDays}</span>
                <span class="att-mini-lbl">ថ្ងៃសិក្សាសរុប</span>
              </div>
              <div class="att-mini-card">
                <span class="att-mini-num text-emerald-600">${att.present}</span>
                <span class="att-mini-lbl">វត្តមាន (Present)</span>
              </div>
              <div class="att-mini-card">
                <span class="att-mini-num text-amber-500">${att.permission}</span>
                <span class="att-mini-lbl">ច្បាប់ (Permit)</span>
              </div>
              <div class="att-mini-card">
                <span class="att-mini-num text-rose-500">${att.absent}</span>
                <span class="att-mini-lbl">អវត្តមាន (Absent)</span>
              </div>
            </div>

            <!-- Profile Fields Table -->
            <table class="portal-profile-table mt-3">
              <tbody>
                <tr>
                  <td class="field-lbl"><i class="fa-solid fa-venus-mars"></i> ភេទ</td>
                  <td class="field-val font-semibold">${student.Gender || '—'}</td>
                  <td class="field-lbl"><i class="fa-solid fa-cake-candles"></i> ថ្ងៃខែកំណើត</td>
                  <td class="field-val">${student.Dob || '—'}</td>
                </tr>
                <tr>
                  <td class="field-lbl"><i class="fa-solid fa-phone"></i> ទូរស័ព្ទផ្ទាល់ខ្លួន</td>
                  <td class="field-val font-semibold">${student.Phone || '—'}</td>
                  <td class="field-lbl"><i class="fa-solid fa-phone-volume"></i> ទូរស័ព្ទអាណាព្យាបាល</td>
                  <td class="field-val">${student.GuardianPhone || '—'}</td>
                </tr>
                <tr>
                  <td class="field-lbl"><i class="fa-solid fa-calendar-day"></i> ថ្ងៃចាប់ផ្តើម</td>
                  <td class="field-val">${student.StartDate || '—'}</td>
                  <td class="field-lbl"><i class="fa-solid fa-flag-checkered"></i> ថ្ងៃបញ្ចប់រំពឹងទុក</td>
                  <td class="field-val">${student.EndDate || '—'}</td>
                </tr>
                <tr>
                  <td class="field-lbl"><i class="fa-solid fa-location-dot"></i> អាសយដ្ឋាន</td>
                  <td class="field-val" colspan="3">${student.Address || 'រាជធានីភ្នំពេញ'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 5. PRACTICAL ASSIGNMENTS & LEAVE REQUESTS SECTION -->
        <div class="portal-section-header mt-5">
          <div class="section-title-wrap">
            <div class="section-icon-bubble" style="background: rgba(99, 102, 241, 0.12); color: #6366f1;">
              <i class="fa-solid fa-laptop-file"></i>
            </div>
            <div>
              <h2 class="section-title">កិច្ចការអនុវត្តជាក់ស្តែង & ស្នើសុំច្បាប់ (Assignments & Leave Requests)</h2>
              <p class="section-desc">ប្រគល់កិច្ចការផ្ទះ តាមដានការដាក់ពិន្ទុពីលោកគ្រូ និងស្នើសុំច្បាប់អវត្តមានតាម Online</p>
            </div>
          </div>
        </div>

        <div class="portal-bottom-grid">
          <!-- Left: Practical Assignments Hub -->
          <div class="portal-card-box">
            <div class="box-header">
              <h3><i class="fa-solid fa-list-check text-indigo-500"></i> កិច្ចការអនុវត្តជាក់ស្តែង (Assignments)</h3>
              <span class="badge badge-sub">វគ្គ៖ ${currentCourseInfo.title}</span>
            </div>

            <div id="portalAssignmentsListMount" style="padding-top: 10px;">
              ${this.renderAssignmentsList(student, activeCourseKey)}
            </div>
          </div>

          <!-- Right: Online Leave Request Form & History -->
          <div class="portal-card-box">
            <div class="box-header">
              <h3><i class="fa-solid fa-envelope-open-text text-amber-500"></i> ស្នើសុំច្បាប់អវត្តមាន (Leave Request)</h3>
              <span class="badge" style="background: rgba(245, 158, 11, 0.12); color: #d97706; font-size: 0.76rem; font-weight: 700;">
                <i class="fa-solid fa-shield-halved"></i> ជូនដំណឹងគ្រូផ្ទាល់
              </span>
            </div>

            <!-- Submit Leave Form -->
            <form id="portalLeaveRequestForm" style="margin-top: 10px; background: var(--border-light); padding: 14px; border-radius: 10px; border: 1px solid var(--border-color);">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                <div class="form-group" style="margin-bottom: 0;">
                  <label style="font-size: 0.8rem; font-weight: 700; display: block; margin-bottom: 4px;">សុំឈប់ពីថ្ងៃ៖ <span style="color: #ef4444;">*</span></label>
                  <input type="date" id="portalLeaveStartDate" class="form-control" style="font-size: 0.84rem; height: 36px;" required value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                  <label style="font-size: 0.8rem; font-weight: 700; display: block; margin-bottom: 4px;">ដល់ថ្ងៃ៖ <span style="color: #ef4444;">*</span></label>
                  <input type="date" id="portalLeaveEndDate" class="form-control" style="font-size: 0.84rem; height: 36px;" required value="${new Date().toISOString().split('T')[0]}">
                </div>
              </div>

              <div class="form-group" style="margin-bottom: 10px;">
                <label style="font-size: 0.8rem; font-weight: 700; display: block; margin-bottom: 4px;">មូលហេតុនៃការសុំច្បាប់៖ <span style="color: #ef4444;">*</span></label>
                <select id="portalLeaveReasonSelect" class="form-control" style="font-size: 0.84rem; height: 36px; margin-bottom: 6px;">
                  <option value="ឈឺ / មិនស្រួលខ្លួន">ឈឺ / មិនស្រួលខ្លួន (Sick Leave)</option>
                  <option value="មានធុរៈគ្រួសារចាំបាច់">មានធុរៈគ្រួសារចាំបាច់ (Family Urgent Matter)</option>
                  <option value="ជាប់ប្រឡងនៅសាលាចំណេះទូទៅ">ជាប់ប្រឡងនៅសាលាចំណេះទូទៅ (Exam at High School/Uni)</option>
                  <option value="ផ្សេងៗ">ផ្សេងៗ (Other Reason)</option>
                </select>
                <input type="text" id="portalLeaveReasonOther" class="form-control" placeholder="បញ្ជាក់លម្អិតបន្ថែម (បើមាន)..." style="font-size: 0.82rem; height: 34px;">
              </div>

              <div class="form-group" style="margin-bottom: 12px;">
                <label style="font-size: 0.8rem; font-weight: 700; display: block; margin-bottom: 4px;">លេខទូរស័ព្ទសម្រាប់ទំនាក់ទំនង៖</label>
                <input type="tel" id="portalLeavePhone" class="form-control" value="${student.Phone || student.GuardianPhone || ''}" placeholder="012 345 678" style="font-size: 0.84rem; height: 36px;">
              </div>

              <button type="submit" class="btn-primary" style="width: 100%; height: 38px; font-size: 0.86rem; background: linear-gradient(135deg, #f59e0b, #d97706); border: none; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);">
                <i class="fa-solid fa-paper-plane"></i> <span>ផ្ញើសំណើសុំច្បាប់ទៅលោកគ្រូ</span>
              </button>
            </form>

            <!-- Student's Leave History -->
            <div style="margin-top: 14px;">
              <h4 style="font-size: 0.88rem; margin: 0 0 8px 0; color: var(--text-main); font-weight: 700;">
                <i class="fa-solid fa-clock-rotate-left"></i> ប្រវត្តិនៃការសុំច្បាប់កន្លងមក៖
              </h4>
              <div id="portalLeaveHistoryMount">
                ${this.renderStudentLeaveHistory(student.ID)}
              </div>
            </div>
          </div>
        </div>

        <!-- 6. TUITION INVOICE & DIGITAL CERTIFICATE HUB -->
        <div class="portal-section-header mt-5">
          <div class="section-title-wrap">
            <div class="section-icon-bubble" style="background: rgba(16, 185, 129, 0.1); color: #10b981;">
              <i class="fa-solid fa-receipt"></i>
            </div>
            <div>
              <h2 class="section-title">វិក្កយបត្រ & វិញ្ញាបនបត្រឌីជីថល (Invoices & Certificates)</h2>
              <p class="section-desc">តាមដានស្ថានភាពថ្លៃសិក្សា វិក្កយបត្រផ្លូវការ និងវិញ្ញាបនបត្របញ្ចប់ការសិក្សា</p>
            </div>
          </div>
        </div>

        <div class="portal-bottom-grid">
          <!-- Left: Tuition Fee & Official Invoice -->
          <div class="portal-card-box">
            <div class="box-header">
              <h3><i class="fa-solid fa-file-invoice-dollar text-emerald-500"></i> វិក្កយបត្រថ្លៃសិក្សា (Tuition Invoice)</h3>
              <span class="badge ${fee && fee.status === 'Paid' ? 'badge-pass' : 'badge-in-progress'}">
                ${fee && fee.status === 'Paid' ? '✓ បានបង់រួច' : (fee && fee.status === 'Partial' ? '⏳ បង់ខ្លះ' : '○ ជំពាក់')}
              </span>
            </div>

            <div style="padding: 16px; background: var(--border-light); border-radius: 8px; margin-top: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="color: var(--text-muted); font-size: 0.85rem;">លេខវិក្កយបត្រ៖</span>
                <strong class="font-mono text-main">${fee?.receiptNo || ('INV-2026-' + student.ID.replace(/\D/g,''))}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="color: var(--text-muted); font-size: 0.85rem;">ថ្លៃសិក្សាសរុប៖</span>
                <strong class="font-mono text-main">$${fee?.totalAmount || 50}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="color: var(--text-muted); font-size: 0.85rem;">បានបង់រួច៖</span>
                <strong class="font-mono text-emerald-600 font-bold">$${fee?.paidAmount || 50}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="color: var(--text-muted); font-size: 0.85rem;">ប្រាក់នៅខ្វះ (Balance Due)៖</span>
                <strong class="font-mono ${fee && fee.balance > 0 ? 'text-rose-600 font-bold' : 'text-muted'}">$${fee?.balance || 0}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px dashed var(--border-color);">
                <span style="color: var(--text-muted); font-size: 0.8rem;">វិធីបង់៖ ${fee?.paymentMethod || 'ABA KHQR'}</span>
                <span style="color: var(--text-muted); font-size: 0.8rem;">${fee?.date || '2026-08-15'}</span>
              </div>
            </div>

            <div style="margin-top: 14px; text-align: right;">
              <button type="button" class="btn-primary" style="height: 36px; padding: 0 16px; font-size: 0.84rem; background: #10b981; border-color: #10b981;" onclick="FeesView.printOfficialReceipt('${student.ID}')">
                <i class="fa-solid fa-print"></i>
                <span>ទាញយក / បោះពុម្ពវិក្កយបត្រផ្លូវការ</span>
              </button>
            </div>
          </div>

          <!-- Right: Official Certificate Preview & Download -->
          <div class="portal-card-box">
            <div class="box-header">
              <h3><i class="fa-solid fa-graduation-cap text-amber-500"></i> វិញ្ញាបនបត្រឌីជីថល (Digital Certificate)</h3>
              <span class="badge ${cert ? 'badge-pass' : (passedCount === 4 ? 'badge-pass' : 'badge-in-progress')}">
                ${cert ? '🏆 បានចេញរួចរាល់' : (passedCount === 4 ? '✨ គ្រប់លក្ខខណ្ឌ' : '⏳ កំពុងបន្ត ៤ វគ្គ')}
              </span>
            </div>

            <div style="padding: 16px; background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(99, 102, 241, 0.06)); border: 1.5px dashed #f59e0b; border-radius: 8px; margin-top: 10px; text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 4px;">🎓</div>
              <h4 style="margin: 0 0 4px 0; color: #b45309; font-size: 1.05rem; font-weight: 700;">វិញ្ញាបនបត្របញ្ចប់ការសិក្សា</h4>
              <p style="margin: 0 0 10px 0; font-size: 0.8rem; color: var(--text-muted);">
                វគ្គបណ្តុះបណ្តាលកុំព្យូទ័ររដ្ឋបាល & ការិយាល័យ MasterSchool
              </p>
              <div style="font-size: 0.82rem; color: var(--text-main); margin-bottom: 12px;">
                ${cert ? `លេខកូដ៖ <strong class="font-mono">${cert.certId}</strong> • និទ្ទេស <strong>${cert.gpa}</strong>` : (passedCount === 4 ? `អ្នកបានប្រឡងជាប់គ្រប់ ៤ វគ្គ! អាចស្នើសុំ ឬទាញយកវិញ្ញាបនបត្របាន។` : `សិស្សត្រូវប្រឡងជាប់ទាំង ៤ វគ្គ (Typing, Word, Excel, PowerPoint) ដើម្បីទទួលបានវិញ្ញាបនបត្រ។`)}
              </div>

              ${(cert || passedCount === 4) ? `
                <button type="button" class="btn-primary" style="height: 38px; padding: 0 20px; font-size: 0.86rem; background: linear-gradient(135deg, #f59e0b, #d97706); border: none; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35);" onclick="CertificatesView.printOfficialCertificate('${student.ID}')">
                  <i class="fa-solid fa-award"></i>
                  <span>🖨️ បោះពុម្ពវិញ្ញាបនបត្រ A4 Landscape</span>
                </button>
              ` : `
                <button type="button" class="btn-secondary" style="height: 36px; padding: 0 14px; font-size: 0.82rem; opacity: 0.7; cursor: not-allowed;" title="រៀនចប់ ៤ វគ្គដើម្បីដោះសោរ">
                  <i class="fa-solid fa-lock"></i>
                  <span>មិនទាន់គ្រប់លក្ខខណ្ឌ (${passedCount}/4 វគ្គ)</span>
                </button>
              `}
            </div>
          </div>
        </div>

      </div>
    `;
  },

  initEvents() {
    const student = this.getStudent();
    if (!student) return;

    // Start Live Typing Exam Button
    const startTypingBtn = document.getElementById("portalStartTypingExamBtn");
    if (startTypingBtn) {
      startTypingBtn.addEventListener("click", () => {
        this.launchTypingExam(student.ID);
      });
    }

    // Print ID Card Button
    const printIdBtn = document.getElementById("portalPrintIdCardBtn");
    if (printIdBtn) {
      printIdBtn.addEventListener("click", () => {
        if (typeof App !== "undefined" && App.printStudentIdCard) {
          App.printStudentIdCard(student.ID);
        }
      });
    }

    // Print Transcript Button
    const printTranscriptBtn = document.getElementById("portalPrintTranscriptBtn");
    if (printTranscriptBtn) {
      printTranscriptBtn.addEventListener("click", () => {
        if (typeof ExamsView !== "undefined" && ExamsView.printStudentTranscript) {
          ExamsView.printStudentTranscript(student.ID);
        }
      });
    }

    // Leave Request Form Submission
    const leaveForm = document.getElementById("portalLeaveRequestForm");
    if (leaveForm) {
      leaveForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const start = document.getElementById("portalLeaveStartDate")?.value;
        const end = document.getElementById("portalLeaveEndDate")?.value;
        const reasonSelect = document.getElementById("portalLeaveReasonSelect")?.value || "ឈឺ";
        const reasonOther = document.getElementById("portalLeaveReasonOther")?.value.trim() || "";
        const phone = document.getElementById("portalLeavePhone")?.value.trim() || student.Phone || "";

        const finalReason = reasonOther ? `${reasonSelect} (${reasonOther})` : reasonSelect;

        if (!start || !end) {
          App.showToast("សូមជ្រើសរើសកាលបរិច្ឆេទសុំឈប់!", "warning");
          return;
        }

        try {
          await StudentAPI.submitLeaveRequest({
            studentId: student.ID,
            studentNameKh: student.NameKh,
            startDate: start,
            endDate: end,
            reason: finalReason,
            phone: phone
          });

          App.showToast("🎉 បានផ្ញើសំណើសុំច្បាប់ទៅកាន់លោកគ្រូរួចរាល់!", "success");
          App.triggerConfetti();

          // Refresh history view
          const histMount = document.getElementById("portalLeaveHistoryMount");
          if (histMount) {
            histMount.innerHTML = this.renderStudentLeaveHistory(student.ID);
          }
          if (document.getElementById("portalLeaveReasonOther")) {
            document.getElementById("portalLeaveReasonOther").value = "";
          }
        } catch (err) {
          App.showToast("កំហុសក្នុងការផ្ញើច្បាប់: " + err.message, "error");
        }
      });
    }
  },

  renderAssignmentsList(student, activeCourseKey) {
    const all = typeof StudentAPI !== "undefined" ? StudentAPI.getAssignments() : [];
    const subs = typeof StudentAPI !== "undefined" ? StudentAPI.getAssignmentSubmissions() : [];

    // Filter relevant to student's courses
    const relevant = all.filter(a => a.course === activeCourseKey || a.course === "All" || !a.course);
    const displayList = relevant.length > 0 ? relevant : all;

    if (displayList.length === 0) {
      return `<p class="text-muted text-sm text-center py-4">មិនទាន់មានកិច្ចការត្រូវប្រគល់នៅឡើយទេ</p>`;
    }

    return `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${displayList.map(asn => {
          const subId = `SUB-${asn.id}-${student.ID}`;
          const sub = subs.find(s => s.id === subId || (s.assignmentId === asn.id && s.studentId === student.ID));
          const isSubmitted = !!sub;
          const isGraded = sub && sub.grade;

          return `
            <div style="background: var(--bg-surface); border: 1.5px solid ${isSubmitted ? '#10b981' : 'var(--border-color)'}; border-radius: 10px; padding: 14px; box-shadow: var(--shadow-xs);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; gap: 8px;">
                <h4 style="margin: 0; font-size: 0.95rem; font-weight: 700; color: var(--text-main);">${asn.title}</h4>
                <span class="badge ${isSubmitted ? 'badge-pass' : 'badge-in-progress'}" style="font-size: 0.72rem; white-space: nowrap;">
                  ${isSubmitted ? '✓ បានប្រគល់' : '○ មិនទាន់ប្រគល់'}
                </span>
              </div>

              <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0 0 10px 0; line-height: 1.5;">
                ${asn.instructions}
              </p>

              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.76rem; color: var(--text-muted); border-top: 1px dashed var(--border-color); padding-top: 8px; flex-wrap: wrap; gap: 8px;">
                <span><i class="fa-regular fa-clock"></i> ថ្ងៃកំណត់ប្រគល់៖ <strong>${asn.dueDate}</strong></span>
                
                ${isGraded ? `
                  <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #059669; font-weight: 700;">
                    <i class="fa-solid fa-award"></i> ពិន្ទុ/និទ្ទេស៖ <strong>Grade ${sub.grade}</strong>
                  </span>
                ` : ''}
              </div>

              ${sub && sub.feedback ? `
                <div style="background: rgba(99, 102, 241, 0.08); border-left: 3px solid #6366f1; padding: 6px 10px; border-radius: 4px; font-size: 0.78rem; margin-top: 8px; color: var(--text-main);">
                  💬 <strong>មតិគ្រូបង្រៀន៖</strong> <em>"${App.escapeHtml(sub.feedback)}"</em>
                </div>
              ` : ''}

              <!-- Submission Action / Link -->
              <div style="margin-top: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                ${isSubmitted && sub.submissionUrl ? `
                  <a href="${sub.submissionUrl}" target="_blank" class="text-xs" style="color: #2563eb; text-decoration: underline; word-break: break-all;">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> មើលឯកសារដែលបានប្រគល់
                  </a>
                ` : '<span></span>'}

                <button type="button" class="btn-primary btn-sm" style="font-size: 0.78rem; height: 32px; padding: 0 12px; background: ${isSubmitted ? '#4f46e5' : '#10b981'}; border-color: ${isSubmitted ? '#4f46e5' : '#10b981'};" onclick="StudentPortalView.openAssignmentSubmissionPrompt('${asn.id}', '${student.ID}', '${App.escapeHtml(student.NameKh)}')">
                  <i class="fa-solid ${isSubmitted ? 'fa-pen-to-square' : 'fa-upload'}"></i>
                  <span>${isSubmitted ? 'កែប្រែការងារ (Update Link)' : 'ប្រគល់កិច្ចការ (Submit)'}</span>
                </button>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  },

  async openAssignmentSubmissionPrompt(asnId, studentId, studentNameKh) {
    const existingSubs = typeof StudentAPI !== "undefined" ? StudentAPI.getAssignmentSubmissions() : [];
    const sub = existingSubs.find(s => s.assignmentId === asnId && s.studentId === studentId);

    const url = prompt(
      "សូមបិទភ្ជាប់ (Paste) Link ឯកសារកិច្ចការរបស់អ្នក (Google Drive, OneDrive, ឬ Website Link)៖", 
      sub ? sub.submissionUrl : "https://drive.google.com/..."
    );

    if (url === null) return;
    if (!url.trim() || url.trim() === "https://drive.google.com/...") {
      App.showToast("សូមបញ្ចូល Link ត្រឹមត្រូវ!", "warning");
      return;
    }

    const notes = prompt("កំណត់សម្គាល់បន្ថែមជូនលោកគ្រូ (បើមាន)៖", sub ? sub.notes : "ខ្ញុំបានរៀបចំកិច្ចការរួចរាល់ហើយលោកគ្រូ");

    try {
      await StudentAPI.submitAssignment({
        assignmentId: asnId,
        studentId: studentId,
        studentNameKh: studentNameKh,
        submissionUrl: url.trim(),
        notes: (notes || "").trim()
      });

      App.showToast("🎉 បានប្រគល់កិច្ចការជោគជ័យ!", "success");
      App.triggerConfetti();

      const student = this.getStudent();
      if (student) {
        const mount = document.getElementById("portalAssignmentsListMount");
        if (mount) mount.innerHTML = this.renderAssignmentsList(student, this.normalizeCourse(student.Course));
      }
    } catch (err) {
      App.showToast("កំហុសក្នុងការប្រគល់កិច្ចការ: " + err.message, "error");
    }
  },

  renderStudentLeaveHistory(studentId) {
    const all = typeof StudentAPI !== "undefined" ? StudentAPI.getLeaveRequests() : [];
    const myReqs = all.filter(r => r.studentId === studentId);

    if (myReqs.length === 0) {
      return `
        <div style="text-align: center; padding: 16px; font-size: 0.82rem; color: var(--text-muted); background: var(--border-light); border-radius: 8px;">
          មិនទាន់មានប្រវត្តិនៃការសុំច្បាប់នៅឡើយទេ។
        </div>
      `;
    }

    return `
      <div style="display: flex; flex-direction: column; gap: 8px; max-height: 180px; overflow-y: auto;">
        ${myReqs.map(req => {
          const isApproved = req.status === "approved";
          const isRejected = req.status === "rejected";
          return `
            <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 12px; font-size: 0.8rem; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 700; color: var(--text-main);">
                  <i class="fa-regular fa-calendar-check"></i> ${req.startDate} ដល់ ${req.endDate}
                </div>
                <div style="color: var(--text-muted); font-size: 0.74rem;">${req.reason}</div>
              </div>
              <span class="badge" style="background: ${isApproved ? '#d1fae5' : isRejected ? '#fee2e2' : '#fef3c7'}; color: ${isApproved ? '#059669' : isRejected ? '#dc2626' : '#d97706'}; font-size: 0.7rem; font-weight: 700;">
                ${isApproved ? '✓ បានយល់ព្រម' : isRejected ? '✕ បដិសេធ' : '⏳ រង់ចាំពិនិត្យ'}
              </span>
            </div>
          `;
        }).join("")}
      </div>
    `;
  },

  launchCourseExam(courseKey, studentId) {
    if (typeof ExamsView !== "undefined") {
      if (ExamsView.openLiveExamArena) {
        ExamsView.openLiveExamArena(courseKey, null, studentId);
      } else if (ExamsView.openLiveTypingModal) {
        ExamsView.openLiveTypingModal("TYP-01", studentId);
      }
    }
  },

  launchTypingExam(studentId) {
    this.launchCourseExam("Typing", studentId);
  }
};
