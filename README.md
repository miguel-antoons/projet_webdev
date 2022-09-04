# projet_webdev

## Création du venv

Pour créer un environnement virtuel pour Python: <br><br>
    1. Se déplacer dans le dossier flask <br>
    2. lancer la commande "python -m venv venv" <br>

## Installation des librairies Python

Pour installer les librairies Python à l'aide du fichier "requirements.txt": <br><br>
    1. se déplacer dans le dossier flask <br>
    2. activer l'environnement virtuel à l'aide de la commande ". venv/bin/activate" pour linux ou "./venv/Scripts/activate.bat" pour windows <br>
    3. lancer la commande "pip install -r ./requirements.txt" pour windows et linux (dans certains cas, il faut rajouter "python3 -m" devant cette commande) <br>

## Installation des nodes_modules

Lors du premier pull, il faut installer les modules de base permettant à réact de fontionner correctement. Pour faire ça il faut: <br>
    1. Se déplacer dans le dossier "react_code" <br>
    2. Lancer la commande "npm install" <br>

## Lancement de l'appli

Pour lancer l'application il faut: <br><br>

* Lancer le serveur pour le font-end:
    1. Se déplacer dans le dossier "react_code"
    2. Lancer la commande "npm start"

* Lancer le serveur pour le back-end:
    1. ouvrir un nouveau terminal
    2. Se déplacer dans le dossier flask
    3. activer l'environnement virtuel à l'aide de la commande ". venv/bin/activate" pour linux ou "./venv/Scripts/activate.bat" pour windows
    4. lancer le serveur à l'aide de la commande "flask run --no-debugger"

## Mettre à jour requirements.txt

Pour mettre à jour le fichier "requirements.txt":
<br><br>
    1. se déplacer dans le dossier flask du projet <br>
    2. activer l'environnement virtuel à l'aide de la commande ". venv/bin/activate" pour linux ou "./venv/Scripts/activate.bat" pour windows <br>
    3. lancer la commande "pip freeze > requirements.txt" (dans certains cas il faut rajouter la commande "python3 -m" devant la commande) <br>

## Installer bootstrap

Dans le fichier react_code :
    1. npm install react-bootstrap bootstrap
