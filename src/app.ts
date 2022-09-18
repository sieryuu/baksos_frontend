import { history } from 'umi';
import { GetCurrentUserToken, getPermission, LogoutUser } from './services/baksos/UserController';

export async function getInitialState(): Promise<{ name: string, userPermission?: UserPermissionType }> {
  if (history.location.pathname !== '/login') {
    try {
      const currentUser = GetCurrentUserToken();
      if (!currentUser)
        throw "";
      const userPermission = await getPermission()
      return { name: userPermission.user.username, userPermission: userPermission };
    } catch (error) {
      history.push('/login');
    }
  }
  return { name: "", userPermission: undefined }
}

export const layout = () => {
  return {
    logo: 'https://www.tzuchi.or.id/uploads/images/logo-1.jpg',
    menu: {
      locale: false,
    },
    layout: "top",
    logout: () => {
      LogoutUser()
      history.push('/login')
    },
    onPageChange: () => {
      const user = GetCurrentUserToken();
      const { location } = history;
      if (!user && location.pathname !== '/login') {
        history.push('/login');
      }
    },
  };
};
