import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { formatNumber } from '@/lib/utils';
import { CRYPTO_PRICES, CASH_TO_USD } from '@/hooks/useGameState';

interface CryptoMarketProps {
  cash: number;
  cryptoBalance: number;
  onBuyCrypto: (cryptoType: keyof typeof CRYPTO_PRICES, usdAmount: number) => void;
}

export function CryptoMarket({ cash, cryptoBalance, onBuyCrypto }: CryptoMarketProps) {
  const [selectedCrypto, setSelectedCrypto] = useState<keyof typeof CRYPTO_PRICES>('bitcoin');
  const [usdAmount, setUsdAmount] = useState<string>('1');
  
  const maxUsdAffordable = cash / CASH_TO_USD;
  const numericUsdAmount = parseFloat(usdAmount) || 0;
  const cashNeeded = numericUsdAmount * CASH_TO_USD;
  const canBuy = numericUsdAmount > 0 && cash >= cashNeeded;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🚀 Marché Crypto
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Échangez votre cash contre des cryptomonnaies
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 bg-gradient-to-r from-crypto to-crypto-glow rounded-lg">
          <div className="text-sm text-white/80">Portfolio Crypto</div>
          <div className="text-2xl font-bold text-white">
            ${formatNumber(cryptoBalance)}
          </div>
          <div className="text-xs text-white/60">
            Cash disponible: {formatNumber(cash)} 💵 (${formatNumber(maxUsdAffordable)})
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Choisir une crypto:</label>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {Object.entries(CRYPTO_PRICES).map(([key, crypto]) => (
                <Button
                  key={key}
                  variant={selectedCrypto === key ? "default" : "outline"}
                  onClick={() => setSelectedCrypto(key as keyof typeof CRYPTO_PRICES)}
                  className="justify-between h-auto p-3"
                >
                  <div className="flex items-center gap-2">
                    <span>{crypto.symbol}</span>
                    <span className="text-sm">{crypto.name}</span>
                  </div>
                  <span className="text-sm font-mono">
                    ${formatNumber(crypto.price)}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Montant en USD:</label>
            <Input
              type="number"
              value={usdAmount}
              onChange={(e) => setUsdAmount(e.target.value)}
              min="0"
              max={maxUsdAffordable}
              step="0.01"
              className="mt-1"
              placeholder="Montant en USD"
            />
            <div className="text-xs text-muted-foreground mt-1">
              Coût: {formatNumber(cashNeeded)} 💵
            </div>
          </div>

          <Button
            onClick={() => onBuyCrypto(selectedCrypto, numericUsdAmount)}
            disabled={!canBuy}
            className="w-full bg-gradient-to-r from-crypto to-crypto-glow text-white font-semibold"
            size="lg"
          >
            Acheter {numericUsdAmount > 0 ? `$${usdAmount}` : ''} de {CRYPTO_PRICES[selectedCrypto].name}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}