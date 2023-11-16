import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Logout from '../components/Logout';
import { useRouter } from 'next/router';
import { Text } from '@chakra-ui/react'

const AdminHeader = () => {
	let [openNav, setOpenNav] = useState('');
	let [loggedIn, setLoggedIn] = useState(false)
	const dropdownRef = useRef(null);
	const router = useRouter();
	const pathname = router.pathname;

	useEffect(() => {
		if(window.localStorage.getItem(process.env.NEXT_PUBLIC_LOGGED_IN_VAR)) {
			setLoggedIn(true)
		}
	}, [])

	useEffect(() => {
		if (window) {
			document.body.classList.add('admin')
		}
	}, [])

	function handleLoggedIn() {
		if (loggedIn) {
			return Logout(router);
		}
	}

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light admin">
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
				}navbar-collapse bg-light`}
				tabIndex={-1}
				ref={dropdownRef}
				onBlur={(e) => {
					if (!e.relatedTarget) {
						setOpenNav(false);
					}
				}}
			>
				<ul className="navbar-nav">
					<li
						className={`nav-item${
							pathname.match('/admin/manage-pages') ? ' active' : ''
						}`}
					>
						<Link className='nav-link' href={'/admin/manage-pages'}>Manage Pages</Link>
					</li>
					<li
						className={`nav-item${
							pathname.match('/admin/manage-assets') ? ' active' : ''
						}`}
					>
						<Link className='nav-link' href={'/admin/manage-assets'}>Manage Assets</Link>
					</li>
					<li
						className={`nav-item${
							pathname.match('/auth/repl') ? ' active' : ''
						}`}
					>
						<Link className='nav-link' href={'/auth/repl'}>Repl</Link>
					</li>
					<li>{handleLoggedIn()}</li>
					<li><Text display={loggedIn ? 'inline-block': 'none'} as='h5' color='gray' m='auto'><Link href='/admin'>Admin Mode</Link></Text></li>
				</ul>
			</div>
		</nav>
	);
};

export default AdminHeader;
