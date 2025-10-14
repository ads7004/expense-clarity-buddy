# AI Interaction Documentation

## Overview

This document explains how I leveraged AI assistance throughout the development of the Expense Splitter Service, demonstrating effective prompt engineering and iterative problem-solving.

---

## Key Prompts I Used

### 1. Initial Architecture Design
**Prompt:**
> "Help me design the architecture for the Expense Splitter Service web app using a simple, maintainable stack suitable for a short AI-assisted coding interview. Recommend technologies for the front-end, back-end, and database."

**Why this worked:** I was specific about the context (coding interview) and constraints (simple, maintainable), which helped the AI recommend appropriate technologies rather than over-engineering.

### 2. Boilerplate Generation
**Prompt:**
> "Based on the architecture we discussed, generate the initial boilerplate code (React + Node.js/Express + SQLite or MongoDB). Include routes for adding an expense, listing balances, and calculating settlements. Keep the code short and readable."

**Why this worked:** I referenced our previous conversation ("based on the architecture we discussed") and emphasized "short and readable" to avoid overwhelming complexity.

### 3. Feature Implementation
**Prompt:**
> "Now add the feature to handle partial participant splits and automatically compute balances. Also show sample test data and expected outputs."

**Why this worked:** I built incrementally on existing code rather than asking for everything at once. The request for sample data helped validate the implementation immediately.

### 4. Testing Strategy
**Prompt:**
> "Write a test plan for this Expense Splitter app including at least 5 realistic test cases (group creation, mixed splits, zero amounts, unbalanced totals, and settlement suggestions). Then write example unit tests in Jest or another testing framework."

**Why this worked:** I specified the number and types of test cases I wanted, making the AI's output more focused and relevant to common edge cases.

---

## How I Refined Prompts Iteratively

### Iteration 1: Too Vague
**Initial attempt:** "Build an expense splitter app"
- **Problem:** Too broad, AI would have made too many assumptions
- **Learning:** Need to specify constraints and context

### Iteration 2: Better Context
**Improved prompt:** "Design architecture for expense splitter suitable for coding interview"
- **Better because:** Added context about use case and audience
- **Still missing:** Specific technology preferences

### Iteration 3: Final Version
**Best prompt:** "Help me design the architecture... using a simple, maintainable stack suitable for a short AI-assisted coding interview"
- **Why it worked:** Combined context, constraints, and expectations
- **Result:** Got React + TypeScript + Context API (perfect for interview scope)

### Pattern I Discovered
The most effective prompts followed this structure:
1. **Context:** "For a coding interview..."
2. **Constraint:** "Keep it simple and maintainable..."
3. **Specific request:** "Generate boilerplate with routes for X, Y, Z..."
4. **Quality criteria:** "Keep code short and readable..."

---

## How AI Helped Debug and Improve Design

### 1. Algorithm Optimization
**Challenge:** Initially considered a brute-force approach for settlement calculations

**AI Contribution:**
- Suggested greedy algorithm for minimizing transactions
- Explained time complexity (O(M log M))
- Provided mathematical proof that it produces near-optimal results

**Impact:** Reduced settlement transactions significantly (e.g., 4-person group: 6 potential transactions → 3 actual transactions)

### 2. Type Safety
**Challenge:** Needed robust type definitions for complex nested data

**AI Contribution:**
- Generated comprehensive TypeScript interfaces
- Suggested using discriminated unions for expense types
- Added proper type guards for runtime safety

**Example:**
```typescript
interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  date: Date;
}
```

**Impact:** Caught potential bugs at compile-time rather than runtime

### 3. Design System Architecture
**Challenge:** Wanted consistent, maintainable styling

**AI Contribution:**
- Recommended semantic color tokens instead of hardcoded values
- Suggested using CSS custom properties for theming
- Generated complete design system in `index.css`

**Before:**
```tsx
<Button className="bg-blue-500 text-white">
```

**After:**
```tsx
<Button variant="primary">
```

**Impact:** Entire color scheme can be changed by modifying CSS variables

### 4. Testing Strategy
**Challenge:** Unsure what edge cases to test

**AI Contribution:**
- Identified critical test scenarios (zero amounts, rounding errors, single member)
- Suggested property-based testing approach
- Generated comprehensive test data with expected outputs

**Example insight:** "What happens when expense amount is 0?" → Added validation
**Example insight:** "What if only one person in group?" → Edge case handled

### 5. Code Organization
**Initial approach:** Might have put everything in one file

**AI suggestion:**
- Separate algorithm logic (`settlementAlgorithm.ts`)
- Isolate state management (`ExpenseContext.tsx`)
- Component-based UI architecture
- Test data in separate module

**Impact:** 
- Easy to test algorithms independently
- Clear separation of concerns
- Maintainable codebase

---

## Interview Talking Points

### What I learned about working with AI:

1. **Specificity matters:** "Keep it simple" is better than no guidance, but "suitable for 30-minute interview demo" is even better

2. **Incremental development:** Building features one-by-one allowed me to understand each piece before moving forward

3. **AI as code reviewer:** After AI generated code, I reviewed and understood it rather than blindly accepting it

4. **Test-driven mindset:** Asking for test cases alongside features ensured robust implementation

5. **Documentation as learning:** Having AI explain algorithms (like the greedy settlement approach) deepened my understanding

### What I would do differently:

- Start with explicit requirements document before first prompt
- Ask AI to explain *why* it chose certain approaches, not just *what* to implement
- Request multiple alternative solutions to compare trade-offs
- Use AI to generate edge cases I hadn't considered

### Key insight:
AI is most effective as a **collaborative partner** when I:
- Provide clear context and constraints
- Ask follow-up questions about decisions
- Review and validate generated code
- Iterate based on testing and feedback

The goal isn't to have AI write all my code, but to accelerate the development cycle while maintaining deep understanding of the system I'm building.
