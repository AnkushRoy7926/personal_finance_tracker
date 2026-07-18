import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import Copyright from '../internals/components/Copyright';
import ChartUserByCountry from './ChartUserByCountry';
import FillUpCard from './FillUpCard';
import CustomizedDataGrid from './CustomizedDataGrid';
import HighlightedCard from './HighlightedCard';
import PageViewsBarChart from './PageViewsBarChart';
import SessionsChart from './SessionsChart';
import DayOfWeekChart from './DayOfWeekChart';
import MonthlyComparisonCard from './MonthlyComparisonCard';
import SpendingVelocityCard from './SpendingVelocityCard';
import CategoryBreakdownChart from './CategoryBreakdownChart';
import BudgetGoalsCard from './BudgetGoalsCard';
import SavingsGoalsCard from './SavingsGoalsCard';
import ExportButton from './ExportButton';
import StatCard, { StatCardProps } from './StatCard';

import { fetchUserSummary, transactionDetails, extractStatsAscending, DailyStat, Transaction } from '@src/utils/fetchDataFB';
import { auth } from '@src/firebaseConfig';
import {
  computeSpendingByDayOfWeek,
  computeMonthlyComparison,
  computeSpendingVelocity,
  computeCategoryBreakdown,
} from '@src/utils/financeAnalytics';

function sum(arr: number[]) {
  return arr.reduce((acc, curr) => acc + curr, 0);
}

function getDefaultStartDate(): string {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString().split('T')[0];
}

function getDefaultEndDate(): string {
  return new Date().toISOString().split('T')[0];
}

export default function MainGrid() {
  const [data, setData] = React.useState<StatCardProps[]>([]);
  const [dailyStats, setDailyStats] = React.useState<DailyStat[]>([]);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [startDate, setStartDate] = React.useState(getDefaultStartDate);
  const [endDate, setEndDate] = React.useState(getDefaultEndDate);
  const [filterApplied, setFilterApplied] = React.useState(false);

  const loadData = React.useCallback(async (sDate?: string, eDate?: string) => {
    setLoading(true);
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setLoading(false);
      return;
    }
    try {
      const options =
        sDate && eDate ? { startDate: sDate, endDate: eDate } : undefined;
      const [summary, txns] = await Promise.all([
        fetchUserSummary(uid, options),
        transactionDetails(uid, options),
      ]);
      const { added, spent, balance } = extractStatsAscending(summary.dailyStats);
      setDailyStats(summary.dailyStats);
      setTransactions(txns);
      setData([
        {
          title: 'Current Balance',
          value: `${summary.latestBalance}`,
          interval: sDate && eDate ? `${sDate} to ${eDate}` : 'Last 30 days',
          trend: 'neutral',
          data: balance,
        },
        {
          title: 'Savings',
          value: `${sum(added)}`,
          interval: sDate && eDate ? `${sDate} to ${eDate}` : 'Last 30 days',
          trend: 'up',
          data: added,
        },
        {
          title: 'Expenditure',
          value: `${sum(spent)}`,
          interval: sDate && eDate ? `${sDate} to ${eDate}` : 'Last 30 days',
          trend: 'down',
          data: spent,
        },
      ]);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApplyFilter = () => {
    if (startDate && endDate) {
      setFilterApplied(true);
      loadData(startDate, endDate);
    }
  };

  const handleClearFilter = () => {
    setStartDate(getDefaultStartDate());
    setEndDate(getDefaultEndDate());
    setFilterApplied(false);
    loadData();
  };

  const dayOfWeekData = React.useMemo(
    () => computeSpendingByDayOfWeek(transactions),
    [transactions]
  );
  const monthlyComparison = React.useMemo(
    () => computeMonthlyComparison(dailyStats),
    [dailyStats]
  );
  const velocity = React.useMemo(
    () =>
      computeSpendingVelocity(
        dailyStats,
        dailyStats[dailyStats.length - 1]?.balance ?? 0
      ),
    [dailyStats]
  );
  const categoryData = React.useMemo(
    () => computeCategoryBreakdown(transactions),
    [transactions]
  );
  const categorySpendingMap = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const item of categoryData) {
      map.set(item.category, item.total);
    }
    return map;
  }, [categoryData]);
  const totalSpending = React.useMemo(
    () => transactions.filter((t) => t.type === 'Spent').reduce((s, t) => s + t.amount, 0),
    [transactions]
  );
  const latestBalance = dailyStats[dailyStats.length - 1]?.balance ?? 0;

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Typography component="h2" variant="h6">
          Overview
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          alignItems={{ xs: 'stretch', sm: 'center' }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              size="small"
              type="date"
              label="From"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ width: 160 }}
            />
            <TextField
              size="small"
              type="date"
              label="To"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ width: 160 }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleApplyFilter}
            >
              Apply
            </Button>
            {filterApplied && (
              <Button
                variant="text"
                size="small"
                onClick={handleClearFilter}
              >
                Reset
              </Button>
            )}
          </Stack>
          <ExportButton transactions={transactions} />
        </Stack>
      </Stack>

      <Grid container spacing={2} columns={12} sx={{ mb: 2 }}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
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

        <Grid size={{ xs: 12, md: 6 }}>
          <SessionsChart dailyStats={dailyStats} loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PageViewsBarChart dailyStats={dailyStats} loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <DayOfWeekChart data={dayOfWeekData} loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <MonthlyComparisonCard data={monthlyComparison} loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SpendingVelocityCard data={velocity} loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CategoryBreakdownChart data={categoryData} loading={loading} />
        </Grid>
      </Grid>

      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Goals
      </Typography>
      <Grid container spacing={2} columns={12} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <BudgetGoalsCard
            currentSpending={totalSpending}
            categorySpending={categorySpendingMap}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SavingsGoalsCard currentSavings={latestBalance} />
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
            <ChartUserByCountry dailyStats={dailyStats} loading={loading} />
          </Stack>
        </Grid>
      </Grid>

      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
