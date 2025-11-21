import express from "express";
import cors from "cors";
import {supabase} from './supabaseClient.js'
const app = express() // instancia del servidor
app.use(express.json()) //Casting de JSON a Objeto JS

//* CONFIGURACION POSIBLES DE CORS
app.use(cors()) 

const PORT = 3001
//TODO: CREAR LA TABLA DE LOGS EN SUPABASE
//TODO: npm install ejs
// Para logging general, usa app.use() para intercepta todas las peticiones 
// sin importar la ruta ni el método.
// No app.post(), porque ese se usa para definir una ruta específica y responder 
// a peticiones POST, no para interceptar todas las solicitudes.
//* 2. ************** Middleware para registrar logs en Supabase
app.use(async (req, res, next) => {
  //& Prepara el obj log, con la data que nos inbterese loggear
  const log = {
    fecha: new Date().toISOString(),
    ip: req.ip,
    metodo: req.method,
    ruta: req.originalUrl,
    origen: req.headers.origin || 'directo',
    user_agent: req.headers['user-agent'] || '',
  };
  //& Guarda el log en Supabase
  try {
    await supabase.from('logs').insert([log]);
    //& Muestra en consola (para Render)
    console.log(`[LOG] ${log.fecha} - ${log.metodo} ${log.ruta} desde ${log.origen} (${log.ip}) UA:${log.user_agent}`);
  
  } catch (error) {
        console.error('Error guardando log en Supabase:', error);//& Solo log(), No detenemos la petición si falla el log
    }
  next();
});

//******************** Ruta para ver logs (protégela en producción)
app.get("/logs", async (req, res) => {
  const { data, error } = await supabase.from("logs").select("*")
  .order("fecha", { ascending: false }).limit(100);

  if (error) {
    console.error("Error al obtener logs:", error);
    return res.status(500).json({ error: "Error al obtener logs" });
  }
  
  res.json(data);
});

//* 3. Configura EJS en tu app Express
// Agrega esto al inicio de tu archivo principal (antes de las rutas):
app.set('view engine', 'ejs');
app.set('views', './views'); // Carpeta donde pondrás tus templates

//*4. Crea la ruta en Express usando el template
app.get('/logtabla', async (req, res) => {
  const { data: logs, error } = await supabase
    .from('logs')
    .select('*')
    .order('fecha', { ascending: false })
    .limit(100);

  if (error) return res.status(500).send('Error al obtener logs');

  res.render('logtabla', { logs }); // Renderiza el template y pasa los logs
});





























class HttpError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

//*GET DE TODOS LOS USUARIOS
app.get("/usuarios", async (req, res, next) =>{
    try {
        const {data, error} = await supabase.from('usuarios').select('*')
        if(error) throw new HttpError('Error al obtener los usuarios, en el Backend!', 500)
         res.json(data) 
    } catch (error) {
        next(error)
    }
}) 

//*GET/ID DE UN SOLO USUARIO
app.get("/usuarios/:id", async (req, res, next) =>{
    try {
        const id = req.params.id
        const {data, error} = await supabase.from('usuarios').select('*').eq('id', id).single()
        if(error) throw new HttpError('Error al obtener el usuario, en el Backend!', 500)
         res.json(data) 
    } catch (error) {
        next(error)
    }
}) 


app.put("/usuarios/:id", async (req, res, next) =>{})


app.get("/inicio", (req, res) =>{
//  req.body == {} JSON → obj js
    res.send(`<h1 style="text-align:center; color:blue;"> 🚀🤸🏽‍♂️Hola desde el /inicio 🤸🏽🚀</h1>`)
}) 

//* LA RUTA DE ERROR 404  
app.use((req, res) =>{
//  req.body == {} JSON → obj js
    res.status(404).send(`<h1 style="text-align:center; color:red;">ERROR 404</h1>`)
}) 
app.listen(PORT, console.log('Corriendo 🚀'))