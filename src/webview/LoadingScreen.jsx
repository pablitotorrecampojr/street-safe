
export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div
        className="w-20 h-20 border-8 border-blue-500 border-t-transparent rounded-full animate-spin"
        role="status"
      >
      </div>
    </div>
  );
}
