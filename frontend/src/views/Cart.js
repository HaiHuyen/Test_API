import styles from './Cart.module.css'
import CartItem from '../components/cartItem/CartItem';
import { useEffect, useState } from 'react';
import useStore from '../store/useStore';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Link } from 'react-router-dom';

function Cart() {
    const { state } = useStore()
    const [cart, setCart] = useState([])
    const [items, setItems] = useState([])
    const [deletedArr, setDeletedArr] = useState([])
    const [totalProduct, setTotalProduct] = useState(0)
    const [totalAmount, setTotalAmount] = useState(0)
    const [deletedId, setDeletedId] = useState('')
    const axiosPrivate = useAxiosPrivate()

    function handleCheckAll(e) {
        const checkAll = document.getElementById('checkAll')
        const elems = document.getElementsByClassName('checkbox')
        const idArr = []
        if(e.target.checked === false) {
            for(let elem of elems) {
                elem.checked = checkAll.checked
            }
            setTotalProduct(0)
            setTotalAmount(0)
        } else {
            setTotalProduct(elems.length)
            let totalMoney = 0
            let totalItem = 0;
            for(let elem of elems) {
                elem.checked = checkAll.checked
                totalMoney += Number(elem.getAttribute('data-price')) * Number(elem.getAttribute('data-quantity'))
                totalItem += Number(elem.getAttribute('data-quantity'))
                idArr.push(elem.id)
            }
            setTotalProduct(totalItem)
            setTotalAmount(totalMoney)
            setDeletedArr(idArr)
        }
    }

    useEffect(() => {
        const getCart = async () => {
            if(state.userInfo.email === '') {
                alert("Email is empty")
                return;
            }
            if(state.userInfo.token === '') {
                alert("Token is empty")
                return;
            }
            try {
                const result = await axiosPrivate.post('/cart', {
                    email: state.userInfo.email
                })
                setCart(result.data)
            } catch (error) {   
                console.log(error)
            }
        }

        getCart();
    }, [])
    
    useEffect(() => {
        const allProducts = Array.from(document.querySelectorAll('input[name="checkItem[]"]:checked'));
        const itemArray = []
        const idArr = []
        for(const item of allProducts) {
            const product = cart.find(cartItem => cartItem._id === item.id)
            const productId = item.getAttribute('data-productid');
            const finalProduct = {
                productId: productId,
                name: product.name,
                size: product.size,
                color:  product.color,
                quantity: product.quantity,
                price: product.price,
                total: product.price * product.quantity,
                image: product.image
            }
            itemArray.push(finalProduct)
            idArr.push(item.id)
        }
        setItems(itemArray)
        setDeletedArr(idArr)
    }, [totalProduct])

    useEffect(() => {
        const newCart = []
        const newItems = []
        if(items.length > 0) {
            newItems.push(items.find(item => item._id !== deletedId))
        }
        newCart.push(cart.find(item => item._id !== deletedId))
        if(newCart && newCart.length > 0 && newCart[0] !== undefined) {
            setCart(newCart);
            if(newItems.length > 0)
                setItems(newItems)
        } else {
            setCart([])
            setItems([])
        }
    }, [deletedId])

    return (
        <>
            {cart.length > 0 ? (
                <div>
                    <table className={styles.table}>
                    <thead>
                        <tr className={styles.header}>
                            <th>
                            <div className={styles.checkAll}>
                                <input
                                    title='checkAll'
                                    id="checkAll"
                                    type="checkbox"
                                    onClick={handleCheckAll}
                                />
                                <label htmlFor="checkAll"></label>
                                <p>Product</p>
                            </div>
                            </th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Option</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        (Array.isArray(cart)) && cart.map((item, index) => {
                            return (
                                <CartItem state={state} 
                                    key={`${item.product}CIT${index}`} item={item}
                                    setTotalAmount={setTotalAmount}
                                    setTotalProduct={setTotalProduct}
                                    setItems={setItems}
                                    setDeletedId={setDeletedId}
                                    deletedArr={deletedArr}
                                    setDeletedArr={setDeletedArr}
                             /> )
                        })}
                    </tbody>
                    </table>
                    
                    <div className={`position-fixed bottom-0 ${styles.footer}`}>
                    <div className={styles.cart_footer}>
                        <div>
                            <p>Total products: <span>{totalProduct}</span></p>
                            <p>Total amount: <span>${totalAmount}</span></p>
                        </div>
                        {
                            totalProduct > 0 ? (
                                <Link to='/order'
                                    state={{
                                        items: items,
                                        email: state.userInfo.email,
                                        totalAmount: totalAmount,
                                        totalProduct: totalProduct,
                                        deletedArr: deletedArr
                                    }}
                                ><button className={styles.purchase_btn}>Purchase</button></Link>
                            ) : <button className={styles.purchase_btn}>Purchase</button>
                        }
                        
                        </div>
                    </div>
                </div>
            ) : 
                (<div className={styles.no_item}>
                    <p>The cart is empty!</p>
                </div>)
            }
        </>
    );
}

export default Cart;