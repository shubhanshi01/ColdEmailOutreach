const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "database.json");

class PipelineRuns {

  static getData() {
    return JSON.parse(
      fs.readFileSync(dbPath, "utf8")
    );
  }

  static saveData(data) {
    fs.writeFileSync(
      dbPath,
      JSON.stringify(data, null, 2)
    );
  }

  static async create(data) {

    const db = this.getData();

    // Clear previous runs
    db.pipelineRuns = [];

    db.pipelineRuns.push(data);

    this.saveData(db);

    return data;
  }

  static async find() {
    return this.getData().pipelineRuns;
  }

  static async clear() {
  const db = this.getData();

  db.pipelineRuns = [];

  this.saveData(db);
}
}

module.exports = PipelineRuns;