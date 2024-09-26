import axios from 'axios'
import useStore from "../store/useStore";

function useRefreshToken() {
    const { dispatch } = useStore()
    const refreshToken = sessionStorage.getItem('jwt')
    const refresh = async () => {
        const res = await axios.post('/refresh', {
            refreshToken: refreshToken
        }, {
            baseURL: 'http://localhost:3500',
            headers: { 'Content-Type': 'application/json'},
            withCredentials: true,
        })
        dispatch({
            type: 'REFRESH_TOKEN',
            payload: {
                email: res.data.email,
                token: res.data.accessToken,
                cartLength: res.data.cartLength
            }
        })
        return res.data.accessToken
    }

    return refresh
}

export default useRefreshToken;