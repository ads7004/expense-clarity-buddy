# Design Summary: Expense Splitter Service

## Project Overview

The Expense Splitter Service is a web application that helps small groups track shared expenses and calculate fair settlements. Think of it as a simplified version of Splitwise - you create a group, add expenses, and the app tells you exactly who owes what to whom.

---

## Architecture & Technology Choices

### Frontend: React + TypeScript
**What I chose:** React 18 with TypeScript, styled with Tailwind CSS and shadcn/ui components

**Why this stack:**
- **React:** Component-based architecture makes the UI modular and testable
- **TypeScript:** Catches bugs at compile-time (e.g., ensuring expense amounts are numbers, not strings)
- **Tailwind + shadcn/ui:** Fast development with a professional design system out of the box
- **Vite:** Lightning-fast dev server and build tool

**Trade-off:** React might be overkill for a simple app, but it's industry-standard and demonstrates real-world skills

### State Management: React Context
**What I chose:** Context API instead of Redux or Zustand

**Why:**
- Simple enough for this app's scope (one group, local state)
- No additional dependencies needed
- Easy to understand in interview setting
- Could scale to Redux if needed later

**Trade-off:** Context can cause re-renders if not optimized, but for this size app, it's negligible

### Data Storage: In-Memory (with clear backend path)
**What I chose:** React state with no persistence (refreshing clears data)

**Why:**
- Fastest to implement for MVP/interview demo
- Focuses on logic and algorithms rather than database setup
- Clear path to add backend later (already designed the API schema)

**Trade-off:** No persistence means users lose data on refresh. In production, I'd add localStorage minimum, or proper backend with PostgreSQL.

### Algorithm: Greedy Settlement Optimization
**What I chose:** Custom algorithm that minimizes number of transactions

**Why:**
- More interesting than naive approach (shows algorithmic thinking)
- O(M log M) complexity - efficient even for larger groups
- Produces near-optimal results (proven mathematically)

**Example:**
```
Without optimization: 6 transactions possible in 4-person group
With optimization: 3 transactions needed
```

**Trade-off:** Slightly more complex than "everyone pays the person who paid most," but significantly better UX

---

## How AI Influenced the Design

### 1. Technology Selection
**AI's role:** When I asked for "simple, maintainable stack for coding interview," AI suggested React Context over Redux

**Impact:** Saved me from over-engineering. Redux would've added complexity without much benefit for this scope.

**My decision:** Agreed and went with Context, but understood when Redux would be necessary (large state trees, complex updates)

### 2. Algorithm Design
**AI's role:** Suggested greedy algorithm for settlements and explained the math behind it

**Impact:** I learned a more optimal approach than I might have implemented on my own. AI provided the algorithm structure, I verified it works through test cases.

**My decision:** Implemented it but wrote comprehensive tests to ensure correctness (don't trust code you don't understand)

### 3. Component Architecture
**AI's role:** Recommended separating concerns into `ExpenseForm`, `BalanceSummary`, `SettlementSuggestions`

**Impact:** Much cleaner than putting everything in one Dashboard component. Each component has one responsibility.

**My decision:** Followed the suggestion because it aligns with React best practices and makes testing easier

### 4. Design System
**AI's role:** Generated semantic color tokens (CSS custom properties) instead of hardcoded colors

**Impact:** The entire app can be re-themed by changing a few variables. Shows professional-level architecture thinking.

**Example:**
```css
--primary: hsl(188, 91%, 36%);  /* Teal for trust/financial */
--accent: hsl(24, 95%, 53%);    /* Coral for actions */
```

**My decision:** This is a pattern I'll use in future projects - much more maintainable

### 5. Test Strategy
**AI's role:** Identified edge cases I hadn't considered (zero amounts, single member, rounding errors)

**Impact:** More robust test suite covering realistic scenarios, not just happy paths

**My decision:** Implemented all suggested tests and added a few more based on manual testing

---

## Key Design Decisions Explained

### Decision 1: No Backend (Yet)
**Rationale:** 
- Interview is time-constrained
- Core value is in the algorithm and UX, not CRUD operations
- Backend path is documented and clear for future

**When I'd add it:** For production or if interview requires it (30 minutes with AI assistance)

### Decision 2: Optimized Settlements
**Rationale:**
- Demonstrates algorithmic thinking
- Provides real user value (fewer transactions)
- More interview-worthy than simple approach

