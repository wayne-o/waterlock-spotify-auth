'use strict';

var spotifyAuth = require('./spotify-authentication');

module.exports = function(){

  var redirectUrl = '', prefix = '';

  if (sails.config && sails.config.blueprints && sails.config.blueprints.prefix) {
    prefix = sails.config.blueprints.prefix;
  }

  if (this.config.redirectUri) {
    redirectUrl = this.config.redirectUri;
  }else {
    if (sails.config.waterlock.pluralizeEndpoints) {
      redirectUrl = sails.getBaseurl() + prefix + '/auths/google_oauth2';
    }
    else {
      redirectUrl = sails.getBaseurl() + prefix + '/auth/google_oauth2';
    }
  }

  spotifyAuth.init(this.config.clientId, this.config.clientSecret, redirectUrl, this.config);

};
