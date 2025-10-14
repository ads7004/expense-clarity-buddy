# Expense Splitter Service - Test Plan

## Overview
This test plan covers comprehensive testing scenarios for the Expense Splitter Service application, ensuring correct functionality for group expense tracking, balance calculations, and settlement suggestions.

---

## Test Case 1: Group Creation and Basic Functionality

**Objective:** Verify that users can create a group and add members successfully.

**Preconditions:** Application is loaded and no group exists.

**Test Steps:**
1. Enter group name "Apartment 4B"
2. Add 4 members: Alice, Bob, Carol, Dave
3. Click "Create Group"

**Expected Results:**
- Group is created successfully
- All 4 members are displayed
- Dashboard view loads
- No expenses shown initially
- All balances show as "Settled"

**Priority:** Critical

---

## Test Case 2: Equal Split Among All Members

**Objective:** Verify correct balance calculations when an expense is split equally among all members.

**Preconditions:** Group exists with 4 members.

**Test Steps:**
1. Add expense: "Groceries", $100, paid by Alice
2. Select all 4 members to split
3. Submit expense

**Expected Results:**
- Expense appears in the list
- Each member's share is $25.00
- Alice's balance: +$75.00 (gets back)
- Bob's balance: -$25.00 (owes)
- Carol's balance: -$25.00 (owes)
- Dave's balance: -$25.00 (owes)
- Settlement suggestions show 3 payments to Alice

**Priority:** Critical

---

## Test Case 3: Partial Participant Split

**Objective:** Verify correct calculations when only some members participate in an expense.

**Preconditions:** Group exists with 4 members.

**Test Steps:**
1. Add expense: "Utility Bill", $60, paid by Bob
2. Select only Alice and Bob to split
3. Submit expense

**Expected Results:**
- Expense shows 2 participants (Alice, Bob)
- Each participant's share is $30.00
- Alice's balance: -$30.00 (owes)
- Bob's balance: +$30.00 (gets back)
- Carol's balance: $0.00 (settled)
- Dave's balance: $0.00 (settled)
- Settlement shows: Alice pays Bob $30.00

**Priority:** Critical

---

## Test Case 4: Mixed Expenses with Complex Balances

**Objective:** Verify the system handles multiple expenses with different participant combinations.

**Preconditions:** Group exists with 4 members.

**Test Steps:**
1. Add expense: "Groceries", $100, paid by Alice, split among all 4
2. Add expense: "Utility Bill", $60, paid by Bob, split between Alice & Bob
3. Add expense: "Pizza Night", $40, paid by Carol, split among Bob, Carol, Dave

**Expected Results:**
- 3 expenses displayed
- Alice's final balance: +$45.00 (paid $100, owes $55)
- Bob's final balance: -$8.33 (paid $60, owes $68.33)
- Carol's final balance: +$1.67 (paid $40, owes $38.33)
- Dave's final balance: -$38.33 (paid $0, owes $38.33)
- Settlement suggestions minimize transactions (3 payments max)
- Total settlement amounts balance to zero

**Priority:** Critical

---

## Test Case 5: Zero Amount Validation

**Objective:** Verify the system prevents invalid expense entries.

**Test Steps:**
1. Try to add expense with $0.00 amount
2. Try to add expense with negative amount
3. Try to add expense with empty description
4. Try to add expense without selecting who paid
5. Try to add expense without selecting split participants

**Expected Results:**
- Each invalid entry shows appropriate error message
- No expense is added to the list
- Form remains open for correction
- Error messages are clear and helpful

**Priority:** High

---

## Test Case 6: Settlement Algorithm Efficiency

**Objective:** Verify the settlement algorithm minimizes the number of transactions.

**Preconditions:** Group with complex balance scenario.

**Test Steps:**
1. Create scenario where Alice is owed $100
2. Bob owes $30, Carol owes $40, Dave owes $30

**Expected Results:**
- Algorithm suggests 3 transactions (not 6)
- Dave pays Alice $30
- Carol pays Alice $40
- Bob pays Alice $30
- OR similar optimization with same transaction count
- Total settlements equal total imbalances

**Priority:** Medium

---

## Test Case 7: Large Expense Amounts

**Objective:** Verify correct handling of large monetary values.

