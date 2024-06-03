'use client'
import { ChakraProvider } from "@chakra-ui/react";
import "./globals.css";
import Navigation from "@/components/(global)/Navigation";
import theme from "./theme";
import { AuthProvider } from "./providers/AuthProvider";

// const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

// export const metadata = {
//   metadataBase: new URL(defaultUrl),
//   title: "Propel",
//   description: "NZ Music Platform",
// };

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
      <html lang="en">
        <body>
          <ChakraProvider theme={theme}>
          {/* <AuthProvider> */}
              <main className="min-h-screen bg-bgDark text-text">
                <Navigation />
                {children}
              </main>
              {/* </AuthProvider> */}
            </ChakraProvider>
        </body>
      </html>
  );
}
