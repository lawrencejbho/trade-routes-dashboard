import { BigQuery } from "@google-cloud/bigquery";
import path from "path";
import { readFileSync } from "fs";

export default async function recentTransactions(): Promise<any[]> {
  // helps you get the absolute path within your file system and grabs the json directory
  const jsonDirectory = path.join(
    process.cwd(),
    "files",
    "/square-big-query-5f548a097a57.json"
  );
  const test = readFileSync(jsonDirectory, "utf8");

  const bigqueryClient = new BigQuery({
    keyFilename: jsonDirectory,
    projectId: "square-big-query",
  });

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString();

  /*
  - this query grabs all transactions for a given time frame and changes it to the PST timezone
  - also checks that the status is completed 
  */
  const sqlQuery = `SELECT totalMoney.amount, tipMoney.amount, DATETIME(createdAt, 'America/Los_Angeles') AS createdAt, cardDetails.card.cardholderName
  FROM \`square-big-query.my_states_dataset3.payments\`
  WHERE createdAt BETWEEN TIMESTAMP("2023-06-01T00:00:00Z") AND TIMESTAMP("${formattedDate}")
    AND status = 'COMPLETED'
  ORDER BY createdAt DESC
  LIMIT 50;
  `;

  const options = {
    query: sqlQuery,
    location: "US",
  };

  const [rows] = await bigqueryClient.query(options);

  return rows;
}
