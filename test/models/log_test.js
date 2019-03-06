const ActivityLog = require('../../src/models/activity_log');
const { expect } = require('chai');
const sinon = require('sinon');

describe('ActivityLog', function() {
  const mockedDate = sinon.useFakeTimers().Date;
  const log = new ActivityLog(mockedDate);
  describe('addLog', function() {
    it('should add the event and event name in logs', function() {
      log.addLog('hello', 'INTRODUCTION');
      expect(log.logs).to.have.lengthOf(1);
    });
  });
  describe('getLogs', function() {
    it('should get all the logs from activity log', function() {
      const logs = log.getLogs();
      const oneLog = logs[0];
      expect(logs).to.have.lengthOf(1);
      expect(oneLog)
        .to.have.property('log')
        .to.equal('hello');
      expect(oneLog)
        .to.have.property('eventName')
        .to.equal('INTRODUCTION');
      expect(oneLog).to.have.property('timeStamp');
    });
  });
});
