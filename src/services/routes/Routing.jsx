import React, { lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { decodeUser } from "../functions/saveUser";
import "../../components/styles/LoadingComponentFallback.scss";
import { hasAccess } from "../functions/access";
import AppBar from "../../components/customs/AppBar";
import PageNotFound from "../../screen/PageNotFound";

const Login = lazy(() => import("../../screen/login/Login"));
const Dashboard = lazy(() => import("../../screen/dashboard/Dashboard"));
const Masterlist = lazy(() => import("../../screen/masterlist/Masterlist"));
const UserManagement = lazy(() => import("../../screen/user/UserManagement"));
const Company = lazy(() => import("../../screen/masterlist/charging/Company"));
const Vat = lazy(() => import("../../screen/masterlist/vat/Vat"));
const Atc = lazy(() => import("../../screen/masterlist/atc/Atc"));
const Tagging = lazy(() => import("../../screen/tagging/Tagging"));
const AccountPayable = lazy(() => import("../../screen/ap/AccountPayable"));
const Transaction = lazy(() => import("../../screen/ap/Transaction"));
const CheckVoucher = lazy(() => import("../../screen/ap/CheckVoucher"));
const JournalVoucher = lazy(() => import("../../screen/ap/JournalVoucher"));
const Approver = lazy(() => import("../../screen/approver/Approver"));

const ApprovingJournal = lazy(() =>
  import("../../screen/approver/ApprovingJournal")
);
const ApprovingCheck = lazy(() =>
  import("../../screen/approver/ApprovingCheck")
);
const AccountTitles = lazy(() =>
  import("../../screen/masterlist/coa/AccountTitles")
);
const AccountNumber = lazy(() =>
  import("../../screen/masterlist/supplier/AccountNumber")
);
const DocumentType = lazy(() =>
  import("../../screen/masterlist/document/DocumentType")
);
const TagTransaction = lazy(() =>
  import("../../screen/tagging/TagTransaction")
);
const Supplier = lazy(() =>
  import("../../screen/masterlist/supplier/Supplier")
);
const SupplierType = lazy(() =>
  import("../../screen/masterlist/supplier/SupplierType")
);
const AccountsPayable = lazy(() =>
  import("../../screen/masterlist/ap/AccountsPayable")
);
const Location = lazy(() =>
  import("../../screen/masterlist/charging/Location")
);
const Department = lazy(() =>
  import("../../screen/masterlist/charging/Department")
);
const RoleManagement = lazy(() =>
  import("../../screen/user/accounts/RoleManagement")
);
const UserAccounts = lazy(() =>
  import("../../screen/user/accounts/UserAccounts")
);

const Schedule = lazy(() => import("../../screen/schedule/Schedule"));
const RequestSchedule = lazy(() =>
  import("../../screen/schedule/RequestSchedule")
);

const APSchedule = lazy(() => import("../../screen/schedule/APSchedule"));
const ApproverSchedule = lazy(() =>
  import("../../screen/schedule/ApproverSchedule")
);

const CutOff = lazy(() => import("../../screen/cutoff/Cutoff"));

const Routing = () => {
  const user = decodeUser();
  const routes = useRoutes([
    {
      path: "/login",
      element: !user ? <Login /> : <Navigate to={"/"} />,
    },
    {
      path: "/",
      element: user ? <AppBar /> : <Navigate to={"/login"} />,
      children: [
        {
          path: "",
          element: hasAccess(["dashboard"]) ? <Dashboard /> : <></>,
        },
        {
          path: "cutoff",
          element: hasAccess(["cutOff_requestor", "cutOff_approver"]) ? (
            <CutOff />
          ) : (
            <></>
          ),
        },
      ],
    },
    {
      path: "/account",
      element: user ? <AppBar /> : <Navigate to={"/login"} />,
      children: [
        {
          path: "",
          element: hasAccess(["user", "role"]) ? (
            <UserManagement />
          ) : (
            <Navigate to={"/"} />
          ),
        },
        {
          path: "users",
          element: hasAccess(["user"]) ? (
            <UserAccounts />
          ) : (
            <Navigate to={"/account"} />
          ),
        },
        {
          path: "roles",
          element: hasAccess(["role"]) ? (
            <RoleManagement />
          ) : (
            <Navigate to={"/account"} />
          ),
        },
      ],
    },
    {
      path: "/masterlist",
      element: user ? <AppBar /> : <Navigate to={"/login"} />,
      children: [
        {
          path: "",
          element: hasAccess([
            "company",
            "location",
            "department",
            "ap",
            "supplier",
            "vat",
            "atc",
            "s-type",
            "account-number",
            "account-titles",
          ]) ? (
            <Masterlist />
          ) : (
            <Navigate to={"/"} />
          ),
        },
        {
          path: "company",
          element: hasAccess(["company"]) ? (
            <Company />
          ) : (
            <Navigate to={"/masterlist"} />
          ),
        },
        {
          path: "department",
          element: hasAccess(["department"]) ? (
            <Department />
          ) : (
            <Navigate to={"/masterlist"} />
          ),
        },
        {
          path: "location",
          element: hasAccess(["location"]) ? (
            <Location />
          ) : (
            <Navigate to={"/masterlist"} />
          ),
        },
        {
          path: "ap",
          element: hasAccess(["ap"]) ? (
            <AccountsPayable />
          ) : (
            <Navigate to={"/masterlist"} />
          ),
        },
        {
          path: "supplier",
          element: hasAccess(["supplier"]) ? (
            <Supplier />
          ) : (
            <Navigate to={"/masterlist"} />
          ),
        },
        {
          path: "vat",
          element: hasAccess(["ap"]) ? (
            <Vat />
          ) : (
            <Navigate to={"/masterlist"} />
          ),
        },
        {
          path: "atc",
          element: hasAccess(["atc"]) ? (
            <Atc />
          ) : (
            <Navigate to={"/masterlist"} />
          ),
        },
        {
          path: "suppliertype",
          element: hasAccess(["s-type"]) ? (
            <SupplierType />
          ) : (
            <Navigate to={"/masterlist"} />
          ),
        },
        {
          path: "documenttype",
          element: hasAccess(["d-type"]) ? (
            <DocumentType />
          ) : (
            <Navigate to={"/masterlist"} />
          ),
        },
        {
          path: "account-number",
          element: hasAccess(["account-number"]) ? (
            <AccountNumber />
          ) : (
            <Navigate to={"/masterlist"} />
          ),
        },
        {
          path: "titles",
          element: hasAccess(["account-titles"]) ? (
            <AccountTitles />
          ) : (
            <Navigate to={"/masterlist"} />
          ),
        },
      ],
    },
    {
      path: "/tagging",
      element: user ? <AppBar /> : <Navigate to={"/login"} />,
      children: [
        {
          path: "",
          element: hasAccess(["tagging"]) ? <Tagging /> : <Navigate to={"/"} />,
        },
        {
          path: "tagtransact",
          element: hasAccess(["tagging"]) ? (
            <TagTransaction />
          ) : (
            <Navigate to={"/"} />
          ),
        },
      ],
    },
    {
      path: "/ap",
      element: user ? <AppBar /> : <Navigate to={"/login"} />,
      children: [
        {
          path: "",
          element: hasAccess(["ap_tag"]) ? (
            <AccountPayable />
          ) : (
            <Navigate to={"/"} />
          ),
        },
        {
          path: "pending",
          element: hasAccess(["ap_tag"]) ? (
            <Transaction />
          ) : (
            <Navigate to={"/"} />
          ),
        },
        {
          path: "check",
          element: hasAccess(["ap_tag"]) ? (
            <CheckVoucher />
          ) : (
            <Navigate to={"/"} />
          ),
        },
        {
          path: "journal",
          element: hasAccess(["ap_tag"]) ? (
            <JournalVoucher />
          ) : (
            <Navigate to={"/"} />
          ),
        },
      ],
    },
    {
      path: "/approver",
      element: user ? <AppBar /> : <Navigate to={"/login"} />,
      children: [
        {
          path: "",
          element: hasAccess(["approver"]) ? (
            <Approver />
          ) : (
            <Navigate to={"/"} />
          ),
        },
        {
          path: "approvecheck",
          element: hasAccess(["approver"]) ? (
            <ApprovingCheck />
          ) : (
            <Navigate to={"/"} />
          ),
        },
        {
          path: "approvejournal",
          element: hasAccess(["approver"]) ? (
            <ApprovingJournal />
          ) : (
            <Navigate to={"/"} />
          ),
        },
      ],
    },

    {
      path: "/sched_transact",
      element: user ? <AppBar /> : <Navigate to={"/login"} />,
      children: [
        {
          path: "",
          element: hasAccess([
            "sched_transact_requestor",
            "sched_transact_ap",
            "sched_transact_approver",
          ]) ? (
            <Schedule />
          ) : (
            <Navigate to={"/"} />
          ),
        },
        {
          path: "request",
          element: hasAccess(["sched_transact_requestor"]) ? (
            <RequestSchedule />
          ) : (
            <Navigate to={"/"} />
          ),
        },
        {
          path: "ap",
          element: hasAccess(["sched_transact_ap"]) ? (
            <APSchedule />
          ) : (
            <Navigate to={"/"} />
          ),
        },
        {
          path: "approve",
          element: hasAccess(["sched_transact_approver"]) ? (
            <ApproverSchedule />
          ) : (
            <Navigate to={"/"} />
          ),
        },
      ],
    },
    {
      path: "*",
      element: <AppBar />,
      children: [
        {
          path: "*",
          element: <PageNotFound />,
        },
      ],
    },
  ]);

  return routes;
};

export default Routing;
