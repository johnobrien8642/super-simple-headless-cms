import { useState, useEffect, useRef } from 'react';

const SubscribeForm = () => {
	let [email, setEmail] = useState('');
	let [success, setSuccess] = useState('');
	let [waiting, setWaiting] = useState(false);
	let [error, setError] = useState('');

	function handleSuccessOrError() {
		if (waiting) {
			return <div className="spinner-border waiting"></div>;
		}
		if (success) {
			return <p>{success}</p>;
		}
		if (error) {
			return <p>{error}</p>;
		}
	}

	return (
		<div className="subscribe-form-container">
			<h5>
				Subscribe with your email and I'll send you an email
				notification when I upload new writing.
			</h5>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					setWaiting(true);
					const res = await fetch(`/api/handle_subscription`, {
						method: 'POST',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							email
						})
					});

					const returnedData = await res.json();
					if (res.ok) {
						setEmail('');
						setWaiting(false);
						setSuccess(
							"I've sent you an email, if you received it, you're successfully subscribed. If not, double-check your email and try again. - Mikowski"
						);
					} else {
						if (returnedData.alreadyExists) {
							setWaiting(false);
							setError("You're already subscribed. - Mikowski");
						} else {
							setWaiting(false);
							setError(
								'My system said that email was invalid, double-check your email and try again. - Mikowski'
							);
						}
					}
				}}
			>
				<input
					value={email}
					onInput={(e) => {
						setEmail(e.target.value);
					}}
				></input>
				<button>Subscribe</button>
				{handleSuccessOrError()}
			</form>
			<p className="guarantee">
				I will never, ever use your email for anything other than
				sending you new writing notifications.
			</p>
		</div>
	);
};

export default SubscribeForm;
