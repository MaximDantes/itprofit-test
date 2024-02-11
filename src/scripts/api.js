export const api = {
    sendMessage: async (message) => {
        try {
            const response = await fetch('http://127.0.0.1:9090/api/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify(message),
            })
            const result = await response.json()

            if (result.status === 'error' && !result.fields) {
                throw new Error(result.message)
            }

            return result
        } catch (e) {
            return {
                status: 'error',
                message: e.message || 'Something went wrong',
            }
        }
    },

    registration: async (credentials) => {
        try {
            const response = await fetch(
                'http://127.0.0.1:9090/api/registration',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify(credentials),
                }
            )
            if (response.status === 200) {
                return {
                    status: 'success',
                    message: 'Succeed registration',
                }
            } else {
                throw new Error('Failed registration')
            }
        } catch (e) {
            return {
                status: 'error',
                message: e.message || 'Something went wrong',
            }
        }
    },

    ping: async () => {
        try {
            await fetch('http://127.0.0.1:9090/api/ping')
        } catch (e) {
            return {
                status: 'error',
                message: 'Server is unavailable, try later',
            }
        }
    },
}
