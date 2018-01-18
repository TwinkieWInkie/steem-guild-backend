module.exports = function (username, key, post) {
	global.steem.broadcast.vote(key, username, post.author, post.permlink, -10000)
	console.log('Downvoting "' + post.author + '/' + post.permlink + ' with "' + username + '"')
}
