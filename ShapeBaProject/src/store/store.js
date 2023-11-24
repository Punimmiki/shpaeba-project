import { configureStore } from '@reduxjs/toolkit';
import frontEndSlice from './slice/frontEndSlice';
import mealsSlice from './slice/mealsSlice';
import processInfoReducer from './slice/processInfoSlice1';
import userSlice from './slice/userSlice';



export const store = configureStore({
    reducer: {
        frontEnd: frontEndSlice,
        addMeals: mealsSlice,
        processInfo: processInfoReducer,
        userInfo: userSlice,
    }
});