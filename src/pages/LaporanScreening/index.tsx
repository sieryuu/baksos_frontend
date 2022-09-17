import { queryLaporanScreening } from '@/services/baksos/LaporanController';
import { ParseResponseError } from '@/utils/requests';
import { PageContainer } from '@ant-design/pro-components';
import { Access, useAccess } from '@umijs/max';
import { Button, notification, Table } from 'antd';
import { useEffect, useState } from 'react';
import Text from 'antd/lib/typography'
import { ColumnsType } from 'antd/es/table';

const ScreeningPage: React.FC = () => {
  const [laporanScreening, setLaporanScreening] = useState<any>()

  const getLaporanScreening = () => {
    queryLaporanScreening()
      .then(data => {
        setLaporanScreening(data)
      })
      .catch(err => {
        notification["warning"]({ message: 'Penarikan Laporan Screening Gagal', description: ParseResponseError(err) });
      })
  }

  useEffect(() => {
    getLaporanScreening()
  }, [])

  if (!laporanScreening) return <Text>Loading</Text>

  const columns: ColumnsType<LaporanScreeningTypeTable> = [
    {
      title: 'Diagnosa',
      dataIndex: 'diagnosa',
      key: 'diagnosa',
    },
    {
      title: 'Total Hadir',
      dataIndex: 'total_hadir',
      key: 'total_hadir',
    },
    {
      title: 'Total Pasien Hadir',
      dataIndex: 'total_pasien_hadir',
      key: 'total_pasien_hadir',
    },
    {
      title: 'Total Kehadiran Hari Pertama',
      dataIndex: 'total_kehadiran_hari_pertama',
      key: 'total_kehadiran_hari_pertama',
    },
    {
      title: 'Total Kehadiran Pendaftaran',
      dataIndex: 'total_kehadiran_pendaftaran',
      key: 'total_kehadiran_pendaftaran',
    },
    {
      title: 'Total Kehadiran Fisik',
      dataIndex: 'total_kehadiran_fisik',
      key: 'total_kehadiran_fisik',
    },
    {
      title: 'Total Kehadiran Mata',
      dataIndex: 'total_kehadiran_mata',
      key: 'total_kehadiran_mata',
    },
    {
      title: 'Total Kehadiran Lab',
      dataIndex: 'total_kehadiran_lab',
      key: 'total_kehadiran_lab',
    },
    {
      title: 'Total Kehadiran Radiologi',
      dataIndex: 'total_kehadiran_radiologi',
      key: 'total_kehadiran_radiologi',
    },
    {
      title: 'Total Kehadiran EKG',
      dataIndex: 'total_kehadiran_ekg',
      key: 'total_kehadiran_ekg',
    },
    {
      title: 'Total Kehadiran Hari Kedua',
      dataIndex: 'total_kehadiran_hari_kedua',
      key: 'total_kehadiran_hari_kedua',
    },
    {
      title: 'Total Kehadiran Rescreening',
      dataIndex: 'total_kehadiran_rescreening',
      key: 'total_kehadiran_rescreening',
    },
  ];

  const data: LaporanScreeningTypeTable[] = Object.keys(laporanScreening).map(key => {
    return {
      diagnosa: key,
      ...laporanScreening[key]
    }
  });

  return (
    <PageContainer ghost>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
      />

    </PageContainer>
  );
};

export default ScreeningPage;
