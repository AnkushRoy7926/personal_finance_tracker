import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import Copyright from '../internals/components/Copyright';
import ChartUserByCountry from './ChartUserByCountry';
import FillUpCard from './FillUpCard';
import CustomizedDataGrid from './CustomizedDataGrid';
import HighlightedCard from './HighlightedCard';
import PageViewsBarChart from './PageViewsBarChart';
import SessionsChart from './SessionsChart';
import StatCard, { StatCardProps } from './StatCard';

import { fetchUserSummary, extractStatsAscending } from '@src/utils/fetchDataFB';
import { auth } from '@src/firebaseConfig';

// sum helper
function sum(arr: number[]) {
  return arr.reduce((acc, curr) => acc + curr, 0);
}

export default function MainGrid() {
  const [data, setData] = React.useState<StatCardProps[]>([]);
  const [loading, setLoading] = React.useState(true);

  const getData = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return null;
    const { dailyStats, latestBalance } = await fetchUserSummary(uid);
    const { added, spent, balance } = extractStatsAscending(dailyStats);
    return { latestBalance, added, spent, balance };
  };

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await getData();
      if (result) {
        const { added, spent, balance, latestBalance } = result;
        setData([
          {
            title: 'Current Balance',
            value: `${latestBalance}`,
            interval: 'Last 30 days',
            trend: 'neutral',
            data: balance,
          },
          {
            title: 'Savings',
            value: `${sum(added)}`,
            interval: 'Last 30 days',
            trend: 'up',
            data: added,
          },
          {
            title: 'Expenditure',
            value: `${sum(spent)}`,
            interval: 'Last 30 days',
            trend: 'down',
            data: spent,
          },
        ]);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>

      <Grid container spacing={2} columns={12} sx={{ mb: 2 }}>
        {loading
          ? // Show 4 skeleton cards: 3 stat placeholders + 1 FillUp placeholder
            Array.from({ length: 4 }).map((_, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card>
                  <Skeleton variant="rectangular" height={80} />
                  <CardContent>
                    <Skeleton width="60%" height={24} sx={{ mb: 1 }} />
                    <Skeleton width="40%" />
                  </CardContent>
                </Card>
              </Grid>
            ))
          : <>
              {data.map((card, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
                  <StatCard {...card} />
                </Grid>
              ))}
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <FillUpCard />
              </Grid>
            </>
        }

        {/* These charts can appear even while loading */}
        <Grid size={{ xs: 12, md: 6 }}>
          <SessionsChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PageViewsBarChart />
        </Grid>
      </Grid>

      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <CustomizedDataGrid />
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            <HighlightedCard />
            <ChartUserByCountry />
          </Stack>
        </Grid>
      </Grid>

      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
