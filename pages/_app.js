import 'bootstrap/dist/css/bootstrap.css'; // Add this line
import '../styles/application.scss';
import { ChakraProvider } from '@chakra-ui/react'

export default function MyApp({ Component, pageProps }) {
	return (
		<ChakraProvider>
			<Component {...pageProps} />;
		</ChakraProvider>
	)
}
