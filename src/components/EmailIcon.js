import { EnvelopeIcon } from "@heroicons/react/24/outline";

export default function EmailIcon({ pcolor = "#2563EB" }) {
    return (
        <div>
            <EnvelopeIcon className="w-5 h-5" style={{ color: pcolor }} />
        </div>
    );
}
