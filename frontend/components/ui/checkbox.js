// components/ui/checkbox.js
export function Checkbox({ id, className = '', ...props }) {
    return (
        <input
            type="checkbox"
            id={id}
            className={`h-4 w-4 border-gray-300 rounded focus:ring-blue-500 ${className}`}
            {...props}
        />
    );
}
