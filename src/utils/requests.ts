import { BAKSOS_BACKEND_URL } from "@/constants"
import { GetCurrentUserToken } from "@/services/baksos/UserController"
import { AxiosResponse } from "@umijs/max"
import { request } from "@umijs/max"

export const BaksosRequest = <T>(method: string, url: string, params?: any, data?: any) => {
    const token = GetCurrentUserToken()
    return request<T>(BAKSOS_BACKEND_URL + url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": 'token ' + token } : {}),
        },
        params: (params || {}),
        data: (data || {})
    })
}

export const GetRequest = <T>(url: string, params?: any) => {
    return BaksosRequest<T>('GET', url, params, {});
}

export const PostRequest = <T>(url: string, data?: any) => {
    return BaksosRequest<T>('POST', url, {}, data);
}

export const PutRequest = <T>(url: string, data?: any) => {
    return BaksosRequest<T>('PUT', url, {}, data);
}

export const PatchRequest = <T>(url: string, data?: any) => {
    return BaksosRequest<T>('PATCH', url, {}, data);
}

export const ParseResponseError = (err: any) => {
    let errDescription = ""
    if (typeof err.response.data === typeof "")
        errDescription = err.response.data
    else {
        for (let k in err.response.data) {
            errDescription += `${k}: ${err.response.data[k]}`
        }
    }
    return errDescription
}