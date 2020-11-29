import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SlidersColorPicker } from 'react-native-color';
import tinycolor from 'tinycolor2';
import { fontSizes, spacing } from '../../theme';

type ModalColorPickerContentProps = {
  colorHex: string;
  onChangeColor: (color: string) => void;
  style: any;
  globalRecentColors?: string[];
  setGlobalRecentColors?: (colors: string[]) => void;
};

const RECENT_COLORS_SIZE = 6;
export const ModalColorPickerContent: React.FC<ModalColorPickerContentProps> = ({
  onChangeColor,
  colorHex,
  style,
  globalRecentColors = [],
  setGlobalRecentColors,
}) => {
  const [recents, setRecents] = useState(globalRecentColors);
  const [hslColor, setColor] = useState<{ h: number; s: number; l: number; a: number }>(tinycolor(colorHex).toHsl());

  const [modalVisible, setModalVisible] = useState(false);

  const overlayTextColor = tinycolor(hslColor).isDark() ? '#FAFAFA' : '#222';
  return (
    <View style={{ ...styles.container, ...style }}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[styles.colorPreview, { backgroundColor: tinycolor(hslColor).toHslString() }]}
      >
        <Text style={[styles.colorString, { color: overlayTextColor }]}>{tinycolor(hslColor).toHexString()}</Text>
      </TouchableOpacity>
      <SlidersColorPicker
        visible={modalVisible}
        color={hslColor}
        returnMode={'hex'}
        onCancel={() => setModalVisible(false)}
        onOk={colorHex => {
          setModalVisible(false);
          setColor(tinycolor(colorHex).toHsl());
          setRecents([colorHex, ...recents.filter(c => c !== colorHex).slice(0, RECENT_COLORS_SIZE)]);
          setGlobalRecentColors &&
            setGlobalRecentColors([colorHex, ...recents.filter(c => c !== colorHex).slice(0, RECENT_COLORS_SIZE)]);
          onChangeColor(colorHex);
        }}
        swatches={recents}
        swatchesLabel="RECENTS"
        okLabel="Done"
        cancelLabel="Cancel"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  colorPreview: {
    marginTop: spacing[5],
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[9],
    borderRadius: 3,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.25,
  },
  colorString: {
    fontSize: fontSizes[5],
    ...Platform.select({
      android: {
        fontFamily: 'monospace',
      },
      ios: {
        fontFamily: 'Courier New',
        fontWeight: '600',
        letterSpacing: 0.75,
      },
    }),
  },
});
