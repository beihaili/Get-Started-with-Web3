import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import L2RiskLabPage from '../L2RiskLabPage';
import LanguageProvider from '../../i18n/LanguageProvider';
import i18n from '../../i18n';
import { loadI18nSections } from '../../i18n/namespaceLoaders';

async function prepareTranslations(language = 'en') {
  await i18n.changeLanguage(language);
  await loadI18nSections(i18n, ['l2RiskLab'], language);
}

function renderL2RiskLabPage(initialEntry = '/en/labs/l2-risk') {
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="/:lang/labs/l2-risk"
          element={
            <LanguageProvider>
              <L2RiskLabPage />
            </LanguageProvider>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('L2RiskLabPage', () => {
  beforeEach(async () => {
    await prepareTranslations('en');
  });

  it('renders a local-only default bridge risk scenario', () => {
    renderL2RiskLabPage();

    expect(screen.getByRole('heading', { name: 'Bridge Risk Simulator' })).toBeInTheDocument();
    expect(screen.getByText('Simulator only, no bridge transaction')).toBeInTheDocument();
    expect(screen.getAllByText('Medium risk score 4').length).toBeGreaterThan(0);
    expect(
      screen.getByText(/Optimistic withdrawals may require a challenge window/)
    ).toBeInTheDocument();
    expect(screen.getByText(/The simulator never asks for a wallet/)).toBeInTheDocument();
  });

  it('shows critical risk for a large embedded external-validator bridge route', () => {
    renderL2RiskLabPage();

    fireEvent.click(screen.getByRole('button', { name: /External validator bridge/ }));
    fireEvent.click(screen.getByRole('button', { name: /Large or business-critical amount/ }));
    fireEvent.click(screen.getByRole('button', { name: /Embedded bridge flow inside the app/ }));

    expect(screen.getAllByText('Critical risk score 9').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/External validator compromise/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Embedded bridge UX makes your app responsible/)).toBeInTheDocument();
  });

  it('adds live liveness risk when the sequencer is degraded', () => {
    renderL2RiskLabPage();

    fireEvent.click(screen.getByRole('button', { name: /Sequencer degraded/ }));

    expect(screen.getAllByText('High risk score 6').length).toBeGreaterThan(0);
    expect(screen.getByText(/Current sequencer degradation/)).toBeInTheDocument();
  });

  it('renders the bridge profile comparison table', () => {
    renderL2RiskLabPage();

    expect(screen.getByRole('heading', { name: 'Bridge profile comparison' })).toBeInTheDocument();
    expect(screen.getAllByText('Native ZK rollup bridge').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Liquidity network / fast bridge').length).toBeGreaterThan(0);
  });
});
