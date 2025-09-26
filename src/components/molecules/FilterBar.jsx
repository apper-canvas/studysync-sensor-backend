import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";

const FilterBar = ({ filters, onFilterChange, onClearFilters }) => {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border border-slate-200">
      {filters.map((filter) => (
        <div key={filter.key} className="min-w-[150px]">
          <Select
            value={filter.value}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
          >
            <option value="">{filter.placeholder}</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      ))}
      
      <Button
        variant="ghost"
        size="sm"
        icon="X"
        onClick={onClearFilters}
      >
        Clear Filters
      </Button>
    </div>
  );
};

export default FilterBar;