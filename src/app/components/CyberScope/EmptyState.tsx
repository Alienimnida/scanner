import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export const EmptyState = ({ icon, title, description }: EmptyStateProps) => {
  return (
    <div className="p-8 text-center text-gray-400">
      <div className="mx-auto mb-4">
        {icon}
      </div>
      <p className="text-lg">{title}</p>
      <p className="text-sm">{description}</p>
    </div>
  );
};