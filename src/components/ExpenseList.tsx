import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useExpense } from "@/contexts/ExpenseContext";
import { formatDistanceToNow } from "date-fns";
import { formatCurrency } from "@/lib/currencyUtils";

export function ExpenseList() {
  const { group } = useExpense();

  if (!group || group.expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No expenses yet. Add your first expense to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  const getMemberName = (memberId: string) => {
    return group.members.find(m => m.id === memberId)?.name || "Unknown";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[...group.expenses].reverse().map(expense => (
            <div
              key={expense.id}
              className="flex flex-col gap-2 p-4 rounded-lg border bg-card"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="font-semibold text-foreground">
                    {expense.description}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Paid by {getMemberName(expense.paidBy)} •{" "}
                    {formatDistanceToNow(expense.date, { addSuffix: true })}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-primary">
                    {formatCurrency(expense.amount, group.currency)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatCurrency(expense.amount / expense.splitBetween.length, group.currency)} each
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {expense.splitBetween.map(memberId => (
                  <Badge key={memberId} variant="secondary" className="text-xs">
                    {getMemberName(memberId)}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
