var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var Group = new keystone.List('Group', {
	label: 'Group',
	plural: 'Groups',
	map: { name: 'username' },
	autokey: { from: 'username', path: 'key', unique: true }
});

Group.add({
	username: { type: String, initial: true },
    dailyUpvotes: Number,
    default: { type: Boolean, default: false, initial: true },
    enabled: { type: Boolean, default: false, initial: true },
    currentId: Number 
});

Group.relationship({ ref: 'steem', refPath: 'syncWith' })
Group.relationship({ ref: 'Post', path: 'Posts', refPath: 'group'})
// Provide access to Keystone

Group.defaultColumns = 'username, default, dailyUpvotes, enabled';

/**
 * Registration
 */
Group.register();
