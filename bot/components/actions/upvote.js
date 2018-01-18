const steem = require('steem')

module.exports = function (username, key, post) {
	global.steem.broadcast.vote(key, username, post.author, post.permlink, 10000)
	console.log('Upvoting "' + post.author + '/' + post.permlink + ' with "' + username + '"')
}
