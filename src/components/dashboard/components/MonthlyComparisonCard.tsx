import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CompareArrowsRoundedIcon from '@mui/icons-material/CompareArrowsRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import { MonthComparison } from '@src/utils/financeAnalytics';

interface MonthlyComparisonCardProps {
  data: MonthComparison | null;
  loading: boolean;
}

export default function MonthlyComparisonCard({
  data,
  loading,
}: MonthlyComparisonCardProps) {
  const theme = useTheme();

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Monthly Comparison
        </Typography>
        {loading ? (
          <Box aria-busy="true" aria-label="Loading chart">
            <Skeleton variant="rounded" height={290} />
          </Box>
        ) : !data ? (
          <Stack
            alignItems="center"
            spacing={1.5}
            sx={{ py: 6 }}
            role="status"
          >
            <CompareArrowsRoundedIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
            <Typography variant="body2" color="text.secondary">
              Not enough data for comparison.
            </Typography>
          </Stack>
        ) : (
          <>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {data.previousMonth.label}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  ₹{data.previousMonth.totalSpent.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  spent
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {data.currentMonth.label}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  ₹{data.currentMonth.totalSpent.toLocaleString()}
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography variant="caption" color="text.secondary">
                    spent
                  </Typography>
                  <Chip
                    size="small"
                    label={`${data.change.spentPct > 0 ? '+' : ''}${data.change.spentPct.toFixed(0)}%`}
                    color={data.change.spentPct > 0 ? 'error' : 'success'}
                    sx={{ height: 20, fontSize: '0.7rem' }}
                    icon={
                      data.change.spentPct > 0 ? (
                        <TrendingUpRoundedIcon sx={{ fontSize: 14 }} />
                      ) : (
                        <TrendingDownRoundedIcon sx={{ fontSize: 14 }} />
                      )
                    }
                  />
                </Stack>
              </Box>
            </Stack>
            <BarChart
              borderRadius={8}
              colors={[
                theme.palette.grey[400],
                theme.palette.primary.main,
              ]}
              xAxis={[
                {
                  scaleType: 'band',
                  data: ['Spent', 'Earned'],
                },
              ]}
              series={[
                {
                  label: data.previousMonth.label,
                  data: [
                    data.previousMonth.totalSpent,
                    data.previousMonth.totalAdded,
                  ],
                },
                {
                  label: data.currentMonth.label,
                  data: [
                    data.currentMonth.totalSpent,
                    data.currentMonth.totalAdded,
                  ],
                },
              ]}
              height={200}
              margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
              grid={{ horizontal: true }}
            />
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'grey.400' }} />
                <Typography variant="caption" color="text.secondary">
                  {data.previousMonth.label}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'primary.main' }} />
                <Typography variant="caption" color="text.secondary">
                  {data.currentMonth.label}
                </Typography>
              </Stack>
            </Stack>
          </>
        )}
      </CardContent>
    </Card>
  );
}
