import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useExpense } from "@/contexts/ExpenseContext";
import { ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/currencyUtils";

export function SettlementSuggestions() {
  const { getSettlements, group } = useExpense();
  const settlements = getSettlements();

  if (!group) return null;

  if (settlements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Settlement Suggestions</CardTitle>
          <CardDescription>
            All balances are settled! 🎉
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settlement Suggestions</CardTitle>
        <CardDescription>
          Settle all debts with {settlements.length} {settlements.length === 1 ? "payment" : "payments"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {settlements.map((settlement, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg border bg-card"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="font-semibold text-foreground">
                  {settlement.from}
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="font-semibold text-foreground">
                  {settlement.to}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-accent">
                  {formatCurrency(settlement.amount, group.currency)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
