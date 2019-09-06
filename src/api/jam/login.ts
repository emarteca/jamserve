import express from 'express';
import {User} from '../../engine/user/user.model';
import {EngineRequest} from '../server';
import {Errors} from './error';

/**
 * Fill user into req.user express requests
 */
export interface UserRequest extends EngineRequest {
	user: User;
	client: string;
	jwt: boolean;
	params: any;
}

export function CheckAuthMiddleWare(req: UserRequest, res: express.Response, next: express.NextFunction): void {
	if (!req.client && req.session && req.session.client) {
		req.client = req.session.client;
	}
	if (req.user) {
		return next();
	}
	res.status(401).json({error: Errors.unauthorized});
}
