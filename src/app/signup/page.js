"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../utils/supabaseClient";
import DollarIcon from "@/components/DollarIcon";
import EmailIcon from "@/components/EmailIcon";
import PasswordIcon from "@/components/PasswordIcon";

export default function SignUpPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [iconColor, setIconColor] = useState("#2563EB");

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        setLoading(false);
        if (error) {
            setErrorMsg(error.message);
        } else {
            alert("¡Registro exitoso! Revisa tu correo para confirmar.");
            router.push("/signin");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-xl border border-gray-200">
                <div className="flex justify-center mb-6">
                    <DollarIcon />
                </div>
                <h1
                    className="text-2xl font-bold text-center mb-2"
                    style={{ color: iconColor }}
                >
                    CashTrack
                </h1>
                <p className="text-sm text-gray-500 text-center mb-6">
                    Crea tu cuenta para empezar a usar CashTrack
                </p>

                <form onSubmit={handleSignUp} className="space-y-5">
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
                        <EmailIcon pcolor={iconColor} />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full ml-3 outline-none"
                        />
                    </div>

                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
                        <PasswordIcon pcolor={iconColor} />
                        <input
                            type="password"
                            placeholder="Password (mínimo 6 caracteres)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full ml-3 outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded-lg text-white font-bold ${
                            loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {loading ? "Registrando..." : "Registrarse"}
                    </button>

                    {errorMsg && (
                        <p className="text-red-500 text-sm text-center">
                            {errorMsg}
                        </p>
                    )}
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                    ¿Ya tienes una cuenta?{" "}
                    <a href="/signin" className="text-blue-600">
                        <u>Inicia sesión</u>
                    </a>
                </p>
            </div>
        </div>
    );
}
