import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatNumber } from '@/lib/utils';
import { EXCHANGE_RATES } from '@/hooks/useGameState';

interface ExchangePanelProps {
  resources: {
    wood: number;
    metal: number;
    gold: number;
    stone: number;
    cash: number;
  };
  onExchange: (resourceType: keyof typeof EXCHANGE_RATES) => void;
}

const resourceInfo = {
  wood: { icon: '🪵', label: 'Bois', color: 'from-wood to-wood-glow' },
  metal: { icon: '⚙️', label: 'Métal', color: 'from-metal to-metal-glow' },
  gold: { icon: '🥇', label: 'Or', color: 'from-gold to-gold-glow' },
  stone: { icon: '🗿', label: 'Roche', color: 'from-stone to-stone-glow' },
};

export function ExchangePanel({ resources, onExchange }: ExchangePanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          💰 Centre d'Échange
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Échangez vos ressources contre du cash
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-center p-4 bg-gradient-to-r from-cash to-cash-glow rounded-lg">
            <div className="text-sm text-cash-foreground/80">Cash Total</div>
            <div className="text-2xl font-bold text-white">
              {formatNumber(resources.cash)} 💵
            </div>
          </div>
          
          <div className="space-y-2">
            {Object.entries(EXCHANGE_RATES).map(([resourceType, rate]) => {
              const resource = resourceInfo[resourceType as keyof typeof resourceInfo];
              const available = resources[resourceType as keyof typeof resources];
              const canExchange = available >= rate.amount;
              
              return (
                <div key={resourceType} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{resource.icon}</span>
                    <div>
                      <div className="text-sm font-medium">{resource.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatNumber(available)} / {formatNumber(rate.amount)}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => onExchange(resourceType as keyof typeof EXCHANGE_RATES)}
                    disabled={!canExchange}
                    size="sm"
                    className={`bg-gradient-to-r ${resource.color} text-white`}
                  >
                    {formatNumber(rate.cash)} 💵
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}