// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { showNotification } from '@mantine/notifications';
import { normalizeErrorString } from '@medplum/core';
import type { Questionnaire, QuestionnaireResponse } from '@medplum/fhirtypes';
import { Document, QuestionnaireForm, useMedplum } from '@medplum/react';
import { IconCircleCheck, IconCircleOff } from '@tabler/icons-react';
import { Box, Button, Card, Stack, Text, Title } from '@mantine/core';
import { useCallback } from 'react';
import type { JSX } from 'react';
import { useNavigate, useParams } from 'react-router';
import { MEDPLUM_PROJECT_ID } from '../config';

function isProjectQuestionnaire(questionnaire: Questionnaire): boolean {
  return !!questionnaire.id && questionnaire.meta?.project === MEDPLUM_PROJECT_ID;
}

export function QuestionnairePage(): JSX.Element {
  const navigate = useNavigate();
  const medplum = useMedplum();
  const { questionnaireId } = useParams();
  const questionnaires = medplum
    .searchResources('Questionnaire', 'status=active&_sort=title')
    .read()
    .filter(isProjectQuestionnaire);
  const questionnaire = questionnaireId
    ? questionnaires.find((questionnaire) => questionnaire.id === questionnaireId)
    : undefined;

  const handleOnSubmit = useCallback(
    (response: QuestionnaireResponse) => {
      if (!questionnaire) {
        return;
      }

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
    [medplum, navigate, questionnaire]
  );

  if (!questionnaire) {
    return (
      <Document width={800}>
        <Box py="xl">
          <Title order={2}>{questionnaireId ? 'Questionnaire not found' : 'Complete a Questionnaire'}</Title>
          <Text color="dimmed" mb="lg">
            {questionnaireId
              ? 'Please select a questionnaire from the list.'
              : 'Choose one of the available questionnaires below, then complete it to record your answers.'}
          </Text>
          <Stack gap="md">
            {questionnaires.map((questionnaire) => (
              <Card key={questionnaire.id} shadow="sm" radius="md" p="xl">
                <Stack gap="sm">
                  <Box>
                    <Text fw={700}>{questionnaire.title ?? questionnaire.name ?? questionnaire.id}</Text>
                    {questionnaire.description ? (
                      <Text size="sm" color="dimmed" mt="xs">
                        {questionnaire.description}
                      </Text>
                    ) : null}
                  </Box>
                  <Button onClick={() => navigate(`/Questionnaire/${questionnaire.id}`)?.catch(console.error)}>
                    Start
                  </Button>
                </Stack>
              </Card>
            ))}
          </Stack>
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
