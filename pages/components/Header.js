import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Logout from '../components/Logout';
import { useRouter } from 'next/router';

const Header = ({ loggedIn }) => {
	let [active, setActive] = useState('');

	let [openNav, setOpenNav] = useState('');
	const dropdownRef = useRef(null);
	const router = useRouter();
	const pathname = router.pathname;

	useEffect(() => {
		if (active) {
			dropdownRef.current.focus();
		}

		if (pathname === '/') {
			setActive('Hi');
		} else if (pathname.match('/pieces/roll')) {
			setActive('Pieces');
		} else if (pathname.match('/photos/roll')) {
			setActive('Photos');
		} else if (pathname.match('/coding/links')) {
			setActive('Coding');
		}
	});

	function handleLoggedIn() {
		if (loggedIn) {
			return Logout();
		}
	}

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<button
				className="navbar-brand"
				onClick={(e) => {
					e.preventDefault();
					router.push('/');
				}}
			>
				<h3>John E. O'Brien</h3>
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
							active === 'Hi' ? ' active ' : ''
						}`}
						onClick={() => {
							setActive('Hi');
						}}
					>
						<Link href="/" passHref>
							Hi
						</Link>
					</li>
					<li
						className={`nav-item${
							active === 'Pieces' ? ' active ' : ''
						}`}
						onClick={() => {
							setActive('Pieces');
						}}
					>
						<Link href="/pieces/roll" className="nav-link" passHref>
							Writing
						</Link>
					</li>
					<li
						className={`nav-item${
							active === 'Photos' ? ' active' : ''
						}`}
						onClick={() => {
							setActive('Photos');
						}}
					>
						<Link
							href="/posts/photos/roll"
							className="nav-link"
							passHref
						>
							Pictures
						</Link>
					</li>
					<li
						className={`nav-item${
							active === 'Coding' ? ' active' : ''
						}`}
						onClick={() => {
							setActive('Coding');
						}}
					>
						<Link
							href="/coding/links"
							className="nav-link"
							passHref
						>
							Coding
						</Link>
					</li>
					<li>{handleLoggedIn()}</li>
				</ul>
			</div>
		</nav>
	);
};

export default Header;
