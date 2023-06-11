// pages/index.tsx
import type { GetStaticProps, NextPage } from "next";
import Navbar from "@/scenes/navbar";
import Dashboard from "@/scenes/dashboard";

import { Box } from "@mui/material";

import getPopularDrinks from "@/lib/getPopularDrinks";
import getRecentTransactions from "@/lib/getRecentTransactions";
import getTotalSales from "@/lib/getTotalSales";

import {
  GetKpisResponse,
  GetProductsResponse,
  GetTransactionsResponse,
  GetPopularDrinksResponse,
  GetRecentTransactionsResponse,
  GetTotalSalesResponse,
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

  const totalSalesResponse = await getTotalSales();
  const totalSalesData = JSON.parse(JSON.stringify(totalSalesResponse));

  return {
    props: {
      data,
      data2,
      data3,
      popularDrinksData,
      recentTransactionsData,
      totalSalesData,
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
  totalSalesData: GetTotalSalesResponse[];
}

export default function Home({
  data,
  data2,
  data3,
  popularDrinksData,
  recentTransactionsData,
  totalSalesData,
}: KpiProps) {
  return (
    <>
      <Box width="100%" height="100vh" padding="1rem 2rem 4rem 2rem">
        <Navbar />
        <Dashboard
          data={data}
          data2={data2}
          data3={data3}
          popularDrinksData={popularDrinksData}
          recentTransactionsData={recentTransactionsData}
          totalSalesData={totalSalesData}
        />
      </Box>
    </>
  );
}
