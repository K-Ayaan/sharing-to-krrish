// How much of the screen the on-screen keyboard is covering right now, or 0 when it's closed.
// Screens use it to grow their scrolling area; sheets use it to lift themselves clear.
import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

export default function useKeyboardHeight() {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (event) => setHeight(event.endCoordinates.height));
    const hide = Keyboard.addListener('keyboardDidHide', () => setHeight(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return height;
}
