import express = require('express');
import { Request, Response } from 'express';
import * as UsersService from '../../services/users/users.service';

const router = express.Router();

router.get('', async (req: Request, res: Response) => {
  res.send(await UsersService.getUsersByCurl());
});

router.get('/:ldap', async (req: Request, res: Response) => {
  res.send(await UsersService.getUserByLdap(req.params.ldap));
});

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

router.post('/delete-user', async (req: Request, res: Response) => {
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
