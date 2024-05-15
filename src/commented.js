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
