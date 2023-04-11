import connectDb from '../../lib/mongodb';
import Sub from '../../models/Sub';
import jwt from 'jsonwebtoken';
import validator from 'email-validator';
import nodemailer from 'nodemailer';
import * as aws from '@aws-sdk/client-ses';
import welcomeEmail from '../../util/email_templates/welcome_email';
import mongoose from 'mongoose';

export default async (req, res) => {
	await connectDb();
	let sub;
	let fetchedSub;
	const { email, jsonwebtoken } = req.body;

	const ses = new aws.SESClient({
		apiVerison: '2010-12-01',
		region: 'us-east-1',
		credentials: {
			accessKeyId: process.env.MY_AWS_ACCESS_KEY,
			secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY
		}
	});

	if (req.method === 'POST') {
		if (!validator.validate(email))
			return res
				.status(500)
				.json({ success: false, errorMessage: 'Email is invalid' });
		fetchedSub = await Sub.find({ email: email });
		if (!fetchedSub.length) {
			try {
				sub = new Sub({ email });
				sub.jsonwebtoken = jwt.sign(
					{ id: sub._id },
					process.env.SECRET_KEY
				);
				try {
					await sendEmail(sub);
					await sub.save();
				} catch (err) {
					return res
						.status(500)
						.json({ success: false, errorMessage: err.message });
				}
				res.status(200).json({ success: true, sub });
			} catch (err) {
				return res
					.status(500)
					.json({ success: false, errorMessage: err.message });
			}
		} else {
			return res.status(400).json({ success: false, alreadyExists: 1 });
		}
	} else if (req.method === 'DELETE') {
		try {
			const decoded = await jwt.verify(
				jsonwebtoken,
				process.env.SECRET_KEY
			);
			await Sub.deleteOne({ _id: decoded.id });
			res.status(200).json({
				success: true,
				message: 'Your subscription was successfully ended.'
			});
		} catch (err) {
			return res
				.status(500)
				.json({ success: false, errorMessage: err.message });
		}
	}

	async function sendEmail(sub, data) {
		let transporter = nodemailer.createTransport({
			SES: { ses, aws }
		});

		await transporter.sendMail({
			from: 'mikowski.me@gmail.com',
			to: sub.email,
			subject: "Hey, it's Mikowski",
			html: welcomeEmail(sub)
		});
	}
};
