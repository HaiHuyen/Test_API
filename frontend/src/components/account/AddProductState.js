import { useReducer } from 'react';

const initialState = {
    category: '',
    name: '',
    type: '',
    sizes: '',
    colors: '',
    material: '',
    description: '',
    countInStock: '',
    price: '',
    uploadImg : [],
}

const reducer = (state, action) => {
    switch (action.type) {
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

        case 'SET_IMAGES':
            const imgArray = state.uploadImg.concat(action.payload)
            return {
                ...state, 
                uploadImg: imgArray
            }

        case 'SET_DELETEIMG':
            const indexToRemove = action.payload;
            const updateduploadImg = state.uploadImg.filter((_, index) => index !== indexToRemove);
            return {
                ...state,
                uploadImg: updateduploadImg
            };

        case 'SET_CANCEL':
            const sizesArray = document.querySelectorAll('input[name="SIZES[]"]:checked')
            sizesArray.forEach((item) => {
                item.checked = false
            })
            return {
                category: '',
                name: '',
                type: '',
                sizes: '',
                colors: '',
                material: '',
                description: '',
                countInStock: '',
                price: ''
            }

        default:
            return {
                ...state
            }
    }
}

function AddProductState() {
    const [state, dispatch] = useReducer(reducer, initialState)
    return [state, dispatch]
}

export default AddProductState