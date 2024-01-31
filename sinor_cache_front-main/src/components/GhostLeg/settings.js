import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Text from '@/components/Text';
import Svg, { Line } from 'react-native-svg';
import { rouletteTheme } from '@/theme/color';
import { CircleCheckBox } from '@/components/CheckBox';

const WIDTH = Dimensions.get('window').width;

const SettingsGhostLeg = (props) => {
  const { items } = props;
  const itemWidth = WIDTH / items.length >= 150 ? 150 : 38;
  return (
    <>
      <View style={styles.container}>
        <View style={styles.ghostLegWrapper}>
          {items.map((item, index) => (
            <View key={index}>
              {WIDTH / items.length >= 150 ? (
                <Text
                  style={{
                    borderWidth: 2,
                    borderColor: '#D7D7D7',
                    height: 38,
                    width: 150,
                  }}
                >
                  {item.name}
                </Text>
              ) : (
                <View
                  style={{
                    borderWidth: 2,
                    borderRadius: 4,
                    borderColor: '#D7D7D7',
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'center',
                    padding: 4,
                  }}
                >
                  <CircleCheckBox
                    style={{
                      borderWidth: 0,
                      backgroundColor: rouletteTheme[`color${index + 1}`],
                      marginRight: -10,
                    }}
                  />
                </View>
              )}
              <Svg height={175} width={itemWidth}>
                <Line
                  x1="50%"
                  y1="0"
                  x2="50%"
                  y2="175"
                  stroke="#D7D7D7"
                  strokeWidth="2"
                />
              </Svg>
              <Text
                style={{
                  borderWidth: 2,
                  borderRadius: 4,
                  borderColor: '#D7D7D7',
                  width: itemWidth,
                  paddingVertical: 5,
                  height: 38,
                  fontSize: 12,
                }}
              >
                {item.text}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </>
  );
};

export default SettingsGhostLeg;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  ghostLegWrapper: {
    flexDirection: 'row',
    gap: 8,
  },
  graphWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 300,
    borderWidth: 8,
    borderColor: rouletteTheme.rouletteBorder,
    borderRadius: 160,
  },
  info: {
    color: rouletteTheme.infoText,
    marginBottom: 24,
  },
});
