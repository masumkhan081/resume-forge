import { cn } from '@/lib/utils';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-[2rem] border border-white/80 bg-white/85 shadow-panel backdrop-blur', className)} {...props} />;
}
