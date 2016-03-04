'use strict';
var _ = require('lodash');

function getConfig() {
	var found = null;
	_.forEach(sails.config.waterlock.authMethod, function(method) {
		if (method.name === 'waterlock-google-auth') {
			found = method;
		}
	});
	return found;
}

module.exports = function(req, res) {
	var params = req.params.all();

	this.spotify.tokenExchange(params.code, accessTokenResponse);

	function accessTokenResponse(error, result) {
		if (error || typeof result.accessToken === 'undefined') {
			if (error.status) {
				return res.status(error.status)
					.json(error);
			} else {
				return res.serverError(error);
			}
		}

		var attr = {
			spotifyEmail: result.accessToken.id_token.jwt.email
		};

		var c = getConfig();
		var fieldMap = c.fieldMap || {};

		_.each(fieldMap, function(val, key) {
			if (!_.isUndefined(result.me[val])) {
				attr[key] = result.me[val];
			}
		});

		if (req.session.authenticated) {
			attr['user'] = req.session.user.id;
			waterlock.engine.attachAuthToUser(attr, req.session.user, userFound);
		} else {
			waterlock.engine.findOrCreateAuth(attr, attr, userFound);
		}
	}

	function userFound(err, user) {
		if (err) {
			waterlock.logger.debug(err);
			return waterlock.cycle.loginFailure(req, res, null, {
				error: 'trouble creating model'
			});
		}

		waterlock.cycle.loginSuccess(req, res, user);
	}
};
