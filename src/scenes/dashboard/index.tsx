import { Box, useMediaQuery } from "@mui/material";
import Row1 from "./Row1";
import Row2 from "./Row2";
import Row3 from "./Row3";

import {
  GetKpisResponse,
  GetPopularDrinksResponse,
  GetProductsResponse,
  GetTransactionsResponse,
  GetRecentTransactionsResponse,
  GetTotalSalesDayResponse,
  GetTotalSalesWeekResponse,
  GetTotalSalesMonthResponse,
  GetSalesPerDayResponse,
  GetAverageTransactionPriceResponse,
  GetAverageTransactionsResponse,
  GetAverageTransactionPriceWeekResponse,
  GetBusiestTimesResponse,
} from "@/types";

type Props = {
  data: GetKpisResponse[];
  data2: GetProductsResponse[];
  data3: GetTransactionsResponse[];
  popularDrinksData: GetPopularDrinksResponse[];
  recentTransactionsData: GetRecentTransactionsResponse[];
  totalSalesDayData: GetTotalSalesDayResponse[];
  totalSalesWeekData: GetTotalSalesWeekResponse[];
  totalSalesMonthData: GetTotalSalesMonthResponse[];
  salesPerDayData: GetSalesPerDayResponse[];
  averageTransactionsData: GetAverageTransactionsResponse[];
  averageTransactionPriceData: GetAverageTransactionPriceResponse[];
  averageTransactionPriceWeekData: GetAverageTransactionPriceWeekResponse[];
  GetBusiestTimesData: GetBusiestTimesResponse[];
};

const gridTemplateLargeScreens = `
"a b c"
"a b c"
"a b c"
"a b c"
"d e f"
"d e f"
"d h f"
"g h i"
"g h i"
"g h i"
`;

const gridTemplateSmallScreens = `
"a"
"a"
"a"
"a"
"b"
"b"
"b"
"b"
"c"
"c"
"c"
"c"
"d"
"d"
"d"
"e"
"e"
"f"
"f"
"f"
"g"
"g"
"g"
"h"
"h"
"h"
"h"
"i"
"i"
`;

function Dashboard({
  data,
  data2,
  data3,
  popularDrinksData,
  recentTransactionsData,
  totalSalesDayData,
  totalSalesWeekData,
  totalSalesMonthData,
  salesPerDayData,
  averageTransactionsData,
  averageTransactionPriceData,
  averageTransactionPriceWeekData,
  GetBusiestTimesData,
}: Props) {
  const isAboveMediumScreens = useMediaQuery("(min-width: 1200px)");

  return (
    <Box
      width="100%"
      height="100%"
      display="grid"
      gap="1.5rem"
      sx={
        isAboveMediumScreens
          ? {
              gridTemplateColumns: "repeat(3, minmax(370px, 1fr))",
              gridTemplateRows: "repeat(10, minmax(60px,1fr))",
              gridTemplateAreas: gridTemplateLargeScreens,
            }
          : {
              gridAutocolumns: "1fr",
              gridAutoRows: "80px",
              gridTemplateAreas: gridTemplateSmallScreens,
            }
      }
    >
      <Row1
        data={data}
        totalSalesDayData={totalSalesDayData}
        totalSalesWeekData={totalSalesWeekData}
        totalSalesMonthData={totalSalesMonthData}
        salesPerDayData={salesPerDayData}
      />
      <Row2
        data={data}
        data2={data2}
        popularDrinksData={popularDrinksData}
        averageTransactionsData={averageTransactionsData}
        averageTransactionPriceData={averageTransactionPriceData}
        averageTransactionPriceWeekData={averageTransactionPriceWeekData}
      />
      <Row3
        data={data}
        data2={data2}
        data3={data3}
        recentTransactionsData={recentTransactionsData}
        GetBusiestTimesData={GetBusiestTimesData}
      />
    </Box>
  );
}

export default Dashboard;
