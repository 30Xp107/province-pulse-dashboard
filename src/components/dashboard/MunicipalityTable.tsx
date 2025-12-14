import { ProvinceData } from "@/data/provinceData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface MunicipalityTableProps {
  data: ProvinceData;
}

export function MunicipalityTable({ data }: MunicipalityTableProps) {
  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden animate-fade-in">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-foreground">        
          {data.name === "All Provinces" ? "Province" : data.name +" - Municipality"} Breakdown
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Target vs System Result by municipality
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">{data.name === "All Provinces" ? "Province" : "Municipality"}</TableHead>
              <TableHead className="text-right font-semibold">Target</TableHead>
              <TableHead className="text-right font-semibold">System Result</TableHead>
              <TableHead className="text-right font-semibold">System Variance</TableHead>
              <TableHead className="w-[200px] font-semibold">Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.municipalities.map((municipality) => {
              const progress = Math.min(
                Math.round((municipality.systemResult / municipality.target) * 100),
                100
              );
              const isComplete = municipality.systemVariance <= 0;

              return (
                <TableRow
                  key={municipality.municipality}
                  className="transition-colors hover:bg-muted/50"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {municipality.municipality}
                      {isComplete && (
                        <Badge variant="secondary" className="bg-success/10 text-success text-xs">
                          Complete
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium">
                    {municipality.target.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-semibold text-primary">
                    {municipality.systemResult.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        "tabular-nums font-medium",
                        municipality.systemVariance <= 0
                          ? "text-success"
                          : municipality.systemVariance > municipality.target * 0.3
                          ? "text-destructive"
                          : "text-warning"
                      )}
                    >
                      {municipality.systemVariance.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={progress} className="h-2 flex-1" />
                      <span className="text-xs font-medium text-muted-foreground w-12 text-right">
                        {progress}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow className="bg-primary/5 font-bold border-t-2 border-primary/30">
              <TableCell className="font-bold text-foreground">Grand Total</TableCell>
              <TableCell className="text-right tabular-nums font-bold">
                {data.grandTotal.target.toLocaleString()}
              </TableCell>
              <TableCell className="text-right tabular-nums font-bold text-primary">
                {data.grandTotal.systemResult.toLocaleString()}
              </TableCell>
              <TableCell className="text-right font-bold">
                <span
                  className={cn(
                    "tabular-nums",
                    data.grandTotal.systemVariance <= 0 ? "text-success" : "text-warning"
                  )}
                >
                  {data.grandTotal.systemVariance.toLocaleString()}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress
                    value={Math.min(
                      Math.round(
                        (data.grandTotal.systemResult / data.grandTotal.target) * 100
                      ),
                      100
                    )}
                    className="h-2 flex-1"
                  />
                  <span className="text-xs font-medium w-12 text-right">
                    {Math.round(
                      (data.grandTotal.systemResult / data.grandTotal.target) * 100
                    )}%
                  </span>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
