import { useState } from 'react';
import { useRouter } from 'next/router';

const NewAdmin = () => {
	let [username, setUsername] = useState('');
	let [password, setPassword] = useState('');
	let [confirmPassword, setConfirmPassword] = useState('');
	let [warning, setWarning] = useState(false);
	const router = useRouter();

	return (
		<div className="new-admin container">
			<h1>New Admin</h1>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					if (password === confirmPassword) {
						const res = await fetch(`/api/admin`, {
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

						if (res.ok) {
							router.push('/create_post');
						} else {
							console.log(
								'Error in New_Admin form submit',
								res.status
							);
						}
					} else {
						setWarning(true);
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
					type="password"
					onInput={(e) => {
						e.preventDefault();
						setPassword(e.target.value);
					}}
				/>
				<label>Confirm Password</label>
				<input
					type="password"
					onInput={(e) => {
						e.preventDefault();
						setConfirmPassword(e.target.value);
					}}
				/>
				<button>Create Admin</button>
				<span className={`warning${warning ? ' active' : ''}`}>
					Passwords don't match
				</span>
			</form>
		</div>
	);
};

export default NewAdmin;
