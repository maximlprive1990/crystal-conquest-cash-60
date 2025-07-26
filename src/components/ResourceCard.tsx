import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatNumber } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface ResourceCardProps {
  type: 'wood' | 'metal' | 'gold' | 'stone';
  amount: number;
  onCollect: (amount: number) => void;
  icon: string;
  label: string;
  baseAmount: number;
  lastCollectTime: number;
}

const resourceGradients = {
  wood: 'bg-gradient-to-br from-wood to-wood-glow',
  metal: 'bg-gradient-to-br from-metal to-metal-glow',
  gold: 'bg-gradient-to-br from-gold to-gold-glow',
  stone: 'bg-gradient-to-br from-stone to-stone-glow',
};

export function ResourceCard({ type, amount, onCollect, icon, label, baseAmount, lastCollectTime }: ResourceCardProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const cooldownTime = 300000; // 5 minutes

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const timeSinceLastCollect = currentTime - lastCollectTime;
      // Si c'est la première fois (lastCollectTime === 0), pas de cooldown
      const remaining = lastCollectTime === 0 ? 0 : Math.max(0, cooldownTime - timeSinceLastCollect);
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastCollectTime]);

  const canCollect = timeLeft === 0;
  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg">
      <div className={`absolute inset-0 opacity-10 ${resourceGradients[type]}`} />
      <CardHeader className="relative pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-2xl">{icon}</span>
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-foreground">
            {formatNumber(amount)}
          </div>
        </div>
        <Button 
          onClick={() => onCollect(baseAmount)}
          disabled={!canCollect}
          className={`w-full ${resourceGradients[type]} text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300`}
          size="lg"
        >
          {canCollect 
            ? `Collecter +${baseAmount}` 
            : `Cooldown ${minutes}:${seconds.toString().padStart(2, '0')}`
          }
        </Button>
      </CardContent>
    </Card>
  );
}