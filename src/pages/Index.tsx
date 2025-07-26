import { useGameState, EMPLOYEE_COSTS } from '@/hooks/useGameState';
import { ResourceCard } from '@/components/ResourceCard';
import { BuildingCard } from '@/components/BuildingCard';
import { ExchangePanel } from '@/components/ExchangePanel';
import { CryptoMarket } from '@/components/CryptoMarket';
import { StatsPanel } from '@/components/StatsPanel';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const Index = () => {
  const {
    gameState,
    collectResource,
    exchangeForCash,
    buyCrypto,
    upgradeBuilding,
    hireEmployee,
    resetGame,
  } = useGameState();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ⛏️ Empire Minier
              </h1>
              <p className="text-muted-foreground">Collectez, construisez, échangez et prospérez!</p>
            </div>
            <Button onClick={resetGame} variant="destructive" size="sm">
              Réinitialiser
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="resources" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="resources">🪵 Ressources</TabsTrigger>
            <TabsTrigger value="buildings">🏗️ Bâtiments</TabsTrigger>
            <TabsTrigger value="market">💰 Marché</TabsTrigger>
            <TabsTrigger value="crypto">🚀 Crypto</TabsTrigger>
          </TabsList>

          {/* Panel de stats toujours visible */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <TabsContent value="resources" className="mt-0">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>🪵 Collection de Ressources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                         <ResourceCard
                           type="wood"
                           amount={gameState.resources.wood}
                           onCollect={(amount) => collectResource('wood', amount)}
                           icon="🪵"
                           label="Bois"
                           baseAmount={50}
                           lastCollectTime={gameState.lastCollectTime}
                         />
                         <ResourceCard
                           type="metal"
                           amount={gameState.resources.metal}
                           onCollect={(amount) => collectResource('metal', amount)}
                           icon="⚙️"
                           label="Métal"
                           baseAmount={25}
                           lastCollectTime={gameState.lastCollectTime}
                         />
                         <ResourceCard
                           type="gold"
                           amount={gameState.resources.gold}
                           onCollect={(amount) => collectResource('gold', amount)}
                           icon="🥇"
                           label="Or"
                           baseAmount={10}
                           lastCollectTime={gameState.lastCollectTime}
                         />
                         <ResourceCard
                           type="stone"
                           amount={gameState.resources.stone}
                           onCollect={(amount) => collectResource('stone', amount)}
                           icon="🗿"
                           label="Roche"
                           baseAmount={40}
                           lastCollectTime={gameState.lastCollectTime}
                         />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="buildings" className="mt-0">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>🏗️ Bâtiments Industriels</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <BuildingCard
                          type="sawmill"
                          level={gameState.buildings.sawmill.level}
                          multiplier={gameState.buildings.sawmill.multiplier}
                          employees={gameState.employees.sawmill}
                          diamonds={gameState.resources.diamonds}
                          onUpgrade={() => upgradeBuilding('sawmill')}
                          onHireEmployee={() => hireEmployee('sawmill')}
                          icon="🪵"
                          label="Scierie"
                          description="Produit du bois automatiquement"
                          employeeCost={EMPLOYEE_COSTS.sawmill}
                        />
                        <BuildingCard
                          type="mine"
                          level={gameState.buildings.mine.level}
                          multiplier={gameState.buildings.mine.multiplier}
                          employees={gameState.employees.mine}
                          diamonds={gameState.resources.diamonds}
                          onUpgrade={() => upgradeBuilding('mine')}
                          onHireEmployee={() => hireEmployee('mine')}
                          icon="⛏️"
                          label="Mine"
                          description="Extrait roche et or automatiquement"
                          employeeCost={EMPLOYEE_COSTS.mine}
                        />
                        <BuildingCard
                          type="metallurgy"
                          level={gameState.buildings.metallurgy.level}
                          multiplier={gameState.buildings.metallurgy.multiplier}
                          employees={gameState.employees.metallurgy}
                          diamonds={gameState.resources.diamonds}
                          onUpgrade={() => upgradeBuilding('metallurgy')}
                          onHireEmployee={() => hireEmployee('metallurgy')}
                          icon="🏭"
                          label="Métallurgie"
                          description="Raffine le métal automatiquement"
                          employeeCost={EMPLOYEE_COSTS.metallurgy}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="market" className="mt-0">
                <div className="space-y-6">
                  <ExchangePanel
                    resources={gameState.resources}
                    onExchange={exchangeForCash}
                  />
                </div>
              </TabsContent>

              <TabsContent value="crypto" className="mt-0">
                <div className="space-y-6">
                  <CryptoMarket
                    cash={gameState.resources.cash}
                    cryptoBalance={gameState.crypto.balance}
                    onBuyCrypto={buyCrypto}
                  />
                </div>
              </TabsContent>
            </div>

            {/* Panel de stats */}
            <div className="lg:col-span-1">
              <StatsPanel
                experience={gameState.experience}
                diamonds={gameState.resources.diamonds}
                employees={gameState.employees}
              />
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
