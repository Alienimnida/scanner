interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export const LoadingSpinner = ({ size = "md", text }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex flex-grow items-center justify-center gap-2 min-h-[200px]">
      <div
        className={`border-2 border-white/30 border-t-white rounded-full animate-spin ${sizeClasses[size]}`}
      ></div>
      {text && <span>{text}</span>}
    </div>
  );
};
