import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useExpense } from "@/contexts/ExpenseContext";
import { ArrowUpCircle, ArrowDownCircle, CheckCircle } from "lucide-react";

export function BalanceSummary() {
  const { getBalances } = useExpense();
  const balances = getBalances();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {balances.map(balance => {
            const isPositive = balance.balance > 0.01;
            const isNegative = balance.balance < -0.01;
            const isSettled = !isPositive && !isNegative;

            return (
              <div
                key={balance.memberId}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  {isSettled && <CheckCircle className="h-5 w-5 text-muted-foreground" />}
                  {isPositive && <ArrowUpCircle className="h-5 w-5 text-success" />}
                  {isNegative && <ArrowDownCircle className="h-5 w-5 text-destructive" />}
                  <span className="font-medium">{balance.memberName}</span>
                </div>
                <div className="text-right">
                  {isSettled ? (
                    <Badge variant="outline" className="bg-muted">
                      Settled
                    </Badge>
                  ) : isPositive ? (
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-success">
                        ${balance.balance.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">gets back</div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-destructive">
                        ${Math.abs(balance.balance).toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">owes</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
