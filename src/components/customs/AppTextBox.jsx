import InputAdornment from "@mui/material/InputAdornment";
import { IconButton, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import DoNotDisturbOnOutlinedIcon from "@mui/icons-material/DoNotDisturbOnOutlined";
import { NumericFormat } from "react-number-format";

function AppTextBox({
  endIcon,
  secure,
  id,
  variant,
  className,
  name,
  label,
  control,
  icon,
  helperText,
  error,
  type,
  disabled,
  mobile = false,
  inputProps,
  money,
  tin,
  remove = false,
  handleRemove,
  enableEnter = false,
  select = false,
  showDecimal = false,
  handleClear,
  sample,
  ...textField
}) {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const formatValue = (inputValue) => {
    const numericValue = inputValue.replace(/\D/g, ""); // Remove non-numeric characters
    const parts = numericValue.match(/.{1,3}/g); // Split into groups of 3 digits
    return parts ? parts.join("-") : ""; // Join with hyphens
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const { ref, value, onChange } = field;
        const handleChange = (e) => {
          const formattedValue = formatValue(e.target.value);
          onChange(formattedValue);
        };
        const handleEditAuto = (e) => {
          const rawValue = e.target.value.replace(/,/g, "");
          onChange(rawValue);
          if (handleClear) {
            handleClear();
          }
        };

        const formatDisplayValue = (value) => {
          const num = Number(value);
          return num % 1 === 0 ? "" : num.toFixed(2);
        };
        return (
          <>
            {money ? (
              <NumericFormat
                onKeyDown={(event) => {
                  if (event?.key === "Enter") {
                    event?.preventDefault();
                  }
                }}
                customInput={TextField}
                thousandSeparator={","}
                autoFocus={false}
                autoComplete="off"
                className={className}
                fullWidth
                disabled={disabled}
                id={id}
                name={name}
                {...textField}
                error={error}
                onChange={handleEditAuto} // send value to hook form
                inputRef={ref}
                value={showDecimal ? formatDisplayValue(value) : value}
                size="small"
                variant={variant}
                label={label}
                helperText={helperText}
                isAllowed={(values) => {
                  const { floatValue } = values;
                  return floatValue >= 0;
                }}
              />
            ) : (
              <TextField
                onKeyDown={(event) => {
                  if (!enableEnter && event?.key === "Enter") {
                    event?.preventDefault();
                  }
                }}
                maxRows={6}
                autoFocus={false}
                autoComplete="off"
                className={className}
                fullWidth
                disabled={disabled}
                id={id}
                name={name}
                {...textField}
                error={error}
                onChange={tin ? handleChange : onChange} // send value to hook form
                inputRef={ref}
                value={value}
                size="small"
                type={showPassword ? "text" : type}
                variant={variant}
                label={label}
                helperText={helperText}
                InputProps={{
                  startAdornment: icon && (
                    <InputAdornment position="start">{icon}</InputAdornment>
                  ),
                  endAdornment: secure ? (
                    <InputAdornment position="end">
                      {remove ? (
                        <IconButton onClick={handleRemove} edge="end">
                          <DoNotDisturbOnOutlinedIcon color="error" />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </IconButton>
                      )}
                    </InputAdornment>
                  ) : (
                    <InputAdornment position="end">{endIcon}</InputAdornment>
                  ),
                }}
              />
            )}
          </>
        );
      }}
    />
  );
}

export default AppTextBox;
