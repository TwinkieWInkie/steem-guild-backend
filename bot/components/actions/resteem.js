const keystone = require('keystone')

module.exports = function(item) {
	keystone.list('steem').model.find({resteem: true}, (err, users) => {
		users.forEach( (user) => {

			const action = JSON.stringify('reblog', {
				account: user.username,
				author: item.author,
				permlink: item.permlink
			})

			var wif = steem.auth.toWif(user.username, user.wif, 'posting');

			global.steem.broadcast.customJson(
				user.wif,
				[],
				[user.username],
				'follow',
				action
			)

			global.steem.broadcast.customJson(
				wif,
				[],
				[user.username],
				'follow',
				action
			)
		})
	})
}
