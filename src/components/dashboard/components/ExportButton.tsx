import * as React from 'react';
import Button from '@mui/material/Button';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { Transaction } from '@src/utils/fetchDataFB';
import { exportTransactionsToCSV, downloadCSV } from '@src/utils/financeAnalytics';

interface ExportButtonProps {
  transactions: Transaction[];
}

export default function ExportButton({ transactions }: ExportButtonProps) {
  const handleExport = () => {
    const csv = exportTransactionsToCSV(transactions);
    const date = new Date().toISOString().split('T')[0];
    downloadCSV(`transactions_${date}.csv`, csv);
  };

  return (
    <Button
      variant="outlined"
      size="small"
      startIcon={<DownloadRoundedIcon />}
      onClick={handleExport}
      disabled={transactions.length === 0}
      aria-label="Export transactions as CSV"
    >
      Export CSV
    </Button>
  );
}
