import LottieView from 'lottie-react-native';
import React, { useContext, useEffect, useRef } from 'react';
import { LastSyncedAtContext } from '../../contexts/LastSyncedAtContext';
import { Body, Button, Header, Icon, Left, Right, Text, Title } from '../../core';
import { useSync } from '../../hooks/useSync';

interface SidebarHeaderProps {
  title: string;
  onOpen: () => void;
  disableNav?: boolean;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ title, onOpen, disableNav }) => {
  const animation = useRef();
  const { lastSyncedAt } = useContext(LastSyncedAtContext);
  const [isSyncing, doSync] = useSync();
  console.log('lastSyncedAt', lastSyncedAt);

  useEffect(() => {
    if (isSyncing) {
      animation.current.play();
    } else {
      animation.current.pause();
    }
  }, [isSyncing]);

  const lastSyncedAtText = lastSyncedAt ? lastSyncedAt.format('DD/MM/YYYY HH:mm') : '...';

  return (
    <Header>
      <Left>
        {!disableNav && (
          <Button transparent onPress={onOpen}>
            <Icon name="menu" />
          </Button>
        )}
      </Left>
      <Body>
        <Title>{title}</Title>
      </Body>
      <Right style={{ alignItems: 'center' }}>
        <Text style={{ lineHeight: 40 }} note>{`Last Sync: ${lastSyncedAtText}`}</Text>
        <Button transparent onPress={doSync}>
          <LottieView
            style={{ height: 40, width: 40 }}
            source={require('../../animations/1703-sync-icon.json')}
            autoPlay={false}
            loop={true}
            ref={animation}
          />
        </Button>
      </Right>
    </Header>
  );
};
