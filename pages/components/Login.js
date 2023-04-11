import { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const Login = () => {
	let [username, setUsername] = useState('');
	let [password, setPassword] = useState('');
	let [error, setError] = useState('');
	const router = useRouter();

	return (
		<div className="login container">
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
				<input
					onInput={(e) => {
						e.preventDefault();
						setUsername(e.target.value);
					}}
				/>
				<label>Password</label>
				<input
					onInput={(e) => {
						e.preventDefault();
						setPassword(e.target.value);
					}}
				/>
				<button>Login</button>
				<p>{error}</p>
			</form>
		</div>
	);
};

export default Login;
