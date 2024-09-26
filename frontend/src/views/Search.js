import DetailCard from "../components/card/DetailCard";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function Search() {
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState([])
    const axiosPrivate = useAxiosPrivate()

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
        <div className={`search_wrapper`}>
            <div className={`search_bar`}>
                <input 
                    title="search_bar"
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder=""
                    autoComplete=""
                />
                <button name="handleSearch" onClick={handleSearch}><FontAwesomeIcon className="search_icon" icon={faMagnifyingGlass} /></button>
            </div>
            <div className="search_result">
                <h3>Result</h3>
                <div className='card_group'>
                    {
                        products.length > 0 && Array.isArray(products) && products.map((product) => (
                            <DetailCard key={`${product._id}PD`} product={product}/>
                        ))
                    }
                    {
                        products.length <= 0 && <p className="no_result">0 result</p>
                    }
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
        </div>
    );
}

export default Search;