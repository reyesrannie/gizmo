const accessPermission = [
  {
    id: 1,
    access: "Dashboard",
    children: [
      {
        access_permission: "dashboard",
        label: "Dashboard",
      },
    ],
  },
  {
    id: 2,
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
    id: 3,
    access: "Masterlist",
    children: [
      {
        access_permission: "company",
        label: "Company",
      },
      { access_permission: "location", label: "Location" },
      { access_permission: "department", label: "Department" },
      { access_permission: "ap", label: "Accounts Payable" },
      { access_permission: "supplier", label: "Supplier" },
      { access_permission: "s-type", label: "Supplier Type" },
      { access_permission: "vat", label: "Vat" },
      { access_permission: "atc", label: "ATC" },
      { access_permission: "d-type", label: "Document Type" },
    ],
  },
  {
    id: 4,
    access: "Tagging",
    children: [
      {
        access_permission: "tagging",
        label: "Tagging",
      },
    ],
  },
  {
    id: 5,
    access: "Approver",
    children: [
      {
        access_permission: "approver",
        label: "Approver",
      },
    ],
  },
];

export default accessPermission;
