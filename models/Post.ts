import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PostSchema = new Schema({
	link: {
		type: String,
		required: true
	},
	blurString: {
		type: Buffer,
		required: true
	},
	title: {
		type: String
	},
	description: {
		type: String
	},
	price: {
		type: Number
	},
	type: {
		type: String,
		required: true
	},
	number: {
		type: Number,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const Post =
	mongoose.models.Post || mongoose.model('Post', PostSchema, 'demo-posts');

export default Post;
