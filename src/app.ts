import { history } from 'umi';
import { GetCurrentUserToken, LogoutUser } from './services/baksos/UserController';

export async function getInitialState(): Promise<{ name: string }> {
  if (history.location.pathname !== '/login') {
    try {
      const currentUser = GetCurrentUserToken();
      if (!currentUser)
        throw "";
      return {
        name: currentUser
      };
    } catch (error) {
      history.push('/login');
    }
  }
  return { name: '@jing/max' };
}

export const layout = () => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
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
