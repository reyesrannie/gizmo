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
  { name: "Void", status: "voided" },
  { name: "History", status: "" },
];

const approverHeader = [
  { name: "For Approval", status: "For Approval" },
  { name: "Returned", status: "returned" },
  { name: "Void", status: "voided" },
  { name: "Pending Void", status: "For Voiding" },
  { name: "History", status: "" },
];

const coaHeader = [
  { name: "Account Titles" },
  { name: "Great Grandparent" },
  { name: "Grandparent" },
  { name: "Parent" },
  { name: "Child" },
  { name: "Grandchild" },
];

const schedTaggingHeader = [
  { name: "Pending", status: "pending" },
  { name: "History", status: "" },
];

const schedAPHeader = [
  { name: "Pending", status: "pending" },
  { name: "Received", status: "For Computation" },
  { name: "Checked", status: "For Approval" },
  { name: "Returned", status: "returned" },
  { name: "Approved", status: "approved" },
  { name: "History", status: "" },
];

const approverScheduleHeader = [
  { name: "For Approval", status: "For Approval" },
  { name: "Returned", status: "returned" },
  { name: "History", status: "" },
];

export {
  taggingHeader,
  apHeader,
  approverHeader,
  coaHeader,
  schedTaggingHeader,
  schedAPHeader,
  approverScheduleHeader,
};
