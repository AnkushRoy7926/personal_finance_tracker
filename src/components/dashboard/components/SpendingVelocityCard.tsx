import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { SpendingVelocity } from '@src/utils/financeAnalytics';

interface SpendingVelocityCardProps {
  data: SpendingVelocity | null;
  loading: boolean;
}

export default function SpendingVelocityCard({
  data,
  loading,
}: SpendingVelocityCardProps) {
  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Spending Velocity
        </Typography>
        {loading ? (
          <Box aria-busy="true" aria-label="Loading velocity data">
            <Skeleton variant="rounded" height={200} />
          </Box>
        ) : !data ? (
          <Stack
            alignItems="center"
            spacing={1.5}
            sx={{ py: 6 }}
            role="status"
          >
            <SpeedRoundedIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
            <Typography variant="body2" color="text.secondary">
              Not enough data to calculate velocity.
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={2.5}>
            <Stack direction="row" spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Daily Average
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  ₹{data.dailyAvg.toFixed(0)}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Weekly Average
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  ₹{data.weeklyAvg.toFixed(0)}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Trend
                </Typography>
                <Chip
                  size="small"
                  label={`${data.trendPct > 0 ? '+' : ''}${data.trendPct.toFixed(0)}%`}
                  color={
                    data.trend === 'increasing'
                      ? 'error'
                      : data.trend === 'decreasing'
                      ? 'success'
                      : 'default'
                  }
                  sx={{ height: 22, fontSize: '0.7rem', mt: 0.25 }}
                />
              </Box>
            </Stack>

            <Box
              sx={{
                p: 1.5,
                borderRadius: 1,
                bgcolor: 'background.default',
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                {data.projectedBalance >= 0 ? (
                  <CheckCircleRoundedIcon sx={{ color: 'success.main', fontSize: 20 }} />
                ) : (
                  <WarningAmberRoundedIcon sx={{ color: 'error.main', fontSize: 20 }} />
                )}
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Projected balance next month:{' '}
                    <Box
                      component="span"
                      sx={{
                        fontWeight: 600,
                        color: data.projectedBalance >= 0 ? 'success.main' : 'error.main',
                      }}
                    >
                      ₹
                      {data.projectedBalance.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </Box>
                  </Typography>
                  {data.daysUntilZero !== null && data.daysUntilZero < 60 && (
                    <Typography variant="caption" color="text.secondary">
                      At current rate, balance reaches zero in ~{data.daysUntilZero} days
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Box>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
