// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import {
  AppShell,
  Burger,
  Button,
  Container,
  Divider,
  Drawer,
  Group,
  ScrollArea,
  Stack,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import { Logo } from '../../components/Logo';
import classes from './Header.module.css';

export function Header(): JSX.Element {
  const navigate = useNavigate();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

  return (
    <>
      <AppShell.Header px="md">
        <Container h="100%">
          <Group justify="space-between" h="100%">
            <UnstyledButton className={classes.logoButton} onClick={() => navigate('/')?.catch(console.error)}>
              <Logo width={180} />
            </UnstyledButton>

            <Group className={classes.hiddenMobile}>
              <Button variant="default" onClick={() => navigate('/signin')?.catch(console.error)}>
                Log in
              </Button>
              <Button onClick={() => navigate('/register')?.catch(console.error)}>Sign up</Button>
            </Group>

            <Burger opened={drawerOpened} onClick={toggleDrawer} className={classes.hiddenDesktop} />
          </Group>
        </Container>
      </AppShell.Header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <ScrollArea style={{ height: 'calc(100vh - 60px)' }} mx="-md">
          <Divider my="sm" />

          <Stack pb="xl" px="md">
            <Button variant="default" onClick={() => navigate('/signin')?.catch(console.error)}>
              Log in
            </Button>
            <Button onClick={() => navigate('/register')?.catch(console.error)}>Sign up</Button>
          </Stack>
        </ScrollArea>
      </Drawer>
    </>
  );
}
