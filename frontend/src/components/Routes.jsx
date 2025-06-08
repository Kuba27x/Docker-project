import { useAuth } from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export const GuestRoute = () => {
	const { isLoggedIn, isLoading } = useAuth();

	if (isLoading) {
		return <div>Ładowanie...</div>;
	}

	return isLoggedIn ? <Navigate to={`/`} replace /> : <Outlet />;
};

export const AuthorizedRoute = () => {
	const { isLoggedIn, isLoading } = useAuth();

	if (isLoading) {
		return <div>Ładowanie...</div>;
	}

	return isLoggedIn ? <Outlet /> : <Navigate to='/login' replace />;
};
