import styles from './OrderSuccessfully.module.css'

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
function OrderSuccessfully() {
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const timeId = setTimeout(() => {
            navigate('/', { state: { from: location }, replace: true})
        }, 3000);

        return () => {
            clearTimeout(timeId)
        }
    }, [])

    return (
        <div className={`${styles.wrapper} ${styles.flex}`}>
           <div className={`${styles.body} ${styles.flex}`}>
               <div className={`${styles.tick} ${styles.flex}`}>
                    <p>&#10004;</p>
               </div>
               <div className={styles.text}>
                <p>Your order is success!</p>
                <p>Please calmly wait for the package to come</p>
               </div>
           </div>
        </div>
    );
}

export default OrderSuccessfully;