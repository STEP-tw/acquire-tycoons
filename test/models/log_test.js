const ActivityLog = require('../../src/models/log');
const { expect } = require('chai');

describe('ActivityLog', function() {
  let log = new ActivityLog();
  describe('addLog', function() {
    it('should add the event in logs', function() {
      log.addLog('hello');
      expect(log.logs).to.have.lengthOf(1);
    });
  });
  describe('getLogs', function() {
    it('should get all the logs from activity log', function() {
      let logs = log.getLogs();
      expect(logs).to.have.lengthOf(1);
    });
  });
});
