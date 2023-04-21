import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/react'

const Logout = () => {
	const router = useRouter();

	return (
		<div className="logout container">
			<Button
				onClick={(e) => {
					e.preventDefault();
					Cookies.remove('token');
					window.localStorage.removeItem('loggedIn');
					router.push('/admin');
				}}
			>
				logout
			</Button>
		</div>
	);
};

export default Logout;
