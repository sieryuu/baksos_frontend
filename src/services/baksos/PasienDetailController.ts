import { GetRequest, PostRequest, PutRequest } from "@/utils/requests";

export async function queryPasienDetail(pasienId: number) {
    return GetRequest<DetailPasienType[]>(`/detail-pasien/?pasien=${pasienId}`)
}

export async function updatePasienDetail(detail_pasien_id: number, pasienDetail: DetailPasienType) {
    return PutRequest(`/detail-pasien/${detail_pasien_id}/`, pasienDetail)
}

export async function createPasienDetail(pasienDetail: DetailPasienType) {
    return PostRequest(`/detail-pasien/`, pasienDetail)
}