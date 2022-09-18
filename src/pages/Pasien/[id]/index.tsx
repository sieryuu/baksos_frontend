import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, notification, Row, Space, Typography } from 'antd';
import {
  Form,
  Input,
  SubmitButton,
} from 'formik-antd';
import PasienForm from '@/components/PasienForm';
import { useEffect, useRef, useState } from 'react';
import { useParams } from '@umijs/max';
import { batalNomorAntrian, queryPasienById, updatePasienHadir } from '@/services/baksos/PasienController';
import { Formik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { history } from 'umi';
import FormStatusPasien from '@/print_template/FormStatusPasien';
import ReactToPrint from 'react-to-print';
import { ParseResponseError } from '@/utils/requests';

const { Text, Link } = Typography;

const PasienDetailPage: React.FC = () => {
  const printRef = useRef(null);
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

  const cancelNomorAntrian = () => {
    if (pasien.id)
      batalNomorAntrian(pasien.id)
        .then(data => {
          notification["success"]({ message: `Cancel Kehadiran Pasien Berhasil`, description: data });
          retrievePasien()
        }).catch(err => {
          notification["warning"]({ message: `Cancel Kehadiran Pasien Gagal`, description: ParseResponseError(err) });
        })
  }

  const pasienSudahDaftar = pasien.nomor_antrian != null
  const pasienAbsenHariIni = (moment(pasien.tanggal_nomor_antrian, "YYYY-MM-DD").isSame(moment(), "day"))
  const pasienPerluRescreenHariIni = pasien.perlu_rescreen && (pasienAbsenHariIni == false)

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
                nomor_antrian: pasienPerluRescreenHariIni ? "" : (pasien.nomor_antrian || '')
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
                  <Space style={{ marginBottom: 0 }}>
                    <Form.Item name="nomor_antrian" label="Nomor Antrian">
                      <Input name='nomor_antrian' style={{ width: 150 }} autoFocus disabled={pasienSudahDaftar && !isEditNomorAntrian && !pasienPerluRescreenHariIni} />
                    </Form.Item>
                    {
                      pasienSudahDaftar && !pasienPerluRescreenHariIni ?
                        <>
                          <Form.Item name="print">
                            <ReactToPrint
                              trigger={() => <Button type='primary'>PRINT FORM STATUS SCREENING PASIEN</Button>}
                              content={() => printRef.current}
                            />
                          </Form.Item>
                        </>
                        :
                        <Form.Item name="submit">
                          <SubmitButton type='primary'>{pasien.perlu_rescreen ? "RESCREEN" : "Simpan & Hadir"}</SubmitButton>
                        </Form.Item>
                    }

                  </Space>
                </Row>
                <Row justify='center'>
                  {
                    pasienSudahDaftar && pasienAbsenHariIni &&
                    <Button type='link' danger size='small' onClick={cancelNomorAntrian}>Cancel Kehadiran</Button>
                  }
                </Row>
              </Form>
            </Formik>
          }
        </Card>
        <Card>
          <PasienForm IsCreate={false} Pasien={pasien} PasienStateChanged={stateChangedHandler} />
        </Card>
      </Space>
      <div style={{ display: "none" }}><FormStatusPasien ref={printRef} pasien={pasien} /></div>
    </PageContainer>
  );
};

export default PasienDetailPage;

const kehadiranValidationSchema = Yup.object().shape({
  nomor_antrian: Yup.string().required('Wajib Isi')
});