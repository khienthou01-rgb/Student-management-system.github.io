/**
 * Official Computer Exam Papers & Test Bank (ឃ្លាំងវិញ្ញាសាប្រឡងកុំព្យូទ័រផ្លូវការ ៤ វគ្គ)
 * Typing ➔ Microsoft Word ➔ Microsoft Excel ➔ Microsoft PowerPoint
 */
const EXAM_PAPERS_DATA = {
  Typing: [
    {
      id: "TYP-01",
      courseId: "Typing",
      title: "វិញ្ញាសាទី ១: ការវាយអត្ថបទរឿងនិទានខ្មែរ (Khmer Narrative Typing)",
      lang: "ភាសាខ្មែរ (Khmer)",
      duration: 5, // minutes
      maxScore: 100,
      passWpm: 35,
      description: "វាស់ស្ទង់ល្បឿនវាយអក្សរផ្ចង់យូនីកូដខ្មែរ ភាពត្រឹមត្រូវនៃព្យញ្ជនៈ ជើងអក្សរ ស្រៈ និងសញ្ញាវណ្ណយុត្តិ។",
      sampleText: `កាលពីព្រេងនាយ មានសិស្សពីរនាក់រៀននៅសាលាជាមួយគ្នា។ សិស្សទីមួយជាមនុស្សឧស្សាហ៍ព្យាយាម តែងតែយកចិត្តទុកដាក់ស្តាប់លោកគ្រូពន្យល់ និងហាត់វាយអត្ថបទកុំព្យូទ័រជារៀងរាល់ថ្ងៃ។ ចំណែកសិស្សទីពីរវិញ ជាមនុស្សខ្ជិលច្រអូស មិនសូវខ្វល់ខ្វាយពីការសិក្សាឡើយ។ លុះដល់ថ្ងៃប្រឡងបញ្ចប់វគ្គ សិស្សទីមួយបានវាយអត្ថបទយ៉ាងរហ័ស និងត្រឹមត្រូវឥតមានកំហុស ដោយទទួលបានពិន្ទុខ្ពស់ និងនិទ្ទេសល្អឥតខ្ចោះ។ រីឯសិស្សទីពីរវិញ វាយបានយឺត និងខុសអក្ខរាវិរុទ្ធជាច្រើន។ ដំណើររឿងនេះអប់រំយើងថា ការព្យាយាមគង់បានសម្រេច ការហាត់សមរាល់ថ្ងៃនាំមកនូវភាពប៉ិនប្រសប់។`,
      rubric: [
        { criteria: "ល្បឿន ≥ ៤៥ WPM និងត្រឹមត្រូវ ៩៥% ឡើង", score: "៩០ - ១០០ (និទ្ទេស A)" },
        { criteria: "ល្បឿន ៣៥ - ៤៤ WPM និងត្រឹមត្រូវ ៩០%", score: "៧៥ - ៨៩ (និទ្ទេស B)" },
        { criteria: "ល្បឿន ២៥ - ៣៤ WPM និងត្រឹមត្រូវ ៨០%", score: "៦៥ - ៧៤ (និទ្ទេស C)" },
        { criteria: "ល្បឿន ២០ - ២៤ WPM", score: "៥០ - ៦៤ (និទ្ទេស D)" },
        { criteria: "ល្បឿនក្រោម ២០ WPM ឬខុសច្រើន", score: "< ៥០ (ធ្លាក់ F)" }
      ]
    },
    {
      id: "TYP-02",
      courseId: "Typing",
      title: "វិញ្ញាសាទី ២: អត្ថបទភាសាអង់គ្លេសផ្លូវការ (English Formal Typing)",
      lang: "ភាសាអង់គ្លេស (English)",
      duration: 5,
      maxScore: 100,
      passWpm: 40,
      description: "Test typing speed and accuracy on standard English business communication and technology text.",
      sampleText: `Technology has transformed modern education in remarkable ways. Computers and the internet allow students to access global libraries and collaborate with peers worldwide. Learning computer literacy skills, including touch typing, word processing, and spreadsheet calculation, has become essential for career success in the digital age. Diligent students practice daily to improve their speed and precision. MasterSchool is committed to empowering students with practical digital knowledge for a brighter future.`,
      rubric: [
        { criteria: "Speed ≥ 50 WPM with Accuracy ≥ 95%", score: "90 - 100 (Grade A)" },
        { criteria: "Speed 40 - 49 WPM with Accuracy ≥ 90%", score: "75 - 89 (Grade B)" },
        { criteria: "Speed 30 - 39 WPM with Accuracy ≥ 80%", score: "65 - 74 (Grade C)" },
        { criteria: "Speed 25 - 29 WPM", score: "50 - 64 (Grade D)" },
        { criteria: "Speed < 25 WPM or excessive errors", score: "< 50 (Fail F)" }
      ]
    },
    {
      id: "TYP-03",
      courseId: "Typing",
      title: "វិញ្ញាសាទី ៣: អត្ថបទចម្រុះខ្មែរ-អង់គ្លេស (Bilingual Khmer-English Typing)",
      lang: "ចម្រុះ (Bilingual)",
      duration: 5,
      maxScore: 100,
      passWpm: 30,
      description: "ការផ្លាស់ប្តូរក្តារចុច Keyboard (Alt+Shift) រវាងភាសាខ្មែរ និងអង់គ្លេសដោយរលូន និងត្រឹមត្រូវ។",
      sampleText: `វិទ្យាស្ថាន MasterSchool សូមស្វាគមន៍សិស្សានុសិស្សមកកាន់វគ្គ Computer Literacy 2026។ នៅក្នុងវគ្គសិក្សានេះ យើងសិក្សាលើកម្មវិធី Microsoft Word សម្រាប់រៀបចំ Document, កម្មវិធី Microsoft Excel សម្រាប់ទិន្នន័យ Data Analysis, និង Microsoft PowerPoint សម្រាប់បង្កើត Presentation។ សិស្សត្រូវតែចេះ Touch Typing ឱ្យបានស្ទាត់ជំនាញដើម្បីបង្កើន Productivity ក្នុងការបំពេញការងារ។`,
      rubric: [
        { criteria: "ប្តូរភាសារហ័ស ល្បឿន ≥ ៤០ WPM", score: "៩០ - ១០០ (A)" },
        { criteria: "ល្បឿន ៣០ - ៣៩ WPM ត្រឹមត្រូវ ៩០%", score: "៧៥ - ៨៩ (B)" },
        { criteria: "ល្បឿន ២០ - ២៩ WPM", score: "៥០ - ៧៤ (C/D)" }
      ]
    }
  ],

  Word: [
    {
      id: "WRD-01",
      courseId: "Word",
      title: "វិញ្ញាសាទី ១: ការរៀបចំលិខិតរដ្ឋបាលផ្លូវការ (Official Administrative Letter)",
      duration: 45, // minutes
      maxScore: 100,
      description: "រៀបចំលិខិតរដ្ឋបាលផ្លូវការស្នើសុំបើកវគ្គបណ្តុះបណ្តាលកុំព្យូទ័រ ស្របតាមទម្រង់រដ្ឋបាលកម្ពុជា។",
      requirements: [
        "កំណត់ទំហំក្រដាស A4, រឹមទំព័រ (Margins): លើ 2.5cm, ក្រោម 2.5cm, ឆ្វេង 2.5cm, ស្តាំ 2cm",
        "ក្បាលលិខិត៖ 'ព្រះរាជាណាចក្រកម្ពុជា ជាតិ សាសនា ព្រះមហាក្សត្រ' (Font: Khmer OS Muol Light, 14pt)",
        "ឈ្មោះស្ថាប័ន ឬសាលារៀននៅផ្នែកខាងឆ្វេង (Font: Khmer OS Muol Light 11pt)",
        "ចំណងជើងលិខិត៖ 'លិខិតស្នើសុំ' ដាក់ចំកណ្តាល មានបន្ទាត់ពីក្រោម (Underline)",
        "ខ្លឹមសារលិខិត៖ ប្រើ Font Khmer OS Siemreap 12pt, គម្លាតបន្ទាត់ 1.15, First Line Indent 1.25cm",
        "កាលបរិច្ឆេទ និងហត្ថលេខាខាងស្តាំក្រោម ប្រើ Font ត្រឹមត្រូវ"
      ],
      rubric: [
        { criteria: "ការកំណត់ Page Setup & Margins ត្រឹមត្រូវ", score: "២០ ពិន្ទុ" },
        { criteria: "ការប្រើប្រាស់ Font Khmer OS Muol Light & Siemreap និងទំហំអក្សរ", score: "៣០ ពិន្ទុ" },
        { criteria: "គម្លាតកថាខណ្ឌ (Paragraph Spacing, Indent, Alignment)", score: "២៥ ពិន្ទុ" },
        { criteria: "ភាពត្រឹមត្រូវនៃអក្ខរាវិរុទ្ធ និងសោភ័ណភាពទូទៅ", score: "២៥ ពិន្ទុ" }
      ],
      questions: [
        {
          id: 1,
          scenario: "ការកំណត់ទំហំក្រដាស និងរឹមទំព័រ (Page Setup & Margins)",
          question: "តើលោកគ្រូ ឬសិស្សត្រូវចូលតាម Tab និងមុខងារមួយណា ដើម្បីកំណត់រឹមទំព័រ (Margins: Top 2.5cm, Bottom 2.5cm, Left 2.5cm, Right 2cm) ស្តង់ដារលិខិតរដ្ឋបាលកម្ពុជា?",
          options: [
            "Tab Layout ➔ Margins ➔ Custom Margins",
            "Tab Insert ➔ Page Setup ➔ Margins",
            "Tab View ➔ Ruler ➔ Margins",
            "Tab Home ➔ Paragraph ➔ Margins"
          ],
          correct: 0,
          points: 10,
          explanation: "ការកំណត់រឹមទំព័រ (Margins) ត្រូវចូលតាម Tab Layout ➔ Margins ➔ Custom Margins រួចបញ្ចូលទំហំតាមស្តង់ដារ។"
        },
        {
          id: 2,
          scenario: "ពុម្ពអក្សររដ្ឋបាលខ្មែរ (Khmer Administrative Fonts)",
          question: "ក្បាលលិខិតរដ្ឋបាល 'ព្រះរាជាណាចក្រកម្ពុជា ជាតិ សាសនា ព្រះមហាក្សត្រ' ត្រូវប្រើប្រាស់ពុម្ពអក្សរ (Font) មួយណាស្របតាមបទដ្ឋានរដ្ឋបាលកម្ពុជា?",
          options: [
            "Khmer OS Battambang (ទំហំ 12pt)",
            "Khmer OS Muol Light (ទំហំ 14pt)",
            "Arial Unicode MS (ទំហំ 16pt)",
            "Khmer OS Siemreap (ទំហំ 10pt)"
          ],
          correct: 1,
          points: 10,
          explanation: "ក្បាលលិខិតផ្លូវការ 'ព្រះរាជាណាចក្រកម្ពុជា ជាតិ សាសនា ព្រះមហាក្សត្រ' ត្រូវប្រើ Font Khmer OS Muol Light ទំហំ 14pt។"
        },
        {
          id: 3,
          scenario: "គម្លាតបន្ទាត់ និងកថាខណ្ឌ (Line Spacing & First Line Indent)",
          question: "ដើម្បីកំណត់ឱ្យបន្ទាត់ទីមួយនៃកថាខណ្ឌរំកិលចូលក្នុង 1.25cm (First Line Indent) និងគម្លាតបន្ទាត់ 1.15 ត្រូវចូលទៅកាន់កន្លែងណា?",
          options: [
            "Group Paragraph ➔ Indents and Spacing (Special: First line 1.25cm, Line Spacing 1.15)",
            "Group Font ➔ Advanced ➔ Spacing",
            "Group Styles ➔ Normal ➔ Modify",
            "Group Editing ➔ Paragraph Spacing"
          ],
          correct: 0,
          points: 10,
          explanation: "First Line Indent និង Line Spacing ត្រូវបានកំណត់នៅក្នុង Paragraph Dialog Box ក្រោម Tab Home ឬ Layout។"
        },
        {
          id: 4,
          scenario: "ការដាក់លេខទំព័រស្វ័យប្រវត្តិ (Page Numbering & Header/Footer)",
          question: "ដើម្បីឱ្យឯកសារបង្ហាញលេខទំព័រស្វ័យប្រវត្តនៅផ្នែកខាងក្រោមនៃទំព័រ (Footer) ត្រូវជ្រើសរើស៖",
          options: [
            "Tab Layout ➔ Line Numbers",
            "Tab Insert ➔ Header & Footer ➔ Page Number ➔ Bottom of Page",
            "Tab References ➔ Insert Footnote",
            "Tab View ➔ Page Numbering"
          ],
          correct: 1,
          points: 10,
          explanation: "Insert ➔ Header & Footer ➔ Page Number ➔ Bottom of Page ជាវិធីស្តង់ដារសម្រាប់បន្ថែមលេខទំព័រស្វ័យប្រវត្ត។"
        },
        {
          id: 5,
          scenario: "ការគ្រប់គ្រងតារាង (Table Formatting & Cell Merging)",
          question: "ដើម្បីបញ្ចូលក្រឡាច្រើន (Merge Cells) ក្នុងតារាង Word ឱ្យក្លាយជាក្រឡាតែមួយសម្រាប់ក្បាលតារាង ត្រូវធ្វើដូចម្តេច?",
          options: [
            "ជ្រើសរើស Cells ទាំងនោះ រួចចុច Delete",
            "ជ្រើសរើស Cells ទាំងនោះ ➔ Tab Table Layout ➔ ចុច 'Merge Cells'",
            "ចុច Ctrl + M លើ Keyboard",
            "Tab Table Design ➔ Split Cells"
          ],
          correct: 1,
          points: 10,
          explanation: "ជ្រើសរើសក្រឡាដែលត្រូវបញ្ចូលគ្នា រួចចូល Tab Table Layout ➔ ចុច Merge Cells។"
        },
        {
          id: 6,
          scenario: "គ្រាប់ចុចកាត់រហ័ស (Keyboard Shortcuts)",
          question: "Shortcut សម្រាប់ រក្សាទុកឯកសារ (Save) និង បោះពុម្ព (Print) រហ័សក្នុង Microsoft Word គឺ៖",
          options: [
            "Ctrl + S (រក្សាទុក) និង Ctrl + P (បោះពុម្ព)",
            "Ctrl + A (រក្សាទុក) និង Ctrl + B (បោះពុម្ព)",
            "Ctrl + W (រក្សាទុក) និង Ctrl + Q (បោះពុម្ព)",
            "Alt + S (រក្សាទុក) និង Alt + P (បោះពុម្ព)"
          ],
          correct: 0,
          points: 10,
          explanation: "Ctrl + S សម្រាប់ Save និង Ctrl + P សម្រាប់បោះពុម្ព Print ឯកសារ។"
        },
        {
          id: 7,
          scenario: "ការបំបែកទំព័ររហ័ស (Page Break)",
          question: "ដើម្បីបញ្ចប់ទំព័របច្ចុប្បន្ន ហើយផ្លោះទៅសរសេរនៅទំព័រថ្មីភ្លាមៗដោយមិនបាច់ចុច Enter ច្រើនដង ត្រូវចុច Shortcut អ្វី?",
          options: [
            "Shift + Enter",
            "Alt + Enter",
            "Ctrl + Enter (Page Break)",
            "Ctrl + Shift + Enter"
          ],
          correct: 2,
          points: 10,
          explanation: "Ctrl + Enter គឺជា Shortcut បង្កើត Page Break ទៅកាន់ទំព័រថ្មីភ្លាមៗ។"
        },
        {
          id: 8,
          scenario: "ការផ្ញើលិខិត ឬកិច្ចសន្យាស្វ័យប្រវត្តិ (Mail Merge)",
          question: "មុខងារ Mail Merge នៅក្នុង Tab 'Mailings' មានសារៈសំខាន់បំផុតសម្រាប់កិច្ចការរដ្ឋបាលអ្វី?",
          options: [
            "ផ្ញើអ៊ីមែលផ្ទាល់ខ្លួន",
            "បង្កើតលិខិតអញ្ជើញ វិញ្ញាបនបត្រ ឬកិច្ចសន្យាដែលមានឈ្មោះមនុស្សខុសៗគ្នាស្វ័យប្រវត្តតាមបញ្ជីទិន្នន័យ",
            "កែសម្រួលអក្ខរាវិរុទ្ធភាសាខ្មែរ",
            "បំប្លែងឯកសារទៅជា Excel"
          ],
          correct: 1,
          points: 10,
          explanation: "Mail Merge ប្រើប្រាស់សម្រាប់បញ្ចូលទិន្នន័យ (ឈ្មោះ, អាសយដ្ឋាន) ពីតារាង Excel ចូលទៅក្នុងទម្រង់លិខិត Word ម្តងបានរាប់រយនាក់។"
        },
        {
          id: 9,
          scenario: "ការបង្កើតតារាងមាតិកាស្វ័យប្រវត្តិ (Table of Contents)",
          question: "ដើម្បីឱ្យ Microsoft Word អាចបង្កើតតារាងមាតិកា (Table of Contents) ដោយស្វ័យប្រវត្តបាន តើអ្នកវាយអត្ថបទត្រូវអនុវត្តអ្វីជាមុន?",
          options: [
            "កំណត់ចំណងជើងធំ និងតូចនីមួយៗដោយប្រើ Heading Styles (Heading 1, Heading 2...)",
            "សរសេរលេខទំព័រដោយដៃនៅចុងបន្ទាត់",
            "ដាក់ពណ៌អក្សរក្រហមលើចំណងជើង",
            "គូសបន្ទាត់ពីក្រោមចំណងជើងទាំងអស់"
          ],
          correct: 0,
          points: 10,
          explanation: "Word អាចដកស្រង់មាតិកាស្វ័យប្រវត្តបាន លុះត្រាតែយើងកំណត់ចំណងជើងជា Heading Styles (Heading 1, Heading 2) ត្រឹមត្រូវ។"
        },
        {
          id: 10,
          scenario: "ការរក្សាទុកជា PDF មិនឱ្យខូច Font (Export to PDF)",
          question: "ដើម្បីការពារកុំឱ្យរត់បន្ទាត់ ឬបាត់ពុម្ពអក្សរខ្មែរពេលផ្ញើឯកសារទៅកាន់កុំព្យូទ័រដទៃ វិធីល្អបំផុតគឺ៖",
          options: [
            "ថតអេក្រង់ឯកសារ Word ផ្ញើចេញ",
            "Export ឬ Save As ឯកសារនោះជាប្រភេទ PDF (*.pdf)",
            "Copy អត្ថបទដាក់ក្នុង Notepad",
            "ប្តូរ Font ទាំងអស់ទៅជា Times New Roman"
          ],
          correct: 1,
          points: 10,
          explanation: "ការ Export ឬ Save As ជា PDF នឹងបង្កប់ Fonts និងទ្រង់ទ្រាយឯកសារឱ្យនៅដដែល ១០០% លើគ្រប់ឧបករណ៍។"
        }
      ]
    },
    {
      id: "WRD-02",
      courseId: "Word",
      title: "វិញ្ញាសាទី ២: ការបង្កើតតារាង និងសម្រង់ស្ថិតិ (Table Formatting & Bullets)",
      duration: 45,
      maxScore: 100,
      description: "រៀបចំឯកសាររបាយការណ៍មានតារាងទិន្នន័យច្បាស់លាស់ ការ Merge Cells និងការដាក់ Shading ស្អាត។",
      requirements: [
        "បង្កើតតារាងចំនួន ៥ ជួរឈរ និង ៨ ជួរដេក",
        "ធ្វើការ Merge Cells ក្បាលតារាង និងកំណត់ Shading ពណ៌ស្រាល",
        "តម្រឹមអក្សរក្នុង Cell (Center, Align Left, Align Right តាមប្រភេទលេខ/អក្សរ)",
        "ប្រើប្រាស់ Bullet Points និង Numbering សម្រាប់បញ្ជីមុខវិជ្ជា",
        "បន្ថែមរូបភាព Logo សាលា និងកំណត់ Text Wrapping ជា Square ឬ Tight"
      ],
      rubric: [
        { criteria: "រចនាសម្ព័ន្ធតារាង និង Merge Cells", score: "៣០ ពិន្ទុ" },
        { criteria: "ការដាក់ពណ៌ Shading & Border Styles", score: "២៥ ពិន្ទុ" },
        { criteria: "ការប្រើប្រាស់ Bullets, Numbering & Insert Image", score: "២៥ ពិន្ទុ" },
        { criteria: "ភាពទាក់ទាញ និងភាពរៀបរយនៃឯកសារ", score: "២០ ពិន្ទុ" }
      ]
    },
    {
      id: "WRD-03",
      courseId: "Word",
      title: "វិញ្ញាសាទី ៣: ការរៀបចំកិច្ចសន្យា និងលិខិតអញ្ជើញ (Contract & Mail Merge)",
      duration: 50,
      maxScore: 100,
      description: "តាក់តែងកិច្ចសន្យាការងារមាន ២ ទំព័រ មាន Header/Footer, Page Numbering និង Page Border។",
      requirements: [
        "បង្កើតឯកសារ ២ ទំព័រ មាន Header បង្ហាញឈ្មោះសាលា និង Footer បង្ហាញលេខទំព័រ (Page X of Y)",
        "ដាក់ស៊ុមទំព័រ (Page Border) ស្តើងស្អាតសមរម្យសម្រាប់កិច្ចសន្យា",
        "ប្រើប្រាស់ Tabs Stop (Leader dots: ........) សម្រាប់កន្លែងបំពេញឈ្មោះ",
        "បែងចែកផ្នែកហត្ថលេខាសងខាង (ភាគី ក និង ភាគី ខ) ឱ្យមានតុល្យភាព"
      ],
      rubric: [
        { criteria: "Header, Footer & Page Numbering", score: "៣០ ពិន្ទុ" },
        { criteria: "Tab Stops & Leader Dots", score: "៣០ ពិន្ទុ" },
        { criteria: "Page Border & Layout តុល្យភាព", score: "៤០ ពិន្ទុ" }
      ]
    }
  ],

  Excel: [
    {
      id: "EXC-01",
      courseId: "Excel",
      title: "វិញ្ញាសាទី ១: តារាងគ្រប់គ្រងប្រាក់បៀវត្សរ៍បុគ្គលិក (Staff Monthly Payroll)",
      duration: 50,
      maxScore: 100,
      description: "បង្កើតតារាងបើកប្រាក់បៀវត្សរ៍បុគ្គលិក ដោយប្រើប្រាស់រូបមន្ត SUM, IF, VLOOKUP និងគណនាប្រាក់ពន្ធ។",
      sampleColumns: ["ល.រ", "អត្តលេខ", "ឈ្មោះបុគ្គលិក", "តួនាទី", "ប្រាក់ខែគោល", "ម៉ោងថែម (OT)", "ប្រាក់ថែមម៉ោង", "ប្រាក់ឧបត្ថម្ភ", "ប្រាក់ចំណូលសរុប", "ពន្ធកាត់ទុក", "ប្រាក់ខែសុទ្ធ"],
      requirements: [
        "ប្រាក់ថែមម៉ោង = ម៉ោងថែម * (ប្រាក់ខែគោល / ១៦០) * ១.៥",
        "ប្រាក់ចំណូលសរុប = ប្រាក់ខែគោល + ប្រាក់ថែមម៉ោង + ប្រាក់ឧបត្ថម្ភ (ប្រើរូបមន្ត =SUM)",
        "ពន្ធកាត់ទុក = ប្រសិនបើចំណូលសរុប > $500 កាត់ 5%, បើមិនដូច្នេះទេ 0% (ប្រើរូបមន្ត =IF)",
        "ប្រាក់ខែសុទ្ធ = ប្រាក់ចំណូលសរុប - ពន្ធកាត់ទុក",
        "ជួរដេកសរុបចុងក្រោយ៖ គណនាផលបូក (=SUM), មធ្យមភាគ (=AVERAGE), អតិបរមា (=MAX), អប្បបរមា (=MIN)",
        "កំណត់ Format លុយជា Dollar ($) ឬ រៀល (៛) និងដាក់ Border ស្អាត"
      ],
      rubric: [
        { criteria: "ការបញ្ចូលរូបមន្ត SUM, AVERAGE, MAX, MIN ត្រឹមត្រូវ", score: "២៥ ពិន្ទុ" },
        { criteria: "ការប្រើរូបមន្តលក្ខខណ្ឌ =IF សម្រាប់គណនាពន្ធ", score: "៣០ ពិន្ទុ" },
        { criteria: "ការគណនាប្រាក់ថែមម៉ោង និងប្រាក់សុទ្ធ", score: "២៥ ពិន្ទុ" },
        { criteria: "ការរៀបចំ Formatting (Number format, Cell color, Borders)", score: "២០ ពិន្ទុ" }
      ],
      questions: [
        {
          id: 1,
          scenario: "រូបមន្តបូកសរុប (SUM Formula)",
          question: "ដើម្បីបូកសរុបប្រាក់ចំណូលសរុបចាប់ពី Cell E2 រហូតដល់ E15 តើអ្នកត្រូវសរសេររូបមន្តមួយណាត្រឹមត្រូវ?",
          options: [
            "=SUM(E2:E15)",
            "=ADD(E2..E15)",
            "=TOTAL(E2:E15)",
            "=SUM(E2+E15)"
          ],
          correct: 0,
          points: 10,
          explanation: "=SUM(E2:E15) ជារូបមន្តស្តង់ដារក្នុង Excel សម្រាប់បូកសរុបតម្លៃក្នុងចន្លោះ Range ពី E2 ដល់ E15។"
        },
        {
          id: 2,
          scenario: "រូបមន្តមធ្យមភាគ (AVERAGE Formula)",
          question: "ដើម្បីគណនាមធ្យមភាគពិន្ទុសិស្សពី Cell D2 ដល់ D15 តើត្រូវប្រើប្រាស់រូបមន្តណា?",
          options: [
            "=MEDIAN(D2:D15)",
            "=AVERAGE(D2:D15)",
            "=AVG(D2:D15)",
            "=MEAN(D2:D15)"
          ],
          correct: 1,
          points: 10,
          explanation: "ក្នុង Microsoft Excel រូបមន្តគណនាតម្លៃមធ្យមភាគគឺ =AVERAGE() មិនមែន AVG ឡើយ។"
        },
        {
          id: 3,
          scenario: "រូបមន្តលក្ខខណ្ឌ (Logical IF Formula)",
          question: "ប្រសិនបើតម្លៃពិន្ទុនៅ Cell F2 ធំជាង ឬស្មើ 50 ឱ្យចេញលទ្ធផល 'ជាប់ (Pass)' បើមិនដូច្នេះទេ 'ធ្លាក់ (Fail)' រូបមន្តត្រឹមត្រូវគឺ៖",
          options: [
            "=IF(F2>=50, 'ជាប់', 'ធ្លាក់')",
            "=IF(F2>=50; ជាប់; ធ្លាក់)",
            "=IF(F2>=50, \"ជាប់\", \"ធ្លាក់\")",
            "=CHECK(F2>=50, \"ជាប់\", \"ធ្លាក់\")"
          ],
          correct: 2,
          points: 10,
          explanation: "ក្នុង Excel អត្ថបទ Text ក្នុងរូបមន្ត =IF ត្រូវតែព័ទ្ធដោយសញ្ញាសម្រង់ទ្វេ (\") ដូចជា =IF(F2>=50, \"ជាប់\", \"ធ្លាក់\")។"
        },
        {
          id: 4,
          scenario: "ការរាប់ទិន្នន័យមានលក្ខខណ្ឌ (COUNTIF Function)",
          question: "ដើម្បីរាប់ចំនួនសិស្សដែលបានបង់ប្រាក់គ្រប់ ('Paid') ក្នុងជួរ F2:F20 តើត្រូវប្រើប្រាស់រូបមន្តណា?",
          options: [
            "=COUNT(F2:F20, \"Paid\")",
            "=COUNTIF(F2:F20, \"Paid\")",
            "=SUMIF(F2:F20, \"Paid\")",
            "=COUNTA(F2:F20, \"Paid\")"
          ],
          correct: 1,
          points: 10,
          explanation: "=COUNTIF(Range, Criteria) ប្រើសម្រាប់រាប់ចំនួនក្រឡាដែលត្រូវនឹងលក្ខខណ្ឌកំណត់។"
        },
        {
          id: 5,
          scenario: "ការទាញទិន្នន័យស្វ័យប្រវត្តិ (VLOOKUP Function)",
          question: "ដើម្បីស្វែងរកតម្លៃទំនិញតាមកូដក្នុង Cell A2 ពីតារាង Sheet2 ជួរ A:C ហើយទាញយកតម្លៃនៅជួរឈរទី ៣ ត្រូវសរសេរ៖",
          options: [
            "=VLOOKUP(A2, Sheet2!A:C, 3, FALSE)",
            "=LOOKUP(A2, Sheet2!A:C, 3)",
            "=HLOOKUP(A2, Sheet2!A:C, 3, TRUE)",
            "=SEARCH(A2, Sheet2!A:C, 3)"
          ],
          correct: 0,
          points: 10,
          explanation: "=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup]) ដោយ FALSE ធានាការស្វែងរកត្រូវពិតប្រាកដ (Exact Match)។"
        },
        {
          id: 6,
          scenario: "ការចាក់សោរ Cell (Absolute Cell Referencing)",
          question: "សញ្ញាដុល្លារ ($) ក្នុងរូបមន្ត (ឧទាហរណ៍ =$B$1*C2) មានតួនាទីអ្វីពេល Copy រូបមន្តទៅកាន់ Cell ផ្សេង?",
          options: [
            "=ប្តូរតម្លៃទៅជាប្រាក់ដុល្លារ",
            "=ចាក់សោរទីតាំងក្រឡា B1 មិនឱ្យរអិលទីតាំង (Absolute Reference)",
            "=បង្កើនល្បឿនគណនា",
            "=លាក់រូបមន្តមិនឱ្យគេឃើញ"
          ],
          correct: 1,
          points: 10,
          explanation: "សញ្ញា $ (ឧ. $B$1) ហៅថា Absolute Reference ប្រើសម្រាប់ចាក់សោរជួរឈរ និងជួរដេកមិនឱ្យប្រែប្រួលពេលទាញរូបមន្តចុះក្រោម។"
        },
        {
          id: 7,
          scenario: "ការគណនាភាគរយ (Percentage Calculation)",
          question: "ដើម្បីគណនាភាគរយសិស្សប្រលងជាប់ (B2=ចំនួនសិស្សជាប់, C2=ចំនួនសិស្សសរុប) រូបមន្តត្រឹមត្រូវគឺ៖",
          options: [
            "=(B2/C2) រួចចុចប៊ូតុង Percentage (%) លើ Number Group",
            "=(B2*C2)%100",
            "=PERCENT(B2, C2)",
            "=(B2+C2)/100"
          ],
          correct: 0,
          points: 10,
          explanation: "យកតម្លៃផ្នែកចែកនឹងផលសរុប =(B2/C2) រួចជ្រើសរើសទម្រង់ Percentage Style (%)។"
        },
        {
          id: 8,
          scenario: "ការដោះស្រាយបញ្ហាក្នុង Excel (Error Resolving)",
          question: "ប្រសិនបើតារាង Excel បង្ហាញសញ្ញា '###' ពេញក្រឡាមួយ តើមានន័យដូចម្តេច និងត្រូវដោះស្រាយបែបណា?",
          options: [
            "រូបមន្តខុស ត្រូវលុបចោល",
            "កុំព្យូទ័រឆ្លងមេរោគ",
            "ជួរឈរចង្អៀតពេក ត្រូវទាញពង្រីកទទឹង Column ឱ្យធំទូលាយជាងមុន",
            "ទិន្នន័យមានចំនួនអវិជ្ជមាន"
          ],
          correct: 2,
          points: 10,
          explanation: "សញ្ញា ### លេចឡើងនៅពេលដែលទទឹងរបស់ Column តូចចង្អៀតមិនអាចបង្ហាញតួលេខបានអស់។ គ្រាន់តែពង្រីក Column ជាការស្រេច។"
        },
        {
          id: 9,
          scenario: "ការចម្រាញ់ទិន្នន័យ (Data Filter)",
          question: "ដើម្បីបើកមុខងារចម្រាញ់ទិន្នន័យ (Filter) សម្រាប់ជ្រើសរើសរកមើលទិន្នន័យតាមវេន ឬភេទ ត្រូវចូលតាមណា?",
          options: [
            "Tab Insert ➔ Filter",
            "Tab Data ➔ Filter (ឬចុច Shortcut: Ctrl + Shift + L)",
            "Tab View ➔ Filter View",
            "Tab Formulas ➔ Filter Data"
          ],
          correct: 1,
          points: 10,
          explanation: "ចូល Tab Data ➔ ចុច Filter (ឬប្រើ Ctrl + Shift + L) ដើម្បីបើក Dropdown ចម្រាញ់លើក្បាលតារាង។"
        },
        {
          id: 10,
          scenario: "ការបង្កើតដ្យាក្រាមប្រៀបធៀប (Chart Visualization)",
          question: "ប្រសិនបើលោកគ្រូចង់ប្រៀបធៀបចំណូលប្រចាំខែរវាងវេនព្រឹក ថ្ងៃ និងរសៀល ឱ្យមើលឃើញរូបភាពច្បាស់ គួរប្រើ Chart ប្រភេទណា?",
          options: [
            "Column Chart ឬ Bar Chart",
            "Scatter Plot",
            "Pie Chart សម្រាប់ទិន្នន័យ ១០០ ជួរ",
            "Radar Chart"
          ],
          correct: 0,
          points: 10,
          explanation: "Column Chart ឬ Bar Chart ស័ក្តិសមបំផុតសម្រាប់ប្រៀបធៀបទិន្នន័យដាច់ដោយឡែករវាងជំពូកនីមួយៗ (Categorical Comparison)។"
        }
      ]
    },
    {
      id: "EXC-02",
      courseId: "Excel",
      title: "វិញ្ញាសាទី ២: តារាងស្រង់ពិន្ទុ និងចំណាត់ថ្នាក់សិស្ស (Student Grading & Ranking)",
      duration: 45,
      maxScore: 100,
      description: "រៀបចំតារាងស្រង់ពិន្ទុប្រឡង គណនាមធ្យមភាគ ចេញនិទ្ទេស (A, B, C, D, E, F) និងចំណាត់ថ្នាក់ (Rank)។",
      requirements: [
        "គណនាផលបូកពិន្ទុ ៤ មុខវិជ្ជា ដោយប្រើ =SUM()",
        "គណនាមធ្យមភាគ ដោយប្រើ =AVERAGE()",
        "ចេញនិទ្ទេសតាមលក្ខខណ្ឌច្រើនជាន់ (Nested IF): ≥85 (A), ≥75 (B), ≥65 (C), ≥50 (D), <50 (F)",
        "លទ្ធផល៖ ប្រសិនបើមធ្យមភាគ ≥ 50 គឺ 'ជាប់ (Pass)' បើមិនដូច្នេះទេ 'ធ្លាក់ (Fail)'",
        "គណនាចំណាត់ថ្នាក់សិស្សលេខ ១, ២, ៣... ដោយប្រើរូបមន្ត =RANK()",
        "ដាក់ Conditional Formatting ពណ៌ក្រហមលើសិស្សធ្លាក់"
      ],
      rubric: [
        { criteria: "រូបមន្ត SUM & AVERAGE", score: "២០ ពិន្ទុ" },
        { criteria: "រូបមន្ត Nested IF ចេញនិទ្ទេស និងលទ្ធផល", score: "៣៥ ពិន្ទុ" },
        { criteria: "រូបមន្តចំណាត់ថ្នាក់ =RANK()", score: "២៥ ពិន្ទុ" },
        { criteria: "Conditional Formatting & Sort ទិន្នន័យ", score: "២០ ពិន្ទុ" }
      ]
    },
    {
      id: "EXC-03",
      courseId: "Excel",
      title: "វិញ្ញាសាទី ៣: តារាងគ្រប់គ្រងស្តុកទំនិញ (Inventory Stock & Lookup)",
      duration: 50,
      maxScore: 100,
      description: "គ្រប់គ្រងតុល្យភាពស្តុកទំនិញ ស្វែងរកតម្លៃទំនិញដោយស្វ័យប្រវត្តតាមរយៈ =VLOOKUP()។",
      requirements: [
        "ប្រើរូបមន្ត =VLOOKUP() ដើម្បីទាញយកឈ្មោះទំនិញ និងតម្លៃឯកតាពីតារាងកំណត់តម្លៃ",
        "គណនាស្តុកចុងគ្រា = ស្តុកដើមគ្រា + នាំចូល - លក់ចេញ",
        "គណនាចំណូលសរុបពីការលក់ = ចំនួនលក់ចេញ * តម្លៃឯកតា",
        "ប្រើ =SUMIF() ដើម្បីបូកសរុបចំណូលតាមប្រភេទមុខទំនិញនីមួយៗ"
      ],
      rubric: [
        { criteria: "រូបមន្ត =VLOOKUP() ត្រឹមត្រូវ", score: "៣៥ ពិន្ទុ" },
        { criteria: "រូបមន្តស្តុកចុងគ្រា និងផលសរុប", score: "២៥ ពិន្ទុ" },
        { criteria: "រូបមន្ត =SUMIF() តាមប្រភេទ", score: "២៥ ពិន្ទុ" },
        { criteria: "ការរចនាតារាងវិជ្ជាជីវៈ", score: "១៥ ពិន្ទុ" }
      ]
    }
  ],

  PowerPoint: [
    {
      id: "PPT-01",
      courseId: "PowerPoint",
      title: "វិញ្ញាសាទី ១: បទបង្ហាញអំពីប្រវត្តិសាលា ឬស្ថាប័ន (School Profile Presentation)",
      duration: 45,
      maxScore: 100,
      description: "បង្កើត Slide បទបង្ហាញស្តង់ដារចំនួន ៦ ទំព័រ បង្ហាញអំពីចក្ខុវិស័យ បេសកកម្ម និងកម្មវិធីសិក្សារបស់សាលា។",
      slideList: [
        "Slide 1: ចំណងជើងធំ (Title Slide) ឈ្មោះសាលា រូបតំណាង Logo និងឈ្មោះអ្នកធ្វើបទបង្ហាញ",
        "Slide 2: ចក្ខុវិស័យ និងបេសកកម្ម (Vision & Mission) ប្រើប្រាស់ SmartArt រូបភាព",
        "Slide 3: រចនាសម្ព័ន្ធគ្រប់គ្រងសាលា (Organization Chart ប្រើ SmartArt Hierarchy)",
        "Slide 4: កម្មវិធីបណ្តុះបណ្តាលទាំង ៤ វគ្គ (Cards layout មាន Icons Word, Excel, PowerPoint)",
        "Slide 5: តារាងស្ថិតិ និងលទ្ធផលសិស្សឆ្នើម (Insert Table ឬ Chart)",
        "Slide 6: ព័ត៌មានទំនាក់ទំនង និងពាក្យអរគុណ (Contact Info, Social Media, Thank You)"
      ],
      requirements: [
        "ជ្រើសរើស Theme ឬ Slide Master ដែលមានភាពស៊ីសង្វាក់គ្នានិងមានវិជ្ជាជីវៈ",
        "កំណត់ Transition រវាង Slide នីមួយៗ (Duration 1.0s - 1.5s) មិនឱ្យរញ៉េរញ៉ៃ",
        "ដាក់ Animation លើអត្ថបទ និងរូបភាពឱ្យលេចឡើងជាលំដាប់លំដោយ (On Click ឬ With Previous)",
        "ប្រើប្រាស់ពណ៌អក្សរផ្ទុយពី Background ច្បាស់ល្អ ងាយស្រួលមើលលើអេក្រង់ធំ"
      ],
      rubric: [
        { criteria: "រចនាសម្ព័ន្ធ Slide ទាំង ៦ ទំព័រគ្រប់ជ្រុងជ្រោយ", score: "៣០ ពិន្ទុ" },
        { criteria: "ការប្រើប្រាស់ SmartArt, Icons & Charts", score: "២៥ ពិន្ទុ" },
        { criteria: "ការកំណត់ Transitions & Animations សមរម្យ", score: "២៥ ពិន្ទុ" },
        { criteria: "សោភ័ណភាព ពណ៌ និងភាពទាក់ទាញនៃបទបង្ហាញ", score: "២០ ពិន្ទុ" }
      ],
      questions: [
        {
          id: 1,
          scenario: "ការកំណត់ Slide មេ (Slide Master)",
          question: "ដើម្បីកំណត់ Logo សាលា និងទម្រង់ Font ឱ្យជាប់លើ Slide ទាំងអស់ក្នុងបទបង្ហាញដោយស្វ័យប្រវត្ត ត្រូវចូលទៅកាន់៖",
          options: [
            "Tab View ➔ Slide Master",
            "Tab Insert ➔ Slide Logo",
            "Tab Design ➔ All Slides",
            "Tab Review ➔ Master Setup"
          ],
          correct: 0,
          points: 10,
          explanation: "Slide Master នៅក្នុង Tab View អនុញ្ញាតឱ្យយើងរចនា Layout, Logo និង Font ជាគំរូសម្រាប់ Slide ទាំងអស់។"
        },
        {
          id: 2,
          scenario: "ភាពខុសគ្នារវាង Transition និង Animation",
          question: "តើអ្វីជាភាពខុសគ្នាស្នូលរវាង Transition Effects និង Animation Effects ក្នុង PowerPoint?",
          options: [
            "Transition ប្រើសម្រាប់តែរូបភាព រីឯ Animation ប្រើសម្រាប់តែអត្ថបទ",
            "Transition គឺជាចលនាពេលប្តូរ Slide មួយទៅមួយ, រីឯ Animation គឺជាចលនាលើ Object (អក្សរ, រូប) ក្នុង Slide នោះ",
            "Transition និង Animation ជាមុខងារតែមួយគ្មានអ្វីខុសគ្នាទេ",
            "Animation ប្រើពេលបោះពុម្ព Slide"
          ],
          correct: 1,
          points: 10,
          explanation: "Transition គឺជាចលនារវាង Slide ពីរ, ចំណែក Animation គឺជាចលនារបស់ Objects (អត្ថបទ, រូបភាព, រូបរាង) នៅលើ Slide។"
        },
        {
          id: 3,
          scenario: "គ្រាប់ចុចកាត់បញ្ចាំង Slide (Slide Show Shortcuts)",
          question: "ដើម្បីបញ្ចាំង Slide ពីទំព័រដំបូងបង្អស់ និងពីទំព័របច្ចុប្បន្នដែលកំពុង Edit តើត្រូវចុច Shortcut ណា?",
          options: [
            "F5 (ពីទំព័រដំបូង) និង Shift + F5 (ពីទំព័របច្ចុប្បន្ន)",
            "Ctrl + F5 (ពីទំព័រដំបូង) និង Alt + F5 (ពីទំព័របច្ចុប្បន្ន)",
            "Spacebar និង Enter",
            "F1 និង F2"
          ],
          correct: 0,
          points: 10,
          explanation: "F5 បញ្ចាំង Slide Show ចាប់ពី Slide ទី ១, រីឯ Shift + F5 បញ្ចាំងចាប់ពី Current Slide កំពុងជ្រើសរើស។"
        },
        {
          id: 4,
          scenario: "ការប្រើប្រាស់ Presenter View",
          question: "តើមុខងារ 'Presenter View' ផ្តល់អត្ថប្រយោជន៍អ្វីខ្លះដល់អ្នកធ្វើបទបង្ហាញនៅពេលភ្ជាប់ជាមួយ Projector?",
          options: [
            "បិទសំឡេងកុំព្យូទ័រស្វ័យប្រវត្ត",
            "អ្នកធ្វើបទបង្ហាញមើលឃើញ Notes, Timer, និង Slide បន្ទាប់ ខណៈទស្សនិកជនលើ Projector ឃើញតែ Slide ពេញលេញ",
            "ថតវីដេអូអ្នកស្តាប់",
            "បកប្រែភាសាស្វ័យប្រវត្ត"
          ],
          correct: 1,
          points: 10,
          explanation: "Presenter View អនុញ្ញាតឱ្យវាគ្មិនមើលឃើញចំណាំបង្រៀន (Notes), នាឡិការាប់ថយក្រោយ, និង Slide បន្ទាប់យ៉ាងងាយស្រួល។"
        },
        {
          id: 5,
          scenario: "គោលការណ៍រចនាបទបង្ហាញវិជ្ជាជីវៈ (6x6 Design Rule)",
          question: "យោងតាមគោលការណ៍រចនាបទបង្ហាញបែបវិជ្ជាជីវៈ តើការរៀបចំអត្ថបទលើ Slide គួរអនុវត្តបែបណា?",
          options: [
            "ចម្លងអត្ថបទទាំងមូលពីសៀវភៅមកដាក់លើ Slide",
            "មិនគួរដាក់អក្សរច្រើនពេកក្នុងមួយ Slide (ក្បួន 6x6: អតិបរមា ៦ បន្ទាត់ និង ៦ ពាក្យក្នុងមួយបន្ទាត់) និងប្រើពណ៌ផ្ទុយច្បាស់",
            "ប្រើ Font ៥ ប្រភេទផ្សេងគ្នាក្នុងមួយ Slide",
            "ដាក់ Animation ឱ្យញ័រគ្រប់អក្សរទាំងអស់"
          ],
          correct: 1,
          points: 10,
          explanation: "គោលការណ៍ 6x6 Rule ធានាថា Slide មានភាពសាមញ្ញ ច្បាស់លាស់ ងាយស្រួលអានពីចម្ងាយ និងទាក់ទាញអារម្មណ៍អ្នកស្តាប់។"
        },
        {
          id: 6,
          scenario: "ការបង្កើតដ្យាក្រាមរចនាសម្ព័ន្ធ (SmartArt Hierarchy)",
          question: "ដើម្បីបង្កើតដ្យាក្រាមបង្ហាញពីតួនាទី និងរចនាសម្ព័ន្ធគ្រប់គ្រងសាលា (Organization Chart) ឱ្យស្អាតរហ័ស ត្រូវប្រើមុខងារអ្វី?",
          options: [
            "Tab Insert ➔ SmartArt ➔ Hierarchy",
            "គូរប្រអប់រាងបួនជ្រុងម្តងមួយៗដោយដៃ",
            "Tab Draw ➔ Pen",
            "Tab Review ➔ Structure"
          ],
          correct: 0,
          points: 10,
          explanation: "Insert ➔ SmartArt ➔ Hierarchy ផ្តល់នូវពុម្ពគំរូរចនាសម្ព័ន្ធគ្រប់គ្រង Organization Chart ស្តង់ដារយ៉ាងស្រស់ស្អាត។"
        },
        {
          id: 7,
          scenario: "ការចាក់វីដេអូ ឬសំឡេងស្វ័យប្រវត្តិ (Multimedia Playback)",
          question: "ដើម្បីឱ្យវីដេអូ ឬសំឡេងចាក់ភ្លាមៗនៅពេលចុចផ្លាស់មកដល់ Slide នោះ តើត្រូវកំណត់ Start យ៉ាងដូចម្តេច?",
          options: [
            "Tab Video Playback ➔ Start: 'Automatically'",
            "Start: 'When Clicked on'",
            "Start: 'Never'",
            "Start: 'Loop until Stopped'"
          ],
          correct: 0,
          points: 10,
          explanation: "កំណត់ Start ជា 'Automatically' ក្នុង Tab Video Format/Playback នោះវីដេអូនឹងចាក់ស្វ័យប្រវត្តពេលបើកមកដល់ Slide នោះ។"
        },
        {
          id: 8,
          scenario: "ការភ្ជាប់តំណរវាង Slide (Interactive Hyperlinks)",
          question: "ដើម្បីចុចលើប៊ូតុង ឬអត្ថបទមួយក្នុង Slide រួចផ្លោះទៅកាន់ Slide ផ្សេងភ្លាមៗ (Interactive Link) ត្រូវប្រើប្រាស់អ្វី?",
          options: [
            "Tab Insert ➔ Link (Place in This Document ➔ ជ្រើសរើស Slide គោលដៅ)",
            "Tab Home ➔ Copy Paste",
            "Tab View ➔ Jump Slide",
            "Tab Design ➔ Navigate"
          ],
          correct: 0,
          points: 10,
          explanation: "Insert ➔ Link ➔ Place in This Document អនុញ្ញាតឱ្យយើងបង្កើតប៊ូតុងចុចផ្លោះទៅកាន់ Slide ណាមួយបានយ៉ាងរលូន។"
        },
        {
          id: 9,
          scenario: "សមាមាត្រទំហំអេក្រង់ទំនើប (Widescreen Aspect Ratio)",
          question: "ទំហំ Slide ស្តង់ដារអេក្រង់ទូលាយទំនើប (Widescreen) ដែលស័ក្តិសមបំផុតសម្រាប់ Projector និងទូរទស្សន៍ LCD បច្ចុប្បន្នគឺ៖",
          options: [
            "16:9 (Widescreen)",
            "4:3 (Standard ចាស់)",
            "1:1 (Square)",
            "21:9 (Ultrawide)"
          ],
          correct: 0,
          points: 10,
          explanation: "ទំហំ 16:9 (Widescreen) គឺជាទំហំស្តង់ដារទូទៅបច្ចុប្បន្នសម្រាប់ PowerPoint នៅលើគ្រប់អេក្រង់ទំនើប។"
        },
        {
          id: 10,
          scenario: "ការ Export ទៅជាវីដេអូ MP4 (Export Presentation to Video)",
          question: "ដើម្បីបំប្លែង Slide បទបង្ហាញទាំងអស់ឱ្យក្លាយទៅជាវីដេអូ MP4 អាចចាក់បង្ហាញលើទូរទស្សន៍ ឬបង្ហោះ Facebook/YouTube ត្រូវចូលតាម៖",
          options: [
            "File ➔ Export ➔ Create a Video (ជ្រើសរើស Full HD 1080p)",
            "File ➔ Print ➔ Video Print",
            "Ctrl + Shift + V",
            "File ➔ Close ➔ Save Video"
          ],
          correct: 0,
          points: 10,
          explanation: "ចូល File ➔ Export ➔ Create a Video រួចជ្រើសរើសកម្រិត Resolution (Full HD 1080p) ដើម្បីទាញយកជាឯកសារវីដេអូ MP4។"
        }
      ]
    },
    {
      id: "PPT-02",
      courseId: "PowerPoint",
      title: "វិញ្ញាសាទី ២: បទបង្ហាញគម្រោងអាជីវកម្ម និងផលិតផល (Business Pitch Deck)",
      duration: 50,
      maxScore: 100,
      description: "រចនា Slide បទបង្ហាញទាក់ទាញវិនិយោគិនចំនួន ៦-៨ ទំព័រ មានវីដេអូ ឬសំឡេង និង Infographics។",
      requirements: [
        "Slide 1: Executive Summary & Project Title",
        "Slide 2: Problem Statement (បញ្ហាប្រឈម)",
        "Slide 3: Our Solution (ដំណោះស្រាយអាជីវកម្ម ប្រើ SmartArt)",
        "Slide 4: Product Showcase (រូបភាពផលិតផល និងលក្ខណៈពិសេស)",
        "Slide 5: Market Opportunity & Financial Plan (ដាក់តារាងហិរញ្ញវត្ថុ)",
        "Slide 6: Call to Action & Conclusion",
        "បច្ចេកទេស៖ កំណត់ Slide Master, Insert Hyperlink រវាង Slide, Animation ពិរោះ"
      ],
      rubric: [
        { criteria: "ខ្លឹមសារ និងលំហូរគម្រោងអាជីវកម្ម", score: "៣០ ពិន្ទុ" },
        { criteria: "ការប្រើ Slide Master & Infographics", score: "៣០ ពិន្ទុ" },
        { criteria: "Animations & Hyperlinks ច្បាស់លាស់", score: "២៥ ពិន្ទុ" },
        { criteria: "សោភ័ណភាព និងភាពរស់រវើកនៃ Slide", score: "១៥ ពិន្ទុ" }
      ]
    }
  ]
};
