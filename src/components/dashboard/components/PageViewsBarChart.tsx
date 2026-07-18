import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import { DailyStat } from '@src/utils/fetchDataFB';

function groupByWeek(stats: DailyStat[]): { labels: string[]; upi: number[]; cash: number[] } {
  if (stats.length === 0) return { labels: [], upi: [], cash: [] };

  const weeks: { labels: string[]; upi: number[]; cash: number[] } = { labels: [], upi: [], cash: [] };
  let weekUPI = 0;
  let weekCash = 0;
  let weekStart = stats[0].date;

  for (let i = 0; i < stats.length; i++) {
    weekUPI += stats[i].upi;
    weekCash += stats[i].cash;

    const isLast = i === stats.length - 1;
    const daysSinceStart = (new Date(stats[i].date).getTime() - new Date(weekStart).getTime()) / 86400000;

    if (isLast || daysSinceStart >= 6) {
      const startLabel = new Date(weekStart).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      const endLabel = new Date(stats[i].date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      weeks.labels.push(`${startLabel}–${endLabel}`);
      weeks.upi.push(weekUPI);
      weeks.cash.push(weekCash);
      weekUPI = 0;
      weekCash = 0;
      if (!isLast) weekStart = stats[i + 1].date;
    }
  }

  return weeks;
}

function sum(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0);
}

interface PageViewsBarChartProps {
  dailyStats: DailyStat[];
  loading: boolean;
}

export default function PageViewsBarChart({ dailyStats, loading }: PageViewsBarChartProps) {
  const theme = useTheme();

  const weekly = groupByWeek(dailyStats);
  const totalUPI = sum(dailyStats.map((s) => s.upi));
  const totalCash = sum(dailyStats.map((s) => s.cash));
  const grandTotal = totalUPI + totalCash;
  const upiPct = grandTotal > 0 ? ((totalUPI / grandTotal) * 100).toFixed(0) : '0';

  const colorPalette = [
    theme.palette.primary.main,
    theme.palette.warning.main,
  ];

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Weekly Spending by Mode
        </Typography>
        {loading ? (
          <Skeleton variant="rounded" height={290} />
        ) : (
          <>
            <Stack sx={{ justifyContent: 'space-between' }}>
              <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                <Typography variant="h4" component="p">
                  ₹{grandTotal.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  total spent
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {upiPct}% via UPI · Last 30 days
              </Typography>
            </Stack>
            <BarChart
              borderRadius={8}
              colors={colorPalette}
              xAxis={[
                {
                  scaleType: 'band',
                  categoryGapRatio: 0.5,
                  data: weekly.labels,
                },
              ]}
              series={[
                {
                  id: 'upi',
                  label: 'UPI',
                  data: weekly.upi,
                  stack: 'spending',
                },
                {
                  id: 'cash',
                  label: 'Cash',
                  data: weekly.cash,
                  stack: 'spending',
                },
              ]}
              height={250}
              margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
              grid={{ horizontal: true }}
              slotProps={{
                legend: {
                  hidden: true,
                },
              }}
            />
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'primary.main' }} />
                <Typography variant="caption" color="text.secondary">UPI</Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'warning.main' }} />
                <Typography variant="caption" color="text.secondary">Cash</Typography>
              </Stack>
            </Stack>
          </>
        )}
      </CardContent>
    </Card>
  );
}
