/**
 * View: Class Timetable & Computer Lab Seat Manager (កាលវិភាគសិក្សា & គ្រប់គ្រងកៅអីម៉ាស៊ីនកុំព្យូទ័រ Lab)
 * Synchronized with the real study shifts entered by user in the system:
 * 1. វេនព្រឹក (08:00 - 09:00)
 * 2. វេនថ្ងៃ (15:00 - 16:00)
 * 3. វេនរសៀល (17:00 - 18:00)
 */
const TimetableLabView = {
  activeTab: "timetable", // "timetable" | "lab"
  activeShift: "ព្រឹក",
  TOTAL_PCS: 14,

  getShiftsList() {
    return [
      {
        id: "ព្រឹក",
        label: "វេនព្រឹក (08:00 - 09:00)",
        time: "08:00 - 09:00",
        course: "កុំព្យូទ័ររដ្ឋបាល (Typing ➔ Word ➔ Excel ➔ PowerPoint)",
        room: "Lab A (១៤ ម៉ាស៊ីន)",
        teacher: "លោកគ្រូ ខៀន ធូ"
      },
      {
        id: "ថ្ងៃ",
        label: "វេនថ្ងៃ (15:00 - 16:00)",
        time: "15:00 - 16:00",
        course: "កុំព្យូទ័ររដ្ឋបាល (Typing ➔ Word ➔ Excel ➔ PowerPoint)",
        room: "Lab A (១៤ ម៉ាស៊ីន)",
        teacher: "លោកគ្រូ ខៀន ធូ"
      },
      {
        id: "រសៀល",
        label: "វេនរសៀល (17:00 - 18:00)",
        time: "17:00 - 18:00",
        course: "កុំព្យូទ័ររដ្ឋបាល (Typing ➔ Word ➔ Excel ➔ PowerPoint)",
        room: "Lab A (១៤ ម៉ាស៊ីន)",
        teacher: "លោកគ្រូ ខៀន ធូ"
      }
    ];
  },

  getStudentsInShift(shiftId) {
    const students = App.state.students || [];
    const target = String(shiftId || "").trim().toLowerCase();
    return students.filter(s => {
      if (!s.Shift) return false;
      const sh = String(s.Shift).trim().toLowerCase();
      return sh === target || target.includes(sh) || sh.includes(target);
    });
  },

  getShiftLabel(shiftId) {
    const shifts = this.getShiftsList();
    const found = shifts.find(s => s.id === shiftId || s.label === shiftId);
    return found ? found.label : (shiftId || "វេនសិក្សា");
  },

  getLabSeats() {
    let seats = {};
    try {
      const data = localStorage.getItem(APP_CONFIG.STORAGE_KEY_LAB || "master_school_lab_seats");
      if (data) seats = JSON.parse(data);
    } catch (e) {}

    // Clean any old cached keys above TOTAL_PCS (e.g. PC-15 to PC-24)
    if (seats && typeof seats === "object") {
      Object.keys(seats).forEach(shiftId => {
        if (seats[shiftId] && typeof seats[shiftId] === "object") {
          Object.keys(seats[shiftId]).forEach(pcKey => {
            const num = parseInt((pcKey || "").replace(/\D/g, ""), 10) || 0;
            if (num > this.TOTAL_PCS) {
              delete seats[shiftId][pcKey];
            }
          });
        }
      });
    }

    // Ensure default allocation for active shifts if not customized yet
    const shifts = this.getShiftsList();
    shifts.forEach(sh => {
      if (!seats[sh.id] || Object.keys(seats[sh.id]).length === 0) {
        seats[sh.id] = {};
        const shiftStudents = this.getStudentsInShift(sh.id);
        shiftStudents.slice(0, this.TOTAL_PCS).forEach((st, idx) => {
          const pcId = `PC-${String(idx + 1).padStart(2, '0')}`;
          seats[sh.id][pcId] = st.ID;
        });
      }
    });

    return seats;
  },

  saveLabSeats(seats) {
    localStorage.setItem(APP_CONFIG.STORAGE_KEY_LAB || "master_school_lab_seats", JSON.stringify(seats));
    if (typeof StudentAPI !== "undefined" && StudentAPI.isCloudConnected()) {
      try {
        firebase.database().ref("lab_seats").set(seats);
      } catch (e) {}
    }
  },

  render() {
    return `
      <section id="view-timetable" class="page-view">
        <!-- Top Action & Title Header -->
        <div class="card" style="margin-bottom: 20px; padding: 20px 24px; border-left: 4px solid #06b6d4; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div>
            <h2 style="font-size: 1.35rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 10px; margin: 0 0 6px 0;">
              <i class="fa-solid fa-calendar-days" style="color: #06b6d4;"></i>
              <span>កាលវិភាគសិក្សា & គ្រប់គ្រងកៅអីកុំព្យូទ័រ Lab (Timetable & PC Map)</span>
            </h2>
            <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted);">
              តាមដានម៉ោងបង្រៀនជាក់ស្តែងតាមវេន និងបែងចែកម៉ាស៊ីនកុំព្យូទ័រ (PC-01 ដល់ PC-14) ជូនសិស្សអនុវត្ត
            </p>
          </div>

          <!-- Top Actions -->
          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <div class="tt-view-switch" style="display: flex; background: var(--border-light); padding: 4px; border-radius: 8px; border: 1px solid var(--border-color);">
              <button type="button" class="btn-tt-tab ${this.activeTab === 'timetable' ? 'active' : ''}" data-tt-tab="timetable" style="border: none; padding: 6px 14px; border-radius: 6px; font-size: 0.84rem; font-weight: 700; cursor: pointer;">
                <i class="fa-solid fa-table-list"></i> កាលវិភាគ (Timetable)
              </button>
              <button type="button" class="btn-tt-tab ${this.activeTab === 'lab' ? 'active' : ''}" data-tt-tab="lab" style="border: none; padding: 6px 14px; border-radius: 6px; font-size: 0.84rem; font-weight: 700; cursor: pointer;">
                <i class="fa-solid fa-desktop"></i> ប្លង់កៅអី Lab (PC Map)
              </button>
            </div>

            <button type="button" class="btn-secondary" style="height: 38px; padding: 0 14px; font-size: 0.85rem;" onclick="window.print()">
              <i class="fa-solid fa-print"></i>
              <span>Print</span>
            </button>
          </div>
        </div>

        <!-- Content Body Mount -->
        <div id="timetableContentMount">
          ${this.activeTab === 'timetable' ? this.renderTimetableSection() : this.renderLabMapSection()}
        </div>
      </section>
    `;
  },

  renderTimetableSection() {
    const students = App.state.students || [];
    const shifts = this.getShiftsList();

    return `
      <!-- Weekly Timetable Grid -->
      <div class="card" style="padding: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h3 style="margin: 0 0 4px 0; font-size: 1.15rem; color: var(--text-main);">
              <i class="fa-regular fa-clock text-cyan-500"></i> កាលវិភាគបង្រៀនជាក់ស្តែងតាមវេន (ចន្ទ ដល់ សុក្រ)
            </h3>
            <span class="text-xs text-muted">បន្ទប់អនុវត្តកុំព្យូទ័រ Lab A • បង្រៀនដោយ លោកគ្រូ ខៀន ធូ (071 721 0307)</span>
          </div>

          <div style="display: flex; gap: 8px;">
            <span class="badge" style="background: rgba(6, 182, 212, 0.1); color: #0891b2; font-weight: 700;">
              <i class="fa-solid fa-circle-info"></i> សរុប ៣ វេនសិក្សាជាក់ស្តែង (${students.length} នាក់)
            </span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 16px;">
          ${shifts.map((shift) => {
            const shiftStudents = this.getStudentsInShift(shift.id);
            const count = shiftStudents.length;

            return `
              <div class="card" style="padding: 18px; border-left: 4px solid #06b6d4; margin-bottom: 0; background: var(--bg-surface); transition: transform 0.2s ease;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                  <div>
                    <span class="badge" style="background: rgba(6, 182, 212, 0.12); color: #0891b2; font-weight: 700; margin-bottom: 4px; display: inline-block;">
                      ${shift.label}
                    </span>
                    <h4 style="margin: 2px 0 0 0; font-size: 1.05rem; color: var(--text-main);">${shift.time}</h4>
                  </div>
                  <span class="badge ${count > 0 ? 'badge-pass' : ''}" style="font-size: 0.78rem; font-weight: 700;">
                    <i class="fa-solid fa-users"></i> ${count} នាក់
                  </span>
                </div>

                <div style="background: var(--border-light); border-radius: 8px; padding: 10px 14px; margin-bottom: 12px; font-size: 0.85rem; line-height: 1.7;">
                  <div><strong>មុខវិជ្ជា៖</strong> <span style="color: var(--primary); font-weight: 600;">${shift.course}</span></div>
                  <div><strong>បន្ទប់៖</strong> ${shift.room}</div>
                  <div><strong>គ្រូបង្រៀន៖</strong> ${shift.teacher}</div>
                </div>

                <!-- Students enrolled list preview -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div style="display: flex; -webkit-box-align: center; align-items: center; overflow: hidden;">
                    ${shiftStudents.slice(0, 5).map(st => `
                      <img src="${st.Avatar || App.getDefaultAvatar(st.Gender)}" title="${st.NameKh}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover; border: 2px solid #ffffff; margin-left: -6px;" onerror="this.src='${App.getDefaultAvatar(st.Gender)}'">
                    `).join('')}
                    ${count > 5 ? `<span style="margin-left: 6px; font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">+${count - 5} នាក់</span>` : ''}
                  </div>

                  <button type="button" class="btn-secondary btn-sm" style="font-size: 0.78rem; padding: 4px 10px;" onclick="TimetableLabView.viewShiftInLab('${shift.id}')">
                    <i class="fa-solid fa-desktop text-cyan-600"></i> មើលកៅអី Lab
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  renderLabMapSection() {
    const students = App.state.students || [];
    const shifts = this.getShiftsList();
    if (!shifts.some(s => s.id === this.activeShift)) {
      this.activeShift = "ព្រឹក";
    }

    const allSeats = this.getLabSeats();
    const currentShiftSeats = allSeats[this.activeShift] || {};
    const shiftStudents = this.getStudentsInShift(this.activeShift);
    const maintenanceRecords = typeof StudentAPI !== "undefined" ? StudentAPI.getLabMaintenance() : {};

    // Total 14 workstations with maintenance status
    const workstations = Array.from({ length: this.TOTAL_PCS }, (_, i) => {
      const pcId = `PC-${String(i + 1).padStart(2, '0')}`;
      const studentId = currentShiftSeats[pcId];
      const student = students.find(s => s.ID === studentId);
      const maint = maintenanceRecords[pcId] || { status: "normal", issueNote: "" };
      return { pcId, studentId, student, maint };
    });

    const occupiedCount = workstations.filter(w => w.student).length;
    const normalCount = workstations.filter(w => !w.maint.status || w.maint.status === "normal").length;
    const maintCount = workstations.filter(w => w.maint.status === "maintenance").length;
    const brokenCount = workstations.filter(w => w.maint.status === "broken").length;

    return `
      <div class="card" style="padding: 24px;">
        <!-- Top Toolbar for Lab Map -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 14px;">
          <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
            <label class="form-label" style="margin: 0; font-weight: 700; font-size: 0.9rem;">
              <i class="fa-solid fa-clock text-cyan-500"></i> ជ្រើសរើសវេនសិក្សា៖
            </label>
            <select id="labShiftSelect" class="form-control" style="font-weight: 700; font-size: 0.9rem; min-width: 280px;">
              ${shifts.map(sh => {
                const count = this.getStudentsInShift(sh.id).length;
                return `
                  <option value="${sh.id}" ${sh.id === this.activeShift ? 'selected' : ''}>
                    ${sh.label} (${count} នាក់)
                  </option>
                `;
              }).join('')}
            </select>
          </div>

          <!-- Lab KPI Badges & Quick Auto Assign -->
          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <span class="badge" style="background: rgba(16, 185, 129, 0.12); color: #059669; font-weight: 700; padding: 6px 14px; font-size: 0.85rem;">
              <i class="fa-solid fa-desktop"></i> កំពុងប្រើ៖ ${occupiedCount}/${this.TOTAL_PCS} ម៉ាស៊ីន
            </span>
            <span class="badge" style="background: rgba(6, 182, 212, 0.12); color: #0891b2; font-weight: 700; padding: 6px 14px; font-size: 0.85rem;">
              <i class="fa-solid fa-chair"></i> នៅទំនេរ៖ ${this.TOTAL_PCS - occupiedCount} ម៉ាស៊ីន
            </span>
            <button type="button" class="btn-primary" id="btnAutoAssignSeats" style="height: 36px; padding: 0 14px; font-size: 0.82rem; background: #06b6d4; border-color: #06b6d4; box-shadow: 0 4px 12px rgba(6, 182, 212, 0.35);" onclick="TimetableLabView.autoAssignShiftStudents()">
              <i class="fa-solid fa-wand-magic-sparkles"></i> បែងចែកកៅអីស្វ័យប្រវត្តិ
            </button>
          </div>
        </div>

        <!-- PC LAB HEALTH & MAINTENANCE STATUS SUMMARY BAR -->
        <div style="background: var(--border-light); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div style="font-size: 0.84rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-screwdriver-wrench text-cyan-600"></i>
            <span>ស្ថានភាពសុខភាពម៉ាស៊ីនកុំព្យូទ័រ Lab (PC Health & Maintenance):</span>
          </div>
          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #059669; font-weight: 700; padding: 4px 10px; font-size: 0.78rem;">
              <i class="fa-solid fa-circle-check"></i> ល្អធម្មតា៖ ${normalCount}
            </span>
            <span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #d97706; font-weight: 700; padding: 4px 10px; font-size: 0.78rem;">
              <i class="fa-solid fa-wrench"></i> ត្រូវការថែទាំ៖ ${maintCount}
            </span>
            <span class="badge" style="background: rgba(239, 68, 68, 0.15); color: #dc2626; font-weight: 700; padding: 4px 10px; font-size: 0.78rem;">
              <i class="fa-solid fa-triangle-exclamation"></i> ខូច/ផ្អាក៖ ${brokenCount}
            </span>
          </div>
        </div>

        <!-- Teacher Podium / Master Station -->
        <div style="display: flex; justify-content: center; margin-bottom: 24px;">
          <div style="background: linear-gradient(135deg, #0f172a, #1e293b); color: #ffffff; padding: 10px 24px; border-radius: 12px; text-align: center; border: 2px solid #06b6d4; box-shadow: 0 4px 14px rgba(6, 182, 212, 0.25);">
            <div style="font-size: 0.75rem; color: #38bdf8; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">TEACHER PODIUM / MASTER SERVER</div>
            <div style="font-weight: 700; font-size: 0.95rem; margin-top: 2px;"><i class="fa-solid fa-chalkboard-user"></i> លោកគ្រូ ខៀន ធូ (Host Console)</div>
          </div>
        </div>

        <!-- 14 Workstations Grid (2 Rows of 7 PCs) -->
        <div class="lab-workstations-grid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 14px; margin-bottom: 20px;">
          ${workstations.map(w => {
            const isOccupied = !!w.student;
            const isBroken = w.maint.status === "broken";
            const isMaint = w.maint.status === "maintenance";

            let borderColor = isOccupied ? '#10b981' : 'var(--border-color)';
            let bgColor = isOccupied ? 'rgba(16, 185, 129, 0.07)' : 'var(--border-light)';
            if (isBroken) {
              borderColor = '#ef4444';
              bgColor = 'rgba(239, 68, 68, 0.08)';
            } else if (isMaint) {
              borderColor = '#f59e0b';
              bgColor = 'rgba(245, 158, 11, 0.08)';
            }

            return `
              <div class="workstation-box ${isOccupied ? 'occupied' : 'empty'}" 
                onclick="TimetableLabView.openAssignSeatModal('${w.pcId}')" 
                style="background: ${bgColor}; border: 2px solid ${borderColor}; border-radius: 10px; padding: 10px 6px; text-align: center; cursor: pointer; transition: all 0.2s ease; position: relative;">
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <span class="font-mono font-bold" style="font-size: 0.75rem; color: ${isBroken ? '#dc2626' : isMaint ? '#d97706' : isOccupied ? '#059669' : 'var(--text-muted)'};">${w.pcId}</span>
                  ${isBroken ? `
                    <span class="badge" style="background: #fee2e2; color: #dc2626; font-size: 0.62rem; padding: 1px 5px;" title="${w.maint.issueNote || 'ម៉ាស៊ីនខូច'}">
                      <i class="fa-solid fa-triangle-exclamation"></i> ខូច
                    </span>
                  ` : isMaint ? `
                    <span class="badge" style="background: #fef3c7; color: #d97706; font-size: 0.62rem; padding: 1px 5px;" title="${w.maint.issueNote || 'ត្រូវការថែទាំ'}">
                      <i class="fa-solid fa-wrench"></i> ថែទាំ
                    </span>
                  ` : `
                    <i class="fa-solid fa-circle" style="font-size: 0.5rem; color: ${isOccupied ? '#10b981' : '#94a3b8'};"></i>
                  `}
                </div>

                <div style="font-size: 1.5rem; color: ${isBroken ? '#ef4444' : isMaint ? '#f59e0b' : isOccupied ? '#10b981' : 'var(--text-muted)'}; margin: 2px 0;">
                  <i class="fa-solid fa-desktop"></i>
                </div>

                ${isOccupied ? `
                  <div style="margin-top: 4px;">
                    <img src="${w.student.Avatar || App.getDefaultAvatar(w.student.Gender)}" alt="${w.student.NameKh}" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover; border: 1.5px solid ${isBroken ? '#ef4444' : isMaint ? '#f59e0b' : '#10b981'}; margin: 0 auto 3px auto; display: block;" onerror="this.src='${App.getDefaultAvatar(w.student.Gender)}'">
                    <div style="font-size: 0.76rem; font-weight: 700; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${w.student.NameKh}</div>
                    <div class="font-mono text-xs text-muted">${w.student.ID}</div>
                  </div>
                ` : `
                  <div style="margin-top: 6px;">
                    <span class="badge" style="background: transparent; border: 1px dashed var(--border-color); color: var(--text-muted); font-size: 0.68rem;">+ ទំនេរ</span>
                  </div>
                `}

                ${w.maint.issueNote ? `
                  <div style="font-size: 0.65rem; color: ${isBroken ? '#dc2626' : '#d97706'}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 3px;" title="${w.maint.issueNote}">
                    <i class="fa-solid fa-circle-exclamation"></i> ${w.maint.issueNote}
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; background: var(--border-light); padding: 12px 18px; border-radius: 8px; font-size: 0.8rem; color: var(--text-muted);">
          <span>💡 គន្លឹះ៖ ចុចលើម៉ាស៊ីនកុំព្យូទ័រណាមួយដើម្បីកំណត់ ឬប្តូរសិស្សអង្គុយតាមវេននីមួយៗ។</span>
          <button type="button" class="btn-secondary btn-sm" onclick="TimetableLabView.autoAssignShiftStudents()">
            <i class="fa-solid fa-wand-magic-sparkles text-cyan-600"></i> បែងចែកកៅអីស្វ័យប្រវត្តិ
          </button>
        </div>
      </div>
    `;
  },

  initEvents() {
    // Tab switcher
    document.querySelectorAll(".btn-tt-tab").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".btn-tt-tab").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.activeTab = btn.getAttribute("data-tt-tab");
        const mount = document.getElementById("timetableContentMount");
        if (mount) {
          mount.innerHTML = this.activeTab === 'timetable' ? this.renderTimetableSection() : this.renderLabMapSection();
          this.initLabEvents();
        }
      });
    });

    this.initLabEvents();
  },

  initLabEvents() {
    const shiftSel = document.getElementById("labShiftSelect");
    if (shiftSel) {
      shiftSel.addEventListener("change", (e) => {
        this.activeShift = e.target.value;
        const mount = document.getElementById("timetableContentMount");
        if (mount && this.activeTab === 'lab') {
          mount.innerHTML = this.renderLabMapSection();
          this.initLabEvents();
        }
      });
    }
  },

  viewShiftInLab(shiftId) {
    this.activeShift = shiftId;
    this.activeTab = "lab";
    const navTabBtns = document.querySelectorAll(".btn-tt-tab");
    navTabBtns.forEach(b => {
      if (b.getAttribute("data-tt-tab") === "lab") b.classList.add("active");
      else b.classList.remove("active");
    });
    const mount = document.getElementById("timetableContentMount");
    if (mount) {
      mount.innerHTML = this.renderLabMapSection();
      this.initLabEvents();
    }
  },

  openAssignSeatModal(pcId) {
    const allSeats = this.getLabSeats();
    const currentShiftSeats = allSeats[this.activeShift] || {};
    const currentStudentId = currentShiftSeats[pcId];
    const students = App.state.students || [];
    const shiftStudents = this.getStudentsInShift(this.activeShift);
    const otherStudents = students.filter(s => !shiftStudents.some(ss => ss.ID === s.ID));

    const maintenanceRecords = typeof StudentAPI !== "undefined" ? StudentAPI.getLabMaintenance() : {};
    const currentMaint = maintenanceRecords[pcId] || { status: "normal", issueNote: "" };

    let modalEl = document.getElementById("assignLabSeatModal");
    if (!modalEl) {
      modalEl = document.createElement("div");
      modalEl.id = "assignLabSeatModal";
      modalEl.className = "modal-overlay";
      document.body.appendChild(modalEl);
    }

    modalEl.style.display = "flex";
    modalEl.innerHTML = `
      <div class="modal-card" style="max-width: 500px; animation: scaleIn 0.2s ease;">
        <div class="modal-header">
          <h3 style="display: flex; align-items: center; gap: 8px; font-size: 1.05rem; margin: 0;">
            <i class="fa-solid fa-desktop text-cyan-500"></i>
            <span>គ្រប់គ្រងកៅអី & សុខភាពម៉ាស៊ីន ${pcId}</span>
          </h3>
          <button type="button" class="modal-close-btn" onclick="document.getElementById('assignLabSeatModal').style.display='none'">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="modal-body" style="padding: 20px;">
          <div style="background: var(--border-light); border-radius: 8px; padding: 10px 14px; margin-bottom: 16px; font-size: 0.86rem; display: flex; justify-content: space-between; align-items: center;">
            <div>វេនសិក្សា៖ <strong>${this.getShiftLabel(this.activeShift)}</strong></div>
            <div>ម៉ាស៊ីន៖ <span class="font-mono font-bold text-cyan-600">${pcId}</span> (Lab A)</div>
          </div>

          <!-- Student Assignment Section -->
          <div class="form-group" style="margin-bottom: 16px;">
            <label for="seatStudentSelect" style="font-weight: 700; font-size: 0.88rem; display: block; margin-bottom: 6px;">
              <i class="fa-solid fa-user-graduate text-indigo-500"></i> សិស្សអង្គុយលើម៉ាស៊ីននេះ៖
            </label>
            <select id="seatStudentSelect" class="form-control" style="font-size: 0.88rem; font-weight: 600;">
              <option value="">-- កៅអីនៅទំនេរ (គ្មានសិស្ស) --</option>
              ${shiftStudents.length > 0 ? `
                <optgroup label="សិស្សក្នុង${this.getShiftLabel(this.activeShift)} (${shiftStudents.length} នាក់)">
                  ${shiftStudents.map(s => `
                    <option value="${s.ID}" ${s.ID === currentStudentId ? 'selected' : ''}>
                      ★ ${s.ID} - ${s.NameKh} (${s.Course || 'Typing'})
                    </option>
                  `).join('')}
                </optgroup>
              ` : ''}
              ${otherStudents.length > 0 ? `
                <optgroup label="សិស្សវេនផ្សេងទៀត">
                  ${otherStudents.map(s => `
                    <option value="${s.ID}" ${s.ID === currentStudentId ? 'selected' : ''}>
                      ${s.ID} - ${s.NameKh} (${s.Course || 'Typing'} | វេន ${s.Shift})
                    </option>
                  `).join('')}
                </optgroup>
              ` : ''}
            </select>
          </div>

          <!-- PC Health & Maintenance Section -->
          <div style="border-top: 1px dashed var(--border-color); padding-top: 14px; margin-top: 14px;">
            <label style="font-weight: 700; font-size: 0.88rem; display: block; margin-bottom: 6px;">
              <i class="fa-solid fa-screwdriver-wrench text-amber-500"></i> ស្ថានភាពសុខភាពម៉ាស៊ីន (PC Health Status)៖
            </label>
            <select id="pcHealthStatusSelect" class="form-control" style="font-size: 0.88rem; font-weight: 600; margin-bottom: 12px;">
              <option value="normal" ${currentMaint.status === 'normal' || !currentMaint.status ? 'selected' : ''}>🟢 ដំណើរការល្អ (Normal - ល្អ)</option>
              <option value="maintenance" ${currentMaint.status === 'maintenance' ? 'selected' : ''}>🟡 ត្រូវការត្រួតពិនិត្យ/ថែទាំ (Maintenance Needed)</option>
              <option value="broken" ${currentMaint.status === 'broken' ? 'selected' : ''}>🔴 ខូច / ផ្អាកប្រើប្រាស់ (Out of Order)</option>
            </select>

            <label for="pcIssueNoteInput" style="font-weight: 600; font-size: 0.82rem; display: block; margin-bottom: 4px; color: var(--text-muted);">
              កំណត់សម្គាល់បញ្ហា ឬការជួសជុល (Issue / Repair Notes)៖
            </label>
            <input type="text" id="pcIssueNoteInput" class="form-control" placeholder="ឧ. Mouse ឆ្វេងមិនដើរ ឬ រង់ចាំដំឡើង Windows..." value="${App.escapeHtml(currentMaint.issueNote || '')}" style="font-size: 0.85rem;">
          </div>

          <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
            <button type="button" class="btn-outline-danger" onclick="TimetableLabView.unassignSeat('${pcId}')">
              <i class="fa-solid fa-trash-can"></i> ទុកកៅអីទំនេរ
            </button>
            <button type="button" class="btn-primary" style="background: #06b6d4; border-color: #06b6d4;" onclick="TimetableLabView.confirmAssignSeat('${pcId}')">
              <i class="fa-solid fa-floppy-disk"></i> រក្សាទុក
            </button>
          </div>
        </div>
      </div>
    `;
  },

  async confirmAssignSeat(pcId) {
    const sel = document.getElementById("seatStudentSelect");
    const studentId = sel ? sel.value : "";
    const allSeats = this.getLabSeats();
    if (!allSeats[this.activeShift]) allSeats[this.activeShift] = {};

    if (!studentId) {
      delete allSeats[this.activeShift][pcId];
      App.showToast(`បានកំណត់ម៉ាស៊ីន ${pcId} ឱ្យនៅទំនេរ`, "info");
    } else {
      allSeats[this.activeShift][pcId] = studentId;
      const st = (App.state.students || []).find(s => s.ID === studentId);
      App.showToast(`បានកំណត់ម៉ាស៊ីន ${pcId} ជូនសិស្ស "${st ? st.NameKh : studentId}" ជោគជ័យ!`, "success");
    }

    // Save PC health and maintenance status
    const healthSelect = document.getElementById("pcHealthStatusSelect");
    const noteInput = document.getElementById("pcIssueNoteInput");
    if (healthSelect && typeof StudentAPI !== "undefined") {
      const status = healthSelect.value || "normal";
      const issueNote = noteInput ? noteInput.value.trim() : "";
      await StudentAPI.saveLabMaintenance(pcId, { status, issueNote });
    }

    this.saveLabSeats(allSeats);
    const modalEl = document.getElementById("assignLabSeatModal");
    if (modalEl) modalEl.style.display = "none";

    const mount = document.getElementById("timetableContentMount");
    if (mount && this.activeTab === 'lab') {
      mount.innerHTML = this.renderLabMapSection();
      this.initLabEvents();
    }
  },

  unassignSeat(pcId) {
    const allSeats = this.getLabSeats();
    if (allSeats[this.activeShift]) {
      delete allSeats[this.activeShift][pcId];
      this.saveLabSeats(allSeats);
    }
    App.showToast(`បានកំណត់ម៉ាស៊ីន ${pcId} ឱ្យនៅទំនេរ`, "info");
    const modalEl = document.getElementById("assignLabSeatModal");
    if (modalEl) modalEl.style.display = "none";

    const mount = document.getElementById("timetableContentMount");
    if (mount && this.activeTab === 'lab') {
      mount.innerHTML = this.renderLabMapSection();
      this.initLabEvents();
    }
  },

  autoAssignShiftStudents() {
    const shiftStudents = this.getStudentsInShift(this.activeShift);
    const allSeats = this.getLabSeats();
    allSeats[this.activeShift] = {};

    shiftStudents.slice(0, this.TOTAL_PCS).forEach((st, idx) => {
      const pcId = `PC-${String(idx + 1).padStart(2, '0')}`;
      allSeats[this.activeShift][pcId] = st.ID;
    });

    this.saveLabSeats(allSeats);
    const assignedCount = Math.min(shiftStudents.length, this.TOTAL_PCS);
    App.showToast(`បានបែងចែកកៅអីកុំព្យូទ័រស្វ័យប្រវត្តិចំនួន ${assignedCount} ម៉ាស៊ីន (ក្នុងចំណោម ${this.TOTAL_PCS} ម៉ាស៊ីន) សម្រាប់ ${this.getShiftLabel(this.activeShift)}!`, "success");
    const mount = document.getElementById("timetableContentMount");
    if (mount && this.activeTab === 'lab') {
      mount.innerHTML = this.renderLabMapSection();
      this.initLabEvents();
    }
  }
};
