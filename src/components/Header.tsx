import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  backHref?: string;
  rightAction?: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = true,
  backHref = '/',
  rightAction,
  subtitle,
  className = ''
}) => {
  return (
    <div className={`bg-primary-600 text-white p-4 ${className}`}>
      <div className="flex items-center justify-between">
        {showBackButton ? (
          <Link href={backHref}>
            <ArrowLeft className="w-6 h-6" />
          </Link>
        ) : (
          <div className="w-6" />
        )}
        
        <div className="text-center flex-1">
          <h1 className="text-lg font-semibold">{title}</h1>
          {subtitle && (
            <p className="text-sm text-primary-100 mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className="w-6 flex justify-end">
          {rightAction}
        </div>
      </div>
    </div>
  );
};
