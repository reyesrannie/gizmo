import React from "react";
import {
  useCheckCountQuery,
  useCountScheduleQuery,
  useJournalCountQuery,
  useTransactCountQuery,
  useTreasuryCountQuery,
} from "../store/request";
import { useSelector } from "react-redux";
import { hasAccess } from "./access";

const CountDistribute = () => {
  const userData = useSelector((state) => state.auth.userData);
  const { min_amount, max_amount } = userData?.amount || {};
  const apCodes = userData?.scope_tagging?.map((item) => item?.ap_code);
  const isAP = min_amount === "0.00" && max_amount === "0.00";

  const queryParams = {
    ap: apCodes,
    min: isAP || apCodes?.length !== 0 ? "" : min_amount,
    max: isAP || apCodes?.length !== 0 ? "" : max_amount,
  };

  const { data: badgeTagging } = useTransactCountQuery({ ap: apCodes });
  const { data: badgeCheck } = useCheckCountQuery(queryParams);
  const { data: badgeJournal } = useJournalCountQuery(queryParams);
  const { data: scheduleTransaction } = useCountScheduleQuery(queryParams);
  const { data: treasuryCount } = useTreasuryCountQuery();

  const sumResult = (result, keys) => {
    return keys?.reduce((sum, key) => sum + (result?.[key] || 0), 0);
  };

  const resultMap = {
    "Voucher's Payable": badgeCheck?.result,
    "Journal Voucher": badgeJournal?.result,
    "Voucher Approval": badgeCheck?.result,
    "Journal Approval": badgeJournal?.result,
    "AP Schedule": scheduleTransaction?.result,
    "Approve Schedule": scheduleTransaction?.result,
    "Check Voucher": treasuryCount?.result,
  };

  const pathMap = {
    Received: "For Computation",
    Approved: "approved",
    Returned: "returned",
    Void: "voided",
    "Pending Void": "For Voiding",
    Pending: "pending",
    Filing: "For Filing",
    Approval: "For Approval",
    Preparation: "For Preparation",
    "For Releasing": "For Releasing",
    Clearing: "For Clearing",
  };

  const menuCount = (path) => {
    switch (path) {
      case "Accounts Payable":
        return (
          sumResult(badgeTagging?.result, ["pending"]) +
          sumResult(badgeCheck?.result, [
            "For Computation",
            "approved",
            "voided",
            "returned",
            "For Filing",
          ]) +
          sumResult(badgeJournal?.result, [
            "For Computation",
            "approved",
            "voided",
            "returned",
          ])
        );
      case "Approver":
        return (
          sumResult(badgeCheck?.result, [
            "For Approval",
            "For Voiding",
            "returned",
            "For Voiding",
            "voided",
          ]) +
          sumResult(badgeJournal?.result, [
            "For Approval",
            "For Voiding",
            "returned",
            "For Voiding",
            "voided",
          ])
        );
      case "Scheduled":
        return sumResult(scheduleTransaction?.result, [
          "For Computation",
          apCodes?.length === 0 ? "For Approval" : "pending",
          "returned",
          "approved",
        ]);
      case "Treasury":
        return sumResult(
          treasuryCount?.result,
          hasAccess("check_approval") && hasAccess("preparation")
            ? [
                "For Preparation",
                "For Releasing",
                "For Clearing",
                "Check Approval",
              ]
            : !hasAccess("check_approval") && hasAccess("preparation")
            ? ["For Preparation", "For Releasing", "For Clearing"]
            : ["Check Approval"]
        );
      default:
        return 0;
    }
  };

  const childMenuCount = (path) => {
    switch (path) {
      case "Pending":
        return sumResult(badgeTagging?.result, ["pending"]);
      case "Voucher's Payable":
        return sumResult(badgeCheck?.result, [
          "For Computation",
          "For Filing",
          "approved",
          "returned",
          "voided",
        ]);
      case "Journal Voucher":
        return sumResult(badgeJournal?.result, [
          "For Computation",
          "returned",
          "approved",
          "voided",
        ]);

      case "Voucher Approval":
        return sumResult(badgeCheck?.result, [
          "For Approval",
          "For Voiding",
          "returned",
          "voided",
        ]);
      case "Journal Approval":
        return sumResult(badgeJournal?.result, [
          "For Approval",
          "For Voiding",
          "returned",
          "voided",
        ]);
      case "Check Voucher":
        return sumResult(
          treasuryCount?.result,
          hasAccess("check_approval") && hasAccess("preparation")
            ? [
                "For Preparation",
                "For Releasing",
                "For Clearing",
                "Check Approval",
              ]
            : !hasAccess("check_approval") && hasAccess("preparation")
            ? ["For Preparation", "For Releasing", "For Clearing"]
            : ["Check Approval"]
        );
      default:
        return 0;
    }
  };

  const countGrandChildcheck = (path, child) => {
    const result = resultMap[child];
    const key = pathMap[path];
    return result?.[key] || 0;
  };

  return {
    menuCount,
    childMenuCount,
    countGrandChildcheck,
  };
};

export default CountDistribute;
