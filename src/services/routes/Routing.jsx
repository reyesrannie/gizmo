import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import Login from "../../screen/login/Login";
import AppBar from "../../components/customs/AppBar";
import Dashboard from "../../screen/dashboard/Dashboard";
import { decodeUser } from "../functions/saveUser";
import UserAccounts from "../../screen/user/accounts/UserAccounts";
import UserManagement from "../../screen/user/UserManagement";
import RoleManagement from "../../screen/user/accounts/RoleManagement";
import Masterlist from "../../screen/masterlist/Masterlist";
import Company from "../../screen/masterlist/charging/Company";
import Department from "../../screen/masterlist/charging/Department";
import Location from "../../screen/masterlist/charging/Location";
import AccountsPayable from "../../screen/masterlist/ap/AccountsPayable";
import { hasAccess } from "../functions/access";
import Vat from "../../screen/masterlist/vat/Vat";
import Atc from "../../screen/masterlist/atc/Atc";
import SupplierType from "../../screen/masterlist/supplier/SupplierType";
import Supplier from "../../screen/masterlist/supplier/Supplier";
import Tagging from "../../screen/tagging/Tagging";
import PageNotFound from "../../screen/PageNotFound";
import TagTransaction from "../../screen/tagging/TagTransaction";
import DocumentType from "../../screen/masterlist/document/DocumentType";
import AccountNumber from "../../screen/masterlist/supplier/AccountNumber";
import AccountPayable from "../../screen/ap/AccountPayable";
import Transaction from "../../screen/ap/Transaction";
import AccountTitles from "../../screen/masterlist/coa/AccountTitles";
import CheckVoucher from "../../screen/ap/CheckVoucher";
import JournalVoucher from "../../screen/ap/JournalVoucher";
import Approver from "../../screen/approver/Approver";
import ApprovingCheck from "../../screen/approver/ApprovingCheck";

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
          path: "account-titles",
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
