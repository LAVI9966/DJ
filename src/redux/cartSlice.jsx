import { createSlice } from '@reduxjs/toolkit';

const initialState = JSON.parse(localStorage.getItem('cart')) ?? [];

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            state.push(action.payload);
        },
        deleteFromCart(state, action) {
            console.log("selected licence deleted from cart", action.payload)
            return state.filter(item => item._id !== action.payload.item_id || item.selectedLicense._id != action.payload.licence_id);
        },
    },
});

export const { addToCart, deleteFromCart } = cartSlice.actions;

export default cartSlice.reducer;
