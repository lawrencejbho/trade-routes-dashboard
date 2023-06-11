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
  async function recentTransactions(): Promise<any[]> {
    // helps you get the absolute path within your file system and grabs the json directory
    const jsonDirectory = path.join(process.cwd(), "json");

    const bigqueryClient = new BigQuery({
      keyFilename: jsonDirectory + "/square-big-query-3917c272476a.json",
      projectId: "square-big-query",
    });

    const sqlQuery = `SELECT totalMoney.amount, tipMoney.amount, createdAt, cardDetails.card.cardholderName
    FROM \`square-big-query.my_states_dataset3.payments\` 
    where createdAt BETWEEN "2023-06-01T00:00:00Z" AND "2023-06-10T07:41:03Z"
    ORDER by createdAT DESC
    LIMIT 50`;

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
    const data = await recentTransactions();
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
