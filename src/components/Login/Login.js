import './Login.css'
import { Input, Button, Typography, Form, message } from 'antd';
const { Title } = Typography

async function loginUser(credentials) {
    return fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}

export default function Login({ setToken }) {
    const [form] = Form.useForm()
    const login = async () => {
        const formValues = await form.validateFields()
        loginUser({username: formValues.username, password:formValues.password})
            .then(token => setToken(token))
            .catch(error => message.error('Error iniciando sesion, revisa los campos'))
    }

    return (
        <div className="login-wrapper">
            <Title>Log In</Title>
            <Form form={form} name='login'>
                <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Username is required!' }]}>
                    <Input type="text"/>
                </Form.Item>
                <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Password is required' }]}>
                    <Input type="password"/>
                </Form.Item>
                <Form.Item>
                    <Button type="submit" onClick={login}>Submit</Button>
                </Form.Item>
            </Form>
        </div>
    )
}