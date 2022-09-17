import moment from 'moment';
import React from 'react';

interface KartuKuningProps {
  pasien: PasienType;
  kartuKuning: KartuKuningType;
}

export default class KartuKuningTemplate extends React.PureComponent<KartuKuningProps> {
  render() {
    const { pasien, kartuKuning } = this.props;
    return (
      <div style={{ fontSize: '15px' }}>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr style={{ verticalAlign: 'top', height: "100px" }} >
              <th style={{ width: '30%' }} />
              <th style={{ width: '16%' }}> </th>
              <th style={{ width: '30%' }}> </th>
              <th style={{ width: '15%' }}> </th>
              <th style={{ width: '30%' }}> </th>
            </tr>
            <tr style={{ height: "20px" }}>
              <td />
              <td colSpan={2}></td>
              <td colSpan={2} valign='top'>{kartuKuning.nomor}</td>
            </tr>
            <tr style={{ height: "115px" }}>
              <td />
              <td valign='top' colSpan={2}></td>
            </tr>
            <tr style={{ height: "20px" }}>
              <td />
              <td colSpan={2}>{pasien.nama}</td>
            </tr>
            <tr style={{ height: "20px" }}>
              <td />
              <td valign='top'>{pasien.umur}</td>
              <td valign='top'> {pasien.jenis_kelamin}</td>
            </tr>
            <tr style={{ height: "70px" }}>
              <td />
              <td valign='top' colSpan={2}>{pasien.alamat.replace(/(\r\n|\n|\r)/gm, ' ')}</td>
            </tr>
            <tr style={{ height: "30px" }}>
              <td />
              <td valign='top' colSpan={2}>{pasien.nomor_telepon}</td>
            </tr>
            <tr style={{ height: "20px" }}>
              <td />
              <td valign='top' colSpan={2}>RUMAH SAKIT BUDI KEMULIAAN</td>
            </tr>
            <tr style={{ height: "50px" }}>
              <td />
              <td />
              <td valign='top'>Jl. Budi Kemuliaan No.1, Kp. Seraya, Kec. Lubuk Baja, Kota Batam</td>
            </tr>
            <tr style={{ height: "20px" }}>
              <td />
              <td valign='top' colSpan={2}>{moment(kartuKuning.tanggal_operasi, "YYYY-MM-DD").locale('id').format("dddd")} / {kartuKuning.tanggal_operasi}</td>
            </tr>
            <tr style={{ height: "20px" }}>
              <td />
              <td valign='top' colSpan={2}>{moment(kartuKuning.jam_operasi, "HH:mm:ss").format("HH:mm")}</td>
            </tr>
            <tr style={{ height: "180px" }}>
              <td />
              <td valign='top' colSpan={2}>{kartuKuning.perhatian?.map(value => <>{value}<br /></>)}</td>
            </tr>
            <tr style={{ height: "150px" }}>
              <td />
              <td valign='top' colSpan={2}>
                PENDAMPING HARUS MEMBAWA KTP/KK (HUBUNGAN KELUARGA) KARTU KUNING INI HARUS DIBAWA
              </td>
            </tr>
          </tbody></table>
      </div>
    );
  }
}
