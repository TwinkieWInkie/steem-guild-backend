var keystone = require('keystone');
var Types = keystone.Field.Types;
var steem = require('steem');
var slug = require('slug');

/**
 * User Model
 * ==========
 */
var comment = new keystone.List('Comment', {
	defaultSort: 'done'
});

comment.add({
	title: { type: String, initial: true },
	body: { type: Types.Textarea, initial: true },
	parentAuthor: { type: String, initial: true },
    parentPermlink: { type: String, initial: true },
	done: { type: Boolean, default: false, index: true }
});


comment.schema.virtual('permlink').get( function () {
	return slug( this.title );
});
// Provide access to Keystone

/**
 * Registration
 */

comment.defaultColumns = 'author, permlink, downvote, done';

comment.register();