**Test Steps:**
1. Add expense with amount $9,999.99
2. Add expense with amount $10,000.00
3. Verify balance calculations

**Expected Results:**
- All amounts display correctly with 2 decimal places
- No rounding errors in calculations
- Balances sum to zero
- UI displays large numbers properly

**Priority:** Medium

---

## Test Case 8: Unbalanced Totals Detection

**Objective:** Verify the system maintains balance integrity.

**Test Steps:**
1. Add 5 different expenses with various splits
2. Sum all positive balances
3. Sum all negative balances (absolute values)

**Expected Results:**
- Sum of positive balances equals sum of negative balances
- Difference is less than $0.01 (accounting for rounding)
- Settlement suggestions balance to zero within $0.01

**Priority:** High

---

## Test Case 9: Responsive UI and User Experience

**Objective:** Verify UI is intuitive and responsive.

**Test Steps:**
1. Test on desktop viewport (1920px)
2. Test on tablet viewport (768px)
3. Test on mobile viewport (375px)
4. Add expenses and verify readability

**Expected Results:**
- Layout adjusts appropriately for each viewport
- All text is readable
- Forms are usable on mobile
- Cards stack properly on smaller screens
- No horizontal scrolling required

**Priority:** Medium

---

## Test Case 10: Group Exit and Reset

**Objective:** Verify users can leave a group and start fresh.

**Test Steps:**
1. Create group with expenses
2. Click "Leave Group" button
3. Verify return to group creation screen
4. Create new group

**Expected Results:**
- All previous data is cleared
- Group creation form is fresh
- No remnants of previous group
- New group starts with clean state

**Priority:** Medium

---

## Automated Test Coverage

### Unit Tests (Jest/Vitest)

**Balance Calculation Tests:**
```typescript
- Equal split among all members
- Partial participant splits
- Multiple mixed expenses
- Zero balance scenario
- Large number handling
```

**Settlement Algorithm Tests:**
```typescript
- Two-person settlement
- Multi-person complex settlements
- Already balanced scenario
- Minimization verification
- Rounding edge cases
```

**Data Validation Tests:**
```typescript
- Invalid amounts (zero, negative)
- Missing required fields
- Invalid member selections
- Boundary values
```

### Integration Tests

**End-to-End Flows:**
- Complete group creation to settlement flow
- Multiple expense entries with balance verification
- Settlement suggestion accuracy
- UI state management

---

## Performance Benchmarks

**Target Metrics:**
- Group creation: < 100ms
- Expense addition: < 50ms
- Balance calculation: < 10ms
- Settlement algorithm: < 20ms for up to 100 members
- UI render time: < 100ms

---

## Edge Cases to Test

1. **Single member group** (should prevent creation)
2. **Expense where payer is not in split list**
3. **Very small amounts** ($0.01 expenses)
4. **Decimal precision** (amounts like $33.33 split 3 ways)
5. **100+ expenses** in a single group
6. **Special characters** in names and descriptions
7. **Browser compatibility** (Chrome, Firefox, Safari, Edge)
8. **Local storage limits** (if implementing persistence)

---

## Test Execution Schedule

**Phase 1 - Core Functionality (Critical Tests)**
- Test Cases 1-4
- Run after each major feature implementation

**Phase 2 - Validation & Edge Cases (High Priority Tests)**
- Test Cases 5, 8
- Run before release

**Phase 3 - Optimization & UX (Medium Priority Tests)**
- Test Cases 6, 7, 9, 10
- Run during QA phase

---

## Success Criteria

- ✅ All Critical priority tests pass (100%)
- ✅ All High priority tests pass (100%)
- ✅ At least 90% of Medium priority tests pass
- ✅ No blocking bugs identified
- ✅ Algorithm produces mathematically correct results
- ✅ UI is responsive and accessible
- ✅ Code coverage > 80% for business logic

---

## Defect Management

**Severity Levels:**
- **Critical:** Incorrect calculations, data loss
- **High:** UI breaks, validation failures
- **Medium:** UX issues, minor visual bugs
- **Low:** Cosmetic improvements

**Reporting Template:**
- Test case ID
- Steps to reproduce
- Expected vs actual results
- Screenshots/videos
- Browser/environment details
