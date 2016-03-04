'use strict';
var SpotifyWebApi = require('spotify-web-api-node');
var crypto = require('crypto');


/**
 * Google OAuth2 object, make various requests
 * the the graphAPI
 * @param {string} clientId     the google app id
 * @param {string} clientSecret the google app secret
 * @param {string} redirectURL  the url google should use as a callback
 * @param {string} config       the google-specific configuration
 * @param {string} allow        the allow list
 */
function SpotifyOAuth2(clientId, clientSecret, redirectURL, config){
  this._clientId = clientId;
  this._clientSecret = clientSecret;
  this._redirectURL = redirectURL;
  this._config = config;
  this._scopes = config.scope;

	console.log('clientId: ' + clientId);
	console.log('redirectURL: ' + redirectURL);

	var spotifyApi = new SpotifyWebApi({
	  redirectUri : this._redirectURL,
	  clientId : this._clientId
	});

	this._spotifyApi = spotifyApi;
}

/**
 * returns the login uri
 * @return {string} login uri
 */
SpotifyOAuth2.prototype.authenticationRequest = function(){
  var csrf = this.getAntiForgeryToken();

	var authorizeURL = this._spotifyApi.createAuthorizeURL(this._scopes, csrf);

	return {
    url: authorizeURL,
    csrf:csrf
  };
};



SpotifyOAuth2.prototype.getAntiForgeryToken = function(){
  return crypto.randomBytes(48).toString('hex');
};

SpotifyOAuth2.prototype.tokenExchange = function(code, done){
	this._spotifyApi.authorizationCodeGrant(code)
	  .then(function(data) {
	    console.log('The token expires in ' + data.body['expires_in']);
	    console.log('The access token is ' + data.body['access_token']);
	    console.log('The refresh token is ' + data.body['refresh_token']);

	    // Set the access token on the API object to use it in later calls
	    this._spotifyApi.setAccessToken(data.body['access_token']);
	    this._spotifyApi.setRefreshToken(data.body['refresh_token']);

			done(null, data.body['access_token']);

	  }, function(err) {
	    console.log('Something went wrong!', err);
			done(err, null);
	  });
};


exports = module.exports = SpotifyOAuth2;
