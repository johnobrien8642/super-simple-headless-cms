import { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { Input, Center } from '@chakra-ui/react'

const Login = () => {
	let [username, setUsername] = useState('');
	let [password, setPassword] = useState('');
	let [error, setError] = useState('');
	const router = useRouter();

	return (
		<div className="login container">
			<Center
				flexDirection={'column'}
			>
				<h1>Login</h1>
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						const res = await fetch(`/api/login`, {
							method: 'POST',
							headers: {
								Accept: 'application/json',
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
								username: username,
								password: password
							})
						});
						const data = await res.json();
						if (data.token) {
							Cookies.set('token', data.token);
							window.localStorage.setItem('loggedIn', 'true');
							router.push('/posts/create_post');
						} else {
							setError(data.error);
						}
					}}
				>
					<label>Admin Name</label>
					<Input
						onInput={(e) => {
							e.preventDefault();
							setUsername(e.target.value);
						}}
					/>
					<label>Password</label>
					<Input
						onInput={(e) => {
							e.preventDefault();
							setPassword(e.target.value);
						}}
					/>
					<button>Login</button>
					<p>{error}</p>
				</form>
			</Center>
		</div>
	);
};

export default Login;
