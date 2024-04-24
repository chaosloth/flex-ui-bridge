import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flex Bridge",
  description: "Send messages to Twilio Flex",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
