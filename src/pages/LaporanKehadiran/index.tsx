import { downloadLaporanKehadiran, queryLaporanKehadiran } from '@/services/baksos/LaporanController';
import { ParseResponseError } from '@/utils/requests';
import { PageContainer } from '@ant-design/pro-components';
import { Access, useAccess } from '@umijs/max';
import { Button, Checkbox, notification, Select, Table } from 'antd';
import { useEffect, useState } from 'react';
import Text from 'antd/lib/typography'
import { ColumnsType } from 'antd/es/table';
import { downloadFile } from '@/utils/common';

const LaporanKehadiranPage: React.FC = () => {
  const [laporanKehadiran, setLaporanKehadiran] = useState<any>()
  const [tanggalReport, setTanggalReport] = useState<string>()

  const getLaporanKehadiran = (tgl: string) => {
    queryLaporanKehadiran(tgl)
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
    if (tanggalReport)
      getLaporanKehadiran(tanggalReport)
  }, [tanggalReport])

  // if (!laporanKehadiran) return <Text>Loading</Text>

  const columns: ColumnsType<LaporanKehadiranTypeTable> = [
    {
      title: 'PUSKESMAS',
      dataIndex: 'PUSKESMAS',
      key: 'PUSKESMAS',
    },
    {
      title: 'PULAU',
      dataIndex: 'PULAU',
      key: 'PULAU',
    },
    {
      title: 'KATARAK',
      dataIndex: 'KATARAK',
      key: 'KATARAK',
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
    {
      title: 'BENJOLAN',
      dataIndex: 'BENJOLAN',
      key: 'BENJOLAN',
    },
    {
      title: 'TOTAL',
      dataIndex: 'TOTAL',
      key: 'TOTAL',
    },
  ];

  const data: LaporanKehadiranTypeTable[] = laporanKehadiran;

  return (
    <PageContainer ghost>
      <Select onChange={(value) => setTanggalReport(value)} style={{ width: 300 }}>
        <Select.Option value={"2022-09-24"}>24-09-2022</Select.Option>
        <Select.Option value={"2022-09-25"}>25-09-2022</Select.Option>
      </Select>
      {
        laporanKehadiran &&
        <Table
          size='small'
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={{ pageSize: 100 }}
        />
      }
    </PageContainer>
  );
};

export default LaporanKehadiranPage;
