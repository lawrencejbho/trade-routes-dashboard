import { BigQuery } from "@google-cloud/bigquery";

import path from "path";

export default async function salesPerDay(): Promise<any[]> {
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
  - this query grabs all transactions for a specific day from a specific time frame
  - checks for status = COMPLETED
  - changes the time zone to UTC-11 to account for orders from midnight to 2:00am
  - this query will get the total amount without tip
  */

  const sqlQuery4 = `SELECT DISTINCT DATE(DATETIME(TIMESTAMP(p.createdAt), 'Pacific/Pago_Pago')) AS day, t.total_amount
  FROM \`square-big-query.my_states_dataset3.payments\` AS p
  JOIN (
    SELECT DATE(DATETIME(TIMESTAMP(createdAt), 'Pacific/Pago_Pago')) AS day, SUM(amountMoney.amount) AS total_amount
    FROM \`square-big-query.my_states_dataset3.payments\`
    WHERE createdAt BETWEEN TIMESTAMP("2023-04-03T00:00:00Z") AND TIMESTAMP("2023-06-12T07:41:03Z")
      AND status = 'COMPLETED'
    GROUP BY DATE(DATETIME(TIMESTAMP(createdAt), 'Pacific/Pago_Pago'))
  ) AS t ON DATE(DATETIME(TIMESTAMP(p.createdAt), 'Pacific/Pago_Pago')) = t.day
  WHERE EXTRACT(DAYOFWEEK FROM DATE(DATETIME(TIMESTAMP(p.createdAt), 'Pacific/Pago_Pago'))) = 4
  ORDER BY day;
  `;

  const options4 = {
    query: sqlQuery4,
    location: "US",
  };

  const [rows4] = await bigqueryClient.query(options4);

  const sqlQuery5 = `SELECT DISTINCT DATE(DATETIME(TIMESTAMP(p.createdAt), 'Pacific/Pago_Pago')) AS day, t.total_amount
  FROM \`square-big-query.my_states_dataset3.payments\` AS p
  JOIN (
    SELECT DATE(DATETIME(TIMESTAMP(createdAt), 'Pacific/Pago_Pago')) AS day, SUM(amountMoney.amount) AS total_amount
    FROM \`square-big-query.my_states_dataset3.payments\`
    WHERE createdAt BETWEEN TIMESTAMP("2023-04-03T00:00:00Z") AND TIMESTAMP("2023-06-12T07:41:03Z")
      AND status = 'COMPLETED'
    GROUP BY DATE(DATETIME(TIMESTAMP(createdAt), 'Pacific/Pago_Pago'))
  ) AS t ON DATE(DATETIME(TIMESTAMP(p.createdAt), 'Pacific/Pago_Pago')) = t.day
  WHERE EXTRACT(DAYOFWEEK FROM DATE(DATETIME(TIMESTAMP(p.createdAt), 'Pacific/Pago_Pago'))) = 5
  ORDER BY day;
  `;

  const options5 = {
    query: sqlQuery5,
    location: "US",
  };

  const [rows5] = await bigqueryClient.query(options5);

  const sqlQuery6 = `SELECT DISTINCT DATE(DATETIME(TIMESTAMP(p.createdAt), 'Pacific/Pago_Pago')) AS day, t.total_amount
  FROM \`square-big-query.my_states_dataset3.payments\` AS p
  JOIN (
    SELECT DATE(DATETIME(TIMESTAMP(createdAt), 'Pacific/Pago_Pago')) AS day, SUM(amountMoney.amount) AS total_amount
    FROM \`square-big-query.my_states_dataset3.payments\`
    WHERE createdAt BETWEEN TIMESTAMP("2023-04-03T00:00:00Z") AND TIMESTAMP("2023-06-12T07:41:03Z")
      AND status = 'COMPLETED'
    GROUP BY DATE(DATETIME(TIMESTAMP(createdAt), 'Pacific/Pago_Pago'))
  ) AS t ON DATE(DATETIME(TIMESTAMP(p.createdAt), 'Pacific/Pago_Pago')) = t.day
  WHERE EXTRACT(DAYOFWEEK FROM DATE(DATETIME(TIMESTAMP(p.createdAt), 'Pacific/Pago_Pago'))) = 6
  ORDER BY day;
  `;

  const options6 = {
    query: sqlQuery6,
    location: "US",
  };

  const [rows6] = await bigqueryClient.query(options6);

  const sqlQuery7 = `SELECT DISTINCT DATE(DATETIME(TIMESTAMP(p.createdAt), 'Pacific/Pago_Pago')) AS day, t.total_amount
  FROM \`square-big-query.my_states_dataset3.payments\` AS p
  JOIN (
    SELECT DATE(DATETIME(TIMESTAMP(createdAt), 'Pacific/Pago_Pago')) AS day, SUM(amountMoney.amount) AS total_amount
    FROM \`square-big-query.my_states_dataset3.payments\`
    WHERE createdAt BETWEEN TIMESTAMP("2023-04-03T00:00:00Z") AND TIMESTAMP("2023-06-12T07:41:03Z")
      AND status = 'COMPLETED'
    GROUP BY DATE(DATETIME(TIMESTAMP(createdAt), 'Pacific/Pago_Pago'))
  ) AS t ON DATE(DATETIME(TIMESTAMP(p.createdAt), 'Pacific/Pago_Pago')) = t.day
  WHERE EXTRACT(DAYOFWEEK FROM DATE(DATETIME(TIMESTAMP(p.createdAt), 'Pacific/Pago_Pago'))) = 7
  ORDER BY day;
  `;

  const options7 = {
    query: sqlQuery7,
    location: "US",
  };

  const [rows7] = await bigqueryClient.query(options7);

  const sqlQuery1 = `SELECT DISTINCT DATE(DATETIME(TIMESTAMP(p.createdAt), 'Pacific/Pago_Pago')) AS day, t.total_amount
  FROM \`square-big-query.my_states_dataset3.payments\` AS p
  JOIN (
    SELECT DATE(DATETIME(TIMESTAMP(createdAt), 'Pacific/Pago_Pago')) AS day, SUM(amountMoney.amount) AS total_amount
    FROM \`square-big-query.my_states_dataset3.payments\`
    WHERE createdAt BETWEEN TIMESTAMP("2023-04-03T00:00:00Z") AND TIMESTAMP("2023-06-12T07:41:03Z")
      AND status = 'COMPLETED'
    GROUP BY DATE(DATETIME(TIMESTAMP(createdAt), 'Pacific/Pago_Pago'))
  ) AS t ON DATE(DATETIME(TIMESTAMP(p.createdAt), 'Pacific/Pago_Pago')) = t.day
  WHERE EXTRACT(DAYOFWEEK FROM DATE(DATETIME(TIMESTAMP(p.createdAt), 'Pacific/Pago_Pago'))) = 1
  ORDER BY day;
  `;

  const options1 = {
    query: sqlQuery1,
    location: "US",
  };

  const [rows1] = await bigqueryClient.query(options1);

  return [
    { weekday: "wednesday", data: rows4 },
    { weekday: "thursday", data: rows5 },
    { weekday: "friday", data: rows6 },
    { weekday: "saturday", data: rows7 },
    { weekday: "sunday", data: rows1 },
  ];
}
