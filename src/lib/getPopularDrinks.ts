import { BigQuery } from "@google-cloud/bigquery";
import { readFileSync } from "fs";

import path from "path";

export default async function popularDrinks(): Promise<any[]> {
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
- this checks each orders for a given time frame for each drink that was ordered
- checks that the order was completed 
- It will sum the total per drink and then return the top 10 drinks and their quantity
- it does not account for quantity yet, some drinks are ordered with quantity instead of explicity displayed
*/

  const sqlQuery = `SELECT lineItems.name, SUM(lineItems.quantity) AS count
  FROM square-big-query.my_states_dataset3.orders CROSS JOIN UNNEST(lineItems) AS lineItems
  WHERE createdAt BETWEEN "2023-04-01T00:00:00Z" AND "${formattedDate}" AND state="COMPLETED"
  GROUP BY lineItems.name
  ORDER BY count DESC
  LIMIT 100
  `;

  const options = {
    query: sqlQuery,
    location: "US",
  };

  const [rows] = await bigqueryClient.query(options);

  return rows;
}
