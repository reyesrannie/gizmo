const taggingHeader = [
  { name: "Tag Transaction", status: "pending" },
  { name: "Returned", status: "returned" },
  { name: "Archived", status: "archived" },
  { name: "History", status: "" },
];

const apHeader = [
  { name: "Received", status: "For Computation" },
  { name: "Checked", status: "For Approval" },
  { name: "Returned", status: "returned" },
  { name: "Approved", status: "approved" },
  { name: "History", status: "" },
];

const approverHeader = [
  { name: "For Approval", status: "For Approval" },
  { name: "Returned", status: "returned" },
  { name: "History", status: "" },
];

export { taggingHeader, apHeader, approverHeader };
