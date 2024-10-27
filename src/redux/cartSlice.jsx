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
            console.log("Selected license deleted from cart", action.payload);
            return state.filter(
                item => item._id !== action.payload.item_id || item.selectedLicense._id !== action.payload.licence_id
            );
        },
        clearCart(state) {
            console.log("Cart cleared");
            state.length = 0; // Clear the cart by setting the state length to 0
        }
    },
});

export const { addToCart, deleteFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
