

import * as React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import MainGrid from './Extras/dashboard/components/MainGrid';
import SideMenu from './Extras/dashboard/components/SideMenu';
import AppTheme from './Extras/shared-theme/AppTheme';
import { styled } from '@mui/system';
import Grid from '@mui/material/Grid2';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from './Extras/dashboard/theme/customizations';
import { ComponenteArticulos } from '../view/articulo';
import { ComponenteProveedores } from '../view/proveedor';
import { ComponenteClientes } from '../view/Cliente';
import NotificarUsuario from '../view/alerta';
import AppNavbar from './Extras/dashboard/components/AppNavbar';
import Header from './Extras/dashboard/components/Header';
import { CssBaseline } from '@mui/material';
import { ComponenteCompras } from '../view/compras';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export default function Dashboard(props) {

  return (
    <>
      <AppTheme {...props} themeComponents={xThemeComponents}>
        <CssBaseline enableColorScheme />
        <Box sx={{ display: 'flex' }}>
          <HashRouter>
            <SideMenu />

            <AppNavbar />
            {/* Main content */}
            <Box
              component="main"
              sx={(theme) => ({
                flexGrow: 1,
                backgroundColor: theme.vars
                  ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                  : alpha(theme.palette.background.default, 1),
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
                {/*  CABECERA */}
                <Header />
                {/* Componente de graficos  */}
                {/* <MainGrid />  */}

                <Routes>
                  <Route path="/" element={<MainGrid />} />
                  <Route path="/articulo" element={<ComponenteArticulos />} />
                  <Route path="/proveedor" element={<ComponenteProveedores />} />
                  <Route path="/alerta" element={<NotificarUsuario />} />
                  <Route path="/clientes" element={<ComponenteClientes />} />
                  <Route path="/compras" element={<ComponenteCompras />} />
                </Routes>


              </Stack>
            </Box>
          </HashRouter >

        </Box>
      </AppTheme>

    </>

  );
}


