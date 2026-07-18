import "./globals.css";

export const metadata = {
  title: "Glasses — Evidence before expensive code",
  description:
    "A human-guided workflow that challenges unsupported complexity before your AI writes expensive code.",
  metadataBase: new URL("https://github.com/DanielGouveiah/glasses"),
  openGraph: {
    title: "Glasses",
    description: "Put your glasses on before the code gets expensive.",
    type: "website",
  },
  icons: {
    icon: [{ url: "/glasses-icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
