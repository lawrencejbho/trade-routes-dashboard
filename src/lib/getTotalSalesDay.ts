import { BigQuery } from "@google-cloud/bigquery";

import path from "path";

export default async function totalSalesDay(): Promise<any[]> {
  // helps you get the absolute path within your file system and grabs the json directory
  const jsonDirectory = path.join(
    process.cwd(),
    "files",
    "/square-big-query-5f548a097a57.json"
  );

  const bigqueryClient = new BigQuery({
    keyFilename: jsonDirectory,
    projectId: "square-big-query",
  });

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString();

  /*
  - this query grabs all transactions from a specific time frame
  - checks for status = COMPLETED
  - changes the time zone to UTC-11 to account for orders from midnight to 2:00am
  - sums the transactions per day and joins them to a day timestamp 
  - this query will get the total amount without tip
  */

  const sqlQuery = `SELECT DISTINCT DATE(DATETIME(TIMESTAMP(p.createdAt), 'Pacific/Pago_Pago')) AS day, t.total_amount
  FROM \`square-big-query.my_states_dataset3.payments\` AS p
  JOIN (
    SELECT DATE(DATETIME(TIMESTAMP(createdAt), 'Pacific/Pago_Pago')) AS day, SUM(amountMoney.amount) AS total_amount
    FROM \`square-big-query.my_states_dataset3.payments\`
    WHERE createdAt BETWEEN TIMESTAMP("2023-05-01T00:00:00Z") AND TIMESTAMP("${formattedDate}")
      AND status = 'COMPLETED'
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
