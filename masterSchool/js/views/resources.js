/**
 * View: Computer Learning Resource Center & Cheat Sheets (ឃ្លាំងឯកសារមេរៀន & គន្លឹះកុំព្យូទ័រ)
 */
const ResourcesView = {
  activeTab: "all",
  searchQuery: "",

  render() {
    return `
      <section id="view-resources" class="page-view">
        <!-- Top Title Header -->
        <div class="card" style="margin-bottom: 20px; padding: 20px 24px; border-left: 4px solid #8b5cf6; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div>
            <h2 style="font-size: 1.35rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 10px; margin: 0 0 6px 0;">
              <i class="fa-solid fa-book-bookmark" style="color: #8b5cf6;"></i>
              <span>ឃ្លាំងឯកសារមេរៀន & គន្លឹះកុំព្យូទ័រ (Computer Learning Resources)</span>
            </h2>
            <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted);">
              គន្លឹះអនុវត្តជាក់ស្តែង រូបមន្ត Excel គំរូរដ្ឋបាល Word គន្លឹះវាយអត្ថបទ Typing និងបទបង្ហាញ PowerPoint
            </p>
          </div>

          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <button type="button" class="btn-primary" style="height: 38px; padding: 0 16px; font-size: 0.88rem; background: #10b981; border-color: #10b981; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);" onclick="ResourcesView.openCreateAssignmentModal()">
              <i class="fa-solid fa-circle-plus"></i>
              <span>+ បង្កើតកិច្ចការថ្មី</span>
            </button>
            <button type="button" class="btn-secondary" style="height: 38px; padding: 0 16px; font-size: 0.88rem;" onclick="window.print()">
              <i class="fa-solid fa-print"></i>
              <span>បោះពុម្ពឯកសារ</span>
            </button>
          </div>
        </div>

        <!-- Filter Tabs & Search Bar -->
        <div class="filter-bar" style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div class="resource-category-tabs" style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" class="btn-paper-filter ${this.activeTab === 'all' ? 'active' : ''}" data-res-tab="all">
              <i class="fa-solid fa-layer-group"></i> ទាំងអស់ (All)
            </button>
            <button type="button" class="btn-paper-filter ${this.activeTab === 'assignments' ? 'active' : ''}" data-res-tab="assignments">
              <i class="fa-solid fa-list-check" style="color: #10b981;"></i> កិច្ចការ & Projects
            </button>
            <button type="button" class="btn-paper-filter ${this.activeTab === 'typing' ? 'active' : ''}" data-res-tab="typing">
              <i class="fa-solid fa-keyboard" style="color: #8b5cf6;"></i> Typing Cheat Sheet
            </button>
            <button type="button" class="btn-paper-filter ${this.activeTab === 'word' ? 'active' : ''}" data-res-tab="word">
              <i class="fa-solid fa-file-word" style="color: #185abd;"></i> MS Word រដ្ឋបាល
            </button>
            <button type="button" class="btn-paper-filter ${this.activeTab === 'excel' ? 'active' : ''}" data-res-tab="excel">
              <i class="fa-solid fa-file-excel" style="color: #107c41;"></i> MS Excel Top 15 Formulas
            </button>
            <button type="button" class="btn-paper-filter ${this.activeTab === 'powerpoint' ? 'active' : ''}" data-res-tab="powerpoint">
              <i class="fa-solid fa-file-powerpoint" style="color: #d83b01;"></i> PowerPoint Master
            </button>
          </div>

          <div class="search-box" style="width: 280px;">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="resourceSearchInput" placeholder="ស្វែងរករូបមន្ត ឬគន្លឹះ..." value="${this.searchQuery}" />
          </div>
        </div>

        <!-- Dynamic Content Grid Container -->
        <div id="resourcesContentContainer">
          ${this.renderResourcesGrid()}
        </div>
      </section>
    `;
  },

  renderResourcesGrid() {
    const q = this.searchQuery.toLowerCase().trim();
    const tab = this.activeTab;

    // Helper to check filter match
    const matches = (category, title, text) => {
      if (tab !== "all" && tab !== category) return false;
      if (!q) return true;
      return title.toLowerCase().includes(q) || text.toLowerCase().includes(q) || category.toLowerCase().includes(q);
    };

    return `
      <div style="display: flex; flex-direction: column; gap: 24px;">

        <!-- 0. ASSIGNMENTS & PRACTICAL PROJECTS SECTION -->
        ${(tab === 'all' || tab === 'assignments') ? `
          <div class="resource-section-block">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #10b981; padding-bottom: 8px; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fa-solid fa-list-check fa-lg" style="color: #10b981;"></i>
                <h3 style="margin: 0; font-size: 1.15rem; color: var(--text-main);">កិច្ចការអនុវត្តជាក់ស្តែង & Projects (Coursework & Homework)</h3>
              </div>
              <button type="button" class="btn-primary btn-sm" onclick="ResourcesView.openCreateAssignmentModal()" style="background: #10b981; border-color: #10b981;">
                <i class="fa-solid fa-plus"></i> + បង្កើតកិច្ចការថ្មី
              </button>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px;">
              ${this.renderAdminAssignmentsCards(q)}
            </div>
          </div>
        ` : ''}

        <!-- 1. EXCEL FORMULAS SECTION -->
        ${(tab === 'all' || tab === 'excel') ? `
          <div class="resource-section-block">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px; border-bottom: 2px solid #107c41; padding-bottom: 8px;">
              <i class="fa-solid fa-file-excel fa-lg" style="color: #107c41;"></i>
              <h3 style="margin: 0; font-size: 1.15rem; color: var(--text-main);">Microsoft Excel: រូបមន្តស្នូលទាំង ១៥ សម្រាប់រដ្ឋបាល & គណនេយ្យ</h3>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 16px;">
              
              <!-- Formula 1: SUM & AVERAGE -->
              ${matches('excel', 'SUM & AVERAGE', 'បូកសរុប និងមធ្យមភាគ') ? `
                <div class="card" style="padding: 16px; border-left: 4px solid #107c41;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                    <strong style="color: #107c41; font-size: 0.95rem;">1. =SUM() & =AVERAGE()</strong>
                    <span class="badge" style="background: rgba(16, 124, 65, 0.1); color: #107c41;">មូលដ្ឋាន</span>
                  </div>
                  <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px;">
                    ប្រើសម្រាប់បូកសរុបតម្លៃលេខ និងគណនាតម្លៃមធ្យមភាគសិស្ស ឬចំណូលចំណាយ។
                  </p>
                  <div class="formula-code-box" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; font-family: monospace; font-size: 0.88rem; display: flex; justify-content: space-between; align-items: center;">
                    <code style="color: #0f172a;">=SUM(D2:D50) / =AVERAGE(E2:E50)</code>
                    <button type="button" class="btn-action btn-copy-formula" onclick="ResourcesView.copyText('=SUM(D2:D50)')" title="ចម្លងរូបមន្ត">
                      <i class="fa-regular fa-copy"></i>
                    </button>
                  </div>
                </div>
              ` : ''}

              <!-- Formula 2: IF Condition -->
              ${matches('excel', 'IF', 'លក្ខខណ្ឌ ជាប់ធ្លាក់ ឬកម្រិត') ? `
                <div class="card" style="padding: 16px; border-left: 4px solid #107c41;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                    <strong style="color: #107c41; font-size: 0.95rem;">2. =IF() - វិនិច្ឆ័យលក្ខខណ្ឌ (Pass/Fail)</strong>
                    <span class="badge" style="background: rgba(16, 124, 65, 0.1); color: #107c41;">សំខាន់</span>
                  </div>
                  <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px;">
                    កំណត់លក្ខខណ្ឌ ប្រសិនបើពិន្ទុ ≥ ៥០ ជាប់ (Pass) បើមិនដូច្នេះទេ ធ្លាក់ (Fail)។
                  </p>
                  <div class="formula-code-box" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; font-family: monospace; font-size: 0.88rem; display: flex; justify-content: space-between; align-items: center;">
                    <code style="color: #0f172a;">=IF(E2>=50, "ជាប់", "ធ្លាក់")</code>
                    <button type="button" class="btn-action btn-copy-formula" onclick="ResourcesView.copyText('=IF(E2>=50, \\\"ជាប់\\\", \\\"ធ្លាក់\\\")')" title="ចម្លងរូបមន្ត">
                      <i class="fa-regular fa-copy"></i>
                    </button>
                  </div>
                </div>
              ` : ''}

              <!-- Formula 3: VLOOKUP & XLOOKUP -->
              ${matches('excel', 'VLOOKUP XLOOKUP', 'ស្វែងរកទិន្នន័យ') ? `
                <div class="card" style="padding: 16px; border-left: 4px solid #107c41;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                    <strong style="color: #107c41; font-size: 0.95rem;">3. =VLOOKUP() & =XLOOKUP()</strong>
                    <span class="badge" style="background: rgba(16, 124, 65, 0.1); color: #107c41;">កម្រិតខ្ពស់</span>
                  </div>
                  <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px;">
                    ទាញយកឈ្មោះ ឬតម្លៃពីតារាងផ្សេងទៀតដោយស្វ័យប្រវត្តិតាមរយៈលេខ ID សិស្ស/ទំនិញ។
                  </p>
                  <div class="formula-code-box" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; font-family: monospace; font-size: 0.88rem; display: flex; justify-content: space-between; align-items: center;">
                    <code style="color: #0f172a;">=VLOOKUP(A2, $A$2:$F$100, 2, FALSE)</code>
                    <button type="button" class="btn-action btn-copy-formula" onclick="ResourcesView.copyText('=VLOOKUP(A2, $A$2:$F$100, 2, FALSE)')" title="ចម្លងរូបមន្ត">
                      <i class="fa-regular fa-copy"></i>
                    </button>
                  </div>
                </div>
              ` : ''}

              <!-- Formula 4: COUNTIF & SUMIF -->
              ${matches('excel', 'COUNTIF SUMIF', 'រាប់ចំនួន និងបូកតាមលក្ខខណ្ឌ') ? `
                <div class="card" style="padding: 16px; border-left: 4px solid #107c41;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                    <strong style="color: #107c41; font-size: 0.95rem;">4. =COUNTIF() & =SUMIF()</strong>
                    <span class="badge" style="background: rgba(16, 124, 65, 0.1); color: #107c41;">ស្ថិតិ</span>
                  </div>
                  <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px;">
                    រាប់ចំនួនសិស្សស្រី/ប្រុស ឬបូកប្រាក់ចំណូលតាមវគ្គនីមួយៗ។
                  </p>
                  <div class="formula-code-box" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; font-family: monospace; font-size: 0.88rem; display: flex; justify-content: space-between; align-items: center;">
                    <code style="color: #0f172a;">=COUNTIF(C2:C100, "ស្រី")</code>
                    <button type="button" class="btn-action btn-copy-formula" onclick="ResourcesView.copyText('=COUNTIF(C2:C100, \\\"ស្រី\\\")')" title="ចម្លងរូបមន្ត">
                      <i class="fa-regular fa-copy"></i>
                    </button>
                  </div>
                </div>
              ` : ''}

              <!-- Formula 5: Khmer Student Grading (A, B, C, D, E, F) -->
              ${matches('excel', 'Grading Formula', 'និទ្ទេសសិស្ស A B C D F') ? `
                <div class="card" style="padding: 16px; border-left: 4px solid #107c41;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                    <strong style="color: #107c41; font-size: 0.95rem;">5. រូបមន្តផ្តល់និទ្ទេសសិស្ស (Nested IF)</strong>
                    <span class="badge" style="background: rgba(16, 124, 65, 0.1); color: #107c41;">ស្តង់ដារសាលា</span>
                  </div>
                  <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px;">
                    ចេញនិទ្ទេសស្វ័យប្រវត្តិ៖ A(≥85), B(≥75), C(≥65), D(≥50), F(&lt;50)។
                  </p>
                  <div class="formula-code-box" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; font-family: monospace; font-size: 0.8rem; display: flex; justify-content: space-between; align-items: center;">
                    <code style="color: #0f172a; overflow-x: auto; white-space: nowrap;">=IF(E2>=85,"A",IF(E2>=75,"B",IF(E2>=65,"C",IF(E2>=50,"D","F"))))</code>
                    <button type="button" class="btn-action btn-copy-formula" onclick="ResourcesView.copyText('=IF(E2>=85,\\\"A\\\",IF(E2>=75,\\\"B\\\",IF(E2>=65,\\\"C\\\",IF(E2>=50,\\\"D\\\",\\\"F\\\"))))')" title="ចម្លងរូបមន្ត">
                      <i class="fa-regular fa-copy"></i>
                    </button>
                  </div>
                </div>
              ` : ''}

              <!-- Formula 6: Khmer Payroll Calculator -->
              ${matches('excel', 'Payroll', 'ប្រាក់ខែបុគ្គលិក កាត់ពន្ធ') ? `
                <div class="card" style="padding: 16px; border-left: 4px solid #107c41;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                    <strong style="color: #107c41; font-size: 0.95rem;">6. តារាងបើកប្រាក់បៀវត្សរ៍ (Payroll Net Pay)</strong>
                    <span class="badge" style="background: rgba(16, 124, 65, 0.1); color: #107c41;">រដ្ឋបាល</span>
                  </div>
                  <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px;">
                    ប្រាក់បៀវត្សរ៍សុទ្ធ = (ប្រាក់ខែគោល + ប្រាក់ឧបត្ថម្ភ + ថ្លៃ OT) - (ពន្ធ + អវត្តមាន)។
                  </p>
                  <div class="formula-code-box" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; font-family: monospace; font-size: 0.88rem; display: flex; justify-content: space-between; align-items: center;">
                    <code style="color: #0f172a;">=(C2 + D2 + E2) - (F2 + G2)</code>
                    <button type="button" class="btn-action btn-copy-formula" onclick="ResourcesView.copyText('=(C2 + D2 + E2) - (F2 + G2)')" title="ចម្លងរូបមន្ត">
                      <i class="fa-regular fa-copy"></i>
                    </button>
                  </div>
                </div>
              ` : ''}

            </div>
          </div>
        ` : ''}

        <!-- 2. MS WORD ADMINISTRATIVE STANDARDS SECTION -->
        ${(tab === 'all' || tab === 'word') ? `
          <div class="resource-section-block">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px; border-bottom: 2px solid #185abd; padding-bottom: 8px;">
              <i class="fa-solid fa-file-word fa-lg" style="color: #185abd;"></i>
              <h3 style="margin: 0; font-size: 1.15rem; color: var(--text-main);">Microsoft Word: ស្តង់ដាររៀបចំលិខិតរដ្ឋបាលខ្មែរផ្លូវការ</h3>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 16px;">
              
              <!-- Standard Margins -->
              <div class="card" style="padding: 16px; border-left: 4px solid #185abd;">
                <strong style="color: #185abd; font-size: 0.95rem; display: block; margin-bottom: 8px;">
                  📏 ស្តង់ដារកំណត់គែមទំព័រ (Page Margins):
                </strong>
                <ul style="font-size: 0.85rem; line-height: 1.8; color: var(--text-main); padding-left: 20px; margin: 0;">
                  <li><strong>ខាងឆ្វេង (Left):</strong> 3.0 cm (សម្រាប់ទុកដេរឯកសារ)</li>
                  <li><strong>ខាងស្តាំ (Right):</strong> 1.5 cm</li>
                  <li><strong>ខាងលើ (Top):</strong> 2.0 cm</li>
                  <li><strong>ខាងក្រោម (Bottom):</strong> 1.5 cm</li>
                  <li><strong>ទំហំក្រដាស (Paper Size):</strong> A4 (21 cm × 29.7 cm)</li>
                </ul>
              </div>

              <!-- Standard Fonts -->
              <div class="card" style="padding: 16px; border-left: 4px solid #185abd;">
                <strong style="color: #185abd; font-size: 0.95rem; display: block; margin-bottom: 8px;">
                  🔤 ពុម្ពអក្សរ & ទំហំស្តង់ដារ (Standard Khmer Fonts):
                </strong>
                <ul style="font-size: 0.85rem; line-height: 1.8; color: var(--text-main); padding-left: 20px; margin: 0;">
                  <li><strong>ចំណងជើងធំ/ព្រះរាជាណាចក្រកម្ពុជា:</strong> Khmer OS Muol Light (Size 12-14 pt)</li>
                  <li><strong>ចំណងជើងរង/កម្មវត្ថុ:</strong> Khmer OS Muol Light (Size 11-12 pt)</li>
                  <li><strong>តួអត្ថបទសេចក្តីលម្អិត:</strong> Khmer OS Siemreap ឬ Kantumruy Pro (Size 11-12 pt)</li>
                  <li><strong>គម្លាតបន្ទាត់ (Line Spacing):</strong> 1.15 ឬ 1.25 pt</li>
                  <li><strong>ការតម្រឹម (Alignment):</strong> Justify (ស្មើមុខ ស្មើក្រោយ)</li>
                </ul>
              </div>

              <!-- Official Structure -->
              <div class="card" style="padding: 16px; border-left: 4px solid #185abd;">
                <strong style="color: #185abd; font-size: 0.95rem; display: block; margin-bottom: 8px;">
                  📑 ទម្រង់រចនាសម្ព័ន្ធលិខិតរដ្ឋបាល (Letter Anatomy):
                </strong>
                <ol style="font-size: 0.82rem; line-height: 1.7; color: var(--text-main); padding-left: 18px; margin: 0;">
                  <li><strong>ក្បាលលិខិត:</strong> ព្រះរាជាណាចក្រកម្ពុជា ជាតិ សាសនា ព្រះមហាក្សត្រ</li>
                  <li><strong>ប្រភពលិខិត:</strong> ឈ្មោះស្ថាប័ន/សាលា និងលេខកូដលិខិត</li>
                  <li><strong>កាលបរិច្ឆេទ & ទីកន្លែង:</strong> រាជធានីភ្នំពេញ, ថ្ងៃទី... ខែ... ឆ្នាំ...</li>
                  <li><strong>គោរពជូន:</strong> ឈ្មោះអ្នកទទួល ឬតួនាទី</li>
                  <li><strong>កម្មវត្ថុ & យោង:</strong> មូលហេតុ និងឯកសារយោង</li>
                  <li><strong>សេចក្តីលម្អិត:</strong> សេចក្តីផ្តើម តួសេចក្តី សេចក្តីបញ្ចប់</li>
                  <li><strong>ហត្ថលេខា & ត្រា:</strong> ឈ្មោះ និងតួនាទីអ្នកចុះហត្ថលេខា</li>
                </ol>
              </div>

              <!-- Word Shortcuts -->
              <div class="card" style="padding: 16px; border-left: 4px solid #185abd;">
                <strong style="color: #185abd; font-size: 0.95rem; display: block; margin-bottom: 8px;">
                  ⚡ ផ្លូវកាត់សំខាន់ៗ (Essential MS Word Shortcuts):
                </strong>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.82rem;">
                  <div><code>Ctrl + J</code> : Justify ស្មើមុខក្រោយ</div>
                  <div><code>Ctrl + E</code> : Center កណ្តាល</div>
                  <div><code>Ctrl + H</code> : Find & Replace ស្វែងរក</div>
                  <div><code>Ctrl + K</code> : Insert Link បញ្ចូលតំណ</div>
                  <div><code>Ctrl + [ / ]</code> : បង្រួម/ពង្រីកអក្សរ</div>
                  <div><code>F12</code> : Save As រក្សាទុកថ្មី</div>
                </div>
              </div>

            </div>
          </div>
        ` : ''}

        <!-- 3. TYPING TECHNIQUE & KHMER UNICODE SECTION -->
        ${(tab === 'all' || tab === 'typing') ? `
          <div class="resource-section-block">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px; border-bottom: 2px solid #8b5cf6; padding-bottom: 8px;">
              <i class="fa-solid fa-keyboard fa-lg" style="color: #8b5cf6;"></i>
              <h3 style="margin: 0; font-size: 1.15rem; color: var(--text-main);">Typing Master: គន្លឹះវាយអត្ថបទរហ័ស & ក្តារចុចយូនីកូដខ្មែរ (Touch Typing)</h3>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 16px;">
              
              <!-- Home Row Keys -->
              <div class="card" style="padding: 16px; border-left: 4px solid #8b5cf6;">
                <strong style="color: #8b5cf6; font-size: 0.95rem; display: block; margin-bottom: 8px;">
                  🖐️ ទីតាំងម្រាមដៃគោល (Home Row Keys):
                </strong>
                <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px;">
                  ដាក់ម្រាមដៃទាំង ៨ លើជួរកណ្តាលជានិច្ចពេលចាប់ផ្តើម៖
                </div>
                <div style="display: flex; gap: 10px; justify-content: center; background: #f8fafc; padding: 10px; border-radius: 8px; font-family: monospace; font-weight: 700; font-size: 1.1rem;">
                  <span style="color: #3b82f6;">A S D F</span>
                  <span style="color: #94a3b8;">| Space |</span>
                  <span style="color: #10b981;">J K L ;</span>
                </div>
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 8px; text-align: center;">
                  ដៃឆ្វេង៖ កូនដៃ (A), នាង (S), កណ្តាល (D), ចង្អុល (F)<br>
                  ដៃស្តាំ៖ ចង្អុល (J), កណ្តាល (K), នាង (L), កូនដៃ (;)
                </div>
              </div>

              <!-- Khmer Unicode Subscript Rule -->
              <div class="card" style="padding: 16px; border-left: 4px solid #8b5cf6;">
                <strong style="color: #8b5cf6; font-size: 0.95rem; display: block; margin-bottom: 8px;">
                  🇰🇭 របៀបវាយជើងអក្សរខ្មែរ (Khmer Subscript Coeng):
                </strong>
                <p style="font-size: 0.85rem; color: var(--text-main); margin-bottom: 10px;">
                  ដើម្បីវាយជើងអក្សរ ត្រូវចុចគ្រាប់ចុច <strong>[ J ]</strong> (ឬ <strong>Shift + J</strong>) រួចចុចព្យញ្ជនៈដែលចង់ធ្វើជាជើង៖
                </p>
                <div style="background: #f8fafc; border-radius: 6px; padding: 8px 12px; font-size: 0.85rem; line-height: 1.8;">
                  <div>• ជើង <strong>ក</strong> (្ក) ➔ ចុច <code>j</code> + <code>k</code></div>
                  <div>• ជើង <strong>ម</strong> (្ម) ➔ ចុច <code>j</code> + <code>m</code></div>
                  <div>• ជើង <strong>រ</strong> (្រ) ➔ ចុច <code>j</code> + <code>r</code></div>
                  <div>• ជើង <strong>ស</strong> (្ស) ➔ ចុច <code>j</code> + <code>s</code></div>
                </div>
              </div>

              <!-- WPM Milestones -->
              <div class="card" style="padding: 16px; border-left: 4px solid #8b5cf6;">
                <strong style="color: #8b5cf6; font-size: 0.95rem; display: block; margin-bottom: 8px;">
                  ⚡ កម្រិតល្បឿន WPM (Words Per Minute):
                </strong>
                <div style="font-size: 0.84rem; line-height: 1.8;">
                  <div>🐢 <strong>Beginner (១៥ - ២៥ WPM):</strong> កំពុងទន្ទេញទីតាំងគ្រាប់ចុច</div>
                  <div>🏃 <strong>Intermediate (៣០ - ៤០ WPM):</strong> វាយបានរលូនដោយមិនបាច់មើលក្តារចុច</div>
                  <div>🚀 <strong>Advanced (៤៥ - ៦០ WPM):</strong> ល្បឿនការងាររដ្ឋបាលអាជីព (និទ្ទេស A)</div>
                  <div>🏆 <strong>Pro Master (៧០+ WPM):</strong> កម្រិតកំពូល</div>
                </div>
              </div>

            </div>
          </div>
        ` : ''}

        <!-- 4. POWERPOINT PRESENTATION DESIGN SECTION -->
        ${(tab === 'all' || tab === 'powerpoint') ? `
          <div class="resource-section-block">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px; border-bottom: 2px solid #d83b01; padding-bottom: 8px;">
              <i class="fa-solid fa-file-powerpoint fa-lg" style="color: #d83b01;"></i>
              <h3 style="margin: 0; font-size: 1.15rem; color: var(--text-main);">Microsoft PowerPoint: គន្លឹះរចនាស្លាយបទបង្ហាញទាក់ទាញ</h3>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 16px;">
              
              <!-- 6x6 Rule -->
              <div class="card" style="padding: 16px; border-left: 4px solid #d83b01;">
                <strong style="color: #d83b01; font-size: 0.95rem; display: block; margin-bottom: 8px;">
                  🎯 ក្បួន 6 × 6 (The 6x6 Rule):
                </strong>
                <p style="font-size: 0.85rem; line-height: 1.7; color: var(--text-main); margin: 0;">
                  • មិនត្រូវដាក់លើសពី <strong>៦ បន្ទាត់</strong> ក្នុង ១ ស្លាយឡើយ។<br>
                  • ក្នុង ១ បន្ទាត់ មិនត្រូវដាក់លើសពី <strong>៦ ពាក្យ</strong>។<br>
                  • ប្រើគន្លឹះចំណុចសំខាន់ៗ (Bullet points) ជំនួសការចម្លងកថាខណ្ឌទាំងមូល។<br>
                  • រូបភាព ១ សន្លឹក មានតម្លៃស្មើ ១០០០ ពាក្យ (Visual over text)។
                </p>
              </div>

              <!-- Color Palette 60-30-10 -->
              <div class="card" style="padding: 16px; border-left: 4px solid #d83b01;">
                <strong style="color: #d83b01; font-size: 0.95rem; display: block; margin-bottom: 8px;">
                  🎨 ក្បួនពណ៌ ៦០-៣០-១០ (Color Harmony):
                </strong>
                <p style="font-size: 0.85rem; line-height: 1.7; color: var(--text-main); margin: 0;">
                  • <strong>៦០% ពណ៌ផ្ទៃក្រោយ (Dominant):</strong> ពណ៌ស្រាល ស ទឹកដោះគោ ឬខ្មៅងងឹត។<br>
                  • <strong>៣០% ពណ៌បន្ទាប់បន្សំ (Secondary):</strong> សម្រាប់កាត អត្ថបទ និងតារាង។<br>
                  • <strong>១០% ពណ៌ទាក់ទាញ (Accent):</strong> សម្រាប់ចំណុចសំខាន់ ប៊ូតុង និង Icon។
                </p>
              </div>

              <!-- Presentation Shortcuts -->
              <div class="card" style="padding: 16px; border-left: 4px solid #d83b01;">
                <strong style="color: #d83b01; font-size: 0.95rem; display: block; margin-bottom: 8px;">
                  📽️ គ្រាប់ចុចបញ្ជាពេលធ្វើបទបង្ហាញ (Live Shortcuts):
                </strong>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.82rem; margin-top: 6px;">
                  <div><code>F5</code> : បង្ហាញពីដើម</div>
                  <div><code>Shift + F5</code> : បង្ហាញស្លាយបច្ចុប្បន្ន</div>
                  <div><code>B</code> : បិទអេក្រង់ងងឹត (Black)</div>
                  <div><code>W</code> : បិទអេក្រង់ស (White)</div>
                  <div><code>Ctrl + P</code> : បើកប៊ិចគូសចំណាំ</div>
                  <div><code>Ctrl + E</code> : ជ័រលុប Eraser</div>
                </div>
              </div>

            </div>
          </div>
        ` : ''}

      </div>
    `;
  },

  initEvents() {
    // Category tabs
    document.querySelectorAll(".resource-category-tabs button[data-res-tab]").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".resource-category-tabs button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.activeTab = btn.getAttribute("data-res-tab");
        const container = document.getElementById("resourcesContentContainer");
        if (container) container.innerHTML = this.renderResourcesGrid();
      });
    });

    // Search input
    const searchInput = document.getElementById("resourceSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value;
        const container = document.getElementById("resourcesContentContainer");
        if (container) container.innerHTML = this.renderResourcesGrid();
      });
    }
  },

  copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        App.showToast(`បានចម្លង "${text}" ទៅក្តារតម្បៀតខ្ទាស់ (Clipboard)!`, "success");
      }).catch(() => {
        this.fallbackCopy(text);
      });
    } else {
      this.fallbackCopy(text);
    }
  },

  fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    App.showToast(`បានចម្លង "${text}" រួចរាល់!`, "success");
  },

  // ====================================================
  // PRACTICAL ASSIGNMENTS & HOMEWORK METHODS
  // ====================================================
  renderAdminAssignmentsCards(q = "") {
    const assignments = typeof StudentAPI !== "undefined" ? StudentAPI.getAssignments() : [];
    const submissions = typeof StudentAPI !== "undefined" ? StudentAPI.getAssignmentSubmissions() : [];

    const filtered = assignments.filter(a => {
      if (!q) return true;
      return a.title.toLowerCase().includes(q) || a.instructions.toLowerCase().includes(q) || (a.course || '').toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
      return `<div style="grid-column: 1 / -1; text-align: center; padding: 30px; color: var(--text-muted);">រកមិនឃើញកិច្ចការឡើយ។ សូមចុចប៊ូតុងខាងលើដើម្បីបង្កើតកិច្ចការថ្មី។</div>`;
    }

    return filtered.map(asn => {
      const subs = submissions.filter(s => s.assignmentId === asn.id);
      const gradedCount = subs.filter(s => s.grade).length;

      return `
        <div class="card" style="border: 1.5px solid var(--border-color); border-radius: 12px; padding: 18px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <span class="badge badge-course badge-course-${(asn.course || 'word').toLowerCase()}">${asn.course || 'Word'}</span>
              <span class="text-xs text-muted font-mono">${asn.id}</span>
            </div>

            <h4 style="margin: 0 0 6px 0; font-size: 1.05rem; font-weight: 700; color: var(--text-main); line-height: 1.4;">
              ${asn.title}
            </h4>

            <p style="font-size: 0.84rem; color: var(--text-muted); margin: 0 0 12px 0; line-height: 1.5;">
              ${asn.instructions}
            </p>
          </div>

          <div>
            <div style="background: var(--border-light); padding: 8px 12px; border-radius: 8px; font-size: 0.78rem; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center;">
              <span><i class="fa-regular fa-calendar-check text-emerald-600"></i> ថ្ងៃកំណត់៖ <strong>${asn.dueDate}</strong></span>
              <span><i class="fa-solid fa-users text-indigo-500"></i> បានប្រគល់៖ <strong>${subs.length} នាក់</strong> (${gradedCount} ដាក់ពិន្ទុរួច)</span>
            </div>

            <div style="display: flex; gap: 8px; justify-content: flex-end;">
              <button type="button" class="btn-secondary btn-sm" onclick="ResourcesView.viewAssignmentSubmissions('${asn.id}')">
                <i class="fa-solid fa-eye text-emerald-600"></i> <span>ពិនិត្យ & ដាក់ពិន្ទុ (${subs.length})</span>
              </button>
              <button type="button" class="btn-outline-danger btn-sm" onclick="ResourcesView.handleDeleteAssignment('${asn.id}')" title="លុបកិច្ចការ">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  },

  async openCreateAssignmentModal() {
    const course = prompt("ជ្រើសរើសវគ្គសិក្សា (វាយ: Word, Excel, PowerPoint, ឬ Typing)៖", "Word");
    if (!course) return;

    const title = prompt("ចំណងជើងកិច្ចការ (Title)៖", "កិច្ចការរដ្ឋបាល: រៀបចំលិខិតផ្លូវការ");
    if (!title || !title.trim()) return;

    const instructions = prompt("សេចក្តីណែនាំអំពីកិច្ចការ (Instructions)៖", "សិស្សត្រូវអនុវត្តតាមគំរូឯកសារ និងរៀបចំអត្ថបទដោយកំណត់ Font Kantumruy Pro");
    if (!instructions || !instructions.trim()) return;

    const dueDate = prompt("ថ្ងៃផុតកំណត់ប្រគល់ (Due Date YYYY-MM-DD)៖", new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]);
    if (!dueDate) return;

    try {
      await StudentAPI.saveAssignment({
        course: course.trim(),
        title: title.trim(),
        instructions: instructions.trim(),
        dueDate: dueDate.trim(),
        createdBy: "លោកគ្រូ ខៀន ធូ"
      });

      App.showToast("🎉 បានបង្កើតកិច្ចការថ្មីដោយជោគជ័យ!", "success");
      App.triggerConfetti();

      this.activeTab = "assignments";
      const container = document.getElementById("resourcesContentContainer");
      if (container) container.innerHTML = this.renderResourcesGrid();
    } catch (err) {
      App.showToast("កំហុសក្នុងការបង្កើតកិច្ចការ: " + err.message, "error");
    }
  },

  viewAssignmentSubmissions(asnId) {
    const assignments = typeof StudentAPI !== "undefined" ? StudentAPI.getAssignments() : [];
    const asn = assignments.find(a => a.id === asnId);
    if (!asn) return;

    const submissions = typeof StudentAPI !== "undefined" ? StudentAPI.getAssignmentSubmissions() : [];
    const subs = submissions.filter(s => s.assignmentId === asnId);

    let modalEl = document.getElementById("submissionsModal");
    if (!modalEl) {
      modalEl = document.createElement("div");
      modalEl.id = "submissionsModal";
      modalEl.className = "modal-overlay";
      document.body.appendChild(modalEl);
    }

    modalEl.style.display = "flex";
    modalEl.innerHTML = `
      <div class="modal-card" style="max-width: 680px; max-height: 85vh; display: flex; flex-direction: column;">
        <div class="modal-header" style="background: linear-gradient(135deg, #10b981, #059669); color: #ffffff;">
          <h3 style="color: #ffffff; margin: 0; font-size: 1.1rem; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-list-check"></i>
            <span>ការប្រគល់ការងារសិស្ស៖ ${asn.title}</span>
          </h3>
          <button type="button" class="modal-close-btn" onclick="document.getElementById('submissionsModal').style.display='none'" style="color: #ffffff;">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px; overflow-y: auto; flex: 1;">
          ${subs.length === 0 ? `
            <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
              <i class="fa-solid fa-file-circle-question fa-3x mb-3" style="color: #94a3b8;"></i>
              <p>មិនទាន់មានសិស្សប្រគល់កិច្ចការនេះនៅឡើយទេ។</p>
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 14px;">
              ${subs.map((sub, sIdx) => `
                <div style="background: var(--border-light); border-radius: 10px; padding: 14px; border: 1px solid var(--border-color);">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <div>
                      <strong style="color: var(--text-main); font-size: 0.95rem;">${sub.studentNameKh}</strong>
                      <span class="font-mono text-xs text-muted" style="margin-left: 6px;">(${sub.studentId})</span>
                    </div>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">ប្រគល់៖ ${new Date(sub.submittedAt).toLocaleDateString('km-KH')}</span>
                  </div>

                  <div style="margin-bottom: 8px; font-size: 0.82rem;">
                    Link ការងារ៖ <a href="${sub.submissionUrl}" target="_blank" style="color: #2563eb; text-decoration: underline; word-break: break-all;">
                      <i class="fa-solid fa-link"></i> ${sub.submissionUrl}
                    </a>
                  </div>

                  ${sub.notes ? `
                    <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 8px;">
                      កំណត់សម្គាល់សិស្ស៖ <em>"${App.escapeHtml(sub.notes)}"</em>
                    </div>
                  ` : ''}

                  <!-- Grading Form -->
                  <div style="display: grid; grid-template-columns: 120px 1fr auto; gap: 8px; align-items: center; background: var(--bg-surface); padding: 8px; border-radius: 6px; border: 1px solid var(--border-color);">
                    <select id="gradeSelect_${sIdx}" class="form-control" style="font-size: 0.8rem; height: 32px;">
                      <option value="A" ${sub.grade === 'A' ? 'selected' : ''}>Grade A</option>
                      <option value="B" ${sub.grade === 'B' ? 'selected' : ''}>Grade B</option>
                      <option value="C" ${sub.grade === 'C' ? 'selected' : ''}>Grade C</option>
                      <option value="Passed" ${sub.grade === 'Passed' ? 'selected' : ''}>Passed</option>
                      <option value="F" ${sub.grade === 'F' ? 'selected' : ''}>Need Revision</option>
                    </select>
                    <input type="text" id="feedbackInput_${sIdx}" class="form-control" placeholder="មតិគ្រូបង្រៀន..." value="${App.escapeHtml(sub.feedback || '')}" style="font-size: 0.8rem; height: 32px;">
                    <button type="button" class="btn-primary btn-sm" style="height: 32px; font-size: 0.78rem;" onclick="ResourcesView.saveGradeForSubmission('${sub.id}', 'gradeSelect_${sIdx}', 'feedbackInput_${sIdx}')">
                      <i class="fa-solid fa-floppy-disk"></i> រក្សាទុក
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-secondary" onclick="document.getElementById('submissionsModal').style.display='none'">បិទផ្ទាំង</button>
        </div>
      </div>
    `;
  },

  async saveGradeForSubmission(subId, gradeSelectId, feedbackInputId) {
    const grade = document.getElementById(gradeSelectId)?.value || "A";
    const feedback = document.getElementById(feedbackInputId)?.value.trim() || "";

    try {
      await StudentAPI.gradeAssignmentSubmission(subId, grade, feedback);
      App.showToast("🎉 បានដាក់ពិន្ទុ និងផ្ញើមតិកែលម្អជូនសិស្សជោគជ័យ!", "success");
      App.triggerConfetti();
    } catch (err) {
      App.showToast("កំហុស: " + err.message, "error");
    }
  },

  async handleDeleteAssignment(asnId) {
    if (!confirm("តើអ្នកពិតជាចង់លុបកិច្ចការនេះមែនទេ?")) return;
    try {
      await StudentAPI.deleteAssignment(asnId);
      App.showToast("បានលុបកិច្ចការជោគជ័យ!", "info");
      const container = document.getElementById("resourcesContentContainer");
      if (container) container.innerHTML = this.renderResourcesGrid();
    } catch (err) {
      App.showToast("កំហុសក្នុងការលុប: " + err.message, "error");
    }
  }
};
