'use strict';

var SpotifyAuth = require('./spotify-authentication');

module.exports = function(){

  var redirectUrl = '', prefix = '';

  if (sails.config && sails.config.blueprints && sails.config.blueprints.prefix) {
    prefix = sails.config.blueprints.prefix;
  }

  if (this.config.redirectUri) {
    redirectUrl = this.config.redirectUri;
  }else {
    if (sails.config.waterlock.pluralizeEndpoints) {
      redirectUrl = sails.getBaseurl() + prefix + '/auths/spotify_oauth2';
    }
    else {
      redirectUrl = sails.getBaseurl() + prefix + '/auth/spotify_oauth2';
    }
  }

  return new SpotifyAuth(this.config.clientId, this.config.clientSecret, redirectUrl, this.config);
};
