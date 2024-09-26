import styles from '../account/ManageAccount.module.css'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function MyOrder({ userId, setHasChildren }) {
    const axiosPrivate = useAxiosPrivate();
    const [order, setOrder] = useState([])

    useEffect(() => {
        try {
            const getOrder = async () => {
                await axiosPrivate.get(`/order/getOrder/${userId}`).then(res => { 
                    setOrder(res.data)
                })
            }

            getOrder()
        } catch (error) {
            console.log(error)
        }
    }, [])

    const OrderItem = ({item, index}) => {
        const createdAtDate = new Date(item.createdAt);
        const day = createdAtDate.getDate();
        const month = createdAtDate.getMonth() + 1;
        const year = createdAtDate.getFullYear();

        return (
            <tr className={`${index % 2 === 0 ? styles.odd_color : ''}`}>
                <td>{index}</td>
                <td>{item._id}</td>
                <td>{day}/{month}/{year}</td>
                <td>{item.totalAmount}</td>
                <td>{item.status}</td>
                <td>
                    <Link to={`/account/myOrder/${item._id}`} 
                        state={{
                            userId: userId,
                            item: item
                        }}
                        onClick={() => setHasChildren(true)}>
                        <p>Detail</p>
                    </Link>
                </td>
            </tr>
        )
    }

    return (
        <div className={`${styles.wrapper} mt-2`}>
            <h1>My Order</h1>
            {order.length > 0 ? (<table className={styles.table}>
                <thead>
                    <tr className={styles.header}>
                        <th>#</th>
                        <th>ID</th>
                        <th>DATE</th>
                        <th>TOTAL</th>
                        <th>DELIVERED</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        order.length > 0 && order.map((item, index) => (
                            <OrderItem key={`OI${item._id}`} item={item} index={index} />
                        ))
                    }
                </tbody>
            </table>) : <p>No order found</p>}
        </div>
    );
}

export default MyOrder;