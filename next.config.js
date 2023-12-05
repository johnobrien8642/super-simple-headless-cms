const path = require('path');

module.exports = {
  api: {
    bodyParser: {
      sizeLimit: '50mb'
    }
  },
	images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
 	sassOptions: {
		includePaths: [path.join(__dirname, 'styles')]
	}
};
