interface ColorInputProps {
  label: string;
  value: string;
  handleColorChange: (color: string) => void;
}

const ColorInput: React.FC<ColorInputProps> = ({ label, value, handleColorChange }) => {
  return (
    <div className="grid grid-cols-2 w-60 items-center">
      <label className="block text-sm text-[#7b1e1e]">{label}</label>
      <label className="relative block w-8 h-8 rounded-full overflow-hidden cursor-pointer border-2 border-gray-300">
        <input
          type="color"
          value={value}
          onChange={(e) => handleColorChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className="w-full h-full"
          style={{ backgroundColor: value }}
        />
      </label>
    </div>
  );
};

export default ColorInput;
