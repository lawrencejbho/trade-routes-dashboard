import dynamic from "next/dynamic"; // need this for pie chart or will get hydration errors

import React, { useMemo } from "react";
import DashboardBox from "../../components/DashboardBox";
// import {
//   useGetKpisQuery,
//   useGetProductsQuery,
//   useGetTransactionsQuery,
// } from "@/state/api";
import BoxHeader from "@/components/BoxHeader";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import FlexBetween from "@/components/FlexBetween";
import { Cell, Pie } from "recharts";

import {
  GetKpisResponse,
  GetProductsResponse,
  GetTransactionsResponse,
  GetRecentTransactionsResponse,
} from "@/types";

interface ExtendedGetRecentTransactionsResponse {
  response: GetRecentTransactionsResponse[];
}

type Props = {
  data: GetKpisResponse[];
  data2: GetProductsResponse[];
  data3: GetTransactionsResponse[];
  data5: ExtendedGetRecentTransactionsResponse;
};

const PieChart = dynamic(
  () => import("recharts").then((recharts) => recharts.PieChart),
  { ssr: false }
);

function Row3({
  data: kpiData,
  data2: productData,
  data3: transactionData,
  data5,
}: Props) {
  const { palette } = useTheme();
  const pieColors = [palette.primary[800], palette.primary[500]];

  const recentTransactions = useMemo(() => {
    if (data5) {
      return data5.response.map((item) => ({
        total: item.amount,
        tip: item.amount_1,
        createdAt: item.createdAt.value,
        cardholderName: item.cardholderName,
      }));
    }
  }, [data5]);

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
        const dollar = Math.floor(params.value / 100);
        return `$${dollar}.${params.value % (dollar * 100)}`;
      },
    },
    {
      field: "tip",
      headerName: "Tip",
      flex: 0.3,
      renderCell: (params: GridCellParams) => {
        if (params.value == null) return `$0`;
        const dollar = Math.floor(params.value / 100);
        return `$${dollar}.${params.value % (dollar * 100)}`;
      },
    },
  ];

  /* Data Grid is looking for an id but mongoDB uses _.id so you need the getRowId */

  return (
    <>
      <DashboardBox gridArea="g">
        <BoxHeader
          title="List of Products"
          sideText={`${productData?.length} products`}
        />
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
            rowHeight={35}
            hideFooter={true}
            rows={productData || []}
            columns={productColumns}
            getRowId={(row) => row._id}
          />
        </Box>
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
        <BoxHeader title="Expense Breakdown By Category" sideText="+4%" />
        <FlexBetween mt="0.5rem" gap="0.5rem" p="0 1rem" textAlign="center">
          {pieChartData?.map((data, i) => (
            <Box key={`${data[0].name}-${i}`}>
              <PieChart width={110} height={100}>
                <Pie
                  stroke="none"
                  data={data}
                  innerRadius={18}
                  outerRadius={35}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index]} />
                  ))}
                </Pie>
              </PieChart>
              <Typography variant="h5">{data[0].name}</Typography>
            </Box>
          ))}
        </FlexBetween>
      </DashboardBox>
      <DashboardBox gridArea="j">
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
      </DashboardBox>
    </>
  );
}

export default Row3;
