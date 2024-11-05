import moment from "moment";
import {
  useCutOffQuery,
  useGenerateTransactionMutation,
} from "../store/request";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { hasAccess } from "./access";
import { singleError } from "./errorResponse";
import { useMemo } from "react";
import dayjs from "dayjs";

const DateChecker = () => {
  const { enqueueSnackbar } = useSnackbar();

  const {
    data: cutOff,
    isLoading: loadingCutOff,
    isSuccess: cutOffSuccess,
  } = useCutOffQuery({
    status: "active",
    pagination: "none",
  });

  const [checkScheduleTransaction, { isError }] =
    useGenerateTransactionMutation();
  const userData = useSelector((state) => state.auth.userData);

  const dateToday = moment(new Date()).format("YYYY-MM-DD");
  const isCoverageToday = (obj) => {
    const isToday = obj?.some((item) => {
      const coverageFrom = moment(item?.start_date);
      const adjustedCoverageFrom = item?.month_paid
        ? coverageFrom.add(item.month_paid, "months")
        : coverageFrom;
      return adjustedCoverageFrom.format("YYYY-MM-DD") <= dateToday;
    });
    return isToday;
  };

  const isCoverageTodayTable = (date) => {
    const coverageFrom = moment(date?.start_date);
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
        enqueueSnackbar(res?.message, { variant: "success" });
      } catch (error) {
        singleError(error, enqueueSnackbar);
      }
    }
  };

  const today = dayjs();
  const minDate = useMemo(() => {
    const closedRecords = cutOff?.result?.filter(
      (record) => record.state === "closed"
    );
    const mostRecentClosedDate = closedRecords?.reduce((latest, record) => {
      return new Date(latest.date) > new Date(record.date) ? latest : record;
    });

    const recentClosedDate = mostRecentClosedDate
      ? dayjs(mostRecentClosedDate.date)
      : null;

    if (today?.get("month") !== recentClosedDate?.get("month")) {
      return today?.subtract(1, "month").startOf("month");
    } else {
      return recentClosedDate?.startOf("month");
    }
  }, [today]);

  const isDateNotCutOff = (date) => {
    const dateTagged = moment(date).format("MM-DD-YYYY");
    const availableDate = moment(new Date(minDate)).format("MM-DD-YYYY");
    return moment(dateTagged).diff(availableDate, "days") >= 0;
  };

  return {
    isCoverageToday,
    isCoverageTodayTable,
    autoGenerateVoucher,
    isDateNotCutOff,
    minDate,
  };
};

export default DateChecker;
