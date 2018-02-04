// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
const keystone = require('keystone');
const steem = require('steem')
// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
    'port': 3000,
	'name': 'SteemPonzi',
	'brand': 'SteemPonzi',

	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'pug',

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
});
steem.api.setOptions({ url: 'https://api.steemit.com' })


const pm2 = require('pm2')

pm2.connect((err) => {
	if (err){
		console.log(err)
		process.exit(2)
	}

	pm2.start({
		script: './transferBot/index.js'
	}, function (err, apps) {
		if (err)
			console.log(err)
	})
})
// Add steem api to globals
global.steem = steem

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});




// Load your project's Routes
keystone.set('routes', require('./routes'));



// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	users: ['users', 'steems'],
	settings: ['groups'],
	bot: ['BotSettings', 'BotCustomers', 'BotPosts', 'BotLists']
});

// Add actions to globals
global.vote = require('./bot/components/vote')
global.resteem = require('./bot/components/actions/resteem')

// Start Keystone to connect to your database and initialise the web server
keystone.start();

// Initialize bot tasks
require('./bot')()
