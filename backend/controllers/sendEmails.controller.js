const brevoService = require("../services/brevo.service");
const PipelineRuns = require("../fallback/PipelineRuns");

/**
 * FINAL STEP → send emails after approval
 */
const sendEmails = async (req, res) => {
  try {
    const { runId } = req.body;

    if (!runId) {
      return res.status(400).json({
        success: false,
        message: "runId required"
      });
    }

    const run = await PipelineRuns.findById(runId);

    if (!run || !run.outreachPreview?.length) {
      return res.status(400).json({
        success: false,
        message: "No emails found"
      });
    }

    console.log("📨 Sending emails...");

    const results = [];

    for (const email of run.outreachPreview) {
      try {
        const result = await brevoService.sendEmail({
          to: email.to,
          subject: email.subject,
          htmlContent: email.htmlContent
        });

        results.push({ to: email.to, status: "sent" });

        await new Promise((r) => setTimeout(r, 300)); // rate limit safe

      } catch (err) {
        results.push({
          to: email.to,
          status: "failed",
          error: err.message
        });
      }
    }

    run.status = "sent";
    run.emailsSent = results.filter(r => r.status === "sent").length;
    run.sentResults = results;

    await run.save();

    return res.json({
      success: true,
      message: "Emails sent successfully",
      results
    });

  } catch (error) {
    console.error("Send Emails Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { sendEmails };