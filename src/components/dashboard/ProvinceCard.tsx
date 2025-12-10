import { ProvinceData } from "@/data/provinceData";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { MapPin, Target, CheckCircle, AlertCircle } from "lucide-react";

interface ProvinceCardProps {
  data: ProvinceData;
  onClick?: () => void;
  isSelected?: boolean;
  delay?: number;
}

export function ProvinceCard({ data, onClick, isSelected, delay = 0 }: ProvinceCardProps) {
  const { grandTotal } = data;
  const progressPercentage = Math.round(
    (grandTotal.overallTotalValidated / grandTotal.target) * 100
  );
  const isOnTrack = grandTotal.variance <= grandTotal.target * 0.2;

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all duration-300 cursor-pointer hover:shadow-lg animate-slide-up",
        isSelected && "ring-2 ring-primary shadow-glow",
        "hover:border-primary/50"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">{data.name}</h3>
            <p className="text-xs text-muted-foreground">
              {data.municipalities.length} municipalities
            </p>
          </div>
        </div>
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
            isOnTrack
              ? "bg-success/10 text-success"
              : "bg-warning/10 text-warning"
          )}
        >
          {isOnTrack ? (
            <CheckCircle className="h-3 w-3" />
          ) : (
            <AlertCircle className="h-3 w-3" />
          )}
          {isOnTrack ? "On Track" : "Behind"}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <Target className="h-4 w-4" />
            Progress
          </span>
          <span className="font-semibold text-foreground">{progressPercentage}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Target</p>
            <p className="text-lg font-bold text-foreground">
              {grandTotal.target.toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Validated</p>
            <p className="text-lg font-bold text-primary">
              {grandTotal.overallTotalValidated.toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">1st Batch</p>
            <p className="text-sm font-medium text-foreground">
              {grandTotal.totalValidated1stBatch.toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Buffer</p>
            <p className="text-sm font-medium text-foreground">
              {grandTotal.totalValidatedBuffer.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
