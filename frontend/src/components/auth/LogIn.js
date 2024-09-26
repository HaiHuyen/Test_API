import styles from './LogIn.module.css'
import { useState } from 'react';
import SignIn from './SignIn';
import Register from './Register';

function LogIn() {
    const [hideSignIn, setHideSignIn] = useState(true)
    const [hideRegister, setHideRegister] = useState(false)

    const handleLogIn = () => {
        if(hideSignIn === false) {
            setHideSignIn(true)
            setHideRegister(false)
        }
    }

    const handleRegister = () => {
        if(hideRegister === false) {
            setHideSignIn(false)
            setHideRegister(true)
        }
    }

    return (
        <div className={styles.wrapper}>
            <h1>RAYNE</h1>
            <div className={styles.choice}>
                <button name='login' onClick={handleLogIn}>LOGIN</button>
                <button name='register' onClick={handleRegister}>REGISTER</button>
            </div>

            <div className={styles.body}>
                <div className={`${styles.signin} ${hideSignIn ? styles.show : ''}`}>
                    <SignIn/>
                    <div className={styles.wrapper_register}>
                        <p>Do not have account? <button className={styles.showRegister} onClick={handleRegister}>Register</button></p>
                    </div>
                </div>

                <div className={`${styles.register} ${hideRegister ? styles.show : ''}`}>
                    <Register/>
                </div>
            </div>
        </div>
    );
}

export default LogIn;