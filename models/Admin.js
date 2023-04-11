import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
	adminName: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	kind: {
		type: String,
		default: 'Plea'
	}
});

const Admin =
	mongoose.models.Admin || mongoose.model('Admin', AdminSchema, 'admins');

export default Admin;
