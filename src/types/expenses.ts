import {Audit} from "./audit";

export type MinimalExpenses = {
  id: string;
  expenseType: string;
  value: number;
  description: string;
  paymentType: string;
  audit?: Audit;
};
