const Product = require('../models/Product')
const cloudinary = require('../cloudinary/cloudinary')

const getAllProduct = async (req, res) => {
    const page = req.query.page || 1
    const skip = (page - 1) * process.env.ITEMS_PER_PAGE
    try {
        const countPromise = await Product.estimatedDocumentCount();
        const allProductsPromise = await Product.find({}).limit(process.env
            .ITEMS_PER_PAGE).skip(skip).exec();
        
        const [count, allProducts] = await Promise.all([countPromise, allProductsPromise])
        const pageCount = count / process.env.ITEMS_PER_PAGE
        res.json({
            allProducts,
            pagination: {
                count, 
                pageCount
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(204).json({
            'message': 'No products found'
        })
    }
}

const getProduct = async (req, res) => {
    try {
        const foundProduct = await Product.findById({_id: req.params.id}).lean().exec()
        if(!foundProduct) {
            res.status(404).json({
                "message": "Product not found"
            })
        } 
        let product = Object.assign({}, foundProduct)
        product.id = foundProduct._id
        res.json(product)
    } catch (error) {
       console.log(error)
    }
    
}

const addProduct = async (req, res) => {
    if(res.locals.isAdmin === false) {
        return res.status(403).json({
            "message": "User is forbidden. Only admin can update product"
        })
    }

    if(req.body?.category) {
        const sizesArray = Array.from(req.body.sizes.split(';'))
        const colorsArray = Array.from(req.body.colors.split(' '))
    
        const uploadedResult = []
        if (!Array.isArray(req.body?.uploadImg)) {
            return res.status(400).json({
                "message": "Invalid input! 'image' should be an array."
            });
        }
        try {
            for(const img of req.body.uploadImg) {
                const ress = await cloudinary.uploader.upload(img,
                { 
                    upload_preset: 'product_upload',
                    allowed_formats: ['png', 'jpg', 'jpeg', 'svg', 'ico', 'jfif', 'webp'],
                    overwrite: true,
                    invalidate: true
                });
                uploadedResult.push({
                    url: ress.url,
                    pb_id: ress.public_id
                })
            }
        } catch (error) {
            console.log(error)
        }
    
        await Product.create({
            "category": req.body.category,
            "name": req.body.name,
            "type": req.body.type,
            "sizes": sizesArray,
            "colors": colorsArray,
            "material": req.body.material,
            "description": req.body.description,
            "countInStock": Number(req.body.countInStock),
            "price": Number(req.body.price),
            "image": uploadedResult
        })
       
        res.status(201).json({
            "message": "Created sucessfully"
        })

    } else {
        res.status(400).json({
            'message': 'Failed to create'
        })
    }
}

const deleteProduct = async (req, res) => {
    if(res.locals.isAdmin === false) {
        return res.status(403).json({
            "message": "User is forbidden. Only admin can update product"
        })
    }
    try {
        const foundProduct = await Product.findById({_id: req.params.id})

        if(foundProduct?.image) {
            try {
                for(const img of foundProduct.image) {
                    const ress = await cloudinary.uploader.destroy(img.pb_id, (error, result) => {
                        if (error) {
                        console.error(error);
                        res.status(500).json({
                            "message": "Failed to delete image"
                        })
                        }
                    });
                }
            } catch (error) {
                console.log(error)
            }
        }

        await Product.deleteOne({_id: req.params.id})

        res.status(200).json({
            "message": "Delete successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({"message": "No product found"})
    }
}

const updateProduct = async (req, res) => {
    if(req.body?.category === '' || req.body?.name === '' || req.body?.type === '' || req.body?.sizes === '' || req.body?.colors === '' || req.body?.material === '' || req.body?.description === '' || (req.body?.image && req.body?.image.length <= 0) || (req.body?.newImg && req.body?.newImg.length) <= 0 || req.body?.countInStock === '' || req.body?.price === '') {
        return res.status(400).json({
            "message": "Some fields are empty"
        })
    }

    try {
        if(req.params.id === '' || !req.params.id) {
            return res.status(400).json({
                "message": "Product id is empty"
            })
        }

        let result, newArr
        const uploadedResult = []
        const oldProduct = await Product.findById({_id: req.params.id}).exec()
        if (!oldProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if(res.locals.isAdmin === false) {
            return res.status(403).json({
                "message": "User is forbidden. Only admin can update product"
            })
        }

        if((req.body?.category !== oldProduct.category) && req.body?.category != '') {
            result = await Product.updateOne({ _id: req.params.id }, {category: req.body.category}).exec()
        }
        if ((req.body?.name !== oldProduct.name) && req.body?.name != '') {
            result = await Product.updateOne({ _id: req.params.id }, {name: req.body.name}).exec()
        } 
        if ((req.body?.type !== oldProduct.type) && req.body?.type != '') {
            result = await Product.updateOne({ _id: req.params.id }, {type: req.body.type}).exec()
        } 
        if (req.body?.sizes && typeof req.body?.sizes !== 'object') {
            const arrayStr = JSON.stringify(oldProduct.sizes);
            if(arrayStr !== req.body?.sizes) {
                const sizesArray = Array.from(req.body.sizes.split(';'))
                result = await Product.updateOne({ _id: req.params.id }, {sizes: sizesArray}).exec()
            }
        } 
        if (req.body?.colors && typeof req.body?.colors !== 'object') {
            const arrayStr = JSON.stringify(oldProduct.colors);
            if(arrayStr !== req.body?.colors) {
                const colorsArray = Array.from(req.body.colors.split(' '))
                result = await Product.updateOne({ _id: req.params.id }, {colors: colorsArray}).exec()
            }
        } 

        if ((req.body?.material !== oldProduct.material) && req.body?.material != '') {
            result = await Product.updateOne({ _id: req.params.id }, {material: req.body.material}).exec()
        } 
        if ((req.body?.description !== oldProduct.description) && req.body?.description) {
            result = await Product.updateOne({ _id: req.params.id }, {description: req.body.description}).exec()
        } 
        if (req.body?.image) {
            if (!Array.isArray(req.body?.image)) {
                return res.status(400).json({
                    "message": "Invalid input! 'image' should be an array."
                });
            }
            try {
                for(const img of req.body.image) {
                    if(img.delete) {
                        const ress = await cloudinary.uploader.destroy(img.pb_id, (error, result) => {
                            if (error) {
                            console.error(error);
                            res.status(500).json({
                                "message": "Failed to delete image"
                            })
                            }
                        });
                    }
                }
                newArr = req.body.image.filter((item) => !item || !item.delete) 
            } catch (error) {
                console.log(error)
            }
        }

        if (req.body?.newImg && Array.isArray(req.body.newImage))  {
            if (!Array.isArray(req.body?.newImg)) {
                return res.status(400).json({
                    "message": "Invalid input! 'image' should be an array."
                });
            }
            try {
                for(const img of req.body.newImg) {
                    const ress = await cloudinary.uploader.upload(img,
                    { 
                        upload_preset: 'product_upload',
                        allowed_formats: ['png', 'jpg', 'jpeg', 'svg', 'ico', 'jfif', 'webp'],
                        overwrite: true,
                        invalidate: true
                    });
                    uploadedResult.push({
                        url: ress.url,
                        pb_id: ress.public_id
                    })
                }
            } catch (error) {
                console.log(error)
            }
        }

        if(newArr && newArr.length > 0) {
            if(uploadedResult.length > 0) {
                const newImage = newArr.concat(uploadedResult)
                result = await Product.updateOne({ _id: req.params.id }, {image: newImage}).exec()
            } else {
                result = await Product.updateOne({ _id: req.params.id }, {image: newArr}).exec()
            }
        } else {
            if(uploadedResult.length > 0) {
                result = await Product.updateOne({ _id: req.params.id }, {image: uploadedResult}).exec()
            }
        }

        if (req.body?.countInStock && (req.body?.countInStock !== oldProduct.countInStock.toString()) && req.body?.countInStock != '') {
            result = await Product.updateOne({ _id: req.params.id }, {countInStock: req.body.countInStock}).exec()
        } 
        if (req.body?.price && (req.body?.price !== oldProduct.price.toString())) {
            result = await Product.updateOne({ _id: req.params.id }, {price: req.body.price}).exec()
        } 

        res.status(200).json({
            "message": "Successfully updated!"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal Server Error: An unexpected error occurred",
            error: error.message
        });
    }
}

const searchProduct = async (req, res) => {
    const page = req.query.page || 1
    const skip = (page - 1) * process.env.ITEMS_PER_PAGE2

    try {
        const countPromise = await Product.estimatedDocumentCount();
        const allProductsPromise = await Product.find({
            'name': {
                $regex: req.params.search,
                $options: "i" // case-insensitive search
            }
        }).limit(process.env
            .ITEMS_PER_PAGE2).skip(skip).exec();
        
        const [count, allProducts] = await Promise.all([countPromise, allProductsPromise])
        const pageCount = count / process.env.ITEMS_PER_PAGE2

        res.json({
            allProducts,
            pagination: {
                count, 
                pageCount
            }
        })
        
    } catch (error) {
        console.log(error)
        return res.status(204).json({
            'message': 'No products found'
        })
    }

}

const getReview = async (req, res) => {
    try {
        const productWithReview = await Product.findOne(
        { _id: req.body.id, 'reviews.userId': req.body.userId },
        { _id: 1, reviews: { $elemMatch: { userId: req.body.userId } } }
        );
        
        if (!productWithReview) {
        return res.status(404).json({ message: 'Product or Review not found' });
        }
        
        const foundReview = productWithReview.reviews[0];

        if(!foundReview) {
            res.status(404).json({
                "message": "Reviews not found"
            })
        } 
        res.json(foundReview)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getAllProduct,
    getProduct,
    addProduct,
    deleteProduct,
    updateProduct,
    searchProduct,
    getReview
}