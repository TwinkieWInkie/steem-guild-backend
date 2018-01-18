// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var keystone = require('keystone');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
    'port': 8080,
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

const steem = require('steem')
steem.api.setOptions({ url: 'https://api.steemit.com' })
global.steem = steem


// Load your project's Routes
keystone.set('routes', require('./routes'));

require('./bot')()

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	users: ['users', 'steems'],
	settings: ['groups']
});

// Start Keystone to connect to your database and initialise the web server

global.vote = require('./bot/components/vote')
global.resteem = require('./bot/components/actions/resteem')

keystone.start();
