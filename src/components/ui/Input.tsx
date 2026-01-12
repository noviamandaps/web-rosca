interface InputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
  required?: boolean;
  name?: string;
}

export function Input({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  className = '',
  required = false,
  name,
}: InputProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-xs font-medium uppercase tracking-wider text-brand-dark">
          {label}
          {required && <span className="text-ui-error ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-brand-border px-4 py-3 text-sm text-brand-dark placeholder:text-brand-gray focus:border-brand-black focus:outline-none transition-colors"
      />
      {error && (
        <span className="text-2xs text-ui-error">{error}</span>
      )}
    </div>
  );
}
