import { Box, Tooltip, Typography } from "@mui/material";
import React from "react";
import "../styles/Modal.scss";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import tagSearchSchema from "../../schemas/tagSearchSchema";
import { MobileDatePicker } from "@mui/x-date-pickers";
import AppTextBox from "./AppTextBox";
import moment from "moment";

const TagNumberText = ({ searchTag }) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(tagSearchSchema),
    defaultValues: {
      year: null,
      tag: "",
    },
  });

  const searchHandler = () => {
    const obj = {
      year: moment(new Date(watch("year"))).get("year"),
      tag: watch("tag"),
    };

    searchTag(obj);
  };

  return (
    <Box className="tag-number-search">
      <Controller
        name="year"
        control={control}
        render={({ field: { onChange, value, ...restField } }) => (
          <MobileDatePicker
            className="tag-search"
            format="YYYY"
            value={value}
            views={["year"]}
            onChange={(e) => {
              onChange(e);
              watch("tag") !== "" && searchHandler();
            }}
            closeOnSelect
            onOpen={() => setValue("year", null)}
            onClose={() => watch("year") === null}
          />
        )}
      />
      <Typography>-</Typography>

      <AppTextBox
        enableEnter
        className="tag-number-search-text"
        control={control}
        name="tag"
        placeholder="0001"
        onKeyDown={(key) =>
          key?.key === "Enter" && watch("year") !== null && searchHandler()
        }
      />
    </Box>
  );
};

export default TagNumberText;
