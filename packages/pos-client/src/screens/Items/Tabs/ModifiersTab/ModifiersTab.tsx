import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Modal } from '../../../../components/Modal/Modal';
import { SearchBar } from '../../../../components/SearchBar/SearchBar';
import { Col, Container, Grid, List, Row, Separator, Text } from '../../../../core';
import { Modifier } from '../../../../models';
import { moderateScale } from '../../../../utils/scaling';
import { ModalModifierDetails, ModalModifierDetailsInner } from './ModalModifierDetails';
import { ModifierItems } from './ModifierItems';
import { ModifierRow } from './ModifierRow';

interface ModifiersTabOuterProps {
  database?: Database;
}

interface ModifiersTabInnerProps {
  modifiers: Modifier[];
}

const ModifierTabInner: React.FC<ModifiersTabOuterProps & ModifiersTabInnerProps> = ({ database, modifiers }) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedModifier, setSelectedModifier] = useState<Modifier>();

  const searchFilter = (modifier: Modifier, searchValue: string) =>
    modifier.name.toLowerCase().includes(searchValue.toLowerCase());

  const onCloseHandler = () => {
    setModalOpen(false);
  };

  const onViewModifier = async (modifier: Modifier) => {
    setSelectedModifier(modifier);
    setModalOpen(true);
  };

  const onSelectModifier = async (modifier: Modifier) => {
    setSelectedModifier(modifier);
  };

  return (
    <Container>
      <Grid>
        <Row>
          <Col>
            <Separator style={styles.separator} bordered>
              <Text>Modifiers</Text>
            </Separator>
            <SearchBar
              value={searchValue}
              onPressCreate={() => setModalOpen(true)}
              onSearch={value => setSearchValue(value)}
            />
            <ScrollView>
              <List>
                {modifiers
                  .filter(modifier => searchFilter(modifier, searchValue))
                  .map((modifier, index) => {
                    const isSelected = modifier === selectedModifier;
                    return (
                      <ModifierRow
                        key={modifier.id}
                        index={index}
                        modifier={modifier}
                        onSelect={onSelectModifier}
                        onView={onViewModifier}
                        selected={isSelected}
                      />
                    );
                  })}
              </List>
            </ScrollView>
          </Col>
          <Col>
            <Separator style={styles.separator} bordered>
              <Text>Modifier Items</Text>
            </Separator>
            {!selectedModifier && (
              <Text note style={{ padding: 15 }}>
                Select a modifier to view the assigned items...{' '}
              </Text>
            )}

            {selectedModifier && (
              <ScrollView>
                <ModifierItems key={selectedModifier.id} modifier={selectedModifier} />
              </ScrollView>
            )}
          </Col>
        </Row>
      </Grid>
      <Modal isOpen={modalOpen} onClose={onCloseHandler}>
        {selectedModifier ? (
          <ModalModifierDetails modifier={selectedModifier} onClose={onCloseHandler} />
        ) : (
          <ModalModifierDetailsInner modifier={selectedModifier} onClose={onCloseHandler} />
        )}
      </Modal>
    </Container>
  );
};

export const ModifiersTab = withDatabase(
  withObservables<ModifiersTabOuterProps, ModifiersTabInnerProps>([], ({ database }) => ({
    modifiers: database.collections.get<Modifier>('modifiers').query(),
  }))(ModifierTabInner),
);

const styles = StyleSheet.create({
  separator: {
    maxHeight: moderateScale(45),
  },
});
