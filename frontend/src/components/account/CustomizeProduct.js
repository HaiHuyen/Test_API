import styles from './ManageAccount.module.css'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import { useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';
import DeleteModal from '../DeleteModal';

const initialState = {
    id: '',
    category: '',
    name: '',
    type: '',
    sizes: '',
    colors: '',
    material: '',
    description: '',
    countInStock: '',
    price: '',
    image : [],
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_PRODUCT':
            const sizesCheckbox = document.querySelectorAll('input[name="SIZES[]"]')
            for(let item of action.payload.sizes) {
                for(let checkbox of sizesCheckbox) {
                    if(checkbox.value.toUpperCase() === item.toUpperCase()) {
                        checkbox.checked = true
                        break;
                    }
                }
            }
            return {
                ...state,
                ...action.payload
            }
        case 'SET_CATEGORY':
            return {
                ...state, 
                category: action.payload
            }
        
        case 'SET_NAME':
            return {
                ...state, 
                name: action.payload
            }
        
        case 'SET_TYPE':
            return {
                ...state, 
                type: action.payload
            }
        
        case 'SET_SIZES[]':
            const sizes = document.querySelectorAll('input[name="SIZES[]"]:checked')
            const sizeArray = Array.from(sizes)
            const str = sizeArray.map(item => item.value).join(';');
            return {
                ...state, 
                sizes: str
            }
        
        case 'SET_COLORS':
            return {
                ...state, 
                colors: action.payload
            }
        
        case 'SET_MATERIAL':
            return {
                ...state, 
                material: action.payload
            }
        
        case 'SET_DESCRIPTION':
            return {
                ...state, 
                description: action.payload
            }

        case 'SET_DELETEIMG':
            const indexToRemove = action.payload;
            const updatedImage = state.image
            updatedImage[indexToRemove].delete = true
            return {
                ...state,
                image: updatedImage
            };
        
        case 'SET_COUNTINSTOCK':
            return {
                ...state, 
                countInStock: action.payload
            }
        
        
        case 'SET_PRICE':
            return {
                ...state, 
                price: action.payload
            }

        default:
            return {
                ...state
            }
    }
}

