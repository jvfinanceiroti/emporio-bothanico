const ADMIN_FAVICON_URL = "/logo.png?v=20260630t";

export const metadata = {
  title: "Área administrativa",
  icons: {
    icon: ADMIN_FAVICON_URL,
    shortcut: ADMIN_FAVICON_URL,
    apple: ADMIN_FAVICON_URL,
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
