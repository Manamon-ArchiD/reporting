import { Router } from 'express';
import { Parser } from 'json2csv';

const router = Router();

/**
 * @swagger
 * /report/detailed/{dateParam}:
 *   get:
 *     summary: Générer et renvoyer un rapport détaillé
 *     description: Ce point d'API génère un rapport complet avec les statistiques globales pour une date donnée.
 *     parameters:
 *       - name: dateParam
 *         in: path
 *         description: La date au format JJMMYYYY
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rapport généré avec succès.
 */
router.get('/detailed/:dateParam', async (req, res) => {
    try {
        const { dateParam } = req.params; // Récupération du paramètre dans l'URL

        // Vous pouvez valider ou manipuler `dateParam` si nécessaire ici.
        // Exemple: vérifier si la dateParam est valide

        // Récupération des données d'un autre endpoint (exemple : http://localhost:5000/api/stats)
        const responseSummarize = await fetch('http://localhost:3000/stats/summarize');
        const responseMatch = await fetch(`http://localhost:3000/stats/match/${dateParam}`);
        const responseStore = await fetch(`http://localhost:3000/stats/store/${dateParam}`);

        if (!responseSummarize.ok || !responseMatch.ok || !responseStore.ok) {
            throw new Error(`Erreur sur un ou plusieurs des 3 appels à Statistiques: Retour HTTP Summarize: ${responseSummarize.status},
            Retour HTTP Match: ${responseMatch.status}, Retour HTTP Store: ${responseStore.status}`);
        }

        const externalDataSummarize = await responseSummarize.json();
        const externalDataMatch = await responseMatch.json();
        const externalDataStore = await responseStore.json();

        // Combiner ou utiliser les données récupérées pour générer le rapport
        res.json({
            reportId: 'Votre rapport',
            reportDataSummarize: externalDataSummarize,
            reportDataMatch: externalDataMatch,
            reportDataStore: externalDataStore,
        });
    } catch (error) {
        if (error instanceof Error) {
            // Si l'erreur est une instance d'Error, nous pouvons accéder à la propriété `message`
            console.error('Erreur lors de la récupération des données :', error.message);
        } else {
            // Si ce n'est pas une instance d'Error, nous affichons une erreur générique
            console.error('Erreur inconnue lors de la récupération des données.');
        }
        res.status(500).json({ error: 'Impossible de récupérer les données externes' });
    }
});


/**
 * @swagger
 * /report/export/{dateParam}:
 *   get:
 *     summary: Générer et renvoyer un rapport détaillé au format csv
 *     description: Ce point d'API génère un rapport complet avec les statistiques globales et retourne un fichier .csv pour une date donnée.
 *     parameters:
 *       - name: dateParam
 *         in: path
 *         description: La date au format JJMMYYYY
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rapport csv généré avec succès.
 */
router.get('/export/:dateParam', async (req, res) => {
    try {
        const { dateParam } = req.params; // Récupération du paramètre dans l'URL

        // Vous pouvez valider ou manipuler `dateParam` si nécessaire ici.
        // Exemple : vérifier si la dateParam est valide

        const responseSummarize = await fetch('http://localhost:3000/stats/summarize');
        const responseMatch = await fetch(`http://localhost:3000/stats/match/${dateParam}`);
        const responseStore = await fetch(`http://localhost:3000/stats/store/${dateParam}`);

        if (!responseSummarize.ok || !responseMatch.ok || !responseStore.ok) {
            throw new Error(`Erreur sur un ou plusieurs des 3 appels à Statistiques`);
        }

        const externalDataSummarize = await responseSummarize.json();
        const externalDataMatch = await responseMatch.json();
        const externalDataStore = await responseStore.json();

        // Préparation des données pour un CSV plus lisible
        const reportData = {
            summarize: externalDataSummarize,
            matchStats: externalDataMatch,
            storeStats: externalDataStore
        };

        const flattenData = [
            {
                "Number of Matches": reportData.summarize.numberOfMatch,
                "Bigger Players Ever": formatBiggerPlayers(reportData.summarize.biggerPlayersEver),
                "Number of Transactions": reportData.summarize.numberOfTrasaction,
                "Number of Credit Trades": reportData.summarize.numberOfCreditTrade,
                "Number of Player Accounts": reportData.summarize.numberOfPlayerAccount,
                "Most Played Hours": formatMostPlayedHours(reportData.matchStats.mostPlayedHours),
                "Bigger Players of the Day": formatBiggerPlayers(reportData.matchStats.biggerPlayersOfTheDay),
                "Most Traded Hours": formatMostTradedHours(reportData.storeStats.mostTradedHour),
                "Total Purchases": reportData.storeStats.totalAmountOfPurchases,
                "Bigger Store Users of the Day": formatBiggerStoreUsers(reportData.storeStats.biggerStoreUserOfTheDay),
            }
        ];

        // Parser pour transformer les données en CSV
        const parser = new Parser();
        const csv = parser.parse(flattenData);

        // Envoi du CSV en réponse
        res.header('Content-Type', 'text/csv');
        res.attachment('report.csv');
        res.send(csv);

    } catch (error) {
        res.status(500).json({ error: 'Impossible de récupérer les données externes' });
    }
});

// Fonctions de formatage pour les données
function formatBiggerPlayers(players: any[]) {
    if (!players) return '';
    return players.map(player => `playerId: ${player.playerId}, matches: ${player.matches}`).join('; ');
}

function formatMostPlayedHours(hours: any[]) {
    if (!hours) return '';
    return hours.map(hour => hour ? `datetime: "${hour.datetime}", matches: ${hour.matches}` : '').join('; ');
}

function formatMostTradedHours(trades: any[]) {
    if (!trades) return '';
    return trades.map(trade => trade ? `datetime: "${trade.datetime}", trades: ${trade.trades}` : '').join('; ');
}

function formatBiggerStoreUsers(users: any[]) {
    if (!users) return '';
    return users.map(user => user ? `userId: ${user.userId}, trades: ${user.trades}, purchases: ${user.amountOfPurchases}` : '').join('; ');
}

export default router;