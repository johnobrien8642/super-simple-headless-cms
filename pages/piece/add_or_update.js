import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button, Text, Input, Textarea, Box } from '@chakra-ui/react'

const AddPiece = ({}) => {
	const router = useRouter();
	const { update, writingId, title, summary, finished, type } = router.query;
	let [titleHook, setTitle] = useState(title ? title : '');
	let [summaryHook, setSummary] = useState(summary ? summary : '');
	let [errors, setErrors] = useState([])
	console.log(errors)
	return (
		<div className="add-piece-container container mt-5">
			<Text as='h4' textDecoration={'underline'}><Link href="/pieces/roll">Back To Roll</Link></Text>
			<form
				className="form"
				onSubmit={async (e) => {
					e.preventDefault();
					const res = await fetch('/api/writing/add_or_update', {
						method: 'POST',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							update,
							_id: writingId,
							titleHook,
							summaryHook,
							type
						})
					});
					const returnedData = await res.json();
					if (res.ok) {
						router.push('/pieces/roll');
					} else {
						console.log(
							'Error in piece/add_or_update:',
							returnedData.errorMessage
						);
					}
				}}
			>
				<Box width='60%' m='5%'>
					<Text fontStyle='italic' as='h4' mt={10}>How to create a writing piece</Text>
					<Text fontStyle='italic'>
						To create a writing piece, enter your piece's title and optional
						short summary below. Click submit. After successful submission, you'll
						be taken back to the pieces index page, where you can start adding sections
						to your piece.
					</Text>
				</Box>
				<Text as='h2' mt={10}>Create Writing Piece</Text>
				<label htmlFor="title">
					<Text as='h5'>Title<Text as='span' color='red'> *</Text></Text>
				</label>
				<Input
					name="title"
					type="text"
					value={titleHook}
					placeholder='Moby Dick'
					onInput={(e) => {
						setTitle(e.target.value);
					}}
				></Input>
				<label htmlFor="summary">
					<Text as='h5'>Summary</Text>
				</label>
				<Textarea
					name="summary"
					type="text"
					value={summaryHook}
					placeholder='A story about a guy and a whale, or something like that.'
					onInput={(e) => {
						setSummary(e.target.value);
					}}
				></Textarea>
				<Text mt={10} as='h5' color='red'>{errors}</Text>
				<Button
					type='submit'
					mt={50}
					onClick={(e) => {
						if (!titleHook) {
							e.preventDefault()
							errors = [...errors, 'Title is required']
							setErrors(errors)
						}
					}}
				>
					Submit
				</Button>
			</form>
		</div>
	);
};

export default AddPiece;
