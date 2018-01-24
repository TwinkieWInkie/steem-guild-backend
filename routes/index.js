/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);
var restful = require('restful-keystone')(keystone);
var ObjectID = require('mongoose').Types.ObjectId

const login = require('./api/login')

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.get('/', routes.views.index);

	app.post('/api/login', middleware.requireAuth, respondWithLocals)
	
	app.post('/api/changePassword', middleware.requireAuth, (req, res) => {
		keystone.list('steem').model.findOne({ _id: req.res.locals.user._id }).exec( (err, doc) => {
			user.password = req.body.changeTo
			
			user.save()
			res.send('true')
		})
	})

	app.post('/api/changeKey', middleware.requireAuth, (req, res) => {
		keystone.list('steem').model.findOne({ _id: req.res.locals.user._id }).exec( (err, doc) => {
			user.wif = req.body.changeTo
			
			user.save()
			res.send('true')
		})
	})

	app.post('/api/changeKey', middleware.requireAuth, (req, res) => {
		keystone.list('steem').model.findOne({ _id: req.res.locals.user._id }).exec( (err, doc) => {
			user.resteem = req.body.changeTo

			user.save()
			res.send('true')
		})
	})
	
	app.post('/api/claim', (req, res) => {
		const data = req.body
		
		keystone.list('steem').model.findOne( {username: data.username} )
			.exec( (err, doc) => {
				if (err)
					return res.send(false)
				console.log(doc)

				if (typeof doc.claimed !== 'undefined' || doc.claimed !== null || doc.claimed !== false) {
					doc.email = data.email
					doc.password = data.password
					doc.wif = data.wif
					doc.claimed = true

					doc.save()
					res.send(true)
				}
				res.send(false)
			})
	})
	
	app.post('/api/user/groups', middleware.requireAuth, (req, res, next) => {
		const data = req.body
		const user = req.res.locals.user

		syncWith = user.syncWith.map((x) => {
			return String(x)
		})
		
		if ( syncWith.includes( data.group )) {
			console.log('play splice')

			var index = syncWith.indexOf(data.group);
			if (index !== -1)
				syncWith.splice(index, 1)
			
		} else {
			console.log('play nice')
			syncWith.push( data.group )
		}
		
		user.syncWith = syncWith.map( (x) => {
			return ObjectID(x)
		})
		user.save((err, doc) => console.log(err, doc))
		next()
	}, respondWithLocals)
	
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
    restful.expose({
        steem: {
            methods: ['create', 'update']
        },
        Group: {
            methods: ['list']
        }
    }).start();
	
    
};

function respondWithLocals (req, res) {
	// req.res.locals.user.password = null;
	// req.res.locals.user.wif = null;
	keystone.list('steem').model.findOne({ _id: req.res.locals.user._id }).lean().exec( (err, user) => {
		keystone.list('groups').model.find().lean().exec( (err, groups) => {

			delete user.password
			delete user.wif
			delete user._id

			const Groups = addEnabledToGroups( groups, user.syncWith )
			console.log(Groups)
			const response = {
				user: user,
				groups: Groups
			}
			res.send(response)
		})
	})
}

function addEnabledToGroups(groups, enabledGroups) {
	//enabledGroups = enabledGroups.map( x => String(x) )
	console.log(enabledGroups)
	
	enabledGroups = enabledGroups.map( (x) => {
		return String(x)
	})
	
	return groups.map((i) => {
		console.log( enabledGroups.includes( String(i._id) ))
		i.userEnabled = enabledGroups.includes( String(i._id) )
		return i
	})
}

function removeA(arr) {
	var what, a = arguments, L = a.length, ax;
	while (L > 1 && arr.length) {
		what = a[--L];
		while ((ax= arr.indexOf(what)) !== -1) {
			arr.splice(ax, 1);
		}
	}
	return arr;
}

Array.prototype.indexOf || (Array.prototype.indexOf = function(d, e) {
	var a;
	if (null == this) throw new TypeError('"this" is null or not defined');
	var c = Object(this),
		b = c.length >>> 0;
	if (0 === b) return -1;
	a = +e || 0;
	Infinity === Math.abs(a) && (a = 0);
	if (a >= b) return -1;
	for (a = Math.max(0 <= a ? a : b - Math.abs(a), 0); a < b;) {
		if (a in c && c[a] === d) return a;
		a++
	}
	return -1
});
