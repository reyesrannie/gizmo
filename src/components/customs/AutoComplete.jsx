import { Controller } from "react-hook-form";
import {
  Autocomplete as MuiAutocomplete,
  createFilterOptions,
} from "@mui/material";

const Autocomplete = ({
  disabled,
  name,
  control,
  error,
  helpertext,
  className,
  loading,
  maxOptionsToShow,
  filterBy,
  ...autocomplete
}) => {
  const { multiple } = autocomplete;
  const defaultFilterOptions = createFilterOptions();

  const filterOptions = (options, state) => {
    const filteredOptions = defaultFilterOptions(options, state).slice(0);
    const sortedOptions = filteredOptions.sort((a, b) => {
      const labelA = a?.general_info?.full_id_number
        ? a?.general_info?.full_id_number?.toString().toLowerCase()
        : "";
      const labelB = b?.general_info?.full_id_number
        ? b?.general_info?.full_id_number?.toString().toLowerCase()
        : "";
      return labelA.localeCompare(labelB);
    });
    // return defaultFilterOptions(options, state).slice(0, OPTIONS_LIMIT);
    return sortedOptions;
  };

  const filterName = (options, state) => {
    const filteredOptions = defaultFilterOptions(options, state).slice(0);
    const sortedOptions = filteredOptions.sort((a, b) => {
      const nameA = a?.name ? a.name.toLowerCase() : "";
      const nameB = b?.name ? b.name.toLowerCase() : "";
      return nameA.localeCompare(nameB);
    });
    return sortedOptions.slice(0, maxOptionsToShow);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const { value = multiple ? [] : null, onChange } = field;

        return (
          <MuiAutocomplete
            loading={loading}
            autoFocus={false}
            disabled={disabled}
            {...autocomplete}
            filterOptions={filterBy === "name" ? filterName : filterOptions}
            error={error}
            helpertext={helpertext}
            value={value}
            disablePortal={false}
            onChange={(_, value) => onChange(value)}
            onKeyDown={handleKeyDown}
          />
        );
      }}
    />
  );
};

export default Autocomplete;
