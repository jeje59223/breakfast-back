import express = require('express');
import { Request, Response } from 'express';
import * as UsersService from '../../services/users/users.service';

const router = express.Router();

router.get('', async (req: Request, res: Response) => {
  res.send(await UsersService.getUsers());
});

router.get('/:userId', async (req: Request, res: Response) => {
  res.send(await UsersService.getUserById(req.params.userId));
});

export default router;
