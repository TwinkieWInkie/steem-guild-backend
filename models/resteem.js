var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var resteem = new keystone.List('resteem', {
	defaultSort: 'done'
});

resteem.add({
	author: String,
	permlink: String,
	done: { type: Boolean, default: false, index: true }
});

resteem.schema.pre('save', function(next) {
	if ( ! this.done ) {
		global.resteem(this)
			
		this.done = true
	}

	next()
})

// Provide access to Keystone


resteem.defaultColumns = 'author, permlink, done';

/**
 * Registration
 */
resteem.register();
