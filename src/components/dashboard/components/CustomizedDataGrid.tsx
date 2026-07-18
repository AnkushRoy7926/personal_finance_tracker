'use client';

import * as React from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { transactionDetails, Transaction } from '@src/utils/fetchDataFB';
import { auth } from '@src/firebaseConfig';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { GridActionsCellItem } from '@mui/x-data-grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  deleteTransactionAndUpdateStats,
} from '@utils/transaction';

interface TransactionRow {
  id: string;
  amount: number;
  type: 'Saving' | 'Spent';
  mode: 'UPI' | 'Cash';
  category: string;
  description: string;
  timestamp: Date;
  day: string;
}

function renderStatus(status: 'UPI' | 'Cash' | 'Saving' | 'Spent') {
  const colors: Record<string, 'success' | 'default' | 'error'> = {
    UPI: 'success',
    Cash: 'default',
    Saving: 'success',
    Spent: 'error',
  };
  return <Chip label={status} color={colors[status]} size="small" />;
}

function MobileTransactionCard({
  row,
  index,
  onDelete,
}: {
  row: TransactionRow;
  index: number;
  onDelete: (id: string) => void;
}) {
  const isToday = React.useMemo(() => {
    const d = new Date(row.timestamp);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  }, [row.timestamp]);

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent sx={{ py: 2, px: 2.5, '&:last-child': { pb: 2 } }}>
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="caption" color="text.secondary">
                #{index + 1}
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {row.description}
              </Typography>
            </Stack>
            {isToday && (
              <IconButton size="small" color="error" onClick={() => onDelete(row.id)}>
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" gap={0.5}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: row.type === 'Saving' ? 'success.main' : 'error.main',
              }}
            >
              {row.type === 'Saving' ? '+' : '-'}₹{row.amount.toLocaleString()}
            </Typography>
            {renderStatus(row.type)}
            {renderStatus(row.mode)}
            <Chip label={row.category} size="small" variant="outlined" />
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {row.day}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function CustomizedDataGrid() {
  const [rows, setRows] = React.useState<TransactionRow[]>([]);
  const [selectionModel, setSelectionModel] = React.useState<GridRowSelectionModel>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  React.useEffect(() => {
    (async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const txns: Transaction[] = await transactionDetails(uid);
      setRows(
        txns.map((txn) => ({
          id: txn.id,
          amount: txn.amount,
          type: txn.type,
          mode: txn.mode,
          category: txn.category || 'Other',
          description: txn.description || '—',
          timestamp: txn.timestamp.toDate() || null,
          day: txn.timestamp.toDate().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }) + " " + txn.day,
        }))
      );
    })();
  }, []);

  const handleDeleteRow = async (docId: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    await deleteTransactionAndUpdateStats(uid, docId);
    setRows((prev) => prev.filter((row) => row.id !== docId));
  };

  if (isMobile) {
    return (
      <Stack spacing={1.5} sx={{ width: '100%' }}>
        {rows.map((row, i) => (
          <MobileTransactionCard
            key={row.id}
            row={row}
            index={i}
            onDelete={handleDeleteRow}
          />
        ))}
        {rows.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No transactions yet.
          </Typography>
        )}
      </Stack>
    );
  }

  const columns: GridColDef[] = [
    {
      field: 'serial',
      headerName: 'No.',
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    { field: 'amount', headerName: 'Amount', flex: 1, type: 'number' },
    {
      field: 'type',
      headerName: 'Type',
      align: 'center',
      headerAlign: 'center',
      flex: 0.8,
      renderCell: (params) => renderStatus(params.value as any),
    },
    {
      field: 'mode',
      headerName: 'Mode',
      flex: 0.8,
      renderCell: (params) => renderStatus(params.value as any),
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 0.8,
      renderCell: (params) => <Chip label={params.value} size="small" variant="outlined" />,
    },
    { field: 'description', headerName: 'Description', flex: 2 },
    { field: 'day', headerName: 'Date', flex: 1.5 },
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 60,
      getActions: (params) => {
        const txnDate = new Date(params.row.timestamp);
        const today = new Date();
        const isSameDay =
          txnDate.getFullYear() === today.getFullYear() &&
          txnDate.getMonth() === today.getMonth() &&
          txnDate.getDate() === today.getDate();

        if (!isSameDay) return [];

        return [
          <GridActionsCellItem
            icon={<DeleteOutlineIcon />}
            label="Delete"
            onClick={() => handleDeleteRow(params.id as string)}
            color="error"
          />,
        ];
      },
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        rowHeight={65}
        checkboxSelection
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={(newModel) => setSelectionModel(newModel)}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        initialState={{
          pagination: { paginationModel: { pageSize: 30 } },
        }}
        pageSizeOptions={[10, 30, 50]}
        density="compact"
      />
    </Box>
  );
}
