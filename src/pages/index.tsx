// pages/index.tsx
import type { GetServerSideProps, NextPage } from "next";
import Navbar from "@/scenes/navbar";
import Dashboard from "@/scenes/dashboard";

import { Box } from "@mui/material";

import {
  GetKpisResponse,
  GetProductsResponse,
  GetTransactionsResponse,
} from "@/types";

export const getServerSideProps: GetServerSideProps = async () => {
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
  console.log(data);

  return { props: { data, data2, data3 } };
};

// interface KpiProps {
//   data: GetKpisResponse[];
// }

// interface ProductProps {
//   data2: GetProductsResponse[];
// }

// interface TransactionProps {
//   data3: GetTransactionsResponse[];
// }

interface KpiProps {
  data: GetKpisResponse[];
  data2: GetProductsResponse[];
  data3: GetTransactionsResponse[];
}

export default function Home({ data, data2, data3 }: KpiProps) {
  return (
    <>
      <Box width="100%" height="100vh" padding="1rem 2rem 4rem 2rem">
        <Navbar />
        <Dashboard data={data} data2={data2} data3={data3} />
      </Box>
    </>
  );
}
