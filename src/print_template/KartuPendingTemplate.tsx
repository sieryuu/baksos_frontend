import moment from 'moment';
import React from 'react';

interface KartuKuningProps {
  pasien: PasienType;
  kartuKuning: KartuKuningType;
}

export default class KartuPendingTemplate extends React.PureComponent<KartuKuningProps> {
  render() {
    const { pasien, kartuKuning } = this.props;
    return (
      <div style={{ fontSize: '15px' }}>
        <table style={{ width: '50%' }}>
          <tbody>
            <tr style={{ height: "25px", verticalAlign: "TOP" }}>
              <th style={{ width: '15%' }}>No Pending</th>
              <th style={{ width: '35%' }}>{kartuKuning.nomor}</th>
            </tr>
            <tr style={{ height: "25px", verticalAlign: "TOP" }} >
              <td>Nama</td>
              <td>{pasien.nama}</td>
            </tr>
            <tr style={{ height: "25px", verticalAlign: "TOP" }} >
              <td>Tempat /Tgl Lahir</td>
              <td>{pasien.tempat_lahir} / {pasien.tanggal_lahir}</td>
            </tr>
            <tr style={{ height: "25px", verticalAlign: "TOP" }} >
              <td>Alamat</td>
              <td>{pasien.alamat.replace(/(\r\n|\n|\r)/gm, ' ')}</td>
            </tr>
            <tr style={{ height: "25px", verticalAlign: "TOP" }} >
              <td>No Telp</td>
              <td>{pasien.nomor_telepon}</td>
            </tr>
            <tr style={{ height: "25px", verticalAlign: "TOP" }} >
              <td>Jenis Penyakit</td>
              <td>{pasien.penyakit == "BENJOLAN" ? "BENJOLAN / " : ""} {pasien.diagnosa}</td>
            </tr>
            <tr style={{ height: "25px", verticalAlign: "TOP" }} >
              <td>Keterangan</td>
              <td>{kartuKuning.perhatian?.map(value => <>{value}<br /></>)}</td>
            </tr>
          </tbody></table>
      </div>
    );
  }
}
