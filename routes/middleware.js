/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
var _ = require('lodash'),
    keystone = require('keystone')

/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
	res.locals.navLinks = [
		{ label: 'Home', key: 'home', href: '/' },
	];
	res.locals.user = req.user;
	next();
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
	next();
};

/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};


/*
Authenticates the user and supplies the following functions in the sequence with the user and groups.
Adds enabled boolean to group for ease of use in frontend.

Will become available as req.res.locals.(user/group)

 */
exports.requireAuth = function (req, res, next = function(){}) {
	const data = req.body
	keystone.list('steem').model.findOne({ email: data.email }, (err, user) => {
		if (err) {
			return res.send(false)
		}

		if ( user !== null ) {
			user._.password.compare(data.password, (passErr, isMatch) => {
				if (!err && isMatch) {
					
					res.locals.user = user

					keystone.list('Group').model.find({ enabled: true }).lean().exec((err, groups) => {
						res.locals.groups = addEnabledToGroups(groups, user.syncWith )

						next()
					})

				} else {
					res.send(false)
				}
			})
		} else
			res.send(false)
	})
}

function addEnabledToGroups(groups, enabledGroups) {
	return groups.map((i) => {
		i.userEnabled = enabledGroups.includes( String(i._id) )
		return i
	})
}

exports.requireKey = function (req, res, next) {
    
};

exports.resetKey = function(req, res, next) {

};
