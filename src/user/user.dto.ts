export interface IUser {
  id: number;
  balance: number;
}
export interface ITransaction {
  id: number;
  type: string;
  user_id: number;
  target_user_id: number | null;
  amount: number;
  time_transaction: string;
}

export interface IUserWithTransaction extends IUser {
  transactions: ITransaction[];
}
