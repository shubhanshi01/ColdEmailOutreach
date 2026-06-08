const brevoService = require("../services/brevo.service");
const PipelineRuns = require("../fallback/PipelineRuns");

const sendEmails = async (req, res) => {
  try {
    const { runId, outreachPreview } = req.body;

    if (!runId) {
      return res.status(400).json({ success: false, message: "runId is required" });
    }

    if (!outreachPreview?.length) {
      return res.status(400).json({ success: false, message: "No emails to send" });
    }

    const cleanQueue = outreachPreview
      .filter((c) => c.email && c.email.includes("@"))
      .map((c) => ({
        email: c.email,
        name: c.name?.trim() || "There",
        subject: c.subject || "Hello",
        htmlContent: c.htmlContent || c.html || "<p>Hello</p>"  // ✅ accept both keys gracefully
      }));

    const result = await brevoService.sendCampaign(cleanQueue);

    await PipelineRuns.updateById(runId, {
      status: "completed",
      emailsSent: cleanQueue.length,
      brevoResult: result
    });

    return res.json({ success: true, message: "Emails sent successfully", data: result });

  } catch (error) {
    console.error("Send Emails Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { sendEmails };