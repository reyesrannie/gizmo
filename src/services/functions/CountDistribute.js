import React from "react";
import {
  useCheckCountQuery,
  useJournalCountQuery,
  useTransactCountQuery,
} from "../store/request";
import { useSelector } from "react-redux";

const CountDistribute = () => {
  const userData = useSelector((state) => state.auth.userData);
  const { data: badgeTagging } = useTransactCountQuery({
    ap: userData?.scope_tagging?.map((item) => item?.ap_code),
  });
  const { data: badgeCheck } = useCheckCountQuery({
    ap: userData?.scope_tagging?.map((item) => item?.ap_code),
    min: userData?.amount?.min_amount || null,
    max: userData?.amount?.max_amount || null,
  });
  const { data: badgeJournal } = useJournalCountQuery({
    ap: userData?.scope_tagging?.map((item) => item?.ap_code),
    min: userData?.amount?.min_amount || null,
    max: userData?.amount?.max_amount || null,
  });

  const menuCount = (path) => {
    if (path === "Accounts Payable") {
      return (
        badgeTagging?.result?.pending +
          badgeCheck?.result["For Computation"] +
          badgeJournal?.result["For Computation"] +
          badgeCheck?.result?.approved +
          badgeJournal?.result?.approved +
          badgeCheck?.result?.returned +
          badgeCheck?.result?.voided || 0
      );
    } else if (path === "Approver") {
      return (
        badgeCheck?.result["For Approval"] +
          badgeCheck?.result["For Computation"] +
          badgeCheck?.result["For Voiding"] +
          badgeJournal?.result["For Approval"] +
          badgeJournal?.result["For Voiding"] || 0
      );
    }
    return 0;
  };

  const childMenuCount = (path) => {
    if (path === "Tag Transaction") {
      return 0;
    } else if (path === "Pending") {
      return badgeTagging?.result?.pending || 0;
    } else if (path === "Check Voucher") {
      return (
        badgeCheck?.result["For Computation"] +
          badgeCheck?.result?.approved +
          badgeCheck?.result?.returned +
          badgeCheck?.result?.voided || 0
      );
    } else if (path === "Journal Voucher") {
      return (
        badgeJournal?.result["For Computation"] +
          badgeJournal?.result?.approved +
          badgeJournal?.result?.returned || 0
      );
    } else if (path === "Check Approval") {
      return (
        badgeCheck?.result["For Approval"] +
          badgeCheck?.result["For Voiding"] || 0
      );
    } else if (path === "Journal Approval") {
      return (
        badgeJournal?.result["For Approval"] +
          badgeJournal?.result["For Voiding"] || 0
      );
    }
    return 0;
  };

  const countHeaderTagging = (path) => {
    if (path === "Archived") {
      return badgeTagging?.result?.archived || 0;
    }
    return 0;
  };
  const countHeaderAPCH = (path) => {
    if (path === "Received") {
      return badgeCheck?.result["For Computation"] || 0;
    }
    if (path === "Approved") {
      return badgeCheck?.result?.approved || 0;
    }
    if (path === "Returned") {
      return badgeCheck?.result?.returned || 0;
    }
    if (path === "Void") {
      return badgeCheck?.result?.voided || 0;
    }
    return 0;
  };

  const countHeaderAPJL = (path) => {
    if (path === "Received") {
      return badgeJournal?.result["For Computation"] || 0;
    }
    if (path === "Approved") {
      return badgeJournal?.result?.approved || 0;
    }
    if (path === "Returned") {
      return badgeJournal?.result?.returned || 0;
    }
    if (path === "Void") {
      return badgeJournal?.result?.voided || 0;
    }
    return 0;
  };

  const countHeaderApproverCH = (path) => {
    if (path === "For Approval") {
      return badgeCheck?.result["For Approval"] || 0;
    }
    if (path === "Pending Void") {
      return badgeCheck?.result["For Voiding"] || 0;
    }
    return 0;
  };

  const countHeaderApproverJV = (path) => {
    if (path === "For Approval") {
      return badgeJournal?.result["For Approval"] || 0;
    }
    if (path === "Pending Void") {
      return badgeJournal?.result["For Voiding"] || 0;
    }
    return 0;
  };

  const countCheck = () => {
    const total =
      badgeCheck?.result["For Computation"] +
        badgeCheck?.result?.voided +
        badgeCheck?.result?.approved +
        badgeCheck?.result?.returned || 0;
    return total === 0 ? true : false;
  };

  const countJournal = () => {
    const total =
      badgeJournal?.result["For Computation"] +
        badgeJournal?.result?.voided +
        badgeJournal?.result?.approved +
        badgeJournal?.result?.returned || 0;

    return total === 0 ? true : false;
  };

  const countApproveCheck = () => {
    const total =
      badgeCheck?.result["For Computation"] +
        badgeCheck?.result["For Voiding"] || 0;
    return total === 0 ? true : false;
  };

  const countApproveJournal = () => {
    const total =
      badgeJournal?.result["For Computation"] +
        badgeJournal?.result["For Voiding"] || 0;
    return total === 0 ? true : false;
  };

  return {
    menuCount,
    childMenuCount,
    countHeaderTagging,
    countHeaderAPCH,
    countHeaderAPJL,
    countCheck,
    countJournal,
    countHeaderApproverJV,
    countHeaderApproverCH,
    countApproveCheck,
    countApproveJournal,
  };
};

export default CountDistribute;
