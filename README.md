# Service Reporting
## Ressources gérées :
- Rapports détaillés destinés aux administrateurs et aux reporters
## Technologies :
- Java avec Spring Boot
- Stockage : PostgreSQL (utilisation des données agrégées du service Statistiques)
- Envoie et récupération des statistiques via un bus de messages RabbitMQ
## Principales fonctionnalités API :
- GET /report/detailed : Générer et renvoyer un rapport détaillé.
- GET /report/export : Permettre l’export des rapports au format CSV.

