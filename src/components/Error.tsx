export interface ErrorProps {
  message: string;
}

export default function Error({ message }: ErrorProps) {
  return <div className="mb-4 text-red-500">{message}</div>;
}
