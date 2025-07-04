"use client";

// import React from "react";
import withAuth from "@utils/protectRoutes";
import * as React from 'react';
import CustomizedDataGrid from "@src/components/dashboard/components/CustomizedDataGrid";
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-data-grid/themeAugmentation';
import type {} from '@mui/x-tree-view/themeAugmentation';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from "@src/components/dashboard/components/AppNavbar";
import Header from "@src/components/dashboard/components/Header";

import SideMenu from "@src/components/dashboard/components/SideMenu";
import AppTheme from '@src/components/shared-theme/AppTheme';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from '@src/components/dashboard/theme/customizations';
import Typography from "@mui/material/Typography";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

const trans = (props: { disableCustomTheme?: boolean }) => {
  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
          
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
            >
            <Header page="Transactions"/>
            <Box sx={{display: 'flex', alignItems: 'left', width: '100%'}}>

            <Typography sx={{fontWeight: 600, fontSize: '1.5rem', color: 'text.primary'}}>
              Transactions
            </Typography>
            </Box>
            <CustomizedDataGrid/>
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
};

export default withAuth(trans);
