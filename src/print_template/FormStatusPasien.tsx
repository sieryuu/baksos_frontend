import React from 'react';

interface FormStatusPasienProps {
    pasien: PasienType;
}

export default class FormStatusPasien extends React.PureComponent<FormStatusPasienProps> {
    render() {
        const { pasien } = this.props;
        return (
            <div style={{ fontSize: '15px' }}>
                <table style={{ width: '100%' }}>
                    <tr style={{ verticalAlign: 'top', height: '100px' }}>
                        <th style={{ width: '16%' }}></th>
                        <th style={{ width: '40%' }}> </th>
                        <th style={{ width: '40%' }}> </th>
                        <th style={{ width: '20%' }}> </th>
                    </tr>
                    <tr style={{ height: "50px" }}>
                        <td></td>
                        <td></td>
                        <td>Pendamping: {pasien.nama_keluarga} ({pasien.nomor_telepon_keluarga})</td>
                        <td></td>
                    </tr>
                    <tr style={{ height: '25px' }}>
                        <td></td>
                        <td colSpan={2}>{pasien.nama}</td>
                    </tr>
                    <tr style={{ height: '20px' }}>
                        <td></td>
                        <td valign="top" colSpan={2}>
                            {pasien.alamat.replace(/(\r\n|\n|\r)/gm, ' ')}
                        </td>
                    </tr>
                </table>
            </div>
        );
    }
}
