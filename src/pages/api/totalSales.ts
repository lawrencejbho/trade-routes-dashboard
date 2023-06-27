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
  async function totalSales(): Promise<any[]> {
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

    const sqlQuery = `SELECT DISTINCT DATE(p.createdAt) AS day, t.total_amount
    FROM \`square-big-query.my_states_dataset3.payments\` AS p
    JOIN (
      SELECT DATE(createdAt) AS day, SUM(totalMoney.amount) AS total_amount
      FROM \`square-big-query.my_states_dataset3.payments\`
      WHERE createdAt BETWEEN "2023-06-01T00:00:00Z" AND "2023-06-10T07:41:03Z"
      GROUP BY DATE(createdAt)
    ) AS t ON DATE(p.createdAt) = t.day
    ORDER BY day;
    `;

    const options = {
      query: sqlQuery,
      location: "US",
    };

    const [rows] = await bigqueryClient.query(options);

    return rows;
  }
  try {
    const data = await totalSales();
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
