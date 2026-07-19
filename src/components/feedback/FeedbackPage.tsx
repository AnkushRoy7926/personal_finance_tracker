"use client";

import withAuth from "@utils/protectRoutes";
import * as React from "react";
import { alpha } from "@mui/material/styles";
import useTheme from "@mui/material/styles/useTheme";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import SavingsRoundedIcon from "@mui/icons-material/SavingsRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import SentimentDissatisfiedRoundedIcon from "@mui/icons-material/SentimentDissatisfiedRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import NotificationImportantRoundedIcon from "@mui/icons-material/NotificationImportantRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";

import AppNavbar from "@src/components/dashboard/components/AppNavbar";
import Header from "@src/components/dashboard/components/Header";
import SideMenu from "@src/components/dashboard/components/SideMenu";
import AppTheme from "@src/components/shared-theme/AppTheme";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "@src/components/dashboard/theme/customizations";

import { fetchUserSummary, transactionDetails } from "@src/utils/fetchDataFB";
import { auth } from "@src/firebaseConfig";
import {
  detectSpendingAnomalies,
  detectRecurringPayments,
  computeCategoryBreakdown,
  SpendingAnomaly,
  RecurringPayment,
  CategoryBreakdown,
} from "@src/utils/financeAnalytics";
import { useRouter } from "next/navigation";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

type Insight = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  severity: "positive" | "warning" | "neutral";
  action?: { label: string; path: string };
};

function computeInsights(
  stats: { added: number[]; spent: number[]; balance: number[]; cash: number[]; upi: number[] },
  latestBalance: number,
  transactions: { amount: number; type: string; mode: string; description?: string }[]
): { score: number; insights: Insight[] } {
  const insights: Insight[] = [];
  let score = 50;

  const totalAdded = stats.added.reduce((a, b) => a + b, 0);
  const totalSpent = stats.spent.reduce((a, b) => a + b, 0);
  const totalCash = stats.cash[stats.cash.length - 1] ?? 0;
  const totalUpi = stats.upi[stats.upi.length - 1] ?? 0;
  const savingsRate = totalAdded > 0 ? ((totalAdded - totalSpent) / totalAdded) * 100 : 0;

  if (savingsRate > 30) {
    score += 15;
    insights.push({
      id: "savings-high",
      icon: <TrendingUpRoundedIcon />,
      title: "Strong savings rate",
      description: `You're saving ${savingsRate.toFixed(0)}% of your income over the last 30 days. That's well above the recommended 20% threshold. Keep it up.`,
      severity: "positive",
    });
  } else if (savingsRate > 0) {
    score += 5;
    insights.push({
      id: "savings-moderate",
      icon: <SavingsRoundedIcon />,
      title: "Moderate savings",
      description: `Your savings rate is ${savingsRate.toFixed(0)}%. Consider increasing it to at least 20% by reducing discretionary spending.`,
      severity: "neutral",
    });
  } else {
    score -= 10;
    insights.push({
      id: "savings-negative",
      icon: <WarningAmberRoundedIcon />,
      title: "Spending exceeds income",
      description: `You've spent more than you've earned this month. Review your expenses to avoid depleting your balance.`,
      severity: "warning",
      action: { label: "View transactions", path: "/transactions" },
    });
  }

  const nonZeroSpent = stats.spent.filter((s) => s > 0);
  if (nonZeroSpent.length > 0) {
    const avgSpent = totalSpent / nonZeroSpent.length;
    const maxSpent = Math.max(...stats.spent);
    if (maxSpent > avgSpent * 2) {
      score -= 5;
      insights.push({
        id: "spending-spike",
        icon: <WarningAmberRoundedIcon />,
        title: "Spending spike detected",
        description: `Your highest spending day was ₹${maxSpent.toLocaleString()}, which is ${(maxSpent / avgSpent).toFixed(1)}x your daily average of ₹${avgSpent.toFixed(0)}. Identify what caused this spike.`,
        severity: "warning",
        action: { label: "View transactions", path: "/transactions" },
      });
    } else {
      score += 5;
      insights.push({
        id: "spending-consistent",
        icon: <CheckCircleRoundedIcon />,
        title: "Consistent spending pattern",
        description: `Your daily spending has been relatively stable with no extreme outliers. This predictability helps with financial planning.`,
        severity: "positive",
      });
    }
  }

  if (totalUpi + totalCash > 0) {
    const upiPercent = (totalUpi / (totalUpi + totalCash)) * 100;
    insights.push({
      id: "payment-mode",
      icon: <CreditCardRoundedIcon />,
      title: "Payment method breakdown",
      description: `UPI accounts for ${upiPercent.toFixed(0)}% of your transactions (₹${totalUpi.toLocaleString()}) and Cash for ${(100 - upiPercent).toFixed(0)}% (₹${totalCash.toLocaleString()}). UPI provides better tracking.`,
      severity: "neutral",
    });
  }

  if (latestBalance > 0 && totalSpent > 0) {
    const monthsOfRunway = totalSpent > 0 ? (latestBalance / (totalSpent / 30)) : Infinity;
    if (monthsOfRunway < 1) {
      score -= 15;
      insights.push({
        id: "balance-low",
        icon: <WarningAmberRoundedIcon />,
        title: "Low balance warning",
        description: `At your current spending rate, your balance of ₹${latestBalance.toLocaleString()} will last less than a month. Prioritize essential expenses.`,
        severity: "warning",
      });
    } else if (monthsOfRunway > 3) {
      score += 10;
      insights.push({
        id: "balance-healthy",
        icon: <AccountBalanceRoundedIcon />,
        title: "Healthy buffer",
        description: `Your balance can sustain your current spending for approximately ${monthsOfRunway.toFixed(1)} months. You have a comfortable financial cushion.`,
        severity: "positive",
      });
    } else {
      insights.push({
        id: "balance-moderate",
        icon: <AccountBalanceRoundedIcon />,
        title: "Moderate buffer",
        description: `Your balance covers about ${monthsOfRunway.toFixed(1)} months of spending. Building a 3-6 month emergency fund is recommended.`,
        severity: "neutral",
      });
    }
  }

  insights.push({
    id: "tip-budget",
    icon: <LightbulbRoundedIcon />,
    title: "Budgeting tip",
    description: `Track your transactions daily. Set category-wise budgets and review them weekly to stay on top of your finances.`,
    severity: "neutral",
  });

  score = Math.max(0, Math.min(100, score));
  return { score, insights };
}

