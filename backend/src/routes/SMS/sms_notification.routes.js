const express = require('express');
const router = express.Router();
const SmsController = require('../../controllers/sms/sms.controller');

router.get('/logs', SmsController.getLogs);
router.get('/pwd-list', SmsController.getPwdList);
router.post('/send', SmsController.sendSms);
router.post('/send-all', SmsController.sendAllSms);
router.post('/retry/:id', SmsController.retrySms);

module.exports = router;