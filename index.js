const helmet = require("helmet")
const express = require("express")
const app = express()
const sender = require("./email")

app.use(express.json)

app.use(helmet())

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// CORS 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/", (req,res) => {
    console.log("Request received")
    return res.send("Email Sender Running")
})

app.post("/send", async(req,res) => {
    if (!validateParams(req.params)) return res.send("Parametros invalidos")
    
    const emailResponse = await sender.sendEmail(req.params)
    
    if (emailResponse) return res.send("Erro ao enviar mensagem")

    res.send("Mensagem enviada com sucesso!")
})

function validateParams(params) {
    let isValid = true
    const keys = Object.keys(params)
    keys.forEach((key)=>{
        obj = params[key]
        if (
            typeof obj !== "string" ||
            obj.length < 4    
        ) { isValid = false }
    })

    if (
        keys.length > 5 ||
        params.to === undefined ||
        params.from === undefined ||
        params.message === undefined
    ) { isValid = false }

    return isValid
}

const port = process.env.PORT || 3000
app.listen(port, () => { console.log(`App running on port ${port}`) })