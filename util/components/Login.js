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
				<h1>{process.env.NEXT_PUBLIC_SUPER_ACTIVE === 'true' ? 'Login' : 'Create Admin'}</h1>
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						const res = await fetch(process.env.NEXT_PUBLIC_SUPER_ACTIVE === 'true' ? `/api/login` : `/api/admin`, {
							method: 'POST',
							headers: {
								Accept: 'application/json',
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
								username: username,
								password: password,
							})
						});
						const { data } = await res.json();
						if (data.token) {
							Cookies.set('token', data.token);
							window.localStorage.setItem(process.env.NEXT_PUBLIC_LOGGED_IN_VAR, 'true');
							router.push('/admin/manage-pages');
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
					<button>{process.env.NEXT_PUBLIC_SUPER_ACTIVE === 'true' ? 'Login' : 'Create'}</button>
					<p>{error}</p>
				</form>
			</Center>
		</div>
	);
};

export default Login;
