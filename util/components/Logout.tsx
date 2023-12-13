import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/react'

const Logout = ({}) => {
	const router = useRouter();
	return (
		<div className="logout container">
			<Button
				onClick={(e) => {
					e.preventDefault();
					Cookies.remove('token');
					window.localStorage.removeItem(process.env.NEXT_PUBLIC_LOGGED_IN_VAR as string);
					router.push('/admin');
				}}
			>
				logout
			</Button>
		</div>
	);
};

export default Logout;
