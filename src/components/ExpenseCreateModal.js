import { useState } from "react";
import { X } from "lucide-react";
import CATEGORY_MAP from "@/app/utils/Utils";

export default function ExpenseCreateModal({
    onClose,
    onAdd,
    onUpdate,
    initialCategory,
    initialAmount,
    initialDate,
}) {
    const [selectedCategory, setSelectedCategory] = useState(
        initialCategory || null
    );
    const [selectedCategoryString, setSelectedCategoryString] = useState(null);
    const [amount, setAmount] = useState(
        initialAmount !== undefined ? String(initialAmount) : ""
    );
    const [selectedDate, setSelectedDate] = useState(
        initialDate || new Date().toISOString().slice(0, 10)
    );

    const handleSubmit = () => {
        const quantity = parseFloat(amount);
        if (!selectedCategory || isNaN(quantity) || quantity <= 0) {
            alert("Selecciona una categoria / Escribe una cantidad válida");
            return;
        }

        if (initialCategory !== undefined) {
            onUpdate({
                category: selectedCategory,
                quantity,
                date: selectedDate,
            });
        } else {
            onAdd({ category: selectedCategory, quantity });
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl w-full max-w-md relative shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black"
                >
                    <X />
                </button>
                <h2 className="text-xl font-semibold mb-4 text-center">
                    {initialCategory !== undefined
                        ? "Editar gasto"
                        : "Agregar gasto"}
                </h2>
                {initialDate !== undefined && (
                    <input
                        type="date"
                        className="w-full p-w border border-gray-300 rounded mb-4"
                        value={selectedDate}
                        onChange={(e) => {
                            setSelectedDate(e.target.value);
                        }}
                    />
                )}
                <div className="grid grid-cols-3 gap-4 mb-4">
                    {Object.values(CATEGORY_MAP).map((cat, index) => (
                        <button
                            key={cat.name}
                            onClick={() => {
                                setSelectedCategory(index + 1);
                                setSelectedCategoryString(cat.name);
                            }}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-colors ${
                                selectedCategoryString === cat.name
                                    ? "bg-blue-100 border-blue-600"
                                    : "bg-gray-100 border-gray-200"
                            }`}
                        >
                            <cat.icon className="w-6 h-6 mb-1" />
                            <span className="text-xs text-center">
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
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    {initialCategory !== undefined
                        ? "Guardar cambios"
                        : "Agregar gasto"}
                </button>
            </div>
        </div>
    );
}
