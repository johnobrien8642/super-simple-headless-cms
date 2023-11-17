import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Logout from '../components/Logout';
import { useRouter } from 'next/router';
import { useParams } from 'next/navigation';
import { Text } from '@chakra-ui/react'
import { kebabCase } from 'lodash';
import { HamburgerIcon } from '@chakra-ui/icons';

const Header = ({ pages }) => {
	const [openNav, setOpenNav] = useState('');
	const [loggedIn, setLoggedIn] = useState(false)
	const dropdownRef = useRef(null);
	const router = useRouter();
	const params = useParams();
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

	if (params.slug?.includes('video')) {
		return <></>
	} else {
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
					<HamburgerIcon sx={{ svg: { color: 'white' } }} />
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
								if (obj.folderHref !== '/' && obj.showInNavigation) {
									return <li
										key={obj._id}
										className={`nav-item`}
										onClick={() => {
											router.push(`${obj.folderHref}`)
										}}
									>
										<Text
											fontWeight={(obj.pageSelected || router.asPath) === obj.folderHref ? '600' : '400'}
											sx={{
												'a:hover': {
													color: 'lightgray'
												}
											}}
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
	}
};

export default Header;
