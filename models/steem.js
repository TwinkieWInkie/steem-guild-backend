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
	username: { type: String, unique: false },
    syncWith: { type: Types.Relationship, ref: 'Group', many: true},
    resteem: Boolean,
    wif: String
});

// Provide access to Keystone

Steem.defaultColumns = 'username, syncWith, resteem';
/**
 * Registration
 */
Steem.register();
