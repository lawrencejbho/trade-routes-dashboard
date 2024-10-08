import type { NextApiRequest, NextApiResponse } from "next";
import { BigQuery } from "@google-cloud/bigquery";
import path from "path";

type Data = {
  response: any[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  async function popularDrinks(): Promise<any[]> {
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

    const sqlQuery = `SELECT lineItems.name, count(*) AS count
    FROM \`square-big-query.my_states_dataset3.orders\` CROSS JOIN UNNEST(lineItems) AS lineItems
    where createdAt BETWEEN "2023-04-01T00:00:00Z" AND "2023-06-10T07:41:03Z"
    GROUP by lineItems.name
    ORDER by count DESC
    LIMIT 10`;

    const options = {
      query: sqlQuery,
      location: "US",
    };

    const [rows] = await bigqueryClient.query(options);

    // console.log("Rows:");
    // rows.forEach((row) => console.log(row));

    return rows;
  }
  try {
    const data = await popularDrinks();
    res.status(200).json({ response: data });
  } catch (error) {
    res.status(404);
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
