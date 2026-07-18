import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import { DailyStat } from '@src/utils/fetchDataFB';

interface StyledTextProps {
  variant: 'primary' | 'secondary';
}

const StyledText = styled('text', {
  shouldForwardProp: (prop) => prop !== 'variant',
})<StyledTextProps>(({ theme }) => ({
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fill: (theme.vars || theme).palette.text.secondary,
  variants: [
    {
      props: { variant: 'primary' },
      style: {
        fontSize: theme.typography.h5.fontSize,
        fontWeight: theme.typography.h5.fontWeight,
      },
    },
    {
      props: ({ variant }) => variant !== 'primary',
      style: {
        fontSize: theme.typography.body2.fontSize,
        fontWeight: theme.typography.body2.fontWeight,
      },
    },
  ],
}));

interface PieCenterLabelProps {
  primaryText: string;
  secondaryText: string;
}

function PieCenterLabel({ primaryText, secondaryText }: PieCenterLabelProps) {
  const { width, height, left, top } = useDrawingArea();
  const primaryY = top + height / 2 - 10;
  const secondaryY = primaryY + 24;

  return (
    <React.Fragment>
      <StyledText variant="primary" x={left + width / 2} y={primaryY}>
        {primaryText}
      </StyledText>
      <StyledText variant="secondary" x={left + width / 2} y={secondaryY}>
        {secondaryText}
      </StyledText>
    </React.Fragment>
  );
}

function sum(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0);
}

interface ChartUserByCountryProps {
  dailyStats: DailyStat[];
  loading: boolean;
}

export default function ChartUserByCountry({ dailyStats, loading }: ChartUserByCountryProps) {
  const totalAdded = sum(dailyStats.map((s) => s.added));
  const totalSpent = sum(dailyStats.map((s) => s.spent));
  const grandTotal = totalAdded + totalSpent;
  const savingsPct = grandTotal > 0 ? ((totalAdded / grandTotal) * 100).toFixed(0) : '0';
  const spentPct = grandTotal > 0 ? ((totalSpent / grandTotal) * 100).toFixed(0) : '0';

  const pieData = [
    { label: 'Income', value: totalAdded || 0 },
    { label: 'Spending', value: totalSpent || 0 },
  ];

  const breakdown = [
    {
      label: 'Income',
      value: Number(savingsPct),
      icon: <TrendingUpRoundedIcon sx={{ fontSize: 18 }} />,
      color: 'hsl(145, 55%, 42%)',
    },
    {
      label: 'Spending',
      value: Number(spentPct),
      icon: <TrendingDownRoundedIcon sx={{ fontSize: 18 }} />,
      color: 'hsl(0, 65%, 55%)',
    },
  ];

  const pieColors = ['hsl(145, 55%, 42%)', 'hsl(0, 65%, 55%)'];

  return (
    <Card
      variant="outlined"
      sx={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}
    >
      <CardContent>
        <Typography component="h2" variant="subtitle2">
          Income vs Spending
        </Typography>
        {loading ? (
          <Skeleton variant="rounded" height={300} />
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PieChart
                colors={pieColors}
                margin={{ left: 80, right: 80, top: 80, bottom: 80 }}
                series={[
                  {
                    data: pieData,
                    innerRadius: 75,
                    outerRadius: 100,
                    paddingAngle: 0,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                  },
                ]}
                height={260}
                width={260}
                slotProps={{
                  legend: { hidden: true },
                }}
              >
                <PieCenterLabel
                  primaryText={`₹${grandTotal.toLocaleString()}`}
                  secondaryText="total"
                />
              </PieChart>
            </Box>
            {breakdown.map((item) => (
              <Stack
                key={item.label}
                direction="row"
                sx={{ alignItems: 'center', gap: 2, pb: 2 }}
              >
                <Box sx={{ color: item.color, display: 'flex', flexShrink: 0 }}>
                  {item.icon}
                </Box>
                <Stack sx={{ gap: 1, flexGrow: 1 }}>
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {item.label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {item.value}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    aria-label={`${item.label} proportion`}
                    value={item.value}
                    sx={{
                      [`& .${linearProgressClasses.bar}`]: {
                        backgroundColor: item.color,
                      },
                    }}
                  />
                </Stack>
              </Stack>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}
