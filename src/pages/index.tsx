// pages/index.tsx
import type { GetStaticProps, GetServerSideProps, NextPage } from "next";
import Router from "next/router";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

import Navbar from "@/scenes/navbar";
import Dashboard from "@/scenes/dashboard";
import { Box } from "@mui/material";

import getPopularDrinks from "@/lib/getPopularDrinks";
import getRecentTransactions from "@/lib/getRecentTransactions";
import getTotalSalesDay from "@/lib/getTotalSalesDay";
import getTotalSalesWeek from "@/lib/getTotalSalesWeek";
import getTotalSalesMonth from "@/lib/getTotalSalesMonth";
import getSalesPerDay from "@/lib/getSalesPerDay";
import getAverageTransactions from "@/lib/getAverageTransactions";
import getAverageTransactionPrice from "@/lib/getAverageTransactionPrice";
import getAverageTransactionPriceWeek from "@/lib/getAverageTransactionPriceWeek";
import getBusiestTimes from "@/lib/getBusiestTimes";
import getRetentionRate from "@/lib/getRetentionRate";

import {
  GetKpisResponse,
  GetProductsResponse,
  GetTransactionsResponse,
  GetPopularDrinksResponse,
  GetRecentTransactionsResponse,
  GetTotalSalesDayResponse,
  GetTotalSalesWeekResponse,
  GetTotalSalesMonthResponse,
  GetSalesPerDayResponse,
  GetAverageTransactionPriceResponse,
  GetAverageTransactionsResponse,
  GetAverageTransactionPriceWeekResponse,
  GetBusiestTimesResponse,
  GetRetentionRateResponse,
} from "@/types";

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(
    "https://mern-finance-dashboard-backend.herokuapp.com/kpi/kpis"
  );
  const data = await res.json();

  const res2 = await fetch(
    "https://mern-finance-dashboard-backend.herokuapp.com/product/products"
  );
  const data2 = await res2.json();

  const res3 = await fetch(
    "https://mern-finance-dashboard-backend.herokuapp.com/transaction/transactions"
  );
  const data3 = await res3.json();

  // have to use json parse and json stringify to serialize. Could not find a proper solution for this
  const popularDrinksResponse = await getPopularDrinks();
  const popularDrinksData = JSON.parse(JSON.stringify(popularDrinksResponse));

  const recentTransactionsResponse = await getRecentTransactions();
  const recentTransactionsData = JSON.parse(
    JSON.stringify(recentTransactionsResponse)
  );

  const totalSalesDayResponse = await getTotalSalesDay();
  const totalSalesDayData = JSON.parse(JSON.stringify(totalSalesDayResponse));

  const totalSalesWeekResponse = await getTotalSalesWeek();
  const totalSalesWeekData = JSON.parse(JSON.stringify(totalSalesWeekResponse));

  const totalSalesMonthResponse = await getTotalSalesMonth();
  const totalSalesMonthData = JSON.parse(
    JSON.stringify(totalSalesMonthResponse)
  );

  const salesPerDayResponse = await getSalesPerDay();
  const salesPerDayData = JSON.parse(JSON.stringify(salesPerDayResponse));

  const GetAverageTransactionsResponse = await getAverageTransactions();
  const averageTransactionsData = JSON.parse(
    JSON.stringify(GetAverageTransactionsResponse)
  );

  const GetAverageTransactionPriceResponse = await getAverageTransactionPrice();
  const averageTransactionPriceData = JSON.parse(
    JSON.stringify(GetAverageTransactionPriceResponse)
  );

  const GetAverageTransactionPriceWeekResponse =
    await getAverageTransactionPriceWeek();
  const averageTransactionPriceWeekData = JSON.parse(
    JSON.stringify(GetAverageTransactionPriceWeekResponse)
  );

  const GetBusiestTimesResponse = await getBusiestTimes();
  const GetBusiestTimesData = JSON.parse(
    JSON.stringify(GetBusiestTimesResponse)
  );

  const GetRetentionRateResponse = await getRetentionRate();
  const retentionRateData = JSON.parse(
    JSON.stringify(GetRetentionRateResponse)
  );

  return {
    props: {
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
      retentionRateData,
    },
    revalidate: 300,
  };
};

interface KpiProps {
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
  retentionRateData: GetRetentionRateResponse[];
}

export default function Home({
  data,
  data2,
  data3,
  popularDrinksData,
  recentTransactionsData,
  totalSalesDayData,
  totalSalesWeekData,
  totalSalesMonthData,
  salesPerDayData,
  averageTransactionPriceData,
  averageTransactionsData,
  averageTransactionPriceWeekData,
  GetBusiestTimesData,
  retentionRateData,
}: KpiProps) {
  const { status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") Router.replace("/auth/login");
  }, [status]);

  if (status === "authenticated") {
    return (
      <div>
        <Box width="100%" height="100vh" padding="1rem 2rem 5rem 2rem">
          <Navbar />
          <Dashboard
            data={data}
            data2={data2}
            data3={data3}
            popularDrinksData={popularDrinksData}
            recentTransactionsData={recentTransactionsData}
            totalSalesDayData={totalSalesDayData}
            totalSalesWeekData={totalSalesWeekData}
            totalSalesMonthData={totalSalesMonthData}
            salesPerDayData={salesPerDayData}
            averageTransactionsData={averageTransactionsData}
            averageTransactionPriceData={averageTransactionPriceData}
            averageTransactionPriceWeekData={averageTransactionPriceWeekData}
            GetBusiestTimesData={GetBusiestTimesData}
            retentionRateData={retentionRateData}
          />
        </Box>
      </div>
    );
  }
}
