import * as React from 'react';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';

export default function StaticDateDisplay() {
  const today = dayjs().format('MMM DD, YYYY');

  return (
    <Button
      variant="outlined"
      size="small"
      startIcon={<CalendarTodayRoundedIcon fontSize="small" />}
      sx={{ minWidth: 'fit-content', pointerEvents: 'none', cursor: 'default' }}
    >
      {today}
    </Button>
  );
}
