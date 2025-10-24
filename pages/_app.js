import "@/styles/globals.css";
import { Inter, Orbitron } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });

export default function App({ Component, pageProps }) {
  return (
    <main className={`${inter.variable} ${orbitron.variable} font-sans`}>
      <Component {...pageProps} />
    </main>
  );
}