function ScoreGauge({ score }: { score: number }) {
  const theme = useTheme();
  const radius = 70;
  const stroke = 10;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;

  const color =
    score >= 70
      ? theme.palette.success.main
      : score >= 40
      ? theme.palette.warning.main
      : theme.palette.error.main;

  const label = score >= 70 ? "Good" : score >= 40 ? "Fair" : "Needs attention";
  const labelColor = score >= 70 ? "success" : score >= 40 ? "warning" : "error";

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Stack spacing={3} alignItems="center">
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 500 }}>
            Financial Health Score
          </Typography>
          <Box sx={{ position: "relative", width: 180, height: 180 }}>
            <svg viewBox="0 0 180 180" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
              <circle cx="90" cy="90" r={radius} fill="none" stroke={theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"} strokeWidth={stroke} />
              <circle cx="90" cy="90" r={radius} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={circumference - filled} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.3s ease" }} />
            </svg>
            <Box sx={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <Typography variant="h2" sx={{ fontWeight: 700, lineHeight: 1 }}>{score}</Typography>
              <Typography variant="caption" color="text.secondary">out of 100</Typography>
            </Box>
          </Box>
          <Chip label={label} color={labelColor} size="small" sx={{ fontWeight: 600 }} />
        </Stack>
      </CardContent>
    </Card>
  );
}

