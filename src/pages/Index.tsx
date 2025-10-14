import { useExpense } from "@/contexts/ExpenseContext";
import { GroupSetup } from "@/components/GroupSetup";
import Dashboard from "./Dashboard";

const Index = () => {
  const { group } = useExpense();

  return group ? <Dashboard /> : <GroupSetup />;
};

export default Index;
