module.exports = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin,Content-type,Accept,X-Requested-With,Authorization,X-Access-Token,X-Key');

    if (req.method === 'OPTIONS')
        res.send(200);
    else
        next();
};