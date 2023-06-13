// pages/index.tsx
import type { GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Router from "next/router";

import Navbar from "@/scenes/navbar";
import Dashboard from "@/scenes/dashboard";

import { Box } from "@mui/material";

import getPopularDrinks from "@/lib/getPopularDrinks";
import getRecentTransactions from "@/lib/getRecentTransactions";
import getTotalSalesDay from "@/lib/getTotalSalesDay";
import getTotalSalesWeek from "@/lib/getTotalSalesWeek";
import getTotalSalesMonth from "@/lib/getTotalSalesMonth";

import {
  GetKpisResponse,
  GetProductsResponse,
  GetTransactionsResponse,
  GetPopularDrinksResponse,
  GetRecentTransactionsResponse,
  GetTotalSalesDayResponse,
  GetTotalSalesWeekResponse,
  GetTotalSalesMonthResponse,
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
    },
    revalidate: 60,
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
}: KpiProps) {
  const { status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") Router.replace("/auth/login");
  }, [status]);

  if (status === "authenticated") {
    return (
      <div>
        <Box width="100%" height="100vh" padding="1rem 2rem 4rem 2rem">
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
          />
        </Box>
      </div>
    );
  }
}
