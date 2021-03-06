import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import React, { useState } from 'react';

import { HomePage } from './pages/homePage/HomePage';
import { EditPage } from './pages/editPage/EditPage';
import { Header } from './components/header/Header';
import { Footer } from './components/footer/Footer';
import { dummyData } from './dummy_data/dummy.data';
import {StateContext} from "./stateContext/stateContext";



const App = () => {
    const [users, setUsers] = useState(JSON.parse(window.localStorage.getItem('address_book'))|| dummyData || []);

    return (
        <StateContext.Provider value={{ users, setUsers }}>

            <Router>
                <div className="root-wrapper">
                    <Header />
                    <div className="main-wrapper">
                        <Switch>
                            <Route exact path="/">
                                <HomePage />
                            </Route>
                            <Route path="/edit/:id">
                                <EditPage />
                            </Route>
                            <Redirect to="/" />
                        </Switch>
                    </div>
                    <Footer />
                </div>
            </Router>
        </StateContext.Provider>
    );
};

export default App;
