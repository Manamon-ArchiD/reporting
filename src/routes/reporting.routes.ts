import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * /report/detailed:
 *   get:
 *     summary: Générer et renvoyer un rapport détaillé
 *     description: Ce point d'API génère un rapport complet avec les statistiques globales.
 *     responses:
 *       200:
 *         description: Rapport généré avec succès.
 */
router.get('/detailed', async (req, res) => {
  try {
      // Récupération des données d'un autre endpoint (exemple : http://localhost:5000/api/stats)
      const response = await fetch('http://localhost:3000/stats/summarize');

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const externalData = await response.json();

      // Combiner ou utiliser les données récupérées pour générer le rapport
      res.json({
        reportId: '123',
        reportData: externalData,
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
 * /report/export:
 *   get:
 *     summary: Générer et renvoyer un rapport détaillé au format csv
 *     description: Ce point d'API génère un rapport complet avec les statistiques globales et retourne un fichier .csv
 *     responses:
 *       200:
 *         description: Rapport csv généré avec succès.
 */
router.get('/export', (req, res) => {
  res.json({
    reportId: '123',
    reportData: [],
  });
});

export default router;