// ************
//   INCLUDES
// ************

var MongoDB = require("mongodb").Db;
var Server = require("mongodb").Server;
var crypto = require("crypto");
var moment = require("moment");
var entities_ = require("html-entities").XmlEntities;

var entities = new entities_();

// *************
//   VARIABLES
// *************

exports.TEAMNAME_MAX_CHARS = 75;
exports.HASH_LENGTH = 18;
exports.ASCII = /^[\x20-\x7E]+$/;

// *********
//   DATES
// *********

exports.startDate = moment("2015-02-14 09:00:00.000-05:00");
exports.endDate = moment("2015-02-21 21:00:00.000-05:00");

// ************
//   DATABASE
// ************

// REPLACE THE FOLLOWING WITH YOUR DATABASE INFORMATION
exports.db = new MongoDB("ctf", new Server("localhost", 27017, { auto_reconnect: true }), { w: 1 });

// REPLACE THE FOLLOWING WITH YOUR OWN CREDENTIALS
exports.db.open(function(err, database) {
	if (err) {
		console.log("[api/common.js] error connecting to database");
		console.dir(err);
	} else {
		console.log("[api/common.js] connected to database");
		database.authenticate("admin", "password", function(err2, result) {
			if (err2) {
				console.log("[api/common.js] error authenticating to database");
				console.dir(err2);
			} else {
				console.log("[api/common.js] authenticated to database");
			}
		});
	}
});

// ***********
//   ACCOUNT
// ***********

exports.validatePassword = function(plain, hashed) {
	var salt = hashed.substr(0, HASH_LENGTH);
	var valid = salt + exports.hash(plain + salt, "sha256");
	return hashed === valid;
};

exports.generateSalt = function() {
	var set = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";
	var salt = "";
	for(var i=0; i<HASH_LENGTH; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
};

exports.hash = function(str, algo) {
	return crypto.createHash(algo).update(str).digest("hex");
}

exports.encryptPass = function(pass) {
	var salt = exports.generateSalt();
	return salt + exports.hash(pass + salt, "sha256");
}

exports._ = function(str) {
	return entities.encode(str).trim();
};