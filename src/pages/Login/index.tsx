import { getPermission, login, SaveUserToken } from '@/services/baksos/UserController';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, notification, Row } from 'antd';
import { Formik } from 'formik';
import { Form, SubmitButton, Input } from 'formik-antd';
import { history } from 'umi';
import * as Yup from 'yup';


const LoginPage: React.FC = () => {
  const { setInitialState } = useModel('@@initialState');

  const handleLogin = (values: LoginProps, actions: any) => {
    login(values)
      .then(async (token) => {
        SaveUserToken(token.token);
        const userPermission = await getPermission()
        setInitialState({ name: userPermission.user.username, userPermission: userPermission })
        history.push('/')
      })
      .catch(err => {
        let errDescription = ""
        if (typeof err.response.data === typeof "")
          errDescription = err.response.data
        else {
          for (let k in err.response.data) {
            errDescription += `${k}: ${err.response.data[k]}`
          }
        }

        notification["warning"]({
          message: `Login Gagal`,
          description: errDescription,
        });
        actions.resetForm();
      })
  }

  return (
    <PageContainer title=" ">
      <Row align='middle' justify="center" style={{ minHeight: '80vh' }}>
        <Card>
          <Formik
            initialValues={{
              username: "",
              password: ""
            }}
            onSubmit={handleLogin}
            validationSchema={loginValidationSchema}
          >
            <Form layout="vertical">
              <Form.Item name="username" label="Username">
                <Input name="username" style={{ width: '200px' }} autoFocus />
              </Form.Item>
              <Form.Item name="password" label="Password">
                <Input type='password' name="password" style={{ width: '200px' }} />
              </Form.Item>
              <SubmitButton type='primary'>Login</SubmitButton>
            </Form>
          </Formik>
        </Card>
      </Row>
    </PageContainer >
  );
};

export default LoginPage;


const loginValidationSchema = Yup.object().shape({
  username: Yup.string().required('Wajib Isi'),
  password: Yup.string().required('Wajib Isi'),
});