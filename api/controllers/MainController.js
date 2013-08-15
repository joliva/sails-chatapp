/**
 * MainController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

var MainController = {
	index: function(req, res) {
		res.view();
	},

	signup: function (req, res) {
			var username = req.param("username");
			var password = req.param("password");
			 
			Users.findByUsername(username).done(function(err, usr) {
				if (err) {
					res.set({ error: "DB Error" });
					res.send(500);
				} else if (usr.length > 0) {
					res.set({error: "Username already Taken"});
					res.send(400);
				} else {
					var hasher = require("password-hash");
					password = hasher.generate(password);
					 
					Users.create({username: username, password: password}).done(function(error, user) {
					if (error) {
						res.set({error: "DB Error"});
						res.send(500);
					} else {
						req.session.user = user;
						res.send(user);
					}
				});
			}
		});
	},

	login: function (req, res) {
		var username = req.param("username");
		var password = req.param("password");
		 
		Users.findByUsername(username).done(function(err, usr) {
			if (err) {
				res.set({ error: "DB Error" });
				res.send(500);
			} else {
				if (usr.length > 0) {
					var user = usr[0];
					var hasher = require("password-hash");
					if (hasher.verify(password, user.password)) {
						req.session.user = user;
						res.send(user);
					} else {
						res.set({ error: "Wrong Password" });
						res.send(400);
					}
				} else {
					res.set({ error: "User not Found" });
					res.send(404);
				}
			}
		});
	},

	chat: function (req, res) {
		if (req.session.user) {
			res.view({username: req.session.user.username});
		} else {
			res.redirect('/');
		}
	}
};

module.exports = MainController;

