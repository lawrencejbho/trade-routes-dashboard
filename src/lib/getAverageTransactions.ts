import { BigQuery } from "@google-cloud/bigquery";

import path from "path";

export default async function averageTransaction(): Promise<any[]> {
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
  - this query gets the average transactions per business day
  */

  const sqlQuery = `SELECT AVG(transaction_count) AS average_transactions_per_day
  FROM (
    SELECT DATE(DATETIME(TIMESTAMP(createdAt), 'UTC-11')) AS day, COUNT(*) AS transaction_count
    FROM \`square-big-query.my_states_dataset3.payments\`
    WHERE createdAt BETWEEN TIMESTAMP("2023-04-03T00:00:00Z") AND TIMESTAMP("2023-06-12T07:41:03Z")
      AND status = 'COMPLETED'
    GROUP BY DATE(DATETIME(TIMESTAMP(createdAt), 'UTC-11'))
  );
  `;

  const options = {
    query: sqlQuery,
    location: "US",
  };

  const [rows] = await bigqueryClient.query(options);

  return rows;
}
