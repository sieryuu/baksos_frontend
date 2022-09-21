import { downloadLaporanScreening, queryLaporanScreening } from '@/services/baksos/LaporanController';
import { ParseResponseError } from '@/utils/requests';
import { PageContainer } from '@ant-design/pro-components';
import { Access, useAccess } from '@umijs/max';
import { Button, notification, Table } from 'antd';
import { useEffect, useState } from 'react';
import Text from 'antd/lib/typography'
import { ColumnsType } from 'antd/es/table';
import { downloadFile } from '@/utils/common';

const LaporanScreeningPage: React.FC = () => {
  const [laporanScreening, setLaporanScreening] = useState<any>()

  const getLaporanScreening = () => {
    queryLaporanScreening()
      .then(data => {
        setLaporanScreening(data)
      })
      .catch(err => {
        notification["warning"]({ message: 'Penarikan Laporan Screening Gagal', description: ParseResponseError(err), placement: "bottomRight" });
      })
  }

  const downloadReport = () => {
    downloadLaporanScreening()
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
      title: 'Total Pasien Lolos Kk',
      dataIndex: 'total_pasien_lolos_kk',
      key: 'total_pasien_lolos_kk'
    },
    {
      title: 'Total Pasien Lolos Kk Hari Pertama',
      dataIndex: 'total_pasien_lolos_kk_hari_pertama',
      key: 'total_pasien_lolos_kk_hari_pertama'
    },
    {
      title: 'Total Pasien Lolos Kk Hari Kedua',
      dataIndex: 'total_pasien_lolos_kk_hari_kedua',
      key: 'total_pasien_lolos_kk_hari_kedua'
    },
    {
      title: 'Total Tidak Lolos',
      dataIndex: 'total_tidak_lolos',
      key: 'total_tidak_lolos'
    },
    {
      title: 'Tidak Lulus Tensi',
      dataIndex: 'tidak_lulus_tensi',
      key: 'tidak_lulus_tensi'
    },
    {
      title: 'Tidak Lulus Fisik',
      dataIndex: 'tidak_lulus_fisik',
      key: 'tidak_lulus_fisik'
    },
    {
      title: 'Tidak Lulus Mata',
      dataIndex: 'tidak_lulus_mata',
      key: 'tidak_lulus_mata'
    },
    {
      title: 'Tidak Lulus Kk',
      dataIndex: 'tidak_lulus_kk',
      key: 'tidak_lulus_kk'
    },
    {
      title: 'Total Pending Kk',
      dataIndex: 'total_pending_kk',
      key: 'total_pending_kk'
    },
    {
      title: 'Lolos Pending Hari Pertama',
      dataIndex: 'lolos_pending_hari_pertama',
      key: 'lolos_pending_hari_pertama'
    },
    {
      title: 'Lolos Pending Hari Kedua',
      dataIndex: 'lolos_pending_hari_kedua',
      key: 'lolos_pending_hari_kedua'
    },
  ];

  const data: LaporanScreeningTypeTable[] = Object.keys(laporanScreening).map(key => {
    return {
      diagnosa: key,
      ...laporanScreening[key]
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

export default LaporanScreeningPage;
