const keystone = require('keystone')
const ObjectId = require('mongodb').ObjectID
const Post = keystone.list('Post').model
const sortBy = require('array-sort-by')

exports = module.exports = function (app) {

	class steemBot {
		constructor() {
			this.posts = []
			this.groups = []

			this.postQuery = keystone.list('Post').model.where('username').ne('all-users')
			this.groupQuery = keystone.list('Group').model.find()

			setInterval(() => {
				this.getGroups()
			
				if (this.groups.length > 0)
					this.groups.forEach( (group) => this.syncGroup(group))
			}, 300)

		}

		getGroups() {
			this.groupQuery.exec((err, docs) => {
				this.groups = docs
			})
		}

		syncGroup(group) {
			global.steem.api.getAccountVotes(group.username, (err, posts) => {
				if (err || typeof posts == 'undefined')
					return console.log(err); 

                const length = posts.length - 1
                posts = sortBy(posts, (s) => -new Date(s.time) ).reverse()
				if (group.currentId == 0)  {
                    console.log('resetting currentId')
					return this.setCurrentLength(group, length)
                }

				if (group.currentId < length) {
                    console.log('found new post(s)')
                    const group2 = { _id: group._id, username: group.username, currentId: group.currentId }
                    this.setCurrentLength(group, length)
for (var b = posts.length - 5; b <= length; b++) {console.log(posts[b])}
                    for (var i = group.currentId; i <= length; i++) {
                        console.log('looping '+ i)
                        this.createPost(posts[i], group2._id)
                    }

                    console.log('Syncing ' + (posts.length - group.currentId) + ' new posts from: ' + group.username)
                }
			})
			
		}

		setCurrentLength (group, length) {
            console.log('setting currentId of ' + group.username + ' to ' + length)
			group.currentId = length
            
			group.save()
		}
		
		createPost(post, groupId) {
        
			const split = post.authorperm.split('/')
			var postDoc = new Post({
                author: split[0],
                permlink: split[1],
                group: groupId
            })

            return postDoc.save( (err) => {
                if (err) {
		            return console.log('duplicate:' +post.authorperm)
		        } else {
		            return console.log('adding post:' +post.authorperm)
                }
            })

		}
	}
	
	return new steemBot()
}
