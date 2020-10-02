import React, { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Product from '../Product/Product';

const ProductDetails = () => {
    
    const {productKey} = useParams();
    const [product, setProduct] = useState({})

    useEffect(() => {
        fetch('https://pure-garden-17520.herokuapp.com/product/'+productKey)
        .then(response => response.json())
        .then(data => setProduct(data))
    },[productKey])

    return (
        <div>
            <h3>{productKey} details coming soooooooooon</h3>
            <Product showAddToCart={false} product={product}></Product>
            
        </div>
    );
};

export default ProductDetails;