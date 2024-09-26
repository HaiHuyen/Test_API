import styles from './LogIn.module.css'
import { useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';

function OTPInput() {
    const location = useLocation();
    const navigate = useNavigate();
    const value = location.state;
    
    const [token, setToken] = useState(value.token)
    const [OTP, setOTP] = useState(value.OTP)

    const axiosPrivate = useAxiosPrivate()

    const handleVerifyAccount = async () => {
        const otpWrap = document.getElementById('otp_wrap');
        const inputElements = otpWrap.querySelectorAll('input');

        let numberString = ''
        inputElements.forEach((input) => {
          numberString += input.value
        });
        if(numberString === '') alert("Please enter the OTP first!")
        const OTPnum = parseInt(numberString)
        if(typeof OTP === 'number' && !isNaN(OTP)) {
            if(OTPnum === OTP) {
                try {
                    await axiosPrivate.get(`/checkOTP/${token}`)
                    .then(res => {
                        navigate(`/resetPwd/${res.data.token}/${res.data.userId}`, { replace: true })
                    })
                } catch (error) {   
                    console.log(error)
                }
            }
        }
    }
//kyokomurasaki1392003@gmail.com
    const handleSentAgain = async () => {
        if(value.email == '') {
            alert("You need to enter your email first!")
            return;
        }
        try {
            await axiosPrivate.post('/sendOTP', {
                email: value.email
            }).then((res) => {
                console.log(res.data)
                setToken(res.data.token)  
                setOTP(res.data.OTP)
            })  
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={`${styles.confirm_wrapper}`}>
            <h3>Email Verification</h3>
            <p>We have sent a code to your email</p>
            <div id='otp_wrap' className={`${styles.otp_wrap} d-flex justify-content-center align-items-center`}>
                <input type='text' inputMode='numeric' maxLength="1" />
                <input type='text' inputMode='numeric' maxLength="1" />
                <input type='text' inputMode='numeric' maxLength="1" />
                <input type='text' inputMode='numeric' maxLength="1" />̃
            </div>
            <div className={`d-flex justify-content-center align-items-center`}>
                <button 
                    className={styles.verify_btn}
                    onClick={handleVerifyAccount}
                >Verify Account</button>
            </div>
            <p>Didn't receive code? <button
                className={styles.sent_btn}
                onClick={handleSentAgain}
            >Sent again</button></p>
        </div>
    );
}

export default OTPInput;