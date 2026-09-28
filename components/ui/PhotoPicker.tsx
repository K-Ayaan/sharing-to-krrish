// <PhotoPicker photos={uris} onChange={setUris} max={3} />
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';
import { useAppearance } from './Appearance';

export type PhotoPickerProps = {
  /** Local image URIs already chosen. */
  photos: string[];
  onChange: (photos: string[]) => void;
  max: number;
  style?: ViewStyle;
};

const THUMB = theme.space.xl * 2;
const REMOVE = theme.space.l;

// Attach photos from the library: a dashed "Tap to add photos" box, then removable thumbnails.
// Uses the system photo picker; iOS photos are handed over as JPEG ("compatible" representation),
// so HEIC never reaches the app. Nothing is uploaded here — the parent decides what to do with them.
export default function PhotoPicker({ photos, onChange, max, style }: PhotoPickerProps) {
  const { color } = useAppearance();
  const remaining = max - photos.length;

  const pick = async () => {
    if (remaining <= 0) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.7,
      preferredAssetRepresentationMode: ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
    });
    if (result.canceled) return;
    onChange([...photos, ...result.assets.map((asset) => asset.uri)].slice(0, max));
  };

  return (
    <View style={[styles.wrapper, style]}>
      {remaining > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Add photos, up to ${remaining} more`}
          onPress={pick}
          style={({ pressed }) => [
            styles.box,
            { borderColor: color.border, backgroundColor: color.surface },
            pressed && styles.pressed,
          ]}
        >
          <View style={[styles.badge, { backgroundColor: color.primaryTint }]}>
            <Ionicons name="image-outline" size={theme.type.title.fontSize + theme.space.xs} color={color.primary} />
          </View>
          <View style={styles.text}>
            <Text style={styles.title}>Tap to add photos</Text>
            <Text style={styles.caption}>{`Add up to ${max} photos (JPG, PNG)`}</Text>
          </View>
          <View style={[styles.plus, { backgroundColor: color.primaryTint }]}>
            <Ionicons name="add" size={theme.type.title.fontSize} color={color.primary} />
          </View>
        </Pressable>
      ) : null}
      {photos.length > 0 ? (
        <View style={styles.thumbs}>
          {photos.map((uri, index) => (
            <View key={uri} style={styles.thumbWrap}>
              <Image accessibilityLabel={`Photo ${index + 1}`} source={{ uri }} style={styles.thumb} />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remove photo ${index + 1}`}
                hitSlop={theme.space.s}
                onPress={() => onChange(photos.filter((other) => other !== uri))}
                style={[styles.remove, { backgroundColor: color.textPrimary }]}
              >
                <Ionicons name="close" size={theme.type.caption.fontSize} color={theme.color.background} />
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: theme.space.s,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
    padding: theme.space.m,
    borderRadius: theme.radius.card,
    borderWidth: StyleSheet.hairlineWidth * 3,
    borderStyle: 'dashed',
  },
  pressed: {
    opacity: 0.7,
  },
  badge: {
    width: theme.space.xl + theme.space.s,
    height: theme.space.xl + theme.space.s,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: theme.space.xs / 2,
  },
  title: {
    ...theme.type.body,
    fontSize: theme.type.headline.fontSize,
    color: theme.color.textPrimary,
  },
  caption: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
  plus: {
    width: theme.space.xl,
    height: theme.space.xl,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbs: {
    flexDirection: 'row',
    gap: theme.space.s,
  },
  thumbWrap: {
    width: THUMB,
    height: THUMB,
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: theme.radius.field,
  },
  remove: {
    position: 'absolute',
    top: -theme.space.xs,
    right: -theme.space.xs,
    width: REMOVE,
    height: REMOVE,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
