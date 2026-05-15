const SmsModel = require('../../models/sms/smsModel');
const log = require("../../helper/recentLog/RecentLogHelper")
const { sendSMS } = require('../../services/smsService');
const db = require('../../config/db');

const SmsController = {

  // GET /api/sms/logs
  getLogs: (req, res) => {
    SmsModel.getLogs((err, results) => {
      if (err) {
        console.error('DB error:', err);
        return res.status(500).json({ error: 'Failed to fetch logs' });
      }
      res.json(results);
    });
  },

  // GET /api/sms/pwd-list
  getPwdList: (req, res) => {
    SmsModel.getAllPwd((err, results) => {
      if (err) {
        console.error('DB error:', err);
        return res.status(500).json({ error: 'Failed to fetch PWD list' });
      }
      res.json(results);
    });
  },

  // POST /api/sms/send
  sendSms: (req, res) => {
    const { pwd_id, message } = req.body;

    if (!pwd_id || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    SmsModel.findPwd(pwd_id, (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      if (!rows.length) {
        return res.status(404).json({ error: "PWD member not found" });
      }

      const pwd = rows[0];

      let formattedNumber = (pwd.contact_number || "").replace(/\s+/g, "");
      if (formattedNumber.startsWith("09")) {
        formattedNumber = "+63" + formattedNumber.slice(1);
      } else if (formattedNumber.startsWith("9")) {
        formattedNumber = "+63" + formattedNumber;
      } else if (formattedNumber.startsWith("63")) {
        formattedNumber = "+" + formattedNumber;
      }

      const insertData = {
        sender_id: 1,
        pwd_id: pwd.pwd_id,
        message,
        sent_to: formattedNumber,
        recipient_name: pwd.pwd_number,
        status: "Pending",
      };

      SmsModel.insert(insertData, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Failed to save SMS" });
        }

        const smsId = result.insertId;

        sendSMS(formattedNumber, message)
          .then((sendResult) => {
            const newStatus = sendResult && sendResult.success ? "Sent" : "Failed";

            SmsModel.updateStatus(newStatus, smsId, (err) => {
              if (err) console.error("DB update error:", err);

              // ✅ Auto-create announcement kapag Sent
              if (newStatus === "Sent") {
                // Gamitin ang unang 60 chars ng message bilang title
                const title = message.length > 60
                  ? message.substring(0, 60) + "..."
                  : message;

                db.query(
                  `INSERT INTO announcements (title, message, category, posted_by)
                   VALUES (?, ?, 'General', 1)`,
                  [title, message],
                );
                  log(req.user?.id,`Sent SMS to ${pwd.pwd_number}`,"SMS Notification",`Message: ${message.substring(0, 40)}`);
              }

              SmsModel.findById(smsId, (err, rows) => {
                if (err) return res.status(500).json({ error: "DB error" });
                res.json({
                  success: newStatus === "Sent",
                  log: rows[0],
                });
              });
            });
          })
          .catch((error) => {
            console.error("SMS API ERROR:", error);
            SmsModel.updateStatus("Failed", smsId, () => {
              res.json({ success: false, message: "SMS sending failed" });
            });
          });
      });
    });
  },

  // POST /api/sms/retry/:id
  retrySms: (req, res) => {
    SmsModel.findById(req.params.id, async (err, rows) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      if (rows.length === 0) return res.status(404).json({ error: 'Message not found' });

      const log = rows[0];

      SmsModel.updateStatus('Pending', log.sms_id, async (err) => {
        if (err) return res.status(500).json({ error: 'DB update error' });

        const sendResult = await sendSMS(log.sent_to, log.message);
        const newStatus = sendResult.success ? 'Sent' : 'Failed';

        SmsModel.updateStatus(newStatus, log.sms_id, (err) => {
          if (err) return res.status(500).json({ error: 'DB update error' });

          // ✅ Auto-create announcement kapag Sent sa retry
          if (newStatus === 'Sent') {
            const title = log.message.length > 60
              ? log.message.substring(0, 60) + "..."
              : log.message;

            db.query(
              `INSERT INTO announcements (title, message, category, posted_by)
               VALUES (?, ?, 'General', 1)`,
              [title, log.message],
              (err) => {
                if (err) console.error("Failed to create announcement on retry:", err);
                else console.log("✅ Announcement created from SMS retry");
              }
            );
          }

          SmsModel.findById(log.sms_id, (err, updated) => {
            if (err) return res.status(500).json({ error: 'DB error' });
            res.json({ success: sendResult.success, log: updated[0] });
          });
        });
      });
    });
  },

  // POST /api/sms/send-all
  sendAllSms: (req, res) => {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    SmsModel.getAllPwd((err, pwds) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      if (!pwds.length) {
        return res.json({ success: true, sent: 0, total: 0 });
      }

      let index = 0;
      let sentCount = 0;

      // ✅ recursive sender (callback loop)
      const sendNext = () => {

        // DONE LOOP
        if (index >= pwds.length) {

          const title =
            message.length > 60
              ? message.substring(0, 60) + "..."
              : message;

          // create announcement once
          db.query(
            `INSERT INTO announcements (title, message, category, posted_by)
           VALUES (?, ?, 'General', 1)`,
            [title, message],
            () => {

              // ✅ RECENT LOG (AFTER SUCCESS)
              log(
                req.user?.id,
                `Sent bulk SMS`,
                "SMS Notification",
                `Sent to ${sentCount}/${pwds.length} PWD members`
              );

              return res.json({
                success: true,
                sent: sentCount,
                total: pwds.length,
              });
            }
          );

          return;
        }

        const pwd = pwds[index++];

        // format number
        let formattedNumber = (pwd.contact_number || "").replace(/\s+/g, "");

        if (formattedNumber.startsWith("09")) {
          formattedNumber = "+63" + formattedNumber.slice(1);
        } else if (formattedNumber.startsWith("9")) {
          formattedNumber = "+63" + formattedNumber;
        } else if (formattedNumber.startsWith("63")) {
          formattedNumber = "+" + formattedNumber;
        }

        const insertData = {
          sender_id: 1,
          pwd_id: pwd.pwd_id,
          message,
          sent_to: formattedNumber,
          recipient_name: pwd.pwd_number,
        };

        // insert sms log
        SmsModel.insert(insertData, (err, result) => {
          if (err) {
            console.error("Insert error:", err);
            return setTimeout(sendNext, 300); // skip user
          }

          const smsId = result.insertId;

          // send sms
          sendSMS(formattedNumber, message)
            .then((sendResult) => {

              const status = sendResult.success ? "Sent" : "Failed";
              if (status === "Sent") sentCount++;

              SmsModel.updateStatus(status, smsId, () => {
                setTimeout(sendNext, 300); // next user
              });

            })
            .catch(() => {
              SmsModel.updateStatus("Failed", smsId, () => {
                setTimeout(sendNext, 300); // next user
              });
            });
        });
      };

      // start sending
      setTimeout(sendNext, 300);
    });
  },

};

module.exports = SmsController;