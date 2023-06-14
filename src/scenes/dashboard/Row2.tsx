import dynamic from "next/dynamic"; // need this for pie chart or will get hydration errors

import React, { useMemo } from "react";
import DashboardBox from "../../components/DashboardBox";
import BoxHeader from "@/components/BoxHeader";
import FlexBetween from "@/components/FlexBetween";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  Pie,
  TooltipProps,
  Bar,
  BarChart,
  Area,
  AreaChart,
} from "recharts";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

import {
  GetKpisResponse,
  GetProductsResponse,
  GetPopularDrinksResponse,
  GetAverageTransactionsResponse,
  GetAverageTransactionPriceResponse,
  GetAverageTransactionPriceWeekResponse,
} from "@/types";

type Props = {
  data: GetKpisResponse[];
  data2: GetProductsResponse[];
  popularDrinksData: GetPopularDrinksResponse[];
  averageTransactionsData: GetAverageTransactionsResponse[];
  averageTransactionPriceData: GetAverageTransactionPriceResponse[];
  averageTransactionPriceWeekData: GetAverageTransactionPriceWeekResponse[];
};

const pieData = [
  { name: "Group A", value: 6924 },
  { name: "Group B", value: 1161.1 },
];

const PieChart = dynamic(
  () => import("recharts").then((recharts) => recharts.PieChart),
  { ssr: false }
);

function Row2({
  data: operationalData,
  data2: productData,
  popularDrinksData,
  averageTransactionsData,
  averageTransactionPriceData,
  averageTransactionPriceWeekData,
}: Props) {
  const { palette } = useTheme();

  const pieColors = [palette.primary[800], palette.primary[300]];

  const operationalExpenses = useMemo(() => {
    return (
      operationalData &&
      operationalData[0].monthlyData.map(
        ({ month, operationalExpenses, nonOperationalExpenses }) => {
          return {
            name: month.substring(0, 3),
            "Operational Expenses": operationalExpenses,
            "Non Operational Expenses": nonOperationalExpenses,
          };
        }
      )
    );
  }, [operationalData]);

  const productExpenseData = useMemo(() => {
    return (
      productData &&
      productData.map(({ _id, price, expense }) => {
        return {
          id: _id,
          price: price,
          expense: expense,
        };
      })
    );
  }, [productData]);

  const averageTransactions = useMemo(() => {
    if (averageTransactionsData) {
      return averageTransactionsData[0].average_transactions_per_day;
    }
  }, [averageTransactionsData]);

  const averageTransactionPrice = useMemo(() => {
    if (averageTransactionPriceData) {
      return (
        averageTransactionPriceData[0]?.average_amount_per_transaction / 100
      );
    }
    return 0; // need this to avoid returning undefined
  }, [averageTransactionPriceData]);

  const averageTransactionPriceWeek = useMemo(() => {
    return (
      averageTransactionPriceWeekData &&
      averageTransactionPriceWeekData.map(
        ({ average_amount_per_transaction, week_start_date }) => {
          return {
            day: week_start_date,
            amount: parseFloat(
              (average_amount_per_transaction / 100).toFixed(2)
            ), // easy way to get the dollar amount with cents without changing to string
          };
        }
      )
    );
  }, [averageTransactionPriceWeekData]);

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      const value = payload[0]?.value as number | undefined;
      if (value !== undefined) {
        return (
          <div className="custom-tooltip">
            <p>{`${label}`}</p>
            <p>
              Total:<b>{` $${value.toLocaleString()}`}</b>
            </p>
          </div>
        );
      }
    }

    return null;
  };

  return (
    <>
      <DashboardBox gridArea="d">
        <BoxHeader
          title="Average Sales Price by Week in Q2"
          subtitle="average dollar amount per transaction"
          sideText={`${Math.round(
            ((averageTransactionPriceWeek[
              averageTransactionPriceWeek.length - 1
            ].amount -
              averageTransactionPriceWeek[
                averageTransactionPriceWeek.length - 2
              ].amount) /
              averageTransactionPriceWeek[
                averageTransactionPriceWeek.length - 1
              ].amount) *
              100
          )}%`}
        />
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={400}
            data={averageTransactionPriceWeek}
            margin={{
              top: 20,
              right: 10,
              left: -10,
              bottom: 55,
            }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={palette.primary[300]}
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor={palette.primary[500]}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              dataKey="amount"
              tickLine={false}
              axisLine={{ strokeWidth: "0" }}
              style={{ fontSize: "10px" }}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="amount"
              dot={true}
              stroke={palette.primary.main}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </DashboardBox>

      <DashboardBox gridArea="e">
        <BoxHeader
          title="Trending Averages in Q2"
          sideText={`+${Math.round(
            ((averageTransactionPriceWeek[
              averageTransactionPriceWeek.length - 1
            ].amount -
              averageTransactionPrice) /
              averageTransactionPriceWeek[
                averageTransactionPriceWeek.length - 1
              ].amount) *
              100
          )}%`}
        />
        <FlexBetween mt="0.25rem" gap="1.5rem" pr="1rem">
          <PieChart
            width={110}
            height={100}
            margin={{
              top: 20,
              right: -10,
              left: 10,
              bottom: 0,
            }}
          >
            <Pie
              stroke="none"
              data={pieData}
              innerRadius={18}
              outerRadius={38}
              paddingAngle={2}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index]} />
              ))}
            </Pie>
          </PieChart>
          <Box ml="-0.7rem" flexBasis="40%" textAlign="center">
            <Typography variant="h5">Averages Sales</Typography>
            <Typography m="0.3rem 0" variant="h3" color={palette.primary[300]}>
              {`${averageTransactions?.toString().slice(0, 2)}`}
            </Typography>
            <Typography variant="h6">per business day</Typography>
          </Box>
          <Box ml="-0.7rem" flexBasis="40%" textAlign="center">
            <Typography variant="h5">Average Transaction Amount</Typography>
            <Typography m="0.3rem 0" variant="h3" color={palette.primary[300]}>
              {`$${averageTransactionPrice?.toString().slice(0, 5)}`}
            </Typography>
            <Typography variant="h6">
              {/* Finance goals of the campaign that is desired */}
            </Typography>
          </Box>
          {/* <Box flexBasis="40%">
            <Typography variant="h5">Losses in Revenue</Typography>
            <Typography variant="h6">Losses are down 25%</Typography>
            <Typography mt="0.4rem" variant="h6">
              Margins are up by 30% from last month.
            </Typography>
          </Box> */}
        </FlexBetween>
      </DashboardBox>

      <DashboardBox gridArea="f">
        <BoxHeader
          title="Most Popular Drinks"
          subtitle="most popular drinks in Q2"
          sideText="+4%"
        />
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={popularDrinksData}
            margin={{
              top: 17,
              right: 15,
              left: -15,
              bottom: 75,
            }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={palette.primary[300]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={palette.primary[300]}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              interval={0}
              tick={{
                fontSize: "10px",
                width: "50px",
              }}
            />
            <YAxis
              dataKey="count"
              axisLine={false}
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <Tooltip />
            <Bar dataKey="count" fill="url(#colorRevenue)" />
          </BarChart>
        </ResponsiveContainer>
      </DashboardBox>
    </>
  );
}

export default Row2;
