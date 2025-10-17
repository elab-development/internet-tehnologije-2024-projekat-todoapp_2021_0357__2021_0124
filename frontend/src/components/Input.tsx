import React from 'react';

interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  id,
  required,
}) => {
  const inputId = id || name;
  return (
    <div className="w-full mb-4">
      <label htmlFor={inputId} className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="shadow appearance-none border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 dark:focus:border-blue-400"
      />
    </div>
  );
};

export default Input;
