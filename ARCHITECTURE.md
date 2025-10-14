# Expense Splitter Service - Architecture Documentation

## System Overview

The Expense Splitter Service is a full-stack web application designed for small groups to track shared expenses and calculate fair settlements. Built with modern web technologies, it emphasizes maintainability, testability, and user experience.

---

## Technology Stack

### Frontend
- **React 18.3** - Component-based UI framework
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first styling framework
- **shadcn/ui** - High-quality, accessible component library
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching (ready for backend integration)

### State Management
- **React Context API** - Global state for expense data
- **React Hooks** - Local component state

### Testing
- **Vitest** - Unit and integration testing framework
- **Testing Library** - Component testing utilities
- **TypeScript** - Compile-time type checking

### Future Backend Options
- **Node.js + Express** - RESTful API server
- **Supabase/Firebase** - Backend-as-a-Service
- **SQLite/PostgreSQL** - Relational database for persistence
- **MongoDB** - Document database alternative

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                        │
│                       (React + TypeScript)                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │  GroupSetup │  │  Dashboard │  │  NotFound  │           │
│  │   (Page)    │  │   (Page)   │  │   (Page)   │           │
│  └─────┬──────┘  └──────┬─────┘  └────────────┘           │
│        │                 │                                   │
│        └────────┬────────┘                                  │
│                 │                                           │
│  ┌──────────────▼──────────────────────────────┐          │
│  │       ExpenseContext (Global State)         │          │
│  │  - Group data                                │          │
│  │  - Members                                   │          │
│  │  - Expenses                                  │          │
│  │  - Operations (add, calculate, etc)         │          │
│  └──────────────┬──────────────────────────────┘          │
│                 │                                           │
│  ┌──────────────▼──────────────┐                          │
│  │      UI Components           │                          │
│  │  - ExpenseForm               │                          │
│  │  - BalanceSummary            │                          │
│  │  - SettlementSuggestions     │                          │
│  │  - ExpenseList               │                          │
│  └──────────────┬───────────────┘                          │
│                 │                                           │
├─────────────────┼───────────────────────────────────────────┤
│                 │         BUSINESS LOGIC LAYER             │
├─────────────────▼───────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────┐        │
│  │     Settlement Algorithm (TypeScript)          │        │
│  │  - calculateBalances()                         │        │
│  │  - calculateSettlements()                      │        │
│  │  - Greedy optimization algorithm               │        │
│  └────────────────────────────────────────────────┘        │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                        DATA LAYER                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────┐        │
│  │         TypeScript Interfaces                  │        │
│  │  - ExpenseGroup                                │        │
│  │  - Expense                                     │        │
│  │  - Member                                      │        │
│  │  - Balance                                     │        │
│  │  - Settlement                                  │        │
│  └────────────────────────────────────────────────┘        │
│                                                              │
│  Current: In-Memory State (React Context)                   │
│  Future:  localStorage / Backend API / Database             │
│                                                              │
└──────────────────────────────────────────────────────────────┘

        ┌─────────────────────────────────────┐
        │  OPTIONAL BACKEND (Future)          │
        ├─────────────────────────────────────┤
        │                                     │
        │  ┌──────────────┐                  │
        │  │  REST API    │                  │
        │  │  (Express)   │                  │
        │  └──────┬───────┘                  │
        │         │                          │
        │  ┌──────▼──────────┐              │
        │  │   Database      │              │
        │  │  - Groups       │              │
        │  │  - Members      │              │
        │  │  - Expenses     │              │
        │  │  (SQLite/Mongo) │              │
        │  └─────────────────┘              │
        │                                    │
        └────────────────────────────────────┘
```

---

## Data Flow

### 1. Group Creation Flow
```
User Input (GroupSetup)
    ↓
Form Validation
    ↓
ExpenseContext.createGroup()
    ↓
Create Member objects with unique IDs
    ↓
Store in Context State
    ↓
Navigate to Dashboard
```

### 2. Add Expense Flow
```
User Input (ExpenseForm)
    ↓
Form Validation
    ↓
ExpenseContext.addExpense()
    ↓
Generate expense with unique ID
    ↓
Add to expenses array
    ↓
Trigger re-render of dependent components
    ↓
BalanceSummary recalculates
    ↓
