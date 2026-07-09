import "../styles/globals.css";
import Head from "next/head";
import { CartProvider } from "../components/cart/CartContext";

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <Head>
        <title>QSV - Quantum Shopping Verse</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Global Favicon - QSV Logo */}
        <link rel="icon" href="/images/qsv-logo-merged.png" type="image/png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/qsv-logo-merged.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/qsv-logo-merged.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/qsv-logo-merged.png" />
        <meta name="msapplication-TileImage" content="/images/qsv-logo-merged.png" />
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </Head>
      <Component {...pageProps} />
    </CartProvider>
  );
}
