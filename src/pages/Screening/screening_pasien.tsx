import { BatalSerahKartuKuning, patchPasien, PendingTensi, SerahKartuKuning } from '@/services/baksos/PasienController';
import { CancelEkg, CancelKK, CancelLab, CancelPemeriksaan, CancelRadiologi, CancelTensi, CapKehadiranEkg, CapKehadiranKartuKuning, CapKehadiranLab, CapKehadiranPemeriksaan, CapKehadiranRadiologi, CapKehadiranTensi, SimpanHasilRadiologi } from '@/services/baksos/ScreeningPasienController';
import { ParseResponseError } from '@/utils/requests';
import { CheckCircleTwoTone, ClockCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Radio, Input, Space, Card, Typography, Button, Checkbox, DatePicker, notification, Modal, Form, Select, TimePicker, Popconfirm } from 'antd';
import Title from 'antd/lib/typography/Title';
import { useFormik } from 'formik';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import locale from 'antd/es/date-picker/locale/id_ID';
import styled from 'styled-components'
import { queryPasienKartuKuning } from '@/services/baksos/KartuKuningController';
import KartuKuningTemplate from '@/print_template/KartuKuningTemplate';
import ReactToPrint from 'react-to-print';
import KartuPendingTemplate from '@/print_template/KartuPendingTemplate';
import InfoConsentTemplate from '@/print_template/InfoConsentTemplate';
import { queryPasienDetail } from '@/services/baksos/PasienDetailController';
import { Access, useAccess } from '@umijs/max';

const { TextArea } = Input;
const { Text } = Typography

const VerticalCheckboxGroup = styled(Checkbox.Group)`
  .ant-checkbox-group-item {
    display: block;
    margin-right: 0;
  }
  .ant-checkbox {
    display: inline-block;
  }
`

interface ScreeningPasienPageProps {
  pasien: PasienType;
  pasienScreening: ScreeningPasienType;
  retrievePasien: any;
}

interface FormItemDisplayProps {
  label: string;
  value?: string;
}

interface ProgressIconProps {
  isPass?: boolean;
}

const FormItemDisplay: React.FC<FormItemDisplayProps> = (props) => {
  const { label, value } = props
  return (
    <Form.Item style={{ marginBottom: "0px" }} label={label}>
      <Input bordered={false} value={value} readOnly />
    </Form.Item>
  )
}

const screeningPasienCard: React.CSSProperties = {
  width: '16%',
  textAlign: 'center',
};

const ProgressIcon: React.FC<ProgressIconProps> = (props) => {
  if (props.isPass === null) {
    return <ClockCircleTwoTone />
  }
  if (props.isPass)
    return <CheckCircleTwoTone twoToneColor="#52c41a" />
  return <CloseCircleTwoTone twoToneColor="#eb2f96" />
}

const PerhatianList = [
  { label: 'PUASA MULAI JAM ...', value: 'PUASA MULAI JAM ...' },
  { label: 'TIDAK PUASA', value: 'TIDAK PUASA' },
  { label: 'CUKUR DAERAH YANG AKAN DIOPERASI', value: 'CUKUR DAERAH YANG AKAN DIOPERASI' },
  { label: 'CUCI RAMBUT', value: 'CUCI RAMBUT' },
]

