const keystone = require('keystone')
const Post = keystone.list('Post').model
const sortBy = require('array-sort-by')

exports = module.exports = function () {

	class steemBot {
		constructor() {
			this.groups = []

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
			// Get current groups posts from Steem
			global.steem.api.getAccountVotes(group.username, (err, posts) => {
				if (err || typeof posts == 'undefined')
					return console.log(err); 
				
				const length = posts.length - 1 
				
                posts = sortBy(posts, (s) => -new Date(s.time) ).reverse()
				// Sort all posts by dateTime of creation
				
				if (group.currentId == 0)  {
					return this.setCurrentLength(group, length)
					// If group is newly added
                }

				if (group.currentId < length) {
					// New post(s) found
                    const group2 = { _id: group._id, username: group.username, currentId: group.currentId }
                    this.setCurrentLength(group, length)
					// Update currentLength to prevent re-adding posts

                    for (var i = group.currentId; i <= length; i++) {
                    	// Looping through new posts
                        this.createPost(posts[i], group2._id)
                    }
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
			// Splitting up author and permlink
			
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
