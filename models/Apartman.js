var mongoose = require("mongoose");

var ApartmanSchema = new mongoose.Schema({

	title:
	{
		type:String,
		required:true
	},


	start:
	{
		type:String,
		required:true
	},
	end:
	{
		type:String,
		required:true

	},
	apartmanID:
	{
		type:Number,
		required:true
	},
	borderColor:
	{
		type:String,
		required:true
	},
	color:
	{
		type:String,
		required:true
	}


},{collection: 'apartman'});

var movie = mongoose.model('apartman', ApartmanSchema,'apartman');

module.exports = movie;