import dynamic from "next/dynamic"; // need this for pie chart or will get hydration errors

import React, { useMemo } from "react";
import DashboardBox from "../../components/DashboardBox";
// import {
//   useGetKpisQuery,
//   useGetProductsQuery,
//   useGetTransactionsQuery,
// } from "@/state/api";
import BoxHeader from "@/components/BoxHeader";
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import FlexBetween from "@/components/FlexBetween";
import { Cell, Pie } from "recharts";

import {
  GetKpisResponse,
  GetProductsResponse,
  GetTransactionsResponse,
  GetRecentTransactionsResponse,
  GetBusiestTimesResponse,
  GetPopularDrinksResponse,
} from "@/types";

interface ExtendedGridCellParams extends GridCellParams {
  value: number;
}

interface ColumnWithRenderCell {
  field: string;
  headerName: string;
  flex: number;
  renderCell?: {
    params?: ExtendedGridCellParams;
  };
}

type Props = {
  data: GetKpisResponse[];
  data2: GetProductsResponse[];
  data3: GetTransactionsResponse[];
  recentTransactionsData: GetRecentTransactionsResponse[];
  GetBusiestTimesData: GetBusiestTimesResponse[];
  popularDrinksData: GetPopularDrinksResponse[];
};

const PieChart = dynamic(
  () => import("recharts").then((recharts) => recharts.PieChart),
  { ssr: false }
);

