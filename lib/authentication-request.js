'use strict';

var Builder = require('./builder');

var DEFAULT_HOST = 'accounts.spotify.com',
    DEFAULT_PORT = 443,
    DEFAULT_SCHEME = 'https';

module.exports.builder = function() {
  return Builder.withHost(DEFAULT_HOST)
      .withPort(DEFAULT_PORT)
      .withScheme(DEFAULT_SCHEME);
};
