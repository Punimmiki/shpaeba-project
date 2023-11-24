import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,

} from "react-native";
import React from "react";

const SignUpScreen = () => {

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor:'#fff', alignItems:'center' }}>
      <Image
        source={require("../../assets/img/Icon.jpg")}
        style={{ height: 150, width: 150 }}
      />
      <Text style={styles.LabelFullName}>FullName</Text>
      <TextInput
        style={styles.input}
        value="Lingling123"
        placeholder="Enter Fullname"
      />
      <Text style={styles.LabelUsername}>User Name</Text>
        <TextInput
          style={styles.input}
          value="Lingling123"
          placeholder="Enter UserName"
        />
        <Text style={styles.LabelPassword}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value="Lingling123"
          placeholder="Enter Password"
        />
         <Text style={styles.LabelConfirm}>Comfirm Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value="Lingling123"
          placeholder="Confirm Password"
        />
        <TouchableOpacity
          style={styles.btn1}
          onPress={() => props.navigations.navigate("#")}
        >
          <Text style={styles.btnText1}>Sign Up</Text>
        </TouchableOpacity>
      <Text style={styles.orText}>or</Text>
      <TouchableOpacity style={styles.btn2} onPress={()=> props.navigations.navigate("#")}>
          <Text style={styles.btnText2}>Sign up with google</Text>
        </TouchableOpacity>
        <View style={styles.signupContainer}>
          <Text>Don’t have an account?</Text>
          <TouchableOpacity style={styles.btn3} onPress={()=> props.navigations.navigate("#")}>
            <Text style={{color: "#EC744A", fontWeight: 'bold', marginLeft:6}}>Sign In</Text>
          </TouchableOpacity>
        </View>
    </ScrollView>
  );
};



const styles = StyleSheet.create({
  LabelFullName: {
    color: "#575757",
    fontWeight: "bold",
    fontSize: 17,
    marginRight:260,
    marginBottom:5,
  },
  input: {
    marginTop: 10,
    backgroundColor: "#f0f0f0",
    color: "#333",
    borderRadius: 30,
    height: 45,
    width: 340,
    padding: 15,
    marginBottom:15
  },
  LabelUsername: {
    color: "#575757",
    fontWeight: "bold",
    fontSize: 17,
    marginRight:250,
    marginBottom:5,
  },
  LabelPassword: {
    color: "#575757",
    fontWeight: "bold",
    fontSize: 17,
    marginRight:255,
    marginBottom:5,
  },
  LabelConfirm: {
    color: "#575757",
    fontWeight: "bold",
    fontSize: 17,
    marginRight:180,
    marginBottom:5,
  },
  btn1: {
    height: 50,
    width: 340,
    borderRadius: 30,
    backgroundColor: "#EC744A",
    marginBottom:10,
    elevation: 5,
    marginTop:10,
    justifyContent:'center'
  },
  btn2: {
    marginTop: 10,
    height: 50,
    width: 340,
    borderRadius: 30,
    borderColor:'#025146',
    backgroundColor: '#FFFFFF',
    elevation: 5,
    justifyContent:'center'

  },
  btn3: {
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  btnText1: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
  },
  btnText2: {
      color: '#EC744A',
      fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
    },
  orText: {
    color: '#575757',
    fontWeight:'bold'
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  }
});
export default SignUpScreen;