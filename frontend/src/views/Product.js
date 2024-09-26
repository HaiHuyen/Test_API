import useStore from "../store/useStore";
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping } from '@fortawesome/free-solid-svg-icons'
import Button from '../components/Button';
import SnippetQuantity from '../components/SnippetQuantity';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import useRefreshToken from "../hooks/useRefreshToken";

function Product() {
    const { id } = useParams()
    const { state, dispatch } = useStore()
    const [number, setNumber] = useState(1)
    const [product, setProduct] = useState({})
    const [preview, setPreview] = useState('')
    const [mark, setMark] = useState(5)
    
    const axiosPrivate = useAxiosPrivate()
    const refresh = useRefreshToken()

    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        try {
            const fetchData = async () => {
                const result = await axiosPrivate.get(`/products/${id}`)
                setProduct(result.data)
                if(result.data?.image[0]) {
                    setPreview(result.data.image[0].url)
                } else {
                    setPreview('')
                }
                
                let mark = 0;
                let index = 0;
                for(const item of result.data.reviews) {
                    mark += item.mark
                    index++;
                }
                let star = mark / index;
                if(!isNaN(star)) {
                    setMark(star)
                } 
            }
            fetchData()
        } catch (error) {
            console.error(error)
        }
    }, [])

    function handlePurchase() {
        const color = document.getElementsByClassName('border1')
        const size = document.getElementsByClassName('border')
        if(!size[0] || !color[0]) {
            alert("Please select size and color of the product!")
        } else if(number > product.countInStock) {
            alert("Not enough product")
        } else {
            let addedProduct;
            if(product?.image[0]?.url) {
                addedProduct = {
                    productId: id,
                    name: product.name, 
                    type: product.type, // shirts, sneakers...
                    size: size[0].value,
                    color: color[0].value,
                    quantity: number,
                    price: product.price,
                    image: product.image[0].url,
                    product: product.id
                };
            } else {
                addedProduct = {
                    productId: id,
                    name: product.name, 
                    type: product.type, // shirts, sneakers...
                    size: size[0].value,
                    color: color[0].value,
                    quantity: number,
                    price: product.price,
                    product: product.id
                };
            }

            const refreshTk = async () => {
                try {
                    await refresh();
                } catch(err) {
                    console.log(err)
                }
            }

            refreshTk();

            const addToCart = async () => {
                try {
                    await axiosPrivate.post('/products/addCart', {
                        email: state.userInfo.email,
                        token: state.userInfo.token,
                        addedProduct: addedProduct
                    })
    
                    dispatch({
                        type: 'ADD_ITEM',
                        payload: addedProduct
                    })
                } catch(err) {
                    console.error(err)
                    navigate('/login', { state: { from: location }, replace: true})
                }
            }

            addToCart();

            Array.from(color).forEach(item => {
                item.classList.toggle('border1')
            })

            Array.from(size).forEach(item => {
                item.classList.toggle('border')
            })
        }
    }

    const handlePreviewImg = (event) => {
        setPreview(event.target.src)
    }

    const ReviewItem = ({item}) => {
        const createdAtDate = new Date(item.dayCreated);
        const day = createdAtDate.getDate();
        const month = createdAtDate.getMonth() + 1;
        const year = createdAtDate.getFullYear();
        const hours = createdAtDate.getHours();
        const minutes = createdAtDate.getMinutes();
        const seconds = createdAtDate.getSeconds();
        
        return (
            <div className="review_wrapper mt-3">
                <div>
                    <div className={` mt-4 review_header d-flex justify-content-start align-items-end`}>
                        <div className="d-flex justify-content-center align-items-center">R</div>
                        <p>{item.username}</p>
                    </div>
                    <div className="ps-2 mt-2">
                        <FontAwesomeIcon className={`${item.mark < 1 ? 'white_star' : ''}`} icon={faStar} />
                        <FontAwesomeIcon className={`${item.mark < 2 ? 'white_star' : ''}`} icon={faStar} />
                        <FontAwesomeIcon className={`${item.mark < 3 ? 'white_star' : ''}`} icon={faStar} />
                        <FontAwesomeIcon className={`${item.mark < 4 ? 'white_star' : ''}`} icon={faStar} />
                        <FontAwesomeIcon className={`${item.mark < 5 ? 'white_star' : ''}`} icon={faStar} />
                        <span className="ms-3">{mark}</span>
                    </div>
                </div>
                <div className="review_main">
                    <p className="ps-2 mt-2 mb-1">{item.content}</p>
                    <p className="ps-2">{day}/{month}/{year} - {hours}:{minutes}:{seconds}</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="product_container">
                <div className="image_wrap">
                    <div className="product_image">
                        {
                            preview ? <img src={preview} alt='product' /> : <div className="fake_img d-flex justify-content-center align-items-center">R</div>
                        }
                    </div>
                    <div className="image_grid">
                        {
                            Array.isArray(product.image) && product.image.map((item, index) => (
                                <img onClick={handlePreviewImg} src={item.url} key={`image${index}`} />
                            ))
                        }
                    </div>
                </div>
                <div className="product_content">
                    <h1>{product.name}</h1>
                    <div className='sell'>
                        <div>
                            <FontAwesomeIcon className={`${mark < 1 ? 'white_star' : ''}`} icon={faStar} />
                            <FontAwesomeIcon className={`${mark < 2 ? 'white_star' : ''}`} icon={faStar} />
                            <FontAwesomeIcon className={`${mark < 3 ? 'white_star' : ''}`} icon={faStar} />
                            <FontAwesomeIcon className={`${mark < 4 ? 'white_star' : ''}`} icon={faStar} />
                            <FontAwesomeIcon className={`${mark < 5 ? 'white_star' : ''}`} icon={faStar} />
                            <span>{mark}</span>
                        </div>
                        <p>{product.reviews ? product.reviews.length : 0} reviews</p>
                        <p>{product.sold ? product.sold : 0} sold</p>
                        <p>{product.countInStock ? product.countInStock : 0} totals</p>
                    </div>
                    <div className='product_content_body'>
                        <h3 className='price'>${product.price}</h3>
                        <hr></hr>
                        <h5>Choose</h5>
                        <div className='color'>
                            <p>Color: </p>
                            <div className='color_group'>
                                {Array.isArray(product.colors) &&
                                    product.colors.map((item) => {
                                    return <Button key={item} color={item} />;
                                })}
                            </div>
                        </div>
                        <div>
                            <p>Size:</p>
                            <div className='color_group'>
                                {Array.isArray(product.sizes) &&
                                    product.sizes.map((item) => {
                                    return <Button key={item} size={item} />;
                                })}
                            </div>
                        </div>
                        <div className='snippet_container'>
                            <SnippetQuantity number={number} setNumber={setNumber}/>
                            <button name="purchase_btn" className='btn_purchase' onClick={handlePurchase}> <FontAwesomeIcon className='purchase_icon' icon={faBagShopping}
                            />Add to the cart</button>
                        </div>
                        <hr></hr>
                        <div>
                            <h5>About this product</h5>
                            <i>{product.description}</i>
                        </div>
                    </div>
                </div>
            </div>
            <div className="review_container">
                <h3>REVIEWS</h3>
                <div>
                    {
                        (Array.isArray(product.reviews) && product.reviews.length > 0) ? product.reviews.map((item, index) => (
                            <ReviewItem key={`${product._id}RVI${index}`} item={item} />
                        )) : <p>no reviews found</p>
                    }
                </div>
            </div>
        </div>
    );
}

export default Product;