import react from 'react';
export default function PageNotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 font-sans">
      <div className="w-1/3">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <h2 className="text-2xl font-bold text-gray-800">Page Not Found</h2>
        <p className="text-lg text-gray-600">The page you are looking for does not exist.</p>
      </div>
    </div>
  );
}