const ScreeningPasienPage: React.FC<ScreeningPasienPageProps> = (props) => {
  const { pasien, pasienScreening, retrievePasien } = props
  const kartuKuningRef = useRef(null);
  const kartuPendingRef = useRef(null);
  const printInfoConsentRef = useRef(null);
  const access = useAccess()
  const [kartuKuning, setKartuKuning] = useState<KartuKuningType>()
  const [detailPasien, setDetailPasien] = useState<DetailPasienType>()
  const [isLabModalOpen, setIsLabModalOpen] = useState(false)
  const [isHasilLabModalOpen, setIsHasilLabModalOpen] = useState(false)
  const [isRadiologiModalOpen, setIsRadiologiModalOpen] = useState(false)
  const [isLolosKKModalOpen, setIsLolosKKModalOpen] = useState(false)
  const [isPendingKKModalOpen, setIsPendingKKModalOpen] = useState(false)

  const retrievePasienKartuKuning = () => {
    if (pasien.id) {
      setKartuKuning(undefined)
      queryPasienKartuKuning(pasien.id)
        .then(data => {
          if (data.length > 0) {
            setKartuKuning(data[0])
          }
        })
    }
  }

  const retrieveDetailPasien = () => {
    if (pasien.id) {
      setDetailPasien(undefined)
      queryPasienDetail(pasien.id)
        .then(data => {
          if (data.length > 0) {
            setDetailPasien(data[0])
          }
        })
    }
  }

  useEffect(() => {
    retrievePasienKartuKuning()
    retrieveDetailPasien()
  }, [])

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
        notification["warning"]({ message: `Update Tensi Gagal`, description: ParseResponseError(err) });
      })
  }

  const cancelTensi = () => {
    CancelTensi(pasienScreening.id)
      .then(data => {
        notification["success"]({ message: `Cancel Tensi Berhasil`, description: data });
        retrievePasien()
      }).catch(err => {
        notification["warning"]({ message: `Cancel Tensi Gagal`, description: ParseResponseError(err) });
      })
  }

  const pendingTensi = () => {
    if (pasien.id)
      PendingTensi(pasien.id)
        .then(data => {
          notification["success"]({ message: `Pending Tensi Berhasil`, description: data });
          retrievePasien()
        }).catch(err => {
          notification["warning"]({ message: `Pending Tensi Gagal`, description: ParseResponseError(err) });
        })
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
        notification["warning"]({ message: `Update Pemeriksaan Gagal`, description: ParseResponseError(err) });
      })
  }

  const cancelPemeriksaan = () => {
    CancelPemeriksaan(pasienScreening.id)
      .then(data => {
        notification["success"]({ message: `Cancel Pemeriksaan Berhasil`, description: data });
        retrievePasien()
      }).catch(err => {
        notification["warning"]({ message: `Cancel Pemeriksaan Gagal`, description: ParseResponseError(err) });
      })
  }
  //#endregion

  //#region Lab
  const editLabDetail = (values: CapKehadiranLabType) => {
    patchPasien(values.pasien_id, {
      perlu_radiologi: values.perlu_radiologi,
      perlu_ekg: values.perlu_ekg,
      diagnosa: values.diagnosa
    })
      .then(() => {
        notification["success"]({ message: `Update Detail Lab Berhasil`, description: "Detail Lab Pasien berhasil di update" })
        retrievePasien()
      })
      .catch(err => notification["warning"]({ message: `Update Detail Lab Gagal`, description: ParseResponseError(err) }))
  }

  const labFormik = useFormik<CapKehadiranLabType>({
    enableReinitialize: true,
    // validationSchema: hadirLabValidationSchema,
    initialValues: {
      pasien_id: 0,
      hadir: true,
      perlu_radiologi: pasien && pasien.perlu_radiologi || false,
      perlu_ekg: pasien && pasien.perlu_ekg || false,
      diagnosa: (pasien.penyakit !== "BENJOLAN") ? (pasien.diagnosa || "") : ""
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
            notification["warning"]({ message: `Update Lab Gagal`, description: ParseResponseError(err) });
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
        notification["warning"]({ message: `Cancel Lab Gagal`, description: ParseResponseError(err) });
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
        notification["warning"]({ message: `Update Radiologi Gagal`, description: ParseResponseError(err) });
      })
  }

  const radiologiFormik = useFormik<HasilRadiologiType>({
    enableReinitialize: true,
    initialValues: {
      nomor_kertas_penyerahan: pasienScreening.nomor_kertas_penyerahan || '',
      tipe_hasil_rontgen: pasienScreening.tipe_hasil_rontgen
    },
    onSubmit: values => {
      SimpanHasilRadiologi(
        pasienScreening.id,
        values
      ).then(data => {
        notification["success"]({ message: `Update Hasil Radiologi Berhasil`, description: data });
        retrievePasien()
        setIsRadiologiModalOpen(false)
      }).catch(err => {
        notification["warning"]({ message: `Update Hasil Radiologi Gagal`, description: ParseResponseError(err) });
      })
    },
  });

  const cancelRadiologi = () => {
    CancelRadiologi(pasienScreening.id)
      .then(data => {
        notification["success"]({ message: `Cancel Radiologi Berhasil`, description: data });
        retrievePasien()
      }).catch(err => {
        notification["warning"]({ message: `Cancel Radiologi Gagal`, description: ParseResponseError(err) });
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
        notification["warning"]({ message: `Update Ekg Gagal`, description: ParseResponseError(err) });
      })
  }

  const cancelEkg = () => {
    CancelEkg(pasienScreening.id)
      .then(data => {
        notification["success"]({ message: `Cancel Ekg Berhasil`, description: data });
        retrievePasien()
      }).catch(err => {
        notification["warning"]({ message: `Cancel Ekg Gagal`, description: ParseResponseError(err) });
      })
  }
  //#endregion

  //#region Kartu Kuning
  const capHadirKartuKuning = (hadir: boolean) => {
    if (pasien && pasien.id)
      CapKehadiranKartuKuning({
        hadir: hadir,
        pasien_id: pasien.id
      }).then(data => {
        notification["success"]({ message: `Update Kartu Kuning Berhasil`, description: data });
        retrievePasien()
      }).catch(err => {
        notification["warning"]({ message: `Update Kartu Kuning Gagal`, description: ParseResponseError(err) });
      })
  }

  const cancelKartuKuning = () => {
    CancelKK(pasienScreening.id)
      .then(data => {
        notification["success"]({ message: `Cancel Kartu Kuning Berhasil`, description: data });
        retrievePasien()
      }).catch(err => {
        notification["warning"]({ message: `Cancel Kartu Kuning Gagal`, description: ParseResponseError(err) });
      })
  }

  const kartuKuningFormik = useFormik<SerahKartuKuningType>({
    enableReinitialize: true,
    initialValues: {
      status: "",
      tanggal: "",
      jam: "",
      perhatian: []
    },
    onSubmit: values => {
      if (pasien.id) {
        SerahKartuKuning(
          pasien.id,
          values
        ).then(data => {
          notification["success"]({ message: `Update Hasil Kartu Kuning Berhasil`, description: data });
          retrievePasien()
          retrievePasienKartuKuning()
          setIsLolosKKModalOpen(false)
          setIsPendingKKModalOpen(false)
        }).catch(err => {
          notification["warning"]({ message: `Update Hasil Kartu Kuning Gagal`, description: ParseResponseError(err) });
        })
      }
    },
  });

  const cancelHasilKartuKuning = () => {
    if (pasien.id) {
      BatalSerahKartuKuning(pasien.id)
        .then(data => {
          notification["success"]({ message: `Cancel Hasil Kartu Kuning Berhasil`, description: data });
          retrievePasien()
          retrievePasienKartuKuning()
        }).catch(err => {
          notification["warning"]({ message: `Cancel Hasil Kartu Kuning Gagal`, description: ParseResponseError(err) });
        })
    }
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
              <FormItemDisplay label='Diagnosa' value={pasien.diagnosa || ""} />
            </Space>
            <Space>
              <FormItemDisplay label='Jenis Kelamin' value={pasien.jenis_kelamin} />
              <FormItemDisplay label='Nomor Tlp' value={pasien.nomor_telepon} />
              <FormItemDisplay label='Alamat' value={pasien.alamat} />
              {/* <FormItemDisplay label='Last Status' value={pasien.last_status} /> */}
            </Space>
          </Form>
        </ProCard>
        {
          pasien.nomor_antrian ?
            pasien.perlu_rescreen && !moment(pasien.tanggal_nomor_antrian).isSame(moment(), 'day') ?
              <Card>Pasien Belum Absen</Card>
              :
              <>
                <Card title="Screening Pasien">
                  <Card.Grid style={screeningPasienCard}>
                    <Title level={5}>Tensi <ProgressIcon isPass={pasienScreening?.telah_lewat_cek_tensi} /></Title>
                    {
                      pasien.perlu_rescreen && moment(pasien.tanggal_nomor_antrian, "YYYY-MM-DD").isSame(moment(), "day")
                        ?
                        <Text>Pasien Akan Recreening Besok</Text>
                        :
                        pasienScreening?.telah_lewat_cek_tensi != null ?
                          <Space direction='vertical'>
                            <Text>{pasienScreening.telah_lewat_cek_tensi ? 'Hadir' : "Batal"} pada: {moment(pasienScreening.jam_cek_tensi).format('YYYY-MM-DD HH:mm:ss')}</Text>
                            <Access accessible={access.canSeeAdmin}>
                              <Button type='link' danger size='small' onClick={cancelTensi}>Cancel {pasienScreening.telah_lewat_cek_tensi ? 'Kehadiran' : 'Batal'} </Button>
                            </Access>
                          </Space>
                          :
                          <Space direction='vertical'>
                            <Access accessible={access.canSeePendaftaran}>
                              <Popconfirm title="Apakah yakin untuk BATALIN pasien?" onConfirm={() => capHadirTensi(false)} okText="Iya, Pasien Batal" cancelText="Tidak Jadi">
                                <Button danger>BATAL</Button>
                              </Popconfirm>
                            </Access>
                            {
                              pasien.perlu_rescreen ||
                              <Access accessible={access.canSeePendaftaran}>
                                <Popconfirm title="Apakah yakin untuk PENDING TENSI pasien?" onConfirm={pendingTensi} okText="Iya" cancelText="Tidak Jadi">
                                  <Button danger>PENDING</Button>
                                </Popconfirm>
                              </Access>
                            }
                          </Space>
                    }
                  </Card.Grid>
                  <Card.Grid style={screeningPasienCard}>
                    <Title level={5}>Cek Fisik/Mata <ProgressIcon isPass={pasienScreening?.telah_lewat_pemeriksaan} /></Title>
                    {
                      pasienScreening?.telah_lewat_pemeriksaan != null ?
                        <Space direction='vertical'>
                          <Text>{pasienScreening.telah_lewat_pemeriksaan ? 'Hadir' : "Batal"} pada: {moment(pasienScreening.jam_pemeriksaan).format('YYYY-MM-DD HH:mm:ss')}</Text>
                          <Access accessible={access.canSeeAdmin}>
                            <Button type='link' danger size='small' onClick={cancelPemeriksaan}>Cancel {pasienScreening.telah_lewat_pemeriksaan ? 'Kehadiran' : 'Batal'} </Button>
                          </Access>
                        </Space>
                        :
                        <Space direction='vertical'>
                          <Access accessible={access.canSeePemeriksaan}>
                            <Button type='primary' onClick={() => capHadirPemeriksaan(true)}>HADIR</Button>
                          </Access>
                          <Access accessible={access.canSeePemeriksaan}>
                            <Popconfirm title="Apakah yakin untuk BATALIN pasien?" onConfirm={() => capHadirPemeriksaan(false)} okText="Iya, Pasien Batal" cancelText="Tidak Jadi">
                              <Button danger>BATAL</Button>
                            </Popconfirm>
                          </Access>
                        </Space>
                    }
                  </Card.Grid>
                  <Card.Grid style={screeningPasienCard}>
                    <Title level={5}>LAB <ProgressIcon isPass={pasienScreening?.telah_lewat_cek_lab} /></Title>
                    {
                      pasienScreening?.telah_lewat_cek_lab != null ?
                        <Space direction='vertical'>
                          <Text>{pasienScreening.telah_lewat_cek_lab ? 'Hadir' : "Batal"} pada: {moment(pasienScreening.jam_cek_lab).format('YYYY-MM-DD HH:mm:ss')}</Text>
                          <Access accessible={access.canSeeAdmin}>
                            <Button type='link' danger size='small' onClick={cancelLab}>Cancel {pasienScreening.telah_lewat_cek_lab ? 'Kehadiran' : 'Batal'} </Button>
                          </Access>
                        </Space>
                        :
                        <Space direction='vertical'>
                          <Access accessible={access.canSeeLab}>
                            <Button type='primary' onClick={() => setIsLabModalOpen(true)}>HADIR</Button>
                          </Access>
                        </Space>
                    }
                  </Card.Grid>
                  <Card.Grid style={screeningPasienCard}>
                    <Title level={5}>RADIOLOGY <ProgressIcon isPass={pasienScreening?.telah_lewat_cek_radiologi} /></Title>
                    {
                      pasienScreening?.telah_lewat_cek_radiologi != null ?
                        <Space direction='vertical'>
                          <Text>{pasienScreening.telah_lewat_cek_radiologi ? 'Hadir' : "Batal"} pada: {moment(pasienScreening.jam_cek_radiologi).format('YYYY-MM-DD HH:mm:ss')}</Text>
                          <Access accessible={access.canSeeAdmin}>
                            <Button type='link' danger size='small' onClick={cancelRadiologi}>Cancel {pasienScreening.telah_lewat_cek_radiologi ? 'Kehadiran' : 'Batal'} </Button>
                          </Access>
                        </Space>
                        :
                        <Space direction='vertical'>
                          <Access accessible={access.canSeeRontgen}>
                            <Button type='primary' disabled={!pasien.perlu_radiologi} onClick={() => capHadirRadiologi(true)}>HADIR</Button>
                          </Access>
                        </Space>
                    }
                  </Card.Grid>
                  <Card.Grid style={screeningPasienCard}>
                    <Title level={5}>EKG <ProgressIcon isPass={pasienScreening?.telah_lewat_cek_ekg} /></Title>
                    {
                      pasienScreening?.telah_lewat_cek_ekg != null ?
                        <Space direction='vertical'>
                          <Text>{pasienScreening.telah_lewat_cek_ekg ? 'Hadir' : "Batal"} pada: {moment(pasienScreening.jam_cek_ekg).format('YYYY-MM-DD HH:mm:ss')}</Text>
                          <Access accessible={access.canSeeAdmin}>
                            <Button type='link' danger size='small' onClick={cancelEkg}>Cancel {pasienScreening.telah_lewat_cek_ekg ? 'Kehadiran' : 'Batal'} </Button>
                          </Access>
                        </Space>
                        :
                        <Space direction='vertical'>
                          <Access accessible={access.canSeeEkg}>
                            <Button type='primary' disabled={!pasien.perlu_ekg} onClick={() => capHadirEkg(true)}>HADIR</Button>
                          </Access>
                        </Space>
                    }
                  </Card.Grid>
                  <Card.Grid style={screeningPasienCard}>
                    <Title level={5}>Kartu Kuning <ProgressIcon isPass={pasienScreening?.telah_lewat_cek_kartu_kuning} /></Title>
                    {
                      pasienScreening?.telah_lewat_cek_kartu_kuning != null ?
                        <Space direction='vertical'>
                          <Text>{pasienScreening.telah_lewat_cek_kartu_kuning ? 'Hadir' : "Batal"} pada: {moment(pasienScreening.jam_cek_kartu_kuning).format('YYYY-MM-DD HH:mm:ss')}</Text>
                          <Access accessible={access.canSeeAdmin}>
                            <Button type='link' danger size='small' onClick={cancelKartuKuning}>Cancel {pasienScreening.telah_lewat_cek_kartu_kuning ? 'Kehadiran' : 'Batal'} </Button>
                          </Access>
                        </Space>
                        :
                        <Space direction='vertical'>
                          <Access accessible={access.canSeeKartuKuning}>
                            <Button type='primary' onClick={() => capHadirKartuKuning(true)}>HADIR</Button>
                          </Access>
                        </Space>
                    }
                  </Card.Grid>
                </Card>
                <ProCard title="LAB" layout="default" bordered>
                  {
                    pasienScreening.telah_lewat_cek_lab != null ?
                      <Space>
                        <Checkbox disabled checked={pasien.perlu_radiologi}>RADIOLOGY</Checkbox>
                        <Checkbox disabled checked={pasien.perlu_ekg}>EKG</Checkbox>
                        <Access accessible={access.canSeeLab || access.canSeeKartuKuning}>
                          <Button type='primary' onClick={() => setIsLabModalOpen(true)}>Edit</Button>
                        </Access>
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
                          <Radio.Group value={pasienScreening.tipe_hasil_rontgen} disabled>
                            <Radio value="USB">USB</Radio>
                            <Radio value="PRINT">PRINT</Radio>
                          </Radio.Group>
                          <Form.Item label="Nomor Kertas Penyerahan USB RONTGEN">
                            <Input name='nomor_kertas_penyerahan' disabled value={pasienScreening.nomor_kertas_penyerahan} />
                          </Form.Item>
                          <Access accessible={access.canSeeRontgen}>
                            <Button type='primary' onClick={() => setIsRadiologiModalOpen(true)}>Edit</Button>
                          </Access>
                        </Space>
                      </Form>
                      :
                      <Text>Belum hadir Radiologi</Text>
                  }
                </ProCard>
                <ProCard title="Kartu Kuning" layout="default" bordered>
                  {
                    kartuKuning != null && kartuKuning.nomor != null ?
                      <Form>
                        {
                          kartuKuning.status == "LOLOS" ?
                            <>
                              <FormItemDisplay label='Nomor Kartu Kuning' value={kartuKuning.nomor} />
                              <FormItemDisplay label='Status' value={kartuKuning.status} />
                              <FormItemDisplay label='Tanggal Operasi' value={kartuKuning.tanggal_operasi} />
                              <FormItemDisplay label='Jam Operasi' value={kartuKuning.jam_operasi} />
                              <FormItemDisplay label='Perhatian' value={kartuKuning.perhatian?.join(" | ")} />
                            </>
                            :
                            kartuKuning.status == "PENDING" ?
                              <Form>
                                <FormItemDisplay label='Nomor Kartu Kuning' value={kartuKuning.nomor} />
                                <FormItemDisplay label='Status' value={kartuKuning.status} />
                                <FormItemDisplay label='Perhatian' value={kartuKuning.perhatian?.join(" | ")} />
                              </Form>
                              :
                              <Form>
                                <FormItemDisplay label='Status' value={kartuKuning.status} />
                              </Form>
                        }
                        {
                          kartuKuning.status == "LOLOS" ?
                            <Access accessible={access.canSeeKartuKuning}>
                              <Form.Item style={{ marginBottom: "10px" }}>
                                <ReactToPrint
                                  trigger={() => <Button type='primary' >PRINT KARTU KUNING</Button>}
                                  content={() => kartuKuningRef.current}
                                />
                              </Form.Item>
                              <Form.Item style={{ marginBottom: "10px" }}>
                                <ReactToPrint
                                  trigger={() => <Button>PRINT INFO CONSENT</Button>}
                                  content={() => printInfoConsentRef.current}
                                />
                              </Form.Item>
                            </Access>
                            :
                            kartuKuning.status == "PENDING" ?
                              <Access accessible={access.canSeeKartuKuning}>
                                <Form.Item style={{ marginBottom: "10px" }}>
                                  <ReactToPrint
                                    trigger={() => <Button type='primary' >PRINT KARTU PENDING</Button>}
                                    content={() => kartuPendingRef.current}
                                  />
                                </Form.Item>
                              </Access>
                              : <></>
                        }
                        <Access accessible={access.canSeeAdmin}>
                          <Form.Item>
                            <Button type='link' danger size='small' onClick={cancelHasilKartuKuning}>Cancel Hasil Kartu Kuning</Button>
                          </Form.Item>
                        </Access>
                      </Form>
                      :
                      pasienScreening.telah_lewat_cek_kartu_kuning != null ?
                        <Access accessible={access.canSeeKartuKuning}>
                          <Space direction='vertical'>
                            <Button type='primary' onClick={() => setIsLolosKKModalOpen(true)}>LOLOS</Button>
                            <Button onClick={() => setIsPendingKKModalOpen(true)}>PENDING</Button>
                            <Popconfirm title="Apakah yakin untuk GAGALIN pasien?" onConfirm={() => {
                              kartuKuningFormik.setFieldValue('status', 'GAGAL')
                              kartuKuningFormik.setFieldValue('tanggal', null)
                              kartuKuningFormik.setFieldValue('jam', null)
                              kartuKuningFormik.setFieldValue('perhatian', [])
                              kartuKuningFormik.handleSubmit()
                            }} okText="Iya, Pasien Gagal" cancelText="Tidak Jadi">
                              <Button danger>GAGAL</Button>
                            </Popconfirm>
                          </Space>
                        </Access>
                        :
                        <Text>Belum hadir Kartu Kuning</Text>
                  }
                </ProCard>
              </>
            :
            <Card>Pasien Belum Absen</Card>
        }
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
          <Space direction='vertical'>
            <Form.Item>
              <Checkbox name='perlu_radiologi' checked={labFormik.values.perlu_radiologi} onChange={labFormik.handleChange}>RADIOLOGY</Checkbox>
              <Checkbox name='perlu_ekg' checked={labFormik.values.perlu_ekg} onChange={labFormik.handleChange}>EKG</Checkbox>
            </Form.Item>
            <Form.Item>
              <Select
                showSearch
                value={labFormik.values.diagnosa}
                onChange={value => labFormik.setFieldValue('diagnosa', value)}
                disabled={pasien.penyakit == "SUMBING" || pasien.penyakit == "HERNIA"}>
                {
                  (pasien.penyakit == "SUMBING" || pasien.penyakit == "HERNIA") ?
                    <Select.Option value={pasien.penyakit}>{pasien.penyakit}</Select.Option>
                    :
                    (pasien.penyakit == "BENJOLAN") ?
                      (
                        <>
                          <Select.Option value="MINOR GA">MINOR GA</Select.Option>
                          <Select.Option value="MINOR LOKAL">MINOR LOKAL</Select.Option>
                        </>
                      )
                      :
                      // sudah pasti katarak
                      <>
                        <Select.Option value="KATARAK">KATARAK</Select.Option>
                        <Select.Option value="PTERYGIUM">PTERYGIUM</Select.Option>
                      </>
                }
              </Select>
              {
                pasien.penyakit === "KATARAK" ? <Text italic>Mohon pastikan apakah ada perubahan penyakit pasien dari Katarak ke Pterygium</Text> : <></>
              }
            </Form.Item>
          </Space>
        </Form>
      </Modal>
      <Modal
        title="Hasil Lab"
        open={isHasilLabModalOpen}
        onOk={() => radiologiFormik.handleSubmit()}
        onCancel={() => setIsHasilLabModalOpen(false)}
        okText="Simpan"
        cancelText="Batal"
      >
        <Form>
          <Space direction='vertical'>
            <Radio.Group name='tipe_hasil_rontgen' onChange={radiologiFormik.handleChange} value={radiologiFormik.values.tipe_hasil_rontgen}>
              <Radio value="USB">USB</Radio>
              <Radio value="PRINT">PRINT</Radio>
            </Radio.Group>
            <Form.Item label="Nomor Kertas Penyerahan USB RONTGEN">
              <Input name='nomor_kertas_penyerahan' onChange={radiologiFormik.handleChange} value={radiologiFormik.values.nomor_kertas_penyerahan} />
            </Form.Item>
          </Space>
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
            <Form.Item label="Nomor Kertas Penyerahan USB RONTGEN">
              <Input name='nomor_kertas_penyerahan' onChange={radiologiFormik.handleChange} value={radiologiFormik.values.nomor_kertas_penyerahan} />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
      <Modal
        title="LOLOS KARTU KUNING"
        open={isLolosKKModalOpen}
        onOk={() => {
          kartuKuningFormik.setFieldValue('status', "LOLOS")
          kartuKuningFormik.handleSubmit()
        }}
        onCancel={() => setIsLolosKKModalOpen(false)}
        okText="LOLOS"
        cancelText="Batal"
      >
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 20 }}
        >
          {/* <Form.Item name="nomor_kartu_kuning" label="Nomor Kartu Kuning">
            <Input name='nomor_kartu_kuning' disabled style={{ width: 100 }} />
          </Form.Item> */}
          <Form.Item name="tanggal" label="Tanggal Operasi">
            <DatePicker
              locale={locale}
              name='tanggal'
              value={moment(kartuKuningFormik.values.tanggal, "YYYY-MM-DD")}
              onChange={(values) => kartuKuningFormik.setFieldValue('tanggal', values?.format("YYYY-MM-DD"))} />
          </Form.Item>
          <Form.Item name="jam" label="Jam Operasi">
            <TimePicker
              locale={locale}
              name="jam"
              format={"HH:mm"}
              value={moment(kartuKuningFormik.values.jam, "HH:mm")}
              onChange={(values) => kartuKuningFormik.setFieldValue('jam', values?.format("HH:mm"))} />
          </Form.Item>
          <Form.Item name="perhatian" label="Perhatian">
            <VerticalCheckboxGroup
              name="perhatian"
              options={PerhatianList}
              value={kartuKuningFormik.values.perhatian}
              onChange={values => kartuKuningFormik.setFieldValue('perhatian', values)} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="PENDING KARTU KUNING"
        open={isPendingKKModalOpen}
        onOk={() => {
          kartuKuningFormik.setFieldValue('tanggal', null)
          kartuKuningFormik.setFieldValue('jam', null)
          kartuKuningFormik.setFieldValue('status', "PENDING")
          kartuKuningFormik.handleSubmit()
        }}
        onCancel={() => setIsPendingKKModalOpen(false)}
        okText="PENDING"
        cancelText="Batal"
      >
        <Form
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item name="perhatian" label="Perhatian">
            <TextArea
              name="perhatian"
              value={kartuKuningFormik.values.perhatian ? kartuKuningFormik.values.perhatian[0] : ""}
              onChange={event => {
                kartuKuningFormik.setFieldValue('perhatian', [event.currentTarget.value])
              }} />
          </Form.Item>
        </Form>
      </Modal>
      {
        kartuKuning &&
          kartuKuning.status == "LOLOS" ?
          <>
            <div style={{ display: "none" }}><KartuKuningTemplate ref={kartuKuningRef} pasien={pasien} kartuKuning={kartuKuning} /></div>
            <div style={{ display: "none" }}><InfoConsentTemplate ref={printInfoConsentRef} pasien={pasien} /></div>
          </>
          : kartuKuning?.status == "PENDING" ?
            <div style={{ display: "none" }}><KartuPendingTemplate ref={kartuPendingRef} pasien={pasien} kartuKuning={kartuKuning} /></div>
            : <></>
      }
    </>
  )
}

export default ScreeningPasienPage;
