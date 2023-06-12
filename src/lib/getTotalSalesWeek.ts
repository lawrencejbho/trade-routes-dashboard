import { BigQuery } from "@google-cloud/bigquery";

import path from "path";

export default async function totalSalesWeek(): Promise<any[]> {
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
  - it aggregates the days together in a week
  - makes it so the week starts on Monday versus Sunday
  */

  const sqlQuery = `SELECT DISTINCT DATE(DATE_TRUNC(DATETIME(TIMESTAMP(p.createdAt), 'Pacific/Pago_Pago'), WEEK(Monday))) AS week_start, t.total_amount
  FROM \`square-big-query.my_states_dataset3.payments\` AS p
  JOIN (
    SELECT DATE(DATE_TRUNC(DATETIME(TIMESTAMP(createdAt), 'Pacific/Pago_Pago'), WEEK(Monday))) AS week_start, SUM(amountMoney.amount) AS total_amount
    FROM \`square-big-query.my_states_dataset3.payments\`
    WHERE createdAt BETWEEN TIMESTAMP("2023-01-03T00:00:00Z") AND TIMESTAMP("2023-06-12T07:41:03Z")
      AND status = 'COMPLETED'
    GROUP BY DATE(DATE_TRUNC(DATETIME(TIMESTAMP(createdAt), 'Pacific/Pago_Pago'), WEEK(Monday)))
  ) AS t ON DATE(DATE_TRUNC(DATETIME(TIMESTAMP(p.createdAt), 'Pacific/Pago_Pago'), WEEK(Monday))) = t.week_start
  ORDER BY week_start;
  `;

  //amountMoney.amount

  const options = {
    query: sqlQuery,
    location: "US",
  };

  const [rows] = await bigqueryClient.query(options);

  return rows;
}
