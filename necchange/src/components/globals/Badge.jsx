const Badge = ({ variant, children }) => {
  const variants = {
    green: ["text-green-800 bg-green-100", "bg-green-500"],
    yellow: ["text-yellow-800 bg-yellow-100", "bg-yellow-500"],
    red: ["text-red-800 bg-red-100", "bg-red-500"],
  };

  const [textColor, bgColor] = variants[variant];
  return (
    <span
      className={`flex items-center text-xs font-semibold rounded-full py-1 px-2 ${textColor}`}
    >
      <div className={`h-[6px] w-[6px] rounded-full mr-1 ${bgColor}`} />
      {children}
    </span>
  );
};

export default Badge;
