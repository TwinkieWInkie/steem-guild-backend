var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var Steem = new keystone.List('steem', {
	label: 'Member Keys'
});

Steem.add({
	username: { type: String, unique: true },
    	syncWith: { type: Types.Relationship, ref: 'Group', many: true},
    	resteem: Boolean,
	email: { type: Types.Email, unique: true },
	password: { type: Types.Password },
    	wif: String,
	claimed: { type: Boolean, default: false }
});

// Provide access to Keystone

Steem.defaultColumns = 'username, syncWith, resteem';
/**
 * Registration
 */
Steem.register();
