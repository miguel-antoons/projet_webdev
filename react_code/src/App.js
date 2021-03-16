import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

// Add component
import Navbar from './components/Navbar/Navbar'
import Facture from './components/Pages/Facture/Facture'
import Devis from './components/Pages/Devis/Devis'
import Etiquetage from './components/Pages/Etiquetage/Etiquetage'
import Suivi from './components/Pages/Suivi/Suivi'
import Client from './components/Pages/Ajout_client/Ajout_client'
import Article from './components/Pages/Ajout_article/Ajout_article'
import Ensemble from './components/Pages/Ajout_ensemble/Ajout_ensemble'


function App() {
  return(
    <Router>
      <div className="App">
        <Navbar />
        <switch>
          <Route path="/" exact component={Home} />
          <Route path="/facture" component={Facture} />
          <Route path="/devis" component={Devis} />
          <Route path="/etiquetage" component={Etiquetage} />
          <Route path="/suivi" component={Suivi} />
          <Route path="/client" component={Client} />
          <Route path="/article" component={Article} />
          <Route path="/ensemble" component={Ensemble} />
        </switch>
      </div>
    </Router>
      
  );
}


const Home = () => (
  <div>
    <h1>Bienvue dans Home</h1>
  </div>
)



export default App;