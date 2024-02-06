const accessPermission = [
  {
    id: 1,
    access: "User Management",
    children: [
      {
        access_permission: "user",
        label: "User Management",
      },

      { access_permission: "role", label: "Role Management" },
    ],
  },
  {
    id: 2,
    access: "Masterlist",
    children: [
      {
        access_permission: "company",
        label: "Company",
      },

      { access_permission: "location", label: "Location" },
      { access_permission: "department", label: "Department" },
    ],
  },
  {
    id: 3,
    access: "Report",
    children: [
      {
        access_permission: "report",
        label: "Report",
      },
    ],
  },
];

export default accessPermission;
