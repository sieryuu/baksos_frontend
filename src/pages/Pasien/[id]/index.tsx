import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Col, notification, Row, Space, Typography } from 'antd';
import {
  Form,
  Input,
  SubmitButton,
} from 'formik-antd';
import PasienForm from '@/components/PasienForm';
import { useEffect, useState } from 'react';
import { useParams } from '@umijs/max';
import { queryPasienById, updatePasienHadir } from '@/services/baksos/PasienController';
import { Formik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { history } from 'umi';

const { Text, Link } = Typography;

const PasienDetailPage: React.FC = () => {
  const [pasien, setPasien] = useState<PasienType>()
  const [isEditNomorAntrian, setIsEditNomorAntrian] = useState<boolean>(false)
  const urlParams = useParams()

  const retrievePasien = () => {
    if (urlParams.id)
      queryPasienById(urlParams.id)
        .then(data => {
          setPasien({
            ...data,
            ...{ tanggal_lahir_moment: moment(data.tanggal_lahir, 'YYYY-MM-DD') }
          })
        })
  }

  useEffect(() => {
    retrievePasien()
  }, [])

  const stateChangedHandler = () => {
    retrievePasien()
  }

  const handleSubmit = (values: any, actions: any) => {
    if (pasien && pasien.id) {
      updatePasienHadir(pasien?.id, values.nomor_antrian)
        .then(data => {
          notification["success"]({
            message: `Kehadiran pasien berhasil ditambahkan`,
            description: data as string,
          });
          retrievePasien()
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
            message: `Submit Antrian Gagal`,
            description: errDescription,
          });
        })
        .finally(() => {
          actions.setSubmitting(false)
        })
    }
  }

  if (!pasien) {
    return <span>loading...</span>
  }
  const pasienSudahDaftar = pasien.nomor_antrian != null

  return (
    <PageContainer ghost extra={[
      <Button key="ke_halaman_screening" onClick={() => history.push(`/screening/${pasien.id}`)}>Ke Halaman Screening</Button>,
    ]}>
      <Space direction='vertical'>
        <Card title="Kehadiran Pasien">
          {
            <Formik
              enableReinitialize
              initialValues={{
                nomor_antrian: pasien.nomor_antrian || ''
              }}
              onSubmit={handleSubmit}
              validationSchema={kehadiranValidationSchema}
            >
              <Form>
                <Row justify='center'>
                  {
                    pasienSudahDaftar &&
                    <Text>Hadir pada tanggal: {moment(pasien.tanggal_nomor_antrian).format('YYYY-MM-DD HH:mm:ss')}</Text>
                  }
                </Row>
                <Row justify='center'>
                  <Space>
                    <Form.Item name="nomor_antrian" label="Nomor Antrian">
                      <Input name='nomor_antrian' style={{ width: 150 }} autoFocus disabled={pasienSudahDaftar && !isEditNomorAntrian} />
                    </Form.Item>
                    {
                      pasienSudahDaftar ?
                        <>
                          <Form.Item name="print">
                            <Button type='primary'>PRINT FORM STATUS PASIEN SCREENING</Button>
                          </Form.Item>
                        </>
                        :
                        <Form.Item name="submit">
                          <SubmitButton type='primary'>Simpan &amp; Hadir</SubmitButton>
                        </Form.Item>
                    }
                  </Space>
                </Row>
              </Form>
            </Formik>
          }
        </Card>
        <Card>
          <PasienForm IsCreate={false} Pasien={pasien} PasienStateChanged={stateChangedHandler} />
        </Card>
      </Space>
    </PageContainer>
  );
};

export default PasienDetailPage;

const kehadiranValidationSchema = Yup.object().shape({
  nomor_antrian: Yup.string().required('Wajib Isi')
});