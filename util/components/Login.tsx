import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import {
	Input,
	Center,
	Button,
	Text,
	FormControl,
	FormLabel,
	Skeleton,
	Heading,
	Checkbox,
	Flex,
	Spinner
} from '@chakra-ui/react';

const Login = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPW, setConfirmPW] = useState('');
	const [error, setError] = useState('');
	const [checkingFirst, setCheckingFirst] = useState(true);
	const [loading, setLoading] = useState(false);
	const [firstTimeUser, setFirstTimeUser] = useState(false);
	const [showPWs, setShowPWs] = useState(false);
	const router = useRouter();

	useEffect(() => {
		handleCheckFirstTime();
		async function handleCheckFirstTime() {
			const res = await fetch(`/api/check_admin_exists`);
			const data = await res.json();
			const { admin } = data;
			setFirstTimeUser(!admin);
			setCheckingFirst(false)
		}
	}, [])

	if (checkingFirst) {
		return <Center mt='10%'><Spinner boxSize={100} /></Center>
	} else {
		return (
			<Center
				flexDirection={'column'}
				p='3rem'
			>
				{firstTimeUser && <Heading as='h3'>{`Welcome to Super Simple CMS!`}</Heading>}
				<Heading>{firstTimeUser ? 'Create Admin' : 'Login'}</Heading>
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						setLoading(true);
						const res = await fetch(firstTimeUser ? `/api/admin` : `/api/login`, {
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
						if (res.ok) {
							const { data: { admin, token }, error } = await res.json();
							if (token) {
								setLoading(false);
								Cookies.set(process.env.NEXT_PUBLIC_LOGGED_IN_VAR as string, token);
								window.localStorage.setItem(process.env.NEXT_PUBLIC_LOGGED_IN_VAR as string, 'true');
								router.push('/admin/manage-pages');
							} else {
								setError(error);
								setLoading(false);
							}
						} else {
							const { error } = await res.json();
							setError(error)
							setLoading(false);
						}
					}}
				>
					<FormControl my='1rem'>
						<FormLabel
							htmlFor='username'
						>
							Username
						</FormLabel>
						<Skeleton isLoaded={!loading}>
							<Input
								id='username'
								onInput={(e) => {
									e.preventDefault();
									setUsername((e.target as HTMLInputElement).value);
								}}
							/>
						</Skeleton>
					</FormControl>
					<FormControl my='1rem'>
						<FormLabel
							htmlFor='password'
						>
							Password
						</FormLabel>
						<Skeleton isLoaded={!loading}>
							<Input
								id='password'
								type={showPWs ? 'text' : 'password'}
								onInput={(e) => {
									e.preventDefault();
									setPassword((e.target as HTMLInputElement).value);
								}}
							/>
						</Skeleton>
					</FormControl>
					{firstTimeUser && <FormControl my='1rem' isRequired={true}>
						<FormLabel
							htmlFor='conf-password'
						>
							Confirm Password
						</FormLabel>
						<Skeleton isLoaded={!loading}>
							<Input
								id='conf-password'
								type={showPWs ? 'text' : 'password'}
								onInput={(e) => {
									e.preventDefault();
									setConfirmPW((e.target as HTMLInputElement).value);
								}}
							/>
						</Skeleton>
					</FormControl>}
					<Flex gap='5'>
						<Button
							type='submit'
							onClick={e => {
								if (firstTimeUser && password !== confirmPW) {
									e.preventDefault();
									setError("Passwords don't match");
								}
							}}
						>
							{firstTimeUser ? 'Create' : 'Login'}
						</Button>
						<Checkbox
							onChange={() => {
								setShowPWs(!showPWs);
							}}
						>
							Show passwords
						</Checkbox>
					</Flex>
					{error && <Text my='1rem'>{error}</Text>}
				</form>
			</Center>
		);
	}
};

export default Login;
