interface ErrorMessageProps {
  error: string | null;
  setError: (error: string | null) => void;
}

const ErrorMessage = ({ error, setError }: ErrorMessageProps) => {
  return (
    <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <span className="text-red-500">⚠️</span>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
        <div className="ml-auto pl-3">
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorMessage;
