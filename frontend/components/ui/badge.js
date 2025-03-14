import { Trophy } from "lucide-react";

// components/ui/badge.js
export function Badge({ children, className = "", ...props }) {
  return (
    <div className={`justify-around ${className}`}>
      <div className="bg-violet-400 p-4 rounded-lg content-center text-center w-24">
        <Trophy className="translate-x-[20px]" />
        <div className="font-semibold text-xs">{children}</div>
      </div>
    </div>
  );
}
