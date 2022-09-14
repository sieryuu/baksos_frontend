interface ScreeningPasienType {
    id: number;
    pasien: string;
    telah_lewat_cek_tensi?: boolean;
    jam_cek_tensi: string;
    telah_lewat_pemeriksaan?: boolean;
    petugas_cek_tensi: string;
    jam_pemeriksaan: string;
    petugas_pemeriksaaan: string;
    telah_lewat_cek_lab?: boolean;
    jam_cek_lab: string;
    petugas_cek_lab: string;
    telah_lewat_cek_radiologi?: boolean;
    jam_cek_radiologi: string;
    petugas_cek_radiologi: string;
    tipe_hasil_rontgen: string;
    nomor_kertas_penyerahan: string;
    telah_lewat_cek_ekg?: boolean;
    jam_cek_ekg: string;
    petugas_cek_ekg: string;
    telah_lewat_cek_kartu_kuning?: boolean;
    jam_cek_kartu_kuning: string;
    petugas_cek_kartu_kuning: string;
    nomor_kartu_kuning: string;
}