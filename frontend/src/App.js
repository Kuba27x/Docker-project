import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CarList from "./components/CarList";
import CarForm from "./components/CarForm";
import UploadCSV from "./components/UploadCSV";
import Statistics from "./components/Statistics";
import Landing from "./pages/Landing";
import Error from "./pages/Error";
import { AuthorizedRoute, GuestRoute } from "./components/Routes";
import Layout from "./components/Layout";
import EditCarForm from "./components/EditCar";
import AccountEdit from "./pages/auth/AccountEdit";

function App() {
	return (
		<Layout>
			<Routes>
				<Route path='/' element={<Landing />} />
				<Route element={<AuthorizedRoute />}>
					<Route path='/dashboard' element={<Dashboard />} />
					<Route path='/cars' element={<CarList />} />
					<Route path='/upload' element={<UploadCSV />} />
					<Route path='/add-car' element={<CarForm />} />
					<Route path='/statistics' element={<Statistics />} />
					<Route path='/edit-car/:id' element={<EditCarForm />} />
					<Route path='/account' element={<AccountEdit />} />
				</Route>
				<Route element={<GuestRoute />}>
					<Route path='/login' element={<Login />} />
					<Route path='/register' element={<Register />} />
				</Route>
				<Route path='*' element={<Error />} />
			</Routes>
		</Layout>
	);
}

export default App;
