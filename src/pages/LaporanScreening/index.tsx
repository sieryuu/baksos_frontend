import { downloadLaporanScreening, queryLaporanScreening } from '@/services/baksos/LaporanController';
import { ParseResponseError } from '@/utils/requests';
import { PageContainer } from '@ant-design/pro-components';
import { Access, useAccess } from '@umijs/max';
import { Button, notification, Select, Table } from 'antd';
import { useEffect, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { downloadFile } from '@/utils/common';

const LaporanScreeningPage: React.FC = () => {
  const [laporanScreening, setLaporanScreening] = useState<any>()
  const [tanggalReport, setTanggalReport] = useState<string>()

  const getLaporanScreening = (tgl: string) => {
    queryLaporanScreening(tgl)
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
    if (tanggalReport)
      getLaporanScreening(tanggalReport)
  }, [tanggalReport])

  const columns: ColumnsType<LaporanScreeningTypeTable> = [
    {
      "title": "SCREENING",
      "dataIndex": "SCREENING"
    },
    {
      "title": "KATARAK",
      "dataIndex": "KATARAK"
    },
    {
      "title": "PTERYGIUM",
      "dataIndex": "PTERYGIUM"
    },
    {
      "title": "HERNIA",
      "dataIndex": "HERNIA"
    },
    {
      "title": "SUMBING",
      "dataIndex": "SUMBING"
    },
    {
      "title": "BENJOLAN",
      "dataIndex": "BENJOLAN"
    },
    {
      "title": "MINOR GA",
      "dataIndex": "MINOR GA"
    },
    {
      "title": "MINOR LOKAL",
      "dataIndex": "MINOR LOKAL"
    },
  ];

  const data: LaporanScreeningTypeTable[] = laporanScreening;

  return (
    <PageContainer ghost >
      <Select onChange={(value) => setTanggalReport(value)} style={{ width: 300 }}>
        <Select.Option value={"2022-09-24"}>24-09-2022</Select.Option>
        <Select.Option value={"2022-09-25"}>25-09-2022</Select.Option>
      </Select>
      {
        laporanScreening &&
        <Table
          size='small'
          columns={columns}
          dataSource={data}
          rowKey="id"
        />
      }

    </PageContainer>
  );
};

export default LaporanScreeningPage;
