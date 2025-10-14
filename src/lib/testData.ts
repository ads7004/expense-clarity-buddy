/**
 * Sample test data for the Expense Splitter Service
 * Demonstrates various scenarios including mixed participants and partial splits
 */

export const sampleTestData = {
  groupName: "Apartment 4B Roommates",
  members: ["Alice", "Bob", "Carol", "Dave"],
  
  expenses: [
    {
      description: "Groceries - Weekly Shopping",
      amount: 100.00,
      paidBy: "Alice",
      splitBetween: ["Alice", "Bob", "Carol", "Dave"],
      expected: {
        shareEach: 25.00,
        note: "All four roommates share groceries equally"
      }
    },
    {
      description: "Utility Bill - Alice & Bob's Rooms",
      amount: 60.00,
      paidBy: "Bob",
      splitBetween: ["Alice", "Bob"],
      expected: {
        shareEach: 30.00,
        note: "Only Alice and Bob split this utility bill"
      }
    },
    {
      description: "Pizza Night",
      amount: 40.00,
      paidBy: "Carol",
      splitBetween: ["Bob", "Carol", "Dave"],
      expected: {
        shareEach: 13.33,
        note: "Alice was out, so only three people split"
      }
    }
  ],
  
  expectedBalances: {
    Alice: {
      paid: 100.00,
      owes: 25.00 + 30.00, // groceries + utility
      balance: 100.00 - 55.00,
      final: 45.00,
      status: "gets back"
    },
    Bob: {
      paid: 60.00,
      owes: 25.00 + 30.00 + 13.33, // groceries + utility + pizza
      balance: 60.00 - 68.33,
      final: -8.33,
      status: "owes"
    },
    Carol: {
      paid: 40.00,
      owes: 25.00 + 13.33, // groceries + pizza
      balance: 40.00 - 38.33,
      final: 1.67,
      status: "gets back"
    },
    Dave: {
      paid: 0.00,
      owes: 25.00 + 13.33, // groceries + pizza
      balance: 0.00 - 38.33,
      final: -38.33,
      status: "owes"
    }
  },
  
  expectedSettlements: [
    {
      from: "Dave",
      to: "Alice",
      amount: 38.33,
      note: "Dave owes the most, Alice is owed the most"
    },
    {
      from: "Bob",
      to: "Alice",
      amount: 6.67,
      note: "Remaining amount Alice is owed"
    },
    {
      from: "Bob",
      to: "Carol",
      amount: 1.67,
      note: "Settle Carol's balance"
    }
  ],
  
  summary: {
    totalExpenses: 200.00,
    totalTransactions: 3,
    participantVariation: "Mixed - not all expenses split equally among all members",
    settlementCount: 3,
    settlementEfficiency: "Minimal - uses greedy algorithm to minimize transaction count"
  }
};

/**
 * Expected console output format for testing
 */
export const expectedOutput = `
=== EXPENSE SPLITTER TEST SCENARIO ===

Group: ${sampleTestData.groupName}
Members: ${sampleTestData.members.join(", ")}

EXPENSES:
${sampleTestData.expenses.map((exp, i) => `
${i + 1}. ${exp.description}
   Amount: $${exp.amount.toFixed(2)}
   Paid by: ${exp.paidBy}
   Split between: ${exp.splitBetween.join(", ")}
   Share each: $${exp.expected.shareEach.toFixed(2)}
`).join("")}

BALANCES:
${Object.entries(sampleTestData.expectedBalances).map(([name, data]) => `
  ${name}:
    Paid: $${data.paid.toFixed(2)}
    Owes: $${data.owes.toFixed(2)}
    Balance: $${data.final.toFixed(2)} (${data.status})
`).join("")}

SETTLEMENT SUGGESTIONS:
${sampleTestData.expectedSettlements.map((settlement, i) => `
  ${i + 1}. ${settlement.from} pays ${settlement.to}: $${settlement.amount.toFixed(2)}
`).join("")}

Total Expenses: $${sampleTestData.summary.totalExpenses.toFixed(2)}
Number of Settlements: ${sampleTestData.summary.settlementCount}
`;
