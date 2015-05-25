var GUIDES = {

	id : "",

	post : function(){
		var self = this;
		var guide = {
			"id": "001",
			"title": "Test 3",
			"desc": "Description of the guide",
			"step": [
				{ "title": "Step 0", "body": "0 hover", "loc": "a:eq(0)", "position": "right", "nav": {"hover": 1 } },
				{ "title": "Step 1", "body": "1 click", "loc": "a:eq(1)", "position": "top", "nav": {"click": 2} },
				{ "title": "Step 2", "body": "2 next", "loc": "a:eq(2)", "position": "left" },
				{ "title": "Step 3", "body": "3 click", "loc": "a:eq(3)", "position": "bottom", "noNav": true, "nav" : {"click": 4} },
				{ "title": "Step 4", "body": "4 blur or click", "loc": "input:eq(0)", "nav": {"blur": 2, "click": 5} },
				{ "title": "Step 5", "body": "5", "loc": "a:eq(4)" }
			]
		};

		Aero.guide.create(guide, function(r){
			self.id = r;
		});
	},

	put : function(){
		var guide = {
				"id": this.id,
				"title": "A New Mike",
				"desc": "Description of the guide",
				"step": [
					{ "title": "Step 0", "body": "HOVER: This is step 0", "loc": "a:eq(0)", "position": "right", "nav": {"hover": 1, "observe": true } },
					{ "title": "Step 1", "body": "Click Step 1", "loc": "a:eq(1)", "position": "top", "nav": {"click": 1} },
					{ "title": "Step 2", "body": "Click NEXT", "loc": "a:eq(2)", "position": "left" },
					{ "title": "Step 3", "body": "NO NAV | CLICK: This is step 3", "loc": "a:eq(3)", "position": "bottom", "noNav": true, "nav" : {"click": 4} },
					{ "title": "Step 4", "body": "Press tab or hit enter key to go to step 2. Click me to go to step 5", "loc": "input:eq(0)", "nav": {"blur": 2, "click": 5} },
					{ "title": "Step 5", "body": "This is step 4", "loc": "a:eq(4)", "alert":"ALERT: Missing step", "alertContent": "Because its hidden" }
				]
		};
		Aero.guide.update(guide);
	},

	postStep : function(){

		var step = {"title":"NOPE","body":"New tip","loc":"input:eq(1)","position":"top"};
		Aero.step.add(step);
	},

	del : function(){
		Aero.guide.destroy(this.id);
	}
};