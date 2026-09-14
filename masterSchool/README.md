# ប្រព័ន្ធគ្រប់គ្រងសិស្សទំនើប (MasterSchool - Student Management System)

ប្រព័ន្ធគ្រប់គ្រងសិស្ស (Student Management System) កម្រិតខ្ពស់ និងស្រស់ស្អាត (Modern UI/UX) ដែលរចនាឡើងតាមស្តង់ដារ **Modular Architecture** ដោយបំបែកកូដតាមផ្នែកច្បាស់លាស់ ងាយស្រួលថែទាំ (Maintainable) និងអាចភ្ជាប់ទិន្នន័យផ្ទាល់ជាមួយ **Google Sheets** តាមរយៈ **Google Apps Script Web App**។

---

## 🌟 លក្ខណៈពិសេសចម្បងៗ (Key Features)

1. **ផ្ទាំងគ្រប់គ្រងទិន្នន័យ (Dashboard & Analytics)**:
   - បង្ហាញស្ថិតិ KPI សំខាន់ៗ៖ សិស្សសរុប, សិស្សប្រុស, សិស្សស្រី, សិស្សកំពុងសិក្សា និងសិស្សចុះឈ្មោះថ្មីប្រចាំខែ (មាន Dynamic Animated Counters)។
   - ក្រាហ្វស្ថិតិទាក់ទាញ (Interactive Charts ជាមួយ Chart.js)៖
     - ក្រាហ្វបែងចែកតាមកម្រិតថ្នាក់ (Students by Grade)
     - ក្រាហ្វសមាមាត្រយេនឌ័រ ប្រុស-ស្រី (Gender Ratio)
     - ក្រាហ្វស្ថិតិវេនសិក្សា (Study Shifts)
   - បញ្ជីសិស្សដែលទើបចុះឈ្មោះថ្មីៗ (Recent Registrations)។

2. **ទម្រង់ចុះឈ្មោះសិស្សថ្មី & ផ្ទុករូបភាពក្នុង Google Sheets (Photo Cloud Storage)**:
   - បញ្ចូលឈ្មោះខ្មែរ, ឈ្មោះឡាតាំង, ភេទ, ថ្ងៃកំណើត, ថ្នាក់, វេន, លេខទូរស័ព្ទ, លេខអាណាព្យាបាល, អាសយដ្ឋាន និងរូបថត។
   - **រូបថតសិស្សទាំងអស់ត្រូវបាន Upload ទៅកាន់ Google Drive (Folder MasterSchool_Student_Photos) និងរក្សាទុក Link ផ្ទាល់ក្នុង Google Sheet ដោយស្វ័យប្រវត្តិ**។
   - មានប្រព័ន្ធ Auto Compression លើ Browser ជួយបង្រួមរូបភាពឱ្យនៅស្រាល ច្បាស់ និង Upload ចូល Google Sheets លឿនបំផុត។
   - មាន Effect អបអរសាទរ (Confetti Animation) និង Alert Toast នៅពេលចុះឈ្មោះជោគជ័យ។

3. **ការទាញយកទិន្នន័យ Dynamic ពី Google Sheets (Live Dynamic Sync)**:
   - **ទិន្នន័យសិស្សទាំងអស់ត្រូវបានទាញផ្ទាល់ពី Google Sheet** តាមរយៈ Google Apps Script Web App API (`doGet?action=getStudents`)។
   - មានមុខងារ Auto-Sync ធ្វើបច្ចុប្បន្នភាពទិន្នន័យស្វ័យប្រវត្តិក្នង Background រៀងរាល់ ៦០ វិនាទី។
   - មានប៊ូតុង **"Sync"** ផ្ទាល់លើ Header ដើម្បីទាញទិន្នន័យថ្មីពី Google Sheets ដោយចុចតែម្តង (1-Click Real-time Refresh)។

3. **តារាងទិន្នន័យ និងការស្វែងរក (Data Viewer & Directory)**:
   - ស្វែងរកទិន្នន័យរហ័ស (Live Instant Search) តាមឈ្មោះ អត្តលេខ ឬលេខទូរស័ព្ទ។
   - តម្រងស្វែងរកកម្រិតខ្ពស់ (Filter by Grade, Gender, Shift, Status)។
   - តម្រៀបទិន្នន័យ (Sorting) តាមអត្តលេខ ឈ្មោះ ថ្នាក់ និងកាលបរិច្ឆេទ។
   - បែងចែកទំព័រ (Pagination) និងជ្រើសរើសចំនួនជួរក្នុងមួយទំព័រ (5, 10, 20, 50)។
   - **បោះពុម្ពកាតសិស្ស (Print Student ID Card)** ដែលមានរចនាបថស្រស់ស្អាតដូចកាតសិស្សពិតប្រាកដ។
   - **ទាញយកជា Excel/CSV (Export to CSV)** និងបោះពុម្ពរបាយការណ៍តារាង (Print Report)។

