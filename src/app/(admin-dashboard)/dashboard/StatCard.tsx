import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Info, LoaderIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Trend = { direction: "up" | "down"; percent: number };

export function StatCard({
  title,
  value,
  trend,
  info,
  icon,
  iconClassName,
  loading,
}: {
  title: string;
  value: string;
  trend?: Trend;
  info: string;
  icon: React.ReactNode;
  iconClassName?: string;
  loading: boolean;
}) {
  const isUp = trend?.direction === "up";

  return (
    <Card className="rounded-2xl border border-border py-5 shadow-none">
      <CardHeader className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "rounded-sm bg-green-500 p-2 text-white",
              iconClassName,
            )}
          >
            {icon}
          </span>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>

        <Tooltip>
          <TooltipTrigger>
            <Info className="size-4 text-gray-400" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{info}</p>
          </TooltipContent>
        </Tooltip>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div className="h-9 text-2xl font-semibold tracking-tight text-slate-900">
            {loading ? <LoaderIcon className="size-6 animate-spin" /> : value}
          </div>
          {!!trend && (
            <Badge
              variant="secondary"
              className={cn(
                "rounded-sm px-2.5 py-1 text-xs font-medium",
                isUp
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700",
              )}
              aria-label={`${Math.abs(trend.percent)}% ${isUp ? "increase" : "decrease"}`}
            >
              {trend.percent}%
              <span className={cn("mr-1", isUp ? "inline-block" : "hidden")}>
                <TrendingUp className="h-3.5 w-3.5" />
              </span>
              <span className={cn("mr-1", !isUp ? "inline-block" : "hidden")}>
                <TrendingDown className="h-3.5 w-3.5" />
              </span>
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
