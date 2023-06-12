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

  const sqlQuery = `SELECT DISTINCT DATE(DATETIME(TIMESTAMP(p.createdAt), 'Pacific/Pago_Pago')) AS day, t.total_amount
  FROM \`square-big-query.my_states_dataset3.payments\` AS p
  JOIN (
    SELECT DATE(DATETIME(TIMESTAMP(createdAt), 'Pacific/Pago_Pago')) AS day, SUM(totalMoney.amount) AS total_amount
    FROM \`square-big-query.my_states_dataset3.payments\`
    WHERE createdAt BETWEEN TIMESTAMP("2023-05-01T00:00:00Z") AND TIMESTAMP("2023-06-12T07:41:03Z")
    GROUP BY DATE(DATETIME(TIMESTAMP(createdAt), 'Pacific/Pago_Pago'))
  ) AS t ON DATE(DATETIME(TIMESTAMP(p.createdAt), 'Pacific/Pago_Pago')) = t.day
  ORDER BY day;
  `;

  const options = {
    query: sqlQuery,
    location: "US",
  };

  const [rows] = await bigqueryClient.query(options);

  return rows;
}