4. **ការរចនាប្រកបដោយគុណភាពខ្ពស់ (Modern Aesthetics)**:
   - គាំទ្រពុម្ពអក្សរខ្មែរទំនើប `Kantumruy Pro` និង `Plus Jakarta Sans`។
   - ប្តូរពណ៌ផ្ទៃ **Dark Mode** និង **Light Mode** ដោយរលូន និងចងចាំការកំណត់។
   - Glassmorphism, Gradient Glow, Responsive លើទូរស័ព្ទដៃ Tablet និងកុំព្យូទ័រ។

---

## 📁 រចនាសម្ព័ន្ធកូដស្តង់ដារ (Modular Architecture)

កូដត្រូវបានបំបែកជាផ្នែកៗយ៉ាងមានរបៀបរៀបរយ៖

```
masterSchool/
│
├── index.html                    # Single App Shell (ក្រោម 60 ជួរ ស្អាត និងស្រាលបំផុត)
├── README.md                     # សៀវភៅណែនាំ
│
├── css/                          # ផ្នែករចនា (Modular Stylesheets)
│   ├── variables.css             # Color tokens, Themes (Light/Dark), Fonts
│   ├── layout.css                # App Shell, Sidebar, Header, Responsive Rules
│   ├── components.css            # Cards, Buttons, Form Inputs, Data Table, Badges
│   ├── idcard.css                # Student ID Card Layout & Print CSS
│   └── style.css                 # Master Style Importer
│
├── js/                           # ផ្នែកតក្កវិជ្ជា និងទិន្នន័យ (Modular JavaScript)
│   ├── config.js                 # Configuration, Constants, Grade & Shift options
│   ├── data.js                   # Realistic Khmer Demo Dataset
│   ├── api.js                    # Google Sheets Web App API & LocalStorage Service
│   ├── charts.js                 # Chart.js Visualizations
│   ├── app.js                    # Application Orchestrator & State Manager
│   │
│   ├── components/               # UI Components
│   │   ├── sidebar.js            # Sidebar navigation component
│   │   ├── header.js             # Top header bar, theme toggle, cloud status
│   │   └── modals.js             # Modals (ID Card preview, Edit, Delete dialog)
│   │
│   └── views/                    # Application Views (Screens)
│       ├── dashboard.js          # Dashboard View (KPI cards, charts, recents)
│       ├── register.js           # Student Enrollment Form View
│       ├── directory.js          # Student Directory & Data Table View
│       └── settings.js           # Google Sheets Connection & URL Settings View
│
└── google-apps-script/
    └── Code.gs                   # Backend Google Apps Script API សម្រាប់ Google Sheets
```

---

## 🚀 របៀបបើកដំណើរការ (How to Run)

លោកអ្នកអាចបើកដំណើរការកម្មវិធីតាម ២ របៀបយ៉ាងងាយស្រួល៖

### វិធីទី១៖ បើកផ្ទាល់ (Direct Browser)
- គ្រាន់តែ **Double click លើឯកសារ `index.html`** លើ Browser ណាមួយ (Chrome, Edge, Firefox) ដើម្បីដំណើរការភ្លាមៗដោយមិនបាច់ដំឡើងអ្វីទាំងអស់!

### វិធីទី២៖ ដំណើរការតាម Local Web Server (1-Click Local Server)
- គ្រាន់តែ **Double click លើឯកសារ `Start-Server.bat`**
- ប្រព័ន្ធនឹងបើក Web Server នៅលើ `http://localhost:8080/` និងបើក Browser ជូនលោកអ្នកដោយស្វ័យប្រវត្តិ (គ្មានបញ្ហា Security Origin ឬ CORS ឡើយ)។

---

## 📊 របៀបភ្ជាប់ជាមួយ Google Sheets (Step-by-Step Setup)

1. ចូលទៅកាន់ [Google Sheets](https://sheets.new) រួចបង្កើត Google Sheet ថ្មីមួយ។
2. នៅលើ Menu ខាងលើ ចុចលើ **Extensions** (ផ្នែកបន្ថែម) ➔ **Apps Script**។
3. បើកឯកសារ `google-apps-script/Code.gs` រួច **Copy កូដទាំងអស់** យកទៅ Paste ជំនួសកូដទាំងអស់ក្នុង Apps Script Editor។
4. នៅផ្នែកខាងលើនៃ Apps Script ចុចជ្រើសរើសមុខងារ **setupDatabase** រួចចុចប៊ូតុង **Run** (រត់) ដើម្បីបង្កើត Header ស្វ័យប្រវត្តិ។
5. ចុចប៊ូតុង **Deploy** (ដាក់ឱ្យប្រើប្រាស់) ➔ ជ្រើសរើស **New deployment**៖
   - ប្រភេទ (Type): **Web app**
   - Execute as: **Me** (គណនីរបស់អ្នក)
   - Who has access: **Anyone** (អ្នកណាក៏បាន)
6. ចុច **Deploy** រួច Copy យក **Web app URL**។
7. ត្រឡប់មកកាន់ Web App ➔ ចូលទៅកាន់ម៉ឺនុយ **ភ្ជាប់ Google Sheets (Settings)** ➔ បិទភ្ជាប់ Web App URL នោះចូលក្នុងប្រអប់ រួចចុច **រក្សាទុក URL**។
