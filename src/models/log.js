class ActivityLog {
  constructor() {
    this.logs = [];
  }

  addLog(log) {
    let time = new Date().toLocaleTimeString();
    this.logs.unshift({ log, time });
  }

  getLogs() {
    return this.logs;
  }
}

module.exports = ActivityLog;
