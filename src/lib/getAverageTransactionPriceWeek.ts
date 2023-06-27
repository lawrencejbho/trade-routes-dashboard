import { BigQuery } from "@google-cloud/bigquery";

import path from "path";

export default async function averageTransactionPriceWeek(): Promise<any[]> {
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
  - this query takes the average amountMoney.amount for a given period and returns as a single record
  - checks for status = COMPLETED
  */

  const sqlQuery = `SELECT
  FORMAT_TIMESTAMP('%Y-%m-%d', DATE_TRUNC(TIMESTAMP_SUB(createdAt, INTERVAL (CASE WHEN EXTRACT(DAYOFWEEK FROM createdAt) = 1 THEN 6 ELSE EXTRACT(DAYOFWEEK FROM createdAt) - 2 END) DAY), WEEK(MONDAY))) AS week_start_date,
  AVG(amountMoney.amount) AS average_amount_per_transaction
FROM \`square-big-query.my_states_dataset3.payments\`
WHERE
  createdAt BETWEEN TIMESTAMP("2023-04-03T00:00:00Z") AND TIMESTAMP("${formattedDate}")
  AND status = 'COMPLETED'
GROUP BY week_start_date
ORDER BY week_start_date ASC;
  `;

  const options = {
    query: sqlQuery,
    location: "US",
  };

  const [rows] = await bigqueryClient.query(options);

  return rows;
}
