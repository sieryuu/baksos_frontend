import { PageContainer } from '@ant-design/pro-components';
import type { ColumnsType } from 'antd/es/table';
import { Button, Card, Input, notification, Space, Table, Upload } from 'antd';
import { history } from 'umi';
import Title from 'antd/lib/typography/Title';
import { getPasienTemplate, importPasien, queryPasienByNoSeri, queryPasienList } from '@/services/baksos/PasienController';
import { useEffect, useState } from 'react';
import { downloadFile } from '@/utils/common';
import { UploadOutlined } from '@ant-design/icons';
import { AxiosResponse } from '@umijs/max';

const { Search } = Input

const ListPasienPage: React.FC = () => {
  // const access = useAccess();
  const [pasiens, setPasiens] = useState<PasienType[]>([]);

  const getPasienList = () => {
    queryPasienList()
      .then(data => {
        setPasiens(data)
      })
  }

  useEffect(() => {
    getPasienList();
  }, [])

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
        });
      })
  }

  const searchPasien = (value: string) => {
    queryPasienByNoSeri(value)
      .then(data => {
        if (data.length == 1) {
          history.push(`/pasien/${data[0].id}`)
        }
        setPasiens(data)
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
        <Space>
          <Search
            addonBefore="Nomor Seri Formulir"
            placeholder="masukan nomor seri formulir..."
            allowClear
            autoFocus
            onSearch={searchPasien}
            style={{ width: 400 }}
          />
        </Space>
      </Card>
      <Card>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
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
