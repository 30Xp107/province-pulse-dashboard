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
          {data.name} - Municipality Breakdown
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Detailed validation results by municipality
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Municipality</TableHead>
              <TableHead className="text-right font-semibold">Target</TableHead>
              <TableHead className="text-right font-semibold">1st Batch</TableHead>
              <TableHead className="text-right font-semibold">Buffer</TableHead>
              <TableHead className="text-right font-semibold">Total Validated</TableHead>
              <TableHead className="text-right font-semibold">Variance</TableHead>
              <TableHead className="w-[180px] font-semibold">Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.municipalities.map((municipality, index) => {
              const progress = Math.min(
                Math.round((municipality.overallTotalValidated / municipality.target) * 100),
                100
              );
              const isComplete = municipality.variance <= 0;
              const isGrandTotal = municipality.municipality === "Grand Total";

              return (
                <TableRow
                  key={municipality.municipality}
                  className={cn(
                    "transition-colors hover:bg-muted/50",
                    isGrandTotal && "bg-primary/5 font-semibold border-t-2 border-primary/20"
                  )}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {municipality.municipality}
                      {isComplete && !isGrandTotal && (
                        <Badge variant="secondary" className="bg-success/10 text-success text-xs">
                          Complete
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {municipality.target.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {municipality.totalValidated1stBatch.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {municipality.totalValidatedBuffer.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-semibold text-primary">
                    {municipality.overallTotalValidated.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        "tabular-nums font-medium",
                        municipality.variance <= 0
                          ? "text-success"
                          : municipality.variance > municipality.target * 0.3
                          ? "text-destructive"
                          : "text-warning"
                      )}
                    >
                      {municipality.variance.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={progress} className="h-2 flex-1" />
                      <span className="text-xs font-medium text-muted-foreground w-10 text-right">
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
              <TableCell className="text-right tabular-nums font-bold">
                {data.grandTotal.totalValidated1stBatch.toLocaleString()}
              </TableCell>
              <TableCell className="text-right tabular-nums font-bold">
                {data.grandTotal.totalValidatedBuffer.toLocaleString()}
              </TableCell>
              <TableCell className="text-right tabular-nums font-bold text-primary">
                {data.grandTotal.overallTotalValidated.toLocaleString()}
              </TableCell>
              <TableCell className="text-right font-bold">
                <span
                  className={cn(
                    "tabular-nums",
                    data.grandTotal.variance <= 0
                      ? "text-success"
                      : "text-warning"
                  )}
                >
                  {data.grandTotal.variance.toLocaleString()}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress
                    value={Math.min(
                      Math.round(
                        (data.grandTotal.overallTotalValidated / data.grandTotal.target) * 100
                      ),
                      100
                    )}
                    className="h-2 flex-1"
                  />
                  <span className="text-xs font-medium w-10 text-right">
                    {Math.round(
                      (data.grandTotal.overallTotalValidated / data.grandTotal.target) * 100
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
