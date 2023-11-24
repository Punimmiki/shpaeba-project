import * as React from 'react';
import { ScrollView } from 'react-native';
import { Dialog, Portal, Text } from 'react-native-paper';

const MyComponent = () => {
  const [visible, setVisible] = React.useState(false);

  const hideDialog = () => setVisible(false);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.ScrollArea>
          <ScrollView contentContainerStyle={{paddingHorizontal: 24}}>
            <Text>This is a scrollable areaThis is a scrollable areaThis is a scrollable areaThis is a scrollable areaThis is a scrollable area</Text>
          </ScrollView>
        </Dialog.ScrollArea>
      </Dialog>
    </Portal>
  );
};

export default MyComponent;