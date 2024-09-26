import useStore from "../store/useStore";
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Account.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Profile from "../components/account/Profile";
import AddProduct from "../components/account/AddProduct";
import ManageProduct from "../components/account/ManageProduct";
import ShippingAddress from "../components/account/ShippingAddress";
import CustomerOrder from "../components/account/CustomerOrder";
import UserInvoice from "../components/account/UserInvoice";
import MyOrder from "../components/account/MyOrder";

const SelectCard = ({name, setSelect, hidden, setHidden, setHasChildren}) => {
    if(setSelect) {
        return (
                <div className={styles.selectCard} onClick={() => {
                    setHasChildren(false)
                    setSelect(name)
                }}>
                    <FontAwesomeIcon className={styles.icon} icon={faChevronDown} /> {name}
                </div>
        )

    } else {
        return (
            <div className={styles.selectCard} onClick={() => setHidden(!hidden)}>
                <FontAwesomeIcon className={styles.icon} icon={faChevronDown} /> {name}
            </div>
        )
    }
}

const MiniCard = ({name, setSelect, setHasChildren}) => {
    return (
        <div className={styles.mini_card} onClick={() => {
            setHasChildren(false)
            setSelect(name)}}
            >
            <FontAwesomeIcon className={styles.icon} icon={faChevronDown} /> {name}
        </div>
    )
}

function Account({children}) {
    const { state } = useStore()
    const [user, setUser] = useState({})
    const axiosPrivate = useAxiosPrivate()

    const navigate = useNavigate()
    const location = useLocation()

    const [select, setSelect] = useState('');
    const [hidden, setHidden] = useState(true)

    const [hasChildren, setHasChildren] = useState(false)

    const uploadImg = async (imgUrl) => {
        try {
            await axiosPrivate.post('/set_ava', {
                email: state.userInfo.email,
                avatar: imgUrl,
                username: user.username
            }).then((res) => {
                console.log(res)
                window.location.reload();        
            })  
        } catch (error) {
            console.log(error)
            alert("Please choose image again!")
        }
    }

    const handleUpload = (event) => {
        let imgFile = event.target.files[0]

        const reader = new FileReader()
        reader.readAsDataURL(imgFile)

        reader.onloadend = () => {
            uploadImg(reader.result)
        }
    }

    useEffect(() => {
        let isMounted = true;
        
        const getUser = async () => {
            try {
                const res = await axiosPrivate.post('/account', {
                    email: state.userInfo.email,
                    token: state.userInfo.token
                })

                isMounted && setUser(res.data)
                
            } catch(err) {
                console.error(err)
                navigate('/login', { state: { from: location }, replace: true})
            }
        }

        getUser()

        setSelect('Profile')

        return () => {
            isMounted = false;
        }
    }, [])

    return (
        <div className={styles.wrapper}>
            <div className={styles.user}>
                <div className={styles.info}>
                <div className={styles.image_box}>
                <div className={styles.img_wrap}>
                    <input onChange={handleUpload} type="file" alt="" accept="image/png, image/jpeg, image/jpg, image/jfif" />
                    {
                        user.avatar ? <img src={user.avatar} /> : <div className={`d-flex justify-content-center align-items-center ${styles.fake_img}`}>R</div>
                    }
                    </div>
                </div>
                    <h4>{user.username}</h4>
                    <p>{user.email}</p>
                </div>
                <div className={`${styles.info} ${styles.selection}`}>
                    {
                        Array.isArray(user.options) && user.options.map((item) => {
                            if((typeof item === 'string' && item !== 'Product Management') || (item instanceof String && item !== 'Product Management')) {
                                return ( <SelectCard key={item} name={item} setSelect={setSelect} setHasChildren={setHasChildren} /> )
                            }
                        })
                    }

                    {
                        user.isAdmin === true && (
                        <>
                            <SelectCard className={styles.productMng} id="manage_product" name={'Product Management'} setHidden={setHidden} hidden={hidden} setHasChildren={setHasChildren} />
                            <div className={`${styles.popUp} hidden ${hidden ? '' : styles.show}`}>
                                {
                                    Array.isArray(user.options[4]) && user.options[4].map((item) => (
                                        <MiniCard key={item} name={item} setSelect={setSelect} setHasChildren={setHasChildren} />
                                    ))
                                }
                            </div>
                        </>
                        )
                    }

                    {
                        (user.isAdmin === false) && (
                        <>
                            <SelectCard className={styles.productMng} id="order_options" name={'User Order'} setHidden={setHidden} hidden={hidden} />
                            <div className={`${styles.popUp2} hidden ${hidden ? '' : styles.show}`}>
                                {
                                    Array.isArray(user.options[2]) && user.options[2].map((item) => (
                                        <MiniCard key={item} name={item} setSelect={setSelect} setHasChildren={setHasChildren} />
                                    ))
                                }
                            </div>
                        </>
                        )
                    }
                </div>
            </div>

            <div className={styles.content}>
                {(select === 'Profile' && !hasChildren) && <Profile user={user} />}
                {(select === 'Add Product' && !hasChildren) && <AddProduct />}
                {(select === 'Manage Product' && !hasChildren) && <ManageProduct />}
                {(select === 'Shipping Address' && !hasChildren) && <ShippingAddress user={user} />}
                {(select === 'Invoice'  && !hasChildren)&& <UserInvoice userId={user.id} />}
                {(select === 'Order'  && !hasChildren)&& <MyOrder userId={user.id} setHasChildren={setHasChildren} />}
                {(select === 'Customer Order' && !hasChildren) && <CustomerOrder setHasChildren={setHasChildren} />}
                {hasChildren && children}
            </div>
        </div>
    );
}

export default Account;