// Workaround Meteor issue #4862 by registering handlers with
// Meteor.bindEnvironment effectively disabled.

"use strict";
/* globals Accounts */

// If meteor version >= 1.2, this issues is fixed, so do nothing.
if (Accounts._onLoginHook) {
  return;
}

Accounts.validateLoginAttempt = wrapUnbound(Accounts.validateLoginAttempt);
Accounts.onLogin = wrapUnbound(Accounts.onLogin);
Accounts.onLoginFailure = wrapUnbound(Accounts.onLoginFailure);


// Return a function that will run the passed function with
// Meteor.bindEnvironment effectively disabled
function wrapUnbound(func) {
  return function( /* arguments */ ) {
    var self = this;
    var saved = Meteor.bindEnvironment;
    try {
      Meteor.bindEnvironment = dontBindEnvironment;
      return func.apply(self, arguments);
    } finally {
      Meteor.bindEnvironment = saved;
    }
    return;
  };
}

// Copied from Meteor.bindEnvironment and removed all the env stuff.
function dontBindEnvironment(func, onException, _this) {
  if (!onException || typeof(onException) === 'string') {
    var description = onException || "callback of async function";
    onException = function(error) {
      Meteor._debug(
        "Exception in " + description + ":",
        error && error.stack || error
      );
    };
  }

  return function( /* arguments */ ) {
    var args = _.toArray(arguments);

    var runAndHandleExceptions = function() {
      var ret;
      try {
        ret = func.apply(_this, args);
      } catch (e) {
        onException(e);
      }
      return ret;
    };

    return runAndHandleExceptions();
  };
}
