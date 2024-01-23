import InputAdornment from "@mui/material/InputAdornment";
import { IconButton, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

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
  ...textField
}) {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const { ref, value, onChange } = field;

        return (
          <TextField
            autoFocus={false}
            autoComplete="off"
            className={className}
            fullWidth
            disabled={disabled}
            id={id}
            name={name}
            {...textField}
            error={error}
            onChange={onChange} // send value to hook form
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
                </InputAdornment>
              ) : (
                <InputAdornment position="end">{endIcon}</InputAdornment>
              ),
            }}
          />
        );
      }}
    />
  );
}

export default AppTextBox;
