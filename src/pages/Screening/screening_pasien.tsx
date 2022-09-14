import { patchPasien } from '@/services/baksos/PasienController';
import { CancelEkg, CancelLab, CancelPemeriksaan, CancelRadiologi, CapKehadiranEkg, CapKehadiranLab, CapKehadiranPemeriksaan, CapKehadiranRadiologi, CapKehadiranTensi } from '@/services/baksos/ScreeningPasienController';
import { CheckCircleTwoTone, ClockCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Radio, Input, Space, Card, Typography, Button, Checkbox, DatePicker, notification, Modal, Form } from 'antd';
import Title from 'antd/lib/typography/Title';
import { useFormik } from 'formik';
import moment from 'moment';
import { useState } from 'react';

const { Text } = Typography

interface ScreeningPasienPageProps {
  pasien: PasienType;
  pasienScreening: ScreeningPasienType;
  retrievePasien: any;
}

interface FormItemDisplayProps {
  label: string;
  value: string;
}

interface ProgressIconProps {
  isPass?: boolean;
}

const FormItemDisplay: React.FC<FormItemDisplayProps> = (props) => {
  const { label, value } = props
  return (
    <Form.Item label={label}>
      <Input bordered={false} defaultValue={value} readOnly />
    </Form.Item>
  )
}

const screeningPasienCard: React.CSSProperties = {
  width: '16%',
  textAlign: 'center',
};

const ProgressIcon: React.FC<ProgressIconProps> = (props) => {
  if (props.isPass == null) {
    return <ClockCircleTwoTone />
  }
  if (props.isPass)
    return <CheckCircleTwoTone twoToneColor="#52c41a" />
  return <CloseCircleTwoTone twoToneColor="#eb2f96" />
}

