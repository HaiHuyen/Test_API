import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../../hooks/useRefreshToken";
import useStore from "../../store/useStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

const PersistLogin = () => {
    const [isLoading, setLoading] = useState(true)
    const refresh = useRefreshToken()
    const { state } = useStore()

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch(err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }

        !state?.userInfo?.token ? verifyRefreshToken() : setLoading(false)
    }, [])

    return (
        <div>
            {
                isLoading ?
                <FontAwesomeIcon icon={faCircleNotch} spin />
                : <Outlet />
            }
        </div>
    );
}

export default PersistLogin;