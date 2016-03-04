'use strict';
var SpotifyWebApi = require('spotify-web-api-node');
var crypto = require('crypto');
var _ = require('lodash');

/**
 * Google OAuth2 object, make various requests
 * the the graphAPI
 * @param {string} clientId     the google app id
 * @param {string} clientSecret the google app secret
 * @param {string} redirectURL  the url google should use as a callback
 * @param {string} config       the google-specific configuration
 * @param {string} allow        the allow list
 */
function SpotifyOAuth2(clientId, clientSecret, redirectURL, config) {
	this._clientId = clientId;
	this._clientSecret = clientSecret;
	this._redirectURL = redirectURL;
	this._config = config;
	this._scopes = config.scope;

	console.log('clientId: ' + clientId);
	console.log('redirectURL: ' + redirectURL);

	var spotifyApi = new SpotifyWebApi({
		redirectUri: this._redirectURL,
		clientId: this._clientId,
		clientSecret: this._clientSecret
	});

	this._spotifyApi = spotifyApi;
}

/**
 * returns the login uri
 * @return {string} login uri
 */
SpotifyOAuth2.prototype.authenticationRequest = function() {
	var csrf = this.getAntiForgeryToken();

	var authorizeURL = this._spotifyApi.createAuthorizeURL(this._scopes, csrf);

	return {
		url: authorizeURL,
		csrf: csrf
	};
};

SpotifyOAuth2.prototype.getAntiForgeryToken = function() {
	return crypto.randomBytes(48)
		.toString('hex');
};

SpotifyOAuth2.prototype.tokenExchange = function(code, done) {

	var _this = this;

	this._spotifyApi.authorizationCodeGrant(code)
		.then(function(data) {
			_this._spotifyApi.setAccessToken(data.body['access_token']);
			_this._spotifyApi.setRefreshToken(data.body['refresh_token']);
			_this._spotifyApi.getMe()
				.then(function(meData) {
					_.merge(meData.body, data.body);
					done(null, meData);

				}, function(err) {
					done(err, null);
				});
		}, function(err) {
			done(err, null);
		});
};


exports = module.exports = SpotifyOAuth2;
