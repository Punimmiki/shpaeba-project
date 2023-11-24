import { createSlice } from "@reduxjs/toolkit";
import { db, collection, getDocs, addDoc, doc, deleteDoc, updateDoc, arrayUnion, query, where } from '../../../firebase-cofig'
import { AUTH } from "../../../firebase-cofig";
import { onAuthStateChanged } from 'firebase/auth'



export const calculateTimeToGoal = (state) => {
  const { goalweight, weight, accomplish } = state;

  const weightChange = Math.abs(goalweight - weight);
  const calorieChange = 500;
  const daysInWeek = 7;
  const daysInMonth = 30;

  const weeksToGoal = (weightChange * 7700) / calorieChange / daysInWeek;
  const monthsToGoal = (weightChange * 7700) / calorieChange / daysInMonth;

  const timeUnit = accomplish === "Gain weight" ? "month" : "week";

  return {

    weeksToGoal: Math.floor(weeksToGoal),
    monthsToGoal: Math.floor(monthsToGoal),
    timeUnit,

  };
};
//TDEE
export const calculateTDEE = (state) => {

  const { weight, height, selectedSex, activitylevel, accomplish, numericAge, birthdate } = state;

  console.log("Weight:", weight, typeof weight);
  console.log("Height:", height, typeof height);
  console.log("Selected Sex:", selectedSex, typeof selectedSex);
  console.log("Activity Level:", activitylevel, typeof activitylevel);
  console.log("Accomplish:", accomplish, typeof accomplish);
  console.log("Numeric Age:", numericAge, typeof numericAge);
  console.log("Birthdate:", birthdate, typeof birthdate);

  let bmr = 0;
  console.log("SelectedSex", selectedSex)
  if (selectedSex === "Male") {
    bmr = (66 + (13.7 * weight) + (5 * height) - (6.8 * numericAge)).toFixed(0);
    console.log("if case", bmr)
  } else if (selectedSex === "FeMale") {
    bmr = (665 + (9.6 * weight) + (1.8 * height) - (4.7 * numericAge)).toFixed(0);
    console.log("else case", bmr)
  }

  let tdee = 0;
  switch (activitylevel) {
    case "little or no exercise":
      tdee = (bmr * 1.2).toFixed(0);
      console.log("Check", tdee)
      break;
    case "1-3 times/week":
      tdee = (bmr * 1.375).toFixed(0);
      break;
    case "4-5 times/week":
      tdee = (bmr * 1.55).toFixed(0);
      break;
    case "Intense exercise 6-7 times/week":
      tdee = (bmr * 1.725).toFixed(0);
      break;
    case "Very intense exercise daily":
      tdee = (bmr * 1.9).toFixed(0);
      break;
    default:
      tdee = bmr;
  }

  tdee = parseInt(tdee);

  if (accomplish === "Lose weight") {
    tdee -= 500; // ลดแคลลอรีลง 500 ถ้าเป็นการลดน้ำหนัก
  } else if (accomplish === "Gain weight") {
    tdee += 500; // เพิ่มแคลลอรีขึ้น 500 ถ้าเป็นการเพิ่มน้ำหนัก
  }
  saveGoalInfo(state, tdee);

  console.log('BMR:', bmr);
  console.log('TDEE', tdee)
  return tdee;
};


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

// Get goal by User ID
export const getGoalById = async () => { // Pass the user ID as an argument
  try {
    const userId = await getUserId();
    const querySnapshot = await getDocs(query(collection(db, "goal"), where("user_id", "==", userId), where("status", "==", "doing"))); // Use the user's ID passed as an argument
    // console.log("query snapshot >> ", querySnapshot)
    console.log("Total goal: ", querySnapshot.size);
    const tempDoc = [];
    querySnapshot.forEach((doc) => {
      tempDoc.push({ ...doc.data(), key: doc.id });
    });
    console.log("goal user", tempDoc);
    return tempDoc;

  } catch (error) {
    console.error("Error fetching user goal: ", error);
  }
}

