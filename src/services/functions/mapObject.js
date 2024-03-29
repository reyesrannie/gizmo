import moment from "moment";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const mapTransaction = (submitData) => {
  const obj = {
    tag_no: submitData?.tag_no,
    date_invoice: moment(submitData?.date_invoice).format("YYYY-MM-DD"),
    date_received: moment(submitData?.date_received).format("YYYY-MM-DD"),
    document_type_id: submitData?.document_type?.id || "",
    supplier_type_id: submitData?.supplier_type_id || "",
    atc_id: submitData?.atc_id || "",
    supplier_id: submitData?.tin?.id,
    description: submitData?.description || "",
    reference_no: submitData?.ref_no,
    invoice_no: submitData?.invoice_no || "",
    purchase_amount: submitData?.amount,
    amount_withheld: submitData?.amount_withheld || "",
    amount_check: submitData?.amount_check || "",
    vat_amount: submitData?.vat || "",
    cost: submitData?.cost || "",
    description: submitData?.description || "",
    location_id: submitData?.store?.id,
    coverage_from: submitData?.coverage_from
      ? moment(submitData?.coverage_from).format("YYYY-MM-DD")
      : null,
    coverage_to:
      submitData?.coverage_to !== null
        ? moment(submitData?.coverage_to).format("YYYY-MM-DD")
        : null,
    account_number_id: submitData?.account_number?.id,
    ap_tagging_id: submitData?.ap?.id,
    tag_year: moment(submitData?.tag_month_year).format("YYMM"),
    gtag_no: submitData?.g_tag_number,
  };

  return obj;
};

const mapViewTransaction = (
  transactionData,
  ap,
  tin,
  document,
  accountNumber,
  location
) => {
  const values = {
    tag_no: transactionData?.tag_no || "",
    supplier: transactionData?.supplier?.name || "",
    proprietor: transactionData?.supplier?.proprietor || "",
    company_address: transactionData?.supplier?.address || "",
    name_in_receipt: transactionData?.supplier?.receipt_name || "",
    invoice_no: transactionData?.invoice_no || "",
    ref_no: transactionData?.reference_no || "",
    amount_withheld: transactionData?.amount_check || "",
    amount_check: transactionData?.amount_withheld || "",
    amount: transactionData?.purchase_amount || "",
    vat: transactionData?.vat_amount || "",
    cost: transactionData?.cost || "",
    g_tag_number: transactionData?.gtag_no || "",
    description: transactionData?.description || "",
    supplier_type_id: transactionData?.supplierType?.id || "",
    atc_id: transactionData?.atc?.id || "",

    ap:
      ap?.result?.find((item) => transactionData?.apTagging?.id === item.id) ||
      null,
    tin:
      tin?.result?.find((item) => transactionData?.supplier?.id === item.id) ||
      null,
    date_invoice:
      dayjs(new Date(transactionData?.date_invoice), {
        locale: AdapterDayjs.locale,
      }) || null,
    date_recieved:
      dayjs(new Date(transactionData?.date_received), {
        locale: AdapterDayjs.locale,
      }) || null,
    document_type:
      document?.result?.find(
        (item) => transactionData?.documentType?.id === item.id
      ) || null,
    account_number:
      accountNumber?.result?.find(
        (item) => transactionData?.accountNumber?.id === item.id
      ) || null,
    store:
      location?.result?.find(
        (item) => transactionData?.location?.id === item.id
      ) || null,
    coverage_from:
      dayjs(new Date(transactionData?.coverage_from), {
        locale: AdapterDayjs.locale,
      }) || null,
    coverage_to:
      dayjs(new Date(transactionData?.coverage_to), {
        locale: AdapterDayjs.locale,
      }) || null,
  };

  return values;
};

const mapAPTransaction = (
  transactionData,
  tin,
  document,
  accountNumber,
  atc
) => {
  const supplierTin =
    tin?.result?.find((item) => transactionData?.supplier_id === item.id) ||
    null;
  const documentType =
    document?.result?.find(
      (item) => transactionData?.document_type_id === item.id
    ) || null;

  const values = {
    tag_no: transactionData?.tag_no || "",
    supplier: supplierTin?.company_name || "",
    proprietor: supplierTin?.proprietor || "",
    company_address: supplierTin?.company_address || "",
    invoice_no: transactionData?.invoice_no || "",

    description: transactionData?.description || "",
    tin: supplierTin,
    date_invoice:
      dayjs(new Date(transactionData?.date_invoice), {
        locale: AdapterDayjs.locale,
      }) || null,

    document_type: documentType,

    atc_id:
      atc?.result?.find((item) => transactionData?.atc_id === item.id) || null,
    account_number:
      accountNumber?.result?.find(
        (item) => transactionData?.accountNumber?.id === item.id
      ) || null,
  };

  return values;
};

export { mapTransaction, mapViewTransaction, mapAPTransaction };
