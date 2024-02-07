import {
  Divider,
  Paper,
  Typography,
  TextField as MuiTextField,
  Box,
  Button,
  Dialog,
  IconButton,
} from "@mui/material";
import React from "react";
import user from "../../assets/svg/add-user.svg";

import "../styles/UserModal.scss";
import AppTextBox from "./AppTextBox";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import usersSchema from "../../schemas/usersSchema";
import Autocomplete from "./AutoComplete";
import { useDispatch } from "react-redux";
import { resetMenu } from "../../services/slice/menuSlice";
import { useSedarQuery } from "../../services/store/sedarRequest";
import Lottie from "lottie-react";
import loading from "../../assets/lottie/Loading.json";

import ClearIcon from "@mui/icons-material/Clear";
import {
  useApQuery,
  useCompanyQuery,
  useDepartmentQuery,
  useLocationQuery,
  useRoleQuery,
} from "../../services/store/request";
import useParamsHook from "../../services/hooks/useParamsHook";

const UserModal = ({ view, update }) => {
  // view || update ? defaultData : defaultValues,
  const dispatch = useDispatch();

  const { data: rdfEmployees, isLoading: sedarLoading } = useSedarQuery();
  const { data: company, isLoading: companyLoading } = useCompanyQuery({
    status: "active",
    pagination: "none",
  });
  const { data: department, isLoading: departmentLoading } = useDepartmentQuery(
    {
      status: "active",
      pagination: "none",
    }
  );
  const { data: location, isLoading: locationLoading } = useLocationQuery({
    status: "active",
    pagination: "none",
  });
  const { data: role, isLoading: loadingRole } = useRoleQuery({
    status: "active",
    pagination: "none",
  });
  const { data: ap, isLoading: loadingAP } = useApQuery({
    status: "active",
    pagination: "none",
  });

  const requiredFields = [
    "id_no",
    "company",
    "location",
    "department",
    "username",
    "role_id",
  ];

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(usersSchema),
    defaultValues: {
      id_no: null,
      company: null,
      department: null,
      location: null,
      role_id: null,
      username: "",
      first_name: "",
      last_name: "",
      middle_name: "",
      suffix: "",
      position: "",
      ap_tagging: null,
    },
  });

  const isFormValid = requiredFields.every((field) => !!watch(field));

  const handleAutoFill = () => {
    const { general_info } = watch("id_no") || {};
    const { first_name, last_name, middle_name, suffix } = general_info || {};
    const position = watch("id_no")?.position_info?.position_name || "";

    setValue("first_name", first_name);
    setValue("last_name", last_name);
    setValue("middle_name", middle_name);
    setValue("suffix", suffix || "");
    setValue("position", position);

    if (first_name && last_name) {
      const initials = first_name
        .split(" ")
        .map((name) => name.charAt(0).toLowerCase());
      const username =
        initials.join("") + last_name.replace(/\s/g, "").toLowerCase();
      setValue("username", username);
    } else {
      setValue("username", "");
    }
  };

  const submitHandler = async (submitdata) => {
    console.log(submitdata);
  };

  return (
    <Paper className="user-modal-container">
      <img src={user} alt="user" className="user-image" draggable="false" />
      <Typography className="user-text">
        {view ? "Account" : update ? "Update Account" : "Create Account"}
      </Typography>
      <Divider className="user-divider" />
      <Box className="form-title-user">
        <Typography className="form-title-text-user">
          Employee Details
        </Typography>
      </Box>
      <form
        className="form-container-user"
        onSubmit={handleSubmit(submitHandler)}
      >
        <Autocomplete
          loading={sedarLoading}
          control={control}
          name="id_no"
          options={rdfEmployees || []}
          getOptionLabel={(option) => option?.general_info?.full_id_number}
          isOptionEqualToValue={(option, value) =>
            option?.general_info?.full_id_number ===
            value?.general_info?.full_id_number
          }
          onClose={() => handleAutoFill()}
          renderInput={(params) => (
            <MuiTextField
              name="id_no"
              {...params}
              label="Employee ID"
              size="small"
              variant="outlined"
              error={Boolean(errors.id_no)}
              helperText={errors.id_no?.message}
              className="user-form-textBox"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {params.InputProps.endAdornment}
                    {watch("id_no") && (
                      <IconButton
                        onClick={() => reset()}
                        className="icon-clear-user"
                      >
                        <ClearIcon />
                      </IconButton>
                    )}
                  </>
                ),
              }}
            />
          )}
          disableClearable
        />

        <AppTextBox
          control={control}
          name={"first_name"}
          className="user-form-textBox"
          label="Firstname"
          error={Boolean(errors.first_name)}
          helperText={errors.first_name?.message}
          disabled
        />
        <AppTextBox
          control={control}
          name={"middle_name"}
          className="user-form-textBox"
          label="Middle Name"
          error={Boolean(errors.middle_name)}
          helperText={errors.middle_name?.message}
          disabled
        />

        <AppTextBox
          control={control}
          name={"last_name"}
          className="user-form-textBox"
          label="Lastname"
          error={Boolean(errors.last_name)}
          helperText={errors.last_name?.message}
          disabled
        />
        <AppTextBox
          control={control}
          name={"suffix"}
          className="user-form-textBox"
          label="Suffix"
          error={Boolean(errors.suffix)}
          helperText={errors.suffix?.message}
          disabled
        />
        <AppTextBox
          control={control}
          name={"position"}
          className="user-form-textBox"
          label="Position"
          error={Boolean(errors.position)}
          helperText={errors.position?.message}
          disabled
        />

        <Divider className="user-divider" />
        <Box className="form-title-user">
          <Typography className="form-title-text-user">Charging</Typography>
        </Box>
        <Autocomplete
          control={control}
          name={"company"}
          options={company?.result || []}
          getOptionLabel={(option) => option?.name}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          renderInput={(params) => (
            <MuiTextField
              name="company"
              {...params}
              label="Company"
              size="small"
              variant="outlined"
              error={Boolean(errors.company)}
              helperText={errors.company?.message}
              className="user-form-textBox"
            />
          )}
        />
        <Autocomplete
          control={control}
          name={"department"}
          options={department?.result || []}
          getOptionLabel={(option) => option?.name}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          renderInput={(params) => (
            <MuiTextField
              name="department"
              {...params}
              label="Department"
              size="small"
              variant="outlined"
              error={Boolean(errors.department)}
              helperText={errors.department?.message}
              className="user-form-textBox"
            />
          )}
        />
        <Autocomplete
          control={control}
          name={"location"}
          options={location?.result || []}
          getOptionLabel={(option) => option?.name}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          renderInput={(params) => (
            <MuiTextField
              name="location"
              {...params}
              label="Location"
              size="small"
              variant="outlined"
              error={Boolean(errors.location)}
              helperText={errors.location?.message}
              className="user-form-textBox"
            />
          )}
          disablePortal
          disableClearable
        />
        <Divider className="user-divider" />
        <Box className="form-title-user">
          <Typography className="form-title-text-user">
            Access and Permision
          </Typography>
        </Box>
        <AppTextBox
          control={control}
          name={"username"}
          className="user-form-textBox"
          label="Username"
          error={Boolean(errors.username)}
          helperText={errors.username?.message}
        />
        <Autocomplete
          control={control}
          name={"role_id"}
          options={role?.result || []}
          getOptionLabel={(option) => option?.name}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          renderInput={(params) => (
            <MuiTextField
              name="role_id"
              {...params}
              label="Role"
              size="small"
              variant="outlined"
              error={Boolean(errors.role_id)}
              helperText={errors.role_id?.message}
              className="user-form-textBox"
            />
          )}
        />
        <Autocomplete
          control={control}
          name={"ap_tagging"}
          options={ap?.result || []}
          getOptionLabel={(option) =>
            `${option.company_code} - ${option.description} `
          }
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          renderInput={(params) => (
            <MuiTextField
              name="ap_tagging"
              {...params}
              label="AP"
              size="small"
              variant="outlined"
              error={Boolean(errors.ap_tagging)}
              helperText={errors.ap_tagging?.message}
              className="user-form-textBox"
            />
          )}
          disablePortal
          disableClearable
        />
        <Divider className="user-divider" />
        <Box className="form-button-user">
          <Button
            color="warning"
            variant="contained"
            className="add-user-button"
            type="submit"
            disabled={!isFormValid}
          >
            Submit
          </Button>
          <Button
            color="primary"
            variant="contained"
            className="add-user-button"
            onClick={() => dispatch(resetMenu())}
          >
            Cancel
          </Button>
        </Box>
      </form>

      <Dialog
        open={
          sedarLoading ||
          loadingAP ||
          loadingRole ||
          locationLoading ||
          companyLoading ||
          departmentLoading
        }
        className="loading-user-create"
      >
        <Lottie animationData={loading} loop={sedarLoading} />
      </Dialog>
    </Paper>
  );
};

export default UserModal;
