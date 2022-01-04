import 'bootstrap/dist/css/bootstrap.css'; // Add this line
import '../styles/application.scss'

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}