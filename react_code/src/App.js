import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

// Add components
import Navbar from './components/Navbar/Navbar'
import Home from './components/Pages/Home/Home'
import Facture from './components/Pages/Facture/Facture'
import Devis from './components/Pages/Devis/Devis'
import Etiquetage from './components/Pages/Etiquetage/Etiquetage'
import Suivi from './components/Pages/Suivi/Suivi'
import Client from './components/Pages/Ajout_client/Ajout_client'
import Article from './components/Pages/Ajout_article/Ajout_article'
import Ensemble from './components/Pages/Ajout_ensemble/Ajout_ensemble'
import ProjetsDevis from './components/Pages/Devis/ProjetsDevis'


function App() {
  return(
    <Router>
      <div className="App" style={{margin: 0, padding: 0 }}>
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/facture" component={Facture} />
          <Route path="/devis" component={Devis} />
          <Route path="/etiquetage" component={Etiquetage} />
          <Route path="/suivi" component={Suivi} />
          <Route path="/client" component={Client} />
          <Route path="/article" component={Article} />
          <Route path="/ensemble" component={Ensemble} />
          <Route path="/projets_devis" component={ProjetsDevis} />
        </Switch>
      </div>
    </Router>
      
  );
}

export default App;