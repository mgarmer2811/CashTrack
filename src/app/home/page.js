"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../utils/AuthProvider";
import supabase from "../utils/supabaseClient";
import ExpenseItem from "@/components/ExpenseItem";
import Header from "@/components/Header";
import { PlusIcon } from "lucide-react";
import ExpenseModal from "@/components/ExpenseModal";

export default function DashboardPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [fetching, setFetching] = useState(true);
    const today = new Date();
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [year, setYear] = useState(today.getFullYear());
    const [showModal, setShowModal] = useState(false);

    let total = 0;
    for (const expense of expenses) {
        total += expense.quantity;
    }

    useEffect(() => {
        if (loading) return;
        if (!user) {
            router.push("/signin");
            return;
        }
        const fetchExpenses = async () => {
            setFetching(true);
            try {
                const response = await fetch(
                    `https://cashtrackapi.onrender.com/api/expenses?userId=${user.id}&month=${month}&year=${year}`
                );
                const data = await response.json();
                setExpenses(data);
            } catch (error) {
                console.error("Error fetching expenses:\n", error);
            } finally {
                setFetching(false);
            }
        };
        fetchExpenses();
    }, [user, loading, router, month, year]);

    if (loading) {
        return <p className="text-center mt-8">Cargando...</p>;
    }

    return (
        <div>
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Header
                    month={month}
                    year={year}
                    onChangeMonthYear={({ month: newM, year: newY }) => {
                        setMonth(newM);
                        setYear(newY);
                    }}
                    total={total}
                />
                <main className="flex-grow max-w-lg mx-auto p-8 mt-20">
                    {fetching ? (
                        <p className="text-center">Cargando tus gastos...</p>
                    ) : expenses.length === 0 ? (
                        <p className="text-center">Aún no tienes gastos</p>
                    ) : (
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
                    <button
                        onClick={async () => {
                            await supabase.auth.signOut();
                            router.push("/signin");
                        }}
                        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Sign Out
                    </button>
                </main>
                <button
                    onClick={() => {
                        setShowModal(true);
                    }}
                    className="fixed bottom-16 right-6 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 z-10"
                >
                    <PlusIcon className="w-6 h-6" />
                </button>
            </div>
            {showModal && (
                <ExpenseModal
                    onClose={() => setShowModal(false)}
                    onAdd={async ({ category, quantity }) => {
                        try {
                            const res = await fetch(
                                "https://cashtrackapi.onrender.com/api/expenses",
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application-json",
                                    },
                                    body: JSON.stringify({
                                        userId: user.id,
                                        category,
                                        quantity,
                                        created_at: new Date().toISOString(),
                                    }),
                                }
                            );

                            if (!res.ok)
                                throw new Error("Error al guardar gasto");

                            const newExpense = await res.json();
                            setExpenses((prev) => [newExpense, ...prev]);
                        } catch (err) {
                            alert("Error al añadir gasto");
                            console.error(err);
                        }
                    }}
                />
            )}
        </div>
    );
}
