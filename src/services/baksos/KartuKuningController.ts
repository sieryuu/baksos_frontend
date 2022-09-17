import { GetRequest } from "@/utils/requests";

export async function queryPasienKartuKuning(pasienId: number) {
    return GetRequest<KartuKuningType[]>(`/kartu-kuning/?pasien=${pasienId}`)
}