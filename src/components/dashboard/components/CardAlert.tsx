import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { useState } from 'react';

export default function CardAlert() {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');

  const [loading, setLoading] = useState(true);

const fetchQuote = async () => {
  setLoading(true);
  try {
    const response = await fetch('/api/quoteApi');
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    setQuote(data.quote);
    setAuthor(data.author);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(String(error));
    }
  } finally {
    setLoading(false);
  }
};

React.useEffect(() => {
  fetchQuote();
}, []);

return (
  <Card variant="outlined" sx={{ m: 1.5, flexShrink: 0 }}>
    <CardContent>
      <AutoAwesomeRoundedIcon fontSize="small" />
      <Typography gutterBottom sx={{ fontWeight: 600 }}>
        Words to Inspire
      </Typography>
      {loading ? (
        <Typography variant="body2" sx={{ mb: 0, color: 'text.secondary' }}>
          Loading...
        </Typography>
      ) : (
        <Typography variant="body2" sx={{ mb: 0, color: 'text.secondary' }}>
          {quote}<br /><br />
          {`${author}`}
        </Typography>
      )}
    </CardContent>
  </Card>
);
}
