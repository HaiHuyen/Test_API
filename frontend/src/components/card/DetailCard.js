import styles from './DetailCard.module.css'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping } from '@fortawesome/free-solid-svg-icons';

function DetailCard({product}) {
  
  return (
    <Link to={`/products/${product._id}`} className='link'>
      <div className={styles.wrapper}>
          <div className={styles.image}>
            {
              product.image[0]?.url ? <img src={product.image[0]?.url} alt='product' /> : <div className={`d-flex justify-content-center align-items-center ${styles.fake_img}`}>R</div>
            }
          </div>
          <div className={styles.content}>
              <p>{product.name}</p>
              <p className={styles.price}>${product.price}</p>
          </div>

          <div className={styles.toggle_buy}>
            <button name='addCart'><FontAwesomeIcon className={styles.icon} icon={faBagShopping} />
              Add to cart</button>
          </div>
      </div>
    </Link>
  );
}

export default DetailCard;