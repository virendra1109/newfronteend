import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ApproachCardProps {
  name: string;
  description: string;
  icon: string;
  isSelected: boolean;
  onClick: () => void;
}

export function ApproachCard({ name, description, icon, isSelected, onClick }: ApproachCardProps) {
  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all hover:shadow-lg",
        isSelected && "border-primary border-2"
      )}
      onClick={onClick}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="text-lg font-semibold mb-1">{name}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  );
}