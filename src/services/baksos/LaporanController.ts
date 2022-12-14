import { BAKSOS_BACKEND_URL } from "@/constants";
import { GetRequest } from "@/utils/requests";
import { request, AxiosResponse } from "@umijs/max";
import { GetCurrentUserToken } from "./UserController";

export async function queryLaporanPendaftaran() {
    return GetRequest('/laporan/laporan_pendaftaran');
}

export async function downloadLaporanPendaftaran() {
    const token = GetCurrentUserToken()
    return request<AxiosResponse>(BAKSOS_BACKEND_URL + '/laporan/download_laporan_pendaftaran/', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": 'token ' + token } : {}),
        },
        getResponse: true,
        responseType: 'blob'
    })
}

export async function queryLaporanScreening(tgl: string) {
    return GetRequest(`/laporan/laporan_screening?tgl=${tgl}`);
}

export async function downloadLaporanScreening(tgl: string) {
    const token = GetCurrentUserToken()
    return request<AxiosResponse>(BAKSOS_BACKEND_URL + `/laporan/download_laporan_screening/?tgl=${tgl}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": 'token ' + token } : {}),
        },
        getResponse: true,
        responseType: 'blob'
    })
}

export async function queryLaporanKehadiran(tgl: string) {
    return GetRequest(`/laporan/laporan_kehadiran/?tgl=${tgl}`);
}

export async function downloadLaporanKehadiran() {
    const token = GetCurrentUserToken()
    return request<AxiosResponse>(BAKSOS_BACKEND_URL + '/laporan/download_laporan_kehadiran/', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": 'token ' + token } : {}),
        },
        getResponse: true,
        responseType: 'blob'
    })
}