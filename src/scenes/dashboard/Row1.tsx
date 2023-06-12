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
  Bar,
  BarChart,
} from "recharts";
import { useTheme } from "@mui/material/styles";

import {
  GetKpisResponse,
  GetTotalSalesDayResponse,
  GetTotalSalesWeekResponse,
  GetTotalSalesMonthResponse,
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
  - need to add some type checking in the case that value is undefined
  */
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
      <DashboardBox gridArea="a">
        <BoxHeader
          title="Total Sales By Day"
          subtitle="total sales without tip per day adjusted for operating hours"
          sideText="+4%"
        />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
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
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />

            <XAxis
              dataKey="day"
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
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="total_amount"
              stroke={palette.tertiary[500]}
            />
          </LineChart>
        </ResponsiveContainer>
      </DashboardBox>
      <DashboardBox gridArea="b">
        <BoxHeader
          title="Total Sales by Week"
          subtitle="total sales without tip per week adjusted for operating hours"
          sideText="+4%"
        />
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
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
              dataKey="week"
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
      <DashboardBox gridArea="c">
        <BoxHeader
          title="Total Sales by Month"
          subtitle="total sales without tip per month adjusted for operating hours"
          sideText="+4%"
        />
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={400}
            data={totalSalesMonth}
            margin={{
              top: 20,
              right: 10,
              left: -5,
              bottom: 55,
            }}
          >
            <defs>
              <linearGradient id="colorRevenue2" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={palette.tertiary[500]}
                  stopOpacity={0.7}
                />
                <stop
                  offset="95%"
                  stopColor={palette.tertiary[500]}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              dataKey="total_amount"
              axisLine={false}
              tickLine={false}
              style={{ fontSize: "10px" }}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total_amount" fill="url(#colorRevenue2)" />
          </BarChart>
        </ResponsiveContainer>
      </DashboardBox>
    </>
  );
}

export default Row1;
