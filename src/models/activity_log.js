class ActivityLog {
  constructor(DateProvider) {
    this.logs = [];
    this.DateProvider = DateProvider;
  }

  addLog(log,eventName) {
    let timeStamp = new this.DateProvider();
    this.logs.unshift({ log, timeStamp,eventName });
  }

  getLogs() {
    return this.logs;
  }
}

module.exports = ActivityLog;
