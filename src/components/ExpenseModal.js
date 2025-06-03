import { useState } from "react";
import { X } from "lucide-react";
import CATEGORY_MAP from "@/app/utils/Utils";

export default function ExpenseModal({ onClose, onAdd }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [amount, setAmount] = useState("");

    const handleAdd = () => {
        const quantity = parseFloat(amount);
        if (!selectedCategory || isNaN(quantity) || quantity <= 0) {
            alert("Selecciona una categoria / Escribe una cantidad válida");
            return;
        }
        onAdd({ category: selectedCategory, quantity });
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black"
                >
                    <X />
                </button>
                <h2 className="text-xl font-bold mb-4 text-center">
                    Agregar gasto
                </h2>

                <div className="grid grid-cols-3 gap-4 mb-4">
                    {Object.values(CATEGORY_MAP).map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => setSelectedCategory(cat.name)}
                            className={`flex flex-col items-center justify-center p-3 rounded border transition-colors ${
                                selectedCategory === cat.name
                                    ? "bg-blue-100 border-blue-600"
                                    : "bg-gray-100 border-gray-200"
                            }`}
                        >
                            <cat.icon className="w-6 h-6 mb-1" />
                            <span className="text-sm text-center">
                                {cat.name}
                            </span>
                        </button>
                    ))}
                </div>

                <input
                    type="number"
                    placeholder="Cantidad (€)"
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                />

                <button
                    onClick={handleAdd}
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Agregar gasto
                </button>
            </div>
        </div>
    );
}
