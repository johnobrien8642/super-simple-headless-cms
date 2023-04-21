import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Section from '../../../models/Section';
import Piece from '../../../models/Piece';
import Admin from '../../../models/Admin';
import connectDb from '../../../lib/mongodb';
import jwt from 'jsonwebtoken';
import { Input, Text, Button } from '@chakra-ui/react'

const AddSection = ({ piece, section, authenticated }) => {
	const router = useRouter();
	const { update, writingId, sectionId, title, text, sectionLength, type } =
		router.query;
	const pPiece = JSON.parse(piece);
	const pSection = JSON.parse(section);
	let [titleHook, setTitle] = useState(pSection?.title ? pSection.title : '');
	let [textHook, setText] = useState('');
	let [numberHook, setNumber] = useState(
		update === 'true' ? pSection?.sectionNumber : sectionLength
	);
	let [error, setError] = useState('');
	let [deleteBool, setDelete] = useState(false);
	let divRef = useRef(null);
	let initialRef = useRef(false);

	useEffect(() => {
		if (!authenticated) {
			router.push('/');
		}
		if (update === 'true' && initialRef.current === false) {
			divRef.current.innerHTML = pSection.sectionText;
			setText(pSection.sectionText);
			initialRef.current = true;
		}
	}, [authenticated, update, divRef, pSection]);

	if (authenticated) {
		return (
			<div className="add-section-container container mt-5 hide">
				<Text as='h4' textDecoration={'underline'} mb={50}><Link href="/pieces/roll">Back To Roll</Link></Text>
				<Text fontSize='1.2rem' fontStyle='italic'>
					Think of sections like chapters.
				</Text>
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						if (!textHook) {
							setError('Text is required for a section');
							return;
						}
						const res = await fetch(
							'/api/writing/section/add_or_update',
							{
								method: 'POST',
								headers: {
									Accept: 'application/json',
									'Content-Type': 'application/json'
								},
								body: JSON.stringify({
									deleteBool,
									update,
									writingId,
									sectionId,
									textHook,
									numberHook,
									titleHook,
									type
								})
							}
						);
						const returnedData = await res.json();
						if (res.ok) {
							router.push('/pieces/roll');
						} else {
							console.log(
								'Error in piece/section/add_or_update:',
								returnedData.errorMessage
							);
						}
					}}
				>
					<label htmlFor="title">
						<Text as='h5'>Title</Text>
					</label>
					<Input
						name="title"
						type="text"
						value={titleHook}
						onInput={(e) => {
							setTitle(e.target.value);
						}}
					></Input>
					<Text fontSize='1.2rem' fontStyle='italic' mt='2%'>
						Section Number determines your section order. For example, if you already have 5 sections
						and mark this new section as "2", then this section will appear as the second section,
						and increment the other following sections. If you don't want to change section order,
						leave the default value in place.
					</Text>
					<label htmlFor="number" className="section-number">
						<Text as='h5'>Section Number<Text as='span' color='red'> *</Text></Text>
					</label>
					<Input
						name="number"
						type="number"
						min="1"
						value={numberHook}
						onInput={(e) => {
							setNumber(e.target.value);
						}}
					></Input>
					<Text as='h5'>Section Text<Text as='span' color='red'> *</Text></Text>
					<span>{error ? error : ''}</span>
					<div
						className="text-input-container container"
						contentEditable="true"
						value={textHook}
						ref={divRef}
						onInput={(e) => {
							setText(e.target.innerHTML);
							divRef.current.value = e.target.innerText;
						}}
					></div>
					<Button type='submit'>Submit</Button>
				</form>
			</div>
		);
	} else {
		return <div></div>;
	}
};

export async function getServerSideProps(context) {
	await connectDb();
	let decoded;
	if (context.req.cookies.token) {
		decoded = jwt.verify(context.req.cookies.token, process.env.NEXT_PUBLIC_SECRET_KEY);
	}

	const { writingId, sectionId } = context.query;

	const piece = await Piece.findById(writingId).populate('sections');

	const section = await Section.findById(sectionId);

	const authenticated = await Admin.findById(decoded?.id);

	return {
		props: {
			piece: JSON.stringify(piece),
			section: JSON.stringify(section),
			authenticated: !!authenticated
		}
	};
}

export default AddSection;
