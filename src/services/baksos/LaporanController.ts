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

export async function queryLaporanScreening() {
    return GetRequest('/laporan/laporan_screening');
}

export async function downloadLaporanScreening() {
    const token = GetCurrentUserToken()
    return request<AxiosResponse>(BAKSOS_BACKEND_URL + '/laporan/download_laporan_screening/', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": 'token ' + token } : {}),
        },
        getResponse: true,
        responseType: 'blob'
    })
}

export async function queryLaporanKehadiran() {
    return GetRequest('/laporan/laporan_kehadiran');
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