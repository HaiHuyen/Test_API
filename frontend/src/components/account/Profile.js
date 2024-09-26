import styles from './ManageAccount.module.css'
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import axios from 'axios'

function Profile({user}) {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [id, setId] = useState('')

    const [hidden, setHidden] = useState(false)

    const handleClick = (e) => {
        if(username === '' || email === '') {
            setUsername(user.username)
            setEmail(user.email)
        }
        setId(e.target.dataset.value);
        setHidden(!hidden)
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.put('/account/update', {
                id: user.id,
                username: username,
                email: email,
                password: password
            }, { withCredentials: true })
            .then(res => {
                console.log(res)
                window.location.reload();
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleCancel = () => {
        setHidden(!hidden)

        setUsername(user.username)
        setEmail(user.email)
        setPassword('')
    }

    return (
        <form name='Profile' onSubmit={handleSubmit} className={`${styles.wrapper} mt-2`}>
            <h1>My Account</h1>
            <div className={styles.section}>
                <div className={styles.info}>
                    <label htmlFor='username'>Username</label>
                    <div className={styles.container}>
                        <p className={`${(hidden === true && id === 'username') ? 'hidden' : styles.show}`}>{username ? username : user.username}</p>
                        <input
                            className={`${(hidden === true && id === 'username') ? styles.show : 'hidden'}`}
                            type='text'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            id='username'
                            autoComplete=''
                        />
                    </div>
                    <button type='button' data-value='username' onClick={handleClick}><FontAwesomeIcon icon={faPenToSquare} /> Edit</button>
                </div>

                <div className={styles.info}>
                    <label htmlFor='email'>Email</label>
                    <div className={styles.container}>
                        <p className={`${(hidden === true && id === 'email') ? 'hidden' : ''}`}>{email ? email : user.email}</p>
                        <input
                            className={`${(hidden === true && id === 'email') ? styles.show : 'hidden'}`}
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id='email'
                            autoComplete=''
                        />
                    </div>
                    <button type='button' data-value='email' onClick={handleClick}><FontAwesomeIcon icon={faPenToSquare} /> Edit</button>
                </div>
                <div className={styles.info}>
                    <label htmlFor='password'>Password</label>
                    <div className={styles.container}>
                        <p className={`${(hidden === true && id === 'password') ? 'hidden' : styles.show}`}>*****************</p>
                        <input
                            className={`${(hidden === true && id === 'password') ? styles.show : 'hidden'}`}
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            id='password'
                            autoComplete='current-password'
                        />
                    </div>
                    <button type='button' data-value='password' onClick={handleClick}><FontAwesomeIcon icon={faPenToSquare} /> Edit</button>
                </div>
            </div>
            <div className={`${hidden === false ? styles.none : styles.button_area}`}>
                <Button type='submit' 
                    className={`${styles.btn_size}`}
                    variant="outline-dark"
                >Save</Button>
                <Button className={`${styles.btn_size}`} onClick={handleCancel} variant="light">Cancel</Button>
            </div>
        </form>
    );
}

export default Profile;