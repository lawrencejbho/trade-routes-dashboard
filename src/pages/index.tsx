// pages/index.tsx
import type { GetStaticProps, NextPage } from "next";
import Navbar from "@/scenes/navbar";
import Dashboard from "@/scenes/dashboard";

import { Box } from "@mui/material";

import {
  GetKpisResponse,
  GetProductsResponse,
  GetTransactionsResponse,
  GetPopularDrinksResponse,
  GetRecentTransactionsResponse,
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

  const res4 = await fetch("http://localhost:3000/api/popularDrinks");
  const data4 = await res4.json();

  const res5 = await fetch("http://localhost:3000/api/recentTransactions");
  const data5 = await res5.json();

  return { props: { data, data2, data3, data4, data5 }, revalidate: 60 };
};

interface ExtendedGetPopularDrinksResponse {
  response: GetPopularDrinksResponse[];
}

interface ExtendedGetRecentTransactionsResponse {
  response: GetRecentTransactionsResponse[];
}

interface KpiProps {
  data: GetKpisResponse[];
  data2: GetProductsResponse[];
  data3: GetTransactionsResponse[];
  data4: ExtendedGetPopularDrinksResponse;
  data5: ExtendedGetRecentTransactionsResponse;
}

export default function Home({ data, data2, data3, data4, data5 }: KpiProps) {
  return (
    <>
      <Box width="100%" height="100vh" padding="1rem 2rem 4rem 2rem">
        <Navbar />
        <Dashboard
          data={data}
          data2={data2}
          data3={data3}
          data4={data4}
          data5={data5}
        />
      </Box>
    </>
  );
}
