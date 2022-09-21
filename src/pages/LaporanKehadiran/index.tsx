import { downloadLaporanKehadiran, queryLaporanKehadiran } from '@/services/baksos/LaporanController';
import { ParseResponseError } from '@/utils/requests';
import { PageContainer } from '@ant-design/pro-components';
import { Access, useAccess } from '@umijs/max';
import { Button, notification, Table } from 'antd';
import { useEffect, useState } from 'react';
import Text from 'antd/lib/typography'
import { ColumnsType } from 'antd/es/table';
import { downloadFile } from '@/utils/common';

const LaporanKehadiranPage: React.FC = () => {
  const [laporanKehadiran, setLaporanKehadiran] = useState<any>()

  const getLaporanKehadiran = () => {
    queryLaporanKehadiran()
      .then(data => {
        setLaporanKehadiran(data)
      })
      .catch(err => {
        notification["warning"]({ message: 'Penarikan Laporan Kehadiran Gagal', description: ParseResponseError(err), placement: "bottomRight" });
      })
  }

  const downloadReport = () => {
    downloadLaporanKehadiran()
      .then(data => {
        downloadFile(data)
      })
      .catch(err => {
        notification["warning"]({
          message: `Download Gagal`,
          description: ParseResponseError(err),
          placement: "bottomRight"
        });
      })
  }

  useEffect(() => {
    getLaporanKehadiran()
  }, [])

  if (!laporanKehadiran) return <Text>Loading</Text>

  const columns: ColumnsType<LaporanKehadiranTypeTable> = [
    {
      title: 'Diagnosa',
      dataIndex: 'diagnosa',
      key: 'diagnosa',
    },
    {
      title: 'Total Daftar',
      dataIndex: 'total_daftar',
      key: 'total_daftar'
    },
    {
      title: 'Total Tidak Hadir',
      dataIndex: 'total_tidak_hadir',
      key: 'total_tidak_hadir'
    },
    {
      title: 'Total Pasien Hadir',
      dataIndex: 'total_pasien_hadir',
      key: 'total_pasien_hadir'
    },
    {
      title: 'Total Kehadiran Hari Pertama',
      dataIndex: 'total_kehadiran_hari_pertama',
      key: 'total_kehadiran_hari_pertama'
    },
    {
      title: 'Total Kehadiran Pendaftaran',
      dataIndex: 'total_kehadiran_pendaftaran',
      key: 'total_kehadiran_pendaftaran'
    },
    {
      title: 'Total Kehadiran Fisik',
      dataIndex: 'total_kehadiran_fisik',
      key: 'total_kehadiran_fisik'
    },
    {
      title: 'Total Kehadiran Mata',
      dataIndex: 'total_kehadiran_mata',
      key: 'total_kehadiran_mata'
    },
    {
      title: 'Total Kehadiran Lab',
      dataIndex: 'total_kehadiran_lab',
      key: 'total_kehadiran_lab'
    },
    {
      title: 'Total Kehadiran Radiologi',
      dataIndex: 'total_kehadiran_radiologi',
      key: 'total_kehadiran_radiologi'
    },
    {
      title: 'Total Kehadiran Ekg',
      dataIndex: 'total_kehadiran_ekg',
      key: 'total_kehadiran_ekg'
    },
    {
      title: 'Total Kehadiran Hari Kedua',
      dataIndex: 'total_kehadiran_hari_kedua',
      key: 'total_kehadiran_hari_kedua'
    },
    {
      title: 'Total Kehadiran Rescreening',
      dataIndex: 'total_kehadiran_rescreening',
      key: 'total_kehadiran_rescreening'
    },
  ];

  const data: LaporanKehadiranTypeTable[] = Object.keys(laporanKehadiran).map(key => {
    return {
      diagnosa: key,
      ...laporanKehadiran[key]
    }
  });

  return (
    <PageContainer ghost extra={[
      <Button key="download_report" onClick={downloadReport}>Download Report</Button>,
    ]}>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
      />

    </PageContainer>
  );
};

export default LaporanKehadiranPage;
