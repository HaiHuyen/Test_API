import styles from './ForgotPwd.module.css'
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function ResetPwd() {
    const [pwd, setPwd] = useState('')
    const [resetPwd, setResetPwd] = useState('')
    const { token, userId } = useParams()

    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()

    const handleResetPwd = async () => {
        if(token === '' || userId === '') {
            alert("UserID and token are both required")
            return;
        }
        if((pwd === resetPwd) && pwd !== '' && resetPwd !== '') {
            try {
                await axiosPrivate.put(`/resetPwd/${token}/${userId}`, {
                    pwd: pwd
                }).then(res => {
                    console.log(res)
                    navigate('/')
                })
                .then(res => {
                    if(res.status === 403) {
                        alert("The code for reset password session is expired. Choose 'Forgot password' and start over")
                    }
                })
            } catch (error) {
                console.log(error)
            }
        } else if(pwd === '' || resetPwd === '') {
            alert("Please fill all fields!")
        } else {
            alert("The new password doesn't match the repeat one");
        }
    }

    return (
        <div className={`${styles.wrapper}`}>
            <h2>Reset your password</h2>
            <p>Enter a new password to reset the password on your account. We'll ask for this password whenever you log in</p>
            <div>
                <Form.Group>
                    <Form.Label>New password</Form.Label>
                    <Form.Control
                        className={`input p-2`}
                        type="password"
                        placeholder='Password'
                        autoComplete=''
                        onChange={e => setPwd(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mt-3">
                    <Form.Label>Confirm new password</Form.Label>
                    <Form.Control
                        className={`input p-2 `}
                        type="password"
                        placeholder='Repeat password'
                        autoComplete=''
                        onChange={e => setResetPwd(e.target.value)}
                    />
                </Form.Group>
            </div>
            <button onClick={handleResetPwd} className={`${styles.reset_btn} mt-5`}>Confirm</button>
        </div>
    );
}

export default ResetPwd;