const bodyParser = require("body-parser");
const express=require("express")
const mongoose =require("mongoose");
var qr = require('qr-image');
const app=express();
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey:"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",
});
const openai = new OpenAIApi(configuration);
mongoose.connect("mongodb://127.0.0.1:27017/Vruksh",{
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).catch((err) => {
    console.log("Error connecting to database", err);
    
});
const axios = require('axios');
const reccomendplant={
    plant:String,
    description:String,
    procedure:String,
    duration:String,
    type:String,
    image:String,

}
const plant=mongoose.model("plant",reccomendplant);
 
app.post("/generate",async(req,res)=>{
    let name=req.body.name;
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: generatePrompt(),
        temperature: 1,
        max_tokens:50
      });
      console.log(completion.data.choices[0].text);
    //   client.sendMessage(message.from, completion.data.choices[0].text);
    function generatePrompt() {
    const my=`Generate Description,procedure,suitable wheather for ${name} plant in proper format and separate paragraph `
      return `${my}`;
    }
var qr_svg = qr.image('Potato fruits are a succulent but inedible spherical, yellow-green berry, up to 4cm across', { type: 'svg' });
qr_svg.pipe(require('fs').createWriteStream(`${name}.svg`));
 
var svg_string = qr.imageSync('Potato fruits are a succulent but inedible spherical, yellow-green berry, up to 4cm across', { type: 'svg' });
})
 

app.post("/feed",async (req,res)=>{
    const data=req.body
    const info=new plant({...data});
    const result=await info.save();
    res.json(result)
})

app.post("/plants",async(req,res)=>{
    let type=req.body.type;
    const data=await plant.find({type:type});
    res.json(data);
})
app.post("/temp",(req,res)=>{
    const params = {
        access_key: 'e3433d4820d59af4ea1b67a9abc782af',
        query: 'New York'
      }
      
      axios.get('https://api.openweathermap.org/data/2.5/weather?lat=13.010632&lon=74.795183&appid=f301c3d4fc35f82ed1c5834e681248d9',)
        .then(response => {
          const apiResponse = response.data;
          // console.log(apiResponse);
          let result={
              humidity:apiResponse.main.humidity,
              temperature:Math.ceil(apiResponse.main.temp-273.15),
              weather:apiResponse.weather[0].main,
              ph:6.3,
              wind:apiResponse.wind.speed
          }
          console.log(result);
      
        }).catch(error => {
          console.log(error);
        });
      
})



app.listen(80,(req,res)=>{
    console.log('listening on');
})
