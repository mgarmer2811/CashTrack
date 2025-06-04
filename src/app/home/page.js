// app/page.jsx (Home)
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../utils/AuthProvider";
import supabase from "../utils/supabaseClient";
import ExpenseItem from "@/components/ExpenseItem";
import Header from "@/components/Header";
import { PlusIcon } from "lucide-react";
import ExpenseCreateModal from "@/components/ExpenseCreateModal";
import ExpenseMenuModal from "@/components/ExpenseMenuModal";

export default function Home() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [fetching, setFetching] = useState(true);
    const today = new Date();
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [year, setYear] = useState(today.getFullYear());
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showOptionModal, setShowOptionModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedExpenseId, setSelectedExpenseId] = useState(null);

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
                let url = `https://cashtrackapi.onrender.com/api/expenses?userId=${user.id}&month=${month}&year=${year}`;
                if (selectedCategory) {
                    url += `&category=${selectedCategory}`;
                }
                const response = await fetch(url);
                const data = await response.json();
                setExpenses(data);
            } catch (error) {
                console.error("Error fetching expenses:\n", error);
            } finally {
                setFetching(false);
            }
        };
        fetchExpenses();
    }, [user, loading, router, month, year, selectedCategory]);

    function getSelectedExpense() {
        return expenses.find((exp) => exp.id === selectedExpenseId);
    }

    function handleExpenseClick(expenseId) {
        setSelectedExpenseId(expenseId);
        setShowOptionModal(true);
    }

    async function handleDeleteExpense() {
        try {
            const res = await fetch(
                `https://cashtrackapi.onrender.com/api/expenses/${selectedExpenseId}`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                }
            );
            if (!res.ok) {
                throw new Error("Error al eliminar el gasto");
            }
            setExpenses((prev) =>
                prev.filter((expense) => expense.id !== selectedExpenseId)
            );
        } catch (err) {
            alert("No se pudo eliminar el gasto");
            console.error(err);
        } finally {
            setShowOptionModal(false);
            setSelectedExpenseId(null);
        }
    }

    async function handleEditExpense({ category, quantity, date }) {
        try {
            const res = await fetch(
                `https://cashtrackapi.onrender.com/api/expenses/${selectedExpenseId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        category,
                        quantity,
                        created_at: date,
                    }),
                }
            );
            if (!res.ok) throw new Error("Error al editar gasto");
            const updatedExpense = await res.json();
            setExpenses((prev) =>
                prev.map((exp) =>
                    exp.id === selectedExpenseId ? updatedExpense : exp
                )
            );
        } catch (err) {
            alert("No se pudo actualizar el gasto");
            console.error(err);
        } finally {
            setShowEditModal(false);
            setSelectedExpenseId(null);
        }
    }

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
                    selectedCategory={selectedCategory}
                    onChangeCategory={setSelectedCategory}
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
                                    id={expense.id}
                                    date={expense.created_at}
                                    category={expense.category}
                                    quantity={expense.quantity}
                                    onClick={handleExpenseClick}
                                />
                            ))}
                        </ul>
                    )}
                </main>
                <button
                    onClick={() => {
                        setShowModal(true);
                    }}
                    className="fixed bottom-16 right-6 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 z-10"
                >
                    <PlusIcon className="w-6 h-6" />
                </button>
            </div>
            {showModal && (
                <ExpenseCreateModal
                    onClose={() => setShowModal(false)}
                    onAdd={async ({ category, quantity }) => {
                        try {
                            const res = await fetch(
                                "https://cashtrackapi.onrender.com/api/expenses",
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        userId: user.id,
                                        category,
                                        quantity,
                                        created_at: new Date().toISOString(),
                                    }),
                                }
                            );
                            if (!res.ok) {
                                throw new Error("Error al guardar gasto");
                            }
                            const newExpense = await res.json();
                            setExpenses((prev) => [newExpense, ...prev]);
                        } catch (err) {
                            alert("Error al añadir gasto");
                            console.error(err);
                        }
                    }}
                />
            )}
            {showOptionModal && (
                <ExpenseMenuModal
                    onClose={() => {
                        setShowOptionModal(false);
                    }}
                    onDelete={handleDeleteExpense}
                    onEdit={() => {
                        setShowOptionModal(false);
                        setShowEditModal(true);
                    }}
                />
            )}
            {showEditModal && (
                <ExpenseCreateModal
                    onClose={() => {
                        setShowEditModal(false);
                    }}
                    onUpdate={handleEditExpense}
                    initialCategory={getSelectedExpense().category}
                    initialAmount={getSelectedExpense().quantity}
                    initialDate={getSelectedExpense().created_at}
                />
            )}
        </div>
    );
}
