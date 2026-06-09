const PipelineRuns =
  require("../fallback/PipelineRuns");

const brevoService =
  require("../services/brevo.service");

const sendEmails = async (
  req,
  res
) => {

  try {

    const { runId } = req.body;

    if (!runId) {

      return res.status(400).json({
        success: false,
        message: "runId required"
      });

    }

    const run =
      await PipelineRuns.findById(
        runId
      );

    if (
      !run ||
      !run.outreachPreview ||
      !run.outreachPreview.length
    ) {

      return res.status(400).json({
        success: false,
        message:
          "No emails found"
      });

    }

    console.log(
      "📨 Sending emails..."
    );

    const results = [];

    for (const email of run.outreachPreview) {

      try {

        console.log(
          "EMAIL RECORD:",
          JSON.stringify(
            email,
            null,
            2
          )
        );

        if (!email.email) {

          throw new Error(
            "Missing recipient email"
          );

        }

        const htmlContent =
          email.htmlContent ||
          email.html;

        if (!htmlContent) {

          throw new Error(
            "Missing email content"
          );

        }

        const result =
          await brevoService.sendEmail({
            to: {
              email:
                email.email,
              name:
                email.name ||
                "Prospect"
            },
            subject:
              email.subject,
            htmlContent
          });

        console.log(
          "EMAIL SENT:",
          result
        );

        results.push({
          to: email.email,
          status: "sent"
        });

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              500
            )
        );

      } catch (err) {

        console.error(
          "EMAIL FAILED:",
          err.message
        );

        results.push({
          to: email.email,
          status: "failed",
          error:
            err.message
        });

      }

    }

    await PipelineRuns.updateById(
      runId,
      {
        status: "sent",
        emailsSent:
          results.filter(
            (r) =>
              r.status ===
              "sent"
          ).length,
        sentResults:
          results
      }
    );

    return res.json({
      success: true,
      message:
        "Emails processed",
      results
    });

  } catch (error) {

    console.error(
      "Send Emails Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message
    });

  }

};

module.exports = {
  sendEmails
};