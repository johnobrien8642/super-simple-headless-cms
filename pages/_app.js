import 'bootstrap/dist/css/bootstrap.css'; // Add this line
import '../styles/application.scss';
import { ChakraProvider } from '@chakra-ui/react'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function MyApp({ Component, pageProps }) {
	return (
		<ChakraProvider>
			<DndProvider backend={HTML5Backend}>
				<Component {...pageProps} />
			</DndProvider>
		</ChakraProvider>
	)
}