export const saveUserInfo = async (state) => {
  try {
    console.log("save user", state.selectedSex, state.birthdate)
    const userId = await getUserId();
    console.log("User is authenticated. userId: ", userId)
    // console.log("birth", birthdate, selectedSex)
    await updateDoc(doc(db, "user", userId), {
      birthDate: state.birthdate,
      sex: state.selectedSex
    });
    console.log("Success")

  } catch (e) {

    console.log(e.message)
  }

}

//add goal in firebase
const saveGoalInfo = async (state, tdee) => {
  try {
    const userId = await getUserId();
    const isGoalEmpty = await getGoalById();
    console.log("byId", isGoalEmpty);

    if (isGoalEmpty.length == 0) {
      const docRef = await addDoc(collection(db, "goal"), {
        user_id: userId,
        TDEE: tdee,
        accomplish: state.accomplish,
        activityLevel: state.activitylevel,
        goalWeight: state.goalweight,
        height: state.height,
        historyWeight: [
          {
            date: new Date().toLocaleDateString(),
            weight: state.weight,
          }
        ],
        status: "doing",
      });
      console.log("save goal: ", docRef.id);
    }

  } catch (e) {
    console.error("Error adding goal: ", e);
  }
}

const initialState = {
  // selectedStartDate: '',
  selectedSex: "", // กำหนดค่าเริ่มต้นให้เป็น null หรือค่าที่เหมาะสม
  weight: 0,
  height: 0,
  birthdate: "",
  openStartDatePicker: false,
  accomplish: "",
  goalweight: 0,
  activitylevel: "", // กำหนดค่าเริ่มต้นให้เป็น null หรือค่าที่เหมาะสม
  userIdprocess: '',
  numericAge: 0,
  tdee: 0,
  currentweight: 0
};

const processInfoSlice1 = createSlice({
  name: "processInfo",
  initialState,
  reducers: {

    // setUserIdprocess(state, action) {
    //   state.userId = action.payload
    //   console.log("set user id: " + state.userId)
    // },
    setSelectedStartDate: (state, action) => {
      state.selectedStartDate = action.payload;
      // console.log(state.selectedStartDate);
    },
    setSelectedSex: (state, action) => {
      state.selectedSex = action.payload;
      console.log(state.selectedSex);
      // console.log('Type of sex:', typeof action.payload);
    },
    setWeight: (state, action) => {
      state.weight = action.payload;
      console.log(state.weight);
      // console.log('Type of weight:', typeof action.payload);
    },
    setCurrentWeight: (state, action) => {
      state.currentweight = action.payload;
      console.log(state.currentweight);
    },
    setHeight: (state, action) => {
      state.height = action.payload;
      console.log(state.height);
      // console.log('Type of height:', typeof action.payload);
    },

    setBirthdate: (state, action) => {
      state.birthdate = action.payload;
      const part = action.payload.split("/");
      const birthYear = parseInt(part[0]);
      const currentYear = new Date().getFullYear();
      state.numericAge = currentYear - birthYear;
      console.log("----------fetch age", state.numericAge);
    },

    setOpenStartDatePicker: (state, action) => {
      state.openStartDatePicker = action.payload;
    },
    setaccomplish: (state, action) => {
      state.accomplish = action.payload;
      console.log(state.accomplish);
    },
    setGoalweight: (state, action) => {
      state.goalweight = action.payload;
      console.log(state.goalweight);
    },
    setActivitylevel: (state, action) => {
      state.activitylevel = action.payload;
      console.log(state.activitylevel);
    },
    setAge: (state, action) => {
      state.numericAge = parseInt(action.payload);
      console.log("Numage", state.age)
    },
    setMonths: (state, action) => {
      state.months = action.payload;
      console.log(state.months);
    },
    setTdee: (state, action) => {
      state.tdee = action.payload;
      console.log(state.tdee);
    },

  },
});

export const {
  setSelectedStartDate,
  setSelectedSex,
  setWeight,
  setHeight,
  setBirthdate,
  setOpenStartDatePicker,
  setaccomplish,
  setGoalweight,
  setActivitylevel,
  setAge,
  setTdee,
  userIdprocess,
  setCurrentWeight
} = processInfoSlice1.actions;

export const processInfoSelector = (state) => state.processInfo;

export default processInfoSlice1.reducer;
