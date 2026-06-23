// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { AppShell, Button, Container, Group, Stack, Text, Title } from '@mantine/core';
import { IconClipboardText, IconLogin2 } from '@tabler/icons-react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import { Header } from './Header';
import classes from './index.module.css';

const steps = [
  'Create an account or log in with your existing credentials.',
  'Complete the initial questionnaire with accurate demographic and wellbeing information.',
  'Review your submitted responses and keep your profile details up to date.',
];

export function LandingPage(): JSX.Element {
  const navigate = useNavigate();

  return (
    <AppShell className={classes.outer} header={{ height: 76 }}>
      <Header />
      <AppShell.Main className={classes.outer}>
        <Container size="lg" className={classes.container}>
          <div className={classes.inner}>
            <Stack className={classes.content} gap="xl">
              <Stack gap="md">
                {/*<Text className={classes.eyebrow}></Text>*/}
                <Title className={classes.title}>Estudio sobre la salud mental en estudiantes universitarios</Title>
                <Text className={classes.description}>
                  Inicie sesión y complete los siguientes cuestionarios para recopilar información acerca de la salud mental de los estudiantes.                  
                  Deberá completar 8 cuestionarios cortos.
                </Text>
              </Stack>

              {/*<Stack gap="sm">
                <Text className={classes.sectionTitle}>How to continue</Text>
                <Stack gap="xs">
                  {steps.map((step, index) => (
                    <Text key={step} className={classes.step}>
                      {index + 1}. {step}
                    </Text>
                  ))}
                </Stack>
              </Stack>*/}

              <Group className={classes.actions}>
                <Button
                  leftSection={<IconLogin2 size={18} />}
                  size="md"
                  onClick={() => navigate('/signin')?.catch(console.error)}
                >
                  Iniciar sesión
                </Button>
                <Button
                  leftSection={<IconClipboardText size={18} />}
                  variant="default"
                  size="md"
                  onClick={() => navigate('/register')?.catch(console.error)}
                >
                  Crear cuenta
                </Button>
              </Group>
            </Stack>
          </div>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
