import styles from '../components/account/ManageAccount.module.css'
import Button from 'react-bootstrap/esm/Button';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

function ReviewModal(props) {
    const [stars, setStars] = useState([0, 0, 0, 0, 0])
    const [clicked, setClicked] = useState(false)

    const starArray = [1, 2, 3, 4, 5]

    const handleStar = (e) => {
        if(!clicked) {
            const value = parseInt(e.target.getAttribute('data-value'), 10);
            props.setMark(value)
            setClicked(true)
        } else {
            setClicked(false)
            props.setMark(0)
        }
    }

    const handleMouse = (e) => {
        const value = parseInt(e.target.getAttribute('data-value'), 10);
        const newStars = [...stars];
        newStars.forEach((element, index) => {
            if(index < value) {
                newStars[index] = 1
            }
        });
        setStars(newStars);
    }

    const handleMouseOut = (e) => {

        const newStars = [...stars];
        newStars.forEach((element, index) => {
            newStars[index] = 0
        });
        setStars(newStars);
    }

    const handleCloseReview = () => {
        props.setHiddenDialog(true)
    }
    
    return (
        Object.keys(props.review).length === 0 ? (
        <div className={`${styles.modal} ${ props.hiddenDialog ? styles.none : ''}`}>
            <div className={styles.modal_content}>
                <div className={`${styles.modal_header} d-flex align-items-center`}>
                    <h3>Review</h3>
                    <div><span onClick={handleCloseReview} className={`${styles.modal_close}`}>&times;</span></div>
                </div>
                <hr />
                <div className={styles.reviewBody}>
                    <div className={`${styles.star_wrapper} d-flex justify-content-between align-items-center`}>
                        <p>Product quality</p>
                        <button 
                            onMouseLeave={handleMouseOut} 
                            onMouseEnter={handleMouse} 
                            data-value="1" 
                            onClick={handleStar}>
                            <FontAwesomeIcon className={`${styles.star} ${stars[0] === 1 && styles.star_color} 
                                ${props.mark >= starArray[0] && styles.click_color}`} icon={faStar} />
                        </button>
                        <button 
                            onMouseLeave={handleMouseOut} 
                            onMouseEnter={handleMouse} 
                            data-value="2" 
                            onClick={handleStar}>
                            <FontAwesomeIcon className={`${styles.star} ${stars[1] === 1 && styles.star_color} 
                                ${props.mark >= starArray[1] && styles.click_color}`} icon={faStar} />
                        </button>
                        <button 
                            onMouseLeave={handleMouseOut} 
                            onMouseEnter={handleMouse} 
                            data-value="3" 
                            onClick={handleStar}>
                            <FontAwesomeIcon className={`${styles.star} ${stars[2] === 1 && styles.star_color} 
                                ${props.mark >= starArray[2] && styles.click_color}`} icon={faStar} />
                        </button>
                        <button 
                            onMouseLeave={handleMouseOut} 
                            onMouseEnter={handleMouse} 
                            data-value="4" 
                            onClick={handleStar}>
                            <FontAwesomeIcon className={`${styles.star} ${stars[3] === 1 && styles.star_color} 
                                ${props.mark >= starArray[3] && styles.click_color}`} icon={faStar} />
                        </button>
                        <button 
                            onMouseLeave={handleMouseOut} 
                            onMouseEnter={handleMouse} 
                            data-value="5" 
                            onClick={handleStar}>
                            <FontAwesomeIcon className={`${styles.star} ${stars[4] === 1 && styles.star_color} 
                                ${props.mark >= starArray[4] && styles.click_color}`} icon={faStar} />
                        </button>
                    </div>
                </div>

                <div className={`${styles.reviewBox} mt-3`}>
                    <p>Write your review</p>
                    <textarea id='textareaReview'></textarea>
                </div>

                <div className='mt-4 d-flex justify-content-end align-items-center'>
                    <Button onClick={handleCloseReview} type='button' className={`${styles.btn_size} me-4`} variant="outline-secondary">Cancle</Button>
                    <Button onClick={props.handleConfirmReview} type='submit' className={`${styles.btn_size} btn-dark`}>Post</Button>
                </div>
            </div>
        </div>) : (
            <div className={`${styles.modal} ${ props.hiddenDialog ? styles.none : ''}`}>
                <div className={styles.modal_content}>
                    <div className={`${styles.modal_header} d-flex align-items-center`}>
                        <h3>Review</h3>
                        <div><span onClick={handleCloseReview} className={`${styles.modal_close}`}>&times;</span></div>
                    </div>
                    <hr />
                    <div className={styles.reviewBody}>
                        <div className={`${styles.star_wrapper} d-flex justify-content-between align-items-center`}>
                            <p>Product quality</p>
                            <button><FontAwesomeIcon className={`${styles.star} ${props.review.mark >= starArray[0] && styles.click_color}`} icon={faStar} /></button>
                            <button><FontAwesomeIcon className={`${styles.star} ${props.review.mark >= starArray[1] && styles.click_color}`} icon={faStar} /></button>
                            <button><FontAwesomeIcon className={`${styles.star} ${props.review.mark >= starArray[2] && styles.click_color}`} icon={faStar} /></button>
                            <button><FontAwesomeIcon className={`${styles.star} ${props.review.mark >= starArray[3] && styles.click_color}`} icon={faStar} /></button>
                            <button><FontAwesomeIcon className={`${styles.star} ${props.review.mark >= starArray[4] && styles.click_color}`} icon={faStar} /></button>
                        </div>
                    </div>

                    <div className={`${styles.reviewBox} mt-3`}>
                        <p>Write your review</p>
                        <textarea defaultValue={props.review.content} readOnly id='textareaReview'></textarea>
                    </div>

                    <div className='mt-4 d-flex justify-content-end align-items-center'>
                        <Button onClick={handleCloseReview} type='button' className={`${styles.btn_size} me-4`} variant="outline-secondary">Cancle</Button>
                        <Button disabled onClick={props.handleConfirmReview} type='submit' className={`${styles.btn_size} btn-dark`}>Post</Button>
                    </div>
                </div>
            </div>
        )
    )
}

export default ReviewModal;