import { BigQuery } from "@google-cloud/bigquery";

import path from "path";

export default async function averageTransactionPrice(): Promise<any[]> {
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

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString();

  /*
  - this query takes the average amountMoney.amount for a given period and returns as a single record
  - checks for status = COMPLETED
  */

  const sqlQuery = `SELECT AVG(amountMoney.amount) AS average_amount_per_transaction
  FROM \`square-big-query.my_states_dataset3.payments\`
  WHERE createdAt BETWEEN TIMESTAMP("2023-04-03T00:00:00Z") AND TIMESTAMP("${formattedDate}")
    AND status = 'COMPLETED';
  `;

  const options = {
    query: sqlQuery,
    location: "US",
  };

  const [rows] = await bigqueryClient.query(options);

  return rows;
}
