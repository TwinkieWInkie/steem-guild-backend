var keystone = require('keystone');
var Types = keystone.Field.Types;
var steem = require('steem');

/**
 * User Model
 * ==========
 */
var post = new keystone.List('Post', {
	defaultSort: 'done'
});

post.add({
    author: { initial: true, type: String },
    permlink: { initial: true, type: String, unique: true, index: true },
	group: { type: Types.Relationship, ref: 'Group', many: false },
	downvote: { type: Boolean, initial: true },
	done: { type: Boolean, default: false, index: true },
});

// Provide access to Keystone

post.schema.post('save', function() {
	if ( ! this.done ) {
		console.log(typeof global.vote)
		this.done = true
        this.save()

		setTimeout(() => new global.vote(this), 0)
	}
})

/**
 * Registration
 */

post.defaultColumns = 'author, permlink, done';

post.register();
