const mongoose = require("mongoose");

const PipelineRunSchema = new mongoose.Schema(
  {
    seedDomain: String,

    companies: [
      {
        companyName: String,
        domain: String,
        contacts: [
          {
            name: String,
            linkedin: String,
            email: String,
            emailSent: Boolean
          }
        ]
      }
    ],

    totalCompanies: Number,

    status: {
      type: String,
      default: "running"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "PipelineRun",
  PipelineRunSchema
);