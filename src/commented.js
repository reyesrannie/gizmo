//UserModal

//redux
// const {
//   data: company,
//   isLoading: companyLoading,
//   isSuccess: successCompany,
// } = useCompanyQuery({
//   status: "active",
//   pagination: "none",
// });
// const {
//   data: department,
//   isLoading: departmentLoading,
//   isSuccess: successDepartment,
// } = useDepartmentQuery({
//   status: "active",
//   pagination: "none",
// });
// const {
//   data: location,
//   isLoading: locationLoading,
//   isSuccess: successLocation,
// } = useLocationQuery({
//   status: "active",
//   pagination: "none",
// });

//required fields
// "company",
// "location",
// "department",

//yup
// company: null,
// department: null,
// location: null,

//useeffect
// successCompany &&
// successDepartment &&
// successLocation &&

// company:
//   company?.result?.find((item) => item.id === menuData?.company?.id) ||
//   null,
// department:
//   department?.result?.find(
//     (item) => item.id === menuData?.department?.id
//   ) || null,
// location:
//   location?.result?.find(
//     (item) => item.id === menuData?.location?.id
//   ) || null,

// successCompany,
// successDepartment,
// successLocation,
// company,
// department,
// location,

//submithandler
// location: {
//   id: submitdata?.location?.id,
//   code: submitdata?.location?.code,
//   name: submitdata?.location?.name,
// },
// department: {
//   id: submitdata?.department?.id,
//   code: submitdata?.department?.code,
//   name: submitdata?.department?.name,
// },
// company: {
//   id: submitdata?.company?.id,
//   code: submitdata?.company?.code,
//   name: submitdata?.company?.name,
// },

//form
//  {false && (
//           <>
//             <Box className="form-title-user">
//               <Typography className="form-title-text-user">Charging</Typography>
//             </Box>
//             <Autocomplete
//               control={control}
//               name={"company"}
//               options={company?.result || []}
//               getOptionLabel={(option) => option?.name}
//               isOptionEqualToValue={(option, value) => option?.id === value?.id}
//               renderInput={(params) => (
//                 <MuiTextField
//                   name="company"
//                   {...params}
//                   label="Company"
//                   size="small"
//                   variant="outlined"
//                   error={Boolean(errors.company)}
//                   helperText={errors.company?.message}
//                   className="user-form-textBox"
//                 />
//               )}
//             />
//             <Autocomplete
//               control={control}
//               name={"department"}
//               options={department?.result || []}
//               getOptionLabel={(option) => option?.name}
//               isOptionEqualToValue={(option, value) => option?.id === value?.id}
//               renderInput={(params) => (
//                 <MuiTextField
//                   name="department"
//                   {...params}
//                   label="Department"
//                   size="small"
//                   variant="outlined"
//                   error={Boolean(errors.department)}
//                   helperText={errors.department?.message}
//                   className="user-form-textBox"
//                 />
//               )}
//             />
//             <Autocomplete
//               control={control}
//               name={"location"}
//               options={location?.result || []}
//               getOptionLabel={(option) => option?.name}
//               isOptionEqualToValue={(option, value) => option?.id === value?.id}
//               renderInput={(params) => (
//                 <MuiTextField
//                   name="location"
//                   {...params}
//                   label="Location"
//                   size="small"
//                   variant="outlined"
//                   error={Boolean(errors.location)}
//                   helperText={errors.location?.message}
//                   className="user-form-textBox"
//                 />
//               )}
//             />
//             <Divider className="user-divider" />
//           </>
//         )}

// loading
// locationLoading ||
// companyLoading ||
// departmentLoading ||

//Receive Transaction

// const handleReceive = async () => {
//   const obj = {
//     tag_no: transactionData?.tag_no,
//     id: transactionData?.id,
//   };

//   try {
//     const res = await receiveTransaction(obj).unwrap();
//     enqueueSnackbar(res?.message, { variant: "success" });
//     dispatch(setIsContinue(true));
//   } catch (error) {
//     singleError(error, enqueueSnackbar);
//   }
// };

// const validateRoute = () => {
//     const isZero =
//       parseFloat(transactionData?.purchase_amount) ===
//       parseFloat(checkTransaction?.result?.amount || 0);
//     isZero ? handleReceive() : handleCreateCheck();
//   };

// {watch("tin") && (
//     <Autocomplete
//       disabled={!hasAccess("tagging")}
//       control={control}
//       name={"document_type"}
//       options={document?.result || []}
//       getOptionLabel={(option) => `${option.name}`}
//       isOptionEqualToValue={(option, value) =>
//         option?.code === value?.code
//       }
//       renderInput={(params) => (
//         <MuiTextField
//           name="document_type"
//           {...params}
//           label="Document type *"
//           size="small"
//           variant="outlined"
//           error={Boolean(errors.document_type)}
//           helperText={errors.document_type?.message}
//           className="transaction-form-textBox"
//         />
//       )}
//     />
//   )}

{
  /* <Button
disabled={!hasAccess("tagging")}
endIcon={<AddIcon />}
color="secondary"
variant="contained"
size="small"
className="add-tax-document"
onClick={() => dispatch(setAddDocuments(true))}
>
Add Document
</Button> */
}

{
  /* <Dialog
        open={addDocuments}
        className="additional-documents"
        onClose={() => dispatch(setAddDocuments(false))}
      >
        <Autocomplete
          disabled={!hasAccess("tagging")}
          control={control}
          name={"addedDocuments"}
          options={
            document?.result.filter(
              (item) => !documents?.some((doc) => item?.code === doc?.code)
            ) || []
          }
          getOptionLabel={(option) => `${option.name}`}
          isOptionEqualToValue={(option, value) => option?.code === value?.code}
          onClose={() => {
            if (watch("addedDocuments")) {
              dispatch(setDocuments([...documents, watch("addedDocuments")]));
              dispatch(setAddDocuments(false));
              setValue("addedDocuments", null);
            }
            setValue("addedDocuments", null);
            dispatch(setAddDocuments(false));
          }}
          renderInput={(params) => (
            <MuiTextField
              name="addedDocuments"
              {...params}
              label="Document type"
              size="small"
              variant="outlined"
              error={Boolean(errors.addedDocuments)}
              helperText={errors.addedDocuments?.message}
              className="transaction-form-textBox"
            />
          )}
        />
      </Dialog> */
}
