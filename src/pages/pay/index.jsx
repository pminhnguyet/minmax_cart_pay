import "./Pay.scss";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { DownOutlined, LoadingOutlined } from '@ant-design/icons';
import { Dropdown, message, notification, Space } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { doPlaceOrderAction } from "../../redux/order/orderSlice";
import axios from "axios";
import { callPlaceOrder } from "../../services/api";
import { MdLocationPin } from "react-icons/md";
function Pay() {
    const [cart, setCart] = useState(null);
    const [quantities, setQuantities] = useState({});
    const getCart = useSelector(state => state.order.carts);
    const [totalPrice, setTotalPrice] = useState(0);
    const [user, setUser] = useState(null);
    const getUser = useSelector(state => state.account.user);
    const [orderConfirmation, setOrderConfirmation] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch()
    useEffect(() => {
        if (getCart) {
            const total = getCart.reduce((acc, product) => acc + product.soluong * product.price, 0);
            setTotalPrice(total);
        }
    }, [getCart]);


    const handlePlaceOrder = async () => {
        // 1. Create order data object
        const orderData = getCart.map(item => {
            return {
                productName: item.mainText,
                quantity: item.soluong,
                _id: item._id

            }
        })
        const data = {
            name: getUser.fullName,
            phone: getUser.phone,
            totalPrice: totalPrice,
            detail: orderData
        }


        // const res = await callPlaceOrder(data);
        // if (res && res.data) {
        //     message.success("Đặt hàng thành công!");
        //     dispatchEvent(doPlaceOrderAction());
        // } else {
        //     notification.error({
        //         message: "Đã có lỗi xảy ra",
        //         description: res.message
        //     })
        // }

        const showPaySucess = () => {
            // Hiển thị thông báo
            alert("Đặt hàng thành công!");
        }
        // 2. Send API request to create order
        try {
            // const response = await axios.post(`http://localhost:8080/api/v1/order`, orderData);
            const accessToken = localStorage.getItem('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInBob25lIjoiMTIzNDU2Nzg5IiwiZnVsbE5hbWUiOiJJJ20gQWRtaW4iLCJyb2xlIjoiQURNSU4iLCJzdWIiOiI2NDExNzdmZmMzMTg3OTQxMGVlYmVjYzciLCJhdmF0YXIiOiIyMTIzMmYyOTdhNTdhNWE3NDM4OTRhMGU0YTgwMWZjMy5wbmciLCJpYXQiOjE2NzkyODI2MTQsImV4cCI6MTY3OTM2OTAxNH0.vk18Ey9Q3CledIQWdTNKZONmzxVqU0YXSAJQKmLqNkw');
            // const response = await callPlaceOrder(data)
            const response = await callPlaceOrder(data, accessToken)
            console.log('Order created:', response.data);
            message.success("Đặt hàng thành công!");
            // setOrderConfirmation('Đặt hàng thành công!'); // Update confirmation message (optional)
            // Show order confirmation message in the center of the screen
            // showPaySucess();
        } catch (error) {
            console.error('Error creating order:', error);
            // Handle errors appropriately (e.g., display error message to user)
        }
        // 3. Clear cart items
        // Assuming you use Redux, dispatch an action to clear cart items
        dispatch(doPlaceOrderAction()); // Replace with your specific action


        // 4. Navigate to home page
        navigate('/home');

    };




    const onClick = ({ key }) => {
        message.info(`Click on item ${key}`);
    };
    const items = [
        {
            label: 'Vận chuyển tiết kiệm',
            key: '1',
        },
        {
            label: 'Hỏa tốc',
            key: '2',
        },

    ];

    const item1 = [
        {
            label: 'Thanh toán bằng thẻ',
            key: '1',
        },
        {
            label: 'Zalo Pay',
            key: '2',
        },

    ];


    return (
        <>
            <div className="pay">
                <div className="pay-d1">
                    <p>Thanh toán</p>
                </div>
                <div className="pay-d2">
                    <div className="pay-d2-row1">
                        <div className="pay-d2-row1-icon">
                            {/* <i class="fa-solid fa-location-dot"></i> */}
                            {/* <FontAwesomeIcon icon="fa-solid fa-location-dot" /> */}
                            <MdLocationPin className = "pay-d2-row1-icon-loca"/>
                        </div>
                        <div className="pay-d2-row1-content">
                            <p>Địa chỉ nhận hàng</p>
                        </div>
                    </div>

                    {getUser && (
                        <div className="pay-d2-row2">
                            <div className="pay-d2-row2-column1" >
                                <div className="pay-d2-row2-column1-p1">{getUser.fullName}</div>
                                <div className="pay-d2-row2-column1-p2">{getUser.phone}</div>

                            </div>
                            <div className="pay-d2-row2-column2" >
                                <p>{getUser.email}</p>

                            </div>

                        </div>
                    )}





                </div>
                <div className="pay-d3">
                    <div className="pay-d3-row1">
                        <div className="pay-d3-row1-column1">Sản phẩm</div>
                        <div className="pay-d3-row1-column2">Số lượng</div>
                        <div className="pay-d3-row1-column3">Đơn giá</div>
                        <div className="pay-d3-row1-column4">Thành tiền</div>
                    </div>


                    <div className="pay-d3-row2">
                        {getCart && getCart.map((product, index) => (
                            <div className="pay-d3-row2-wrap" key={product._id}>
                                <div className="pay-d3-row2-wrap-column1"><img src={`http://localhost:8080/images/book/${product.thumbnail}`} alt={product.mainText} /></div>
                                <div className="pay-d3-row2-wrap-column2">{product.mainText}</div>
                                <div className="pay-d3-row2-wrap-column3"><p>{product.soluong}</p></div>
                                <div className="pay-d3-row2-wrap-column4"><p>{product.price}đ</p></div>
                                <div className="pay-d3-row2-wrap-column5"><p>{product.price * product.soluong}đ</p></div>
                            </div>
                        ))}

                    </div>

                </div>

                <div className="pay-d4">
                    <div className="pay-d4-row1">
                        <div className="pay-d4-row1-column1">
                            <p>Đơn vị vận chuyển:</p>
                        </div>
                        <div className="pay-d4-row1-column2">
                            {/* <Dropdown
                                menu={{
                                    items,
                                    onClick,
                                }}
                            >
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <p className="pay-d4-row1-column2-p1">Vận chuyển nhanh <br></br>
                                            <p className="pay-d4-row1-column2-p2" >Nhận hàng vào 20/03/2025 - 22/03/2025</p>
                                        </p>

                                        <DownOutlined />
                                    </Space>
                                </a>
                            </Dropdown> */}
                            <Dropdown
                                menu={{
                                    items: items.map(item => ({ label: item.label, key: item.key })),
                                    onClick,
                                }}
                            >
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <p className="pay-d4-row1-column2-p1">Vận chuyển nhanh <br></br>
                                            <p className="pay-d4-row1-column2-p2" >Nhận hàng vào 20/03/2025 - 22/03/2025</p>
                                        </p>
                                        <DownOutlined />
                                    </Space>
                                </a>
                            </Dropdown>
                        </div>
                        <div className="pay-d4-row1-column3">
                            <p>Phí vận chuyển:</p>
                        </div>
                        <div className="pay-d4-row1-column4">
                            <p>0đ</p>
                        </div>
                    </div>
                    <div className="pay-d4-row2">
                        <div className="pay-d4-row2-column1">
                            <p>Phương thức thanh toán:</p>
                        </div>
                        <div className="pay-d4-row2-column2">
                            <Dropdown
                                menu={{
                                    items: item1.map(item => ({ label: item.label, key: item.key })),
                                    onClick,
                                }}
                            >
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <p>Thanh toán khi nhận hàng</p>
                                        <DownOutlined />
                                    </Space>
                                </a>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="pay-d4-row3">
                        <div className="pay-d4-row3-column1">
                            <p>Lời nhắn: </p>
                        </div>
                        <div className="pay-d4-row3-column2">
                            <textarea placeholder="Lưu ý cho người vận chuyển"></textarea>
                        </div>
                    </div>
                </div>
                <div className="pay-d5">
                    <div className="pay-d5-row1" >
                        <p>Thành tiền</p>
                    </div>
                    <div className="pay-d5-row2" >
                        <div className="pay-d5-row2-column1">Tổng tiền hàng:</div>
                        <div className="pay-d5-row2-column2"><p>{totalPrice}đ</p></div>
                    </div>
                    <div className="pay-d5-row3" >
                        <div className="pay-d5-row3-column1">Tổng phí vận chuyển:</div>
                        <div className="pay-d5-row3-column2"><p>0đ</p></div>
                    </div>
                    <div className="pay-d5-row4" >
                        <div className="pay-d5-row4-column1">Tổng thanh toán:</div>
                        <div className="pay-d5-row4-column2"><p>{totalPrice}đ</p></div>
                    </div>
                    <div className="pay-d5-row5" >
                        <button onClick={handlePlaceOrder}>
                            Đặt hàng
                        </button>
                    </div>
                </div>
            </div >

        </>
    )
}
export default Pay;