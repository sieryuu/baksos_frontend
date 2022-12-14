import { queryPasienById, queryPasienByNoAntrianAndPenyakit } from '@/services/baksos/PasienController';
import { queryPasienScreening } from '@/services/baksos/ScreeningPasienController';
import { queryPenyakit } from '@/services/baksos/ReferensiController';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { useSearchParams } from '@umijs/max';
import { useParams } from '@umijs/max';
import { Radio, Input, Space, Typography, RadioChangeEvent, notification, Button } from 'antd';
import { useEffect, useState } from 'react';
import ScreeningPasienPage from './screening_pasien';
import { history } from 'umi';

const { Search } = Input
const { Text } = Typography


const ScreeningPage: React.FC = () => {
  const urlParams = useParams()
  // let [searchParams, setSearchParams] = useSearchParams();
  const [pasien, setPasien] = useState<PasienType>()
  const [pasienScreening, setPasienScreening] = useState<ScreeningPasienType>();
  const [selectedPenyakit, setSelectedPenyakit] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const retrievePasien = async () => {
    if (urlParams.id) {
      const penyakits = await queryPenyakit()

      queryPasienById(urlParams.id)
        .then(data => {
          setPasien(data)
          setSearchValue(data.nomor_antrian || "")
          setSelectedPenyakit(penyakits.find(f => f.nama == data.penyakit)?.grup || "")
        })
      queryPasienScreening(urlParams.id)
        .then(data => {
          setPasienScreening(data[0])
        })
        .catch(() => { })
    }
  }

  // console.log(urlParams)
  // console.log(searchParams.get('penyakit'))

  const searchPasienByNomorAntrian = (value: string) => {
    if (!selectedPenyakit) {
      notification["warning"]({
        message: 'Silahkan pilih penyakit untuk lanjut',
        description: 'Silahkan klik salah satu penyakit untuk mencari.',
        placement: "bottomRight"
      });
      return
    }

    queryPasienByNoAntrianAndPenyakit(selectedPenyakit, value)
      .then(data => {
        if (data.length > 1) {
          notification["warning"]({
            message: 'Please find administrator!!!',
            description: 'Found multiple records when searching pasien by nomor antrian',
            placement: "bottomRight"
          });
          return
        }
        if (data.length == 1) {
          history.push(`/screening/${data[0].id}`)
        } else {
          notification["warning"]({
            message: 'Pasien tidak ditemukan',
            description: `Pasien tidak ditemukan dengan nomor antrian [${value}] dan penyakit grup [${selectedPenyakit}]`,
            placement: "bottomRight"
          });
          setPasien(undefined)
        }
      })
  }

  const handlePenyakitChanged = (e: RadioChangeEvent) => {
    setSelectedPenyakit(e.target.value)
    setPasien(undefined)
  }

  useEffect(() => {
    retrievePasien()
  }, [urlParams])

  return (
    <PageContainer ghost extra={[
      <Button key="ke_halamat_pasien" onClick={() => history.push(`/pasien/${pasien?.id}`)}>Ke Detail Pasien</Button>,
    ]}>
      <ProCard direction="column" ghost gutter={[0, 8]}>
        <ProCard title="Pencarian" layout="default" bordered >
          <Space>
            <Radio.Group onChange={handlePenyakitChanged} value={selectedPenyakit} buttonStyle="solid">
              <Radio.Button value="KATARAK" style={{ backgroundColor: selectedPenyakit == "KATARAK" ? "red" : "white" }}>
                <Text strong style={{ color: selectedPenyakit == "KATARAK" ? "white" : "red" }}>Katarak</Text>
              </Radio.Button>
              <Radio.Button value="BENJOLAN" style={{ backgroundColor: selectedPenyakit == "BENJOLAN" ? "green" : "white" }}>
                <Text strong style={{ color: selectedPenyakit == "BENJOLAN" ? "white" : "green" }}>Benjolan</Text>
              </Radio.Button>
              <Radio.Button value="HERNIA" style={{ backgroundColor: selectedPenyakit == "HERNIA" ? "blue" : "white" }}>
                <Text strong style={{ color: selectedPenyakit == "HERNIA" ? "white" : "blue" }}>Hernia</Text>
              </Radio.Button>
              <Radio.Button value="SUMBING" style={{ backgroundColor: selectedPenyakit == "SUMBING" ? "orange" : "white" }}>
                <Text strong style={{ color: selectedPenyakit == "SUMBING" ? "white" : "orange" }}>Sumbing</Text>
              </Radio.Button>
            </Radio.Group>
            <Search
              addonBefore="No. Antrian"
              placeholder="masukan nomor antrian..."
              allowClear
              autoFocus
              onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
              onSearch={searchPasienByNomorAntrian}
              style={{ width: 300 }}
            />
          </Space>
        </ProCard>
        {
          pasien && pasien.id &&
          <ScreeningPasienPage pasien={pasien} pasienScreening={pasienScreening || {} as ScreeningPasienType} retrievePasien={retrievePasien} />
        }
      </ProCard>

    </PageContainer>
  );
};

export default ScreeningPage;
