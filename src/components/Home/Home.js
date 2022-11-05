import { useState, useEffect } from "react"
import { Form, Spin, Row, Card, Avatar, Descriptions, Col, Divider, Input, Space, Modal, Button, Checkbox, Typography, message } from "antd"
import { apiSend } from "../../utils/api.service"
const { Title } = Typography
const { Meta } = Card
const { Search } = Input

export default function Home({ token }) {
    const [form] = Form.useForm()
    const [clients, setClients] = useState({loading: false, clientsObtained: false, clients:[]})
    const [user, setUser] = useState(undefined)
    const [modal, setModal] = useState({open: false, loading: false})

    useEffect(() => {
        getClients({})
    }, [])
    
    const getClients = async (query) => {
        setClients({...clients, loading: true})
        const method = 'POST'
        const endpoint = '/data'
        const response = await apiSend({endpoint, token, method, body: query})
        setClients({loading: false, clientsObtained: true, clients: response?.clients ?? []})
        setUser(response.user)
    }

    const createUser = async () => {
        setModal({...modal, loading: true})
        const formValues = await form.validateFields()
        const method = 'PUT'
        const endpoint = '/register'
        if (formValues.isAdmin === undefined) formValues.isAdmin = false
        apiSend({endpoint, token, method, body: formValues})
            .then(value => {
                setModal({open: false, loading: false})
                message.success("Usuario creado con exito")
            }).catch(error => message.error(`Error en la creacion del usuario || ${error}`))
    }

    const onSearch = (value) => {
        if (value !== '') getClients({ user_name: value })
        else getClients({})
    }

    const modalNewUser = (
        <Form form={form} name='login'>
            <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Username is required!' }]}>
                <Input type="text"/>
            </Form.Item>
            <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Password is required' }]}>
                <Input type="password"/>
            </Form.Item>
            <Form.Item name="isAdmin" valuePropName="checked">
                <Checkbox>Es usuario administrador</Checkbox>
            </Form.Item>
        </Form>
    )
    
    return (
        <>
        <Row justify='space-around'>
            {
                (user && user.isAdmin) ? 
                    <>
                    <Button onClick={() => setModal({open:true})}>Crear nuevo usuario</Button>
                    <Modal confirmLoading={modal.loading} title="Registrar usuario" open={modal.open} onOk={createUser} onCancel={() => setModal({open:false})}>
                        {modalNewUser}
                    </Modal>
                    </>
                : null
            }
            <Title level={4}>{user ? user.username : null}</Title>
        </Row>
        <Divider/>
        <Search loading={clients.loading} type="text" placeholder="Buscar por nombre del cliente" onSearch={onSearch} allowClear/>
        {
            clients.loading ?
                <Row style={{marginTop: '40px'}} size="large" justify="center" align="center"><Spin/></Row>
            : clients.clientsObtained ? 
                <Space style={{marginTop: '40px'}} direction="vertical" size="middle">
                    <Row justify="space-around" gutter={[16,16]}>
                        {
                            clients.clients.map(client => {
                                return (
                                    <Col span={8} key={client._id['$oid']}>
                                        <Card size="small" hoverable>
                                            <Meta avatar={<Avatar src={client.foto_dni}/>} title={client.user_name}/>
                                            <Divider/>
                                            <Descriptions size="small" layout="vertical">
                                                <Descriptions.Item label="Address">{client.direccion}</Descriptions.Item>
                                                <Descriptions.Item label="Credit card ccv">{client.credit_card_ccv}</Descriptions.Item>
                                                <Descriptions.Item label="Credit card number">{client.credit_card_num.replace(/[0-9](?=.*.{4})/g, "*")}</Descriptions.Item>
                                            </Descriptions>
                                        </Card>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </Space>
            : null
        }
        </>
    )
}