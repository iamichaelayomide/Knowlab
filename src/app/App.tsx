import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { DepartmentProvider } from './context/DepartmentContext';
import { AppThemeProvider } from './components/theme/AppThemeProvider';

export default function App() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <DepartmentProvider>
          <RouterProvider router={router} />
        </DepartmentProvider>
      </AuthProvider>
    </AppThemeProvider>
  );
}
