interface EmptyStateProps {
  message: string;
}
export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="text-center p-10 border-2 border-dashed border-slate-200 rounded-xl">
      <p className="text-slate-500">{message}</p>
    </div>
  );
}