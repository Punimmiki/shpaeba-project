import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const mealsSlice = createSlice({
    name: 'addMeal',
    initialState: {
        allMenus: [],
    },
    reducers: {
        setMenus(state, action) {
            // console.log("before add menu array lenght: " + state.allMenus.length)
            console.log("... set menu")
            if (state.allMenus.length === 0) {
                state.allMenus = [...state.allMenus, ...action.payload]
                // console.log("After add menu array lenght: " + state.allMenus.length)
            }
            return state
        },
        delMenu(state, action) {
            console.log("... remove menu")
            state.allMenus = []
        },
        setEditMenu(state, action) {
            state.editMenu = action.payload
        }
    }

})

export const { setMenus, delMenu, setEditMenu } = mealsSlice.actions
export const addMealSelector = (store) => store.addMeals
export default mealsSlice.reducer