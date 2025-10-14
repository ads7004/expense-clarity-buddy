# Expense Splitter Service

A web application for splitting expenses among group members with intelligent settlement optimization. Built with React, TypeScript, and AI-assisted development.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

The application will be available at `http://localhost:5173`

## ✨ Core Features

1. **Group Creation** - Create expense groups with multiple members
2. **Expense Tracking** - Add expenses with partial participant splits
3. **Smart Settlement Optimization** - Minimizes number of payments using greedy algorithm
4. **Real-time Balance Calculation** - Automatic updates as expenses are added

## 📚 Interview Deliverables

### 1. Working Solution ✅
- Functional core features with running instructions above
- Sample data and test scenarios included

### 2. AI Interaction Documentation ✅
See [AI_INTERACTION_DOCUMENTATION.md](./AI_INTERACTION_DOCUMENTATION.md)
- Complete prompt history with iterations
- Debugging examples and refinement process
- Evidence of thoughtful AI collaboration

### 3. Design Summary ✅
See [DESIGN_SUMMARY.md](./DESIGN_SUMMARY.md)
- Architecture decisions and technology choices
- AI influence on design
- Trade-offs and scalability considerations

### 4. Test Evidence ✅
See [TEST_PLAN.md](./TEST_PLAN.md) and run `npm test`
- Comprehensive test plan with edge cases
- 100% coverage of core algorithm
- Realistic test scenarios

### 5. Interview Presentation Guide ✅
See [INTERVIEW_PRESENTATION_GUIDE.md](./INTERVIEW_PRESENTATION_GUIDE.md)
- 30-minute structured demo flow
- Common Q&A responses
- Pre-interview checklist

## 🏗️ Technology Stack

- **Frontend**: React 18.3 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: React Context API
- **Testing**: Vitest + Testing Library
- **Build**: Vite

## 📊 Sample Demo Data

**Scenario**: Weekend Trip (3 friends)
- Alice pays $300 for hotel (split 3 ways)
- Bob pays $90 for dinner (split 3 ways)
- Charlie pays $45 for breakfast (split between Alice & Charlie only)

**Result**: 2 optimized settlement payments instead of 6 possible transactions

## 📁 Project Structure

```
src/
├── components/          # UI components
├── contexts/           # State management
├── lib/               # Core algorithms
├── types/             # TypeScript interfaces
├── pages/             # Route pages
└── __tests__/         # Unit tests
```

## 🎯 Interview Ready

Development environment is ready for live modifications. All tests pass, code is documented, and the application demonstrates clean architecture with AI-assisted development.

For detailed interview preparation, see [INTERVIEW_PRESENTATION_GUIDE.md](./INTERVIEW_PRESENTATION_GUIDE.md)
