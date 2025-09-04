interface AvatarModalButtonProps {
  label: string;
  color: string;
  hoverColor: string;
  onClick: () => void;
  disabled?: boolean;
  isPreventDefault?: boolean;
  isStopPropagation?: boolean;
}

const AvatarModalButton: React.FC<AvatarModalButtonProps> = ({ label, color, hoverColor, onClick, disabled, isPreventDefault, isStopPropagation }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (isPreventDefault) {
      e.preventDefault();
    }
    if (isStopPropagation) {
      e.stopPropagation();
    }
    onClick();
  };

  return (
    <button
      className={`px-4 py-2 text-sm ${color} border border-[#7b1e1e] text-[#7b1e1e] rounded-md transition ${
        disabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : `hover:${hoverColor} hover:text-white`
        }`
      }
      onClick={handleClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default AvatarModalButton;
