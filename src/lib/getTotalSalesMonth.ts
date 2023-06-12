import { BigQuery } from "@google-cloud/bigquery";

import path from "path";

export default async function totalSalesMonth(): Promise<any[]> {
  // helps you get the absolute path within your file system and grabs the json directory
  const jsonDirectory = path.join(
    process.cwd(),
    "files",
    "/square-big-query-3917c272476a.json"
  );

  const bigqueryClient = new BigQuery({
    keyFilename: jsonDirectory,
    projectId: "square-big-query",
  });

  /* 
  This query is similar to getTotalSalesDay
  - it aggregates the days together by month
  */

  const sqlQuery = `SELECT DISTINCT DATE(DATE_TRUNC(DATETIME(TIMESTAMP(p.createdAt), 'Pacific/Pago_Pago'), MONTH)) AS month_start, t.total_amount
  FROM \`square-big-query.my_states_dataset3.payments\` AS p
  JOIN (
    SELECT DATE(DATE_TRUNC(DATETIME(TIMESTAMP(createdAt), 'Pacific/Pago_Pago'), MONTH)) AS month_start, SUM(amountMoney.amount) AS total_amount
    FROM \`square-big-query.my_states_dataset3.payments\`
    WHERE createdAt BETWEEN TIMESTAMP("2022-06-01T00:00:00Z") AND TIMESTAMP("2023-06-12T07:41:03Z")
      AND status = 'COMPLETED'
    GROUP BY DATE(DATE_TRUNC(DATETIME(TIMESTAMP(createdAt), 'Pacific/Pago_Pago'), MONTH))
  ) AS t ON DATE(DATE_TRUNC(DATETIME(TIMESTAMP(p.createdAt), 'Pacific/Pago_Pago'), MONTH)) = t.month_start
  ORDER BY month_start;
  `;

  const options = {
    query: sqlQuery,
    location: "US",
  };

  const [rows] = await bigqueryClient.query(options);

  return rows;
}
