const ActivityLog = require('../../src/models/activity_log');
const { expect } = require('chai');
const sinon = require('sinon');

describe('ActivityLog', function() {
  const mockedDate = sinon.useFakeTimers().Date;
  let log = new ActivityLog(mockedDate);
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
