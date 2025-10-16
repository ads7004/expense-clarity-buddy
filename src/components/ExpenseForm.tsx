import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useExpense } from "@/contexts/ExpenseContext";
import { toast } from "sonner";
import { currencySymbols } from "@/lib/currencyUtils";

export function ExpenseForm() {
  const { group, addExpense } = useExpense();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitBetween, setSplitBetween] = useState<string[]>([]);

  if (!group) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!paidBy) {
      toast.error("Please select who paid");
      return;
    }

    if (splitBetween.length === 0) {
      toast.error("Please select at least one person to split between");
      return;
    }

    addExpense({
      description,
      amount: amountNum,
      paidBy,
      splitBetween
    });

    toast.success("Expense added successfully!");
    
    // Reset form
    setDescription("");
    setAmount("");
    setSplitBetween([]);
  };

  const toggleMember = (memberId: string) => {
    setSplitBetween(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g., Groceries, Dinner, Rent..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ({currencySymbols[group.currency]})</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paid-by">Paid By</Label>
            <Select value={paidBy} onValueChange={setPaidBy}>
              <SelectTrigger id="paid-by">
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                {group.members.map(member => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Split Between</Label>
            <div className="space-y-2">
              {group.members.map(member => (
                <div key={member.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`split-${member.id}`}
                    checked={splitBetween.includes(member.id)}
                    onCheckedChange={() => toggleMember(member.id)}
                  />
                  <Label
                    htmlFor={`split-${member.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {member.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">
            Add Expense
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
