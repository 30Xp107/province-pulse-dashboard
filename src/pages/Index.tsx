import { useState } from "react";
import { Target, TrendingUp, AlertTriangle, RefreshCw } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ProvinceCard } from "@/components/dashboard/ProvinceCard";
import { MunicipalityTable } from "@/components/dashboard/MunicipalityTable";
import { ValidationChart } from "@/components/dashboard/ValidationChart";
import { Header } from "@/components/dashboard/Header";
import { useGoogleSheetData, PROVINCE_SHEETS, ProvinceKey } from "@/hooks/useGoogleSheetData";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabValue = 'all' | ProvinceKey;

const Index = () => {
  const { data, loading, error, lastUpdated, refresh } = useGoogleSheetData();
  const [selectedTab, setSelectedTab] = useState<TabValue>('all');

  const currentData = selectedTab === 'all' 
    ? data?.combined 
    : data?.provinces[selectedTab];

  const grandTotal = currentData?.grandTotal || { target: 0, systemResult: 0, systemVariance: 0, municipality: '' };
  const progressPercentage = grandTotal.target > 0 
    ? Math.round((grandTotal.systemResult / grandTotal.target) * 100) 
    : 0;

  const provinceKeys = Object.keys(PROVINCE_SHEETS) as ProvinceKey[];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 space-y-8">
        {/* Province Selector Tabs */}
        <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as TabValue)} className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              All Provinces
            </TabsTrigger>
            {provinceKeys.map((key) => (
              <TabsTrigger
                key={key}
                value={key}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {PROVINCE_SHEETS[key].name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Data Status Bar */}
        <div className="flex items-center justify-between bg-card rounded-lg border p-4">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {loading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Updating...
                </span>
              ) : lastUpdated ? (
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              ) : null}
            </div>
            {error && (
              <span className="text-sm text-destructive">{error}</span>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Overview */}
        <section className="grid gap-4 md:grid-cols-3">
          {loading && !data ? (
            <>
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </>
          ) : (
            <>
              <StatCard
                title="Target"
                value={grandTotal.target}
                subtitle="Total target beneficiaries"
                icon={Target}
                variant="info"
                delay={0}
              />
              <StatCard
                title="System Result"
                value={grandTotal.systemResult}
                subtitle={`${progressPercentage}% of target achieved`}
                icon={TrendingUp}
                variant="primary"
                trend={{
                  value: progressPercentage,
                  isPositive: progressPercentage >= 50,
                }}
                delay={100}
              />
              <StatCard
                title="System Variance"
                value={grandTotal.systemVariance}
                subtitle="Remaining to achieve target"
                icon={AlertTriangle}
                variant="warning"
                delay={200}
              />
            </>
          )}
        </section>

        {/* Province Cards - Only show when "All Provinces" is selected */}
        {selectedTab === 'all' && data && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Province Overview</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {provinceKeys.map((key, index) => (
                data.provinces[key] && (
                  <ProvinceCard
                    key={key}
                    data={data.provinces[key]}
                    onClick={() => setSelectedTab(key)}
                    delay={index * 100}
                  />
                )
              ))}
            </div>
          </section>
        )}

        {/* Charts Section */}
        {currentData && (
          <section className="grid gap-6 lg:grid-cols-2">
            <ValidationChart data={currentData} type="bar" />
            <ValidationChart data={currentData} type="pie" />
          </section>
        )}

        {/* Municipality Table */}
        {currentData && (
          <section>
            <MunicipalityTable data={currentData} />
          </section>
        )}

        {/* Loading State for Table */}
        {loading && !data && (
          <section className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-96 rounded-xl" />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-6 mt-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Scale-Up Results Dashboard • Western Visayas Region</p>
          <p className="mt-1">Data refreshes automatically every 30 seconds</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
