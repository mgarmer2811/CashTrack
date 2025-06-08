import "../app/styles/globals.css";
import { AuthProvider } from "./utils/AuthProvider";

export const metadata = {
    title: "CashTrack",
    description: "Money tracker",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="relative pb-16">
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
