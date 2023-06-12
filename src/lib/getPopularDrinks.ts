import { BigQuery } from "@google-cloud/bigquery";
import { readFileSync } from "fs";

import path from "path";

export default async function popularDrinks(): Promise<any[]> {
  // helps you get the absolute path within your file system and grabs the json directory
  const jsonDirectory = path.join(
    process.cwd(),
    "files",
    "/square-big-query-3917c272476a.json"
  );
  const test = readFileSync(jsonDirectory, "utf8");

  const bigqueryClient = new BigQuery({
    keyFilename: jsonDirectory,
    projectId: "square-big-query",
  });

  /*
- this checks each orders for a given time frame for each drink that was ordered
- it does not account for quantity yet
- It will sum the total per drink and then return the top 10 drinks and their quantity
*/

  const sqlQuery = `SELECT lineItems.name, count(*) AS count
    FROM square-big-query.my_states_dataset3.orders CROSS JOIN UNNEST(lineItems) AS lineItems
    where createdAt BETWEEN "2023-04-01T00:00:00Z" AND "2023-06-13T00:00:00Z" AND state="COMPLETED"
    GROUP by lineItems.name
    ORDER by count DESC
    LIMIT 10`;

  const options = {
    query: sqlQuery,
    location: "US",
  };

  const [rows] = await bigqueryClient.query(options);

  return rows;
}
