// components/ui/input.js
export function Input({ type = 'text', placeholder = '', className = '', ...props }) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className={`border p-2 rounded-md w-full outline-none focus:border-blue-500 ${className}`}
            {...props}
        />
    );
}
