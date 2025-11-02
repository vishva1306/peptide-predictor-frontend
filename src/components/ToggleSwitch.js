import React from 'react';

export default function ToggleSwitch({ 
  options, 
  selected, 
  onChange,
  leftIcon,
  rightIcon 
}) {
  return (
    <div className="relative inline-flex items-center bg-slate-900 border border-slate-600 rounded-lg p-1">
      {/* Background sliding indicator */}
      <div
        className={`absolute top-1 bottom-1 bg-blue-600 rounded-lg transition-all duration-300 ease-in-out ${
          selected === options[0].value ? 'left-1' : 'left-1/2 ml-0.5'
        }`}
        style={{
          width: 'calc(50% - 4px)',
        }}
      />

      {/* Options */}
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`relative z-10 flex items-center gap-2 px-6 py-2 rounded-lg transition-all duration-300 ${
            selected === option.value
              ? 'text-white font-semibold'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          {option.value === options[0].value && leftIcon && (
            <span className="text-lg">{leftIcon}</span>
          )}
          {option.value === options[1].value && rightIcon && (
            <span className="text-lg">{rightIcon}</span>
          )}
          <span className="text-sm whitespace-nowrap">{option.label}</span>
        </button>
      ))}
    </div>
  );
}