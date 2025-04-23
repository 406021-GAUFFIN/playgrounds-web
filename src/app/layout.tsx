import Header from "@/components/common/Header";
import "./styles/theme.css";
import "./globals.css";
import { PrimeReactProvider } from "primereact/api";
import Footer from "@/components/common/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = {
    ripple: true,
  };
  return (
    <html lang="en">
      <body className="m-0 p-0 ">
        <PrimeReactProvider value={config}>
          <div className="min-h-screen">
            <Header />
            {children}
            <Footer />
          </div>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
