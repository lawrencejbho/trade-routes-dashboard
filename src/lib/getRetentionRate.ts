import { BigQuery } from "@google-cloud/bigquery";
import path from "path";
import { readFileSync } from "fs";

export default async function retentionRate(): Promise<any[]> {
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
  - this query gives retention rate 
  */
  const sqlQuery = `WITH customer_counts AS (
    SELECT tenders.customerId, COUNT(*) AS count
    FROM \`square-big-query.my_states_dataset3.orders\` CROSS JOIN UNNEST(tenders) AS tenders
    WHERE tenders.createdAt >= TIMESTAMP("2022-06-21") AND tenders.createdAt <= TIMESTAMP("${formattedDate}")
    GROUP BY tenders.customerId
  )
  SELECT
    COUNT(*) AS total_customers,
    SUM(CASE WHEN count > 1 THEN 1 ELSE 0 END) AS customers_with_count_1,
    (SUM(CASE WHEN count > 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS percentage
  FROM customer_counts
  `;

  const options = {
    query: sqlQuery,
    location: "US",
  };

  const [rows] = await bigqueryClient.query(options);

  return rows;
}
