import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Inspections from './pages/Inspections';
import Payments from './pages/Payments';

function App() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <main className="p-4">
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/bookings" component={Bookings} />
            <Route path="/inspections" component={Inspections} />
            <Route path="/payments" component={Payments} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

export default App;
