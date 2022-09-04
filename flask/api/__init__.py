from .article import app_article
from .client import app_client
from .devis import app_devis
from .etiquettes import app_etiquette
from .facture import app_facture
from .parametrage import app_parametrage
from .rgie import app_rgie
from .suivi import app_suivi


blueprints = [
    app_article,
    app_client,
    app_devis,
    app_etiquette,
    app_facture,
    app_parametrage,
    app_rgie,
    app_suivi
]
