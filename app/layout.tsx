import { ChakraProvider, theme } from "@chakra-ui/react";
import "./globals.css";
import Navigation from "@/components/(global)/Navigation";

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Propel",
  description: "NZ Music Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
      <html lang="en">
        <body>
          <ChakraProvider>
              <main className="min-h-screen bg-bgDark text-text">
                <Navigation />
                {children}
              </main>
            </ChakraProvider>
        </body>
      </html>
  );
}
