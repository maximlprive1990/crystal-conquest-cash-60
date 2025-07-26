import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatNumber } from '@/lib/utils';

interface StatsPanelProps {
  experience: number;
  diamonds: number;
  employees: {
    sawmill: number;
    mine: number;
    metallurgy: number;
  };
}

export function StatsPanel({ experience, diamonds, employees }: StatsPanelProps) {
  const totalEmployees = employees.sawmill + employees.mine + employees.metallurgy;
  const experienceMultiplier = (1 + (experience * 0.01)).toFixed(2);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 Statistiques
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gradient-to-r from-diamond to-diamond-glow rounded-lg">
            <div className="text-sm text-white/80">Diamants</div>
            <div className="text-xl font-bold text-white">
              {formatNumber(diamonds)} 💎
            </div>
          </div>
          
          <div className="text-center p-3 bg-gradient-to-r from-primary to-primary/80 rounded-lg">
            <div className="text-sm text-white/80">Expérience</div>
            <div className="text-xl font-bold text-white">
              {formatNumber(experience)} XP
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Multiplicateur XP:</span>
            <Badge variant="outline">×{experienceMultiplier}</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Employés totaux:</span>
            <Badge variant="secondary">{totalEmployees}</Badge>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Répartition des employés:</div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1">
                🪵 Scierie
              </span>
              <span>{employees.sawmill} employés</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1">
                ⛏️ Mine
              </span>
              <span>{employees.mine} employés</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1">
                🏭 Métallurgie
              </span>
              <span>{employees.metallurgy} employés</span>
            </div>
          </div>
        </div>

        {totalEmployees > 0 && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-xs text-muted-foreground text-center">
              Production automatique active!
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}