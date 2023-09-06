import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const PrivateRoute = () => {
  const { user } = useUser();

//   if (loading) {
//     // TODO: make Spinner component for loading
//     return <h3>Loading...</h3>;
//   }

  return user ? <Outlet /> : <Navigate to='/' />;
};

export default PrivateRoute;