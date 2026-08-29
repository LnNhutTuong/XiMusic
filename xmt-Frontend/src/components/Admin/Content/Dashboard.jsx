import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";

import { Badge } from "@/components/ui/badge";

import { getAllTotal } from "@/services/admin/dashboardService";
import { useEffect, useState } from "react";

const Dashboard = (props) => {
  const [staticData, setStaticData] = useState(null);
  const [songChartData, setSongChartData] = useState([]);
  useEffect(() => {
    handleGetData();
  }, []);

  const handleGetData = async () => {
    let res = await getAllTotal();

    if (res?.EC === 0) {
      setStaticData(res?.DT.statics);
      setSongChartData(res?.DT.songChart);
    }
  };

  const chartConfig = {
    songs: {
      label: "Songs",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 p-2 bg-black border border-white/20 rounded-4xl border-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-4xl font-bold">{staticData?.users.total}</p>
            <p className="text-sm text-green-500">
              +{staticData?.users.newThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Artists</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-4xl font-bold">{staticData?.artists.total}</p>
            <p className="text-sm text-green-500">
              +{staticData?.artists.newThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Songs</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-4xl font-bold">{staticData?.songs.total}</p>
            <p className="text-sm text-green-500">
              +{staticData?.songs.newThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Albums</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-4xl font-bold">{staticData?.albums.total}</p>
            <p className="text-sm text-green-500">
              +{staticData?.albums.newThisMonth} this month
            </p>
          </CardContent>
        </Card>
      </div>
      <div>
        <ChartContainer config={chartConfig} className="h-[300px] w-full px-3">
          <BarChart data={songChartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" />

            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="songs" fill="var(--color-songs)" radius={8} />
          </BarChart>
        </ChartContainer>
      </div>
    </>
  );
};

export default Dashboard;
