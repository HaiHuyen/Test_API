import styles from '../account/ManageAccount.module.css'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import ProgressBar from '../ProgressBar';
import DeleteModal from '../DeleteModal';
import ReviewModal from '../ReviewModal';
import useStore from '../../store/useStore';

function DetailMyOrder() {
    const location = useLocation();
    const value = location.state;
    const [shipAds, setShipAds] = useState({})
    const [review, setReview] = useState({})
    const [hiddenDialog, setHiddenDialog] = useState(true)
    const [hiddenReview, setHiddenReview] = useState(true)
    const [mark, setMark] = useState(0)
    const [clickedItem, setClickedItem] = useState('')

    const { state } = useStore()
    const axiosPrivate = useAxiosPrivate()

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

    const createdAtDate = new Date(value.item.createdAt);
    const day = createdAtDate.getDate();
    const month = createdAtDate.getMonth() + 1;
    const year = createdAtDate.getFullYear();
    const hours = createdAtDate.getHours();
    const minutes = createdAtDate.getMinutes();
    const seconds = createdAtDate.getSeconds();
    
    const handleCancelOrder = async () => {
        try {
            await axiosPrivate.post('/order/cancelOrder', {
                orderId: value.item._id,
                cart: value.item.cart
            })
            window.location.reload();
        } catch (error) {
            console.error(error)
        }
    }

    const handleConfirmOrder = async () => {
        try {
            await axiosPrivate.post(`/order/updateStatus/${value.item._id}`, {
                status: 'Confirm',
                cart: value.item.cart
            })
            window.location.reload();
            
        } catch (error) {
            console.error(error)
        }
    }

    const handleConfirmReview = async () => {
        const content = document.getElementById('textareaReview').value
        const dayCreated = Date.now();

        try {
            await axiosPrivate.post(`/order/addReview`, {
                productId: clickedItem,
                username: state.userInfo.email,
                userId: value.userId,
                content: content,
                mark: mark,
                dayCreated: dayCreated
            })
            window.location.reload();
            
        } catch (error) {
            console.error(error)
        }
    }

    const handleItemClicked = async (e) => {
        setHiddenReview(false)
        const id = e.target.value
        setClickedItem(id)
        try {
            const getReview = async () => {
                try {
                    await axiosPrivate.post('/getReview', {
                        id: id,
                        userId: value.userId
                    }).then(res => {
                        setReview(res.data)
                    })
                } catch (error) {
                    console.error(error)
                }
            }
            
            getReview()
        } catch (error) {
            console.log(error)
        }
    }

    const Item = ({item, index}) => {
        return (
            <>
                <tr className={`${index % 2 === 0 ? styles.odd_color : ''}`}>
                    <td>{index}</td>
                    <td>{item.name}</td>
                    <td>{item.size} - {item.color}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
                    <td>{item.total}</td>
                    {
                        (value.item.status === "Finished" || value.item.status === "Confirm")
                        && <td>
                            <button value={item.productId} onClick={handleItemClicked}><FontAwesomeIcon className={styles.comment_icon} icon={faComment} /></button>
                        </td>
                    }
                </tr>
            </>
        )
    }

    return (
        <div>
            <div>
                <ProgressBar status={value.item.status} />
            </div>
            <div className={styles.order_info}>
                <h3>Order <span>#{value.item._id}</span></h3>
                <p>Order in: {day}/{month}/{year} - {hours}:{minutes}:{seconds}</p>
                <p>Total: <span>${value.item.totalAmount}</span></p>
                <div className={styles.shippingAds}>
                    <h4>Shipping Address</h4>
                    <p>Customer: {shipAds.fullName}</p>
                    <p>Tel: {shipAds.tel}</p>
                    <p>City: {shipAds.city}</p>
                    <p>Address: {shipAds.address}</p>
                </div>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr className={styles.header}>
                        <th>#</th>
                        <th>NAME</th>
                        <th></th>
                        <th>QUANTITY</th>
                        <th>PRICE</th>
                        <th>TOTAL</th>
                        {
                            value.item.status === "Finished" && <th></th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        value.item.cart.length > 0 && value.item.cart.map((item, index) => (
                            <Item key={`IDT${item.productId}`} item={item} index={index} />
                        ))
                    }
                </tbody>
            </table>

            <div className={styles.btn_order}>
                {
                    value.item.status === "Processing" 
                    && <button onClick={() => setHiddenDialog(false)}>Cancel Order</button>
                }
                <div>
                    {
                        (value.item.status === "Finished" || value.item.status === "Confirm")
                        && <button>Purchase again</button>
                    }
                </div>
                <div className={styles.reviewBtn}>
                    {
                        value.item.status === "Finished"
                        && <button onClick={handleConfirmOrder}>Confirm received</button>
                    }
                </div>
            </div>

            <DeleteModal 
                hiddenDialog={hiddenDialog} 
                setHiddenDialog={setHiddenDialog} 
                handleDelete={handleCancelOrder}
                type="order" />

            <ReviewModal 
                review={review}
                mark={mark}
                setMark={setMark}
                hiddenDialog={hiddenReview} 
                setHiddenDialog={setHiddenReview} 
                handleConfirmReview={handleConfirmReview}
            />
        </div>
    );
}

export default DetailMyOrder;