import express = require('express');
import { Request, Response } from 'express';
import * as UsersService from '../../services/users/users.service';

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Liste des utilisateurs
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Liste récupérée avec succès
 */
router.get('', async (req: Request, res: Response) => {
  res.send(await UsersService.getUsersByCurl());
});

/**
 * @swagger
 * /users/{ldap}:
 *   get:
 *     summary: Détails d'un utilisateur
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: ldap
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant LDAP
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/:ldap', async (req: Request, res: Response) => {
  res.send(await UsersService.getUserByLdap(req.params.ldap));
});

/**
 * @swagger
 * /users/add-user:
 *   post:
 *     summary: Ajouter un utilisateur
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: "Sanni"
 *               lastname:
 *                 type: string
 *                 example: "Korpi"
 *               email:
 *                 type: string
 *                 example: "sanni.korpi@example.com"
 *               login:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                     example: "purpleladybug163"
 *                   password:
 *                     type: string
 *                     example: "123"
 *               picture:
 *                 type: string
 *                 example: "https://randomuser.me/api/portraits/women/90.jpg"
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [ADMIN, USER]
 *                 example: ["USER"]
 *               numberOfBreakFastOrganised:
 *                 type: integer
 *                 example: 2
 *               nextOrganizedBreakfastDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-03-26T00:00:00+01:00"
 *               creationDate:
 *                 type: string
 *                 format: date
 *                 example: "2023-02-01"
 *               ldap:
 *                 type: string
 *                 example: "1"
 *     responses:
 *       201:
 *         description: Utilisateur ajouté
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur ajouté avec succès"
 *                 userId:
 *                   type: string
 *                   example: "670101ac7c08a7bfefc557cc"
 *       400:
 *         description: Données invalides
 */
router.post('/add-user', async (req: Request, res: Response) => {
  try {
    const user = req.body;
    const result = await UsersService.addNewUserByCurl(user);
    res.status(201).json({ message: 'Utilisateur ajouté avec succès', userId: result.insertedId });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error });
  }
});

/**
 * @swagger
 * /users/delete-user:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags:
 *       - Users
 *     description: Cette route permet de supprimer un utilisateur de la base de données.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               ldap:
 *                 type: string
 *     responses:
 *       201:
 *         description: L'utilisateur a été supprimé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Utilisateur supprimé avec succès'
 *                 userId:
 *                   type: string
 *                   example: '1234567890abcdef'
 *       400:
 *         description: Les données envoyées dans la requête sont invalides.
 */
router.delete('/delete-user', async (req: Request, res: Response) => {
  try {
    const { ldap } = req.body;

    if (!ldap) {
      res.status(400).json({ message: 'Le champ "ldap" est requis' });
    }

    await UsersService.deleteUserByLdap(ldap);

    res.status(200).json({ message: 'L\'utilisateur a été supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur :', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur', error });
  }
});

export default router;
