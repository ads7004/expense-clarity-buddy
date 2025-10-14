import { Button } from "@/components/ui/button";
import { useExpense } from "@/contexts/ExpenseContext";
import { ExpenseForm } from "@/components/ExpenseForm";
import { BalanceSummary } from "@/components/BalanceSummary";
import { SettlementSuggestions } from "@/components/SettlementSuggestions";
import { ExpenseList } from "@/components/ExpenseList";
import { Users, LogOut } from "lucide-react";

export default function Dashboard() {
  const { group, clearGroup } = useExpense();

  if (!group) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Users className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{group.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {group.members.length} members • {group.expenses.length} expenses
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={clearGroup} className="gap-2">
              <LogOut className="h-4 w-4" />
              Leave Group
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <ExpenseForm />
            <ExpenseList />
          </div>
          <div className="space-y-6">
            <BalanceSummary />
            <SettlementSuggestions />
          </div>
        </div>
      </main>
    </div>
  );
}
