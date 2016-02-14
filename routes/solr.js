'use strict';

var express = require('express'),
		router = express.Router(),
		Collect = {};

function transformChart(data){
	var array_exit = [],
			object_exit = {};

	data.forEach(function(item){
		if(object_exit[item.sensor.description] === undefined) object_exit[item.sensor.description] = [];
		object_exit[item.sensor.description].push([new Date(item.created_at).getTime(), parseFloat(item.value)]);
	});

	for(var index in object_exit) {
		array_exit.push({
			name: index,
			data: object_exit[index]
		});
	}

	return array_exit;
};

router.post('/', function(req, res, next) {
	var perpage = 5000,
			exit = {},
			page = Math.max(0, req.body.page),
			filter = {},
			or_sensor = [];

	req.body.sensors.forEach(function(item){
		or_sensor.push({ 'sensor': item });
	});

	filter['$or'] = or_sensor;

	if(req.body.greenhouse) filter['greenhouse'] = req.body.greenhouse;

	Collect.find(filter).limit(perpage).skip(perpage * page).populate('sensor upload').exec(function(err, data) {
    if (err) throw console.log({ error: true, message: 'Collect: error.', data: err });
    if(req.body.chart === true){
    	res.send({ error: false, message: 'Collect: success.', data: transformChart(data) });
    }else{
    	Collect.count(filter).exec(function(err, count) {
	    	exit.data = data;
		    exit.page = page;
		    exit.pages = Math.round(count / perpage);
		  	res.send({ error: false, message: 'Collect: success.', data: exit });
	    });
    }
  });
});

module.exports = router;