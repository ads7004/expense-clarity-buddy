import { Balance, Settlement } from "@/types/expense";

/**
 * Calculate optimal settlements using a greedy algorithm
 * Minimizes the number of transactions needed to settle all balances
 */
export function calculateSettlements(balances: Balance[]): Settlement[] {
  const settlements: Settlement[] = [];
  
  // Create mutable copies of balances
  const balanceCopy = balances.map(b => ({ ...b }));
  
  // Separate debtors (negative balance) and creditors (positive balance)
  let debtors = balanceCopy.filter(b => b.balance < -0.01).sort((a, b) => a.balance - b.balance);
  let creditors = balanceCopy.filter(b => b.balance > 0.01).sort((a, b) => b.balance - a.balance);
  
  // Match debtors with creditors
  while (debtors.length > 0 && creditors.length > 0) {
    const debtor = debtors[0];
    const creditor = creditors[0];
    
    const debtAmount = Math.abs(debtor.balance);
    const creditAmount = creditor.balance;
    const settlementAmount = Math.min(debtAmount, creditAmount);
    
    // Create settlement
    settlements.push({
      from: debtor.memberName,
      to: creditor.memberName,
      amount: parseFloat(settlementAmount.toFixed(2))
    });
    
    // Update balances
    debtor.balance += settlementAmount;
    creditor.balance -= settlementAmount;
    
    // Remove settled parties
    if (Math.abs(debtor.balance) < 0.01) {
      debtors.shift();
    }
    if (Math.abs(creditor.balance) < 0.01) {
      creditors.shift();
    }
  }
  
  return settlements;
}

/**
 * Calculate balances for all members based on expenses
 */
export function calculateBalances(
  members: { id: string; name: string }[],
  expenses: { paidBy: string; amount: number; splitBetween: string[] }[]
): Balance[] {
  // Initialize balances to zero
  const balanceMap = new Map<string, number>();
  members.forEach(member => {
    balanceMap.set(member.id, 0);
  });
  
  // Process each expense
  expenses.forEach(expense => {
    const shareAmount = expense.amount / expense.splitBetween.length;
    
    // The payer should receive money (positive balance)
    const currentBalance = balanceMap.get(expense.paidBy) || 0;
    balanceMap.set(expense.paidBy, currentBalance + expense.amount);
    
    // Each participant should pay their share (negative balance)
    expense.splitBetween.forEach(memberId => {
      const memberBalance = balanceMap.get(memberId) || 0;
      balanceMap.set(memberId, memberBalance - shareAmount);
    });
  });
  
  // Convert to Balance array
  return members.map(member => ({
    memberId: member.id,
    memberName: member.name,
    balance: parseFloat((balanceMap.get(member.id) || 0).toFixed(2))
  }));
}
