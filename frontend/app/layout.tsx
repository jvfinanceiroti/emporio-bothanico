import "./globals.css";

export const metadata = {
  title: "Empório Bothânico - Delicadezas e Banho",
  description: "Produtos naturais e artesanais para seu bem-estar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
