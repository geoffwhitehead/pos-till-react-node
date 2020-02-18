import React from 'react'
import { Platform, View, ActivityIndicator, Image } from 'react-native'
import { Helpers, Metrics } from '../../theme'
import { Container, Button, Text } from 'native-base'
import { useRealmQuery } from '../../hooks/useRealm'
import { realm } from '../../services/Realm'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\nCmd+D or shake for dev menu.',
  android: 'Double tap R on your keyboard to reload,\nShake or press menu button for dev menu.',
})

const query = () => realm.objects('Dog')

export const Checkout: React.SFC<{}> = () => {
  const dogs = useRealmQuery(query)

  return (
    <View
      style={[
        Helpers.fill,
        Helpers.rowMain,
        Metrics.mediumHorizontalMargin,
        Metrics.mediumVerticalMargin,
      ]}
    >
      <View>
        <Container>
          <Text>{`Dogs: ${dogs.length}`}</Text>
          <Button
            onPress={() => {
              realm.write(() => {
                realm.create('Dog', { name: 'Rex' })
              })
            }}
          />
        </Container>
      </View>
    </View>
  )
}
