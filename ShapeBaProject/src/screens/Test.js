import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@rneui/themed';
// #EC744A
// #025146
// #F7F7FB
// #A4A4A4

const TestPage = ({navigation}) => {
    return (
        <View style={styles.container}>
            <View style={{display: 'flex', flexDirection: 'row',}}>
                {/* Punim */}
                <View>
                <Text>Punim</Text>
                <View style={{margin: 5}}><Button color="secondary" title='Start Page' onPress={() => navigation.navigate('StartScreen')}></Button></View>
                <View style={{margin: 5}}><Button color="secondary" title='Sign In' onPress={() => navigation.navigate('SignInScreen')}></Button></View>
                <View style={{margin: 5}}><Button color="secondary" title='Sign Up' onPress={() => navigation.navigate('SignUpScreen')}></Button></View>
                <View style={{margin: 5}}><Button color="secondary" title='Info 1' onPress={() => navigation.navigate('ProcessInfoScreen1')}></Button></View>
                <View style={{margin: 5}}><Button color="secondary" title='Info 2' onPress={() => navigation.navigate('ProcessInfoScreen2')}></Button></View>
                <View style={{margin: 5}}><Button color="secondary" title='Info 3' onPress={() => navigation.navigate('ProcessInfoScreen3')}></Button></View>
                <View style={{margin: 5}}><Button color="secondary" title='Profile' onPress={() => navigation.navigate('ProfileScreen')}></Button></View>
                </View>

                {/* Opal */}
                <View>
                <Text>Opal</Text>
                <View style={{margin: 5}}><Button color="warning" title='Dash Board Day' onPress={() => navigation.navigate('DashboardDayScreen')}></Button></View>
                <View style={{margin: 5}}><Button color="warning" title='Dash Board Week' onPress={() => navigation.navigate('DashboardWeekScreen')}></Button></View>
                <View style={{margin: 5}}><Button color="warning" title='Dash Board Month' onPress={() => navigation.navigate('DashboardMonthScreen')}></Button></View>
                <View style={{margin: 5}}><Button color="warning" title='Recommend' onPress={() => navigation.navigate('RecommendScreen')}></Button></View>
                </View>
                
                {/* Ling Ling */}
                <View>
                    <Text>Ling Ling</Text>
                    <View style={{margin: 5}}><Button title='Detail Meals' onPress={() => navigation.navigate('DetailMealsScreen')}></Button></View>
                    <View style={{margin: 5}}><Button title='Add Meal' onPress={() => navigation.navigate('AddMealsScreen')}></Button></View>
                    <View style={{margin: 5}}><Button title='Add My Meal' onPress={() => navigation.navigate('AddMyMealsScreen')}></Button></View>
                    <View style={{margin: 5}}><Button title='Personal Info' onPress={() => navigation.navigate('PersonalInfoScreen')}></Button></View>
                    <View style={{margin: 5}}><Button title='Start New Goal' onPress={() => navigation.navigate('StartNewGoalScreen')}></Button></View>
                    <View style={{margin: 5}}><Button title='History' onPress={() => navigation.navigate('HistoryScreen')}></Button></View>
                </View>
            </View>
            <StatusBar style="auto" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
    },
});

export default TestPage;

