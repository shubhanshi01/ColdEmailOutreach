const express = require("express");
const router = express.Router();
const { streamLogs } = require("../controllers/log.controllers");

router.get("/logs", streamLogs);

module.exports = router;