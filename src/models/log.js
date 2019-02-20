class ActivityLog {
  constructor() {
    this.logs = [];
  }

  addLog(log) {
    this.logs.push(log);
  }

  getLogs() {
    return this.logs;
  }
}

module.exports = { ActivityLog };
