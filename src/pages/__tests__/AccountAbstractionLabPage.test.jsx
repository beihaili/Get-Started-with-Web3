import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AccountAbstractionLabPage from '../AccountAbstractionLabPage';
import LanguageProvider from '../../i18n/LanguageProvider';
import i18n from '../../i18n';
import { loadI18nSections } from '../../i18n/namespaceLoaders';
import { EIP_7702_FACTORY_FLAG } from '../../features/account-abstraction-lab/userOperationSimulator';

async function prepareTranslations(language = 'en') {
  await i18n.changeLanguage(language);
  await loadI18nSections(i18n, ['accountAbstractionLab'], language);
}

function renderAccountAbstractionLabPage(initialEntry = '/en/labs/account-abstraction') {
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="/:lang/labs/account-abstraction"
          element={
            <LanguageProvider>
              <AccountAbstractionLabPage />
            </LanguageProvider>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('AccountAbstractionLabPage', () => {
  beforeEach(async () => {
    await prepareTranslations('en');
  });

  it('renders a local-only simulator without requiring a wallet', () => {
    renderAccountAbstractionLabPage();

    expect(screen.getByRole('heading', { name: 'UserOperation Simulator' })).toBeInTheDocument();
    expect(screen.getByText('Simulator only, no wallet or network call')).toBeInTheDocument();
    expect(screen.getByText('Draft passes local checks')).toBeInTheDocument();
    expect(screen.queryByText('stepIntent')).not.toBeInTheDocument();
    expect(screen.getByText(/The app prepares the UserOperation/)).toBeInTheDocument();
    expect(screen.getByText(/"userOperation"/)).toBeInTheDocument();
  });

  it('adds paymaster fields and warnings when sponsorship is enabled', () => {
    renderAccountAbstractionLabPage();

    fireEvent.click(screen.getByRole('checkbox', { name: /Use a paymaster/ }));

    expect(screen.getByLabelText('Paymaster contract')).toBeInTheDocument();
    expect(screen.getByText(/the paymaster validates its policy/)).toBeInTheDocument();
    expect(screen.getByText(/Sponsorship is a policy decision/)).toBeInTheDocument();
    expect(screen.getByText(/"paymasterData": "0x/)).toBeInTheDocument();
  });

  it('switches to the EIP-7702 delegated EOA path', () => {
    renderAccountAbstractionLabPage();

    fireEvent.click(screen.getByRole('button', { name: /EIP-7702 delegated EOA/ }));

    expect(screen.getByLabelText('EIP-7702 delegate contract')).toBeInTheDocument();
    expect(screen.getByText(/the EOA also provides an authorization tuple/)).toBeInTheDocument();
    expect(screen.getByText(/"eip7702Auth"/)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(EIP_7702_FACTORY_FLAG))).toBeInTheDocument();
  });

  it('shows a fix state when the sender address is invalid', () => {
    renderAccountAbstractionLabPage();

    fireEvent.change(screen.getByLabelText('Sender smart account'), {
      target: { value: 'not-an-address' },
    });

    expect(screen.getByText('Draft needs fixes')).toBeInTheDocument();
    expect(screen.getByText('Sender must be a 20-byte EVM address.')).toBeInTheDocument();
  });
});
