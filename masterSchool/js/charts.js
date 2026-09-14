/**
 * Charts and Data Visualization Module using Chart.js
 */
const DashboardCharts = {
  genderChart: null,
  gradeChart: null,
  shiftChart: null,

  // Initialize or re-render all charts
  render(students) {
    this.renderGenderChart(students);
    this.renderGradeChart(students);
    this.renderShiftChart(students);
  },

  // Gender Breakdown Donut Chart
  renderGenderChart(students) {
    const ctx = document.getElementById("genderChart");
    if (!ctx) return;

    let maleCount = 0;
    let femaleCount = 0;

    students.forEach(s => {
      const g = (s.Gender || "").trim();
      if (g === "ប្រុស" || g.toLowerCase() === "male") maleCount++;
      else if (g === "ស្រី" || g.toLowerCase() === "female") femaleCount++;
    });

    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const textColor = isDark ? "#e2e8f0" : "#1e293b";

    if (this.genderChart) {
      this.genderChart.destroy();
    }

    this.genderChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["សិស្សប្រុស (Male)", "សិស្សស្រី (Female)"],
        datasets: [{
          data: [maleCount, femaleCount],
          backgroundColor: ["#3b82f6", "#ec4899"],
          hoverBackgroundColor: ["#2563eb", "#db2777"],
          borderWidth: 3,
          borderColor: isDark ? "#1e293b" : "#ffffff"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: textColor,
              font: { family: "'Kantumruy Pro', sans-serif", size: 13 },
              padding: 16,
              usePointStyle: true
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const total = maleCount + femaleCount;
                const val = context.raw;
                const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                return ` ${context.label}: ${val} នាក់ (${pct}%)`;
              }
            }
          }
        }
      }
    });
  },

  // Students by Computer Course Bar Chart
  renderGradeChart(students) {
    const ctx = document.getElementById("gradeChart");
    if (!ctx) return;

    const courseMap = {};
    // Pre-seed computer courses
    (APP_CONFIG.computerCourses || []).forEach(c => {
      courseMap[c.name] = 0;
    });

    students.forEach(s => {
      let course = (s.Course || "").trim();
      const match = (APP_CONFIG.computerCourses || []).find(c => course.toLowerCase().includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(course.toLowerCase()));
      const key = match ? match.name : "Typing";
      courseMap[key] = (courseMap[key] || 0) + 1;
    });

    const labels = Object.keys(courseMap);
    const data = Object.values(courseMap);

    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const textColor = isDark ? "#94a3b8" : "#64748b";
    const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

    if (this.gradeChart) {
      this.gradeChart.destroy();
    }

    const barColors = [
      "rgba(99, 102, 241, 0.85)",
      "rgba(16, 185, 129, 0.85)",
      "rgba(245, 158, 11, 0.85)",
      "rgba(236, 72, 153, 0.85)"
    ];
    const hoverColors = [
      "rgba(79, 70, 229, 1)",
      "rgba(5, 150, 105, 1)",
      "rgba(217, 119, 6, 1)",
      "rgba(219, 39, 119, 1)"
    ];

    this.gradeChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "ចំនួនសិស្ស",
          data: data,
          backgroundColor: labels.map((_, i) => barColors[i % barColors.length]),
          hoverBackgroundColor: labels.map((_, i) => hoverColors[i % hoverColors.length]),
          borderRadius: 8,
          borderSkipped: false,
          maxBarThickness: 48
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: context => ` ចំនួន: ${context.raw} នាក់`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: textColor,
              font: { family: "'Kantumruy Pro', sans-serif", size: 12 }
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              color: textColor,
              font: { family: "'Plus Jakarta Sans', sans-serif" }
            },
            grid: { color: gridColor }
          }
        }
      }
    });
  },

  // Shifts or Status Distribution Polar/Bar Chart
  renderShiftChart(students) {
    const ctx = document.getElementById("shiftChart");
    if (!ctx) return;

    const shiftMap = {};
    (APP_CONFIG.shifts || []).forEach(s => {
      shiftMap[s.id] = { label: s.label, count: 0 };
    });

    students.forEach(s => {
      const shift = (s.Shift || "").trim();
      let matched = false;
      for (const sCfg of (APP_CONFIG.shifts || [])) {
        if (shift === sCfg.id || shift.includes(sCfg.id) || sCfg.label.includes(shift)) {
          shiftMap[sCfg.id].count++;
          matched = true;
          break;
        }
      }
      if (!matched && shift) {
        if (shift.includes("យប់")) {
          if (shiftMap["រសៀល"]) shiftMap["រសៀល"].count++;
        }
      }
    });

    const labels = Object.values(shiftMap).map(item => item.label);
    const data = Object.values(shiftMap).map(item => item.count);

    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const textColor = isDark ? "#e2e8f0" : "#1e293b";

    if (this.shiftChart) {
      this.shiftChart.destroy();
    }

    this.shiftChart = new Chart(ctx, {
      type: "polarArea",
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            "rgba(16, 185, 129, 0.8)",
            "rgba(245, 158, 11, 0.8)",
            "rgba(99, 102, 241, 0.8)"
          ],
          borderWidth: 2,
          borderColor: isDark ? "#1e293b" : "#ffffff"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: textColor,
              font: { family: "'Kantumruy Pro', sans-serif", size: 12 },
              padding: 12,
              usePointStyle: true
            }
          }
        },
        scales: {
          r: {
            ticks: { display: false },
            grid: { color: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }
          }
        }
      }
    });
  },

  // Update theme on all active charts
  updateTheme() {
    if (this.genderChart || this.gradeChart || this.shiftChart) {
      const students = StudentAPI.getLocalStudents();
      this.render(students);
    }
  }
};
