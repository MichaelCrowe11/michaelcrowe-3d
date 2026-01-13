'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen bg-[#060607] flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
          <p className="text-white/60 mb-4">{error.message}</p>
          {error.digest && (
            <p className="text-white/40 text-sm mb-4">Error ID: {error.digest}</p>
          )}
          <button
            onClick={reset}
            className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
