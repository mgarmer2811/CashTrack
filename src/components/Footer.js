"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardListIcon, ChartPieIcon, UserCogIcon } from "lucide-react";

export default function Footer() {
    const pathname = usePathname();

    const isActive = (path) => {
        if (pathname == path) {
            return true;
        } else {
            return false;
        }
    };

    const tabs = [
        {
            href: "/home",
            Icon: ClipboardListIcon,
            label: "Historial",
        },
        {
            href: "/charts",
            Icon: ChartPieIcon,
            label: "Gráficos",
        },
        {
            href: "/user",
            Icon: UserCogIcon,
            label: "Ajustes",
        },
    ];

    return (
        <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg">
            <nav className="max-w-lg mx-auto flex justify-around py-2">
                {tabs.map(({ href, Icon, label }) => {
                    const colorClass = isActive(href)
                        ? "text-blue-600"
                        : "text-gray-400";
                    return (
                        <Link
                            key={href}
                            href={href}
                            className="flex flex-col items-center"
                        >
                            <Icon className={`h-6 w-6 ${colorClass}`} />
                            <span className={`text-xs ${colorClass}`}>
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </footer>
    );
}
