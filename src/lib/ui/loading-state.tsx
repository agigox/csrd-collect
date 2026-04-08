"use client";
const LoadingState = ({ message }: { message: string }) => {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3"
      style={{ height: "100%" }}
    >
      <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
      <span className="text-sm text-content-secondary">{message}</span>
    </div>
  );
};
export default LoadingState;