const ScreeningPasienPage: React.FC<ScreeningPasienPageProps> = (props) => {
  const { pasien, pasienScreening, retrievePasien } = props
  const [isLabModalOpen, setIsLabModalOpen] = useState(false)
  const [isRadiologiModalOpen, setIsRadiologiModalOpen] = useState(false)

  //#region Tensi
  const capHadirTensi = (hadir: boolean) => {
    if (pasien.id)
      CapKehadiranTensi({
        hadir: hadir,
        pasien_id: pasien.id
      }).then(data => {
        notification["success"]({ message: `Update Tensi Berhasil`, description: data });
        retrievePasien()
      }).catch(err => {
        notification["warning"]({ message: `Update Tensi Gagal`, description: err });
      })
  }

  const cancelTensi = () => {

  }
  //#endregion

  //#region Pemeriksaan
  const capHadirPemeriksaan = (hadir: boolean) => {
    if (pasien && pasien.id)
      CapKehadiranPemeriksaan({
        hadir: hadir,
        pasien_id: pasien.id
      }).then(data => {
        notification["success"]({ message: `Update Pemeriksaan Berhasil`, description: data });
        retrievePasien()
      }).catch(err => {
        notification["warning"]({ message: `Update Pemeriksaan Gagal`, description: err });
      })
  }

  const cancelPemeriksaan = () => {
    CancelPemeriksaan(pasienScreening.id)
      .then(data => {
        notification["success"]({ message: `Cancel Pemeriksaan Berhasil`, description: data });
        retrievePasien()
      }).catch(err => {
        notification["warning"]({ message: `Cancel Pemeriksaan Gagal`, description: err });
      })
  }
  //#endregion

  //#region Lab
  const editLabDetail = (values: CapKehadiranLabType) => {
    patchPasien(values.pasien_id, {
      perlu_radiologi: values.perlu_radiologi,
      perlu_ekg: values.perlu_ekg
    })
      .then(data => {
        notification["success"]({ message: `Update Detail Lab Berhasil`, description: "Detail Lab Pasien berhasil di update" })
        retrievePasien()
      })
      .catch(err => notification["warning"]({ message: `Update Detail Lab Gagal`, description: err }))
  }

  const labFormik = useFormik({
    initialValues: {
      pasien_id: 0,
      hadir: true,
      perlu_radiologi: pasien && pasien.perlu_radiologi || false,
      perlu_ekg: pasien && pasien.perlu_ekg || false,
    },
    onSubmit: values => {
      if (pasien && pasien.id) {
        values.pasien_id = pasien.id

        if (pasienScreening?.telah_lewat_cek_lab) {
          editLabDetail(values)
          setIsLabModalOpen(false)
        } else {
          CapKehadiranLab(values).then(data => {
            notification["success"]({ message: `Update Lab Berhasil`, description: data });
            retrievePasien()
          }).catch(err => {
            notification["warning"]({ message: `Update Lab Gagal`, description: err });
          }).finally(() => setIsLabModalOpen(false))
        }
      }
    },
  });

  const cancelLab = () => {
    CancelLab(pasienScreening.id)
      .then(data => {
        notification["success"]({ message: `Cancel Lab Berhasil`, description: data });
        retrievePasien()
      }).catch(err => {
        notification["warning"]({ message: `Cancel Lab Gagal`, description: err });
      })
  }
  //#endregion

  //#region Radiologi
  const capHadirRadiologi = (hadir: boolean) => {
    if (pasien && pasien.id)
      CapKehadiranRadiologi({
        hadir: hadir,
        pasien_id: pasien.id
      }).then(data => {
        notification["success"]({ message: `Update Radiologi Berhasil`, description: data });
        retrievePasien()
      }).catch(err => {
        notification["warning"]({ message: `Update Radiologi Gagal`, description: err });
      })
  }

  const radiologiFormik = useFormik<HasilRadiologiType>({
    initialValues: {
      nomor_kertas_penyerahan: "",
      tipe_hasil_rontgen: ""
    },
    onSubmit: values => {

    },
  });

  const cancelRadiologi = () => {
    CancelRadiologi(pasienScreening.id)
      .then(data => {
        notification["success"]({ message: `Cancel Radiologi Berhasil`, description: data });
        retrievePasien()
      }).catch(err => {
        notification["warning"]({ message: `Cancel Radiologi Gagal`, description: err });
      })
  }
  //#endregion

  //#region Ekg
  const capHadirEkg = (hadir: boolean) => {
    if (pasien && pasien.id)
      CapKehadiranEkg({
        hadir: hadir,
        pasien_id: pasien.id
      }).then(data => {
        notification["success"]({ message: `Update Ekg Berhasil`, description: data });
        retrievePasien()
      }).catch(err => {
        notification["warning"]({ message: `Update Ekg Gagal`, description: err });
      })
  }

  const cancelEkg = () => {
    CancelEkg(pasienScreening.id)
      .then(data => {
        notification["success"]({ message: `Cancel Ekg Berhasil`, description: data });
        retrievePasien()
      }).catch(err => {
        notification["warning"]({ message: `Cancel Ekg Gagal`, description: err });
      })
  }
  //#endregion

  return (
    <>
      <Space direction='vertical'>
        <ProCard title="Data Pasien" layout="default" bordered >
          <Form layout="inline" labelWrap>
            <Space>
              <FormItemDisplay label='Nama Pasien' value={pasien.nama} />
              <FormItemDisplay label='Nomor Identitas' value={pasien.nomor_identitas} />
              <FormItemDisplay label='Tanggal Lahir' value={pasien.tanggal_lahir} />
            </Space>
            <Space>
              <FormItemDisplay label='Jenis Kelamin' value={pasien.jenis_kelamin} />
              <FormItemDisplay label='Nomor Tlp' value={pasien.nomor_telepon} />
              <FormItemDisplay label='Alamat' value={pasien.alamat} />
            </Space>
          </Form>
        </ProCard>
        <Card title="Screening Pasien">
          <Card.Grid style={screeningPasienCard}>
            <Title level={5}>Tensi <ProgressIcon isPass={pasienScreening?.telah_lewat_cek_tensi} /></Title>
            {
              pasienScreening?.telah_lewat_cek_tensi != null ?
                <Space direction='vertical'>
                  <Text>{pasienScreening.telah_lewat_cek_tensi ? 'Hadir' : "Batal"} pada: {moment(pasienScreening.jam_cek_tensi).format('YYYY-MM-DD HH:mm:ss')}</Text>
                  <Button type='link' danger size='small'>Cancel {pasienScreening.telah_lewat_cek_tensi ? 'Kehadiran' : 'Batal'} </Button>
                </Space>
                :
                <Space direction='vertical'>
                  <Button danger onClick={() => capHadirTensi(false)}>BATAL</Button>
                  <Button danger>PENDING</Button>
                </Space>
            }
          </Card.Grid>
          <Card.Grid style={screeningPasienCard}>
            <Title level={5}>Cek Fisik/Mata <ProgressIcon isPass={pasienScreening?.telah_lewat_pemeriksaan} /></Title>
            {
              pasienScreening?.telah_lewat_pemeriksaan != null ?
                <Space direction='vertical'>
                  <Text>{pasienScreening.telah_lewat_pemeriksaan ? 'Hadir' : "Batal"} pada: {moment(pasienScreening.jam_pemeriksaan).format('YYYY-MM-DD HH:mm:ss')}</Text>
                  <Button type='link' danger size='small' onClick={cancelPemeriksaan}>Cancel {pasienScreening.telah_lewat_pemeriksaan ? 'Kehadiran' : 'Batal'} </Button>
                </Space>
                :
                <Space direction='vertical'>
                  <Button type='primary' onClick={() => capHadirPemeriksaan(true)}>HADIR</Button>
                  <Button danger onClick={() => capHadirPemeriksaan(false)}>BATAL</Button>
                </Space>
            }
          </Card.Grid>
          <Card.Grid style={screeningPasienCard}>
            <Title level={5}>LAB <ProgressIcon isPass={pasienScreening?.telah_lewat_cek_lab} /></Title>
            {
              pasienScreening?.telah_lewat_cek_lab != null ?
                <Space direction='vertical'>
                  <Text>{pasienScreening.telah_lewat_cek_lab ? 'Hadir' : "Batal"} pada: {moment(pasienScreening.jam_cek_lab).format('YYYY-MM-DD HH:mm:ss')}</Text>
                  <Button type='link' danger size='small' onClick={cancelLab}>Cancel {pasienScreening.telah_lewat_cek_lab ? 'Kehadiran' : 'Batal'} </Button>
                </Space>
                :
                <Space direction='vertical'>
                  <Button type='primary' onClick={() => setIsLabModalOpen(true)}>HADIR</Button>
                </Space>
            }
          </Card.Grid>
          <Card.Grid style={screeningPasienCard}>
            <Title level={5}>RADIOLOGY <ProgressIcon isPass={pasienScreening?.telah_lewat_cek_radiologi} /></Title>
            {
              pasienScreening?.telah_lewat_cek_radiologi != null ?
                <Space direction='vertical'>
                  <Text>{pasienScreening.telah_lewat_cek_radiologi ? 'Hadir' : "Batal"} pada: {moment(pasienScreening.jam_cek_radiologi).format('YYYY-MM-DD HH:mm:ss')}</Text>
                  <Button type='link' danger size='small' onClick={cancelRadiologi}>Cancel {pasienScreening.telah_lewat_cek_radiologi ? 'Kehadiran' : 'Batal'} </Button>
                </Space>
                :
                <Space direction='vertical'>
                  <Button type='primary' disabled={!pasien.perlu_radiologi} onClick={() => capHadirRadiologi(true)}>HADIR</Button>
                </Space>
            }
          </Card.Grid>
          <Card.Grid style={screeningPasienCard}>
            <Title level={5}>EKG <ProgressIcon isPass={pasienScreening?.telah_lewat_cek_ekg} /></Title>
            {
              pasienScreening?.telah_lewat_cek_ekg != null ?
                <Space direction='vertical'>
                  <Text>{pasienScreening.telah_lewat_cek_ekg ? 'Hadir' : "Batal"} pada: {moment(pasienScreening.jam_cek_ekg).format('YYYY-MM-DD HH:mm:ss')}</Text>
                  <Button type='link' danger size='small' onClick={cancelEkg}>Cancel {pasienScreening.telah_lewat_cek_ekg ? 'Kehadiran' : 'Batal'} </Button>
                </Space>
                :
                <Space direction='vertical'>
                  <Button type='primary' disabled={!pasien.perlu_ekg} onClick={() => capHadirEkg(true)}>HADIR</Button>
                </Space>
            }
          </Card.Grid>
          <Card.Grid style={screeningPasienCard}>
            <Title level={5}>Kartu Kuning <ClockCircleTwoTone /></Title>
            <Space direction='vertical'>
              <Button type='primary'>LOLOS</Button>
              <Button type='ghost'>PENDING</Button>
              <Button danger>BATAL</Button>
            </Space>
          </Card.Grid>
        </Card>
        <ProCard title="LAB" layout="default" bordered>
          {
            pasienScreening.telah_lewat_cek_lab != null ?
              <Space>
                <Checkbox disabled checked={pasien.perlu_radiologi}>RADIOLOGY</Checkbox>
                <Checkbox disabled checked={pasien.perlu_ekg}>EKG</Checkbox>
                <Button type='primary' onClick={() => setIsLabModalOpen(true)}>Edit</Button>
              </Space>
              :
              <Text>Belum hadir LAB</Text>
          }
        </ProCard>
        <ProCard title="RADIOLOGY" layout="default" bordered>
          {
            pasienScreening.telah_lewat_cek_radiologi != null ?
              <Form>
                <Space direction='vertical'>
                  <Radio.Group onChange={() => { }} value="">
                    <Radio value={3}>USB</Radio>
                    <Radio value={4}>PRINT</Radio>
                  </Radio.Group>
                  <Form.Item name="nomor_kertas_penyerahan" label="Nomor Kertas Penyerahan USB RONTGEN">
                    <Input name='nomor_kertas_penyerahan' />
                  </Form.Item>
                  <Button type='primary' onClick={() => setIsRadiologiModalOpen(true)}>Edit</Button>
                </Space>
              </Form>
              :
              <Text>Belum hadir Radiologi</Text>
          }
        </ProCard>
        <ProCard title="Kartu Kuning" layout="default" bordered>
          {
            pasienScreening.telah_lewat_cek_kartu_kuning != null ?
              <Space direction='vertical'>
                <Form>
                  <Form.Item name="nomor_kartu_kuning" label="Nomor Kartu Kuning">
                    <Input name='nomor_kartu_kuning' disabled style={{ width: 100 }} />
                  </Form.Item>
                  <Form.Item name="tanggal_operasi" label="Tanggal Operasi">
                    <DatePicker name='tanggal_operasi' />
                  </Form.Item>
                  <Form.Item name="jam_operasi" label="Jam Operasi">
                    <Input name='jam_operasi' disabled style={{ width: 100 }} />
                  </Form.Item>
                  <Form.Item name="perhatian" label="Perhatian">
                    <Checkbox>PUASA MULAI JAM ....</Checkbox>
                    <Checkbox>CUKUR DAERAH YANG AKAN DIOPERASI</Checkbox>
                    <Checkbox>TIDAK PUASA</Checkbox>
                    <Checkbox>CUCI RAMBUT</Checkbox>
                  </Form.Item>
                  <Button type='primary'>Edit</Button>
                  <Button type='primary'>PRINT KARTU KUNING</Button>
                </Form>
              </Space>
              :
              <Text>Belum hadir Kartu Kuning</Text>
          }
        </ProCard>
      </Space>
      <Modal
        title="Kehadiran Lab"
        open={isLabModalOpen}
        onOk={() => labFormik.handleSubmit()}
        onCancel={() => setIsLabModalOpen(false)}
        okText="Simpan &amp; Hadir"
        cancelText="Batal Simpan"
      >
        <Form>
          <Checkbox name='perlu_radiologi' checked={labFormik.values.perlu_radiologi} onChange={labFormik.handleChange}>RADIOLOGY</Checkbox>
          <Checkbox name='perlu_ekg' checked={labFormik.values.perlu_ekg} onChange={labFormik.handleChange}>EKG</Checkbox>
        </Form>
      </Modal>
      <Modal
        title="Hasil Radiologi"
        open={isRadiologiModalOpen}
        onOk={() => radiologiFormik.handleSubmit()}
        onCancel={() => setIsRadiologiModalOpen(false)}
        okText="Simpan"
        cancelText="Batal"
      >
        <Form>
          <Space direction='vertical'>
            <Radio.Group name='tipe_hasil_rontgen' onChange={radiologiFormik.handleChange} value={radiologiFormik.values.tipe_hasil_rontgen}>
              <Radio value="USB">USB</Radio>
              <Radio value="PRINT">PRINT</Radio>
            </Radio.Group>
            <Form.Item name="nomor_kertas_penyerahan" label="Nomor Kertas Penyerahan USB RONTGEN">
              <Input name='nomor_kertas_penyerahan' onChange={radiologiFormik.handleChange} />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </>
  )
}

export default ScreeningPasienPage;
