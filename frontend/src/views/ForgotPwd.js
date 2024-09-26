import styles from './ForgotPwd.module.css'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ForgotPwd() {
    const [email, setEmail] = useState('')

    const axiosPrivate = useAxiosPrivate()
    
    const navigate = useNavigate()
    const from = '/verifyOTP'
    
    const handleConfirm = async () => {
        try {
            if(email == '') {
                alert("You need to enter your email first!")
                return;
            }
            await axiosPrivate.post("/sendOTP", {
                email: email
            }).then(res => {
                if(res.status === 401) {
                    alert("Invalid email") 
                } else {
                    navigate(from, 
                    { state: 
                        { email: email,
                            token: res.data.token,
                            OTP: res.data.OTP
                        }, replace: true
                    })
                }
            })
        } catch (error) {  
            console.log(error)
        }
    }

    return (
        <div>
            <div className={`${styles.wrapper} ${styles.email_section}`}>
                <h2>Forgot your password</h2>
                <p>Please enter the email address you'd like your password reset information sent to</p>
                <input 
                    onChange={e => setEmail(e.target.value)} type='email' placeholder='' />
                <button onClick={handleConfirm}>Confirm</button>
            </div>
        </div>
    );
}

export default ForgotPwd;