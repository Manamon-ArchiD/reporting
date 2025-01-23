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
router.get('/detailed', (req, res) => {
  res.json({
    reportId: '123',
    reportData: [],
  });
});

export default router;
