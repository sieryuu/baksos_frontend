interface PasienType {
    id?: number;
    nomor_seri: string;
    puskesmas: string;
    penyakit: string;
    nama: string;
    jenis_kelamin: string;
    alamat: string;
    nomor_telepon: string;
    nomor_identitas: string;
    tipe_identitas: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    tanggal_lahir_moment: moment.Moment | null;
    umur: string;
    nama_keluarga: string;
    nomor_telepon_keluarga: string;
    daerah: string;
    pulau: string;
    diagnosa?: string;

    nomor_antrian?: string;
    tanggal_nomor_antrian?: Date;
    perlu_rescreen?: boolean;
    perlu_radiologi?: boolean;
    perlu_ekg?: boolean;
}