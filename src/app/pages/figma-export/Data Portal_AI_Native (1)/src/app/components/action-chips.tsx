import { Button } from './ui/button';
import { Plus, Code, ExternalLink, CheckSquare, Save, BookOpen } from 'lucide-react';

interface ActionChipsProps {
  onCreateDashboard?: () => void;
  onShowSQL?: () => void;
  onOpenInStudio?: () => void;
  onVerifyAsset?: () => void;
  onSaveToDiscovery?: () => void;
  onOpenInNotebook?: () => void;
}

export function ActionChips({
  onCreateDashboard,
  onShowSQL,
  onOpenInStudio,
  onVerifyAsset,
  onSaveToDiscovery,
  onOpenInNotebook,
}: ActionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {onCreateDashboard && (
        <Button
          variant="outline"
          size="sm"
          onClick={onCreateDashboard}
          className="gap-2 h-8 text-xs"
        >
          <Plus className="w-3 h-3" />
          Create dashboard
        </Button>
      )}
      {onShowSQL && (
        <Button
          variant="outline"
          size="sm"
          onClick={onShowSQL}
          className="gap-2 h-8 text-xs"
        >
          <Code className="w-3 h-3" />
          Show SQL
        </Button>
      )}
      {onOpenInStudio && (
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenInStudio}
          className="gap-2 h-8 text-xs"
        >
          <ExternalLink className="w-3 h-3" />
          Open in SQL Studio
        </Button>
      )}
      {onVerifyAsset && (
        <Button
          variant="outline"
          size="sm"
          onClick={onVerifyAsset}
          className="gap-2 h-8 text-xs"
        >
          <CheckSquare className="w-3 h-3" />
          Verify asset
        </Button>
      )}
      {onSaveToDiscovery && (
        <Button
          variant="outline"
          size="sm"
          onClick={onSaveToDiscovery}
          className="gap-2 h-8 text-xs"
        >
          <Save className="w-3 h-3" />
          Save to Discovery
        </Button>
      )}
      {onOpenInNotebook && (
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenInNotebook}
          className="gap-2 h-8 text-xs"
        >
          <BookOpen className="w-3 h-3" />
          Open in Notebook
        </Button>
      )}
    </div>
  );
}
