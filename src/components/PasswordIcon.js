import { LockClosedIcon } from "@heroicons/react/24/outline";

export default function PasswordIcon({ pcolor = "#2563EB" }) {
    return (
        <div>
            <LockClosedIcon className="w-5 h-5" style={{ color: pcolor }} />
        </div>
    );
}
