// components/Header.jsx
"use client";

import { useEffect, useState } from "react";

const MONTH_NAMES = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
];

const CATEGORY_LIST = [
    { id: 1, name: "VIVIENDA" },
    { id: 2, name: "COMIDA" },
    { id: 3, name: "TRANSPORTE" },
    { id: 4, name: "SUSCRIPCIONES" },
    { id: 5, name: "SALUD" },
    { id: 6, name: "ASEO" },
    { id: 7, name: "OCIO" },
    { id: 8, name: "EDUCACION" },
    { id: 9, name: "OTROS" },
];

export default function Header({
    month,
    year,
    onChangeMonthYear,
    total,
    selectedCategory,
    onChangeCategory,
}) {
    const [monthValue, setMonthValue] = useState("");

    useEffect(() => {
        const mm = String(month).padStart(2, "0");
        setMonthValue(`${year}-${mm}`);
    }, [month, year]);

    const handleMonthChange = (e) => {
        const [newYear, newMonth] = e.target.value.split("-").map(Number);
        onChangeMonthYear({ year: newYear, month: newMonth });
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        onChangeCategory(value === "" ? null : Number(value));
    };

    return (
        <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between z-10">
            <div className="flex space-x-4">
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
                <div className="flex flex-col">
                    <span className="text-sm" style={{ color: "#2563EB" }}>
                        Categoría
                    </span>
                    <select
                        value={selectedCategory ?? ""}
                        onChange={handleCategoryChange}
                        className="mt-1 w-32 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                    >
                        <option value="">Todas</option>
                        {CATEGORY_LIST.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
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
