// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { BackgroundImage, Box, SimpleGrid } from '@mantine/core';
import { SignInForm } from '@medplum/react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import {
  MEDPLUM_PROJECT_ID,
  MEDPLUM_GOOGLE_CLIENT_ID,
  MEDPLUM_CLIENT_ID,
} from '../config';

export function SignInPage(): JSX.Element {
  const navigate = useNavigate();
  return (
    <SimpleGrid cols={1}>
      <Box pt={100} pb={200}>
        <SignInForm
          projectId={MEDPLUM_PROJECT_ID}
          googleClientId={MEDPLUM_GOOGLE_CLIENT_ID}
          clientId={MEDPLUM_CLIENT_ID}
          onSuccess={() => navigate('/')?.catch(console.error)}
        >
          <h2>Iniciar Sesión</h2>
        </SignInForm>
      </Box>
    </SimpleGrid>
  );
}
