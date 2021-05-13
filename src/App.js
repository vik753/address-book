import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

import { HomePage } from './pages/HomePage'
import { EditPage } from './pages/EditPage'
import { Header } from './components/header/Header'
import { Footer } from './components/footer/Footer'

const App = () => {
    return (
        <Router>
            <div className="root-wrapper">
                <Header />
                <div className="main-wrapper">
                    <Switch>
                        <Route exact path="/">
                            <HomePage />
                        </Route>
                        <Route path="/edit">
                            <EditPage />
                        </Route>
                    </Switch>
                </div>
                <Footer />
            </div>
        </Router>
    )
}

export default App
