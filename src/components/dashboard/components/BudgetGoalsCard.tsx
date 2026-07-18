import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import {
  TRANSACTION_CATEGORIES,
  TransactionCategory,
} from '@src/utils/fetchDataFB';

interface BudgetGoal {
  id: string;
  category: TransactionCategory;
  limit: number;
}

interface BudgetGoalsCardProps {
  currentSpending: number;
  categorySpending: Map<string, number>;
}

const STORAGE_KEY = 'pf_budget_goals';

function loadGoals(): BudgetGoal[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGoals(goals: BudgetGoal[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

export default function BudgetGoalsCard({
  currentSpending,
  categorySpending,
}: BudgetGoalsCardProps) {
  const [goals, setGoals] = React.useState<BudgetGoal[]>([]);
  const [adding, setAdding] = React.useState(false);
  const [newCat, setNewCat] =
    React.useState<TransactionCategory>('Food');
  const [newLimit, setNewLimit] = React.useState<number | ''>('');

  React.useEffect(() => {
    setGoals(loadGoals());
  }, []);

  const addGoal = () => {
    if (newLimit === '' || newLimit <= 0) return;
    const duplicate = goals.some((g) => g.category === newCat);
    if (duplicate) return;
    const updated = [
      ...goals,
      { id: Date.now().toString(), category: newCat, limit: newLimit },
    ];
    setGoals(updated);
    saveGoals(updated);
    setAdding(false);
    setNewLimit('');
    setNewCat('Food');
  };

  const removeGoal = (id: string) => {
    const updated = goals.filter((g) => g.id !== id);
    setGoals(updated);
    saveGoals(updated);
  };

  const usedCategories = new Set(goals.map((g) => g.category));
  const availableCategories = TRANSACTION_CATEGORIES.filter(
    (c) => !usedCategories.has(c)
  );

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography component="h2" variant="subtitle2">
            Budget Goals
          </Typography>
          {!adding && (
            <IconButton
              size="small"
              onClick={() => setAdding(true)}
              aria-label="Add budget goal"
            >
              <AddRoundedIcon fontSize="small" />
            </IconButton>
          )}
          {adding && (
            <IconButton
              size="small"
              onClick={() => {
                setAdding(false);
                setNewLimit('');
                setNewCat('Food');
              }}
              aria-label="Cancel adding budget goal"
            >
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>

        {adding && (
          <Stack spacing={1.5} sx={{ mb: 2.5 }}>
            <FormControl size="small" fullWidth>
              <InputLabel id="budget-cat-label">Category</InputLabel>
              <Select
                labelId="budget-cat-label"
                value={newCat}
                label="Category"
                onChange={(e) =>
                  setNewCat(e.target.value as TransactionCategory)
                }
              >
                {availableCategories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              size="small"
              type="number"
              label="Monthly limit (₹)"
              value={newLimit}
              onChange={(e) =>
                setNewLimit(
                  e.target.value === ''
                    ? ''
                    : parseFloat(e.target.value)
                )
              }
              inputProps={{ min: 1 }}
              fullWidth
            />
            <Button
              variant="contained"
              size="small"
              onClick={addGoal}
              disabled={newLimit === '' || newLimit <= 0}
              fullWidth
            >
              Add Goal
            </Button>
          </Stack>
        )}

        {goals.length === 0 && !adding ? (
          <Stack
            alignItems="center"
            spacing={1.5}
            sx={{ py: 4 }}
            role="status"
          >
            <AccountBalanceRoundedIcon
              sx={{ fontSize: 36, color: 'text.disabled' }}
            />
            <Typography variant="body2" color="text.secondary">
              No budget goals set.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Set limits for each spending category.
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={2}>
            {goals.map((goal) => {
              const spent =
                categorySpending.get(goal.category) ?? 0;
              const pct =
                goal.limit > 0
                  ? Math.min((spent / goal.limit) * 100, 100)
                  : 0;
              const exceeded = spent > goal.limit;

              return (
                <Box key={goal.id}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 0.5 }}
                  >
                    <Stack
                      direction="row"
                      spacing={0.5}
                      alignItems="center"
                    >
                      {exceeded ? (
                        <WarningAmberRoundedIcon
                          sx={{ fontSize: 16, color: 'error.main' }}
                        />
                      ) : pct >= 80 ? (
                        <WarningAmberRoundedIcon
                          sx={{ fontSize: 16, color: 'warning.main' }}
                        />
                      ) : (
                        <CheckCircleRoundedIcon
                          sx={{
                            fontSize: 16,
                            color: 'success.main',
                          }}
                        />
                      )}
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500 }}
                      >
                        {goal.category}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        ₹{spent.toLocaleString()} / ₹
                        {goal.limit.toLocaleString()}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => removeGoal(goal.id)}
                        aria-label={`Remove ${goal.category} budget`}
                      >
                        <DeleteOutlineRoundedIcon
                          sx={{ fontSize: 16 }}
                        />
                      </IconButton>
                    </Stack>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={pct}
                    color={
                      exceeded ? 'error' : pct >= 80 ? 'warning' : 'primary'
                    }
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              );
            })}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
