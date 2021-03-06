import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

// Components
import Landing from './components/landing/Landing';
import Home from './components/home/Home';
import About from './components/about/About';
import Login from './components/authentication/Login/Login';
import Register from './components/authentication/register/Register';
import Dashboard from './components/dashboard/Dashboard';
import NotFound from './components/not-found/NotFound';

// Redux
import store from './store';
import { Provider } from 'react-redux';
import { setCurrentUser } from './redux/actions/login';
import { logoutUser, setLogoutUser } from './redux/actions/logout';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Common
import PrivateRoute from './components/common/privateRoute';

// Utils
import setAuthToken from './utils/setAuthToken';


// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));


  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Clear current Profile
    store.dispatch(setLogoutUser());
    // Redirect to login
    window.location.href = '/login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <Route exact path='/' component={Landing} />
              <Router>
                <div className='container-fluid'>
                  <Navbar />

                  <Route exact path='/home' component={Home} />
                  <Route exact path='/about' component={About} />
                  <Route exact path='/login' component={Login} />
                  <Route exact path='/register' component={Register} />

                  <Switch>
                    <PrivateRoute exact path='/dashboard' component={Dashboard} />
                  </Switch>

                  <Footer />
                </div>
              </Router>
            <Route path='not-found' component={NotFound} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;
