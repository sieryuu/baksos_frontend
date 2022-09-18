import { GetRequest, PutRequest } from "@/utils/requests";

export async function queryPasienDetail(pasienId: number) {
    return GetRequest<DetailPasienType[]>(`/detail-pasien/?pasien=${pasienId}`)
}

export async function updatePasienDetail(pasienDetail: DetailPasienType) {
    return PutRequest(`/detail-pasien/${pasienDetail.pasien}`, pasienDetail)
}