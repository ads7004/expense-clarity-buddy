import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { useExpense } from "@/contexts/ExpenseContext";
import { toast } from "sonner";

export function GroupSetup() {
  const { createGroup } = useExpense();
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState<string[]>(["", ""]);

  const addMember = () => {
    setMembers([...members, ""]);
  };

  const removeMember = (index: number) => {
    if (members.length > 2) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const updateMember = (index: number, value: string) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validMembers = members.filter(m => m.trim() !== "");
    
    if (!groupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }
    
    if (validMembers.length < 2) {
      toast.error("Please add at least 2 members");
      return;
    }

    createGroup(groupName, validMembers);
    toast.success("Group created successfully!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold">Create Expense Group</CardTitle>
          <CardDescription className="text-base">
            Set up your group to start tracking shared expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="group-name" className="text-base font-semibold">
                Group Name
              </Label>
              <Input
                id="group-name"
                placeholder="e.g., Roommates, Trip to Paris..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="text-base"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Members</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addMember}
                  className="gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Member
                </Button>
              </div>
              
              <div className="space-y-2">
                {members.map((member, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Member ${index + 1} name`}
                      value={member}
                      onChange={(e) => updateMember(index, e.target.value)}
                    />
                    {members.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMember(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Create Group
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
