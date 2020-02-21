import React from 'react'
import { Text, Col, Grid, Row, Button } from '../../../../core'
import { routes } from '../../../../navigators/CheckoutPaymentNavigator'

export const Receipt = ({ navigation, billRegister }) => {
  const onSelectBill = () => navigation.navigate(routes.selectBill)

  console.log('billRegister', billRegister)
  return (
    <Grid>
      <Row style={{ height: 75 }}>
        <Col style={{ backgroundColor: 'teal' }}>
          <Button style={{ height: 75 }} light onPress={onSelectBill}>
            {/* <Text>{billRegister.activeBill || 'none'}</Text> */}
          </Button>
        </Col>
        <Col style={{ backgroundColor: 'yellow' }}></Col>
      </Row>

      <Row>
        <Text>WIP</Text>
      </Row>
    </Grid>
  )
}
