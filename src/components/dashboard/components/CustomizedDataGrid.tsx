'use client';

import * as React from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { transactionDetails, Transaction } from '@src/utils/fetchDataFB';
import { auth, db } from '@src/firebaseConfig';
import { Timestamp, doc, deleteDoc } from 'firebase/firestore';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { GridActionsCellItem } from '@mui/x-data-grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  addTransactionAndUpdateStats,
  deleteTransactionAndUpdateStats,
} from '@utils/transaction';

// After adding or deleting, call your shared `refresh()` hook to reload both transactions and stats.
// await addTransactionAndUpdateStats(uid, { amount, type, mode, description });
// await deleteTransactionAndUpdateStats(uid, txnId);


interface TransactionRow {
  id: string;               // ← Firestore ID (hidden)
  amount: number;
  type: 'Saving' | 'Spent';
  mode: 'UPI' | 'Cash';
  description: string;
  timestamp: string;
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

export default function CustomizedDataGrid() {
  const [rows, setRows] = React.useState<TransactionRow[]>([]);
  const [selectionModel, setSelectionModel] = React.useState<GridRowSelectionModel>([]);

  // Fetch & map rows on mount
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
          description: txn.description || '—',
          timestamp: txn.timestamp.toDate().toLocaleString(),
        }))
      );
    })();
  }, []);

  // Delete a single row by its Firestore ID
  const handleDeleteRow = async (docId: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    await deleteTransactionAndUpdateStats(uid, docId);
    setRows((prev) => prev.filter((row) => row.id !== docId));
  };

  const columns: GridColDef[] = [
    {
      field: 'serial',
      headerName: '#',
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
    { field: 'description', headerName: 'Description', flex: 2 },
    { field: 'timestamp', headerName: 'Timestamp', flex: 1.5 },
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 60,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteOutlineIcon />}
          label="Delete"
          onClick={() => handleDeleteRow(params.id as string)}
          color="error"
        />,
      ],
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={(newModel) =>
          setSelectionModel(newModel)
        }
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        initialState={{
          pagination: { paginationModel: { pageSize: 30 } },
        }}
        pageSizeOptions={[10, 30, 50]}
        density="compact"
        disableColumnMenu
      />
    </Box>
  );
}
