# brettle:workaround-issue-4862

[![Build Status](https://travis-ci.org/brettle/meteor-accounts-workaround-issue-4862.svg?branch=master)](https://travis-ci.org/brettle/meteor-accounts-workaround-issue-4862)

Workaround [Meteor issue #4862](https://github.com/meteor/meteor/issues/4862) so
that `Meteor.user()` and `Meteor.userId()` work in callbacks registered with
`Accounts.onLogin()` and `Accounts.onLoginFailure()` on the server.

## Installation

```sh
meteor add brettle:workaround-issue-4862
```

## Usage

Just install it and it should work.

## How it Works

It monkey patches `Accounts.onLogin()` and `Accounts.onLoginFailure()` so that
during registration `Meteor.bindEnvironment()` is monkey patched to not bind
the registering environment to the callback. This ensures that callback will run
in the environment of the login method invocation.
