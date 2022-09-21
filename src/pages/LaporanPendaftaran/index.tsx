import { downloadLaporanPendaftaran, queryLaporanPendaftaran } from '@/services/baksos/LaporanController';
import { ParseResponseError } from '@/utils/requests';
import { PageContainer } from '@ant-design/pro-components';
import { Access, useAccess } from '@umijs/max';
import { Button, notification, Table } from 'antd';
import { useEffect, useState } from 'react';
import Text from 'antd/lib/typography'
import { ColumnsType } from 'antd/es/table';
import { downloadFile } from '@/utils/common';

const LaporanPendaftaranPage: React.FC = () => {
  const [laporanPendaftaran, setLaporanPendaftaran] = useState<any>()

  const getLaporanPendaftaran = () => {
    queryLaporanPendaftaran()
      .then(data => {
        setLaporanPendaftaran(data)
      })
      .catch(err => {
        notification["warning"]({ message: 'Penarikan Laporan Pendaftaran Gagal', description: ParseResponseError(err), placement: "bottomRight" });
      })
  }

  const downloadReport = () => {
    downloadLaporanPendaftaran()
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
    getLaporanPendaftaran()
  }, [])

  if (!laporanPendaftaran) return <Text>Loading</Text>

  const columns: ColumnsType<LaporanPendaftaranType> = [
    {
      title: 'DAERAH',
      dataIndex: 'DAERAH',
      key: 'DAERAH',
    },
    {
      title: 'PYTERIGIUM',
      dataIndex: 'PYTERIGIUM',
      key: 'PYTERIGIUM',
    },
    {
      title: 'KATARAK',
      dataIndex: 'KATARAK',
      key: 'KATARAK',
    },
    {
      title: 'BENJOLAN',
      dataIndex: 'BENJOLAN',
      key: 'BENJOLAN',
    },
    {
      title: 'HERNIA',
      dataIndex: 'HERNIA',
      key: 'HERNIA',
    },
    {
      title: 'SUMBING',
      dataIndex: 'SUMBING',
      key: 'SUMBING',
    },
  ];

  const data: LaporanPendaftaranType[] = laporanPendaftaran;

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

export default LaporanPendaftaranPage;
