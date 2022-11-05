
export const apiSend = async ({endpoint, token, method, body}) => {
    let request = {
        method,
        headers: { 
            'Content-Type': 'application/json',
            'x-access-tokens': token
        },
        body: JSON.stringify(body)
    }

    try {
        const response = await fetch(`http://localhost:5000${endpoint}`, request)
        return response.json()
    } catch (error) {
        return {error}
    }

}