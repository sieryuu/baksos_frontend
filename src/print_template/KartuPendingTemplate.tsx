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
      <div style={{ fontSize: '15px', margin: 20, color: 'red' }}>
        <table style={{ width: '80%', border: '1px solid red', borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ height: "25px", verticalAlign: "TOP", border: '1px solid red', borderCollapse: 'collapse' }}>
              <th style={{ width: '50%', border: '1px solid red', borderCollapse: 'collapse' }}>No Pending</th>
              <th style={{ width: '50%', border: '1px solid red', borderCollapse: 'collapse' }}>{kartuKuning.nomor}</th>
            </tr>
            <tr style={{ height: "25px", verticalAlign: "TOP", border: '1px solid red', borderCollapse: 'collapse' }} >
              <td style={{ border: '1px solid red', borderCollapse: 'collapse' }}>Nama</td>
              <td style={{ border: '1px solid red', borderCollapse: 'collapse' }}>{pasien.nama}</td>
            </tr>
            <tr style={{ height: "25px", verticalAlign: "TOP", border: '1px solid red', borderCollapse: 'collapse' }} >
              <td style={{ border: '1px solid red', borderCollapse: 'collapse' }}>Tempat /Tgl Lahir</td>
              <td style={{ border: '1px solid red', borderCollapse: 'collapse' }}>{pasien.tempat_lahir} / {pasien.tanggal_lahir}</td>
            </tr>
            <tr style={{ height: "25px", verticalAlign: "TOP", border: '1px solid red', borderCollapse: 'collapse' }} >
              <td style={{ border: '1px solid red', borderCollapse: 'collapse' }}>Alamat</td>
              <td style={{ border: '1px solid red', borderCollapse: 'collapse' }}>{pasien.alamat.replace(/(\r\n|\n|\r)/gm, ' ')}</td>
            </tr>
            <tr style={{ height: "25px", verticalAlign: "TOP", border: '1px solid red', borderCollapse: 'collapse' }} >
              <td style={{ border: '1px solid red', borderCollapse: 'collapse' }}>No Telp</td>
              <td style={{ border: '1px solid red', borderCollapse: 'collapse' }}>{pasien.nomor_telepon}</td>
            </tr>
            <tr style={{ height: "25px", verticalAlign: "TOP", border: '1px solid red', borderCollapse: 'collapse' }} >
              <td style={{ border: '1px solid red', borderCollapse: 'collapse' }}>Jenis Penyakit</td>
              <td style={{ border: '1px solid red', borderCollapse: 'collapse' }}>{pasien.penyakit == "BENJOLAN" ? "BENJOLAN / " : ""} {pasien.diagnosa}</td>
            </tr>
            <tr style={{ height: "25px", verticalAlign: "TOP", border: '1px solid red', borderCollapse: 'collapse' }} >
              <td style={{ border: '1px solid red', borderCollapse: 'collapse' }}>Keterangan</td>
              <td style={{ border: '1px solid red', borderCollapse: 'collapse' }}>{kartuKuning.perhatian?.map(value => <>{value}<br /></>)}</td>
            </tr>
          </tbody></table>
      </div>
    );
  }
}
