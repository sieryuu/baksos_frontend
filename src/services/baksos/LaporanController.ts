import { GetRequest } from "@/utils/requests";

export async function queryLaporanPendaftaran() {
    return GetRequest('/laporan/laporan_pendaftaran');
}

export async function queryLaporanScreening() {
    return GetRequest('/laporan/laporan_screening');
}