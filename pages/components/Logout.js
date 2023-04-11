import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const Logout = () => {
	const router = useRouter();

	return (
		<div className="logout container">
			<button
				onClick={(e) => {
					e.preventDefault();
					Cookies.remove('token');
					window.localStorage.removeItem('loggedIn');
					router.push('/admin');
				}}
			>
				logout
			</button>
		</div>
	);
};

export default Logout;
