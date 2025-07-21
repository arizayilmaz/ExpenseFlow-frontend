import { FaSpinner } from 'react-icons/fa';

export function Spinner() {
  return (
    <div className="flex justify-center items-center p-10">
      <FaSpinner className="animate-spin h-8 w-8 text-blue-600" />
    </div>
  );
}