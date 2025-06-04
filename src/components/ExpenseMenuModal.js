import { X } from "lucide-react";

export default function ExpenseMenuModal({ onClose, onDelete, onEdit }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-xs relative shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black"
                >
                    <X />{" "}
                </button>
                <h2 className="text-lg font-semibold mb-4 text-center">
                    ¿Qué deseas hacer?
                </h2>
                <button
                    onClick={() => {
                        onDelete();
                    }}
                    className="w-full mb-3 bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700"
                >
                    Eliminar gasto
                </button>
                <button
                    onClick={onEdit}
                    className="w-full bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700"
                >
                    Editar gasto
                </button>
            </div>
        </div>
    );
}
