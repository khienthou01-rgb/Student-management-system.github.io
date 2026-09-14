/**
 * Service: Telegram Bot Notifications (ការជូនដំណឹងស្វ័យប្រវត្តិតាម Telegram Bot)
 */
const TelegramService = {
  getConfig() {
    try {
      const saved = localStorage.getItem(APP_CONFIG.STORAGE_KEY_TELEGRAM);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure defaults from APP_CONFIG if not set
        if (!parsed.botToken || parsed.botToken.trim() === "") {
          parsed.botToken = APP_CONFIG.telegramConfig.botToken;
          parsed.enabled = true;
        }
        if (parsed.notifyNewStudent === undefined) {
          parsed.notifyNewStudent = true;
        }
        return parsed;
      }
    } catch (e) {}
    return { ...APP_CONFIG.telegramConfig };
  },

  saveConfig(config) {
    localStorage.setItem(APP_CONFIG.STORAGE_KEY_TELEGRAM, JSON.stringify(config));
    if (typeof StudentAPI !== "undefined" && StudentAPI.isCloudConnected()) {
      try {
        firebase.database().ref("settings/telegram").set(config);
      } catch (e) {}
    }
  },

  async autoDetectChatId() {
    const config = this.getConfig();
    const token = (config.botToken || APP_CONFIG.telegramConfig.botToken || "").trim();
    if (!token) {
      throw new Error("សូមបញ្ចូល Telegram Bot Token ជាមុនសិន!");
    }

    try {
      const url = `https://api.telegram.org/bot${token}/getUpdates?offset=-10`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data.ok) {
        throw new Error("Telegram API Error: " + (data.description || "មិនអាចទាញយក updates បានទេ"));
      }

      const updates = data.result || [];
      if (updates.length === 0) {
        throw new Error("មិនទាន់មានសារចូល Bot ឡើយ! សូមបើក Telegram ហើយចុច /start លើ @" + (config.botUsername || "my_master_kh_bot") + " ឬផ្ញើសារណាមួយទៅកាន់ Bot រួចចុចប៊ូតុងនេះម្តងទៀត។");
      }

      // Find latest message with chat ID
      let foundChat = null;
      for (let i = updates.length - 1; i >= 0; i--) {
        const u = updates[i];
        const msg = u.message || u.channel_post || u.my_chat_member || u.edited_message;
        if (msg && msg.chat && msg.chat.id) {
          foundChat = msg.chat;
          break;
        }
      }

      if (!foundChat || !foundChat.id) {
        throw new Error("រកមិនឃើញ Chat ID ឡើយ! សូមចុច /start ក្នុង Bot ហើយសាកល្បងម្តងទៀត។");
      }

      const chatIdStr = String(foundChat.id);
      config.chatId = chatIdStr;
      config.enabled = true;
      this.saveConfig(config);

      return {
        chatId: chatIdStr,
        chatTitle: foundChat.title || foundChat.first_name || foundChat.username || "Chat",
        type: foundChat.type
      };
    } catch (err) {
      throw err;
    }
  },

  async sendMessage(text, customToken = null, customChatId = null) {
    const config = this.getConfig();
    const token = (customToken || config.botToken || APP_CONFIG.telegramConfig.botToken || "").trim();
    let chatId = (customChatId || config.chatId || "").trim();

    // If chat ID is missing, try auto-detecting once in case user recently messaged the bot
    if (!chatId && token) {
      try {
        const detected = await this.autoDetectChatId();
        if (detected && detected.chatId) {
          chatId = detected.chatId;
        }
      } catch (e) {}
    }

    if (!token || !chatId) {
      console.log("Telegram notification skipped: Bot Token or Chat ID not configured.");
      return false;
    }

    try {
      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: "HTML",
          disable_web_page_preview: true
        })
      });

      const res = await response.json();
      if (!res.ok) {
        console.warn("Telegram API Error:", res.description);
        return false;
      }
      return true;
    } catch (err) {
      console.warn("Telegram network error:", err);
      return false;
    }
  },

  async sendTestMessage(token, chatId) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const text = `
<b>🚀 សាកល្បងការតភ្ជាប់ MasterSchool Telegram Bot</b>
--------------------------------------------
✅ <b>ស្ថានភាព៖</b> បានតភ្ជាប់ជោគជ័យ!
🏫 <b>សាលា៖</b> សាលាអន្តរជាតិ MasterSchool
⏰ <b>ពេលវេលា៖</b> ${time} • ${new Date().toISOString().split('T')[0]}
👨‍🏫 <b>អ្នកគ្រប់គ្រង៖</b> លោកគ្រូ ខៀន ធូ (071 721 0307)
--------------------------------------------
<i>ប្រព័ន្ធនឹងផ្ញើសារជូនដំណឹងស្វ័យប្រវត្តិពេលមានការចុះឈ្មោះសិស្សថ្មី, កត់ត្រាវត្តមាន, បង់ថ្លៃសិក្សា, និងការចេញវិញ្ញាបនបត្រ!</i>
    `.trim();

    return await this.sendMessage(text, token, chatId);
  },

  // 1. Trigger: New Student Enrollment Notification (ចុះឈ្មោះសិស្សថ្មី)
  async notifyNewStudent(student, registeredBy = null) {
    const config = this.getConfig();
    if (!config.enabled || !config.notifyNewStudent) return;

    const teacherName = registeredBy || (typeof AuthService !== "undefined" && AuthService.getCurrentUser() ? AuthService.getCurrentUser().nameKh : "លោកគ្រូ / អ្នកគ្រូ");
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = student.StartDate || new Date().toISOString().split('T')[0];

    const text = `
<b>🎉 ចុះឈ្មោះសិស្សថ្មី - MASTERSCHOOL</b>
--------------------------------------------
👤 <b>ឈ្មោះខ្មែរ៖</b> <b>${student.NameKh}</b>
🔤 <b>ឈ្មោះឡាតាំង៖</b> ${student.NameEn || '—'}
🆔 <b>អត្តលេខ (ID)៖</b> <code>${student.ID}</code>
⚧ <b>ភេទ៖</b> ${student.Gender || '—'}
💻 <b>វគ្គសិក្សា៖</b> <b>${student.Course || 'ថ្នាក់កុំព្យូទ័រ'}</b>
⏰ <b>វេនសិក្សា៖</b> ${student.Shift || '—'}
📞 <b>លេខទូរស័ព្ទ៖</b> ${student.Phone || '—'}
🏠 <b>អាណាព្យាបាល៖</b> ${student.GuardianPhone || '—'}
📍 <b>អាសយដ្ឋាន៖</b> ${student.Address || '—'}
📅 <b>ថ្ងៃចូលរៀន៖</b> ${dateStr}
👨‍🏫 <b>ចុះឈ្មោះដោយ៖</b> <b>${teacherName}</b>
⏱️ <b>ម៉ោងចុះឈ្មោះ៖</b> ${timeStr}
--------------------------------------------
<i>ប្រព័ន្ធគ្រប់គ្រងសិស្ស MasterSchool System</i>
    `.trim();

    await this.sendMessage(text);
  },

  // 2. Trigger: Attendance Recording Notification (កត់ត្រាវត្តមានសិស្ស)
  async notifyAttendance(student, timeStr, dateStr, status = "Present", teacherName = null) {
    const config = this.getConfig();
    if (!config.enabled || !config.notifyAttendance) return;

    const statusKh = status === "Present" ? "មានវត្តមាន (Present) ✓" :
                     (status === "Permission" ? "មានច្បាប់អនុញ្ញាត (Permission) 📋" : "អវត្តមានឥតច្បាប់ (Absent) ❌");
    const statusIcon = status === "Present" ? "✅" : (status === "Permission" ? "📋" : "⚠️");
    const recorder = teacherName || (typeof AuthService !== "undefined" && AuthService.getCurrentUser() ? AuthService.getCurrentUser().nameKh : "ស្កេនកាត / QR Code");

    const text = `
<b>🎓 វត្តមានសិស្ស - MASTERSCHOOL</b>
--------------------------------------------
👤 <b>សិស្ស៖</b> <b>${student.NameKh}</b> (${student.NameEn || ''})
🆔 <b>អត្តលេខ៖</b> <code>${student.ID}</code>
💻 <b>វគ្គសិក្សា៖</b> ${student.Course || 'ថ្នាក់កុំព្យូទ័រ'} (${student.Shift || 'វេន'})
${statusIcon} <b>ស្ថានភាព៖</b> <b>${statusKh}</b>
⏰ <b>ម៉ោងកត់ត្រា៖</b> ${timeStr || new Date().toLocaleTimeString()}
📅 <b>កាលបរិច្ឆេទ៖</b> ${dateStr || new Date().toISOString().split('T')[0]}
👨‍🏫 <b>កត់ត្រាដោយ៖</b> ${recorder}
--------------------------------------------
<i>ប្រព័ន្ធកត់ត្រាវត្តមាន MasterSchool</i>
    `.trim();

    await this.sendMessage(text);
  },

  // 3. Trigger: Tuition Fee Payment Notification
  async notifyPayment(student, fee) {
    const config = this.getConfig();
    if (!config.enabled || !config.notifyPayment) return;

    const text = `
<b>💰 ការបង់ថ្លៃសិក្សា - MASTERSCHOOL</b>
--------------------------------------------
👤 <b>សិស្ស៖</b> <b>${student.NameKh}</b> (${student.NameEn || ''})
🆔 <b>អត្តលេខ៖</b> <code>${student.ID}</code>
💻 <b>វគ្គសិក្សា៖</b> ${fee.course || student.Course || 'Typing'}
💵 <b>ចំនួនទឹកប្រាក់៖</b> <b>$${fee.paidAmount || 50}</b> (បង់គ្រប់ចំនួន)
🧾 <b>លេខវិក្កយបត្រ៖</b> <code>${fee.receiptNo || 'INV-2026-001'}</code>
💳 <b>វិធីសាស្ត្រទូទាត់៖</b> ${fee.paymentMethod || 'ABA KHQR'}
📅 <b>កាលបរិច្ឆេទ៖</b> ${fee.date || new Date().toISOString().split('T')[0]}
✅ <b>ស្ថានភាព៖</b> បានបង់រួចរាល់ (Paid) ✓
--------------------------------------------
<i>មជ្ឈមណ្ឌលបណ្តុះបណ្តាលកុំព្យូទ័ររដ្ឋបាល MasterSchool</i>
    `.trim();

    await this.sendMessage(text);
  },

  // 4. Trigger: Exam Passed Notification
  async notifyExamPassed(student, courseName, score, grade) {
    const config = this.getConfig();
    if (!config.enabled || !config.notifyExam) return;

    const text = `
<b>🏆 លទ្ធផលប្រឡងបញ្ចប់វគ្គ - MASTERSCHOOL</b>
--------------------------------------------
👤 <b>សិស្ស៖</b> <b>${student.NameKh}</b> (${student.NameEn || ''})
🆔 <b>អត្តលេខ៖</b> <code>${student.ID}</code>
💻 <b>វិញ្ញាសា៖</b> ${courseName}
📊 <b>ពិន្ទុទទួលបាន៖</b> <b>${score}/100</b>
🎖️ <b>និទ្ទេស៖</b> Grade <b>${grade}</b>
🎉 <b>លទ្ធផល៖</b> ជាប់ជាស្ថាពរ (PASSED) ✓
--------------------------------------------
<i>អបអរសាទរការបញ្ចប់វគ្គដោយជោគជ័យ!</i>
    `.trim();

    await this.sendMessage(text);
  },

  // 5. Trigger: Certificate Issued Notification
  async notifyCertificateIssued(student, cert) {
    const config = this.getConfig();
    if (!config.enabled || !config.notifyCertificate) return;

    const text = `
<b>🎓 វិញ្ញាបនបត្របញ្ចប់ការសិក្សាឌីជីថល</b>
--------------------------------------------
👤 <b>សិស្ស៖</b> <b>${student.NameKh}</b> (${student.NameEn || ''})
🆔 <b>អត្តលេខ៖</b> <code>${student.ID}</code>
📜 <b>លេខវិញ្ញាបនបត្រ៖</b> <code>${cert.certId}</code>
🎖️ <b>និទ្ទេសកិត្តិយស៖</b> Grade <b>${cert.gpa}</b> (ពិន្ទុមធ្យម ${cert.overallScore}%)
📅 <b>កាលបរិច្ឆេទចេញ៖</b> ${cert.issueDate}
👨‍🏫 <b>នាយកមជ្ឈមណ្ឌល៖</b> លោកគ្រូ ខៀន ធូ
--------------------------------------------
<i>វិញ្ញាបនបត្រមានសុពលភាពជាផ្លូវការ និងមាន Verification QR Code</i>
    `.trim();

    await this.sendMessage(text);
  },

  // 6. Trigger: Leave Request Alert
  async sendLeaveRequestAlert(leaveReq) {
    const config = this.getConfig();
    if (!config.enabled || !config.notifyLeaveRequest) return;

    const text = `
<b>📝 សំណើសុំច្បាប់អវត្តមានថ្មី - MASTERSCHOOL</b>
--------------------------------------------
👤 <b>សិស្ស៖</b> <b>${leaveReq.studentNameKh}</b>
🆔 <b>អត្តលេខ៖</b> <code>${leaveReq.studentId}</code>
📅 <b>កាលបរិច្ឆេទសុំឈប់៖</b> ${leaveReq.startDate} ដល់ ${leaveReq.endDate}
💬 <b>មូលហេតុ៖</b> ${leaveReq.reason}
📞 <b>លេខទូរស័ព្ទ៖</b> ${leaveReq.phone || '—'}
⏰ <b>ពេលស្នើសុំ៖</b> ${new Date(leaveReq.createdAt).toLocaleString('km-KH')}
--------------------------------------------
<i>សូមលោកគ្រូចូលប្រព័ន្ធ MasterSchool ដើម្បីពិនិត្យ និងយល់ព្រម (Approve)</i>
    `.trim();

    await this.sendMessage(text);
  },

  // 7. Trigger: Leave Status Alert
  async sendLeaveStatusAlert(leaveReq) {
    const config = this.getConfig();
    if (!config.enabled) return;

    const isApproved = leaveReq.status === "approved";
    const text = `
<b>${isApproved ? '✅ ច្បាប់អវត្តមានត្រូវបានយល់ព្រម' : '❌ ច្បាប់អវត្តមានត្រូវបានបដិសេធ'}</b>
--------------------------------------------
👤 <b>សិស្ស៖</b> <b>${leaveReq.studentNameKh}</b> (<code>${leaveReq.studentId}</code>)
📅 <b>កាលបរិច្ឆេទ៖</b> ${leaveReq.startDate} ដល់ ${leaveReq.endDate}
👨‍🏫 <b>អនុម័តដោយ៖</b> ${leaveReq.approvedBy || 'លោកគ្រូ ខៀន ធូ'}
📊 <b>ស្ថានភាព៖</b> ${isApproved ? 'យល់ព្រម (Approved) ✓' : 'បដិសេធ (Rejected)'}
--------------------------------------------
<i>ប្រព័ន្ធបានកត់ត្រាវត្តមានជាស្វ័យប្រវត្តិក្នុង MasterSchool</i>
    `.trim();

    await this.sendMessage(text);
  }
};
