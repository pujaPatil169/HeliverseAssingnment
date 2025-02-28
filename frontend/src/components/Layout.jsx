
import Header from './Header/Header';
import Footer from './Footer/Footer';
import { Outlet } from 'react-router-dom';

export default function Layout() {
    // const token = useSelector((state) => state.auth.token); // Access user from the Redux store
// console.log('token in layout ',token);
    return (
        <div style={{ display: 'flex', backgroundColor: '#3F4F44' }}>
            {/* {token && <Sidebar />} Render Sidebar only if user is logged in */}
            <div style={{ flex: 1 }}>
                <Header />
                <Outlet />
                <Footer />
            </div>
        </div>
    );
}