function InsightCard({ insight }: { insight: Insight }) {
  const router = useRouter();
  const theme = useTheme();

  const borderColor =
    insight.severity === "positive"
      ? theme.palette.success.light
      : insight.severity === "warning"
      ? theme.palette.warning.light
      : theme.palette.divider;

  const iconBg =
    insight.severity === "positive"
      ? theme.palette.success.light
      : insight.severity === "warning"
      ? theme.palette.warning.light
      : theme.palette.primary.light;

  const iconColor =
    insight.severity === "positive"
      ? theme.palette.success.dark
      : insight.severity === "warning"
      ? theme.palette.warning.dark
      : theme.palette.primary.main;

  return (
    <Card
      variant="outlined"
      sx={{
        width: "100%",
        borderColor,
        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        "&:hover": {
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 2px 8px rgba(0,0,0,0.3)"
              : "0 2px 8px rgba(0,0,0,0.06)",
        },
      }}
    >
      <CardContent sx={{ py: { xs: 2, sm: 2.5 }, px: { xs: 2.5, sm: 3 } }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box
            sx={{
              mt: 0.25,
              width: 36,
              height: 36,
              borderRadius: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: alpha(iconBg, 0.5),
              color: iconColor,
              flexShrink: 0,
            }}
          >
            {insight.icon}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              {insight.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
              {insight.description}
            </Typography>
            {insight.action && (
              <Button
                size="small"
                startIcon={<OpenInNewRoundedIcon sx={{ fontSize: 14 }} />}
                onClick={() => router.push(insight.action!.path)}
                sx={{ mt: 1, textTransform: "none", fontWeight: 500 }}
              >
                {insight.action.label}
              </Button>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function StatBlock({ icon, label, value, color, secondary }: { icon: React.ReactNode; label: string; value: string; color: "success" | "error" | "primary" | "warning"; secondary?: string }) {
  return (
    <Card variant="outlined" sx={{ flex: 1, minWidth: { xs: 0, sm: 150 }, transition: "border-color 0.15s ease", "&:hover": { borderColor: `${color}.main` } }}>
      <CardContent sx={{ py: 2.5, px: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Stack spacing={1.25}>
          <Box sx={{ width: 36, height: 36, borderRadius: 1.5, display: "flex", alignItems: "center", justifyContent: "center", color: `${color}.main`, backgroundColor: alpha(color === "success" ? "#2e7d32" : color === "error" ? "#d32f2f" : color === "warning" ? "#ed6c02" : "#1976d2", 0.08) }}>
            {icon}
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>{value}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>{label}</Typography>
          {secondary && <Typography variant="caption" color={`${color}.main`} sx={{ fontWeight: 500 }}>{secondary}</Typography>}
        </Stack>
      </CardContent>
    </Card>
  );
}

function AnomalyCard({ anomaly }: { anomaly: SpendingAnomaly }) {
  return (
    <Card variant="outlined" sx={{ width: "100%", borderColor: "error.light" }}>
      <CardContent sx={{ py: 2, px: 2.5 }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box sx={{ mt: 0.25, width: 36, height: 36, borderRadius: 1.5, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: alpha("#d32f2f", 0.08), color: "error.main", flexShrink: 0 }}>
            <NotificationImportantRoundedIcon />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Unusual transaction</Typography>
              <Chip label={`${anomaly.multiplier.toFixed(1)}x average`} size="small" color="error" sx={{ height: 20, fontSize: "0.65rem" }} />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              ₹{anomaly.amount.toLocaleString()} on {anomaly.description} ({anomaly.category}) — your average is ₹{anomaly.avgAmount.toFixed(0)}.
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function RecurringCard({ payment }: { payment: RecurringPayment }) {
  return (
    <Card variant="outlined" sx={{ width: "100%", borderColor: "info.light" }}>
      <CardContent sx={{ py: 2, px: 2.5 }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box sx={{ mt: 0.25, width: 36, height: 36, borderRadius: 1.5, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: alpha("#1976d2", 0.08), color: "primary.main", flexShrink: 0 }}>
            <AutorenewRoundedIcon />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{payment.description}</Typography>
              <Chip label={payment.frequency} size="small" variant="outlined" sx={{ height: 20, fontSize: "0.65rem" }} />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              ~₹{payment.avgAmount.toLocaleString()} per {payment.frequency.slice(0, -2)}ly · {payment.occurrences} occurrences · ₹{payment.totalSpent.toLocaleString()} total
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <Stack spacing={3} sx={{ width: "100%" }}>
      <Skeleton variant="rounded" height={280} sx={{ borderRadius: 1 }} />
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={130} sx={{ flex: 1, borderRadius: 1 }} />
        ))}
      </Stack>
      <Skeleton variant="rounded" height={28} width={220} sx={{ borderRadius: 1, mt: 1 }} />
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} variant="rounded" height={88} sx={{ borderRadius: 1 }} />
      ))}
    </Stack>
  );
}

function EmptyState() {
  return (
    <Stack alignItems="center" spacing={2} sx={{ py: 10, px: 2 }} role="status">
      <SentimentDissatisfiedRoundedIcon sx={{ fontSize: 56, color: "text.disabled" }} />
      <Typography variant="h6" color="text.secondary">No transaction data yet</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", maxWidth: 360 }}>
        Start logging your income and expenses to see personalized financial insights and your health score.
      </Typography>
    </Stack>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card variant="outlined" sx={{ width: "100%" }} role="alert">
      <CardContent sx={{ py: 6, px: 3 }}>
        <Stack alignItems="center" spacing={2}>
          <ErrorOutlineRoundedIcon sx={{ fontSize: 48, color: "error.main" }} />
          <Typography variant="h6" color="error.main">Failed to load financial data</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", maxWidth: 360 }}>{message}</Typography>
          <Button variant="outlined" startIcon={<RefreshRoundedIcon />} onClick={onRetry} sx={{ mt: 1 }}>Try again</Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function FeedbackContent(props: { disableCustomTheme?: boolean }) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [score, setScore] = React.useState(0);
  const [insights, setInsights] = React.useState<Insight[]>([]);
  const [stats, setStats] = React.useState<{ totalAdded: number; totalSpent: number; latestBalance: number } | null>(null);
  const [anomalies, setAnomalies] = React.useState<SpendingAnomaly[]>([]);
  const [recurring, setRecurring] = React.useState<RecurringPayment[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = React.useState<CategoryBreakdown[]>([]);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("Not authenticated");

      const [summary, transactions] = await Promise.all([
        fetchUserSummary(uid),
        transactionDetails(uid),
      ]);

      const extracted = {
        added: summary.dailyStats.map((s) => s.added),
        spent: summary.dailyStats.map((s) => s.spent),
        balance: summary.dailyStats.map((s) => s.balance),
        cash: summary.dailyStats.map((s) => s.cash),
        upi: summary.dailyStats.map((s) => s.upi),
      };

      const totalAdded = extracted.added.reduce((a, b) => a + b, 0);
      const totalSpent = extracted.spent.reduce((a, b) => a + b, 0);

      const result = computeInsights(extracted, summary.latestBalance, transactions);
      setScore(result.score);
      setInsights(result.insights);
      setStats({ totalAdded, totalSpent, latestBalance: summary.latestBalance });
      setAnomalies(detectSpendingAnomalies(transactions));
      setRecurring(detectRecurringPayments(transactions));
      setCategoryBreakdown(computeCategoryBreakdown(transactions));
    } catch (err) {
      console.error("Feedback error:", err);
      setError(err instanceof Error ? err.message : "Failed to load financial data.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const positiveInsights = insights.filter((i) => i.severity === "positive");
  const warningInsights = insights.filter((i) => i.severity === "warning");
  const neutralInsights = insights.filter((i) => i.severity === "neutral");

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu />
        <AppNavbar page="AI Feedback" />
        <Box component="main" sx={(theme) => ({ flexGrow: 1, backgroundColor: alpha(theme.palette.background.default, 1), overflow: "auto" })}>
          <Stack spacing={3} sx={{ px: { xs: 1.5, sm: 3 }, pb: 5, mt: { xs: 8, md: 0 } }}>
            <Header page="AI Feedback" />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
              <InfoRoundedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                Insights are generated from your transaction data over the last 30 days.
              </Typography>
            </Box>

            {loading && <LoadingSkeleton />}
            {error && !loading && <ErrorState message={error} onRetry={fetchData} />}
            {!loading && !error && stats === null && <EmptyState />}

            {!loading && !error && stats !== null && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "320px 1fr" },
                  gap: 3,
                  width: "100%",
                }}
              >
                {/* Left column: Score gauge */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <ScoreGauge score={score} />
                </Box>

                {/* Right column: Stats + Insights */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ width: "100%" }}>
                    <StatBlock icon={<TrendingUpRoundedIcon />} label="Income (30d)" value={`₹${stats.totalAdded.toLocaleString()}`} color="success" />
                    <StatBlock icon={<TrendingDownRoundedIcon />} label="Expenses (30d)" value={`₹${stats.totalSpent.toLocaleString()}`} color="error" secondary={stats.totalAdded > 0 ? `${((stats.totalSpent / stats.totalAdded) * 100).toFixed(0)}% of income` : undefined} />
                    <StatBlock icon={<AccountBalanceRoundedIcon />} label="Current Balance" value={`₹${stats.latestBalance.toLocaleString()}`} color="primary" />
                  </Stack>

                  <Box sx={{ width: "100%" }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Insights & Recommendations</Typography>
                    {positiveInsights.length > 0 && <Stack spacing={1.5} sx={{ mb: 2.5 }}>{positiveInsights.map((insight) => <InsightCard key={insight.id} insight={insight} />)}</Stack>}
                    {warningInsights.length > 0 && <Stack spacing={1.5} sx={{ mb: 2.5 }}>{warningInsights.map((insight) => <InsightCard key={insight.id} insight={insight} />)}</Stack>}
                    {neutralInsights.length > 0 && <Stack spacing={1.5}>{neutralInsights.map((insight) => <InsightCard key={insight.id} insight={insight} />)}</Stack>}
                    {insights.length === 0 && <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: "center" }}>No insights available for the current period.</Typography>}
                  </Box>
                </Box>
              </Box>
            )}

            {/* Full-width sections below the grid */}
            {!loading && !error && stats !== null && (
              <Stack spacing={3} sx={{ width: "100%" }}>
                {categoryBreakdown.length > 0 && (
                  <Card variant="outlined" sx={{ width: "100%" }}>
                    <CardContent>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                        <CategoryRoundedIcon sx={{ fontSize: 20, color: "text.secondary" }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Spending by Category</Typography>
                      </Stack>
                      <Stack spacing={1.5}>
                        {categoryBreakdown.slice(0, 6).map((item) => (
                          <Stack key={item.category} direction="row" spacing={1.5} alignItems="center">
                            <Typography variant="body2" sx={{ flex: 1, minWidth: 0, fontWeight: 500 }}>{item.category}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>₹{item.total.toLocaleString()}</Typography>
                            <Box sx={{ width: { xs: 50, sm: 80 }, height: 6, borderRadius: 3, bgcolor: "action.hover", overflow: "hidden", flexShrink: 0 }}>
                              <Box sx={{ width: `${item.percentage}%`, height: "100%", borderRadius: 3, bgcolor: "primary.main" }} />
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ minWidth: 32, textAlign: "right", flexShrink: 0 }}>{item.percentage.toFixed(0)}%</Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                )}

                {anomalies.length > 0 && (
                  <Box sx={{ width: "100%" }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>Spending Anomalies</Typography>
                    <Stack spacing={1.5}>
                      {anomalies.map((a) => <AnomalyCard key={a.id} anomaly={a} />)}
                    </Stack>
                  </Box>
                )}

                {recurring.length > 0 && (
                  <Box sx={{ width: "100%" }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>Recurring Payments</Typography>
                    <Stack spacing={1.5}>
                      {recurring.map((r) => <RecurringCard key={r.description} payment={r} />)}
                    </Stack>
                  </Box>
                )}
              </Stack>
            )}
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}

export default withAuth(FeedbackContent);
