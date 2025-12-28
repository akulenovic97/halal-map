type CheckboxOptionProps = {
  checked: boolean;
  onChange: () => void;
  icon?: string;
  label: string;
};

export function CheckboxOption({
  checked,
  onChange,
  icon,
  label,
}: CheckboxOptionProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded px-2 py-2 hover:bg-gray-50">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="text-halal-green-600 focus:ring-halal-green-600 h-4 w-4 cursor-pointer rounded border-gray-300 focus:ring-2 focus:ring-offset-0"
        aria-label={`${label} ${checked ? 'selected' : 'not selected'}`}
      />
      {icon && (
        <span className="text-lg" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="flex-1 text-sm font-medium text-gray-900">{label}</span>
    </label>
  );
}
