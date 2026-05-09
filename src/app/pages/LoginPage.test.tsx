import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import LoginPage from './LoginPage';

const navigateMock = vi.fn();

vi.mock('react-router', async () => {
  const actual = await vi.importActual<object>('react-router');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear();
    navigateMock.mockReset();
  });

  const renderPage = () => render(
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  );

  it('does not expose demo account listing on login page', () => {
    renderPage();
    expect(screen.queryByText(/Demo Accounts/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Click to fill/i)).not.toBeInTheDocument();
  });

  it('fills demo credentials when a role chip is selected', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /Use Supervisor demo account/i }));

    expect(screen.getByPlaceholderText(/you@knowlab.com/i)).toHaveValue('supervisor123@knowlab.com');
    expect(screen.getByPlaceholderText(/Enter your password/i)).toHaveValue('supervisor123');
    expect(screen.getByRole('button', { name: /Use Supervisor demo account/i })).toHaveAttribute('aria-current', 'true');
  });

  it('fills staff credentials from the unit dropdown', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /Use Staff demo account/i }));
    fireEvent.change(screen.getByLabelText(/Staff unit/i), { target: { value: 'u7' } });

    expect(screen.getByPlaceholderText(/you@knowlab.com/i)).toHaveValue('blessing@knowlab.ng');
    expect(screen.getByPlaceholderText(/Enter your password/i)).toHaveValue('staff123');
    expect(screen.getByText('Kidney Function Tests')).toBeInTheDocument();
  });

  it('fills supervisor credentials from the unit dropdown', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /Use Supervisor demo account/i }));
    fireEvent.change(screen.getByLabelText(/Supervisor unit/i), { target: { value: 'sup2' } });

    expect(screen.getByPlaceholderText(/you@knowlab.com/i)).toHaveValue('seun@knowlab.ng');
    expect(screen.getByPlaceholderText(/Enter your password/i)).toHaveValue('super123');
    expect(screen.getByText('Glucose & Diabetes Markers')).toBeInTheDocument();
  });

  it('routes staff demo credentials to staff dashboard', async () => {
    renderPage();
    fireEvent.change(screen.getByPlaceholderText(/you@knowlab.com/i), { target: { value: 'staff123@knowlab.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'staff123' } });
    fireEvent.submit(screen.getByRole('button', { name: /Sign in to Knowlab/i }).closest('form')!);
    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/staff/dashboard'));
  });

  it('routes supervisor demo credentials to supervisor dashboard', async () => {
    renderPage();
    fireEvent.change(screen.getByPlaceholderText(/you@knowlab.com/i), { target: { value: 'supervisor123@knowlab.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'supervisor123' } });
    fireEvent.submit(screen.getByRole('button', { name: /Sign in to Knowlab/i }).closest('form')!);
    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/supervisor/dashboard'));
  });

  it('routes hod demo credentials to hod dashboard', async () => {
    renderPage();
    fireEvent.change(screen.getByPlaceholderText(/you@knowlab.com/i), { target: { value: 'hod123@knowlab.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'hod123' } });
    fireEvent.submit(screen.getByRole('button', { name: /Sign in to Knowlab/i }).closest('form')!);
    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/hod/dashboard'));
  });
});
