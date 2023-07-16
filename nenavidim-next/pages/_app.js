import '../styles/globals.css';
import '../styles/stats.css';
import { SessionProvider } from "next-auth/react";


export default function App({ Component, pageProps }) {
  const { session, ...restPageProps } = pageProps;
  return (
    <SessionProvider session={session}>
      <Component {...restPageProps} />
    </SessionProvider>
  )
}