import { Card } from '@/components/ui/card';
import { LinkButton } from '@/components/ui/link-button';
import { PageHeader } from '@/components/ui/page-header';
import { AutosaveIndicator } from './autosave-indicator';
import type { AutosaveStatus } from '@/lib/hooks/use-autosave';

export function BuilderHeader({
  name,
  completedSections,
  totalSections,
  autosave,
}: {
  name: string;
  completedSections: number;
  totalSections: number;
  autosave: {
    status: AutosaveStatus;
    errorMessage?: string;
    lastSavedAt: Date | null;
    onRetry: () => void;
  };
}) {
  const description = `${completedSections} of ${totalSections} sections complete · changes save automatically.`;

  return (
    <Card className="space-y-4 p-5 sm:p-6">
      <PageHeader
        eyebrow="Editing"
        title={name}
        description={description}
        action={
          <LinkButton href="/dashboard" variant="secondary" size="sm" className="shrink-0">
            Dashboard
          </LinkButton>
        }
      />
      <div className="flex items-center">
        <AutosaveIndicator
          status={autosave.status}
          errorMessage={autosave.errorMessage}
          lastSavedAt={autosave.lastSavedAt}
          onRetry={autosave.onRetry}
        />
      </div>
    </Card>
  );
}
