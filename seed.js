import connectDb from './lib/mongodb';
import PageManager from './models/PageManager';

export async function seedDb() {
	await connectDb();
	const pageManager = await PageManager().findOne({ title: 'manage-pages' });
	console.log(pageManager)
}