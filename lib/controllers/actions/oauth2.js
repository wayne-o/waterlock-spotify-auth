'use strict';
var _ = require('lodash');

function getConfig() {
	var found = null;
	_.forEach(sails.config.waterlock.authMethod, function(method) {
		if (method.name === 'waterlock-spotify-auth') {
			found = method;
		}
	});
	return found;
}

module.exports = function(req, res) {
	var params = req.params.all();

	this.spotify.tokenExchange(params.code, accessTokenResponse);

	function accessTokenResponse(error, result) {
		if (error || typeof result === 'undefined') {
			if (error.status) {
				return res.status(error.status)
					.json(error);
			} else {
				return res.serverError(error);
			}
		}

		var attr = {
			email: result.body.email,
			thirdPartyId: result.body.id,
			username:result.body.id,
			accessToken: result.body.access_token,
			refreshToken: result.body.refresh_token,
			serializedData: JSON.stringify(result.body)
		};

		var c = getConfig();
		var fieldMap = c.fieldMap || {};
		_.each(fieldMap, function(val, key) {
				if (!_.isUndefined(result.body[val])) {
					attr[key] = result.body[val];
				}
		});

		if (req.session.authenticated) {
			attr['user'] = req.session.user.id;
			waterlock.engine.attachAuthToUser(attr, req.session.user, userFound);
		} else {
			waterlock.engine.findOrCreateAuth({email: attr.email, provider: 'spotify'}, attr, userFound);
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
