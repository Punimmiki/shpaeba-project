import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';


const AddMyMealsScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Add Meal From User</Text>
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
  });

  export default AddMyMealsScreen;