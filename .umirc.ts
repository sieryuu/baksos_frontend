import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'Baksos Tzuchi',
  },
  routes: [
    {
      path: '/',
      redirect: '/daftar-pasien',
    },
    {
      name: 'Pendaftaran Pasien',
      path: '/daftar-pasien',
      component: './DaftarPasien',
    },
    {
      name: 'List Pasien',
      path: '/pasien',
      component: './Pasien',
    },
    {
      name: 'Pasien',
      path: '/pasien/:id',
      component: './Pasien/[id]',
      hideInMenu: true
    },
    {
      name: 'Screening',
      path: '/screening',
      component: './Screening',
    },
    {
      name: 'Screening Pasien',
      path: '/screening/:id',
      component: './Screening',
      hideInMenu: true
    },
    {
      name: 'Laporan Pendaftaran',
      path: '/laporan-pendaftaran',
      component: './LaporanPendaftaran',
    },
    {
      name: 'Laporan Kehadiran',
      path: '/laporan-kehadiran',
      component: './LaporanKehadiran',
    },
    {
      name: 'Laporan Screening',
      path: '/laporan-screening',
      component: './LaporanScreening',
    },
    {
      name: 'Login',
      path: '/login',
      component: './Login',
      headerRender: false,
      hideInMenu: true
    },
    {
      name: 'Table',
      path: '/table',
      component: './Table',
      hideInMenu: true
    },
  ],
  npmClient: 'yarn',
});
