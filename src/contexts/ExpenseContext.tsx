import React, { createContext, useContext, useState } from "react";
import { ExpenseGroup, Expense, Member, Balance, Settlement, Currency } from "@/types/expense";
import { calculateBalances, calculateSettlements } from "@/lib/settlementAlgorithm";

interface ExpenseContextType {
  group: ExpenseGroup | null;
  createGroup: (name: string, memberNames: string[], currency: Currency) => void;
  addExpense: (expense: Omit<Expense, "id" | "date">) => void;
  getBalances: () => Balance[];
  getSettlements: () => Settlement[];
  clearGroup: () => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [group, setGroup] = useState<ExpenseGroup | null>(null);

  const createGroup = (name: string, memberNames: string[], currency: Currency) => {
    const members: Member[] = memberNames.map((name, index) => ({
      id: `member-${index}`,
      name: name.trim()
    }));

    setGroup({
      id: "group-1",
      name,
      currency,
      members,
      expenses: []
    });
  };

  const addExpense = (expense: Omit<Expense, "id" | "date">) => {
    if (!group) return;

    const newExpense: Expense = {
      ...expense,
      id: `expense-${group.expenses.length}`,
      date: new Date()
    };

    setGroup({
      ...group,
      expenses: [...group.expenses, newExpense]
    });
  };

  const getBalances = (): Balance[] => {
    if (!group) return [];
    return calculateBalances(group.members, group.expenses);
  };

  const getSettlements = (): Settlement[] => {
    if (!group) return [];
    const balances = getBalances();
    return calculateSettlements(balances);
  };

  const clearGroup = () => {
    setGroup(null);
  };

  return (
    <ExpenseContext.Provider
      value={{
        group,
        createGroup,
        addExpense,
        getBalances,
        getSettlements,
        clearGroup
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpense must be used within an ExpenseProvider");
  }
  return context;
}
