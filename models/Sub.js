import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const SubSchema = new Schema({
	email: {
		type: String
	},
	jsonwebtoken: {
		type: String
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const Sub = mongoose.models.Sub || mongoose.model('Sub', SubSchema, 'demo-subs');

export default Sub;
