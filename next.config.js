const path = require('path');

module.exports = {
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
