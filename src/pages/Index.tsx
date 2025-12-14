import { Target, TrendingUp, AlertTriangle, RefreshCw } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ProvinceCard } from "@/components/dashboard/ProvinceCard";
import { MunicipalityTable } from "@/components/dashboard/MunicipalityTable";
import { ValidationChart } from "@/components/dashboard/ValidationChart";
import { Header } from "@/components/dashboard/Header";
import { useGoogleSheetData } from "@/hooks/useGoogleSheetData";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data, loading, error, lastUpdated, refresh } = useGoogleSheetData();

  const grandTotal = data?.grandTotal || { target: 0, systemResult: 0, systemVariance: 0, municipality: '' };
  const progressPercentage = grandTotal.target > 0 
    ? Math.round((grandTotal.systemResult / grandTotal.target) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 space-y-8">
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

        {/* Province Card */}
        {data && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Province Overview</h2>
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
              <ProvinceCard data={data} delay={0} />
            </div>
          </section>
        )}

        {/* Charts Section */}
        {data && (
          <section className="grid gap-6 lg:grid-cols-2">
            <ValidationChart data={data} type="bar" />
            <ValidationChart data={data} type="pie" />
          </section>
        )}

        {/* Municipality Table */}
        {data && (
          <section>
            <MunicipalityTable data={data} />
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
          <p>Scale-Up Results Dashboard • Iloilo Province</p>
          <p className="mt-1">Data refreshes automatically every 30 seconds</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
