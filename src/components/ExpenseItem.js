import categoryMap from "../app/utils/Utils";

function formatDateWithWeekday(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);
    const dt = new Date(Date.UTC(year, month - 1, day));
    const weekdayLower = dt.toLocaleDateString("es-ES", { weekday: "long" });
    const monthLower = dt.toLocaleDateString("es-ES", { month: "long" });
    const weekday =
        weekdayLower.charAt(0).toUpperCase() + weekdayLower.slice(1);
    const monthName = monthLower.charAt(0).toUpperCase() + monthLower.slice(1);
    const dayPadded = String(day).padStart(2, "0");
    return `${weekday} ${dayPadded} ${monthName}`;
}

export default function ExpenseItem({ date, category, quantity }) {
    const dateText = formatDateWithWeekday(date);
    const categoryEntry = categoryMap[category];
    const { name: CategoryName } = categoryEntry;
    const { icon: CategoryIcon } = categoryEntry;

    return (
        <div className="p-4 bg-white rounded-lg shadow-lg border border-gray-200 mb-4">
            <p className="text-xs text-gray-500">{dateText}</p>
            <div className="mt-1 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <CategoryIcon />
                    <span className="text-sm font-medium text-gray-700">
                        {CategoryName}
                    </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                    €{quantity.toFixed(2)}
                </span>
            </div>
        </div>
    );
}
