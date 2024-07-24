import moment from "moment";
import { useGenerateTransactionMutation } from "../store/request";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import socket from "./serverSocket";
import { hasAccess } from "./access";
import { singleError } from "./errorResponse";

const DateChecker = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [checkScheduleTransaction, { isError }] =
    useGenerateTransactionMutation();
  const userData = useSelector((state) => state.auth.userData);

  const dateToday = moment(new Date()).format("YYYY-MM-DD");
  const isCoverageToday = (obj) => {
    const isToday = obj?.some((item) => {
      const coverageFrom = moment(item?.coverage_from);
      const adjustedCoverageFrom = item?.month_paid
        ? coverageFrom.add(item.month_paid, "months")
        : coverageFrom;
      return adjustedCoverageFrom.format("YYYY-MM-DD") <= dateToday;
    });
    return isToday;
  };

  const isCoverageTodayTable = (date) => {
    const coverageFrom = moment(date?.coverage_from);
    const adjustedCoverageFrom = date?.month_paid
      ? coverageFrom.add(date?.month_paid, "months")
      : coverageFrom;

    return adjustedCoverageFrom.format("YYYY-MM-DD") <= dateToday;
  };

  const autoGenerateVoucher = async (data) => {
    const obj = data
      ?.map((item) => {
        const today = isCoverageTodayTable(item);
        const isAP = userData?.scope_tagging?.some(
          (ap) => ap?.ap_id === item?.ap_tagging_id
        );
        if (today && item?.state === "approved" && isAP) {
          return item?.id;
        } else {
          return null;
        }
      })
      .filter((id) => id !== null && id !== undefined);

    const payload = {
      schedule_ids: obj,
    };

    if (
      payload?.schedule_ids?.length !== 0 &&
      hasAccess("sched_transact_generate") &&
      !isError
    ) {
      try {
        const res = await checkScheduleTransaction(payload).unwrap();
        socket.emit("schedule_generate");
        enqueueSnackbar(res?.message, { variant: "success" });
      } catch (error) {
        singleError(error, enqueueSnackbar);
      }
    }
  };

  const shouldDisableYear = (date) => {
    const currentYear = moment().year();
    const currentMonth = moment().month(); // January is 0

    if (currentMonth === 0) {
      return date.year() < currentYear - 1;
    }
    return date.year() < currentYear;
  };

  return {
    isCoverageToday,
    isCoverageTodayTable,
    shouldDisableYear,
    autoGenerateVoucher,
  };
};

export default DateChecker;
