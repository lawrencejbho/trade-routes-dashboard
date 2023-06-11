import React, { useMemo } from "react";
import DashboardBox from "@/components/DashboardBox";
import BoxHeader from "@/components/BoxHeader";

// import { useGetKpisQuery } from "@/state/api";

import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  Line,
  CartesianGrid,
  Legend,
  LineChart,
  Bar,
  BarChart,
} from "recharts";
import { useTheme } from "@mui/material/styles";

import {
  GetKpisResponse,
  GetPopularDrinksResponse,
  GetTotalSalesResponse,
} from "@/types";

type Props = {
  data: GetKpisResponse[];
  popularDrinksData: GetPopularDrinksResponse[];
  totalSalesData: GetTotalSalesResponse[];
};

function Row1({ data, popularDrinksData, totalSalesData }: Props) {
  const { palette } = useTheme();
  // const { data } = useGetKpisQuery();

  console.log(totalSalesData);

  // run this funciton only when data changes
  const revenueExpenses = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({ month, revenue, expenses }) => {
        return {
          name: month.substring(0, 3),
          revenue: revenue,
          expenses: expenses,
        };
      })
    );
  }, [data]);

  const revenueProfit = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({ month, revenue, expenses }) => {
        return {
          name: month.substring(0, 3),
          revenue: revenue,
          profit: (revenue - expenses).toFixed(2),
        };
      })
    );
  }, [data]);

  const revenue = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({ month, revenue }) => {
        return {
          name: month.substring(0, 3),
          revenue: revenue,
        };
      })
    );
  }, [data]);

  const totalSales = useMemo(() => {
    return (
      totalSalesData &&
      totalSalesData.map(({ day, total_amount }) => {
        return {
          day: day.value,
          total_amount: total_amount,
        };
      })
    );
  }, [data]);

  return (
    <>
      <DashboardBox gridArea="a">
        <BoxHeader
          title="Total Sales By Day"
          subtitle="total sales displayed per day "
          sideText="+4%"
        />
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={400}
            data={totalSales}
            margin={{
              top: 15,
              right: 25,
              left: -10,
              bottom: 60,
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
                  stopColor={palette.primary[300]}
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
              tickLine={false}
              axisLine={{ strokeWidth: "0" }}
              style={{ fontSize: "10px" }}
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="total_amount"
              dot={true}
              stroke={palette.primary.main}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </DashboardBox>
      <DashboardBox gridArea="b">
        <BoxHeader
          title="Profit and Revenue"
          subtitle="top line represents revenue, bottom line represents expenses"
          sideText="+4%"
        />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={400}
            data={revenueProfit}
            margin={{
              top: 20,
              right: 0,
              left: -10,
              bottom: 55,
            }}
          >
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis
              dataKey="name"
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "10px" }}
            />
            <Tooltip />
            <Legend height={20} wrapperStyle={{ margin: "0 0 10px 0" }} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="profit"
              stroke={palette.primary[500]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke={palette.primary.main}
            />
          </LineChart>
        </ResponsiveContainer>
      </DashboardBox>

      <DashboardBox gridArea="c">
        <BoxHeader
          title="Most Popular Drinks"
          subtitle="bar graph for Q2"
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

export default Row1;

/*
<DashboardBox gridArea="c">
<BoxHeader
  title="Revenue Month by Month"
  subtitle="graph representing the revenue month by month"
  sideText="+4%"
/>
<ResponsiveContainer width="100%" height="100%">
  <BarChart
    width={500}
    height={300}
    data={revenue}
    margin={{
      top: 17,
      right: 15,
      left: -5,
      bottom: 58,
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
      style={{ fontSize: "10px" }}
    />
    <YAxis
      axisLine={false}
      tickLine={false}
      style={{ fontSize: "10px" }}
    />
    <Tooltip />
    <Bar dataKey="revenue" fill="url(#colorRevenue)" />
  </BarChart>
</ResponsiveContainer>
</DashboardBox>
*/
