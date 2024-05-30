import moment from "moment";

const DateChecker = () => {
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

  return { isCoverageToday, isCoverageTodayTable };
};

export default DateChecker;
