"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../utils/AuthProvider";
import supabase from "../utils/supabaseClient";
import ExpenseItem from "@/components/ExpenseItem";

export default function DashboardPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
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
                const response = await fetch(
                    `https://cashtrackapi.onrender.com/api/expenses?userId=${user.id}&month=6&year=2025`
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
    }, [user, loading, router]);

    if (loading) {
        return <p className="text-center mt-8">Cargando...</p>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="max-w-lg mx-auto p-8">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p>
                Bienvenido, <strong>{user.email}</strong>!
            </p>
            <button
                onClick={async () => {
                    await supabase.auth.signOut();
                    router.push("/signin");
                }}
                className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
                Sign Out
            </button>
            <div className="mt-8">
                {fetching ? (
                    <p className="text-center">Cargando tus gastos...</p>
                ) : expenses.length === 0 ? (
                    <p className="text-center">No tienes gastos ma boi</p>
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
            </div>
        </div>
    );
}
