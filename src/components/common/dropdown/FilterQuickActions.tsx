import { Button } from 'src/components/common/Button';

type FilterQuickActionsProps = {
  onSelectAll: () => void;
  onClearAll: () => void;
  allSelected: boolean;
  noneSelected: boolean;
};

export function FilterQuickActions({
  onSelectAll,
  onClearAll,
  allSelected,
  noneSelected,
}: FilterQuickActionsProps) {
  return (
    <div className="mb-2 flex gap-2 border-b border-gray-200 pb-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onSelectAll}
        disabled={allSelected}
        className="text-halal-green-700 hover:bg-halal-green-50 flex-1 text-xs disabled:opacity-50"
      >
        Select All
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        disabled={noneSelected}
        className="flex-1 text-xs disabled:opacity-50"
      >
        Clear All
      </Button>
    </div>
  );
}
