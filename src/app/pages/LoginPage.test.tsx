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

