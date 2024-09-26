import styles from './ManageAccount.module.css'
import Button from 'react-bootstrap/esm/Button';
import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Link } from 'react-router-dom';

function ManageProduct() {
    const [products, setProducts] = useState([])
    const [search, setSearch] = useState('')
    const axiosPrivate = useAxiosPrivate()

    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(0)
    const [loading, setLoading] = useState(false)

    const SearchCard = ({product}) => {
        const sizes = product.sizes.map(item => item).join(', ')
        const colors = product.colors.map(item => item).join(' ')
        return (
            <Link className='link' to={`/custom_product/${product._id}`}>
                <div className={styles.searchCard}>
                    <div>
                        <img />
                    </div>
                    <div>
                        <h4>{product.name}</h4>
                        <p>Sizes: {sizes}</p>
                        <p>Colors: {colors}</p>
                    </div>
                    <h4 className={styles.price}>
                        {product.price}$
                    </h4>
                </div>
            </Link>
        )
    }


    const handleEnter = (event) => {
        if (event.keyCode === 13) {
          event.preventDefault();
        }
    }

    const handleSearchMore = async () => {
        try {
            setLoading(true)
            const result = await axiosPrivate.get(`/search/${search}?page=${page}`)
            if(result.data.allProducts.length > 0) {
                setProducts(prev => [...prev, ...result.data.allProducts])
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
            const result = await axiosPrivate.get(`/search/${search}?page=${page}`)
            setProducts(result.data.allProducts)
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
    }

    useEffect(() => {
        handleSearchMore()
    }, [page])

    return (
        <div>
            <div className={styles.searchBox}>
                <input value={search} 
                    onChange={e => setSearch(e.target.value)} 
                    type='text' 
                    onKeyDown={handleEnter} 
                />
                <Button onClick={handleSearch} className={`${styles.btn_size}`} 
                variant="outline-dark">Search</Button>
            </div>

            <div className={styles.searchResult}>
                {products.length > 0 ? <h4>Result</h4> : <h4>No result found</h4>}
                {Array.isArray(products) && products.map((product) => (
                    <SearchCard key={product._id} product={product}/>
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

export default ManageProduct;