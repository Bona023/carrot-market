import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: {
        template: "%s | Carrot Market",
        default: "Carrot Market",
    },
    description: "당근마켓 클론 코딩",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="bg-neutral-900 text-white max-w-screen-sm mx-auto">{children}</body>
        </html>
    );
}
