import mongoose, { Types, Schema, Model } from 'mongoose';
import bcrypt from 'bcrypt'

export type AdminType = {
	username: string;
	email: string;
	password: string;
	superAdmin: boolean;
};

export type AdminMethods = {
	verifyPW(pw: string): boolean;
}

export type AdminStatics = {
	createAdmin(newAdminDoc: AdminType, admin: AdminType): AdminType | Error;
	updateAdminPassword(adminUsernameToFind: string , newPassword: string, admin: AdminType): AdminType | Error;
}

export type AdminModel = Model<AdminType, {}, AdminMethods, AdminStatics>

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

adminSchema.method('verifyPW', async function verifyPW(pw): Promise<boolean> {
	return await bcrypt.compare(pw, this.password)
})

adminSchema.static('createAdmin', async function createAdmin(newAdminDoc, admin): Promise<string | Error> {
	let doc
	if (process.env.NEXT_PUBLIC_SUPER_ACTIVE === 'true') {
		doc = await this.findById(admin._id)
	} else if (process.env.NEXT_PUBLIC_SUPER_ACTIVE === 'false') {
		doc = { superAdmin: true }
	}
	let savedDoc
	let newAdmin
	if (doc && doc.superAdmin) {
		const hashPW: any = await bcrypt.hash(newAdminDoc.password, 10)
		if (hashPW instanceof Error) {
			return hashPW
		} else {
			try {
				newAdminDoc.password = hashPW
				savedDoc = await newAdminDoc.save()
				return `Doc Created: ${savedDoc}`
			} catch(err) {
				if (err) {
					return new Error(err as string)
				} else {
					return new Error('createAdmin errored but no error returned')
				}
			}
		}
	} else {
		return new Error('New admin not saved, admin provided either did not exist or was not marked super')
	}
})

adminSchema.static('updateAdminPassword', async function updateAdminPassword(adminUsernameToFind, newPassword, admin): Promise<string | Error> {
	let doc
	if (process.env.NEXT_PUBLIC_SUPER_ACTIVE === 'true') {
		doc = await this.findById(admin._id)
	}
	let savedDoc
	if (doc && doc.superAdmin) {
		const hashPW: any = await bcrypt.hash(newPassword, 10)
		if (hashPW instanceof Error) {
			return hashPW
		} else {
			try {
				savedDoc = await Admin.findOneAndUpdate({ username: adminUsernameToFind }, { password: hashPW })
				return `Doc Updated: ${savedDoc}`
			} catch(err) {
				if (err) {
					return new Error(err as string)
				} else {
					return new Error('updateAdminPassword errored but no error returned')
				}
			}
		}
	} else {
		if (process.env.NEXT_PUBLIC_SUPER_ACTIVE === 'false') {
			return new Error("NEXT_PUBLIC_SUPER_ACTIVE is false, and must be true to update admin docs")
		}
		return new Error("Admin provided is invalid")
	}
})

const Admin = mongoose.models.Admin || mongoose.model<AdminType, AdminModel>('Admin', adminSchema, 'admins');

export default Admin
