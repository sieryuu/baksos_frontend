import { BAKSOS_BACKEND_URL } from '@/constants';
import { GetRequest, PatchRequest, PostRequest, PutRequest } from '@/utils/requests';
import { AxiosResponse, request } from '@umijs/max';
import moment from 'moment';
import { GetCurrentUserToken } from './UserController';

export async function queryPasienList(page: number, pageSize: number) {
    return GetRequest<PaginationType<PasienType>>('/pasien/', {
        offset: page - 1,
        limit: pageSize
    });
}

export async function queryPasienByNoSeri(no_seri: string) {
    return GetRequest<PasienType[]>('/pasien/', {
        nomor_seri: no_seri
    });
}

export async function searchPasien(param: string) {
    return GetRequest<PasienType[]>('/pasien/', {
        search: param
    });
}

export async function queryPasienByNoAntrianAndPenyakit(penyakit: string, nomor_antrian: string) {
    if (!penyakit) return [];

    return GetRequest<PasienType[]>('/pasien/', {
        penyakit__grup: penyakit,
        nomor_antrian: nomor_antrian,
        tanggal_antri_after: moment().format("YYYY-MM-DD"),
        tanggal_antri_before: moment().add(1, 'days').format("YYYY-MM-DD")
    });
}

export async function queryPasienById(id: string) {
    return GetRequest<PasienType>(`/pasien/${id}`);
}

export async function createPasien(pasien: any) {
    return PostRequest<PasienType>('/pasien/', pasien)
}

export async function patchPasien(id: number, pasien: any) {
    return PatchRequest<PasienType>(`/pasien/${id}/`, pasien)
}

export async function updatePasienHadir(id: number, nomor_antrian: string) {
    return PostRequest(`/pasien/${id}/serah_nomor_antrian/`, {
        nomor_antrian: nomor_antrian
    })
}

export async function batalNomorAntrian(id: number) {
    return PostRequest<string>(`/pasien/${id}/batal_nomor_antrian/`)
}

export async function getPasienTemplate() {
    const token = GetCurrentUserToken()
    return request<AxiosResponse>(BAKSOS_BACKEND_URL + '/pasien/template/', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": 'token ' + token } : {}),
        },
        getResponse: true,
        responseType: 'blob'
    })
}

export async function importPasien(file: any) {
    const token = GetCurrentUserToken()
    return request<AxiosResponse>(BAKSOS_BACKEND_URL + '/pasien/import_pasien/', {
        method: 'POST',
        headers: {
            "Content-Type": "multipart/form-data",
            ...(token ? { "Authorization": 'token ' + token } : {}),
        },
        getResponse: true,
        data: {
            'file': file
        }
    })
}

export async function SerahKartuKuning(pasien_id: number, values: SerahKartuKuningType) {
    return PostRequest<string>(`/pasien/${pasien_id}/serah_kartu_kuning/`, values)
}

export async function BatalSerahKartuKuning(pasien_id: number) {
    return PostRequest<string>(`/pasien/${pasien_id}/batal_serah_kartu_kuning/`)
}

export async function PendingTensi(pasien_id: number) {
    return PostRequest<string>(`/pasien/${pasien_id}/pending_tensi/`)
}

