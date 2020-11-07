import { Database } from '@nozbe/watermelondb';
import {
  Content,
  List,
  Text,
  View,
  Button,
  ListItem,
  Body,
  Right,
  Left,
  Col,
  Row,
  Grid,
  Separator,
} from '../../../../core';
import React, { useState } from 'react';
import { Modal } from '../../../../components/Modal/Modal';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { Category, Modifier } from '../../../../models';
import { SearchBar } from '../../../../components/SearchBar/SearchBar';
import { ModalModifierDetails } from './ModalModifierDetails';
import { ModifierRow } from './ModifierRow';
import { ModifierItems } from './ModifierItems';

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
    setSelectedModifier(null);
  };

  const onViewModifier = async (modifier: Modifier) => {
    setSelectedModifier(modifier);
    setModalOpen(true);
  };

  const onSelectModifier = async (modifier: Modifier) => {
    setSelectedModifier(modifier);
  };

  return (
    <View>
      <Grid>
        <Row>
          <Col>
            <View>
              <Separator bordered>
                <Text>Modifiers</Text>
              </Separator>
              <SearchBar
                value={searchValue}
                onPressCreate={() => setModalOpen(true)}
                onSearch={value => setSearchValue(value)}
              />
            </View>
            <Content>
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
            </Content>
          </Col>
          <Col>
            <View>
              <Separator bordered>
                <Text>Modifier Items</Text>
              </Separator>
              <Content>
                {!selectedModifier && (
                  <Text note style={{ padding: 15 }}>
                    Select a modifier to view the assigned items...{' '}
                  </Text>
                )}
                {selectedModifier && <ModifierItems key={selectedModifier.id} modifier={selectedModifier} />}
              </Content>
            </View>
          </Col>
        </Row>
      </Grid>
      <Modal isOpen={modalOpen} onClose={onCloseHandler}>
        <ModalModifierDetails modifier={selectedModifier} onClose={onCloseHandler} />
      </Modal>
    </View>
  );
};

export const ModifiersTab = withDatabase(
  withObservables<ModifiersTabOuterProps, ModifiersTabInnerProps>([], ({ database }) => ({
    modifiers: database.collections.get<Modifier>('modifiers').query(),
  }))(ModifierTabInner),
);
