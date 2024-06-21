import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

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
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/facture/:id" element={<Facture />} />
          <Route path="/devis/:id" element={<Devis />} />
          <Route path="/etiquetage/:id" element={<Etiquetage />} />
          <Route path="/suivi" element={<Suivi />} />
          <Route path="/client/:id" element={<Ajout_Client />} />
          <Route path="/article/:id" element={<Article />} />
          <Route path="/rgie/:id" element={<Rgie />} />
          <Route path="/projets_devis" element={<ProjetsDevis />} />
          <Route path="/rassemblement_articles" element={<RassemblementArticles />} />
          <Route path="/projets_factures" element={<ProjetsFactures />} />
          <Route path="/rassemblement_clients" element={<RassemblementClients />} />
          <Route path="/projets_etiquettes" element={<ProjetsEtiquettes />} />
          <Route path="/projets_rgie" element={<ProjetsRgie />} />

        </Routes>
      </div>
    </Router>
      
  );
}

export default App;