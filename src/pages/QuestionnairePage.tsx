// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { showNotification } from '@mantine/notifications';
import { normalizeErrorString } from '@medplum/core';
import type { Questionnaire, QuestionnaireResponse } from '@medplum/fhirtypes';
import { Document, QuestionnaireForm, useMedplum } from '@medplum/react';
import { IconCircleCheck, IconCircleOff } from '@tabler/icons-react';
import { Box, Button, Card, Container, Group, Stack, Text, Title } from '@mantine/core';
import { useCallback } from 'react';
import type { JSX } from 'react';
import { useNavigate, useParams } from 'react-router';

const questionnaireModules = import.meta.glob('../Questionnaires/*.json', { eager: true }) as Record<
  string,
  { default: Questionnaire }
>;

const questionnaireList = Object.entries(questionnaireModules).map(([path, module]) => {
  const filename = path.split('/').pop() ?? path;
  const slug = filename.replace(/\.json$/i, '');
  return {
    slug,
    questionnaire: module.default,
  };
});

function findQuestionnaire(questionnaireId?: string): Questionnaire | undefined {
  if (!questionnaireId) {
    return undefined;
  }

  const normalized = questionnaireId.toLowerCase();
  return questionnaireList.find(
    ({ slug, questionnaire }) =>
      slug.toLowerCase() === normalized ||
      questionnaire.id?.toLowerCase() === normalized ||
      questionnaire.name?.toLowerCase() === normalized
  )?.questionnaire;
}

export function QuestionnairePage(): JSX.Element {
  const navigate = useNavigate();
  const medplum = useMedplum();
  const { questionnaireId } = useParams<{ questionnaireId: string }>();
  const questionnaire = findQuestionnaire(questionnaireId);

  const handleOnSubmit = useCallback(
    (response: QuestionnaireResponse) => {
      medplum
        .createResource(response)
        .then(() => {
          showNotification({
            icon: <IconCircleCheck />,
            title: 'Success',
            message: 'Answers recorded',
          });
          navigate('/health-record/questionnaire-responses/')?.catch(console.error);
          window.scrollTo(0, 0);
        })
        .catch((err) => {
          showNotification({
            color: 'red',
            icon: <IconCircleOff />,
            title: 'Error',
            message: normalizeErrorString(err),
          });
        });
    },
    [medplum, navigate]
  );

  if (!questionnaireId) {
    return (
      <Document width={800}>
        <Container py="xl">
          <Stack spacing="xl">
            <Title order={2}>Complete a Questionnaire</Title>
            <Text color="dimmed">
              Choose one of the available questionnaires below, then complete it to record your answers.
            </Text>
            <Stack spacing="md">
              {questionnaireList.map(({ slug, questionnaire }) => (
                <Card key={slug} shadow="sm" radius="md" p="xl">
                  <Group position="apart" align="flex-start">
                    <div>
                      <Text fw={700}>{questionnaire.title ?? questionnaire.name ?? slug}</Text>
                      {questionnaire.description ? (
                        <Text size="sm" color="dimmed" mt="xs">
                          {questionnaire.description}
                        </Text>
                      ) : null}
                    </div>
                    <Button onClick={() => navigate(`/Questionnaire/${slug}`)?.catch(console.error)}>
                      Start
                    </Button>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Document>
    );
  }

  if (!questionnaire) {
    return (
      <Document width={800}>
        <Box py="xl">
          <Title order={2}>Questionnaire not found</Title>
          <Text color="dimmed">Please select a questionnaire from the list.</Text>
        </Box>
      </Document>
    );
  }

  return (
    <Document width={800}>
      <QuestionnaireForm questionnaire={questionnaire} onSubmit={handleOnSubmit} />
    </Document>
  );
}
