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
  TooltipProps,
  Area,
  Line,
  CartesianGrid,
  LineChart,
} from "recharts";
import { useTheme } from "@mui/material/styles";

import {
  GetKpisResponse,
  GetTotalSalesDayResponse,
  GetTotalSalesWeekResponse,
  GetTotalSalesMonthResponse,
  CustomTooltipProps,
} from "@/types";

import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

type Props = {
  data: GetKpisResponse[];
  totalSalesDayData: GetTotalSalesDayResponse[];
  totalSalesWeekData: GetTotalSalesWeekResponse[];
  totalSalesMonthData: GetTotalSalesMonthResponse[];
};

function Row1({
  data,
  totalSalesDayData,
  totalSalesWeekData,
  totalSalesMonthData,
}: Props) {
  const { palette } = useTheme();

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

  const totalSalesDay = useMemo(() => {
    return (
      totalSalesDayData &&
      totalSalesDayData.map(({ day, total_amount }) => {
        return {
          day: day.value,
          total_amount: total_amount / 100,
        };
      })
    );
  }, [totalSalesDayData]);

  const totalSalesWeek = useMemo(() => {
    return (
      totalSalesWeekData &&
      totalSalesWeekData.map(({ week_start, total_amount }) => {
        return {
          week: week_start.value,
          total_amount: total_amount / 100,
        };
      })
    );
  }, [totalSalesWeekData]);

  const totalSalesMonth = useMemo(() => {
    return (
      totalSalesMonthData &&
      totalSalesMonthData.map(({ month_start, total_amount }) => {
        return {
          month: month_start.value,
          total_amount: total_amount / 100,
        };
      })
    );
  }, [totalSalesMonthData]);

  /*
  - Custom Tooltip makes it easy to add a $ sign to the total in the tooltip
  - toLocaleString adds a comma in the number automatically
  */
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label}`}</p>
          <p className="tooltip-value">{`Total: $${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <DashboardBox gridArea="a">
        <BoxHeader
          title="Total Sales By Day"
          subtitle="total sales without tip per day adjusted for operating hours"
          sideText="+4%"
        />
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={400}
            data={totalSalesDay}
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
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
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
          title="Total Sales by Week"
          subtitle="total sales without tip per week adjusted for operating hours"
          sideText="+4%"
        />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={400}
            data={totalSalesWeek}
            margin={{
              top: 20,
              right: 10,
              left: -10,
              bottom: 55,
            }}
          >
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis
              dataKey="week"
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "10px" }}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* <Legend height={20} wrapperStyle={{ margin: "0 0 10px 0" }} /> */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="total_amount"
              stroke={palette.primary[500]}
            />
          </LineChart>
        </ResponsiveContainer>
      </DashboardBox>
      <DashboardBox gridArea="c">
        <BoxHeader
          title="Total Sales by Month"
          subtitle="total sales without tip per month adjusted for operating hours"
          sideText="+4%"
        />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={400}
            data={totalSalesMonth}
            margin={{
              top: 20,
              right: 10,
              left: -10,
              bottom: 55,
            }}
          >
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis
              dataKey="month"
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "10px" }}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* <Legend height={20} wrapperStyle={{ margin: "0 0 10px 0" }} /> */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="total_amount"
              stroke={palette.primary[500]}
            />
          </LineChart>
        </ResponsiveContainer>
      </DashboardBox>
    </>
  );
}

export default Row1;
