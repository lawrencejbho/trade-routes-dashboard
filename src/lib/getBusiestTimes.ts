import { BigQuery } from "@google-cloud/bigquery";

import path from "path";

export default async function busiestTimes(): Promise<any[]> {
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
  - this query will provide the busiest times of day based on createdAt and checking the transaction count
  */

  const sqlQuery = `SELECT 
  EXTRACT(DAYOFWEEK FROM DATETIME(TIMESTAMP(p.createdAt), 'America/Los_Angeles')) AS day_of_week,
  EXTRACT(HOUR FROM DATETIME(TIMESTAMP(p.createdAt), 'America/Los_Angeles')) AS hour_of_day,
  COUNT(*) AS transaction_count
FROM \`square-big-query.my_states_dataset3.payments\` AS p
WHERE
  createdAt BETWEEN TIMESTAMP("2023-01-01T00:00:00Z") AND TIMESTAMP("2023-06-13T07:41:03Z")
  AND status = 'COMPLETED'
GROUP BY day_of_week, hour_of_day
ORDER BY transaction_count DESC
LIMIT 10;
  `;

  const options = {
    query: sqlQuery,
    location: "US",
  };

  const [rows] = await bigqueryClient.query(options);

  return rows;
}
