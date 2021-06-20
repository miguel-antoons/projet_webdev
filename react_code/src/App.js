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

import Article from './components/Pages/Ajout_article/Ajout_article'
import Rgie from './components/Pages/Rgie/Rgie'
import ProjetsDevis from './components/Pages/Devis/ProjetsDevis'
import RassemblementArticles from './components/Pages/Ajout_article/RassemblementArticles'
import ProjetsFactures from './components/Pages/Facture/ProjetsFactures'
import RassemblementClients from './components/Pages/Ajout_client/RassemblementClients'
import ProjetsEtiquettes from './components/Pages/Etiquetage/Projets_etiquettes'
import ProjetsRgie from './components/Pages/Rgie/ProjetsRgie'
import Ajout_Client from './components/Pages/Ajout_client/Ajout_client';


function App() {
  return(
    <Router>
        <div className="App" style={{margin: 0, padding: 0 }}>
            <Navbar />
            <Switch location={window.location}>
                <Route path="/" exact component={Home} />
                <Route path="/facture/:id" component={Facture} />
                <Route path="/devis/:id" component={Devis} />
                <Route path="/etiquetage/:id" component={Etiquetage} />
                <Route path="/suivi" component={Suivi} />
                <Route path="/client/:id" component={Ajout_Client} />
                <Route path="/article/:id" component={Article} />
                <Route path="/rgie/:id" component={Rgie} />
                <Route path="/projets_devis" component={ProjetsDevis} />
                <Route path="/rassemblement_articles" component={RassemblementArticles} />
                <Route path="/projets_factures" component={ProjetsFactures} />
                <Route path="/rassemblement_clients" component={RassemblementClients} />
                <Route path="/projets_etiquettes" component={ProjetsEtiquettes} />
                <Route path="/projets_rgie" component={ProjetsRgie} />
            </Switch>
        </div>
    </Router>
      
  );
}

export default App;