import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import { Header } from 'react-native-elements';


const PersonalInfoScreen = () => {
    return (
        <View>
            <Header backgroundColor="#025146" containerStyle={styles.header}></Header>
            <View style={{padding: 20}}>
                <View style={{padding: 20, backgroundColor: 'white', borderRadius: 20}}>
                    <View className="flex-row justify-between" style={styles.boxStyle}>
                       <Text className="mb-5" style={styles.textStyle}>Start Weight</Text>
                       <Text className="mb-5">58 kg</Text>
                    </View>
                    <View className="flex-row justify-between" style={styles.boxStyle}>
                        <Text className="mb-5 mt-5" style={styles.textStyle}>Goal Weight</Text>
                        <Text className="mb-5 mt-5">50 kg</Text>
                    </View>
                    <View className="flex-row justify-between" style={styles.boxStyle}>
                        <Text className="mb-5 mt-5" style={styles.textStyle}>Height</Text>
                        <Text className="mb-5 mt-5">170 cm</Text>
                    </View>
                    <View className="flex-row justify-between" style={styles.boxStyle}>
                        <Text className="mb-5 mt-5" style={styles.textStyle}>Activity Level</Text>
                        <Text className="mb-5 mt-5" >Little or no exercise</Text>
                    </View>
                    <View className="flex-row justify-between" style={styles.boxStyle}>
                        <Text className="mb-5 mt-5" style={styles.textStyle}>Activity Level</Text>
                        <Text className="mb-5 mt-5" >Little or no exercise</Text>
                    </View>
                    
                </View>
                <View className="mt-5 bg-white" style={{padding: 20, borderRadius: 20}}>
                    <TouchableOpacity>
                        <Text style={styles.textStyle}>Current Weight</Text>
                    </TouchableOpacity>
                </View>
                <View className="mt-10" style={{width: '100%', alignItems: 'center'}}>
                    <Button style={styles.buttonStyle} title="Start New Goal"></Button>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: {
        backgroundColor: '#025146',
        height: 50,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    boxStyle: {
        borderBottomWidth: 1,
        borderBottomColor: '#A4A4A4'
    },
    textStyle: {
        color: '#025146',
        fontWeight: 'bold',
    },
    buttonStyle: {
        color: 'red',
        borderRadius: 20
    }
  });

  export default PersonalInfoScreen;