import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from './Order.module.css'
import shippingStyles from '../components/account/ManageAccount.module.css'
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useStore from "../store/useStore";

const OrderItem = ({item}) => {
    return (
        <tr className={styles.orderItem}>
            <td className={styles.orderItemBody}>
                {
                    item.image ? <img src={item.image} alt='item'/> : <img alt='item'/>
                }
                <div>
                    <h6>{item.name}</h6>
                    <p><span>Color:</span> {item.color}</p>
                    <p><span>Size:</span> {item.size}</p>
                </div>
            </td>
            <td>${item.price}</td>
            <td><span>Quantity:</span> {item.quantity}</td>
            <td>${item.quantity * item.price}</td>
        </tr>
    )
}

function Order() {
    const { dispatch } = useStore()
    const location = useLocation();
    const value = location.state;
    const [shippingAddress, setShippingAddress] = useState({})
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()

    const handleOrder = async () => {
        if(shippingAddress.fullName === ' ' || shippingAddress.tel === ' ' 
        || shippingAddress.address === ' ' || shippingAddress.city === ' ') {
            alert("Please enter your shipping address first!");
        } else {
            try {
                await axiosPrivate.post('/order/createOrder', {
                    email: value.email,
                    cart: value.items,
                    totalAmount: value.totalAmount,
                    totalProduct: value.totalProduct,
                    status: 'Processing',
                    paymentMethod: {
                        online: false,
                        offline: true
                    },
                    deletedArr: value.deletedArr
                })
                .then(res => {
                    if(res.status === 201) {
                        dispatch({
                            type: 'FINISH_ORDER',
                            payload: value.deletedArr.length
                        })
                        navigate('/order_success', { state: { from: location }, replace: true})
                    }
                })
            } catch (error) {   
                console.error(error)
                alert("Order failed! Please try again later.")
            }
        }
    }

    const handleShow = () => {
        const elem = document.getElementById('alert')
        elem.classList.add(`${styles.show}`)
        setTimeout(() => {
            elem.classList.remove(`${styles.show}`)
        }, 3000);
    }

    useEffect(() => {
        const getUser = async () => {
            if(state.userInfo.email === '') {
                alert("Email address is empty")
                return;
            }
            try {
                await axiosPrivate.get(`/account/getAddress?email=${state.userInfo.email}`)
                .then(res => {
                    setShippingAddress(res.data.shippingAddress)
                })
            } catch (error) {
                console.error(error)
            }
        }

        getUser();
    }, []) 

    return (
        <div className={styles.wrapper}>
            <div className={styles.order}>
                <h4>Order</h4>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            value.items.map((item, index) => (
                                <OrderItem key={`${index}OD${item._id}`} item={item} />
                            ))
                        }
                    </tbody>
                </table>
            </div>

            <div className={styles.payment}>
                <h4>Payment</h4>
                <div className={styles.payment_shipAdr}>
                    <h5>Shipping Address</h5>
                    <div className={`${shippingStyles.section}`}>
                        <div className={styles.info}>
                            <label htmlFor='fullname'>Fullname</label>
                            <div className={styles.container}>
                                <p>{shippingAddress.fullName}</p>
                            </div>
                        </div>

                        <div className={styles.info}>
                            <label htmlFor='tel'>Tel</label>
                            <div className={styles.container}>
                                <p>{shippingAddress.tel}</p>
                            </div>
                        </div>

                        <div className={styles.info}>
                            <label htmlFor='city'>City</label>
                            <div className={styles.container}>
                                <p>{shippingAddress.city}</p>
                            </div>
                        </div>
                        
                        <div className={`${styles.info} mb-4`}>
                            <label htmlFor='address'>Address</label>
                            <div className={styles.container}>
                                <p>{shippingAddress.address}</p>
                            </div>
                        </div>
                        </div>
                    </div>
            </div>

            <div className={styles.payment_method}>
                <h5>Payment Method</h5>
                <div className={styles.payment_options}>
                    <button>Offline</button>
                    <button 
                    onClick={handleShow}
                    >Online</button>
                </div>
            </div>

            <div className={styles.confirm}>
                <p>Merchandise cost: ${value.totalAmount}</p>
                <p>Shipping cost: $0</p>
                <p>Total cost: ${value.totalAmount}</p>
                <div>
                    <button onClick={handleOrder}>Order</button>
                </div>
            </div>

            <div id="alert" className={`${styles.alert}`} role="alert">This payment method hasn't available yet!</div>
        </div>
    );
}

export default Order;