function CustomizeProduct() {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [hidden, setHidden] = useState(true)
    const [hiddenDialog, setHiddenDialog] = useState(true)
    const [target, setTarget] = useState('')
    const [newImg, setNewImg] = useState([])
    const { id } = useParams()

    const axiosPrivate = useAxiosPrivate()
    const maxSize = 10 * 1024 * 1024;

    const handleChange = (event) => {
        const {name, value} = event.target

        switch (name) {
            case 'COLORS':
                const regex = /^[a-zA-Z]+(?:;[a-zA-Z]+)*$/;
                const words = value.split(' ')
                const isValid = words.map(item => regex.test(item.trim())).find(item => item === false)
                setTarget('color')
                if(isValid === false) {
                    setHidden(false)
                } else {
                    if(hidden === false) setHidden(true)
                }
                dispatch({
                    type: "SET_" + name, payload: value
                })
                break;
            case 'COUNTINSTOCK': case 'PRICE':
                if(name === 'COUNTINSTOCK') {
                    setTarget('count')
                } else {
                    setTarget('price')
                }
                const regex1 = /^\d+$/;
                if(!(regex1.test(value) && value.length <= 6)) {
                    setHidden(false)
                } else {
                    if(hidden === false) setHidden(true)
                }
                dispatch({
                    type: "SET_" + name, payload: value
                })
                break;
            case 'IMAGES':
                if(event.target.files) {
                    const fileArray = Array.from(event.target.files)
                    const uploadedArray = []
                    const maxImg = parseInt(event.target.getAttribute('data-max_length'))
                    if(fileArray.length <= maxImg && (state.image.length + newImg.length) < maxImg && (state.image.length + newImg.length + fileArray.length) <= maxImg) {
                        const processImg = async () => {
                            for(const item of fileArray) {
                                const fileSize = item.size;
                                if (fileSize > maxSize) {
                                    alert('File size exceeds the limit. Please choose a file smaller than 10 MB.');
                                } else {
                                    const reader = new FileReader()
    
                                    await new Promise((resolve, reject) => {
                                        reader.onloadend = () => {
                                            uploadedArray.push(reader.result)
                                            resolve()
                                        }
                                        reader.readAsDataURL(item)
                                    })
                                }
                            }

                        }
                        processImg().then(() => {
                            setNewImg((prevImg) => [...prevImg, ...uploadedArray])
                        })

                    } else {
                        event.preventDefault();
                        alert(`The maximum image you can choose is ${maxImg} images`)
                    }
                }
                break;
            default:
                dispatch({
                    type: "SET_" + name, payload: value
                })
                break;
        }
    }

    const handleUpdate = async (event) => {
        event.preventDefault();
        const newState = {
            ...state,
            newImg: newImg,
            
        }
        if(id === '') {
            alert("The ID is empty")
            return;
        }
        if(newState.category === '' || newState.name === '' || newState.type === '' || newState.sizes === '' || newState.colors === '' || newState.material === '' || newState.description === '' || newState.countInStock === '' || newState.price === '') {
            alert("Some fields are empty!")
            return;
        }
        try {
            await axiosPrivate.put(`/manage_product/${id}`, newState)
            window.location.href = '../account'
        } catch (error) {  
            console.error(error)
        }
    }

    const handleDelete = async (event) => {
        event.preventDefault();
        try {
            await axiosPrivate.delete(`/manage_product/${id}`)
            .then(res => {
                console.log(res)
                window.location.href = '../account'
            })
        } catch (error) {  
            console.error(error)
        }
    }

    const handleCloseImg = (e) => {
        const deleteIndex = parseInt(e.target.getAttribute('data-index'))
        if(e.target.getAttribute('data-new')) {
            const newArr = newImg.filter((_, index) => index !== deleteIndex);
            setNewImg(newArr)
        } else {
            dispatch({
                type: "SET_DELETEIMG", payload: deleteIndex
            })
        }
    }

    const Image = ({img, new_val, index}) => {
        if(new_val) {
            return (
                <div className={styles.img_wrap}>
                    <img alt='' src={img} key={index} />
                    <p
                        className={`d-flex justify-content-center align-items-center`}
                        data-new={true}
                        data-index={index}
                        onClick={handleCloseImg}>
                            &#10005;
                    </p>
                </div>
            )
        } else
            return (
                <div className={styles.img_wrap}>
                    <img alt='' src={img} key={index} />
                    <p
                        className={`d-flex justify-content-center align-items-center`}
                        data-index={index}
                        onClick={handleCloseImg}>
                            &#10005;
                    </p>
                </div>
            )
    }

    useEffect(() => {
        try {
            const fetchData = async () => {
                const result = await axiosPrivate.get(`/products/${id}`,
                { withCredentials: true })
                dispatch({
                    type: "SET_PRODUCT", payload: result.data
                })
            }
            fetchData()
        } catch (error) {
            console.error(error)
        }
    }, [])

    return (
        <div className={`${styles.wrapper} ${styles.cus_wrap} mt-3`}>
            <h1>Customize Product</h1>
            <form name='CustomizeProduct' onSubmit={(event) => event.preventDefault()}>
                <div>
                    <Form.Group>
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                            className={styles.selectGroup}
                            name='CATEGORY'
                            value={state.category}
                            onChange={handleChange}
                        >
                            <option disabled>Choose the category</option>
                            <option value="Clothes">Clothes</option>
                            <option value="Shoes">Shoes</option>
                        </Form.Select>
                    </Form.Group>
                    <div className={`${styles.info} mt-3 ${styles.container_ad}`}>
                        <label htmlFor='name'>Name</label>
                        <input
                            type='text'
                            id='name'
                            name='NAME'
                            value={state.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={`${styles.info} mt-3 ${styles.container_ad}`}>
                        <label htmlFor='type'>Type</label>
                        <input
                            type='text'
                            id='type'
                            name='TYPE'
                            value={state.type}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={`mt-4 pb-3 ${styles.check_wrapper} ${styles.info}`}>
                        Size
                        <div className={styles.checkAll}>
                            <input
                                type="checkbox"
                                name='SIZES[]'
                                onChange={handleChange}
                                value='S'
                            />
                            <label></label>
                            <p>S</p>
                        </div>
                        <div className={styles.checkAll}>
                            <input
                                type="checkbox"
                                name='SIZES[]'
                                onChange={handleChange}
                                value='M'
                            />
                            <label></label>
                            <p>M</p>
                        </div>
                        <div className={styles.checkAll}>
                            <input
                                type="checkbox"
                                name='SIZES[]'
                                onChange={handleChange}
                                value='L'
                            />
                            <label></label>
                            <p>L</p>
                        </div>
                        <div className={styles.checkAll}>
                            <input
                                type="checkbox"
                                name='SIZES[]'
                                onChange={handleChange}
                                value='XL'
                            />
                            <label></label>
                            <p>XL</p>
                        </div>
                    </div>
                    <div className={styles.warning_wrapper}>
                        <div className={`${styles.info} mt-3 ${styles.container_ad}`}>
                            <label htmlFor='colors'>Colors</label>
                            <input
                                type='text'
                                id='colors'
                                name='COLORS'
                                value={state.colors}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={`${(hidden === false && target === 'color') ? styles.alert : styles.none}`} role="alert">Invalid form: The colors should be a string that contains hex color codes and each code is separated by a space ' '</div>
                    </div>
                    <div className={`${styles.info} mt-3 ${styles.container_ad}`}>
                        <label htmlFor='material'>Material</label>
                        <input
                            type='text'
                            id='material'
                            name='MATERIAL'
                            onChange={handleChange}
                            required
                            value={state.material}
                        />
                    </div>
                    <div className={`${styles.info} mt-3 ${styles.container_ad}`}>
                        <label htmlFor='type'>Description</label>
                        <textarea
                            className='mb-3'
                            onChange={handleChange}
                            name='DESCRIPTION'
                            value={state.description}
                            required
                        >
                        </textarea>
                    </div>
                    <div className={`${styles.info} mt-3 pb-3 ${styles.container_ad}`}>
                        <label htmlFor='type'>Images</label>
                        <div>
                            <div className={styles.upload_box}>
                                <p>Upload images <input
                                    type="file"
                                    multiple
                                    data-max_length="5"
                                    onChange={handleChange}
                                    name='IMAGES'
                                /></p>
                            </div>
                            <div className={styles.img_box}>
                                <div className={styles.uploadedImg}>
                                    {
                                        Array.isArray(state.image) && state.image.map((img, index) => {
                                            if(!img.delete && img!='' || img?.delete === false && img!='') {
                                                return (
                                                    <Image key={`${img.url}${index}`} img={img.url} index={index} />
                                                )
                                            }
                                        })
                                    }
                                    {
                                        Array.isArray(newImg) && newImg.map((item, index) => (
                                            <Image
                                                key={`${item}${index}GH`} img={item} index={index} new_val={true} />
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.warning_wrapper}>
                        <div className={`${styles.info} mt-3 ${styles.container_ad}`}>
                            <label htmlFor='type'>Count in Stock</label>
                            <input
                                type='text'
                                id='count'
                                name='COUNTINSTOCK'
                                onChange={handleChange}
                                required
                                value={state.countInStock}
                            />
                        </div>
                        <div className={`${(hidden === false && target === 'count') ? styles.alert : styles.none}`} role="alert">Invalid form: The count in stock should be a number</div>
                    </div>
                    <div className={styles.warning_wrapper}>
                        <div className={`${styles.info} mt-3 ${styles.container_ad}`}>
                            <label htmlFor='type'>Price</label>
                            <input
                                type='text'
                                id='price'
                                name='PRICE'
                                onChange={handleChange}
                                required
                                value={state.price}
                            />
                        </div>
                        <div className={`${(hidden === false && target === 'price') ? styles.alert : styles.none}`} role="alert">Invalid form: The price should be a number</div>
                    </div>
                </div>
                <div className={styles.button_area}>
                    <Button onClick={handleUpdate} type='submit' className={`${styles.btn_size}`}
                    variant="outline-dark">Update</Button>
                    <Button onClick={() => setHiddenDialog(false)} type='button' className={`${styles.btn_size}`}
                    variant="danger">Delete</Button>
                </div>
            </form>

            <DeleteModal 
                hiddenDialog={hiddenDialog} 
                setHiddenDialog={setHiddenDialog} 
                handleDelete={handleDelete}
                type="product" />
        </div>
    );
}

export default CustomizeProduct;