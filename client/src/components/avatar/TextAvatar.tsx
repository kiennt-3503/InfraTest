type TextAvatarProps = {
  avatarContent: string;
  backgroundColor: string;
  textColor: string;
  fontSize?: number;
  onClick?: () => void;
};

const TextAvatar: React.FC<TextAvatarProps> = ({
  avatarContent,
  backgroundColor,
  textColor,
  fontSize,
  onClick,
}) => {
  const initials = avatarContent.slice(0, 1).toUpperCase();

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-center rounded-full font-semibold shadow-inner transition-all hover:brightness-105"
      style={{
        backgroundColor,
        color: textColor,
        width: "100%",
        height: "100%",
        fontSize: fontSize ? `${fontSize}rem` : "5rem",
        fontFamily: "Cinzel, 'Yeseva One', serif",
      }}
    >
      {initials}
    </div>
  );
};

export default TextAvatar;
