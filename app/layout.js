import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "learnbackprop",
  description: "Learn Backpropagation from scratch",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icons/logo.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/icons/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/logo.svg" />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
