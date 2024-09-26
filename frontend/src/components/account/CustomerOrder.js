import styles from './ManageAccount.module.css'
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

function CustomerOrder({setHasChildren}) {
    const [Orders, setOrders] = useState([])
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(0)
    const [loading, setLoading] = useState(false)

    const axiosPrivate = useAxiosPrivate()

    const handleSearchMore = async () => {
        try {
            setLoading(true)
            const result = await axiosPrivate.get(`/order/getAllOrder?page=${page}`)
            if(result.data.allOrders.length > 0) {
                setOrders(prev => [...prev, ...result.data.allOrders])
                if(result.data.pagination.pageCount < 1) {
                    setPageCount(0)
                } else setPageCount(parseInt(result.data.pagination.pageCount))
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSearch = async () => {
        try {
            setPage(1)
            setLoading(true)
            const result = await axiosPrivate.get(`/order/getAllOrder?page=${page}`)
            setOrders(result.data.allOrders)
            if(result.data.pagination.pageCount < 1) {
                setPageCount(0)
            } else setPageCount(parseInt(result.data.pagination.pageCount))
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    const handleMore = () => {
        const currentPage = page + 1
        setPage(currentPage)
        handleSearchMore()
    }
    
    useEffect(() => {
        handleSearch();
    }, []) 
    
    const handleClick = () => {
        setHasChildren(true)
    }

    const OrderCard = ({order}) => {
        const createdAtDate = new Date(order.createdAt);
        const day = createdAtDate.getDate();
        const month = createdAtDate.getMonth() + 1;
        const year = createdAtDate.getFullYear();
        const hours = createdAtDate.getHours();
        const minutes = createdAtDate.getMinutes();
        const seconds = createdAtDate.getSeconds();
        
        return (
            <Link className='link' to={`/account/detailOrder/${order._id}`} 
            state={
                {
                    userId: order.userId
                }
            }            
            onClick={handleClick}>
                <div className={styles.orderCard}>
                    <p>Order #{order._id}</p>
                    <p>Products: <span>{order.totalProduct}</span></p>
                    <p>Order at: <span>{day}/{month}/{year} - {hours}:{minutes}:{seconds}</span></p>
                </div>
            </Link>
        )
    }

    return (
        <div className={styles.order_wrapper}>
            <div>
                {Orders.length > 0 ? <h3>Recent orders:</h3> : <>No order yet</>}
                    {Array.isArray(Orders) && Orders.map((order) => (
                        <OrderCard key={`OC${order._id}`} order={order} />
                ))}

            </div>

            <div className='d-flex justify-content-center align-items-center mt-5'>
                {
                    page <= pageCount ? <button className="showMore_btn" onClick={handleMore}>
                    {
                        loading ? 'Loading...' : 'Show more'
                    }
                    </button> : <></>
                }
            </div>  
        </div>
    );
}

export default CustomerOrder;