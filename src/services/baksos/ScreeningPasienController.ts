import { GetRequest, PostRequest } from "@/utils/requests";

export async function queryPasienScreening(pasienId: string) {
    return GetRequest<ScreeningPasienType[]>(`/screening-pasien/?pasien=${pasienId}`)
}

/// hadir

export async function CapKehadiranTensi(params: CapKehadiranType) {
    return PostRequest<string>('/screening-pasien/hadir_cek_tensi/', params)
}

export async function CapKehadiranPemeriksaan(params: CapKehadiranType) {
    return PostRequest<string>('/screening-pasien/hadir_pemeriksaan/', params)
}

export async function CapKehadiranLab(params: CapKehadiranLabType) {
    return PostRequest<string>('/screening-pasien/hadir_lab/', params)
}

export async function SimpanHasilRadiologi(pasienScreeningId: number, params: HasilRadiologiType) {
    return PostRequest<string>(`/screening-pasien/${pasienScreeningId}/hasil_radiologi/`, params)
}

export async function CapKehadiranRadiologi(params: CapKehadiranType) {
    return PostRequest<string>('/screening-pasien/hadir_radiologi/', params)
}

export async function CapKehadiranEkg(params: CapKehadiranType) {
    return PostRequest<string>('/screening-pasien/hadir_ekg/', params)
}

/// cancel

export async function CancelPemeriksaan(pasienScreeningId: number) {
    return PostRequest<string>(`/screening-pasien/${pasienScreeningId}/batal_pemeriksaan/`)
}

export async function CancelLab(pasienScreeningId: number) {
    return PostRequest<string>(`/screening-pasien/${pasienScreeningId}/batal_lab/`)
}

export async function CancelRadiologi(pasienScreeningId: number) {
    return PostRequest<string>(`/screening-pasien/${pasienScreeningId}/batal_radiologi/`)
}

export async function CancelEkg(pasienScreeningId: number) {
    return PostRequest<string>(`/screening-pasien/${pasienScreeningId}/batal_ekg/`)
}

export async function CancelKK(pasienScreeningId: number) {
    return PostRequest<string>(`/screening-pasien/${pasienScreeningId}/batal_kartu_kuning/`)
}