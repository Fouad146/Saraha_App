import dotenv from 'dotenv'
import path from 'path'   
dotenv.config({path:path.resolve('config/.env')})

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({ 
  // cloud_name:'dxwnom63w', 
  cloud_name:process.env.CLOUD_NAME, 
  // api_key: '758576426485252', 
  api_key:process.env.CLOUD_API_KEY, 
  // api_secret: '09wOgjFuYBpsWv78qYZI6Kf4Dwc'
  api_secret:process.env.CLOUD_API_SECRET
});

export default cloudinary