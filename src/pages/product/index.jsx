import { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { Row, Col, Rate, Divider, Button } from 'antd';
import './product.scss';
import ImageGallery from 'react-image-gallery';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { BsCartPlus } from 'react-icons/bs';
import ModalGallery from "./ModalGallery";
import { callFetchListBook } from "../../services/api";
import { original } from "@reduxjs/toolkit";
import { render } from "react-dom";
import { doAddBookAction, removeCart } from "../../redux/order/orderSlice";
import { useDispatch, useSelector } from 'react-redux';

const ProductPage = () => {
    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [quantity, setQuantity] = useState(1)
    const [product, setProduct] = useState(null); // Sử dụng state để lưu thông tin sản phẩm
    let param = useParams();
    const { id } = useParams(); // Lấy ID sản phẩm từ URL

    const refGallery = useRef(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/book/${id}`); // Gọi API để lấy thông tin sản phẩm
                setProduct(response.data.data); // Lưu thông tin sản phẩm vào state
                console.log("data: ", typeof (response.data.data.mainText));
                console.log("mainTexxt", product.mainText)
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        fetchProduct(); // Gọi hàm fetchProduct khi component được render và ID thay đổi
    }, [id]); // Sử dụng id trong dependency array để useEffect chạy lại khi id thay đổi
    // const renderSlide = () => {
    //     return product?.slider.map(item => {
    //         return ({
    //             original: `http://localhost:8080/images/book/${item}`,
    //             thumbnail: `http://localhost:8080/images/book/${item}`,
    //         }) || []
    //     })
    // }

    const productThumbnail = product?.thumbnail ? {
        original: `http://localhost:8080/images/book/${product.thumbnail}`,
        thumbnail: `http://localhost:8080/images/book/${product.thumbnail}`,
        originalClass: "original-image",
        thumbnailClass: "thumbnail-image"
    } : null;
    const sliderImages = product?.slider.map(item => {
        const imageURL = `http://localhost:8080/images/book/${item}`;
        return {
            original: imageURL,
            thumbnail: imageURL, // Consider using a different URL for thumbnails
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image",
        };
    });

    // Tạo một mảng mới chứa cả ảnh thumbnail của sản phẩm và các ảnh từ slider
    const images = productThumbnail ? [productThumbnail, ...sliderImages] : sliderImages || [];
    // const images = renderSlide()
    // console.log(images)
    const productQuantity = product?.quantity || 1;
    const showQuantityExceededAlert = () => {
        // Hiển thị thông báo
        alert("Số lượng bạn nhập vượt quá số lượng sản phẩm sẵn có");
    }
    const showQuantityExceededAlert1 = () => {
        // Hiển thị thông báo
        alert("Vui lòng nhập số lượng sản phẩm từ lớn hơn hoặc bằng 1");
    }
    const decreaseQuantity = () => {
        if (quantity <= 1) {
            showQuantityExceededAlert1();
            setQuantity(1)

        }
        else {
            setQuantity(quantity - 1)
        }

    }

    const increaseQuantity = () => {
        // setQuantity(quantity + 1)
        if (quantity >= productQuantity) {
            showQuantityExceededAlert();
            setQuantity(quantity)
        }
        else {
            setQuantity(quantity + 1)
        }
    }
    const handleQuantityChange = (e) => {
        let newQuantity = parseInt(e.target.value);

        // Kiểm tra nếu giá trị nhập vào không phải là số, hoặc là số âm, hoặc lớn hơn số lượng sản phẩm, đặt quantity về productQuantity
        if (newQuantity > productQuantity) {
            showQuantityExceededAlert();
            newQuantity = productQuantity;
        }
        else if (isNaN(newQuantity) || newQuantity < 1) {
            showQuantityExceededAlert1();
            newQuantity = 1;
        }

        setQuantity(newQuantity);
    }



    const handleOnClickImage = () => {
        //get current index onClick
        // alert(refGallery?.current?.getCurrentIndex());
        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0)
        // refGallery?.current?.fullScreen()
    }

    const onChange = (value) => {
        console.log('changed', value);
    };


    // const handleAddToCart = (quantity, product) => {
    //     // dispatch(doAddBookAction({ quantity, detail: product, _id: product?.id }))
    //     const dispatch = useDispatch(doAddBookAction({ quantity, detail: product, _id: product?.id }))
    //     // dispatch(doAddBookAction({ quantity, detail: product, _id: product?.id }));
    //     console.log("Sản phẩm đã được thêm vào giỏ hàng");
    // }

    const dispatch = useDispatch();
    const cartItem = useSelector(state => state.order.carts)
    console.log("cart:", cartItem)

    const handleAddToCart = (product, soluong) => {
        // if (product && product._id) {
        //     dispatch(doAddBookAction({ quantity: quantity, detail: product, _id: product?.id }));
        //     console.log("Them thanh cong");
        // }
        // const cart = [...cartItem, product]
        dispatch(doAddBookAction({ product, soluong }))
    }

    const handleRemoveCart = () => {
        dispatch(removeCart())
    }

    return (
        <>
            {/* <div style={{ background: '#efefef', padding: "20px 0" }}> */}
            <div className="Product">
                {/* <div className='view-detail-book' style={{ maxWidth: 1440, margin: '30px 120px 0px 120px', minHeight: "calc(100vh - 150px)" }}> */}
                <div className='Product-detail'>
                    {/* <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}> */}
                    <div className='Product-detail-wrap'>
                        <Row gutter={[20, 20]}>
                            <Col md={10} sm={0} xs={0}>
                                <ImageGallery
                                    // ref={refGallery}
                                    items={images}
                                    showPlayButton={false} //hide play button
                                    showFullscreenButton={false} //hide fullscreen button
                                    renderLeftNav={() => <></>} //left arrow === <> </>
                                    renderRightNav={() => <></>}//right arrow === <> </>
                                    slideOnThumbnailOver={true}  //onHover => auto scroll images
                                    onClick={() => handleOnClickImage()}
                                />
                            </Col>
                            <Col md={14} sm={24}>
                                <Col md={0} sm={24} xs={24}>
                                    <ImageGallery
                                        ref={refGallery}
                                        items={images}
                                        showPlayButton={false} //hide play button
                                        showFullscreenButton={false} //hide fullscreen button
                                        renderLeftNav={() => <></>} //left arrow === <> </>
                                        renderRightNav={() => <></>}//right arrow === <> </>
                                        showThumbnails={false}
                                    />
                                </Col>
                                <Col span={24}>
                                    {/* <div className='author'>Tác giả: <a href='#'>Jo Hemmings</a> </div> */}
                                    <div className='title'>{product?.mainText}</div>
                                    <div className='rating'>
                                        {/* <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 12 }} /> */}
                                        <span className='sold'>
                                            {/* <Divider type="vertical" /> */}
                                            Đã bán {product?.sold} sản phẩm</span>
                                    </div>
                                    <div className='price'>
                                        <span className='currentprice'>

                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product?.price)}
                                        </span>
                                    </div>
                                    {/* <div className='delivery'>
                                        <div>
                                            <span className='left'>Vận chuyển</span>
                                            <span className='right'>Miễn phí vận chuyển</span>
                                        </div>
                                    </div> */}
                                    <div className='quantity'>
                                        <span className='quantity-1'>Số lượng</span>
                                        <span className='quantity-2'>
                                            <button onClick={decreaseQuantity}><MinusOutlined /></button>
                                            {/* <input value={quantity} type="text" onChange={(e) => setQuantity(e.target.value < 0 ? 1 : e.target.value)} /> */}
                                            <input value={quantity} type="text" onChange={handleQuantityChange} />
                                            <button onClick={increaseQuantity}><PlusOutlined /></button>
                                        </span>
                                    </div>
                                    <div className='buy'>
                                        <button className='cart' onClick={() => handleAddToCart(product, quantity)}>
                                            <BsCartPlus className='icon-cart' />
                                            <span>Thêm vào giỏ hàng</span>

                                        </button>
                                        {/* <button onClick={() => handleRemoveCart()}>xóa</button> */}
                                        {/* <button className='now'>Mua ngay</button> */}
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                    </div>
                </div>
                <ModalGallery
                    isOpen={isOpenModalGallery}
                    setIsOpen={setIsOpenModalGallery}
                    currentIndex={currentIndex}
                    items={images}
                    title={product?.mainText}
                />
            </div>
        </>
    )
}

export default ProductPage;