SettlementSuggestions update
```

### 3. Balance Calculation Flow
```
User adds/views expenses
    ↓
Component calls getBalances()
    ↓
ExpenseContext.getBalances()
    ↓
calculateBalances(members, expenses)
    ↓
For each expense:
  - Credit payer
  - Debit each participant
    ↓
Return Balance[] array
    ↓
Render in BalanceSummary component
```

### 4. Settlement Calculation Flow
```
Component calls getSettlements()
    ↓
ExpenseContext.getSettlements()
    ↓
First: calculateBalances()
    ↓
Then: calculateSettlements(balances)
    ↓
Greedy algorithm:
  1. Sort debtors (negative) and creditors (positive)
  2. Match largest debtor with largest creditor
  3. Create settlement for min(debt, credit)
  4. Update balances
  5. Repeat until all balanced
    ↓
Return Settlement[] array
    ↓
Render in SettlementSuggestions component
```

---

## Core Algorithms

### Balance Calculation Algorithm

**Purpose:** Calculate each member's net balance based on all expenses.

**Approach:**
1. Initialize all member balances to 0
2. For each expense:
   - Add full amount to payer's balance (credit)
   - Divide amount by number of participants
   - Subtract share from each participant's balance (debit)
3. Return balance array with positive (owed to them) and negative (they owe) values

**Complexity:** O(E × P) where E = expenses, P = avg participants per expense

**Example:**
```
Expense: $100 paid by Alice, split among Alice, Bob, Carol
- Alice: +$100 (paid) - $33.33 (share) = +$66.67
- Bob:   +$0 (paid) - $33.33 (share) = -$33.33
- Carol: +$0 (paid) - $33.33 (share) = -$33.33
```

### Settlement Algorithm (Greedy Approach)

**Purpose:** Minimize number of transactions to settle all balances.

**Approach:**
1. Separate members into debtors (negative balance) and creditors (positive balance)
2. Sort debtors ascending (most negative first)
3. Sort creditors descending (most positive first)
4. While both lists have members:
   - Match top debtor with top creditor
   - Create settlement for min(|debt|, credit)
   - Update both balances
   - Remove if balance reaches zero
5. Return list of settlements

**Complexity:** O(M log M) where M = number of members (due to sorting)

**Optimality:** Produces near-optimal solution (proven to minimize transactions in most cases)

**Example:**
```
Balances: Alice: +$66.67, Bob: -$33.33, Carol: -$33.33

Step 1: Sort
  Debtors: [Bob: -$33.33, Carol: -$33.33]
  Creditors: [Alice: +$66.67]

Step 2: Match Bob with Alice
  Settlement: Bob → Alice: $33.33
  New balances: Alice: +$33.34, Bob: $0, Carol: -$33.33

Step 3: Match Carol with Alice
  Settlement: Carol → Alice: $33.33
  Final balances: Alice: $0, Bob: $0, Carol: $0

Result: 2 settlements instead of potential 3+
```

---

## Component Architecture

### Presentation Components
- **GroupSetup** - Initial group creation form
- **Dashboard** - Main app interface with header
- **ExpenseForm** - Form to add new expenses
- **ExpenseList** - List of all expenses with details
- **BalanceSummary** - Current balance for each member
- **SettlementSuggestions** - Optimal payment suggestions

### Container Components
- **Index** - Route between GroupSetup and Dashboard
- **App** - Root component with providers

### Context Providers
- **ExpenseProvider** - Global state management for all expense data

---

## Type System

### Core Types
```typescript
interface Member {
  id: string;
  name: string;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  date: Date;
}

