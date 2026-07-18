import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import { LineChart } from '@mui/x-charts/LineChart';
import { DailyStat } from '@src/utils/fetchDataFB';

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.4} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()} ${d.toLocaleDateString('en-US', { month: 'short' })}`;
}

function sum(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0);
}

interface SessionsChartProps {
  dailyStats: DailyStat[];
  loading: boolean;
}

export default function SessionsChart({ dailyStats, loading }: SessionsChartProps) {
  const theme = useTheme();

  const labels = dailyStats.map((s) => formatDayLabel(s.date));
  const addedData = dailyStats.map((s) => s.added);
  const spentData = dailyStats.map((s) => s.spent);

  const totalAdded = sum(addedData);
  const savingsRate = totalAdded > 0
    ? (((totalAdded - sum(spentData)) / totalAdded) * 100).toFixed(0)
    : '0';

  const colorPalette = [
    theme.palette.success.main,
    theme.palette.error.main,
  ];

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Daily Cash Flow
        </Typography>
        {loading ? (
          <Skeleton variant="rounded" height={290} />
        ) : (
          <>
            <Stack sx={{ justifyContent: 'space-between' }}>
              <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                <Typography variant="h4" component="p">
                  ₹{totalAdded.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  earned
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {savingsRate}% savings rate · Last 30 days
              </Typography>
            </Stack>
            <LineChart
              colors={colorPalette}
              xAxis={[
                {
                  scaleType: 'point',
                  data: labels,
                  tickInterval: (index) => (index + 1) % 5 === 0,
                },
              ]}
              series={[
                {
                  id: 'income',
                  label: 'Income',
                  showMark: false,
                  curve: 'monotoneX',
                  area: true,
                  data: addedData,
                },
                {
                  id: 'spending',
                  label: 'Spending',
                  showMark: false,
                  curve: 'monotoneX',
                  area: true,
                  data: spentData,
                },
              ]}
              height={250}
              margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
              grid={{ horizontal: true }}
              sx={{
                '& .MuiAreaElement-series-income': {
                  fill: "url('#income')",
                },
                '& .MuiAreaElement-series-spending': {
                  fill: "url('#spending')",
                },
              }}
              slotProps={{
                legend: {
                  hidden: true,
                },
              }}
            >
              <AreaGradient color={theme.palette.success.main} id="income" />
              <AreaGradient color={theme.palette.error.main} id="spending" />
            </LineChart>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main' }} />
                <Typography variant="caption" color="text.secondary">Income</Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'error.main' }} />
                <Typography variant="caption" color="text.secondary">Spending</Typography>
              </Stack>
            </Stack>
          </>
        )}
      </CardContent>
    </Card>
  );
}
