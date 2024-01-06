import mongoose, { Schema, Model } from 'mongoose';

export type AdminType = {
	username: string;
	email: string;
	password: string;
	superAdmin: boolean;
};

const adminSchema = new Schema({
		username: {
			type: String,
			required: true
		},
		// email: {
		// 	type: String,
		// 	required: true
		// },
		password: {
			type: String,
			required: true
		},
		editorTheme: {
			type: String,
			default: 'Monokai',
			required: true
		},
		// superAdmin: {
		// 	type: Boolean,
		// 	required: true
		// }
	}
);

const Admin = mongoose.models.Admin || mongoose.model<AdminType>('Admin', adminSchema, 'admins');

export default Admin
