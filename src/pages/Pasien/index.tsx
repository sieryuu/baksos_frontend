import { PageContainer } from '@ant-design/pro-components';
import type { ColumnsType } from 'antd/es/table';
import { Button, Card, Input, notification, Space, Table, TablePaginationConfig, Tooltip, Upload } from 'antd';
import { history } from 'umi';
import Title from 'antd/lib/typography/Title';
import { getPasienTemplate, importPasien, queryPasienByNoSeri, queryPasienList, searchPasien } from '@/services/baksos/PasienController';
import { useEffect, useState } from 'react';
import { downloadFile } from '@/utils/common';
import { CopyOutlined, UploadOutlined } from '@ant-design/icons';
import { AxiosResponse } from '@umijs/max';
import { FilterValue, SorterResult } from 'antd/es/table/interface';
import copy from 'copy-to-clipboard';

const { Search } = Input

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

const ListPasienPage: React.FC = () => {
  // const access = useAccess();
  const [pasiens, setPasiens] = useState<PasienType[]>([]);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const getPasienList = () => {
    queryPasienList(tableParams.pagination?.current || 1, tableParams.pagination?.pageSize || 10)
      .then(data => {
        setPasiens(data.results)
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: data.count
          }
        })
      })
  }

  useEffect(() => {
    getPasienList();
  }, [tableParams.pagination?.current])

  const downloadTemplate = () => {
    getPasienTemplate().then((data) => {
      downloadFile(data)
    })
  }

  const handleImport = (uploadRequest: any) => {
    importPasien(uploadRequest.file)
      .then(data => {
        notification["success"]({
          message: 'Import sukses',
          description: (data as AxiosResponse).data,
          placement: "bottomRight"
        });
        getPasienList();
      })
      .catch(err => {
        let errDescription = ""
        if (typeof err.response.data === typeof "")
          errDescription = err.response.data
        else {
          for (let k in err.response.data) {
            errDescription += `${k}: ${err.response.data[k]}`
          }
        }

        notification["warning"]({
          message: 'Import Gagal',
          description: errDescription,
          placement: "bottomRight"
        });
      })
  }

  const searchPasienByNoSeri = (value: string) => {
    queryPasienByNoSeri(value)
      .then(data => {
        if (data.length == 1) {
          history.push(`/pasien/${data[0].id}`)
        }
        setPasiens(data)
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: data.length
          }
        })
      });
  }

  const searchPasienByParam = (value: string) => {
    searchPasien(value)
      .then(data => {
        setPasiens(data)
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: data.length
          }
        })
      });
  }

  const columns: ColumnsType<PasienType> = [
    {
      title: 'No.Seri',
      dataIndex: 'nomor_seri',
      key: 'nomor_seri',
    },
    {
      title: 'Nama',
      dataIndex: 'nama',
      key: 'nama',
    },
    {
      title: 'JK',
      dataIndex: 'jenis_kelamin',
      key: 'jenis_kelamin',
    },
    {
      title: 'Tanggal Lahir',
      dataIndex: 'tanggal_lahir',
      key: 'tanggal_lahir',
    },
    {
      title: 'Penyakit',
      dataIndex: 'penyakit',
      key: 'penyakit',
    },
    {
      title: 'Puskesmas',
      dataIndex: 'puskesmas',
      key: 'puskesmas',
    },
    {
      title: 'Nomor Identitas',
      dataIndex: 'nomor_identitas',
      key: 'nomor_identitas',
    },
    {
      title: 'Nomor Telepon',
      dataIndex: 'nomor_telepon',
      key: 'nomor_telepon',
    },
    {
      title: 'Alamat',
      dataIndex: 'alamat',
      key: 'alamat',
    },
    {
      title: 'No. Antrian',
      dataIndex: "nomor_antrian",
    },
    {
      title: 'No. Kartu Kuning',
      dataIndex: ['kartukuning', 'nomor'],
    },
    // {
    //   title: 'Copy',
    //   render: (text, record) => (
    //     <Tooltip title="copy">
    //       <Button onClick={(e) => {
    //         e.stopPropagation()
    //         copy([
    //           record.nomor_seri,
    //           record.nama,
    //           record.jenis_kelamin,
    //           record.tanggal_lahir,
    //           record.penyakit,
    //           record.nomor_identitas,
    //           record.nomor_telepon,
    //           record.alamat,
    //           record.nomor_antrian,
    //           record.kartukuning.nomor
    //         ].join('\t'))
    //       }}
    //         shape="circle" icon={<CopyOutlined />} />
    //     </Tooltip>
    //   ),
    // },
  ];

  const data: PasienType[] = pasiens;

  return (
    <PageContainer ghost extra={[
      <Button key="download_template" onClick={downloadTemplate}>Download Template</Button>,
      <Upload key="import_template" name="import" listType="text" customRequest={handleImport} showUploadList={false}>
        <Button type='primary' icon={<UploadOutlined />}>Import</Button>
      </Upload>
    ]}>
      <Card>
        <Title level={5}>Pencarian:</Title>
        <Space direction='vertical'>
          <Search
            addonBefore="Nomor Seri Formulir"
            placeholder="masukan nomor seri formulir..."
            allowClear
            autoFocus
            onSearch={searchPasienByNoSeri}
            style={{ width: 600 }}
          />
          <Search
            addonBefore="Nama / No. Identitas / No. Telepon"
            placeholder=""
            allowClear
            onSearch={searchPasienByParam}
            style={{ width: 800 }}
          />
        </Space>
      </Card>
      <Card>
        <Table
          columns={columns}
          dataSource={data}
          pagination={tableParams.pagination}
          rowKey="id"
          onChange={(pagination) => {
            setTableParams({
              pagination,
            });
          }}
          onRow={(record, rowIndex) => {
            return {
              onClick: event => history.push(`/pasien/${record.id}`)
            }
          }}
        />
      </Card>
    </PageContainer>
  );
};

export default ListPasienPage;
