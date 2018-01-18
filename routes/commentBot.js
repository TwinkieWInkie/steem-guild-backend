var keystone = require('keystone'),
	steem = require('steem'),
	slug = require('slug');

var users = keystone.list('steem'),
	comments = keystone.list('comment');

exports = module.exports = function () {
	users.model.find({}, function (err, users) {
		console.log(users);
		comments.model.find({ done: false }, function (err, items) {
			items.forEach( function (comment) 
			{
				var user = users[Math.floor(Math.random() * users.length)];
				var wif = steem.auth.toWif(user.username, user.wif, 'posting');
				
				console.log(comment);
				console.log(user.username);
				steem.broadcast.comment(
					wif,
					comment.parentAuthor,
					comment.parentPermlink,
					user.username,
					slug(comment.permlink.toLowerCase()),
					'',
					comment.body,
					{ tags: ['earthnation'] },
					function( err, result ) {

						comment.done = true;
						comment.save();
					}
				);
			});
		})
	})
}
