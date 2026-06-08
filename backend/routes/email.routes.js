const express = require("express");
const router = express.Router();

const { sendEmails } = require("../controllers/sendEmails.controller");

router.post("/send", sendEmails);

module.exports = router;