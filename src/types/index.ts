export interface ExpensesByCategory {
  salaries: number;
  supplies: number;
  services: number;
}

export interface Month {
  id: string;
  month: string;
  revenue: number;
  expenses: number;
  nonOperationalExpenses: number;
  operationalExpenses: number;
}

export interface Day {
  id: string;
  date: string;
  revenue: number;
  expenses: number;
}

export interface GetKpisResponse {
  id: string;
  _id: string;
  __v: number;
  totalProfit: number;
  totalRevenue: number;
  totalExpenses: number;
  expensesByCategory: ExpensesByCategory;
  monthlyData: Array<Month>;
  dailyData: Array<Day>;
  createdAt: string;
  updatedAt: string;
}

export interface GetProductsResponse {
  id: string;
  _id: string;
  __v: number;
  price: number;
  expense: number;
  transactions: Array<string>;
  createdAt: string;
  updatedAt: string;
}

export interface GetTransactionsResponse {
  id: string;
  _id: string;
  __v: number;
  buyer: string;
  amount: number;
  productIds: Array<string>;
  createdAt: string;
  updatedAt: string;
}

export interface GetPopularDrinksResponse {
  name: string;
  count: number;
}

export interface GetRecentTransactionsResponse {
  amount: number;
  amount_1: number;
  createdAt: {
    value: string;
  };
  cardholderName: string;
}

export interface GetTotalSalesDayResponse {
  day: {
    value: string;
  };
  total_amount: number;
}

export interface GetTotalSalesWeekResponse {
  week_start: {
    value: string;
  };
  total_amount: number;
}

export interface GetTotalSalesMonthResponse {
  month_start: {
    value: string;
  };
  total_amount: number;
}

interface SalesPerDayEntry {
  day: number;
  total_amount: number;
}

export interface GetSalesPerDayResponse {
  weekday: string;
  data: SalesPerDayEntry[];
}

export interface GetAverageTransactionsResponse {
  average_transactions_per_day: number;
}

export interface GetAverageTransactionPriceResponse {
  average_amount_per_transaction: number;
}

export interface GetAverageTransactionPriceWeekResponse {
  week_start_date: string;
  average_amount_per_transaction: number;
}

export interface GetBusiestTimesResponse {
  day_of_week: number;
  hour_of_day: number;
  transaction_count: number;
}

export interface GetRetentionRateResponse {
  total_customers: number;
  customers_with_count_1: number;
  percentage: number;
}
