import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { ProvinceCard } from "@/components/dashboard/ProvinceCard";
import { MunicipalityTable } from "@/components/dashboard/MunicipalityTable";
import { ValidationChart } from "@/components/dashboard/ValidationChart";
import {
  provincesData,
  antiqueData,
  capizData,
  iloiloData,
} from "@/data/provinceData";
import { Target, TrendingUp, AlertTriangle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const provinceOptions = [
  { key: "provinces", label: "All Provinces", data: provincesData },
  { key: "antique", label: "Antique", data: antiqueData },
  { key: "capiz", label: "Capiz", data: capizData },
  { key: "iloilo", label: "Iloilo", data: iloiloData },
];

const Index = () => {
  const [selectedProvince, setSelectedProvince] = useState<string>("provinces");

  const currentData = provinceOptions.find((p) => p.key === selectedProvince)?.data || provincesData;
  const { grandTotal } = currentData;

  const progressPercentage = Math.round(
    (grandTotal.systemResult / grandTotal.target) * 100
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 space-y-8">
        {/* Province Selector Tabs */}
        <Tabs value={selectedProvince} onValueChange={setSelectedProvince} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            {provinceOptions.map((province) => (
              <TabsTrigger
                key={province.key}
                value={province.key}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {province.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Stats Overview - Focus on Target, System Result, System Variance */}
        <section className="grid gap-4 md:grid-cols-3">
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
        </section>

        {/* Province Cards - Only show when "All Provinces" is selected */}
        {selectedProvince === "provinces" && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Province Overview</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[antiqueData, capizData, iloiloData].map((province, index) => (
                <ProvinceCard
                  key={province.name}
                  data={province}
                  onClick={() => setSelectedProvince(province.name.toLowerCase())}
                  delay={index * 100}
                />
              ))}
            </div>
          </section>
        )}

        {/* Charts Section */}
        <section className="grid gap-6 lg:grid-cols-2">
          <ValidationChart data={currentData} type="bar" />
          <ValidationChart data={currentData} type="pie" />
        </section>

        {/* Municipality Table */}
        <section>
          <MunicipalityTable data={currentData} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-6 mt-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Scale-Up Results Dashboard • Western Visayas Region</p>
          <p className="mt-1">Data source: DSWD Regional Office VI</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
