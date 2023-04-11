const path = require('path');

module.exports = {
	images: {
		domains: ['res.cloudinary.com', 'd10v7123g4b5wr.cloudfront.net']
	},
	sassOptions: {
		includePaths: [path.join(__dirname, 'styles')]
	}
};
