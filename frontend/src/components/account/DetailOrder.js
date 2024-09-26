import styles from './ManageAccount.module.css'
import styles2 from '../invoice/InvoiceItem.module.css'
import { useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import InvoiceItem from '../invoice/InvoiceItem';

function DetailOrder() {
    const location = useLocation();
    const value = location.state;
    const { id } = useParams()
    const [orderDetail, setOrderDetail] = useState([])
    const [shipAds, setShipAds] = useState({})

    const axiosPrivate = useAxiosPrivate()

    useEffect(() => {
        try {
            const getOrder = async () => {
                try {
                    await axiosPrivate.get(`/order/getDetailOrder/${id}`).then(res => {
                        setOrderDetail(res.data)
                        const elems = document.querySelectorAll('input[name="status_group"]')
                        for(let elem of elems) {
                            if(elem.value === res.data.status) {
                                elem.checked = true;
                                break;
                            }
                        }
                        
                    })
                } catch (error) {
                    console.error(error)
                }
            }
            getOrder();
        } catch (error) {
            console.log(error)
        }
    }, [])

    useEffect(() => {
        try {
            const getAdrs = async () => {
                try {
                    await axiosPrivate.get(`/order/getOrderAddr/${value.userId}`).then(res => {
                        setShipAds(res.data)
                    })
                } catch (error) {
                    console.error(error)
                }
            }
            
            getAdrs()
        } catch (error) {
            console.log(error)
        }
        
    }, [])

    const handleClick = async () => {
        const elem = document.querySelectorAll('input[name="status_group"]:checked')
        try {
            await axiosPrivate.post(`/order/updateStatus/${id}`, {
                status: elem[0].value
            })
            window.location.reload();
            
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <div className={styles2.header}>
                <div>
                    <h3>Customer: <span>{shipAds.fullName}</span></h3>
                    <p>Tel: {shipAds.tel}</p>
                    <p>City: {shipAds.city}</p>
                    <p>Address: {shipAds.address}</p>
                </div>
            </div>

            <div className={styles2.body1}>
                <div className={styles2.table}>
                    <div>
                        <div className={styles2.tb_header}>
                            <div>Product</div>
                            <div>Quantity</div>
                            <div>Price</div>
                            <div>Total</div>
                        </div>
                    </div>
                    {/* */}
                    <span className={styles2.box1}></span>
                    <div className={styles2.tb_body}>
                        <div className={`${styles2.over_scroll}`}>
                            {
                                Array.isArray(orderDetail.cart) && orderDetail.cart.map((item, index) => (
                                    <div key={`${index}OC2`} className={`${index % 2 === 0 ? styles.odd_color : ''}`}>
                                        <InvoiceItem key={`${item.id}${index}OC`} item={item} />   
                                    </div>              
                                ))
                            }  
                        </div>
                            
                    </div>

                    <div className={`d-flex justify-content-end align-items-center mt-4`}>
                        <div className={styles.total}>
                            <p>TOTAL <span>$ {orderDetail.totalAmount}</span></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles2.header}>
                <h3>Conditions: <span>{orderDetail.status}</span></h3>
                <div className={`${styles.radio_group}`}>
                    <div className='d-flex justify-content-start align-items-center'>
                        <input 
                            name='status_group' 
                            type='radio' 
                            value='Processing'
                            disabled={(orderDetail.status === 'Confirm' || orderDetail.status === 'Finished' || orderDetail.status === 'Processing') ? true : false}
                        />
                        <label>Processing</label>
                    </div>
                    <div className='d-flex justify-content-start align-items-center'>
                        <input 
                            name='status_group' 
                            type='radio'
                            value='Delivering'
                            disabled={(orderDetail.status === 'Confirm' || orderDetail.status === 'Finished') ? true : false}
                        />
                        <label>Delivering</label>
                    </div>
                    <div className='d-flex justify-content-start align-items-center'>
                        <input 
                            name='status_group' 
                            type='radio' 
                            value='Finished'
                            disabled={(orderDetail.status === 'Confirm' || orderDetail.status === 'Finished') ? true : false}
                        />
                        <label>Finished</label>
                    </div>
                </div>
                <div className={`d-flex justify-content-end align-items-center mt-4`}>
                    <button 
                        onClick={handleClick}
                        disabled={(orderDetail.status === 'Finished' || orderDetail.status === 'Confirm') ? true : false}
                        >Confirm</button>
                </div>
            </div>
        </div>
    );
}

export default DetailOrder;