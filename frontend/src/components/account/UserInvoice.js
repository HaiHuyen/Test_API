import styles from './ManageAccount.module.css'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const InvoiceItem = ({invoiceItem}) => {
    return (
        <Link to={`/invoice/${invoiceItem._id}`} state={invoiceItem} className='link'>
            <div className={styles.order_item}>
                <div className={styles.order_thumbnail}>R</div>
                <div className={styles.order_item_content}>
                    <p><span>Order</span> <span className={styles.order_id}>#{invoiceItem._id}</span></p>
                    <p>Total amount: ${invoiceItem.totalAmount}</p>
                    <p>State: {invoiceItem.status}</p>
                </div>
            </div>
        </Link>
    )
}

function UserInvoice({ userId }) {
    const axiosPrivate = useAxiosPrivate();
    const [invoiceItem, setInvoiceItem] = useState([])
    
    useEffect(() => {
        try {
            const getOrder = async () => {
                await axiosPrivate.get(`/order/getOrderedItem/${userId}`).then(res =>{ 
                    setInvoiceItem(res.data)})
            }

            getOrder()
        } catch (error) {
            console.log(error)
        }
    }, [])

    return (
        <div className={`${styles.wrapper} mt-2`}>
            <h1>My Invoice</h1>
            <div className={styles.section}>
                {
                    invoiceItem.length > 0 ? invoiceItem.map((invoiceItem, index) => (
                        <InvoiceItem key={`${invoiceItem.id}${index} id`} invoiceItem={invoiceItem} />
                        )
                    ) : <p>No invoice found</p>
                }
            </div>
        </div>
    );
}

export default UserInvoice;