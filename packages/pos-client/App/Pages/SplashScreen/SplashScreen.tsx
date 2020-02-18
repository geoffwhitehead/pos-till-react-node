import React from 'react'
import { Text, View } from 'react-native'
import styles from './SplashScreenStyle'

export const SplashScreen: React.FC = () => {
  return (
    <View style={[styles.container]}>
      <View style={[styles.logo]}>
        {/* You will probably want to insert your logo here */}
        <Text>LOGO</Text>
      </View>
    </View>
  )
}
