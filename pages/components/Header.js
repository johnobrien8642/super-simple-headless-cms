import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Logout from '../components/Logout';
import { useRouter } from 'next/router';
import { Text } from '@chakra-ui/react'
import { kebabCase } from 'lodash';

const Header = ({ pages, pageSelected, setPageSelected }) => {
	const [openNav, setOpenNav] = useState('');
	const [loggedIn, setLoggedIn] = useState(false)
	const dropdownRef = useRef(null);
	const router = useRouter();
	const pathname = router.pathname;

	useEffect(() => {
		if(window.localStorage.getItem(process.env.NEXT_PUBLIC_LOGGED_IN_VAR)) {
			setLoggedIn(true)
		}
	}, [])

	function handleLoggedIn() {
		if (loggedIn) {
			return Logout({ router });
		}
	}

	return (
		<nav className="navbar navbar-expand-lg">
			<button
				className="navbar-brand"
				onClick={(e) => {
					e.preventDefault();
					router.push('/');
				}}
			>
				<Text as='h3'>John Edward O'Brien</Text>
			</button>

			<button
				className="navbar-toggler"
				type="button"
				data-toggle="collapse"
				data-target="#navbarNav"
				aria-controls="navbarNav"
				aria-expanded="false"
				aria-label="Toggle navigation"
				onClick={() => {
					setOpenNav(!openNav);
				}}
			>
				<span className="navbar-toggler-icon"></span>
			</button>

			<div
				id="navbarNav"
				className={`${
					openNav ? 'active ' : 'collapse '
				}navbar-collapse`}
				tabIndex={-1}
				ref={dropdownRef}
				onBlur={(e) => {
					if (!e.relatedTarget) {
						setOpenNav(false);
					}
				}}
			>
				<ul className="navbar-nav">
					{
						pages?.map(obj => {
							if (obj.folderHref !== '/') {
								return <li
									key={obj._id}
									className={`nav-item`}
									onClick={() => {
										setPageSelected(obj);
									}}
								>
									<Text
										fontWeight={(obj.pageSelected || router.asPath) === obj.folderHref ? '600' : '400'}
									>
										<Link href={obj.folderHref} className="nav-link" passHref>
												{obj.title}
										</Link>
									</Text>
								</li>
							}
						})
					}
					<li>{handleLoggedIn()}</li>
					<li><Text display={loggedIn ? 'inline-block': 'none'} as='h5' color='gray' m='auto'><Link href='/admin'>Admin Mode</Link></Text></li>
				</ul>
			</div>
		</nav>
	);
};

export default Header;
