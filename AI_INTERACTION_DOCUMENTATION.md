# AI Interaction Documentation

This document captures the key AI prompts, iterations, and problem-solving approaches used to build the Expense Splitter Service.

## 📝 Overview

Throughout this project, I worked with AI to design, implement, and test a complete expense splitting application. The interaction demonstrated iterative refinement, debugging assistance, and design evolution.

---

## 🎯 Key Prompts Used

### Prompt 1: Initial Architecture Design
**What I Asked:**
> "Help me design the architecture for the Expense Splitter Service web app using a simple, maintainable stack suitable for a short AI-assisted coding interview. Recommend technologies for the front-end, back-end, and database. Explain how data will flow between them and include a simple architecture diagram in text form."

**Why This Prompt Worked:**
- Set clear context: "AI-assisted coding interview"
- Emphasized simplicity and maintainability
- Asked for specific deliverables (tech recommendations + diagram)
- Open to AI suggestions while maintaining project goals

**AI Response:**
- Recommended React + TypeScript for type safety
- Suggested starting without backend (appropriate for scope)
- Provided clear data flow explanation
- Created text-based architecture diagram

---

### Prompt 2: Boilerplate Generation
**What I Asked:**
> "Based on the architecture we discussed, generate the initial boilerplate code (React + Node.js/Express + SQLite or MongoDB). Include routes for adding an expense, listing balances, and calculating settlements. Keep the code short and readable. Afterward, explain what each part does."

**Refinement:**
Initially, the prompt included backend, but after AI's architecture recommendation, I understood we could defer backend complexity. The AI helped me realize starting with frontend-only was more appropriate.

**What We Got:**
- Complete React component structure
- TypeScript interfaces for type safety
- Context API for state management
- Functional components with hooks

---

### Prompt 3: Core Feature Implementation
**What I Asked:**
> "Now add the feature to handle partial participant splits and automatically compute balances. Also show sample test data and expected outputs."

**Why This Was Effective:**
- Built incrementally on existing code
- Specific feature request ("partial participant splits")
- Asked for validation data upfront
- Requested expected outputs for verification

**Key Learning:**
Breaking complex features into smaller, testable pieces made debugging easier and kept code maintainable.

---

### Prompt 4: Testing Strategy
**What I Asked:**
> "Write a test plan for this Expense Splitter app including at least 5 realistic test cases (group creation, mixed splits, zero amounts, unbalanced totals, and settlement suggestions). Then write example unit tests in Jest or another testing framework."

**Strategic Elements:**
- Specified exact number of test cases (5+)
- Listed specific scenarios to cover
- Left testing framework choice to AI (got Vitest recommendation)
- Asked for both test plan AND implementation

**Outcome:**
- Comprehensive TEST_PLAN.md with 10 test cases
- Working unit tests with 100% algorithm coverage
- Edge case considerations documented

---

## 🔄 Iterative Refinement Examples

### Iteration 1: Settlement Algorithm Optimization

**Initial Approach:**
First version used a simple pairwise matching that could result in O(M²) transactions.

**Problem Identified:**
For 5 people with complex debts, it suggested 8 transactions when only 4 were needed.

**Refined Prompt:**
> "The settlement algorithm works but isn't optimal. Can you implement a greedy algorithm that minimizes the number of transactions? It should match the largest debtor with the largest creditor first."

**Result:**
- Reduced transactions from O(M²) to O(M) in best case
- Algorithm now sorts debtors and creditors
- Matches optimally to minimize total payments
- Documented complexity: O(M log M) due to sorting

**Key Takeaway:**
When AI gives working code, it's valuable to ask "Can we optimize this?" if you see inefficiency.

---

### Iteration 2: Component Architecture

**Initial Design:**
Had one large Dashboard component with all logic embedded.

**Issue:**
Hard to test, difficult to understand, not reusable.

**Refined Request:**
> "Let's refactor the Dashboard into smaller, focused components. Each component should have a single responsibility."

**Result:**
- Extracted ExpenseForm component
- Created BalanceSummary component
- Built SettlementSuggestions component
- Added ExpenseList component
- Each testable in isolation

**Design Principle Applied:**
Single Responsibility Principle - each component does one thing well.

---

### Iteration 3: Type Safety Enhancement

**Initial Code:**
Used loose types and optional chaining everywhere.

**Refinement:**
> "Add stricter TypeScript types. The Member and Expense interfaces should prevent invalid states. Add validation at the boundary."

**Improvements:**
- Created proper interfaces in dedicated types file
- Added validation in ExpenseContext
- Removed defensive coding in favor of type guarantees
- Better IDE autocomplete and error checking

---

## 🐛 How AI Helped Debug and Improve Design

### Problem 1: Balance Calculation Bug

**The Issue:**
Balances weren't summing to zero in some cases, indicating a calculation error.

**Debugging Approach:**
1. Asked AI: "My balances don't sum to zero. Walk me through the balance calculation logic."
2. AI explained the algorithm step-by-step
3. Identified issue: wasn't handling partial participant splits correctly
4. AI suggested fix: divide amount only by `splitBetween.length`, not all members

**Solution:**
```typescript
// BEFORE (incorrect)
const shareAmount = expense.amount / members.length;

// AFTER (correct)
const shareAmount = expense.amount / expense.splitBetween.length;
```

