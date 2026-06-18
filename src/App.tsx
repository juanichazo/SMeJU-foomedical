// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { AppShell } from '@mantine/core';
import { ErrorBoundary, useMedplum } from '@medplum/react';
import { Suspense } from 'react';
import type { JSX } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Router } from './Router';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Loading } from './components/Loading';
import { RegisterPage } from './pages/RegisterPage';
import { SignInPage } from './pages/SignInPage';
import { LandingPage } from './pages/landing';
import { useMedplumProfile } from '@medplum/react';
import { useLocation } from 'react-router';
import DatosQuestionnaire from './Questionnaires/DatosSociodemograficosEstudiantes.json';
import { getReferenceString } from '@medplum/core';

export function App(): JSX.Element | null {
  const medplum = useMedplum();

  if (medplum.isLoading()) {
    return null;
  }

  if (!medplum.getProfile()) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="signin" element={<SignInPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    );
  }

  return (
    <AppShell header={{ height: 80 }}>
      <Header />
      <AppShell.Main>
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            <InitialQuestionnaireGate>
              <Router />
            </InitialQuestionnaireGate>
          </Suspense>
        </ErrorBoundary>
      </AppShell.Main>
      <Footer />
    </AppShell>
  );
}

function InitialQuestionnaireGate({ children }: { children: JSX.Element }): JSX.Element {
  const medplum = useMedplum();
  const profile = useMedplumProfile();
  const location = useLocation();

  // Look for QuestionnaireResponse authored by this user for the required questionnaire
  try {
    if (!profile) {
      return children;
    }
    const questionnaireUrl = (DatosQuestionnaire as any).url as string | undefined;
    const responses = questionnaireUrl
      ? medplum
          .searchResources('QuestionnaireResponse', `questionnaire=${encodeURIComponent(questionnaireUrl)}&source=${getReferenceString(
            profile
          )}`)
          .read()
      : [];

    const requiredPath = `/Questionnaire/${(DatosQuestionnaire as any).name ?? 'DatosSociodemograficosEstudiantes'}`;

    if ((!responses || responses.length === 0) && location.pathname !== requiredPath) {
      return <Navigate to={requiredPath} replace />;
    }
  } catch (e) {
    // If the search fails for any reason, allow access to avoid locking out users
    // (the Suspense boundary will handle loading states)
    console.error('Initial questionnaire gate error', e);
  }

  return children;
}
