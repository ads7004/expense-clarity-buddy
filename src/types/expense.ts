export interface Member {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string; // member id
  splitBetween: string[]; // array of member ids
  date: Date;
}

export interface Balance {
  memberId: string;
  memberName: string;
  balance: number; // positive = owed to them, negative = they owe
}

export interface Settlement {
  from: string; // member name
  to: string; // member name
  amount: number;
}

export interface ExpenseGroup {
  id: string;
  name: string;
  members: Member[];
  expenses: Expense[];
}
