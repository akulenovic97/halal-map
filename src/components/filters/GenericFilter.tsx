import type { VenueFilters } from 'src/types/filter';
import type { FilterConfig } from 'src/config/filterConfig';
import { Button } from 'src/components/common/Button';
import { Badge } from 'src/components/common/Badge';
import { DropdownMenu } from 'src/components/common/dropdown/DropdownMenu';
import { FilterQuickActions } from 'src/components/common/dropdown/FilterQuickActions';
import { CheckboxOption } from 'src/components/common/dropdown/CheckboxOption';

type GenericFilterProps<T> = {
  config: FilterConfig<T>;
  filters: VenueFilters;
  onToggle: (value: T) => void;
  onSetValues: (values: T[]) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function GenericFilter<T extends string>({
  config,
  filters,
  onToggle,
  onSetValues,
  isOpen,
  onOpenChange,
}: GenericFilterProps<T>) {
  const selectedValues = (filters[config.key] || []) as T[];
  const selectedCount = selectedValues.length;
  const allSelected = selectedCount === config.options.length;

  const handleSelectAll = () => {
    onSetValues(config.options.map(option => option.value));
  };

  const handleClearAll = () => {
    onSetValues([]);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onOpenChange(!isOpen)}
        className="flex items-center gap-2"
      >
        {config.label}
        {selectedCount > 0 && (
          <Badge variant="halal">{allSelected ? 'All' : selectedCount}</Badge>
        )}
      </Button>
      <DropdownMenu isOpen={isOpen} onOpenChange={onOpenChange}>
        <FilterQuickActions
          onSelectAll={handleSelectAll}
          onClearAll={handleClearAll}
          allSelected={allSelected}
          noneSelected={selectedCount === 0}
        />
        <div className="space-y-1">
          {config.options.map(option => (
            <CheckboxOption
              key={option.value}
              checked={selectedValues.includes(option.value)}
              onChange={() => onToggle(option.value)}
              icon={option.icon}
              label={option.label}
            />
          ))}
        </div>
      </DropdownMenu>
    </div>
  );
}
