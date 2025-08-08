import '../styles/globals.css'
import { AuthProvider } from '../components/AuthContext'

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}


