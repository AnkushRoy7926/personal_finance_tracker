import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import ChartUserByCountry from './ChartUserByCountry';
import CustomizedTreeView from './CustomizedTreeView';
import FillUpCard from './FillUpCard';
import CustomizedDataGrid from './CustomizedDataGrid';
import HighlightedCard from './HighlightedCard';
import PageViewsBarChart from './PageViewsBarChart';
import SessionsChart from './SessionsChart';
import StatCard, { StatCardProps } from './StatCard';

import { fetchUserSummary, extractStatsAscending } from '@src/utils/fetchDataFB';
import {auth} from '@src/firebaseConfig';

// function to give sum of list of numbers
function sum(arr: number[]) {
  return arr.reduce((acc, curr) => acc + curr, 0);
}


export default function MainGrid() {
  const [data, setData] = React.useState<StatCardProps[]>([]);
  
  const getData = async () => {
    const uid = auth.currentUser?.uid;
  
  
    if (uid) {
      const { dailyStats, latestBalance } = await fetchUserSummary(uid);
      const { added, spent, balance } = extractStatsAscending(dailyStats);
      console.log('Sorted Daily Stats:', { added, spent, balance });
      return {latestBalance, added, spent, balance };
    }
  }

  
  React.useEffect(() => {
    const fetchData = async () => {

        const result = await getData();
        // if (result) {
        //   const {latestBalance, added, spent, balance } = result;
        // }



        const updatedData: StatCardProps[] = [
          {
          title: 'Current Balance',
          value: `${result?.latestBalance ?? 0}`,
          interval: 'Last 30 days',
          trend: 'neutral',
          data: result?.balance || [],
          },
          {
          title: 'Savings',
          value: `${sum(result?.added || [])}`,
          interval: 'Last 30 days',
          trend: 'up',
          data: result?.added || [],
          },
          {
          title: 'Expenditure',
          value: `${sum(result?.spent || [])}`,
          interval: 'Last 30 days',
          trend: 'down',
          data: result?.spent || [],
          },
        ];
  
      setData(updatedData);
    };
  
    fetchData();
  }, []);

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <FillUpCard />
        </Grid>
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
        {/* <Grid size={{ xs: 12, sm: 6, lg: 3 }}> */}
          <HighlightedCard />
        {/* </Grid> */}
            {/* <CustomizedTreeView /> */}
            <ChartUserByCountry />
          </Stack>
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}


  
// export default function MainGrid() {
//   return (
//     <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
//       {/* cards */}
//       <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
//         Overview
//       </Typography>
//       <Grid
//         container
//         spacing={2}
//         columns={12}
//         sx={{ mb: (theme) => theme.spacing(2) }}
//       >
//         {data.map((card, index) => (
//           <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
//             <StatCard {...card} />
//           </Grid>
//         ))}
//         <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
//           <HighlightedCard />
//         </Grid>
//         <Grid size={{ xs: 12, md: 6 }}>
//           <SessionsChart />
//         </Grid>
//         <Grid size={{ xs: 12, md: 6 }}>
//           <PageViewsBarChart />
//         </Grid>
//       </Grid>
//       <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
//         Details
//       </Typography>
//       <Grid container spacing={2} columns={12}>
//         <Grid size={{ xs: 12, lg: 9 }}>
//           <CustomizedDataGrid />
//         </Grid>
//         <Grid size={{ xs: 12, lg: 3 }}>
//           <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
//             <CustomizedTreeView />
//             <ChartUserByCountry />
//           </Stack>
//         </Grid>
//       </Grid>
//       <Copyright sx={{ my: 4 }} />
//     </Box>
//   );
// }
