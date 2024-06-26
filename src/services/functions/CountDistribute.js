import React from "react";
import {
  useCheckCountQuery,
  useCountScheduleQuery,
  useJournalCountQuery,
  useTransactCountQuery,
} from "../store/request";
import { useSelector } from "react-redux";

const CountDistribute = () => {
  const userData = useSelector((state) => state.auth.userData);
  const isAP =
    userData?.amount?.min_amount === "0.00" &&
    userData?.amount?.max_amount === "0.00";
  const ap = userData?.scope_tagging?.map((item) => item?.ap_code);
  const { data: badgeTagging } = useTransactCountQuery({
    ap: userData?.scope_tagging?.map((item) => item?.ap_code),
  });
  const { data: badgeCheck } = useCheckCountQuery({
    ap: userData?.scope_tagging?.map((item) => item?.ap_code),
    min: isAP ? "" : userData?.amount?.min_amount,
    max: isAP ? "" : userData?.amount?.max_amount,
  });
  const { data: badgeJournal } = useJournalCountQuery({
    ap: userData?.scope_tagging?.map((item) => item?.ap_code),
    min: isAP ? "" : userData?.amount?.min_amount,
    max: isAP ? "" : userData?.amount?.max_amount,
  });
  const { data: scheduleTransaction } = useCountScheduleQuery({
    ap: ap,
    min: ap?.length === 0 ? userData?.amount?.min_amount : "",
    max: ap?.length === 0 ? userData?.amount?.max_amount : "",
  });

  const menuCount = (path) => {
    if (path === "Accounts Payable") {
      return (
        badgeTagging?.result?.pending +
          badgeCheck?.result["For Computation"] +
          badgeCheck?.result?.approved +
          badgeCheck?.result?.voided +
          badgeCheck?.result?.returned +
          badgeJournal?.result["For Computation"] +
          badgeJournal?.result?.approved +
          badgeJournal?.result?.voided +
          badgeJournal?.result?.returned || 0
      );
    } else if (path === "Approver") {
      return (
        badgeCheck?.result["For Approval"] +
          badgeCheck?.result["For Voiding"] +
          badgeJournal?.result["For Approval"] +
          badgeJournal?.result["For Voiding"] || 0
      );
    } else if (path === "Scheduled") {
      if (ap?.length === 0) {
        return scheduleTransaction?.result["For Approval"] || 0;
      }
      if (ap?.length !== 0) {
        return (
          scheduleTransaction?.result["For Computation"] +
            scheduleTransaction?.result["returned"] +
            scheduleTransaction?.result["approved"] +
            scheduleTransaction?.result["pending"] || 0
        );
      } else {
        return (
          scheduleTransaction?.result["For Computation"] +
            scheduleTransaction?.result["For Approval"] +
            scheduleTransaction?.result["returned"] +
            scheduleTransaction?.result["approved"] +
            scheduleTransaction?.result["pending"] || 0
        );
      }
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
          badgeJournal?.result?.returned +
          badgeJournal?.result?.voided || 0
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
    } else if (path === "AP Schedule") {
      return (
        scheduleTransaction?.result["For Computation"] +
          scheduleTransaction?.result?.approved +
          scheduleTransaction?.result?.pending +
          scheduleTransaction?.result?.returned || 0
      );
    } else if (path === "Approve Schedule") {
      return scheduleTransaction?.result["For Approval"] || 0;
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

  const countGrandChildcheck = (path, child) => {
    if (child === "Check Voucher") {
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
    }
    if (child === "Journal Voucher") {
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
    }
    if (child === "Check Approval") {
      if (path === "For Approval") {
        return badgeCheck?.result["For Approval"] || 0;
      }
      if (path === "Pending Void") {
        return badgeCheck?.result["For Voiding"] || 0;
      }
      return 0;
    }
    if (child === "Journal Approval") {
      if (path === "For Approval") {
        return badgeJournal?.result["For Approval"] || 0;
      }
      if (path === "Pending Void") {
        return badgeJournal?.result["For Voiding"] || 0;
      }
      return 0;
    }
    if (child === "AP Schedule") {
      if (path === "Pending") {
        return scheduleTransaction?.result["pending"] || 0;
      }
      if (path === "Received") {
        return scheduleTransaction?.result["For Computation"] || 0;
      }
      if (path === "Returned") {
        return scheduleTransaction?.result["returned"] || 0;
      }
      if (path === "Approved") {
        return scheduleTransaction?.result["approved"] || 0;
      }
      return 0;
    }
    if (child === "Approve Schedule") {
      if (path === "For Approval") {
        return scheduleTransaction?.result["For Approval"] || 0;
      }
      return 0;
    }
    return 0;
  };

  const countScheduleAP = () => {
    const total =
      scheduleTransaction?.result["For Computation"] +
        scheduleTransaction?.result?.approved +
        scheduleTransaction?.result?.pending +
        scheduleTransaction?.result?.returned || 0;
    return total === 0 ? true : false;
  };

  const countScheduleApprover = () => {
    const total = scheduleTransaction?.result["For Approval"];
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
    countGrandChildcheck,
    countScheduleApprover,
    countScheduleAP,
  };
};

export default CountDistribute;
