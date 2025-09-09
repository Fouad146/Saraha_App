import {EventEmitter} from 'events'
import { generatToken } from '../Token/generatToken.js';
import { sendEmail } from '../../service/sendEmail.js';

export const eventEmitter = new EventEmitter()




eventEmitter.on('sendEmail',async(data)=>{
    const{email}=data
      const token = await generatToken({
    payload: {email},
        sec_key: process.env.SEND_EMAIL_KEY,
        options: { expiresIn: 60 * 60 },
      });
      const link = `http://localhost:3000/user/confirmEmail/${token}`;
      const isSended = await sendEmail({
        to: email,
       subject:'Comfirm Your Email',
        html: `<a href=${link} >confirm Email</a>`,
      });
      if (!isSended) {
        throw new Error("fail to confirm email",{cause:'404'});
      }
    
})

eventEmitter.on('forgetPassword',async(data)=>{
    const{email,otp}=data
     const isSended = await sendEmail({
        to: email,
        subject:' Forget Password ',
        html: `<h1 >${otp}</h1>`,
      });
      if (!isSended) {
        throw new Error("fail to confirm email",{cause:'404'});
      }
    
})

