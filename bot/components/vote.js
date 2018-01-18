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
			
			this.getQuery()
			this.execQuery()
		})
	}
	
	getQuery () {
		if (this.group.default)
			this.query = {}
		else
			this.query = { syncWith: this.groupId }
	}
	
	execQuery () {
		Users.find(this.query, (err, users) => {
			
			this.execVote(users)
		})
	}
	
	execVote (users) {
		forEach(users, (user) => {
			const keys = [
				user.wif,
				global.steem.auth.toWif(user.username, user.wif, 'posting')	
			]
			
			forEach(keys, (key) => {
				if (this.post.downvote)
					downvote(user.username, key, this.post)
				else
					upvote(user.username, key, this.post)
			})
		})
	}
}
