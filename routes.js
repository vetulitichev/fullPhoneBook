class GetPostRequestManage{
    constructor(){
        this.mongoose = require('mongoose');
        this.dbUri = 'mongodb://vet:123@ds153699.mlab.com:53699/codesterrra';
        this.mongoOptions = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
            replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };
    }
    initSchema(){
        this.userSchema = this.mongoose.Schema({
            email:String,
            firstName:String,
            lastName:String,
            password:String,
        });
        this.model = this.mongoose.model('User',this.userSchema);
    }
    createConnection(){
        this.mongoose.connect(this.dbUri, this.mongoOptions);
        this.connection = this.mongoose.connection;
        this.connection.on('error', console.error.bind(console, 'connection error:'));
        this.connection.once('open', function() {
            console.log('connected');
        });
    }
}
const manage = new GetPostRequestManage();

let verifying = (app)=>{
    app.get('/users', function (req, res) {
        manage.model.find((err,users)=>{
            res.send(JSON.stringify(users))
        });
    });
    app.post('/users', function (req, res) {
        let newUser ;
        let flag;
        req.on('data', (data) =>{
            newUser = JSON.parse(data);
        });
        req.on('end', function () {
            manage.model.findOne({email: newUser.email}, (err, person) => {
                flag = person;
                if(person == null) {
                    manage.model.create({
                        email: newUser.email,
                        firstName: newUser.firstName,
                        lastName: newUser.lastName,
                        password: newUser.password
                    }, (err, user) => {
                        if (err) res.end(handleError(err));
                        else {
                            res.end(JSON.stringify(user))
                        }
                    });
                }else {
                    res.end(JSON.stringify({err:'user already exist'}))
                }
            });
        });
    });
};
let authentication = (app)=>{
    app.post('/authentication', function (req, res) {
        let newUser ;
        req.on('data', (data) =>{
            newUser = JSON.parse(data);
            // user.addUserToDb(newUser);
        });
        req.on('end', function () {
            manage.model.findOne({email:newUser.email,password:newUser.password},(err,person)=>{
                console.log('POSTed: ' + person);
                res.end(JSON.stringify(person));
            });
            res.writeHead(200);
        });
    });
};

module.exports = (app)=>{
    manage.createConnection();
    manage.initSchema();
    verifying(app);
    authentication(app);
    app.get('/', function(req, res){
        res.render('index', {
            title: 'index.html'
        });
    });
    app.get('/main',function (req,res) {
        res.render('main',{
            title: 'main.html'
        })
    })

};