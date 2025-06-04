"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../utils/supabaseClient";
import DollarIcon from "@/components/DollarIcon";

export default function SignInPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-95 bg-white p-8 mb-20 rounded-xl border border-gray-200 shadow-2xl">
                <div className="flex justify-center mb-6">
                    <DollarIcon />
                </div>
                <h1 className="text-2xl font-bold text-center mb-2 text-blue-600">
                    CashTrack
                </h1>
                <h2 className="font-semibold italic text-center text-gray-400 mb-8">
                    Pulsa para cerrar sesión
                </h2>
                <button
                    onClick={async () => {
                        await supabase.auth.signOut();
                        router.push("/signin");
                    }}
                    className="mx-auto w-full py-3 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-red-700 transition"
                >
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
}
