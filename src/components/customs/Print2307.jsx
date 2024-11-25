import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import "../styles/Modal.scss";
import { useSelector } from "react-redux";
import {
  addressCount,
  alignColumn,
  getEndQuarter,
  getStartQuarter,
  joinAddressParts,
} from "../../services/functions/pdfProcess";
import moment from "moment";
import { compute2307 } from "../../services/functions/compute";
import { AdditionalFunction } from "../../services/functions/AdditionalFunction";
import { useAtcQuery } from "../../services/api/atcApi";
import { useTaxComputationQuery } from "../../services/api/taxComputationApi";

const Print2307 = React.forwardRef((props, ref) => {
  const { convertToPeso } = AdditionalFunction();
  const menuData = useSelector((state) => state.menu.menuData);
  const voucher = useSelector((state) => state.menu.voucher);
  const { date_received, supplier } = menuData?.transactions || {};
  const { tin, address, name } = supplier || {};
  const month = new Date(date_received).getMonth() + 1;
  const quarter = Math.ceil(month / 3);
  const monthInQuarter = month <= 5 ? 1 : month <= 8 ? 2 : 3;

  const year = moment().year();
  const [from, to] = [
    getStartQuarter(quarter, year),
    getEndQuarter(quarter, year),
  ];

  const { joinedParts, remainingParts } = joinAddressParts(
    addressCount(address),
    0,
    10
  );
  const parts = tin?.split("-") || [];
  const zipCode = address?.split(",").pop().trim();
  const showZipCode = /^\d{4}$/.test(zipCode);

  const { data: taxComputation } = useTaxComputationQuery(
    {
      status: "active",
      transaction_id: voucher === "gj" ? [] : menuData?.transactions?.id,
      gj_id: voucher !== "gj" ? "" : menuData?.id,
      voucher: voucher,
      pagination: "none",
    },
    { skip: menuData === null }
  );

  const { data: atc } = useAtcQuery({
    status: "active",
    pagination: "none",
  });

  const { npl, nps, vpl, vps, wNTaxL, wNTaxS, wTaxL, wTaxS } = compute2307(
    taxComputation?.result
  );

  const atc_tax = taxComputation?.result?.find(
    (item) => item?.mode === "Debit"
  );
  const atc_name = atc?.result?.find((item) => atc_tax?.atc_id === item.id);
  const isSG =
    atc_name?.code?.substring(2, 5) === "158" ||
    atc_name?.code?.substring(2, 5) === "160";

  const hasAmountL = vpl !== 0 || npl !== 0;
  const hasAmountS = vps !== 0 || nps !== 0;

  const isAG = atc_name?.code?.substring(2, 5) === "120";
  const isRental = atc_name?.code?.substring(2, 5) === "100";
  const isEQ = atc_name?.code?.substring(2, 5) === "140";
  const isHB = atc_name?.code?.substring(2, 5) === "516";

  const renderDateFields = (date, left) =>
    ["MM", "DD", "YYYY"].map((format, i) => (
      <Stack key={format} position="absolute" left={left + i * 35} top={180}>
        <Typography
          className={`pdf-text-font ${format === "YYYY" ? "year" : ""}`}
        >
          {moment(date).format(format)}
        </Typography>
      </Stack>
    ));

  return (
    <Box className="print-2307" ref={ref}>
      <Stack>
        <Stack flexDirection="row">{renderDateFields(from, 210)}</Stack>
        <Stack flexDirection="row">{renderDateFields(to, 535)}</Stack>
      </Stack>

      <Stack flexDirection="row">
        {parts.map((part, index) => (
          <Stack
            key={index}
            position="absolute"
            left={278 + index * 70}
            top={220}
          >
            <Typography className="pdf-text-font tin">{part}</Typography>
          </Stack>
        ))}
      </Stack>

      <Stack flexDirection="row">
        <Stack position="absolute" left={55} top={260}>
          <Typography className="pdf-text-font address">{name}</Typography>
        </Stack>
        <Stack position="absolute" left={55} top={remainingParts ? 295 : 300}>
          <Typography
            className={`pdf-text-font ${
              remainingParts ? "long-address" : "address"
            }`}
          >
            {joinedParts}
          </Typography>
          {remainingParts && (
            <Typography className="pdf-text-font long-address">
              {remainingParts}
            </Typography>
          )}
        </Stack>
        {showZipCode && (
          <Stack position="absolute" left={720} top={300}>
            <Typography className="pdf-text-font year">{zipCode}</Typography>
          </Stack>
        )}
      </Stack>

      {isSG && (
        <Stack flexDirection="row">
          {[
            "Payment made by Top 20,000",
            "Private Corporation to their",
            "Local/Resident Supplier of",
          ].map((text, i) => (
            <Stack key={i} position="absolute" left={55} top={530 + i * 18}>
              <Typography className="pdf-text-font address">{text}</Typography>
            </Stack>
          ))}
          <Stack position="absolute" left={55} top={585}>
            <Typography className="pdf-text-font address">
              {hasAmountL && hasAmountS
                ? "Goods and Services"
                : hasAmountL
                ? "Goods"
                : "Services"}
            </Typography>
          </Stack>

          {hasAmountL && hasAmountS ? (
            <Stack>
              <Stack position="absolute" left={243} top={530}>
                <Typography className="pdf-text-font address">
                  {`${atc_name?.code?.substring(0, 2)}158`}
                </Typography>
              </Stack>
              <Stack position="absolute" left={243} top={548}>
                <Typography className="pdf-text-font address">
                  {`${atc_name?.code?.substring(0, 2)}160`}
                </Typography>
              </Stack>
            </Stack>
          ) : (
            <Stack position="absolute" left={240} top={530}>
              <Typography className="pdf-text-font address">
                {atc_name?.code}
              </Typography>
            </Stack>
          )}
        </Stack>
      )}

      {isAG && (
        <Stack flexDirection="row">
          {["Prime Contractors/ Sub", "Contractors"].map((text, i) => (
            <Stack key={i} position="absolute" left={55} top={530 + i * 18}>
              <Typography className="pdf-text-font address">{text}</Typography>
            </Stack>
          ))}

          <Stack>
            <Stack position="absolute" left={243} top={530}>
              <Typography className="pdf-text-font address">
                {atc_name?.code}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      )}

      {isRental && (
        <Stack flexDirection="row">
          {[
            "Rentals - Real Properties &",
            "Personal Properties, Poles,",
            "Satellites & Transmission",
            "Facilities & Billboards.",
          ].map((text, i) => (
            <Stack key={i} position="absolute" left={55} top={530 + i * 18}>
              <Typography className="pdf-text-font address">{text}</Typography>
            </Stack>
          ))}

          <Stack>
            <Stack position="absolute" left={243} top={530}>
              <Typography className="pdf-text-font address">
                {atc_name?.code}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      )}

      {isEQ && (
        <Stack flexDirection="row">
          {["BROKERAGE FEE"].map((text, i) => (
            <Stack key={i} position="absolute" left={55} top={530 + i * 18}>
              <Typography className="pdf-text-font address">{text}</Typography>
            </Stack>
          ))}

          <Stack>
            <Stack position="absolute" left={243} top={530}>
              <Typography className="pdf-text-font address">
                {atc_name?.code}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      )}

      {isHB && (
        <Stack flexDirection="row">
          {[
            "COMMISSION, REBATES,",
            "DISCOUNTS & OTHER",
            "SIMILAR CONSIDERATIONS",
            "PAID/GRANTED TO",
            "INDEPENDENT & EXCLUSIVE",
            "DISTRIBUTORS,",
            "MEDICAL/TECHNICAL &",
            "SALES REPRESENTATIVES &",
            "MARKETING AGENTS & SUB-",
            "AGENTS OF MULTI-LEVEL",
            "MARKETING COMPANIES",
          ].map((text, i) => (
            <Stack key={i} position="absolute" left={55} top={530 + i * 18}>
              <Typography className="pdf-text-font address">{text}</Typography>
            </Stack>
          ))}

          <Stack>
            <Stack position="absolute" left={243} top={530}>
              <Typography className="pdf-text-font address">
                {atc_name?.code}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      )}
      {hasAmountL && hasAmountS ? (
        <Stack>
          <Stack
            position="absolute"
            left={alignColumn(monthInQuarter)}
            top={530}
          >
            <Typography className="pdf-text-font address">
              {convertToPeso(parseFloat(vpl !== 0 ? vpl : npl).toFixed(2))}
            </Typography>
          </Stack>
          <Stack
            position="absolute"
            left={alignColumn(monthInQuarter)}
            top={548}
          >
            <Typography className="pdf-text-font address">
              {convertToPeso(parseFloat(vps !== 0 ? vps : nps).toFixed(2))}
            </Typography>
          </Stack>
          <Stack position="absolute" left={600} top={530}>
            <Typography className="pdf-text-font address">
              {convertToPeso(parseFloat(vpl !== 0 ? vpl : npl).toFixed(2))}
            </Typography>
          </Stack>
          <Stack position="absolute" left={600} top={548}>
            <Typography className="pdf-text-font address">
              {convertToPeso(parseFloat(vps !== 0 ? vps : nps).toFixed(2))}
            </Typography>
          </Stack>
          <Stack position="absolute" left={700} top={530}>
            <Typography className="pdf-text-font address">
              {convertToPeso(
                parseFloat(wTaxL !== 0 ? wTaxL : wNTaxL).toFixed(2)
              )}
            </Typography>
          </Stack>

          <Stack position="absolute" left={700} top={548}>
            <Typography className="pdf-text-font address">
              {convertToPeso(
                parseFloat(wTaxS !== 0 ? wTaxS : wNTaxS).toFixed(2)
              )}
            </Typography>
          </Stack>

          <Stack
            position="absolute"
            left={alignColumn(monthInQuarter)}
            top={710}
          >
            <Typography className="pdf-text-font address">
              {convertToPeso(parseFloat(vps + vpl + nps + npl).toFixed(2))}
            </Typography>
          </Stack>

          <Stack position="absolute" left={600} top={710}>
            <Typography className="pdf-text-font address">
              {convertToPeso(parseFloat(vps + vpl + nps + npl).toFixed(2))}
            </Typography>
          </Stack>

          <Stack position="absolute" left={700} top={710}>
            <Typography className="pdf-text-font address">
              {convertToPeso(
                parseFloat(wTaxL + wTaxS + wNTaxL + wNTaxS).toFixed(2)
              )}
            </Typography>
          </Stack>
        </Stack>
      ) : (
        <Stack>
          <Stack
            position="absolute"
            left={alignColumn(monthInQuarter)}
            top={530}
          >
            <Typography className="pdf-text-font address">
              {hasAmountL
                ? convertToPeso(parseFloat(vpl !== 0 ? vpl : npl).toFixed(2))
                : convertToPeso(parseFloat(vps !== 0 ? vps : nps).toFixed(2))}
            </Typography>
          </Stack>
          <Stack position="absolute" left={600} top={530}>
            <Typography className="pdf-text-font address">
              {hasAmountL
                ? convertToPeso(parseFloat(vpl !== 0 ? vpl : npl).toFixed(2))
                : convertToPeso(parseFloat(vps !== 0 ? vps : nps).toFixed(2))}
            </Typography>
          </Stack>
          <Stack position="absolute" left={700} top={530}>
            <Typography className="pdf-text-font address">
              {hasAmountL
                ? convertToPeso(
                    parseFloat(wTaxL !== 0 ? wTaxL : wNTaxL).toFixed(2)
                  )
                : convertToPeso(
                    parseFloat(wTaxS !== 0 ? wTaxS : wNTaxS).toFixed(2)
                  )}
            </Typography>
          </Stack>
          <Stack
            position="absolute"
            left={alignColumn(monthInQuarter)}
            top={710}
          >
            <Typography className="pdf-text-font address">
              {hasAmountL
                ? convertToPeso(parseFloat(vpl !== 0 ? vpl : npl).toFixed(2))
                : convertToPeso(parseFloat(vps !== 0 ? vps : nps).toFixed(2))}
            </Typography>
          </Stack>

          <Stack position="absolute" left={600} top={710}>
            <Typography className="pdf-text-font address">
              {hasAmountL
                ? convertToPeso(parseFloat(vpl !== 0 ? vpl : npl).toFixed(2))
                : convertToPeso(parseFloat(vps !== 0 ? vps : nps).toFixed(2))}
            </Typography>
          </Stack>

          <Stack position="absolute" left={700} top={710}>
            <Typography className="pdf-text-font address">
              {hasAmountL
                ? convertToPeso(
                    parseFloat(wTaxL !== 0 ? wTaxL : wNTaxL).toFixed(2)
                  )
                : convertToPeso(
                    parseFloat(wTaxS !== 0 ? wTaxS : wNTaxS).toFixed(2)
                  )}
            </Typography>
          </Stack>
        </Stack>
      )}
    </Box>
  );
});

export default Print2307;
