var express         = require('express');
var path            = require('path');
var config          = require('./libs/config');
var log             = require('./libs/log')(module);
var CatModel    = require('./libs/mongoose').CatModel;
var app = express();

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, "public")));

app.use(function(req, res, next){
    res.status(404);
    log.debug('Not found URL: %s',req.url);
    res.send({ error: 'Not found' });
    return;
});

app.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.error('Internal error(%d): %s',res.statusCode,err.message);
    res.send({ error: err.message });
    return;
});

app.get('/api', function (req, res) {
    res.send('API is running');
});

app.get('/api/cats', function(req, res) {
    console.log('I am here');
    return CatModel.find(function (err, cat) {
        if (!err) {
            return res.send(cat);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
});

app.post('/api/cats', function(req, res) {
    var cat = new CatModel({
        name: req.body.name,
        gender: req.body.gender,
        age: req.body.age,
        color: req.body.color,
        images: req.body.images
    });

    cat.save(function (err) {
        if (!err) {
            log.info("cat created");
            return res.send({ status: 'OK', cat:cat });
        } else {
            console.log(err);
            if(err.name == 'ValidationError') {
                res.statusCode = 400;
                res.send({ error: 'Validation error' });
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
            }
            log.error('Internal error(%d): %s',res.statusCode,err.message);
        }
    });
});

app.get('/api/cats/:id', function(req, res) {
    return CatModel.findById(req.params.id, function (err, cat) {
        if(!cat) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        if (!err) {
            return res.send({ status: 'OK', cat:cat });
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
});

app.put('/api/cats/:id', function (req, res){
    return CatModel.findById(req.params.id, function (err, cat) {
        if(!cat) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        cat.name = req.body.name;
        cat.gender = req.body.gender;
        cat.age = req.body.age;
        cat.color = req.body.color;
        cat.images = req.body.images;
        return cat.save(function (err) {
            if (!err) {
                log.info("cat updated");
                return res.send({ status: 'OK', cat:cat });
            } else {
                if(err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({ error: 'Validation error' });
                } else {
                    res.statusCode = 500;
                    res.send({ error: 'Server error' });
                }
                log.error('Internal error(%d): %s',res.statusCode,err.message);
            }
        });
    });
});

app.delete('/api/cats/:id', function (req, res){
    return CatModel.findById(req.params.id, function (err, cat) {
        if(!cat) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return cat.remove(function (err) {
            if (!err) {
                log.info("cat removed");
                return res.send({ status: 'OK' });
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s',res.statusCode,err.message);
                return res.send({ error: 'Server error' });
            }
        });
    });
});

app.get('/ErrorExample', function(req, res, next){
    next(new Error('Random error!'));
});

app.listen(config.get('port'), function(){
    log.info('Express server listening on port ' + config.get('port'));
});