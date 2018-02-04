const keystone = require('keystone')

module.exports = function(item) {
	keystone.list('steem').model.find({resteem: true}, (err, users) => {
		console.log('resteeming')

		users.forEach( (user) => {
			console.log(users)
console.log('resteeming')
			const action = JSON.stringify(['reblog', {
				account: user.username,
				author: item.author,
				permlink: item.permlink
			}])
console.log(action)
			var wif = steem.auth.toWif(user.username, user.wif, 'posting');

			global.steem.broadcast.customJson(
				user.wif,
				[],
				[user.username],
				'follow',
				action,
				function (err, res) {
					console.log(err)
					console.log(res)
				}
			)

			global.steem.broadcast.customJson(
				wif,
				[],
				[user.username],
				'follow',
				action,
				function (err, res) {
					console.log(err)
					console.log(res)
				}
			)
		})
	})
}
