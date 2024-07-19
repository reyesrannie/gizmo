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
      { access_permission: "ap", label: "AP Allocation" },
      { access_permission: "supplier", label: "Supplier" },
      { access_permission: "s-type", label: "Supplier Type" },
      { access_permission: "vat", label: "Vat" },
      { access_permission: "atc", label: "ATC" },
      { access_permission: "d-type", label: "Document Type" },
      { access_permission: "account-number", label: "Account Number" },
      { access_permission: "account-titles", label: "Account Titles" },
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
  {
    id: 6,
    access: "Cut OFF",
    children: [
      {
        access_permission: "cutOff_requestor",
        label: "Request Cutoff",
      },
      {
        access_permission: "cutOff_approver",
        label: "Approver Cutoff",
      },
    ],
  },
  {
    id: 7,
    access: "Allocation",
    children: [
      {
        access_permission: "ap_tag",
        label: "AP",
      },
    ],
  },
  {
    id: 8,
    access: "Scheduled",
    children: [
      {
        access_permission: "sched_transact_requestor",
        label: "Request Schedule",
      },
      {
        access_permission: "sched_transact_ap",
        label: "AP Schedule",
      },
      {
        access_permission: "sched_transact_approver",
        label: "Approver Schedule",
      },
    ],
  },
  {
    id: 9,
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
