"use client";
import Header from "@/components/common/Header";
import "./styles/theme.css";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { PrimeReactProvider } from "primereact/api";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { usePathname } from "next/navigation";
import { publicRoutes } from "@/const/publicRoutes.const";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = publicRoutes.includes(pathname);

  return (
    <div className="flex flex-column h-screen">
      {!isLoginPage && <Header />}
      {children}
      {/* {!isLoginPage && <Footer />} */}
    </div>
  );
}

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
      <body className="m-0 p-0">
        <PrimeReactProvider value={config}>
          <AuthProvider>
            <ThemeProvider>
              <LayoutContent>{children}</LayoutContent>
            </ThemeProvider>
          </AuthProvider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
