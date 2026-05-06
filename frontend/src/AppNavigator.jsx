import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './Screens/SplashScreen';
import GetStartedScreen from './Screens/GetStartedScreen';
import LoginScreen from './Screens/LoginScreen';
import SignupScreen from './Screens/SignupScreen'; // <-- Ajout de l'import
import HomeScreen from './Screens/HomeScreen';
import PrivateRoute from './Screens/components/PrivateRoute';
import AddBookScreen from './Screens/AddBookScreen';
import BookDetailScreen from './Screens/BookDetailScreen';
import ProfileScreen from './Screens/ProfileScreen';
import AdminDashboardScreen from './Screens/AdminDashboardScreen';
import ManageAuteursScreen from './Screens/ManageAuteursScreen';
const AppNavigator = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SplashScreen />} />
                <Route path="/get-started" element={<GetStartedScreen />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/signup" element={<SignupScreen />} /> {/* <-- Ajout de la route */}
                <Route 
                    path="/home" 
                    element={
                        <PrivateRoute>
                            <HomeScreen />
                        </PrivateRoute>
                    } 
                />
                <Route 
                    path="/add-book" 
                    element={
                        <PrivateRoute>
                            <AddBookScreen />
                        </PrivateRoute>
                    } 
                />
                <Route 
                    path="/livre/:id" 
                    element={
                        <PrivateRoute>
                            <BookDetailScreen />
                        </PrivateRoute>
                    } 
                />


                <Route path="/profile" element={<PrivateRoute><ProfileScreen /></PrivateRoute>} />
                <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboardScreen /></PrivateRoute>} />
                <Route path="/manage-auteurs" element={<ManageAuteursScreen />} />
            </Routes>
        </Router>
    );
};

export default AppNavigator;