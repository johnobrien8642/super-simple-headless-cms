import 'bootstrap/dist/css/bootstrap.css'; // Add this line
import '../styles/application.scss';
import { ChakraProvider } from '@chakra-ui/react'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { extendTheme } from '@chakra-ui/react';
import { IBM_Plex_Serif } from 'next/font/google'
const inter = IBM_Plex_Serif({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }) {
	const [pageSelected, setPageSelected] = useState({})
	let themeObj = {};
	if (!pageProps.admin) {
		themeObj = {
			fonts: {
				body: '__IBM_Plex_Serif_7fa7cd, __IBM_Plex_Serif_Fallback_7fa7cd',
				heading: '__IBM_Plex_Serif_7fa7cd, __IBM_Plex_Serif_Fallback_7fa7cd',
				mono: '__IBM_Plex_Serif_7fa7cd, __IBM_Plex_Serif_Fallback_7fa7cd'
			},
			components: {
				Button: {
					defaultProps: {
						colorScheme: 'black',
						variant: 'outline'
					}
				}
			},
			semanticTokens: {
				colors: {
					'chakra-body-text': {
						_dark: 'white',
						_light: 'white'
					}
				}
			}
		}
	}
	useEffect(() => {
		if (pageProps?.admin) {
			document.body.classList.add('admin')
		}
	}, [])
	const theme = extendTheme(themeObj)

	return (
		<ChakraProvider theme={theme}>
			<DndProvider backend={HTML5Backend}>
				<main className={inter.className}>
					<Component {...pageProps} />
				</main>
			</DndProvider>
		</ChakraProvider>
	)
}
