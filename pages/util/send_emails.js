import { useEffect, useState } from 'react';
import Admin from '../../models/Admin';
import Link from 'next/link';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import connectDb from '../../lib/mongodb';
import { Input, Textarea, Button, Text } from '@chakra-ui/react'

const SendEmails = ({ data }) => {
	let [title, setTitle] = useState('');
	let [sectionId, setSectionId] = useState('');
	let [writingDesc, setWritingDesc] = useState('');
	let [writingType, setWritingType] = useState('piece');
	let [sending, setSending] = useState(false);
	let [success, setSuccess] = useState('');
	let [error, setError] = useState('');
	const router = useRouter();

	useEffect(() => {
		if (!data) router.push('/');
	}, [data]);

	function handleSending() {
		if (sending) {
			return <div className="spinner-border m-5"></div>;
		}
	}

	function handleSuccessOrError() {
		if (success) {
			return <Text as='h5' mt='5%'>{success}</Text>;
		}
		if (error) {
			return <Text as='h5' mt='5%' color='red'>{error}</Text>;
		}
	}

	if (data) {
		return (
			<div className="send-email-container container mt-5">
				<Text as='h3' textDecoration={'underline'} mb={50}><Link href="/admin">Admin Page</Link></Text>
				<h3>Send Emails</h3>
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						setSending(true);
						const res = await fetch(`/api/send_emails`, {
							method: 'POST',
							headers: {
								Accept: 'application/json',
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
								title,
								sectionId,
								writingType,
								writingDesc
							})
						});
						const returnedData = await res.json();

						if (res.ok) {
							setSuccess('Emails sent');
							setSending(false);
						} else {
							setError(
								`Error while sending emails: ${returnedData.errorMessage}`
							);
						}
					}}
				>
					<label htmlFor="title">
						Title
						<Input
							name="title"
							onInput={(e) => {
								setTitle(e.target.value);
							}}
						></Input>
					</label>
					<label htmlFor="description">
						Description
						<Textarea
							name="description"
							onChange={(e) => {
								setWritingDesc(e.target.value);
							}}
						></Textarea>
					</label>
					<Button type='submit'>Submit</Button>
				</form>
				{handleSending()}
				{handleSuccessOrError()}
			</div>
		);
	}
};

export async function getServerSideProps(context) {
	await connectDb();
	let decoded;
	if (context.req.cookies.token) {
		decoded = jwt.verify(context.req.cookies.token, process.env.NEXT_PUBLIC_SECRET_KEY);
	}
	const authenticated = await Admin.findById(decoded?.id);

	return {
		props: {
			data: !!authenticated
		}
	};
}

export default SendEmails;
