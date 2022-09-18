import {
  Form,
  Input,
  Select,
  DatePicker,
  SubmitButton,
} from 'formik-antd';
import { Input as AntdInput } from 'antd'
import {
  Col,
  Row,
  Divider,
  Space,
  notification,
  Button,
  InputRef
} from 'antd'
import { Formik } from 'formik'
import * as Yup from 'yup';
import locale from 'antd/es/date-picker/locale/id_ID';
import { useMemo, useRef, useState } from 'react';
import { queryPenyakit, queryPuskesmas } from '@/services/baksos/ReferensiController';
import { TYPE_IDENTITAS } from '@/constants';
import moment from 'moment';
import { createPasien, patchPasien } from '@/services/baksos/PasienController';
import { history } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { ParseResponseError } from '@/utils/requests';
import _ from 'lodash'
const { TextArea } = Input;

interface PasienFormProps {
  IsCreate: boolean,
  Pasien?: PasienType,
  PasienStateChanged?: any
}

const PasienForm: React.FC<PasienFormProps> = (props) => {
  let IsDetailView = !props.IsCreate;
  const [newTipeIdentitas, setNewTipeIdentitas] = useState('');
  const [puskesmases, setPuskesmases] = useState<PuskesmasType[]>([])
  const [penyakits, setpenyakits] = useState<PenyakitType[]>([])
  const [editState, setEditState] = useState<boolean>(false)
  const [tipeIdentitases, setTipeIdentitases] = useState<TipeIdentitas[]>(TYPE_IDENTITAS)
  const inputRef = useRef<InputRef>(null);

  useMemo(() => {
    queryPuskesmas().then(data => setPuskesmases(data));
    queryPenyakit().then(data => setpenyakits(data));
  }, [])

  const initialValues: PasienType = props.Pasien || {
    nomor_seri: '',
    puskesmas: 'JING SI TANG',
    penyakit: '',
    nama: '',
    nomor_identitas: '',
    tipe_identitas: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    tanggal_lahir_moment: null,
    jenis_kelamin: '',
    alamat: '',
    daerah: '',
    pulau: 'BATAM',
    nomor_telepon: '',
    nama_keluarga: '',
    nomor_telepon_keluarga: '',
    nama_pendamping: '',
    nomor_telepon_pendamping: '',
    umur: ''
  }

  const submitForm = (values: any, actions: any) => {
    values.tanggal_lahir = moment(values.tanggal_lahir_moment).format('YYYY-MM-DD')

    let promis = null
    const isEdit = props.Pasien && props.Pasien.id
    if (props.Pasien && props.Pasien.id) {
      promis = patchPasien(props.Pasien.id, values)
    } else {
      promis = createPasien(values)
    }

    promis
      .then(data => {
        notification["success"]({
          message: `Pasien berhasil ${isEdit ? 'diperbaharui' : 'terdaftar'}`,
          description: 'Klik untuk masuk ke halaman pasien.',
          onClick: () => history.push(`/pasien/${data.id}`)
        });
        actions.resetForm();
        setEditState(false)
        props.PasienStateChanged && props.PasienStateChanged()
      })
      .catch(err => {
        notification["warning"]({
          message: `${isEdit ? 'Pembaharuan' : 'Pendaftaran'} pasien gagal! (${err.response.status})`,
          description: ParseResponseError(err),
        });
      })
      .finally(() => {
        actions.setSubmitting(false)
      })
  }

  const onNewTipeIdentitasChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTipeIdentitas(event.target.value);
  };

  const addItem = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setTipeIdentitases([...tipeIdentitases, { name: newTipeIdentitas }]);
    setNewTipeIdentitas('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <Formik<PasienType>
      enableReinitialize
      initialValues={initialValues}
      onSubmit={submitForm}
      validationSchema={registerValidationSchema}
    >
      {(props) => (
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 20 }}
          layout="horizontal"
          colon={false}
          labelWrap
        >
          <Row>
            <Col span={12}>
              <Form.Item name="puskesmas" label="Lokasi Pendaftaran">
                <Select
                  name='puskesmas'
                  showSearch
                  disabled={IsDetailView && editState == false}
                  onChange={data => {
                    const pulau = puskesmases.find(x => x.puskesmas == data)?.pulau
                    props.setFieldValue('pulau', pulau)
                  }}
                >
                  {
                    puskesmases.map(puskesmas =>
                      <Select.Option key={puskesmas.puskesmas} value={puskesmas.puskesmas}>{puskesmas.puskesmas}</Select.Option>
                    )
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="nomor_seri" label="Nomor Seri Formulir">
                <Input name="nomor_seri" style={{ width: '100px' }} disabled={IsDetailView && editState == false} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="pulau" label="Pulau">
                <Input name="pulau" disabled />
              </Form.Item>
            </Col>
            <Col span={12} />
            <Divider orientation="left">Data Umum Pasien</Divider>
            <Col span={12}>
              <Form.Item name="penyakit" label="Jenis Penyakit">
                <Select name='penyakit' showSearch disabled={IsDetailView && editState == false}>
                  {
                    penyakits.map(penyakit =>
                      <Select.Option key={penyakit.nama} value={penyakit.nama}>{penyakit.nama}</Select.Option>
                    )
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={12} />
            <Col span={12}>
              <Form.Item name="nama" label="Nama">
                <Input name="nama" disabled={IsDetailView && editState == false} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="jenis_kelamin" label="Jenis Kelamin">
                <Select name='jenis_kelamin' showSearch disabled={IsDetailView && editState == false}>
                  <Select.Option value="L">Laki Laki</Select.Option>
                  <Select.Option value="P">Perempuan</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="nomor_identitas" label="No. identitas">
                <Input name="nomor_identitas" disabled={IsDetailView && editState == false} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="tipe_identitas" label="Tipe Identitas">
                <Select
                  name='tipe_identitas'
                  showSearch
                  disabled={IsDetailView && editState == false}
                  dropdownRender={menu => (
                    <>
                      {menu}
                      <Divider style={{ margin: '8px 0' }} />
                      <Space style={{ padding: '0 8px 4px' }}>
                        <AntdInput
                          placeholder="Tambah Identitas Baru"
                          ref={inputRef}
                          value={newTipeIdentitas}
                          onChange={onNewTipeIdentitasChange}
                        />
                        <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                          Add item
                        </Button>
                      </Space>
                    </>
                  )}>
                  {
                    tipeIdentitases.map(tipe_identitas =>
                      <Select.Option key={tipe_identitas.name} value={tipe_identitas.name}>{tipe_identitas.name}</Select.Option>
                    )
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="alamat" label="Alamat Lengkap">
                <TextArea name="alamat" rows={3} disabled={IsDetailView && editState == false} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="nomor_telepon" label="No Telp">
                <Input name="nomor_telepon" autoComplete='off' disabled={IsDetailView && editState == false} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="daerah" label="Kecamatan/Kabupaten/Kota">
                <Select
                  name='daerah'
                  showSearch
                  disabled={IsDetailView && editState == false}
                >
                  {
                    _.uniqBy(puskesmases, (x) => {
                      return x.pulau
                    }).map(puskesmas =>
                      <Select.Option key={puskesmas.pulau} value={puskesmas.pulau}>{puskesmas.pulau}</Select.Option>
                    )
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={12} />
            <Col span={12}>
              <Form.Item name="tempat_lahir" label="Tempat Lahir">
                <Input name="tempat_lahir" disabled={IsDetailView && editState == false} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="tanggal_lahir_moment" label="Tanggal Lahir">
                <Space>
                  <DatePicker
                    name='tanggal_lahir_moment'
                    locale={locale}
                    disabled={IsDetailView && editState == false}
                    onChange={(date, dateString) => {
                      if (dateString) {
                        const diffYear = moment().diff(date, 'y')
                        const diffMonth = moment().diff(date, 'M')
                        props.setFieldValue("umur", `${diffYear} Tahun ${diffMonth % 12} Bulan`)
                      }
                    }}
                  />
                  <Input name='umur' bordered={false} defaultValue={""} />
                </Space>
              </Form.Item>
            </Col>
            <Divider orientation="left">Data Keluarga Pasien</Divider>
            <Col span={12}>
              <Form.Item name="nama_keluarga" label="Nama Keluarga yang bisa di hub.">
                <Input name="nama_keluarga" disabled={IsDetailView && editState == false} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="nomor_telepon_keluarga" label="No. Telp Keluarga">
                <Input name="nomor_telepon_keluarga" disabled={IsDetailView && editState == false} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="nama_pendamping" label="Nama Pendamping yang bisa di hub.">
                <Input name="nama_pendamping" disabled={IsDetailView && editState == false} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="nomor_telepon_pendamping" label="No. Telp Pendamping">
                <Input name="nomor_telepon_pendamping" disabled={IsDetailView && editState == false} />
              </Form.Item>
            </Col>
            {
              IsDetailView ?
                <Col span={12}>
                  <Form.Item label=" " name="edit">
                    <Space>
                      <Button onClick={() => setEditState(!editState)}>{editState ? "Batal Edit" : "Edit"}</Button>
                      {
                        editState &&
                        <SubmitButton type='primary'>Simpan</SubmitButton>
                      }
                    </Space>
                  </Form.Item>
                </Col>
                :
                <Col span={12}>
                  <Form.Item label=" " name="submit">
                    <SubmitButton type='primary'>Register</SubmitButton>
                  </Form.Item>
                </Col>
            }
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default PasienForm;

const registerValidationSchema = Yup.object().shape({
  nomor_seri: Yup.string().required('Wajib Isi'),
  puskesmas: Yup.string().required('Wajib Isi'),
  penyakit: Yup.string().required('Wajib Isi'),
  nama: Yup.string().required('Wajib Isi'),
  nomor_identitas: Yup.string().required('Wajib Isi'),
  tipe_identitas: Yup.string().required('Wajib Isi'),
  jenis_kelamin: Yup.string().required('Wajib Isi'),
  alamat: Yup.string().required('Wajib Isi'),
  nomor_telepon: Yup.string().required('Wajib Isi'),
  daerah: Yup.string().required('Wajib Isi'),
  tanggal_lahir_moment: Yup.date().required('Wajib Isi').nullable(),
  tempat_lahir: Yup.string().required('Wajib Isi'),
  nama_keluarga: Yup.string().required('Wajib Isi'),
  nomor_telepon_keluarga: Yup.string().required('Wajib Isi'),
  nama_pendamping: Yup.string().required('Wajib Isi'),
  nomor_telepon_pendamping: Yup.string().required('Wajib Isi'),
});