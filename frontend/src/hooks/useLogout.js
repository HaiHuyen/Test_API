import axios from 'axios'
import useStore from '../store/useStore';

function useLogout() {
    const { dispatch } = useStore()

    const logout = async () => {
        dispatch({
            type: "LOG_OUT"
        })
        const token = sessionStorage.getItem('jwt')
        try {
            await axios('/logout', {
                token: token
            }, {
                withCredentials: true
            })
            sessionStorage.clear()
        } catch(err) {
            console.error(err)
        }
    }
   
    return logout;
}

export default useLogout;