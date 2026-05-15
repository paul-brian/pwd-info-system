const db = require('../../config/db');

const SmsModel = {

  getLogs: (callback) => {
    db.query(
      'SELECT * FROM sms_notifications ORDER BY sent_date DESC',
      callback
    );
  },

  insert: (data, callback) => {
    const { sender_id, pwd_id, message, sent_to, recipient_name } = data;
    db.query(
      `INSERT INTO sms_notifications 
        (sender_id, pwd_id, message, sent_to, recipient_name, sent_date, status) 
       VALUES (?, ?, ?, ?, ?, NOW(), 'Pending')`,
      [sender_id, pwd_id, message, sent_to, recipient_name],
      callback
    );
  },

  updateStatus: (status, sms_id, callback) => {
    db.query(
      'UPDATE sms_notifications SET status = ? WHERE sms_id = ?',
      [status, sms_id],
      callback
    );
  },

  findById: (sms_id, callback) => {
    db.query(
      'SELECT * FROM sms_notifications WHERE sms_id = ?',
      [sms_id],
      callback
    );
  },

  findPwd: (pwd_id, callback) => {
    db.query(
      'SELECT * FROM pwd_profiles WHERE pwd_id = ?',
      [pwd_id],
      callback
    );
  },

  getAllPwd: (callback) => {
    db.query(
      `SELECT pwd_id, pwd_number, contact_number 
       FROM pwd_profiles 
       WHERE status = 'active'
       ORDER BY pwd_number ASC`,
      callback
    );
  },

};

module.exports = SmsModel;