import { useState, useEffect, useRef } from 'react';
import { Center, Input, Button, Spinner } from '@chakra-ui/react'
import axios from 'axios'

const Form = () => {
	let [file, setFile] = useState('');
	let [title, setTitle] = useState('');
	let [description, setDescription] = useState('');
	let [price, setPrice] = useState('');
	let [photo, setPhoto] = useState(true);
	let [success, setSuccess] = useState(false);
	let [error, setError] = useState('');
	let [loading, setLoading] = useState(false);
	let fileInputRef = useRef(null)

	useEffect(() => {
		if (success) {
			setTimeout(() => {
				setSuccess(false);
			}, 2000);
			reset();
		}
	});

	function reset() {
		setFile('');
		fileInputRef.current.value = ''
		setTitle('');
		setDescription('');
		setPrice('');
		setError('');
	}

	return (
		<div className="form container">
			{/* <Button
				onClick={(e) => {
					e.preventDefault();
					setPhoto(!photo);
				}}
			>
				{photo ? 'Photo' : 'Book'}
			</Button> */}
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					setLoading(true)
					const res = await fetch(`/api/post_s3_url`, {
						method: 'POST',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							name: file.name,
							type: file.type
						})
					});

					const data1 = await res.json()

					const url = data1.url
					const fileKey = data1.key

					await axios.put(url, file, {
						headers: {
							'Content-Type': file.type,
							'Allow-Access-Control-Origin': '*'
						},
					});

					const res2 = await fetch(`/api/post_create`, {
						method: 'POST',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							fileKey,
							url,
							title,
							description,
							price,
							type: 'Photo'
						})
					});
					setLoading(false)
					if (res2.ok) {
						reset();
						setSuccess(true);
					} else {
						const data = await res.json();
						console.log('Error in Form', data.errorMessage);
						setError(data.errorMessage);
					}
				}}
			>
				<div className="link">
					<span>Filename</span>
					<Input
						ref={fileInputRef}
						accept='*'
						type='file'
						onInput={(e) => {
							setFile(e.target.files[0]);
						}}
					/>
				</div>
				<div className="title">
					<span>Title</span>
					<Input
						value={title}
						onInput={(e) => {
							setTitle(e.target.value);
						}}
					/>
				</div>
				<div className="description">
					<span>Description</span>
					<Input
						value={description}
						onInput={(e) => {
							setDescription(e.target.value);
						}}
					/>
				</div>
				<div className="price">
					<span>Price</span>
					<Input
						type="number"
						value={price}
						onInput={(e) => {
							setPrice(e.target.value);
						}}
					/>
				</div>
				<Button type='submit'>Create</Button>
				<Spinner display={loading ? 'block': 'none'} />
				<span className={`success${success ? ' active' : ''}`}>
					Success
				</span>
				<span className={`error${error ? ' active' : ''}`}>
					{error}
				</span>
			</form>
		</div>
	);
};

export default Form;
