import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { AUTH } from "../../firebase-cofig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
// Firebase
import { db, collection, getDocs, addDoc, doc, deleteDoc, updateDoc, arrayUnion, query, where, setDoc } from '../../firebase-cofig'

// Page
import { ActivityIndicator } from "react-native-paper";
//redux
import { useDispatch, useSelector } from "react-redux";
import { userSelector, setUserId, setUserEmail } from '../store/slice/userSlice'
import { frontEndSelector, setStateSignUp } from "../store/slice/frontEndSlice";


const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = AUTH;
  //redux
  const dispatch = useDispatch();
  const userStore = useSelector(userSelector);

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      dispatch(setUserId(response.user.uid))
      dispatch(setUserEmail(response.user.email))
      // console.log(response);
    }
    catch (error) {
      console.log(error)
      alert('Email or password is incorrect')
    }
    finally {
      setLoading(false)
    }
  }
  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      dispatch(setStateSignUp(true))
      console.log("response uid: ", response.user.uid);
      console.log("response email: ", response.user.email);
      alert('Sign up success')

      dispatch(setUserId(response.user.uid))
      dispatch(setUserEmail(response.user.email))
      //add user to firebase
      const docRef = await setDoc(doc(db, "user", response.user.uid), {
        email: response.user.email,
        birthDate: '',
        sex: ''
      });


    }
    catch (error) {
      console.log(error)
      alert('Your email is already in use')
    }
    finally {
      setLoading(false)
    }
  }

  return (

    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "#fff",
        alignItems: "center",
      }}
    >
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <Image
          source={require("../../assets/img/Icon.jpg")}
          style={{ width: 200, height: 200, marginTop: 20 }}
        />

        <Text style={styles.LabelUsername}>Email</Text>
        <TextInput
          value={email}
          style={styles.inputUsername}
          placeholder="Enter Email"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
        />
        <Text style={styles.LabelPassword}>Password</Text>
        <TextInput
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.inputPassword}
          secureTextEntry
          placeholder="Enter Password"

        />
        {loading ? (
          <ActivityIndicator size="large" color="#EC744A" />
        ) : (
          <View>
            <TouchableOpacity style={styles.btn1} onPress={signIn}>
              <Text style={styles.btnText1}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn2} onPress={signUp}>
              <Text style={styles.btnText2}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        )
        }

        {/* <Text style={styles.orText}>or</Text>
      <TouchableOpacity
        style={styles.btn2}
        onPress={() => navigation.navigate("#")}
      >
        <Text style={styles.btnText2}>Sign in with google</Text>
      </TouchableOpacity> */}
        {/* <View style={styles.signupContainer}>
        <Text>Don’t have an account?</Text>
        <TouchableOpacity
          style={styles.btn3}
          onPress={() => navigation.navigate("#")}
        >
          <Text style={{ color: "#EC744A", fontWeight: "bold", marginLeft: 6 }}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </View> */}
      </View>
    </ScrollView>

  );
};


const styles = StyleSheet.create({
  LabelUsername: {
    color: "#575757",
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 5,
    marginRight: 280,
    marginTop: 50,
  },
  inputUsername: {
    marginTop: 10,
    backgroundColor: "#f0f0f0",
    color: "#333",
    borderRadius: 30,
    height: 45,
    width: 340,
    padding: 15
  },
  LabelPassword: {
    color: "#575757",
    fontWeight: "bold",
    fontSize: 17,
    marginTop: 30,
    marginRight: 250,
    marginBottom: 5,
  },
  inputPassword: {
    marginTop: 10,
    backgroundColor: "#f0f0f0",
    color: "#333",
    borderRadius: 30,
    height: 45,
    width: 340,
    padding: 15,


  },
  btn1: {
    marginTop: 20,
    height: 50,
    width: 340,
    borderRadius: 30,
    backgroundColor: "#EC744A",
    marginBottom: 10,
    elevation: 2,
    marginTop: 60,
    justifyContent: 'center'
  },
  btn2: {
    marginTop: 10,
    height: 50,
    width: 340,
    borderRadius: 30,
    borderColor: "#025146",
    backgroundColor: "#FFFFFF",
    elevation: 2,
    justifyContent: 'center'

  },
  btn3: {
    borderRadius: 30,
    backgroundColor: "#fff",
  },
  btnText1: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
  },
  btnText2: {
    color: "#EC744A",
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
  },
  orText: {
    color: "#575757",
    fontWeight: "normal",
    fontSize: 20,
  },
  signupContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
});

export default SignInScreen;
