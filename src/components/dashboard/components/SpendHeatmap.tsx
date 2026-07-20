'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import { DailyStat } from '@src/utils/fetchDataFB';

const CELL_SIZE = 14;
const CELL_GAP = 3;
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getWeeksInYear(year: number) {
  const weeks: { date: Date; weekDay: number }[][] = [];
  let currentWeek: { date: Date; weekDay: number }[] = [];

  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);

  const d = new Date(start);
  while (d <= end) {
    currentWeek.push({ date: new Date(d), weekDay: d.getDay() });
    if (d.getDay() === 6 || d.getTime() === end.getTime()) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    d.setDate(d.getDate() + 1);
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);
  return weeks;
}

function getColor(value: number, max: number, palette: string[]) {
  if (value === 0) return 'action.hover';
  const ratio = value / max;
  if (ratio < 0.25) return palette[0];
  if (ratio < 0.5) return palette[1];
  if (ratio < 0.75) return palette[2];
  return palette[3];
}

interface SpendHeatmapProps {
  dailyStats: DailyStat[];
  loading: boolean;
}

export default function SpendHeatmap({ dailyStats, loading }: SpendHeatmapProps) {
  const theme = useTheme();
  const now = new Date();
  const year = now.getFullYear();

  const spendingMap = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const stat of dailyStats) {
      map.set(stat.date, stat.spent);
    }
    return map;
  }, [dailyStats]);

  const maxSpent = React.useMemo(() => {
    let max = 0;
    for (const stat of dailyStats) {
      if (stat.spent > max) max = stat.spent;
    }
    return max || 1;
  }, [dailyStats]);

  const weeks = React.useMemo(() => getWeeksInYear(year), [year]);

  const palette = [
    theme.palette.success.light,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
  ];

  const totalSpent = React.useMemo(
    () => dailyStats.reduce((s, d) => s + d.spent, 0),
    [dailyStats]
  );

  const activeDays = React.useMemo(
    () => dailyStats.filter((d) => d.spent > 0).length,
    [dailyStats]
  );

  if (loading) {
    return (
      <Card variant="outlined" sx={{ width: '100%' }}>
        <CardContent>
          <Skeleton variant="rounded" height={160} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Spending Heatmap — {year}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {activeDays} active days · ₹{totalSpent.toLocaleString()} total
          </Typography>
        </Stack>

        <Box sx={{ overflowX: 'auto', pb: 1 }}>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {/* Day labels */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${CELL_GAP}px`, pt: `${CELL_SIZE + 4}px` }}>
              {DAY_LABELS.map((label, i) => (
                <Typography
                  key={i}
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontSize: 10,
                    height: CELL_SIZE,
                    lineHeight: `${CELL_SIZE}px`,
                    minWidth: 28,
                    textAlign: 'right',
                    pr: 0.5,
                  }}
                >
                  {label}
                </Typography>
              ))}
            </Box>

            {/* Weeks grid */}
            <Box sx={{ display: 'flex', gap: `${CELL_GAP}px` }}>
              {weeks.map((week, wi) => (
                <Box key={wi} sx={{ display: 'flex', flexDirection: 'column', gap: `${CELL_GAP}px` }}>
                  {/* Month label on first cell of month */}
                  <Box sx={{ height: CELL_SIZE, display: 'flex', alignItems: 'center' }}>
                    {week[0]?.date.getDate() <= 7 && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: 10, whiteSpace: 'nowrap' }}
                      >
                        {MONTH_LABELS[week[0].date.getMonth()]}
                      </Typography>
                    )}
                  </Box>
                  {/* 7 day cells */}
                  {Array.from({ length: 7 }).map((_, di) => {
                    const entry = week.find((w) => w.weekDay === di);
                    if (!entry) {
                      return <Box key={di} sx={{ width: CELL_SIZE, height: CELL_SIZE }} />;
                    }
                    const dateStr = entry.date.toISOString().split('T')[0];
                    const spent = spendingMap.get(dateStr) ?? 0;
                    const isFuture = entry.date > now;
                    const color = isFuture ? 'transparent' : getColor(spent, maxSpent, palette);

                    return (
                      <Tooltip
                        key={di}
                        title={
                          <span style={{ fontSize: 12 }}>
                            ₹{spent.toLocaleString()} · {dateStr}
                          </span>
                        }
                        arrow
                        placement="top"
                      >
                        <Box
                          sx={{
                            width: CELL_SIZE,
                            height: CELL_SIZE,
                            borderRadius: 0.5,
                            bgcolor: color,
                            border: '1px solid',
                            borderColor: 'divider',
                            cursor: isFuture ? 'default' : 'pointer',
                            opacity: isFuture ? 0.3 : 1,
                            transition: 'transform 0.1s ease',
                            '&:hover': isFuture ? {} : { transform: 'scale(1.3)', zIndex: 1 },
                          }}
                        />
                      </Tooltip>
                    );
                  })}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Legend */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5, pl: 3.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>Less</Typography>
            {['action.hover', ...palette].map((c, i) => (
              <Box
                key={i}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: 0.5,
                  bgcolor: c,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              />
            ))}
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>More</Typography>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
