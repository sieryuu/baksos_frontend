import moment from 'moment';
import React from 'react';

interface InfoConsentProps {
  pasien: PasienType;
}

export default class InfoConsentTemplate extends React.PureComponent<InfoConsentProps> {
  render() {
    const { pasien } = this.props;
    const year = moment().diff(moment(pasien.tanggal_lahir, "YYYY-MM-DD"), 'years');
    const isBocah = year < 17;

    console.log(isBocah)

    return (
      <div style={{ fontSize: '15px' }}>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr style={{ verticalAlign: 'top', height: "258px" }} >
              <th style={{ width: '30%' }} />
              <th style={{ width: '15%' }}> </th>
              <th style={{ width: '45%' }}> </th>
              <th style={{ width: '15%' }}> </th>
            </tr>
            <tr style={{ height: "25px" }}>
              <td />
              <td style={{ verticalAlign: "TOP" }} colSpan={2}>{isBocah ? "" : pasien.nama}</td>
            </tr>
            <tr style={{ height: "25px" }}>
              <td />
              <td style={{ verticalAlign: "TOP" }} colSpan={2}>{isBocah ? "" : pasien.tempat_lahir + " / " + pasien.tanggal_lahir}</td>
            </tr>
            <tr style={{ height: "25px" }}>
              <td />
              <td style={{ verticalAlign: "TOP" }} colSpan={2}>{isBocah ? "" : pasien.alamat.replace(/(\r\n|\n|\r)/gm, ' ')}</td>
            </tr>
            <tr style={{ height: "25px" }}>
              <td />
              <td style={{ verticalAlign: "TOP" }} colSpan={2}>{isBocah ? "" : pasien.nomor_telepon}</td>
            </tr>
            <tr style={{ height: "110px" }}>
              <td />
              <td style={{ verticalAlign: "TOP" }} colSpan={2}>{isBocah ? "" : pasien.nomor_identitas + "(" + pasien.tipe_identitas + ")"}</td>
            </tr>
            <tr style={{ height: "25px" }}>
              <td />
              <td style={{ verticalAlign: "TOP" }} colSpan={2}>{isBocah ? pasien.nama : ""}</td>
            </tr>
            <tr style={{ height: "25px" }}>
              <td />
              <td style={{ verticalAlign: "TOP" }} colSpan={2}>{isBocah ? pasien.tempat_lahir + " / " + pasien.tanggal_lahir : ""}</td>
            </tr>
            <tr style={{ height: "25px" }}>
              <td />
              <td style={{ verticalAlign: "TOP" }} colSpan={2}>{isBocah ? pasien.alamat : ""}</td>
            </tr>
          </tbody>
        </table>
      </div >
    );
  }
}
