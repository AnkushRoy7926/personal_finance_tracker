import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import Skeleton from '@mui/material/Skeleton';

const FALLBACK_QUOTES = [
  { quote: "A budget is telling your money where to go instead of wondering where it went.", author: "Dave Ramsey" },
  { quote: "The art of saving is the art of investing in your future self.", author: "Mokokoma Mokhonoana" },
  { quote: "Do not save what is left after spending, but spend what is left after saving.", author: "Warren Buffett" },
  { quote: "Financial freedom is available to those who learn about it and work for it.", author: "Robert Kiyosaki" },
];

let cachedQuote: { quote: string; author: string } | null = null;

export default function CardAlert() {
  const [quote, setQuote] = React.useState('');
  const [author, setAuthor] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const fetchQuote = React.useCallback(async () => {
    if (cachedQuote) {
      setQuote(cachedQuote.quote);
      setAuthor(cachedQuote.author);
      setLoading(false);
      setError(false);
      return;
    }

    setLoading(true);
    setError(false);
    try {
      const response = await fetch('/api/quoteApi', { next: { revalidate: 3600 } } as any);
      const data = await response.json();

      if (data.error || !data.quote) {
        throw new Error(data.error || 'No quote received');
      }

      cachedQuote = { quote: data.quote, author: data.author };
      setQuote(data.quote);
      setAuthor(data.author);
    } catch {
      const fallback = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
      cachedQuote = fallback;
      setQuote(fallback.quote);
      setAuthor(fallback.author);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  return (
    <Card variant="outlined" sx={{ m: 1.5, flexShrink: 0, mt: 0 }}>
      <CardContent>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <AutoAwesomeRoundedIcon fontSize="small" color="primary" />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Words to Inspire
            </Typography>
          </Stack>
          <IconButton
            size="small"
            onClick={() => { cachedQuote = null; fetchQuote(); }}
            aria-label="Refresh quote"
            sx={{ ml: 'auto' }}
          >
            <RefreshRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
        {loading ? (
          <Stack spacing={0.5}>
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="60%" />
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            &ldquo;{quote}&rdquo;
            <br />
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              — {author}
            </Typography>
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
