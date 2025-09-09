import chickConniction from "./DataBase/chickConniction.js"
import { globleErorrHandeler } from "./middleware/globelErorrHandeling.js"
import messageRouter  from "./module/message.mod/message.controller.js"
import userRouter from "./module/user.mod/user.controller.js"



const bootStrap=(app,express)=>{
    chickConniction()
    
    app.use(express.json())

    app.use('/sarahaUploads',express.static('sarahaUploads'))
app.use('/user',userRouter)
app.use('/message',messageRouter)


app.use(globleErorrHandeler)
}


export default bootStrap