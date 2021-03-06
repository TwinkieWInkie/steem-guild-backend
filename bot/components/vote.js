const keystone = require('keystone')
const forEach = require('async-foreach').forEach

const Group = keystone.list('Group').model
const Users = keystone.list('steem').model

const upvote = require('./actions/upvote')
const downvote = require('./actions/downvote')

module.exports = class {
	constructor (post) {
		Group.find({ _id: post.group }, (err, group) => {
			
			this.group = group
			this.groupId = post.group
			this.post = post
			
			this.execQuery()
		})
	}
	
	execQuery () {
		Users.find(
			this.group.default 
				? { activated: true } 
				: { syncWith: this.groupId, activated: true }, 
			(err, users) => this.execVote(users)
		)
	}
	
	execVote (users) {
		forEach(users, (user) => {
			const keys = [
				user.wif,
				global.steem.auth.toWif(user.username, user.wif, 'posting')	
			]
			// We're trying both the Wif and password due to users sometimes entering their password
			// Haven't found a proper way for steem-key validation
			forEach(keys, (key) => {
				if (this.post.downvote)
					downvote(user.username, key, this.post)
				else
					upvote(user.username, key, this.post)
			})
		})
	}
}
