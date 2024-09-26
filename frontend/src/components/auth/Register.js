import styles from './LogIn.module.css'
import Form from 'react-bootstrap/Form';
import { useReducer, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'

const initialState = {
    user: '',
    email: '',
    pwd: '',
    repeatPwd: '',
    terms: false
}

const reducer = (state, action) => {
    switch(action.type) {
        case "SET_USERNAME":
            return {
                ...state, 
                user: action.payload
            }

        case "SET_EMAIL":
            return {
                ...state, 
                email: action.payload
            }

        case "SET_PWD":
            return {
                ...state, 
                pwd: action.payload
            }

        case "SET_REPEAT_PWD":
            return {
                ...state, 
                repeatPwd: action.payload
            }

        case "SET_TERMS":
            return {
                ...state, 
                terms: action.payload
            }

        default:
            return state;
    }
}

function Register() {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [check, setCheck] = useState(true)
    
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || '/'
    
    const handleChange = (event) => {
        const {name, value} = event.target
        if(name === 'TERMS') {
            dispatch({
                type: "SET_" + name, payload: event.target.checked
            })
        } else {
            dispatch({
                type: "SET_" + name, payload: value
            })
            if (name === 'REPEAT_PWD') {
                if (value !== state.pwd) {
                  setCheck(false);
                } else {
                  setCheck(true);
                }
            }

        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(state.terms === true) {
            if(state.pwd === state.repeatPwd) {
                try {
                    await axios.post("/register", state)
                    .then(res => {
                        console.log(res)
                        alert("Successfully registered");
                        navigate(from, { replace: true })
                    })
                } catch(err) {
                    console.error(err)
                }

            } else {
                setCheck(false)
            }
        }
    }

    return (
        <form name='Register' onSubmit={handleSubmit} className={styles.columnRegister}>

            <div>
                <Form.Control name='USERNAME' value={state.user} className={`input p-2`} placeholder='Username' onChange={handleChange} />
            </div>

            <div>
                <Form.Control name='EMAIL' value={state.email} className={`input p-2`} type="email" placeholder='Email' onChange={handleChange} />
            </div>
            
            <div>
                <Form.Control                
                    value={state.pwd}
                    className={`input p-2`}
                    type="password"
                    name='PWD'
                    aria-describedby="passwordHelpBlock"
                    placeholder='Password'
                    onChange={handleChange}
                    autoComplete=''
                    autoFocus
                />
            </div>
            <div>
                <p className={`${styles.warning} ${check===false ? '' : 'hidden'}`}>The repeat password doesn't match with the previous one!</p>
                <Form.Control
                    value={state.repeatPwd}
                    className={`input ${check===true ? '' : styles.invalid} p-2`}
                    type="password"
                    name='REPEAT_PWD'
                    aria-describedby="passwordHelpBlock"
                    placeholder='Repeat password'
                    onChange={handleChange}
                    autoComplete=''
                />
            </div>
            <div className={styles.term}>
                <input name='TERMS' checked={state.terms} type="checkbox" id='checkTerm'
                    onChange={handleChange}
                />
                <label htmlFor='checkTerm'></label>
                <p>I have read and agree to the terms</p>
            </div>
            <div>
                <button name='signup' className={styles.btn}>SIGN UP</button>
            </div>
        </form>
    );
}

export default Register;