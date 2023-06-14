import React, { useMemo, useState } from "react";
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
  Legend,
} from "recharts";
import { useTheme } from "@mui/material/styles";

import {
  GetKpisResponse,
  GetTotalSalesDayResponse,
  GetTotalSalesWeekResponse,
  GetTotalSalesMonthResponse,
  GetSalesPerDayResponse,
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
  salesPerDayData: GetSalesPerDayResponse[];
};

interface Visibility {
  [key: string]: boolean;
}

function Row1({
  // totalSalesDayData,
  totalSalesWeekData,
  totalSalesMonthData,
  salesPerDayData,
}: Props) {
  const { palette } = useTheme();

  const [visible, setVisible] = useState<Visibility>({
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  // console.log(visible);

  const [hoverDay, setHoverDay] = useState("");

  // run this funciton only when data changes

  // const totalSalesDay = useMemo(() => {
  //   return (
  //     totalSalesDayData &&
  //     totalSalesDayData.map(({ day, total_amount }) => {
  //       return {
  //         day: day.value,
  //         total_amount: total_amount / 100,
  //       };
  //     })
  //   );
  // }, [totalSalesDayData]);

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

  const salesPerDayWednesday = useMemo(() => {
    return (
      salesPerDayData &&
      salesPerDayData.map(({ weekday, data }) => {
        if (weekday == "wednesday") {
          return data.map((entry, index) => {
            return {
              day: index + 1,
              wednesday: entry.total_amount / 100,
            };
          });
        }
      })
    );
  }, [salesPerDayData]);

  const salesPerDayThursday = useMemo(() => {
    return (
      salesPerDayData &&
      salesPerDayData.map(({ weekday, data }) => {
        if (weekday == "thursday") {
          return data.map((entry, index) => {
            return {
              day: index + 1,
              thursday: entry.total_amount / 100,
            };
          });
        }
      })
    );
  }, [salesPerDayData]);

  const salesPerDayFriday = useMemo(() => {
    return (
      salesPerDayData &&
      salesPerDayData.map(({ weekday, data }) => {
        if (weekday == "friday") {
          return data.map((entry, index) => {
            return {
              day: index + 1,
              friday: entry.total_amount / 100,
            };
          });
        }
      })
    );
  }, [salesPerDayData]);

  const salesPerDaySaturday = useMemo(() => {
    return (
      salesPerDayData &&
      salesPerDayData.map(({ weekday, data }) => {
        if (weekday == "saturday") {
          return data.map((entry, index) => {
            return {
              day: index + 1,
              saturday: entry.total_amount / 100,
            };
          });
        }
      })
    );
  }, [salesPerDayData]);

  const salesPerDaySunday = useMemo(() => {
    return (
      salesPerDayData &&
      salesPerDayData.map(({ weekday, data }) => {
        if (weekday == "sunday") {
          return data.map((entry, index) => {
            return {
              day: index + 1,
              sunday: entry.total_amount / 100,
            };
          });
        }
      })
    );
  }, [salesPerDayData]);

  const handleMouseOver = (e: any) => {
    setHoverDay(e.dataKey);
  };

  const handleMouseOut = () => {
    setHoverDay("");
  };

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
          title="Total Sales Per Day in Q2"
          subtitle="total sales per day with each line representing a single day"
          sideText="+4%"
        />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={400}
            margin={{
              top: 15,
              right: 25,
              left: -10,
              bottom: 60,
            }}
            // data={salesPerDaySunday[4]}
          >
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />

            <XAxis
              type="number"
              dataKey="day"
              tickLine={false}
              style={{ fontSize: "10px" }}
              domain={[1, 11]}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "10px" }}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              height={20}
              wrapperStyle={{ margin: "0 0 10px 0" }}
              onClick={() =>
                setVisible((prevValue) => {
                  return { ...prevValue, [hoverDay]: !visible[hoverDay] };
                })
              }
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            />

            <Line
              yAxisId="left"
              type="monotone"
              data={salesPerDayWednesday[0]}
              dataKey="wednesday"
              stroke={palette.primary[500]}
              hide={visible.wednesday}
            />
            <Line
              yAxisId="left"
              type="monotone"
              data={salesPerDayThursday[1]}
              dataKey="thursday"
              stroke={palette.secondary[500]}
              hide={visible.thursday}
            />
            <Line
              yAxisId="left"
              type="monotone"
              data={salesPerDayFriday[2]}
              dataKey="friday"
              stroke={palette.tertiary[500]}
              hide={visible.friday}
            />
            <Line
              yAxisId="left"
              type="monotone"
              data={salesPerDaySaturday[3]}
              dataKey="saturday"
              stroke="#2583ba"
              hide={visible.saturday}
            />
            <Line
              yAxisId="left"
              type="monotone"
              data={salesPerDaySunday[4]}
              dataKey="sunday"
              stroke="#ae2932"
              hide={visible.sunday}
            />
          </LineChart>
        </ResponsiveContainer>
      </DashboardBox>
      <DashboardBox gridArea="b">
        <BoxHeader
          title="Total Sales by Week in 2023"
          subtitle="total sales without tip per week adjusted for operating hours"
          sideText={`+${Math.round(
            ((totalSalesWeek[totalSalesWeek.length - 1].total_amount -
              totalSalesWeek[totalSalesWeek.length - 2].total_amount) /
              totalSalesWeek[totalSalesWeek.length - 1].total_amount) *
              100
          )}%`}
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
          subtitle="total sales over the last 12 months"
          sideText={`${Math.round(
            ((totalSalesMonth[totalSalesMonth.length - 2].total_amount -
              totalSalesMonth[totalSalesMonth.length - 3].total_amount) /
              totalSalesMonth[totalSalesMonth.length - 2].total_amount) *
              100
          )}%`}
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
