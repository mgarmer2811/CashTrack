"use client";

import { useState, useEffect } from "react";

export default function Header({ month, year, onChangeMonthYear, total }) {
    const [monthValue, setMonthValue] = useState("");

    useEffect(() => {
        const mm = String(month).padStart(2, "0");
        setMonthValue(`${year}-${mm}`);
    }, [month, year]);

    const handleMonthChange = (e) => {
        const [newYear, newMonth] = e.target.value.split("-").map(Number);
        onChangeMonthYear({ year: newYear, month: newMonth });
    };

    return (
        <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 px-8 py-4 flex flex-row items-center justify-between z-10">
            <div className="flex flex-col">
                <span className="text-sm" style={{ color: "#2563EB" }}>
                    {year}
                </span>
                <input
                    type="month"
                    value={monthValue}
                    onChange={handleMonthChange}
                    className="mt-1 w-32 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                />
                {/**
                 * Esto es CSS de IA para ocultar año y guiones
                 * en el input de type 'month'
                 */}
                <style jsx>{`
                    input[type="month"]::-webkit-datetime-edit-year-field {
                        display: none;
                    }

                    input[type="month"]::-webkit-datetime-edit-text {
                        display: none;
                    }

                    input[type="month"]::-webkit-datetime-edit-month-field {
                        text-transform: capitalize;
                    }
                `}</style>
            </div>
            <div className="flex flex-col items-center">
                <span className="text-sm" style={{ color: "#2563EB" }}>
                    Gastos
                </span>
                <span className="text-xl font-bold text-gray-900">
                    €{total.toFixed(2)}
                </span>
            </div>
        </header>
    );
}
