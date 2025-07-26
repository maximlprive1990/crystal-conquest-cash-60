import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatNumber } from '@/lib/utils';

interface BuildingCardProps {
  type: 'sawmill' | 'mine' | 'metallurgy';
  level: number;
  multiplier: number;
  employees: number;
  diamonds: number;
  onUpgrade: () => void;
  onHireEmployee: () => void;
  icon: string;
  label: string;
  description: string;
  employeeCost: number;
}

const buildingGradients = {
  sawmill: 'bg-gradient-to-br from-wood to-wood-glow',
  mine: 'bg-gradient-to-br from-stone to-stone-glow',
  metallurgy: 'bg-gradient-to-br from-metal to-metal-glow',
};

export function BuildingCard({ 
  type, 
  level, 
  multiplier, 
  employees, 
  diamonds,
  onUpgrade, 
  onHireEmployee,
  icon, 
  label, 
  description,
  employeeCost
}: BuildingCardProps) {
  const upgradeCost = level * 100;
  const canUpgrade = diamonds >= upgradeCost;
  const canHire = diamonds >= employeeCost;

  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:scale-105">
      <div className={`absolute inset-0 opacity-10 ${buildingGradients[type]}`} />
      <CardHeader className="relative pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            {label}
          </div>
          <Badge variant="secondary">Niv. {level}</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="relative space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Multiplicateur:</span>
            <div className="font-semibold">×{multiplier}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Employés:</span>
            <div className="font-semibold">{employees}</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={onUpgrade}
            disabled={!canUpgrade}
            className={`w-full ${buildingGradients[type]} text-white font-semibold`}
            variant={canUpgrade ? "default" : "secondary"}
          >
            Améliorer ({formatNumber(upgradeCost)} 💎)
          </Button>
          
          <Button 
            onClick={onHireEmployee}
            disabled={!canHire}
            className="w-full"
            variant={canHire ? "default" : "secondary"}
          >
            Embaucher ({formatNumber(employeeCost)} 💎)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}