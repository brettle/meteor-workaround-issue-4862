/* globals Accounts */
"use strict";

Tinytest.add(
  'brettle:workaround-issue-4862 - Workaround meteor bug #4862',
  function (test) {
    var makeTestingCallback = function(cbName) {
      return function () {
        try {
          Meteor.userId();
          Meteor.user();
          test.ok();
        } catch (ex) {
          test.fail('Unexpected exception in ' + cbName + ' callback:' + ex);
        }
        return true;
      };
    };

    var validateLoginStopper = Accounts.validateLoginAttempt(
      makeTestingCallback('validateLoginAttempt'));
    var onLoginStopper = Accounts.onLogin(
      makeTestingCallback('onLogin'));
    var onLoginFailureStopper = Accounts.onLoginFailure(
      makeTestingCallback('onLoginFailure'));

    var connection = DDP.connect(Meteor.absoluteUrl());

    try {
      // Successful login
      Meteor.users.remove({ 'services.test1.name': "testname" });
      connection.call('login', { test1: "testname" });

      // Failing login (bogus service)
      try {
        connection.call('login', { bogusLoginService: "testname" });
      } catch (ex) {
        test.instanceOf(ex, Meteor.Error, 'Unexpected exception');
      }
    } finally {
      validateLoginStopper.stop();
      onLoginStopper.stop();
      onLoginFailureStopper.stop();
    }
  }
);
