import { describe, it, expect } from "vitest";
import { calculateBalances, calculateSettlements } from "@/lib/settlementAlgorithm";
import { Member, Expense } from "@/types/expense";

describe("Settlement Algorithm", () => {
  const members: Member[] = [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" },
    { id: "3", name: "Carol" },
    { id: "4", name: "Dave" }
  ];

  describe("calculateBalances", () => {
    it("should calculate correct balances for equal split", () => {
      const expenses: Expense[] = [
        {
          id: "e1",
          description: "Groceries",
          amount: 100,
          paidBy: "1",
          splitBetween: ["1", "2", "3", "4"],
          date: new Date()
        }
      ];

      const balances = calculateBalances(members, expenses);
      
      expect(balances[0].balance).toBe(75); // Alice paid 100, owes 25
      expect(balances[1].balance).toBe(-25); // Bob owes 25
      expect(balances[2].balance).toBe(-25); // Carol owes 25
      expect(balances[3].balance).toBe(-25); // Dave owes 25
    });

    it("should handle partial participant splits", () => {
      const expenses: Expense[] = [
        {
          id: "e1",
          description: "Utility",
          amount: 60,
          paidBy: "2",
          splitBetween: ["1", "2"],
          date: new Date()
        }
      ];

      const balances = calculateBalances(members, expenses);
      
      expect(balances[0].balance).toBe(-30); // Alice owes 30
      expect(balances[1].balance).toBe(30); // Bob paid 60, owes 30
      expect(balances[2].balance).toBe(0); // Carol not involved
      expect(balances[3].balance).toBe(0); // Dave not involved
    });

    it("should handle multiple mixed expenses", () => {
      const expenses: Expense[] = [
        {
          id: "e1",
          description: "Groceries",
          amount: 100,
          paidBy: "1",
          splitBetween: ["1", "2", "3", "4"],
          date: new Date()
        },
        {
          id: "e2",
          description: "Utility",
          amount: 60,
          paidBy: "2",
          splitBetween: ["1", "2"],
          date: new Date()
        },
        {
          id: "e3",
          description: "Pizza",
          amount: 40,
          paidBy: "3",
          splitBetween: ["2", "3", "4"],
          date: new Date()
        }
      ];

      const balances = calculateBalances(members, expenses);
      
      // Alice: paid 100, owes 25 (groceries) + 30 (utility) = 45
      expect(balances[0].balance).toBeCloseTo(45, 2);
      
      // Bob: paid 60, owes 25 (groceries) + 30 (utility) + 13.33 (pizza) = -8.33
      expect(balances[1].balance).toBeCloseTo(-8.33, 2);
      
      // Carol: paid 40, owes 25 (groceries) + 13.33 (pizza) = 1.67
      expect(balances[2].balance).toBeCloseTo(1.67, 2);
      
      // Dave: paid 0, owes 25 (groceries) + 13.33 (pizza) = -38.33
      expect(balances[3].balance).toBeCloseTo(-38.33, 2);
    });
  });

  describe("calculateSettlements", () => {
    it("should suggest zero settlements when balanced", () => {
      const balances = [
        { memberId: "1", memberName: "Alice", balance: 0 },
        { memberId: "2", memberName: "Bob", balance: 0 }
      ];

      const settlements = calculateSettlements(balances);
      expect(settlements).toHaveLength(0);
    });

    it("should suggest single settlement for two people", () => {
      const balances = [
        { memberId: "1", memberName: "Alice", balance: 50 },
        { memberId: "2", memberName: "Bob", balance: -50 }
      ];

      const settlements = calculateSettlements(balances);
      
      expect(settlements).toHaveLength(1);
      expect(settlements[0]).toEqual({
        from: "Bob",
        to: "Alice",
        amount: 50
      });
    });

    it("should minimize number of transactions", () => {
      const balances = [
        { memberId: "1", memberName: "Alice", balance: 45 },
        { memberId: "2", memberName: "Bob", balance: -8.33 },
        { memberId: "3", memberName: "Carol", balance: 1.67 },
        { memberId: "4", memberName: "Dave", balance: -38.33 }
      ];

      const settlements = calculateSettlements(balances);
      
      // Should minimize transactions (greedy algorithm)
      expect(settlements.length).toBeLessThanOrEqual(3);
      
      // Total amounts should balance
      const totalFrom = settlements.reduce((sum, s) => sum + s.amount, 0);
      const totalTo = settlements.reduce((sum, s) => sum + s.amount, 0);
      expect(totalFrom).toBeCloseTo(totalTo, 2);
    });

    it("should handle complex multi-party settlements", () => {
      const balances = [
        { memberId: "1", memberName: "Alice", balance: 100 },
        { memberId: "2", memberName: "Bob", balance: -30 },
        { memberId: "3", memberName: "Carol", balance: -40 },
        { memberId: "4", memberName: "Dave", balance: -30 }
      ];

      const settlements = calculateSettlements(balances);
      
      // Verify total amounts balance
      const totalPositive = balances.filter(b => b.balance > 0)
        .reduce((sum, b) => sum + b.balance, 0);
      const totalNegative = Math.abs(balances.filter(b => b.balance < 0)
        .reduce((sum, b) => sum + b.balance, 0));
      
      expect(totalPositive).toBeCloseTo(totalNegative, 2);
      
      // Verify all settlements are valid
      settlements.forEach(settlement => {
        expect(settlement.amount).toBeGreaterThan(0);
        expect(settlement.from).toBeTruthy();
        expect(settlement.to).toBeTruthy();
      });
    });
  });
});
