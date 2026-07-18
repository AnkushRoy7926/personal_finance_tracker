import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import { DayOfWeekSpending } from '@src/utils/financeAnalytics';

interface DayOfWeekChartProps {
  data: DayOfWeekSpending[];
  loading: boolean;
}

export default function DayOfWeekChart({ data, loading }: DayOfWeekChartProps) {
  const theme = useTheme();

  const totalSpent = data.reduce((s, d) => s + d.totalSpent, 0);
  const maxDay = data.reduce(
    (max, d) => (d.totalSpent > max.totalSpent ? d : max),
    data[0] ?? { day: '-', totalSpent: 0 }
  );
  const hasData = totalSpent > 0;

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Spending by Day of Week
        </Typography>
        {loading ? (
          <Box aria-busy="true" aria-label="Loading chart">
            <Skeleton variant="rounded" height={290} />
          </Box>
        ) : !hasData ? (
          <Stack
            alignItems="center"
            spacing={1.5}
            sx={{ py: 6 }}
            role="status"
          >
            <BarChartRoundedIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
            <Typography variant="body2" color="text.secondary">
              No spending data for this period.
            </Typography>
          </Stack>
        ) : (
          <>
            <Stack sx={{ justifyContent: 'space-between' }}>
              <Stack direction="row" sx={{ alignItems: 'baseline', gap: 1 }}>
                <Typography variant="h4" component="p">
                  ₹{totalSpent.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  total spent
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Peak: {maxDay.day} · Last 30 days
              </Typography>
            </Stack>
            <BarChart
              borderRadius={8}
              colors={[theme.palette.primary.main]}
              xAxis={[
                {
                  scaleType: 'band',
                  categoryGapRatio: 0.4,
                  data: data.map((d) => d.day),
                },
              ]}
              series={[
                {
                  label: 'Spent',
                  data: data.map((d) => d.totalSpent),
                  color: theme.palette.primary.main,
                },
              ]}
              height={250}
              margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
              grid={{ horizontal: true }}
              slotProps={{
                legend: { hidden: true },
              }}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
