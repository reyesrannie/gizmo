export const socketEvents = [
  {
    channel: "company.created",
    event: ".companyCreated",
    tags: ["Company"],
    action: ["dispatch"],
  },
  {
    channel: "company.updated",
    event: ".companyUpdated",
    tags: ["Company"],
    action: ["dispatch"],
  },
  {
    channel: "department.created",
    event: ".departmentCreated",
    tags: ["Department"],
    action: ["dispatch"],
  },
  {
    channel: "department.updated",
    event: ".departmentUpdated",
    tags: ["Department"],
    action: ["dispatch"],
  },
  {
    channel: "location.created",
    event: ".locationCreated",
    tags: ["Location"],
    action: ["dispatch"],
  },
  {
    channel: "location.updated",
    event: ".locationUpdated",
    tags: ["Location"],
    action: ["dispatch"],
  },
  {
    channel: "ap.created",
    event: ".apCreated",
    tags: ["AP"],
    action: ["dispatch"],
  },
  {
    channel: "ap.updated",
    event: ".apUpdated",
    tags: ["AP"],
    action: ["dispatch"],
  },
  {
    channel: "supplier.created",
    event: ".supplierCreated",
    tags: ["Supplier", "Transaction"],
    action: ["dispatch"],
  },
  {
    channel: "supplier.updated",
    event: ".supplierUpdated",
    tags: ["Supplier", "Transaction"],
    action: ["dispatch"],
  },
  {
    channel: "vat.created",
    event: ".vatCreated",
    tags: ["VAT"],
    action: ["dispatch"],
  },
  {
    channel: "vat.updated",
    event: ".vatUpdated",
    tags: ["VAT"],
    action: ["dispatch"],
  },
  {
    channel: "atc.created",
    event: ".atcCreated",
    tags: ["ATC"],
    action: ["dispatch"],
  },
  {
    channel: "atc.updated",
    event: ".atcUpdated",
    tags: ["ATC"],
    action: ["dispatch"],
  },
  {
    channel: "supplier-type.created",
    event: ".supplierTypeCreated",
    tags: ["SupplierType"],
    action: ["dispatch"],
  },
  {
    channel: "supplier-type.updated",
    event: ".supplierTypeUpdated",
    tags: ["SupplierType"],
    action: ["dispatch"],
  },
  {
    channel: "document-type.created",
    event: ".documentTypeCreated",
    tags: ["DocumentType"],
    action: ["dispatch"],
  },
  {
    channel: "document-type.updated",
    event: ".documentTypeUpdated",
    tags: ["DocumentType"],
    action: ["dispatch"],
  },
  {
    channel: "account-number.created",
    event: ".accountNumberCreated",
    tags: ["AccountNumber"],
    action: ["dispatch"],
  },
  {
    channel: "account-number.updated",
    event: ".accountNumberUpdated",
    tags: ["AccountNumber"],
    action: ["dispatch"],
  },
  {
    channel: "accoount-title.created",
    event: ".accountTitleUpdated",
    tags: [
      "GGPAccountTitles",
      "GPAccountTitles",
      "PAccountTitles",
      "CAccountTitles",
      "GAccountTitles",
      "AccountTitles",
    ],
    action: ["dispatch"],
  },
  {
    channel: "accoount-title.updated",
    event: ".accountTitleUpdated",
    tags: [
      "GGPAccountTitles",
      "GPAccountTitles",
      "PAccountTitles",
      "CAccountTitles",
      "GAccountTitles",
      "AccountTitles",
    ],
    action: ["dispatch"],
  },

  {
    channel: "role.created",
    event: ".roleCreated",
    tags: ["Role"],
    action: ["dispatch"],
  },
  {
    channel: "role.updated",
    event: ".roleUpdated",
    tags: ["Role"],
    action: ["dispatch"],
  },
  {
    channel: "user.created",
    event: ".userCreated",
    tags: ["Users"],
    action: ["dispatch"],
  },
  {
    channel: "user.updated",
    event: ".userUpdated",
    tags: ["Users"],
    action: ["dispatch"],
  },

  {
    channel: "transaction.updated",
    event: ".transactionUpdated",
    tags: [
      "Transaction",
      "CountTransaction",
      "CountCheck",
      "CountVoucher",
      "DashboardBalance",
      "Logs",
      "TagYear",
    ],
    action: ["AP", "Tagging"],
  },
  {
    channel: "transaction.created",
    event: ".transactionCreated",
    tags: [
      "Transaction",
      "CountTransaction",
      "CountCheck",
      "CountVoucher",
      "DashboardBalance",
      "Logs",
      "TagYear",
    ],
    action: ["AP"],
  },
  {
    channel: "vp.updated",
    event: ".vpUpdated",
    tags: [
      "Transaction",
      "CheckEntries",
      "CountTransaction",
      "CountCheck",
      "CountVoucher",
      "DashboardBalance",
      "Logs",
      "TagYear",
      "CountTreasury",
    ],
    action: ["AP", "Tagging"],
  },

  {
    channel: "cv.updated",
    event: ".cvUpdated",
    tags: [
      "Transaction",
      "CountTransaction",
      "CheckEntries",
      "CountCheck",
      "CountVoucher",
      "Logs",
      "TagYear",
      "CountTreasury",
      "DashboardBalance",
    ],
    action: ["Treasury"],
  },
  {
    channel: "schedule.created",
    event: ".scheduleCreated",
    tags: ["SchedTransact", "CountSchedule", "ScheduleLogs"],
  },

  {
    channel: "schedule.updated",
    event: ".scheduleUpdated",
    tags: ["SchedTransact", "CountSchedule", "ScheduleLogs"],
  },

  {
    channel: "schedule.generated",
    event: ".scheduleGenerated",
    tags: [
      "SchedTransact",
      "Transaction",
      "CountTransaction",
      "CountCheck",
      "CountVoucher",
      "Logs",
      "AccountTitles",
      "GTAG",
      "VPCheckNumber",
      "VPJournalNumber",
      "SingleCheck",
      "SingleJournal",
      "CheckEntries",
      "JournalEntries",
      "CountSchedule",
      "ScheduleLogs",
      "CountTreasury",
    ],
  },
  {
    channel: "is-read.updated",
    event: ".isReadUpdated",
    tags: ["CountTransaction", "CountCheck", "CountVoucher", "CountGJ"],
    action: ["dispatch"],
  },

  {
    channel: "general-journal.created",
    event: "generalJournalCreated",
    tags: ["GeneralJournal", "CountGJ"],
    action: ["dispatch"],
  },

  {
    channel: "general-journal.updated",
    event: "generalJournalUpdated",
    tags: ["GeneralJournal", "CountGJ"],
    action: ["dispatch"],
  },
];
