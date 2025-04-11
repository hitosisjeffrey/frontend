
import type { PayLoad } from './blog-service';

const getAccessToken = () => {
    return localStorage.getItem('access_token')
}

export const apiService = {
    async request(method: string, url: string, payload?: PayLoad) {

        url = process.env.VITE_API_URL! + url;
        try {
            const token = getAccessToken()
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            }

            const options = {
                method,
                headers,
                ... (payload && { body: JSON.stringify(payload) })
            }

            console.log(url);
            console.log(options);


            const response = await fetch(url, options)

            if (!response.ok) {
                if (response.status === 401) {
                    window.location.href = '/#/login'
                }
                throw new Error(`Request failed with status ${response.status}`)
            }

            const data = await response.json()
            return data
        } catch (error) {
            console.error('API Request Error:', error)
            throw error
        }
    }
}
