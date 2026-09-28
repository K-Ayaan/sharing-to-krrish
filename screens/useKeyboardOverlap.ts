import { RefObject, useEffect, useState } from 'react';
import { Keyboard, LayoutAnimation, View } from 'react-native';

/**
 * How far the keyboard covers the bottom of `ref`'s view, measured in window coordinates, so a pinned
 * footer can pad itself above the keyboard. KeyboardAvoidingView measures relative to its parent, which
 * under a stack header and above the tab bar gives the wrong offset.
 */
export function useKeyboardOverlap(ref: RefObject<View | null>) {
  const [overlap, setOverlap] = useState(0);

  useEffect(() => {
    const subscription = Keyboard.addListener('keyboardWillChangeFrame', (event) => {
      ref.current?.measureInWindow((_x, y, _width, height) => {
        const next = Math.max(0, y + height - event.endCoordinates.screenY);
        LayoutAnimation.configureNext({
          duration: event.duration,
          update: { duration: event.duration, type: LayoutAnimation.Types.keyboard },
        });
        setOverlap(next);
      });
    });
    return () => subscription.remove();
  }, [ref]);

  return overlap;
}
