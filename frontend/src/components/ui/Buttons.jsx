const Button = ({
  icon,
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
}) => {

  const baseStyle =
    "flex items-center gap-2 rounded-xl h-10 md:h-12 px-4 md:px-6 text-sm md:text-base font-bold transition-all active:scale-95";

  const variants = {
    primary:
      "bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02]",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger:
      "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {icon && (
        <span className="material-symbols-outlined">
          {icon}
        </span>
      )}

      {children}
    </button>
  );
};

export default Button;