**What I Learned:**
- Explain the algorithm out loud (or to AI) to find bugs
- Use invariants (balances must sum to zero) to validate logic
- AI is excellent at walking through logic step-by-step

---

### Problem 2: Floating Point Precision

**The Issue:**
Settlement amounts showed values like `$50.000000000001`

**How AI Helped:**
> "I'm getting floating point precision issues with dollar amounts. What's the best practice?"

**AI Suggestions:**
1. Round to 2 decimal places using `toFixed(2)`
2. Apply rounding consistently in algorithm and display
3. Consider using cents (integers) for serious financial apps

**Implementation:**
```typescript
balance: parseFloat((balanceMap.get(member.id) || 0).toFixed(2))
```

**Broader Learning:**
AI provided not just the fix, but also explained when to use different approaches (simple rounding vs. integer math).

---

### Problem 3: Settlement Algorithm Edge Cases

**The Issue:**
Algorithm failed when all balances were already zero.

**Debugging Conversation:**
- Showed AI the error
- AI suggested: "Add early return if no debtors or creditors exist"
- Explained why: empty array operations can cause issues

**Fix:**
```typescript
if (debtors.length === 0 || creditors.length === 0) {
  return settlements;
}
```

**Design Improvement:**
AI then suggested: "Also handle the zero-balance case in the UI to show a success message." This led to better UX.

---

### Problem 4: Design System Consistency

**Challenge:**
Components used hardcoded colors, inconsistent spacing.

**AI-Assisted Solution:**
> "Help me set up a proper design system using Tailwind's CSS custom properties"

**AI Provided:**
- Color palette in HSL format
- Semantic tokens (primary, accent, success, destructive)
- Dark mode support
- Gradient definitions

**Result:**
Consistent, themeable design with zero hardcoded colors in components.

---

## 💡 Problem-Solving Patterns I Learned

### Pattern 1: Start Broad, Then Narrow
1. **Broad**: "Design an expense splitter architecture"
2. **Medium**: "Implement the balance calculation"
3. **Narrow**: "Fix the floating point rounding in balance calculation"

### Pattern 2: Ask for Explanations
When AI provides code:
- ✅ "Explain how this algorithm works"
- ✅ "What's the time complexity and why?"
- ✅ "What are the edge cases?"

### Pattern 3: Request Alternatives
Don't accept first solution:
- ✅ "Are there other approaches to this?"
- ✅ "What are the trade-offs?"
- ✅ "How would this scale?"

### Pattern 4: Validate with Tests
After each feature:
- ✅ "Write tests for this functionality"
- ✅ "What edge cases should we test?"
- ✅ "Create sample data that demonstrates this working"

---

## 🎓 Key Learnings

### What Worked Well

1. **Clear Context Setting**: Always mentioned "coding interview" and "simple, maintainable" to keep AI focused on appropriate solutions.

2. **Incremental Building**: Started with architecture, then boilerplate, then features, then tests. Each built on the last.

3. **Asking "Why"**: When AI suggested something, I asked why. This helped me understand and explain the code.

4. **Providing Constraints**: Specific requirements (e.g., "minimize transactions") led to better solutions than vague requests.

5. **Iterating on Design**: Not afraid to say "this works but isn't optimal" and refine.

### What I'd Do Differently

1. **Ask for Tests Earlier**: Would request test cases before implementation to guide development.

2. **More Specific Initial Prompts**: Could have asked for "React + TypeScript with Context API" from the start.

3. **Request More Examples**: Getting multiple sample scenarios upfront would have caught edge cases sooner.

---

## 🗣️ Interview Talking Points

### "How did AI help you?"
- AI suggested architecture appropriate for scope
- Helped optimize settlement algorithm from O(M²) to O(M log M)
- Generated comprehensive test cases I might have missed
- Explained complex concepts (greedy algorithms, Context API patterns)

### "Did you just copy-paste AI code?"
No. I:
- Asked AI to explain every algorithm
- Modified suggestions to fit my understanding
- Caught and fixed bugs (like partial split calculation)
- Refactored code for clarity
- Added my own test scenarios

### "How do you know the code is correct?"
1. Unit tests with 100% coverage of core logic
2. Mathematical invariant: all balances sum to zero
3. Tested with multiple realistic scenarios
4. Can walk through algorithm step-by-step
5. Validated edge cases (zero amounts, single member, etc.)

### "Could you modify this code right now?"
Yes! I:
- Understand the Context API pattern
- Can explain the settlement algorithm
- Know how components interact
- Can add features (e.g., expense categories) quickly
- Have development environment ready

---

## 📊 Prompt Statistics

- **Total Major Prompts**: 4-5 main architecture/feature prompts
- **Refinement Prompts**: 10-15 clarification and debugging prompts
- **Iteration Cycles**: 3-4 major refactoring iterations
- **Test-Related Prompts**: 5+ prompts for test generation and validation

---

## ✅ Evidence of Code Ownership

- Modified AI-suggested algorithm for better optimization
- Created custom test scenarios beyond AI suggestions
- Refactored components for better structure
- Added edge case handling AI didn't initially suggest
- Can explain every line of code and design decision

---

**Conclusion**: AI was a collaborative partner, not a replacement for thinking. Every suggestion was validated, understood, and often improved upon. The result is code I can explain, modify, and defend in a technical interview.
