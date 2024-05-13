import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";

const initialState = {
    carts: [] //thong tin cart
};
/*
    carts = [
        { quantity: 1, _id: 'abc',detail: {_id: 'abc', name: 'def'}},
        { quantity: 1, _id: '123',detail: {_id: '123', name: '456'}},
    ]

*/

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        doAddBookAction: (state, action) => {
            // let carts = state.carts;
            // const item = action.payload;
            // let isExistIndex = carts.findIndex(c => c._id === item._id);
            // if (isExistIndex > -1) {
            //     // carts[isExistIndex].quantity = carts[isExistIndex].quantity + item.quantity;
            //     if (carts[isExistIndex].quantity > carts[isExistIndex].detail.quantity) {
            //         carts[isExistIndex].quantity = carts[isExistIndex].detail.quantity;
            //     }
            // } else {
            //     carts.push({ quantity: item.quantity, _id: item._id, detail: item.detail })
            // }
            // //update redux
            // state.carts = carts;
            // message.success("Success");
            const isExist = state.carts.find(item => item._id === action.payload.product._id)
            console.log('action', action.payload.product._id)
            console.log('quantity:', action.payload.soluong)
            if (isExist) {
                state.carts = state.carts.map(item => {
                    // item.soluong = 0
                    if (item._id === action.payload.product._id)
                        item.soluong += action.payload.soluong
                    return item
                })
                message.success("Success");
            } else {
                state.carts.push({ ...action.payload.product, soluong: action.payload.soluong })
                message.success("Success");
            }
        },
        removeCart: (state, action) => {
            state.carts.splice(0, state.carts.length)

        },
        changeQuantity: (state, action) => {
            // console.log("dau het ca dau:", action.payload._id)
            state.carts = state.carts.map(item => { // lặp qua các item trong list cart
                if (item._id === action.payload._id) { // nếu item mà nó lặp qua = với item mà mình gửi vào
                    item.soluong = action.payload.soluong; // thì update quantity
                }
                return item;
            });
        },
        removeProduct: (state, action) => {
            console.log("id:", action.payload)
            state.carts = state.carts.filter(item => item._id !== action.payload)
        },
        doPlaceOrderAction: (state, action) => {
            state.carts = [];
        }
    }
})

export const { doAddBookAction, removeCart, changeQuantity, removeProduct, doPlaceOrderAction } = orderSlice.actions;
export default orderSlice.reducer;
