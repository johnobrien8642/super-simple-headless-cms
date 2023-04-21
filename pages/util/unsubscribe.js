import Sub from '../../models/Sub';
import Link from 'next/link'
import jwt from 'jsonwebtoken';
import connectDb from '../../lib/mongodb';
import mongoose from 'mongoose';
import { Text } from '@chakra-ui/react'

const Unsubscribe = () => {
	return (
		<div className="container unsubscribe-container mt-5">
			<Text as='h3' textDecoration={'underline'}><Link href={'/'}>Go to Main Page</Link></Text>
			<Text as='h2'>You're unsubscribed!</Text>
		</div>
	);
};

export async function getServerSideProps(context) {
	await connectDb();
	let decoded;
	const { subtoken } = context.query;

	decoded = jwt.verify(subtoken, process.env.NEXT_PUBLIC_SECRET_KEY);

	await Sub.deleteOne({ _id: mongoose.Types.ObjectId(decoded?.id) });

	return {
		props: {}
	};
}

export default Unsubscribe;
