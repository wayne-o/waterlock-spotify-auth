'use strict';

var _ = require('lodash');

module.exports = exports = WaterlockSpotifyAuth;

function WaterlockSpotifyAuth() {
	this.authType = 'spotify';
	this.actions = _.bind(this.actions, this)();
	this.model = _.bind(this.model, this)();
	this.waterlockConfig = _.bind(this.waterlockConfig, this)();
	this.config = _.bind(this.config, this)();
	this.spotify = _.bind(this.spotifyFactory, this)();
}

WaterlockSpotifyAuth.prototype.actions = require('./controllers');

WaterlockSpotifyAuth.prototype.model = require('./models');

WaterlockSpotifyAuth.prototype.config = require('./config');

WaterlockSpotifyAuth.prototype.waterlockConfig = require('./waterlock-config');

WaterlockSpotifyAuth.prototype.spotifyFactory = require('./spotify-factory');
