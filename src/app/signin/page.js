"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../utils/supabaseClient";

export default function SignInPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);
        if (error) {
            setErrorMsg(error.message);
        } else {
            router.push("/home");
        }
    };

    return (
        <div className="max-w-md mx-auto p-8">
            <h1 className="text-2xl font-bold mb-4">Sign In</h1>
            <form onSubmit={handleSignIn} className="flex flex-col space-y-4">
                <label className="flex flex-col">
                    <span>Email</span>
                    <input
                        type="email"
                        className="border rounded px-2 py-1"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>

                <label className="flex flex-col">
                    <span>Password</span>
                    <input
                        type="password"
                        className="border rounded px-2 py-1"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className={`py-2 rounded text-white ${
                        loading
                            ? "bg-gray-400"
                            : "bg-green-600 hover:bg-green-700"
                    }`}
                >
                    {loading ? "Ingresando..." : "Sign In"}
                </button>

                {errorMsg && <p className="text-red-500">{errorMsg}</p>}
            </form>
        </div>
    );
}
