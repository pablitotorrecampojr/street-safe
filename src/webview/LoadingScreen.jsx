import { useLocation } from 'react-router-dom';

export default function LoadingScreen() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const loadingText = params.get("loadingText") || "Loading...";

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div
        className="w-20 h-20 border-8 border-blue-500 border-t-transparent rounded-full animate-spin"
        role="status"
      >
        <span className="sr-only">{loadingText}</span>
      </div>
      <div className="mt-4 text-lg font-medium text-center">
        {loadingText}
      </div>
    </div>
  );
}
