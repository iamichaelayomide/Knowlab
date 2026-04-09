import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { DepartmentProvider } from './context/DepartmentContext';

export default function App() {
  return (
    <AuthProvider>
      <DepartmentProvider>
        <RouterProvider router={router} />
      </DepartmentProvider>
    </AuthProvider>
  );
}
