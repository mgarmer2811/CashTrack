import { CurrencyDollarIcon } from "@heroicons/react/24/outline"

export default function DollarIcon({ pcolor = "#2563EB" }) {
  return (
    <div>
      <CurrencyDollarIcon className="w-14 h-14" style={{ color: pcolor }} />
    </div>
  )
}
