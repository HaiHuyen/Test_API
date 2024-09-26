import styles from './ManageAccount.module.css'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import { useState } from 'react';
import AddProductState from './AddProductState';

function AddProduct() {
    const [state, dispatch] = AddProductState()
    const [hidden, setHidden] = useState(true)
    const [target, setTarget] = useState('')

    const axiosPrivate = useAxiosPrivate()
    const maxSize = 10 * 1024 * 1024;

    const handleChange = (event) => {
        const {name, value} = event.target

        switch (name) {
            case 'COLORS':
                const regex = /^[a-zA-Z]+(;[a-zA-Z]+)*$/;
                const words = value.split(' ')
                const isValid = words.map(item => regex.test(item.trim())).find(item => item === false)
                setTarget('color')
                if(isValid === false) {
                    setHidden(false)
                } else {
                    if(hidden === false) setHidden(true)
                }
                if(value === "") setHidden(true)
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
                if(value === "") setHidden(true)
                dispatch({
                    type: "SET_" + name, payload: value
                })
                break;
            case 'IMAGES':
                if(event.target.files) {
                    const fileArray = Array.from(event.target.files)
                    const uploadedArray = []
                    const maxImg = parseInt(event.target.getAttribute('data-max_length'))
                    if(fileArray.length <= maxImg && state.uploadImg.length < maxImg) {
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
                            dispatch({
                                type: "SET_" + name, payload: uploadedArray
                            })  
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

    const handleCancel = () => {
        dispatch({
            type: 'SET_CANCEL'
        })
    }

    const handleCloseImg = (e) => {
        dispatch({
            type: "SET_DELETEIMG", payload: parseInt(e.target.getAttribute('data-index'))
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(state.category === '' || state.name === '' || state.type === '' || state.sizes === '' || state.colors === '' || state.material === '' || state.description === '' || state.countInStock === '' || state.price === '') {
            alert("Some required fields are empty")
            return;
        }
        try {
            await axiosPrivate.post('/account/addProduct', state)
            .then(res => console.log(res))
            window.location.reload(); 
        } catch (error) {  
            console.error(error)
        }
    }

    return (
        <form name='AddProduct' onSubmit={handleSubmit} className={`${styles.wrapper} mt-3`}>
            <h1>Add Product</h1>
            <div className='mt-4'>
                <Form.Group>
                    <Form.Label>Category</Form.Label>
                    <Form.Select 
                        className={styles.selectGroup}
                        name='CATEGORY'
                        value={state.category}
                        onChange={handleChange}
                    >
                        <option>Choose the category</option>
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
                    <label for="SIZES[]">Size</label>
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
                    <div className={`${(hidden === false && target === 'color') ? styles.alert : styles.none}`} role="alert">Invalid form: The colors should be a string and each color is separated by a space ' '</div>
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
                    <div className={styles.upload_wrap}>
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
                                    Array.isArray(state.uploadImg) && state.uploadImg.map((img, index) => (
                                        <div className={styles.img_wrap}>
                                            <img alt='' src={img} key={index} />
                                            <p
                                                className={`d-flex justify-content-center align-items-center`}
                                                data-index={index}
                                                onClick={handleCloseImg}>
                                                    &#10005;
                                            </p>
                                        </div>
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
                <Button type='submit' className={`${styles.btn_size}`} 
                variant="outline-dark">Save</Button>
                <Button className={`${styles.btn_size}`} 
                onClick={handleCancel}  variant="light">Cancel</Button>
            </div>
        </form>
    );
}

export default AddProduct;