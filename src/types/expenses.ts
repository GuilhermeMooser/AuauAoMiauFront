import {Audit} from "./audit";

export type MinimalExpenses = {
  id: string;
  value: number;
  description: string;
  paymentType: string;
  audit?: Audit;
};

export type CreateExpenseDto = {
  value: number;
  description: string;
  paymentType: string;
};

export type UpdateExpenseDto = CreateExpenseDto & {
  id: string;
};
