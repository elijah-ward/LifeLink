exports.index = function(req,res){
	res.render('index');
};

exports.templates = function(req,res){
	var temp = req.params.temp;
	res.render('templates/'+temp);
};