"use strict";

Package.describe({
  name: 'brettle:workaround-issue-4862',
  version: '0.0.2',
  summary:
    'Workaround Meteor issue 4862 - user/userId broken in server onLogin',
  git: 'https://github.com/brettle/meteor-workaround-issue-4862.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.4');
  api.use('underscore', 'server');
  api.use('accounts-base', 'server');
  api.imply('accounts-base');
  api.addFiles('workaround-issue-4862.js', 'server');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('brettle:accounts-testing-support');
  api.use('brettle:workaround-issue-4862');
  api.addFiles('workaround-issue-4862-tests.js', 'server');
});