interface Balance {
  memberId: string;
  memberName: string;
  balance: number;
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

interface ExpenseGroup {
  id: string;
  name: string;
  members: Member[];
  expenses: Expense[];
}
```

---

## Design System

### Color Palette (HSL)
- **Primary:** `hsl(188, 91%, 36%)` - Teal (trust, financial)
- **Accent:** `hsl(24, 95%, 53%)` - Coral (settlements, CTAs)
- **Success:** `hsl(142, 71%, 45%)` - Green (positive balances)
- **Destructive:** `hsl(0, 84%, 60%)` - Red (amounts owed)

### Typography
- System font stack for optimal performance
- Font weights: 400 (normal), 600 (semibold), 700 (bold)

### Spacing & Layout
- Consistent spacing scale (0.5rem increments)
- Responsive grid system (1-2 columns)
- Card-based UI pattern

---

## API Design (Future Backend Integration)

### Proposed REST Endpoints

```
POST   /api/groups
GET    /api/groups/:id
PUT    /api/groups/:id
DELETE /api/groups/:id

POST   /api/groups/:id/members
DELETE /api/groups/:id/members/:memberId

POST   /api/groups/:id/expenses
GET    /api/groups/:id/expenses
PUT    /api/expenses/:id
DELETE /api/expenses/:id

GET    /api/groups/:id/balances
GET    /api/groups/:id/settlements
```

### Database Schema (Proposed)

```sql
-- Groups table
CREATE TABLE groups (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Members table
CREATE TABLE members (
  id UUID PRIMARY KEY,
  group_id UUID REFERENCES groups(id),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Expenses table
CREATE TABLE expenses (
  id UUID PRIMARY KEY,
  group_id UUID REFERENCES groups(id),
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  paid_by UUID REFERENCES members(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Expense participants (many-to-many)
CREATE TABLE expense_participants (
  expense_id UUID REFERENCES expenses(id),
  member_id UUID REFERENCES members(id),
  PRIMARY KEY (expense_id, member_id)
);
```

---

## Testing Strategy

### Unit Tests
- Settlement algorithm correctness
- Balance calculation accuracy
- Edge cases (zero amounts, single member, etc.)
- Type validation

### Integration Tests
- Complete user flows
- Context state management
- Component interactions

### E2E Tests (Future)
- Full application workflows
- Cross-browser compatibility
- Performance benchmarks

---

## Security Considerations (Future)

- **Input Validation:** All user inputs validated on client and server
- **Authentication:** User accounts and group access control
- **Authorization:** Members can only access their groups
- **Data Privacy:** Encrypted storage for sensitive financial data
- **Rate Limiting:** Prevent abuse of API endpoints
- **SQL Injection:** Parameterized queries for database access

---

## Performance Optimization

### Current Optimizations
- React Context prevents unnecessary re-renders
- Memoized calculations where appropriate
- Efficient greedy algorithm for settlements

### Future Optimizations
- Virtual scrolling for large expense lists
- Debounced form inputs
- Code splitting for faster initial load
- Service worker for offline capability
- Database indexing on frequently queried fields

---

## Scalability Considerations

### Current Limitations
- In-memory storage (lost on refresh)
- Single group per session
- No persistence

### Scaling Strategies
1. **Add Backend:** Express + PostgreSQL for multi-user support
2. **Caching:** Redis for frequently accessed calculations
3. **CDN:** Static assets served from edge locations
4. **Database Sharding:** Partition by group for horizontal scaling
5. **Microservices:** Separate calculation service if needed

---

## Deployment Architecture

### Current (Frontend Only)
```
Developer
    ↓
Git Push
    ↓
Lovable Platform
    ↓
Vite Build
    ↓
Static Files
    ↓
CDN / Hosting (Netlify, Vercel, etc.)
    ↓
Users
```

### Future (Full Stack)
```
Frontend                    Backend
    ↓                          ↓
Static Host               API Server (AWS, Heroku)
    ↓                          ↓
CDN                       Database (RDS, MongoDB Atlas)
    ↓                          ↓
    └────────Users─────────────┘
```

---

## Development Workflow

1. **Local Development:** `npm run dev` (Vite dev server)
2. **Testing:** `npm test` (Vitest)
3. **Linting:** `npm run lint` (ESLint)
4. **Build:** `npm run build` (Production bundle)
5. **Preview:** `npm run preview` (Test production build)

---

## Monitoring & Observability (Future)

- **Error Tracking:** Sentry or similar
- **Analytics:** User behavior tracking
- **Performance Monitoring:** Core Web Vitals
- **Logging:** Structured logs for debugging
- **Alerting:** Notifications for critical issues

---

## Conclusion

This architecture balances simplicity with scalability. The current implementation provides a fully functional MVP with clean code structure, comprehensive testing, and clear paths for future enhancements including backend integration, multi-user support, and persistence.

The modular design allows for incremental improvements without major refactoring, making it ideal for both interview demonstrations and real-world deployment.
