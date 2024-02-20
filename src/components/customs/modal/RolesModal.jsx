import {
  Box,
  Button,
  Checkbox,
  Dialog,
  Divider,
  FormControlLabel,
  Paper,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import React from "react";

import "../../styles/RolesModal.scss";
import roles from "../../../assets/svg/role.svg";
import Lottie from "lottie-react";
import loading from "../../../assets/lottie/Loading.json";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import rolesSchema from "../../../schemas/rolesSchema";
import AppTextBox from "../AppTextBox";
import accessPermission from "../../../services/constants/accessPermission";
import { useDispatch } from "react-redux";
import {
  setRolesData,
  setRolesMenu,
  setRolesUpdate,
  setRolesView,
} from "../../../services/slice/menuSlice";
import {
  useCreateRoleMutation,
  useUpdateRoleMutation,
} from "../../../services/store/request";
import { objectError } from "../../../services/functions/errorResponse";
import { useSnackbar } from "notistack";

const RolesModal = ({ roleData, view, update }) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [createRole, { isLoading }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isLoadingUpdate }] = useUpdateRoleMutation();

  const defaultValues = {
    name: "",
    access_permission: [],
    access: [],
  };

  const parentAccessValues = roleData?.access_permission.reduce(
    (acc, permission) => {
      const foundItems = accessPermission?.filter((item) =>
        item.children.some((child) => child.access_permission === permission)
      );
      const newAccessValues = foundItems.map((foundItem) => foundItem.access);
      return [...acc, ...newAccessValues];
    },
    []
  );

  const defaultData = {
    ...roleData,
    access: [...new Set(parentAccessValues)],
  };

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(rolesSchema),
    defaultValues: view || update ? defaultData : defaultValues,
  });

  const submitHandler = async (submitData) => {
    const obj = {
      name: submitData?.name,
      access_permission: submitData?.access_permission,
      id: update ? roleData?.id : null,
    };

    if (update) {
      try {
        const res = await updateRole(obj).unwrap();
        enqueueSnackbar(res?.message, { variant: "success" });
        dispatch(setRolesUpdate(false));
      } catch (error) {
        objectError(error, setError, enqueueSnackbar);
      }
    } else {
      try {
        const res = await createRole(obj).unwrap();
        enqueueSnackbar(res?.message, { variant: "success" });
        dispatch(setRolesMenu(false));
      } catch (error) {
        objectError(error, setError, enqueueSnackbar);
      }
    }
  };

  return (
    <Paper className="role-modal-container">
      <img src={roles} alt="roles" className="roles-image" draggable="false" />
      <Typography className="roles-text">
        {view ? "Role" : update ? "Update Role" : "Add Role"}
      </Typography>
      <form
        className="add-role-form-container"
        onSubmit={handleSubmit(submitHandler)}
      >
        <AppTextBox
          disabled={view || update}
          control={control}
          name={"name"}
          label={"Role name *"}
          color="primary"
          className="add-role-textbox"
          error={Boolean(errors?.name)}
          helperText={errors?.name?.message}
        />
        <Divider orientation="horizontal" className="roles-devider" />
        <Box className={"role-checkbox-container"}>
          <Box className="checkbox-parent">
            <FormControlLabel
              label="Select role"
              control={
                <Checkbox
                  disabled={view}
                  color="secondary"
                  checked={accessPermission?.every((items) =>
                    watch("access")?.includes(items.access)
                  )}
                  indeterminate={
                    watch("access")?.length !== 0 &&
                    watch("access")?.length < accessPermission.length
                  }
                  onChange={(e) => {
                    const isChecked = e.target.checked;

                    setValue(
                      "access_permission",
                      isChecked
                        ? [
                            ...watch("access_permission"),
                            ...accessPermission?.flatMap((items) =>
                              items.children?.map(
                                (child) => child.access_permission
                              )
                            ),
                          ]
                        : watch("access_permission").filter(
                            (permission) =>
                              !accessPermission
                                ?.flatMap((items) =>
                                  items.children?.map(
                                    (child) => child.access_permission
                                  )
                                )
                                .includes(permission)
                          )
                    );

                    setValue(
                      "access",
                      isChecked
                        ? [
                            ...watch("access"),
                            ...accessPermission?.map((items) => items.access),
                          ]
                        : watch("access").filter(
                            (access) =>
                              !accessPermission
                                ?.map((items) => items.access)
                                .includes(access)
                          )
                    );
                  }}
                />
              }
            />
            <Box>
              {accessPermission?.map((items) => {
                return (
                  <FormControlLabel
                    disabled={view}
                    className="checkbox-role-access"
                    key={items.id}
                    label={items.access}
                    value={items.access}
                    control={
                      <Checkbox
                        color="secondary"
                        checked={watch("access")?.includes(items.access)}
                        {...register("access")}
                        onChange={(e) => {
                          const isChecked = e.target.checked;

                          setValue(
                            "access_permission",
                            isChecked
                              ? [
                                  ...watch("access_permission"),
                                  ...items.children?.map(
                                    (child) => child.access_permission
                                  ),
                                ]
                              : watch("access_permission").filter(
                                  (permission) =>
                                    !items.children?.some(
                                      (child) =>
                                        child.access_permission === permission
                                    )
                                )
                          );

                          setValue(
                            "access",
                            isChecked
                              ? [...watch("access"), items.access]
                              : watch("access").filter(
                                  (access) => access !== items.access
                                )
                          );
                        }}
                      />
                    }
                  />
                );
              })}
            </Box>
            {watch("access")?.map((item, index) => (
              <div key={index}>
                {accessPermission
                  .filter((child) => child.access === item)
                  .map((filteredChild) => (
                    <Box
                      className="children-box-container"
                      key={filteredChild.id}
                    >
                      <FormControlLabel
                        disabled={view}
                        label={item}
                        control={
                          <Checkbox
                            indeterminate={
                              filteredChild?.children?.some((item) =>
                                watch("access_permission")?.includes(
                                  item.access_permission
                                )
                              ) &&
                              !filteredChild?.children?.every((item) =>
                                watch("access_permission")?.includes(
                                  item.access_permission
                                )
                              )
                            }
                            color="secondary"
                            checked={
                              filteredChild?.children?.length > 0 &&
                              filteredChild?.children?.every((item) =>
                                watch("access_permission")?.includes(
                                  item.access_permission
                                )
                              )
                            }
                            onChange={(e) => {
                              const isChecked = e.target.checked;

                              setValue(
                                "access_permission",
                                isChecked
                                  ? [
                                      ...watch("access_permission"),
                                      ...filteredChild?.children?.map(
                                        (item) => item.access_permission
                                      ),
                                    ]
                                  : watch("access_permission").filter(
                                      (permission) =>
                                        !filteredChild?.children?.some(
                                          (item) =>
                                            item.access_permission ===
                                            permission
                                        )
                                    )
                              );
                            }}
                          />
                        }
                      />
                      <Box>
                        {filteredChild?.children?.map((items) => {
                          return (
                            <FormControlLabel
                              disabled={view}
                              className="checkbox-role-access"
                              key={items.access_permission}
                              label={items.label}
                              value={items.access_permission}
                              control={
                                <Checkbox
                                  color="secondary"
                                  checked={watch("access_permission")?.includes(
                                    items.access_permission
                                  )}
                                  {...register("access_permission")}
                                />
                              }
                            />
                          );
                        })}
                      </Box>
                    </Box>
                  ))}
              </div>
            ))}
          </Box>
        </Box>
        <Divider orientation="horizontal" className="roles-devider" />
        <Box className="add-role-button-container">
          {!view && (
            <LoadingButton
              variant="contained"
              color="warning"
              type="submit"
              className="add-role-button"
              disabled={
                !watch("name") || watch("access_permission")?.length === 0
              }
            >
              {update ? "Update" : "Add"}
            </LoadingButton>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              dispatch(setRolesMenu(false));
              dispatch(setRolesData(null));
              dispatch(setRolesView(false));
              dispatch(setRolesUpdate(false));
            }}
            className="add-role-button"
          >
            {view ? "Close" : update ? "Cancel" : "Cancel"}
          </Button>
        </Box>
      </form>

      <Dialog
        open={isLoading || isLoadingUpdate}
        className="loading-role-create"
      >
        <Lottie animationData={loading} loop={isLoading || isLoadingUpdate} />
      </Dialog>
    </Paper>
  );
};

export default RolesModal;
