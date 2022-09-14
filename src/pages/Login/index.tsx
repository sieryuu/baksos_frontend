import { login, SaveUserToken } from '@/services/baksos/UserController';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Row } from 'antd';
import { Formik } from 'formik';
import { Form, SubmitButton, Input } from 'formik-antd';
import { history } from 'umi';
import * as Yup from 'yup';


const LoginPage: React.FC = () => {
  const handleLogin = (values: LoginProps) => {
    login(values)
      .then((token) => {
        SaveUserToken(token.token);
        history.push('/')
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