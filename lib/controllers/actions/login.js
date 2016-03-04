'use strict';

/**
 * Login action
 */
module.exports = function(req, res){
  var request =  this.spotify.createAuthorizeURL();
  res.redirect(request.url);
};
