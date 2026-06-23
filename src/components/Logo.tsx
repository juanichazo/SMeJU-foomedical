// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { Text, useMantineTheme } from '@mantine/core';
import type { JSX } from 'react';

export interface LogoProps {
  readonly width: number;
}

export function Logo(props: LogoProps): JSX.Element {
  const theme = useMantineTheme();

  return (
    <Text
      fw={700}
      size="lg"
      c={theme.primaryColor}
      style={{
        width: props.width,
        textAlign: 'center',
        cursor: 'pointer',
      }}
    >
      Menú
    </Text>
  );
}
