import styles from './ManageAccount.module.css'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import data from '../../api/data'
import { useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

function ShippingAddress({user}) {
    const [fullname, setFullname] = useState('')
    const [tel, setTel] = useState('')
    const [city, setCity] = useState(user.shippingAddress.city)
    const [address, setAddress] = useState('')

    const axiosPrivate = useAxiosPrivate()
    const [hidden, setHidden] = useState(false)
    const [id, setId] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(user.id === '' || fullname === '' || tel === '' || city === '' || address === '') {
            alert("Some fields are empty")
            return;
        }
        try {   
            await axiosPrivate.put('/account/update', {
                shippingAddress: {
                    id: user.id,
                    fullName: fullname,
                    tel: tel,
                    city: city,
                    address: address
                }
            }, { withCredentials: true })
            .then(res => {
                console.log(res)
                window.location.reload();
            })
        } catch (error) {
            console.error(error)
        }
    }

    const handleClick = (e) => {
        if(fullname === '' || tel === '' || city === '' || address === '') {
            setFullname(user.shippingAddress.fullName)
            setTel(user.shippingAddress.tel)
            setCity(user.shippingAddress.city)
            setAddress(user.shippingAddress.address)
        }
        setId(e.target.dataset.value);
        setHidden(!hidden)
    }

    const handleCancel = () => {
        setHidden(!hidden)

        setFullname(user.shippingAddress.fullName)
        setTel(user.shippingAddress.tel)
        setCity(user.shippingAddress.city)
        setAddress(user.shippingAddress.address)
    }
    
    return (
        user.shippingAddress.fullName === ' ' && user.shippingAddress.tel === ' ' && user.shippingAddress.city === ' ' && user.shippingAddress.address === ' ' ? 
        (
        <div className={`${styles.wrapper} mt-3`}>
            <h1>Shipping Address</h1>
            <Form className='mt-3'>
                <Form.Group className={`mb-4`}>
                    <Form.Label>Fullname</Form.Label>
                    <Form.Control 
                        className='input'
                        type="text" 
                        placeholder="Enter your fullname"
                        value={fullname}
                        onChange={e => setFullname(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className={`mb-4`}>
                    <Form.Label>Phone number</Form.Label>
                    <Form.Control 
                        className='input'
                        type="tel" 
                        placeholder="Enter your phone number" 
                        value={tel}
                        onChange={e => setTel(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className={`mb-4`}>
                    <Form.Label>City</Form.Label>
                    <Form.Select 
                        className='input'
                        id="citySelector"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        required
                    >
                        <option disabled>Select your city</option>
                        {
                            data.city.map((item) => (
                                <option key={item.city} value={item.city}>{item.city}</option>
                            ))
                        }
                    </Form.Select>
                </Form.Group>
                <Form.Group className={`mb-4`}>
                    <Form.Label>Address</Form.Label>
                    <Form.Control 
                        className='input'
                        type="text"
                        placeholder="Enter your address" 
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        required
                    />
                </Form.Group>

                <div className={`${styles.button_area} mb-3`}>
                    <Button className={`${styles.btn_size}`} onClick={handleSubmit} variant="outline-dark">Save</Button>
                </div>
            </Form>
        </div>) : (
            <form name='submit_shippingAds' onSubmit={handleSubmit} className={`${styles.wrapper} mt-3`}>
                <h1>Shipping Address</h1>
                <div className={styles.section}>
                    <div className={styles.info}>
                        <label htmlFor='fullname'>Fullname</label>
                        <div className={styles.container}>
                            <p className={`${(hidden === true && id === 'fullname') ? 'hidden' : styles.show}`}>{fullname ? fullname : user.shippingAddress.fullName}</p>
                            <input
                                className={`${(hidden === true && id === 'fullname') ? styles.show : 'hidden'}`}
                                type='text'
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                id='fullname'
                                autoComplete=''
                            />
                        </div>
                        <button type='button' data-value='fullname' onClick={handleClick}><FontAwesomeIcon icon={faPenToSquare} /> Edit</button>
                    </div>

                    <div className={styles.info}>
                        <label htmlFor='tel'>Tel</label>
                        <div className={styles.container}>
                            <p className={`${(hidden === true && id === 'tel') ? 'hidden' : styles.show}`}>{tel ? tel : user.shippingAddress.tel}</p>
                            <input
                                className={`${(hidden === true && id === 'tel') ? styles.show : 'hidden'}`}
                                type='text'
                                value={tel}
                                onChange={(e) => setTel(e.target.value)}
                                id='tel'
                                autoComplete=''
                            />
                        </div>
                        <button type='button' data-value='tel' onClick={handleClick}><FontAwesomeIcon icon={faPenToSquare} /> Edit</button>
                    </div>

                    <div className={styles.info}>
                        <label htmlFor='city'>City</label>
                        <div className={styles.container}>
                            {/* <p className={`${(hidden === true && id === 'city') ? 'hidden' : styles.show}`}>{city ? city : user.shippingAddress.city}</p> */}
                            <Form.Select 
                                className={`${(hidden === true && id === 'city') ? styles.show : 'hidden'}`}
                                id="citySelector"
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                required
                            >
                                <option disabled>Select your city</option>
                                {
                                    data.city.map((item) => (
                                        <option selected={item.city === city} key={item.city} value={item.city}>{item.city}</option>
                                    ))
                                }
                            </Form.Select>
                            {/* <input
                                className={`${(hidden === true && id === 'city') ? styles.show : 'hidden'}`}
                                type='text'
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                id='city'
                                autoComplete=''
                            /> */}
                        </div>
                        <button type='button' data-value='city' onClick={handleClick}><FontAwesomeIcon icon={faPenToSquare} /> Edit</button>
                    </div>
                    
                    <div className={`${styles.info} mb-4`}>
                        <label htmlFor='address'>Address</label>
                        <div className={styles.container}>
                            <p className={`${(hidden === true && id === 'address') ? 'hidden' : styles.show}`}>{address ? address : user.shippingAddress.address}</p>
                            <input
                                className={`${(hidden === true && id === 'address') ? styles.show : 'hidden'}`}
                                type='text'
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                id='address'
                                autoComplete=''
                            />
                        </div>
                        <button type='button' data-value='address' onClick={handleClick}><FontAwesomeIcon icon={faPenToSquare} /> Edit</button>
                    </div>
                </div>
                <div className={`${hidden === true ? styles.button_area : styles.none}`}>
                    <Button type='submit' className={`${styles.btn_size}`} variant="outline-dark">Save</Button>
                    <Button className={`${styles.btn_size}`} onClick={handleCancel} variant="outline-secondary">Cancel</Button>
                </div>
            </form>
        )
    );
}

export default ShippingAddress;