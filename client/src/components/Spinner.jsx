const Spinner = ({ size = "md", color = "blue", className = "" }) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
  };

  const colorClasses = {
    blue: "border-blue-600 border-t-transparent",
    gray: "border-gray-500 border-t-transparent",
    white: "border-white border-t-transparent",
    red: "border-red-600 border-t-transparent",
  };

  return (
    <div
      className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    />
  );
};

export default Spinner;
