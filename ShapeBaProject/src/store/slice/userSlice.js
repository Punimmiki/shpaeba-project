import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { db, collection, getDocs, addDoc, doc, deleteDoc, updateDoc, arrayUnion, query, where } from '../../../firebase-cofig'
import { AUTH } from "../../../firebase-cofig";
import { onAuthStateChanged } from 'firebase/auth'

//user_id here
export const getUserId = async () => {
    let userId = ''
    userId = await new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(AUTH, (user) => {
            if (user) {
                console.log('from store', user.uid);
                unsubscribe(); // Unsubscribe from the listener
                resolve(user.uid);
            } else {
                reject(new Error("User is not authenticated."));
            }
        });
    });
    return userId;
}

const userSlice = createSlice({
    name: 'userInfo',
    initialState: {
        userId: '',
        userEmail: '',
        testUser: 'user store test'
    },
    reducers: {
        setUserId(state, action) {
            state.userId = action.payload
            console.log("set user id: " + state.userId)
        },
        setUserEmail(state, action) {
            state.userEmail = action.payload
            console.log("set email: " + state.userEmail)
        },

    }

})

export const { setUserId, setUserEmail } = userSlice.actions
export const userSelector = (store) => store.userInfo
export default userSlice.reducer