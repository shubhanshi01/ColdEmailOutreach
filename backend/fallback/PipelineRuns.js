const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "database.json");

class PipelineRuns {
  static getData() {
    return JSON.parse(fs.readFileSync(dbPath, "utf8"));
  }

  static saveData(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  }

  static async create(data) {
    const db = this.getData();

    const newRun = {
      _id: Date.now().toString(),
      ...data
    };

    db.pipelineRuns.push(newRun);
    this.saveData(db);

    return newRun;
  }

  static async findById(id) {
    const db = this.getData();
    return db.pipelineRuns.find((r) => r._id === id) || null;
  }

  static async updateById(id, update) {
    const db = this.getData();

    const index = db.pipelineRuns.findIndex((r) => r._id === id);

    if (index === -1) return null;

    db.pipelineRuns[index] = {
      ...db.pipelineRuns[index],
      ...update
    };

    this.saveData(db);

    return db.pipelineRuns[index];
  }
}

module.exports = PipelineRuns;