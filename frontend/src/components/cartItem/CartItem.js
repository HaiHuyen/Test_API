import styles from './CartItem.module.css'
import SnippetQuantity from '../SnippetQuantity'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Button from '../Button';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useEffect } from 'react';
import useStore from '../../store/useStore';

function CartItem({ state, item, setTotalAmount, setTotalProduct, setDeletedId, deletedArr, setDeletedArr }) {
    const [number, setNumber] = useState(`${Number(item.quantity)}`)
    const [product, setProduct] = useState({})
    const [color, setColor] = useState(`${item.color}`)
    const [size, setSize] = useState(`${item.size}`)

    const axiosPrivate = useAxiosPrivate()
    const { dispatch } = useStore()

    const [rotate, setRotate] = useState(false)
    
    function handleCheck() {
        const checkAll = document.getElementById('checkAll')
        const allProducts = Array.from(document.querySelectorAll('input[name="checkItem[]"]:checked'));
        let totalMoney = 0;
        let totalItem = 0;
        for(let item of allProducts) {
            totalMoney += Number(item.getAttribute('data-price')) * Number(item.getAttribute('data-quantity'))
            totalItem += Number(item.getAttribute('data-quantity'))
        }
        setTotalProduct(totalItem)
        setTotalAmount(totalMoney)
        var isCheckedAll = allProducts.length === document.querySelectorAll('input[name="checkItem[]"]').length
        checkAll.checked = isCheckedAll
    }

    const handleRotate = () => {
        setRotate(!rotate)
    }

    const handleDelete = async () => {
        try {
            await axiosPrivate.post('/cart/delete', {
                email: state.userInfo.email,
                accessKey: item._id,
                productId: item.product,
                quantity: item.quantity
            }).then(
                res => {
                    console.log(res)
                    setDeletedId(item._id)
                    if(deletedArr.length > 0) {
                        const newArr = []
                        newArr.push(deletedArr.find(id => id !== item._id))
                        setDeletedArr(newArr)
                    }
                    
                    dispatch({
                        type: "DELETE_ITEM"
                    })
                }
            )
        } catch (error) {
            console.error(error)   
        }
    }

    useEffect(() => {
        const getProduct = async () => {
            try {
                const res = await axiosPrivate.get(`/products/${item.product}`)
                setProduct(res.data)
            } catch (error) {
                console.error(error)
            }
        }

        getProduct()
    }, [])

    useEffect(() => {
        const updateProduct = async () => {
            try {
                await axiosPrivate.post(`/cart/update`, {
                    email: state.userInfo.email,
                    accessKey: item._id,
                    number: number,
                    color: color,
                    size: size,
                    productId: item.product
                })
                
            } catch (error) {
                console.error(error)
            }
        }

        updateProduct()
    }, [number, color, size])

    return (
        <>
        <tr>
            <td>
                <div className={styles.item}>
                    <div className={styles.checkBox_wrapper}>
                        <input
                            className='checkbox' 
                            title='checkbox'
                            type="checkbox" 
                            id={`${item._id}`}
                            data-price={item.price}
                            data-quantity={item.quantity}
                            data-productid={item.product.toString()}
                            data-name={item.name}
                            name='checkItem[]'
                            onChange={handleCheck}
                        />
                        <label htmlFor={`${item._id}`}></label>
                    </div>

                    <div className={styles.itemBody}>
                        {
                            item.image ? <img src={item.image} alt='item'/> : <img alt='item'/>
                        }
                        <p>{item.name}</p>
                    </div>
                    <div className={styles.itemInfo}>
                        <div className={styles.type_wrapper}>
                            <p id='type' className={`${styles.type} ${rotate ? styles.rotate : ''}`} onClick={handleRotate}>Item's type</p>
                            <p>{`${item.type} - ${size} - ${color}`}</p>
                        </div>
                        
                        {/* popUp custom */}
                        <div className={styles.popWrapper}>
                            <div className={`${styles.popUp} ${rotate ? styles.show : ''}`}>
                                <p>Color</p>
                                <div className={styles.button_group}>
                                    {Array.isArray(product.colors) && product.colors.map((item, index) => (
                                        <div onClick={() => setRotate(!rotate)}><Button setColor={setColor} key={`${index}CB`} color={item} /></div>
                                    ))}
                                </div>
                                <p>Size</p>
                                <div className={styles.button_group}>
                                    {Array.isArray(product.sizes) && product.sizes.map((item, index) => (
                                        <div><Button setSize={setSize} value={item} key={`${index}BG`} size={item} /></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </td>
            
            <td className={styles.num}>${product.price}</td>
            
            <td className={styles.center}><span>
                <SnippetQuantity number={number} setNumber={setNumber}/>
            </span></td>
            
            <td className={styles.num}>${number * product.price}</td>

            <td>
                <div>
                    <button onClick={() => handleDelete()} className={styles.delete}>
                        <FontAwesomeIcon icon={faTrashCan} /> Delete
                    </button>
                </div>
            </td>
        </tr>
        </>
    );
}

export default CartItem;