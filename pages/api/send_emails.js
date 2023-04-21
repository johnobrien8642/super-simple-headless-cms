import connectDb from '../../lib/mongodb';
import Sub from '../../models/Sub';
import Section from '../../models/Section';
import nodemailer from 'nodemailer';
import * as aws from '@aws-sdk/client-ses';
import newWritingEmail from '../../util/email_templates/new_writing_email';
import mongoose from 'mongoose';

export default async (req, res) => {
	await connectDb();
	let subs;
	const { title, sectionId, writingType, writingDesc } = req.body;

	const ses = new aws.SESClient({
		apiVerison: '2010-12-01',
		region: 'us-east-1',
		credentials: {
			accessKeyId: process.env.NEXT_PUBLIC_MY_AWS_ACCESS_KEY,
			secretAccessKey: process.env.NEXT_PUBLIC_MY_AWS_SECRET_ACCESS_KEY
		}
	});

	// const section = await Section.findById(sectionId).populate('piece');

	subs = await Sub.find({});
	for (let i = 0; i < subs.length; i++) {
		try {
			await sendEmail(subs[i], {
				emailTitle: title,
				writingDesc
			});
		} catch (err) {
			console.log(`Error sending to ${subs[i].email}: ${err.message}`);
		}
	}
	res.status(200).json({ success: true });

	async function sendEmail(sub, data) {
		let transporter = nodemailer.createTransport({
			SES: { ses, aws }
		});

		await transporter.sendMail({
			from: 'johnobriendeveloper@gmail.com',
			to: sub.email,
			subject: data.emailTitle,
			html: newWritingEmail(sub, data)
		});
	}
};
