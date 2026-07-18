import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';

interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  deadline: string;
}

interface SavingsGoalsCardProps {
  currentSavings: number;
}

const STORAGE_KEY = 'pf_savings_goals';

function loadGoals(): SavingsGoal[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGoals(goals: SavingsGoal[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

export default function SavingsGoalsCard({
  currentSavings,
}: SavingsGoalsCardProps) {
  const [goals, setGoals] = React.useState<SavingsGoal[]>([]);
  const [adding, setAdding] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const [newTarget, setNewTarget] = React.useState<number | ''>('');
  const [newDeadline, setNewDeadline] = React.useState('');

  React.useEffect(() => {
    setGoals(loadGoals());
  }, []);

  const addGoal = () => {
    if (!newName.trim() || newTarget === '' || newTarget <= 0) return;
    const updated = [
      ...goals,
      {
        id: Date.now().toString(),
        name: newName.trim(),
        target: newTarget,
        deadline: newDeadline,
      },
    ];
    setGoals(updated);
    saveGoals(updated);
    setAdding(false);
    setNewName('');
    setNewTarget('');
    setNewDeadline('');
  };

  const removeGoal = (id: string) => {
    const updated = goals.filter((g) => g.id !== id);
    setGoals(updated);
    saveGoals(updated);
  };

  const canAdd =
    newName.trim().length > 0 &&
    newTarget !== '' &&
    newTarget > 0;

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
            Savings Goals
          </Typography>
          {!adding && (
            <IconButton
              size="small"
              onClick={() => setAdding(true)}
              aria-label="Add savings goal"
            >
              <AddRoundedIcon fontSize="small" />
            </IconButton>
          )}
          {adding && (
            <IconButton
              size="small"
              onClick={() => {
                setAdding(false);
                setNewName('');
                setNewTarget('');
                setNewDeadline('');
              }}
              aria-label="Cancel adding savings goal"
            >
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>

        {adding && (
          <Stack spacing={1.5} sx={{ mb: 2.5 }}>
            <TextField
              size="small"
              label="Goal name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              fullWidth
              autoFocus
            />
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                type="number"
                label="Target (₹)"
                value={newTarget}
                onChange={(e) =>
                  setNewTarget(
                    e.target.value === ''
                      ? ''
                      : parseFloat(e.target.value)
                  )
                }
                inputProps={{ min: 1 }}
                sx={{ flex: 1 }}
              />
              <TextField
                size="small"
                type="date"
                label="Deadline"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1 }}
              />
            </Stack>
            <Button
              variant="contained"
              size="small"
              onClick={addGoal}
              disabled={!canAdd}
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
            <EmojiEventsRoundedIcon
              sx={{ fontSize: 36, color: 'text.disabled' }}
            />
            <Typography variant="body2" color="text.secondary">
              No savings goals yet.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Set a target to track your progress.
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={2}>
            {goals.map((goal) => {
              const pct =
                goal.target > 0
                  ? Math.min(
                      (currentSavings / goal.target) * 100,
                      100
                    )
                  : 0;
              const reached = currentSavings >= goal.target;

              let daysLeft: number | null = null;
              if (goal.deadline) {
                const diff =
                  (new Date(goal.deadline).getTime() -
                    Date.now()) /
                  86400000;
                daysLeft = Math.max(0, Math.ceil(diff));
              }

              return (
                <Box
                  key={goal.id}
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    border: 1,
                    borderColor: reached
                      ? 'success.light'
                      : 'divider',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                    >
                      <FlagRoundedIcon
                        sx={{
                          fontSize: 18,
                          color: reached
                            ? 'success.main'
                            : 'primary.main',
                        }}
                      />
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600 }}
                        >
                          {goal.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          ₹
                          {currentSavings.toLocaleString()} / ₹
                          {goal.target.toLocaleString()}
                          {daysLeft !== null &&
                            ` · ${daysLeft} days left`}
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.5}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: reached
                            ? 'success.main'
                            : 'text.secondary',
                        }}
                      >
                        {pct.toFixed(0)}%
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => removeGoal(goal.id)}
                        aria-label={`Remove ${goal.name} goal`}
                      >
                        <DeleteOutlineRoundedIcon
                          sx={{ fontSize: 16 }}
                        />
                      </IconButton>
                    </Stack>
                  </Stack>
                  <Box
                    sx={{
                      mt: 1,
                      height: 6,
                      borderRadius: 3,
                      bgcolor: 'action.hover',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${pct}%`,
                        height: '100%',
                        borderRadius: 3,
                        bgcolor: reached
                          ? 'success.main'
                          : 'primary.main',
                        transition: 'width 0.8s ease',
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
