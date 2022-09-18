import { GetRequest, PostRequest } from "@/utils/requests";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export async function login(loginParams: LoginProps) {
    return PostRequest<LoginType>('/api-token-auth/', loginParams)
}

export async function getPermission() {
    return GetRequest<UserPermissionType>(`/user/get_user_permission/`)
}

export async function SaveUserToken(token: string) {
    cookies.set('token', token)
}

export const GetCurrentUserToken = () => {
    return cookies.get('token')
}

export const LogoutUser = () => {
    cookies.remove('token')
}