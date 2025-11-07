import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ApproachSelectorProps {
  selectedApproach: 'approach1' | 'approach2';
  onApproachChange: (approach: 'approach1' | 'approach2') => void;
}

interface ApproachOption {
  id: 'approach1' | 'approach2';
  name: string;
  description: string;
  icon: string;
}

const approaches: ApproachOption[] = [
  {
    id: 'approach1',
    name: 'Approach 1',
    description: 'Classic implementation with traditional agent orchestration',
    icon: '🎯'
  },
  {
    id: 'approach2',
    name: 'Approach 2',
    description: 'Enhanced implementation with advanced agent management',
    icon: '⚡'
  }
];

export function ApproachSelector({ selectedApproach, onApproachChange }: ApproachSelectorProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-8">
      {approaches.map((approach) => (
        <Card
          key={approach.id}
          className={cn(
            "p-4 cursor-pointer transition-all hover:shadow-lg",
            selectedApproach === approach.id && "border-primary border-2"
          )}
          onClick={() => onApproachChange(approach.id)}
        >
          <div className="text-2xl mb-2">{approach.icon}</div>
          <h3 className="text-lg font-semibold mb-1">{approach.name}</h3>
          <p className="text-sm text-muted-foreground">{approach.description}</p>
        </Card>
      ))}
    </div>
  );
}