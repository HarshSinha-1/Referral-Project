import express from 'express';
import { getUserProfile, generateReferralCode, useRefreealcode } from './user.controller';
import { UserAuthenticate } from '../../middlewares/auth.middleware';


const UserRouter = express.Router();

//@ts-ignore
UserRouter.post('/getReferral-code',[UserAuthenticate],  generateReferralCode);
//@ts-ignore
UserRouter.post('/use-referral-code',[UserAuthenticate], useRefreealcode);
//@ts-ignore
UserRouter.get('/info', [UserAuthenticate], getUserProfile);

export default UserRouter;
