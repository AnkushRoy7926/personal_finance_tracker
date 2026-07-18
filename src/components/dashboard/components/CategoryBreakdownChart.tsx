import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { CategoryBreakdown } from '@src/utils/financeAnalytics';

interface CategoryBreakdownChartProps {
  data: CategoryBreakdown[];
  loading: boolean;
}

const StyledText = styled('text')(() => ({
  textAnchor: 'middle',
  dominantBaseline: 'central',
}));

function CenterLabel({ total }: { total: string }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <React.Fragment>
      <StyledText
        x={left + width / 2}
        y={top + height / 2 - 8}
        style={{ fontSize: 18, fontWeight: 600 }}
      >
        {total}
      </StyledText>
      <StyledText
        x={left + width / 2}
        y={top + height / 2 + 12}
        style={{ fontSize: 11, fill: 'gray' }}
      >
        total spent
      </StyledText>
    </React.Fragment>
  );
}

export default function CategoryBreakdownChart({
  data,
  loading,
}: CategoryBreakdownChartProps) {
  const theme = useTheme();
  const totalSpent = data.reduce((s, d) => s + d.total, 0);

  const categoryColors = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.secondary?.main ?? '#7b1fa2',
    '#00838f',
    '#c2185b',
    theme.palette.grey[600],
  ];

  const pieData = data.map((d) => ({
    label: d.category,
    value: d.total,
  }));

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Spending by Category
        </Typography>
        {loading ? (
          <Box aria-busy="true" aria-label="Loading category breakdown">
            <Skeleton variant="rounded" height={300} />
          </Box>
        ) : data.length === 0 ? (
          <Stack
            alignItems="center"
            spacing={1.5}
            sx={{ py: 6 }}
            role="status"
          >
            <CategoryRoundedIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
            <Typography variant="body2" color="text.secondary">
              No spending data to categorize.
            </Typography>
          </Stack>
        ) : (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PieChart
                colors={categoryColors}
                margin={{ left: 60, right: 60, top: 60, bottom: 60 }}
                series={[
                  {
                    data: pieData,
                    innerRadius: 60,
                    outerRadius: 90,
                    paddingAngle: 2,
                    highlightScope: {
                      faded: 'global',
                      highlighted: 'item',
                    },
                  },
                ]}
                height={220}
                width={220}
                slotProps={{ legend: { hidden: true } }}
              >
                <CenterLabel total={`₹${totalSpent.toLocaleString()}`} />
              </PieChart>
            </Box>
            <Stack spacing={1.5} sx={{ mt: 1.5 }}>
              {data.map((item, i) => (
                <Stack
                  key={item.category}
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      bgcolor: categoryColors[i % categoryColors.length],
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ flex: 1, fontWeight: 500 }}
                  >
                    {item.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₹{item.total.toLocaleString()}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ minWidth: 36, textAlign: 'right' }}
                  >
                    {item.percentage.toFixed(0)}%
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </>
        )}
      </CardContent>
    </Card>
  );
}