function Row3({
  data: kpiData,
  data2: productData,
  data3: transactionData,
  recentTransactionsData,
  GetBusiestTimesData,
  popularDrinksData,
}: Props) {
  const { palette } = useTheme();
  const pieColors = [palette.primary[800], palette.primary[500]];

  const recentTransactions = useMemo(() => {
    if (recentTransactionsData) {
      return recentTransactionsData.map((item) => ({
        total: item.amount,
        tip: item.amount_1,
        createdAt: item.createdAt.value,
        cardholderName: item.cardholderName,
      }));
    }
  }, [recentTransactionsData]);

  const pieChartData = useMemo(() => {
    if (kpiData) {
      const totalExpenses = kpiData[0].totalExpenses;
      return Object.entries(kpiData[0].expensesByCategory).map(
        ([key, value]) => {
          return [
            { name: key, value: value },
            {
              name: `${key} of Total`,
              value: totalExpenses / 100 - value,
            },
          ];
        }
      );
    }
  }, [kpiData]);

  const productColumns = [
    { field: "_id", headerName: "id", flex: 1 },
    {
      field: "expense",
      headerName: "Expense",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
  ];

  const transactionColumns = [
    { field: "createdAt", headerName: "Date", flex: 0.8 },
    {
      field: "cardholderName",
      headerName: "Buyer",
      flex: 0.67,
    },
    {
      field: "total",
      headerName: "Total",
      flex: 0.35,
      renderCell: (params: GridCellParams) => {
        if (params.value == null || params.value == 0) return `$0`;
        const dollar = Math.floor(+params.value / 100);
        return `$${dollar}.${+params.value % (dollar * 100)}`;
      },
    },
    {
      field: "tip",
      headerName: "Tip",
      flex: 0.3,
      renderCell: (params: GridCellParams) => {
        if (params.value == null) return `$0`;
        const dollar = Math.floor(+params.value / 100);
        return `$${dollar}.${+params.value % (dollar * 100)}`;
      },
    },
  ];

  const busiestTimesColumns = [
    { field: "day", headerName: "Day", flex: 0.67 },
    {
      field: "hour",
      headerName: "Hour",
      flex: 0.67,
    },
    {
      field: "transactions",
      headerName: "Transactions",
      flex: 0.67,
    },
  ];

  const busiestTimes = useMemo(() => {
    const days: any = {
      2: "Monday",
      3: "Tuesday",
      4: "Wednesday",
      5: "Thursday",
      6: "Friday",
      7: "Saturday",
    };
    const hours: any = {
      12: "12:00 - 1:00 pm",
      13: "1:00 - 2:00 pm",
      14: "2:00 - 3:00 pm",
      15: "3:00 - 4:00 pm",
      16: "4:00 - 5:00 pm",
      17: "5:00 - 6:00 pm",
      18: "6:00 - 7:00 pm",
      19: "7:00 - 8:00 pm",
      20: "8:00 - 9:00 pm",
      21: "9:00 - 10:00 pm",
      22: "10:00 - 11:00 pm",
      23: "11:00 - 12:00 pm",
      24: "12:00 - 1:00 pm",
    };
    if (GetBusiestTimesData) {
      return GetBusiestTimesData.map(
        ({ day_of_week, hour_of_day, transaction_count }) => ({
          day: days[day_of_week],
          hour: hours[hour_of_day],
          transactions: transaction_count,
        })
      );
    }
  }, [GetBusiestTimesData]);

  const drinkData = useMemo(() => {
    const cocktail: any = {
      "Jinju Juice": "1",
      "Safe Passage": "1",
      "Saint Elaine": "1",
      Babamama: "1",
      "Captain Takes the Wheel": "1",
      "Marco Polo": "1",
      "Spice Exchange": "1",
      "Uncharted Waters": "1",
      "Royal Pardon": "1",
    };

    const beerWine: any = {
      "Maui Waui IPA": "1",
      "Taco Truck Lager": "1",
      "Death & Taxes": "1",
      "Sauv Blanc": "1",
      "Brooks Dry Cider": "1",
      "House Red": "1",
      "Sparkling (Pine Ridge)": "1",
      "People's Pilsner": "1",
      "Rose (Campe Mentelle)": "1",
      "Chardonnay (Baileyana)": "1",
    };

    let count = 0;
    let cocktailCount = 0;
    let beerWineCount = 0;
    popularDrinksData.forEach((entry) => {
      count += entry.count;
      if (cocktail[entry.name]) {
        cocktailCount += entry.count;
      }
      if (beerWine[entry.name]) {
        beerWineCount += entry.count;
      }
    });

    return {
      total: count,
      well: popularDrinksData[0].count,
      cocktails: cocktailCount,
      beerWine: beerWineCount,
    };
  }, [popularDrinksData]);

  const wellData = [
    { name: "Group A", value: drinkData.well },
    { name: "Group B", value: drinkData.total - drinkData.well },
  ];

  const cocktailData = [
    { name: "Group A", value: drinkData.cocktails },
    { name: "Group B", value: drinkData.total - drinkData.cocktails },
  ];

  const beerWineData = [
    { name: "Group A", value: drinkData.beerWine },
    { name: "Group B", value: drinkData.total - drinkData.beerWine },
  ];

  /* Data Grid is looking for an id but mongoDB uses _.id so you need the getRowId */

  return (
    <>
      <DashboardBox gridArea="g">
        <BoxHeader title="Drinks by Percentage of Total" sideText="" />
        <FlexBetween mt="0.5rem" gap="1.5rem" p="0 1rem" textAlign="center">
          <Box ml="1rem">
            <PieChart
              width={90}
              height={90}
              margin={{
                top: 10,
                right: 0,
                left: 10,
                bottom: 20,
              }}
            >
              <Pie
                stroke="none"
                data={cocktailData}
                innerRadius={18}
                outerRadius={38}
                paddingAngle={2}
                dataKey="value"
              >
                {wellData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index]} />
                ))}
              </Pie>
            </PieChart>
            <Typography variant="h5">
              Cocktails:
              {` ${Math.round((drinkData.cocktails / drinkData.total) * 100)}%`}
            </Typography>
          </Box>

          <Box>
            <PieChart
              width={90}
              height={90}
              margin={{
                top: 10,
                right: 0,
                left: 10,
                bottom: 20,
              }}
            >
              <Pie
                stroke="none"
                data={beerWineData}
                innerRadius={18}
                outerRadius={38}
                paddingAngle={2}
                dataKey="value"
              >
                {wellData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index]} />
                ))}
              </Pie>
            </PieChart>
            <Typography variant="h5">
              Beer/Wine:
              {` ${Math.round((drinkData.beerWine / drinkData.total) * 100)}%`}
            </Typography>
          </Box>
          <Box mr="1rem">
            <PieChart
              width={90}
              height={90}
              margin={{
                top: 10,
                right: 0,
                left: 10,
                bottom: 20,
              }}
            >
              <Pie
                stroke="none"
                data={wellData}
                innerRadius={18}
                outerRadius={38}
                paddingAngle={2}
                dataKey="value"
              >
                {wellData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index]} />
                ))}
              </Pie>
            </PieChart>
            <Typography variant="h5">
              Well:{" "}
              {` ${Math.round((drinkData.well / drinkData.total) * 100)}%`}
            </Typography>
          </Box>
        </FlexBetween>
      </DashboardBox>

      <DashboardBox gridArea="h">
        <BoxHeader
          title="Recent Orders"
          sideText={`${recentTransactions?.length} latest transactions`}
        />
        <Box
          mt="1rem"
          p="0 0.5rem"
          height="80%"
          sx={{
            "& .MuiDataGrid-root": {
              color: palette.grey[300],
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${palette.grey[300]}`,
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: `1px solid ${palette.grey[300]}`,
            },
            "& .MuiDataGrid-columnSeparator": {
              visiblity: "hidden",
            },
          }}
        >
          <DataGrid
            columnHeaderHeight={25}
            rowHeight={35}
            hideFooter={true}
            rows={recentTransactions || []}
            columns={transactionColumns}
            getRowId={(row) => row.createdAt}
          />
        </Box>
      </DashboardBox>
      <DashboardBox gridArea="i">
        <BoxHeader title="Busiest Times of Day" sideText="" />
        <Box
          mt="0.5rem"
          p="0 0.5rem"
          height="75%"
          sx={{
            "& .MuiDataGrid-root": {
              color: palette.grey[300],
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${palette.grey[300]}`,
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: `1px solid ${palette.grey[300]}`,
            },
            "& .MuiDataGrid-columnSeparator": {
              visiblity: "hidden",
            },
          }}
        >
          <DataGrid
            columnHeaderHeight={25}
            rowHeight={25}
            hideFooter={true}
            rows={busiestTimes || []}
            columns={busiestTimesColumns}
            getRowId={(row) => row.transactions}
          />
        </Box>
      </DashboardBox>
      {/* <DashboardBox gridArea="j">
        <BoxHeader
          title="Overall Summary and Explanation Data"
          sideText="+15%"
        />
        <Box
          height="15px"
          margin="1.25rem 1rem 0.4rem 1rem"
          bgcolor={palette.primary[800]}
          borderRadius="1rem"
        >
          <Box
            height="15px"
            bgcolor={palette.primary[600]}
            borderRadius="1rem"
            width="40%"
          ></Box>
        </Box>
        <Typography margin="0 1rem" variant="h6">
          Test Data
        </Typography>
      </DashboardBox> */}
    </>
  );
}

export default Row3;
