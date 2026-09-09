# ប្រព័ន្ធគ្រប់គ្រងសាលារៀន (School Management System)

ប្រព័ន្ធគ្រប់គ្រងសាលារៀនតាមបែបឌីជីថលពេញលេញ រួមមាន ការគ្រប់គ្រងឆ្នាំសិក្សា ថ្នាក់រៀន សិស្ស គ្រូបង្រៀន មន្ត្រី បង្កើតកាតសិស្ស-គ្រូ (QR Code) ស្កេនវត្តមាន គ្រប់គ្រងថ្លៃសិក្សា ពិន្ទុ របាយការណ៍ និងតារាងកិត្តិយស (Top 5 Podium & Certificates)។

---

## 🚀 របៀបដាក់ដំណើរការទៅកាន់ Vercel (How to Deploy to Vercel)

លោកអ្នកអាចជ្រើសរើសវិធីណាមួយក្នុងចំណោមវិធីខាងក្រោមដើម្បីដាក់ដំណើរការលើ **Vercel**៖

### 🌟 វិធីទី ១៖ ដាក់តាម Vercel Dashboard (ងាយស្រួលបំផុត មិនបាច់ប្រើ Command)
1. ចូលទៅកាន់គេហទំព័រ **[https://vercel.com](https://vercel.com)** រួចចុះឈ្មោះ ឬ Login (តាម GitHub/Email)។
2. ចុចប៊ូតុង **«Add New...»** ➔ **«Project»**។
3. ប្រសិនបើលោកអ្នកបាន Upload កូដនេះទៅ **GitHub** រួចហើយ៖
   - គ្រាន់តែចុច **Import** លើ Repository នោះ។
   - ត្រង់ **Framework Preset** ជ្រើសរើសយក **Other**។
   - ចុច **«Deploy»** ជាការស្រេច!
4. ក្នុងរយៈពេលប្រហែល ១០ វិនាទី Vercel នឹងផ្តល់ Link គេហទំព័រផ្ទាល់ខ្លួនជូនលោកអ្នក (ឧទាហរណ៍៖ `https://your-school-app.vercel.app`)។

---

### 💻 វិធីទី ២៖ ដាក់តាម Command Line (Vercel CLI)
បើក Terminal / PowerShell នៅលើ Folder នេះ (`d:\BUILDING PROGRAM\HorlSM`) រួចវាយបញ្ជា៖

```bash
# ១. ដំណើរការ Deploy ទៅកាន់ Vercel
npx vercel

# ២. ធ្វើតាមការណែនាំលើអេក្រង់៖
# - Set up and deploy? [Y]
# - Which scope? [ជ្រើស Account របស់អ្នក]
# - Link to existing project? [N]
# - Project name? [ដាក់ឈ្មោះតាមចិត្ត ឬចុច Enter]
# - Directory? [ចុច Enter]
# - Want to modify settings? [N]

# ៣. ដាក់ជាផ្លូវការ (Production)
npx vercel --prod
```

---

### 📁 រចនាសម្ព័ន្ធឯកសារសម្រាប់ Vercel (Project Files)
- `index.html` — ឯកសារចម្បងនៃប្រព័ន្ធ (Main Single-Page Web App)
- `vercel.json` — ឯកសារកំណត់ការ Routing និង Headers សម្រាប់ Vercel
- `package.json` — ព័ត៌មានគម្រោង និង Scripts
- `.gitignore` — ការពារឯកសារ Folder មិនចាំបាច់កុំឱ្យ Upload
- `css/` — ឯកសារ Stylesheet បន្ថែម
- `js/` — ឯកសារ JavaScript ជំនួយ

---

## ✨ លក្ខណៈពិសេសចម្បងៗ (Key Features)
* 🎓 **គ្រប់គ្រងសិស្ស គ្រូ និងមន្ត្រី៖** បន្ថែម កែប្រែ លុប និងស្វែងរកទិន្នន័យរហ័ស។
* 🪪 **បង្កើតកាតសម្គាល់ខ្លួន (ID Cards):** បង្កើតកាតសិស្ស និងគ្រូជាស្វ័យប្រវត្តិ ភ្ជាប់ដោយ QR Code ផ្លូវការ។
* 📷 **ស្កេនវត្តមាន Live QR Code:** ស្កេនកត់ត្រាម៉ោងចូល-ចេញភ្លាមៗ មានសំឡេង និងសារជូនដំណឹង Telegram។
* 💰 **គ្រប់គ្រងថ្លៃសិក្សា & ប្រាក់បៀវត្សរ៍៖** ចេញវិក្កយបត្រ តាមដានចំណូល-ចំណាយ និងគណនាប្រាក់ខែគ្រូ។
* 🏆 **តារាងកិត្តិយស (Top 5 Podium):** រចនាបថគំរូ 🥇 លេខ១ 🥈 លេខ២ 🥉 លេខ៣ 🎖️ លេខ៤ 🎖️ លេខ៥ ប្តូររូបថត បោះពុម្ព Poster A4 និងចេញប័ណ្ណសរសើរក្បាច់មាស។
