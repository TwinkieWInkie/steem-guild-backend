const keystone = require('keystone')

module.exports = (req, res) => {
	const data = req.body

	keystone.list('steem').model.findOne({ email: data.email }, (err, doc) => {
		if ( doc && !err )
			doc._.password.compare(data.password, (err, isMatch) => {
				if ( !err && isMatch ) {
					doc.password = ''
					doc.wif = ''

					res.send(doc)
				} else {
					res.send(false)
				}
			})
		else
			res.send(false)
	})
}