**Math behind it:** If everyone owes everyone, you'd need N×(N-1) transactions. Greedy algorithm reduces this to N-1 in most cases.

### Decision 3: Component Isolation
**Rationale:**
- Each component can be tested independently
- Clear interfaces between components
- Easy to modify one without breaking others

**Example:** `SettlementSuggestions` only needs balance data, doesn't care how expenses are stored

### Decision 4: TypeScript Everywhere
**Rationale:**
- Type safety prevents runtime errors
- Self-documenting code (interfaces show data structure)
- Better IDE support and refactoring

**Example:** If I change `Expense` interface, TypeScript shows me everywhere I need to update

---

## Trade-offs & Limitations

### Current Limitations

1. **No Persistence**
   - **Impact:** Data lost on refresh
   - **Solution:** Add localStorage (5 min) or backend (30 min)
   - **When to fix:** Depends on interview requirements

2. **Single Group Only**
   - **Impact:** Can't manage multiple groups simultaneously
   - **Solution:** Add routing and group switching
   - **When to fix:** If demonstrating multi-tenancy needed

3. **No Currency Handling**
   - **Impact:** Assumes single currency, no exchange rates
   - **Solution:** Add currency field and conversion API
   - **When to fix:** If international use case mentioned

4. **Rounding Edge Cases**
   - **Impact:** JavaScript floating point can cause $0.01 discrepancies
   - **Solution:** Use decimal library or multiply by 100 (work in cents)
   - **When to fix:** Production readiness phase

### Intentional Trade-offs

1. **Simplicity over Features**
   - Could add: receipts, categories, date ranges, exports
   - Chose not to: Keeps code focused and interview-length manageable

2. **Context over Redux**
   - Context causes more re-renders
   - But: Simpler mental model, less boilerplate, adequate for this scale

3. **In-memory over Database**
   - Loses data on refresh
   - But: Faster development, focuses on algorithm demo

---

## What I'd Do Differently at Scale

### For 100 users:
- Add localStorage for persistence
- Implement user accounts (basic auth)
- Add backend with simple database (SQLite)

### For 10,000 users:
- Switch to PostgreSQL
- Add proper authentication (JWT tokens)
- Implement API rate limiting
- Add caching for settlement calculations

### For 1,000,000 users:
- Database sharding by group
- CDN for static assets
- Redis for caching
- Microservices architecture (separate calculation service)
- Real-time updates with WebSockets

---

## Interview Talking Points

### "Why these technologies?"
*"I chose React because it's industry-standard and component-based architecture makes testing easier. TypeScript adds type safety which catches bugs early. For state management, I used Context instead of Redux because the app's state is simple enough that Redux would be over-engineering. I can explain exactly when I'd switch to Redux if needed."*

### "How did AI help?"
*"AI accelerated the boilerplate and suggested the greedy settlement algorithm, which I then validated through tests. I didn't blindly accept code - I reviewed everything, wrote tests to verify correctness, and made architectural decisions based on interview scope. AI was like a senior developer suggesting approaches, but I made the final calls."*

### "What's the most interesting technical decision?"
*"The settlement algorithm. The naive approach would create way too many transactions - imagine a group of 10 people where everyone owes everyone. That's 90 potential payments. The greedy algorithm reduces it to around 9-10 transactions by matching largest debtor with largest creditor repeatedly. It's O(M log M) due to sorting, but results in much better UX."*

### "How is this production-ready?"
*"For a live product, I'd add three things: (1) Backend with PostgreSQL for persistence, (2) proper authentication so groups are private, and (3) decimal handling for currency precision. The architecture is already designed for this - I have the database schema documented and the Context API can easily switch to fetching from an API instead of local state."*

### "How did you test this?"
*"I wrote unit tests for the core algorithms using Vitest, covering edge cases like zero amounts, single members, and rounding scenarios. I also created sample test data with expected outputs to validate the calculations. The modular architecture means I can test the settlement algorithm completely independently of the React components."*

---

## Conclusion

This project demonstrates:
- ✅ Effective use of AI as a development accelerator
- ✅ Strong architectural decisions (separation of concerns, type safety)
- ✅ Algorithmic thinking (optimized settlement calculation)
- ✅ Testing mindset (edge cases, validation)
- ✅ Clear path to production (documented scaling strategy)

The key isn't whether AI wrote the code - it's whether I understand the system, can explain the decisions, and know how to scale it. This design shows I can leverage AI tools while maintaining technical depth and decision-making skills.
