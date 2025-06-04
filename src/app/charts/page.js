"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../utils/AuthProvider";
import ExpenseItem from "@/components/ExpenseItem";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const CATEGORY_COLORS_MAP = {
    1: { name: "VIVIENDA", color: "#4F46E5" },
    2: { name: "COMIDA", color: "#10B981" },
    3: { name: "TRANSPORTE", color: "#F59E0B" },
    4: { name: "SUSCRIPCIONES", color: "#EF4444" },
    5: { name: "SALUD", color: "#8B5CF6" },
    6: { name: "ASEO", color: "#EC4899" },
    7: { name: "OCIO", color: "#0EA5E9" },
    8: { name: "EDUCACION", color: "#22C55E" },
    9: { name: "OTROS", color: "#6B7280" },
};

export default function Charts() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [periodType, setPeriodType] = useState("month");
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (loading) {
            return;
        }
        if (!user) {
            router.push("/signin");
            return;
        }

        const fetchExpenses = async () => {
            setFetching(true);
            try {
                let url = `https://cashtrackapi.onrender.com/api/expenses?userId=${user.id}`;

                if (periodType === "month") {
                    url += `&month=${month}&year=${year}`;
                } else {
                    url += `&year=${year}`;
                }

                if (selectedCategory) {
                    url += `&category=${selectedCategory}`;
                }

                const res = await fetch(url);
                const data = await res.json();
                setExpenses(data);
            } catch (err) {
                console.error("Error fetching expenses: ", err);
            } finally {
                setFetching(false);
            }
        };

        fetchExpenses();
    }, [user, loading, router, periodType, month, year, selectedCategory]);

    if (loading) {
        return <p className="text-center mt-8">Cargando...</p>;
    }

    if (!user) {
        return null;
    }

    const pieData = Object.values(
        expenses.reduce((acc, e) => {
            const cat = CATEGORY_COLORS_MAP[e.category];
            if (!cat) {
                return acc;
            }
            if (!acc[e.category]) {
                acc[e.category] = {
                    name: cat.name,
                    value: e.quantity,
                    color: cat.color,
                };
            } else {
                acc[e.category].value += e.quantity;
            }
            return acc;
        }, {})
    );

    const buildPeriods = () => {
        const array = [];

        if (periodType === "month") {
            const thisYear = today.getFullYear();
            const thisMonth = today.getMonth() + 1;
            array.push({
                label: "Este mes",
                value: { year: thisYear, month: thisMonth },
            });

            var pmYear = thisYear;
            var pmMonth = thisMonth - 1;

            if (pmMonth === 0) {
                pmYear -= 1;
                pmMonth = 12;
            }
            array.push({
                label: "Mes pasado",
                value: { year: pmYear, month: pmMonth },
            });

            var y = pmYear;
            var m = pmMonth;

            const monthNames = [
                "Ene",
                "Feb",
                "Mar",
                "Abr",
                "May",
                "Jun",
                "Jul",
                "Ago",
                "Sep",
                "Oct",
                "Nov",
                "Dic",
            ];

            for (let i = 0; i < 4; i++) {
                m -= 1;
                if (m === 0) {
                    y -= 1;
                    m = 12;
                }
                array.push({
                    label: `${monthNames[m - 1]}${y}`,
                    value: { year: y, month: m },
                });
            }
        } else {
            const thisYear = today.getFullYear();
            array.push({ label: "Este año", value: { year: thisYear } });
            array.push({ label: "Año pasado", value: { year: thisYear - 1 } });

            for (let i = 2; i < 6; i++) {
                array.push({
                    label: `${thisYear - i}`,
                    value: { year: thisYear - i },
                });
            }
        }

        return array;
    };

    const periods = buildPeriods();

    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="bg-white border-b border-gray-200 px-8 py-4">
                <h1 className="text-2xl font-bold text-center">Gráficos</h1>
            </header>
            <div className="flex justify-center space-x-4 bg-white py-4 border-b border-gray-200">
                <button
                    onClick={() => setPeriodType("month")}
                    className={`px-4 py-2 rounded-lg font-medium ${
                        periodType === "month"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700"
                    }`}
                >
                    Mes
                </button>
                <button
                    onClick={() => setPeriodType("year")}
                    className={`px-4 py-2 rounded-lg font-medium ${
                        periodType === "year"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700"
                    }`}
                >
                    Año
                </button>
            </div>
            <div className="overflow-x-auto bg-white py-2 border-b border-gray-200">
                <div className="flex space-x-3 px-4">
                    {periods.map((p, idx) => {
                        const isSelected =
                            periodType === "month"
                                ? p.value.year === year &&
                                  p.value.month === month
                                : p.value.year === year;
                        return (
                            <button
                                key={idx}
                                onClick={() => {
                                    if (periodType === "month") {
                                        setYear(p.value.year);
                                        setMonth(p.value.month);
                                    } else {
                                        setYear(p.value.year);
                                    }
                                }}
                                className={`whitespace-nowrap px-3 py-1 rounded-lg font-medium ${
                                    isSelected
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                            >
                                {p.label}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="px-8 py-4">
                <button
                    onClick={() => setShowCategoryModal(true)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                    {selectedCategory
                        ? `Categoría: ${CATEGORY_COLORS_MAP[selectedCategory].name}`
                        : "Seleccionar categoría"}
                </button>
            </div>
            <div className="px-8 py-4 h-64">
                {fetching ? (
                    <p className="text-center">Cargando gráfico…</p>
                ) : pieData.length === 0 ? (
                    <p className="text-center">No hay datos para mostrar</p>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {pieData.map((entry, idx) => (
                                    <Cell key={idx} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) => `€${value.toFixed(2)}`}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
            <div className="px-8 py-4 space-y-4">
                {fetching ? null : expenses.length === 0 ? null : (
                    <ul className="space-y-4">
                        {expenses.map((expense) => (
                            <ExpenseItem
                                key={expense.id}
                                date={expense.created_at}
                                category={expense.category}
                                quantity={expense.quantity}
                            />
                        ))}
                    </ul>
                )}
            </div>
            {showCategoryModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-80 max-w-full p-6">
                        <h2 className="text-lg font-semibold mb-4">
                            Seleccionar Categoría
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(CATEGORY_COLORS_MAP).map(
                                ([catId, { name }]) => (
                                    <button
                                        key={catId}
                                        onClick={() => {
                                            setSelectedCategory(Number(catId));
                                            setShowCategoryModal(false);
                                        }}
                                        className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 text-left"
                                    >
                                        {name}
                                    </button>
                                )
                            )}
                            <button
                                onClick={() => {
                                    setSelectedCategory(null);
                                    setShowCategoryModal(false);
                                }}
                                className="col-span-2 mt-4 px-3 py-2 bg-red-100 rounded hover:bg-red-200 text-center"
                            >
                                Quitar filtro
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
