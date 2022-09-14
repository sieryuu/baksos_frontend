import { GetRequest } from "@/utils/requests";

export async function queryPuskesmas() {
    return GetRequest<PuskesmasType[]>('/puskesmas/')
}

export async function queryPenyakit() {
    return GetRequest<PenyakitType[]>('/penyakit/')
}
