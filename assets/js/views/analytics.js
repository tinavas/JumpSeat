"use strict";

/**
 *  Start the analytics app
 */
require([ 'api/users', 'lib/charts', 'utils/semantic-dropdown'], function() {

	Chart.defaults.global = {

			// Boolean - Whether to animate the chart
			animation: true,

			// Number - Number of animation steps
			animationSteps: 20,

			// String - Animation easing effect
			animationEasing: "swing",

			// Boolean - If we should show the scale at all
			showScale: true,

			// Boolean - If we want to override with a hard coded scale
			scaleOverride: false,

			// String - Colour of the scale line
			scaleLineColor: "rgba(0,0,0,.15)",

			// Number - Pixel width of the scale line
			scaleLineWidth: 1,

			// Boolean - Whether to show labels on the scale
			scaleShowLabels: true,

			// Interpolated JS string - can access value
			scaleLabel: "<%=value %>",

			// Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
			scaleIntegersOnly: true,

			// Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
			scaleBeginAtZero: false,

			// String - Scale label font declaration for the scale label
			scaleFontFamily: "'Source Sans Pro'",

			// Number - Scale label font size in pixels
			scaleFontSize: 15,

			// String - Scale label font weight style
			scaleFontStyle: "400",

			// String - Scale label font colour
			scaleFontColor: "#25303f",

			// Boolean - whether or not the chart should be responsive and resize when the browser does.
			responsive: true,

			// Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
			maintainAspectRatio: false,

			// Boolean - Determines whether to draw tooltips on the canvas or not
			showTooltips: true,

			// Function - Determines whether to execute the customTooltips function instead of drawing the built in tooltips (See [Advanced - External Tooltips](#advanced-usage-custom-tooltips))
			customTooltips: false,

			// Array - Array of string names to attach tooltip events
			tooltipEvents: ["mousemove", "touchstart", "touchmove"],

			// String - Tooltip background colour
			tooltipFillColor: "#25303f",

			// String - Tooltip label font declaration for the scale label
			tooltipFontFamily: "'Source Sans Pro'",

			// Number - Tooltip label font size in pixels
			tooltipFontSize: 15,

			// String - Tooltip font weight style
			tooltipFontStyle: "normal",

			// String - Tooltip label font colour
			tooltipFontColor: "#fff",

			// String - Tooltip title font declaration for the scale label
			tooltipTitleFontFamily: "'Source Sans Pro'",

			// Number - Tooltip title font size in pixels
			tooltipTitleFontSize: 14,

			// String - Tooltip title font weight style
			tooltipTitleFontStyle: "bold",

			// String - Tooltip title font colour
			tooltipTitleFontColor: "#fff",

			// Number - pixel width of padding around tooltip text
			tooltipYPadding: 10,

			// Number - pixel width of padding around tooltip text
			tooltipXPadding: 10,

			// Number - Size of the caret on the tooltip
			tooltipCaretSize: 8,

			// Number - Pixel radius of the tooltip border
			tooltipCornerRadius: 6,

			// Number - Pixel offset from point x to tooltip edge
			tooltipXOffset: 20,

			// String - Template string for single tooltips
			tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",

			// String - Template string for multiple tooltips
			multiTooltipTemplate: "<%= value %>",

			// Function - Will fire on animation progression.
			onAnimationProgress: function(){},

			// Function - Will fire on animation completion.
			onAnimationComplete: function(){}
		}

	/**
	 * @class Analytics
	 * Start admin namespace
	 */
	var Analytics = {

		/**
		 *  Initialize
		 */
		init : function(){
			Analytics.view.setEvents();
			Analytics.view.renderChart1();
		}
	};


	/**
	 *  @namespace Analytics
	 *  @class Analytics.model
	 *  Model for Analytics Object
	 */
	Analytics.model = {

		url : "api/analytics",

		/**
		 *  Get taken vs completed
		 */
		getChart1 : function(callback){
			var self = this;
			Aero.send(Analytics.model.url + '/completed_started', {}, function(r){
				callback(self.etl1(r));
			}, "GET");
		},

		/**
		 *  Get times taken
		 */
		getChart2 : function(callback){
			var self = this;
			Aero.send(Analytics.model.url + '/times_taken', {}, function(r){
				callback(self.etl2(r));
			}, "GET");
		},

		/**
		 * Convert stats into wonky Chartjs format
		 */
		etl1: function(data){

			var results = {
				labels: [],
				datasets: [ { data: [] }, { data: [] } ]
			};

			for (var i = 0; i < data.length; i++) {
				results.labels.push(data[i]['title']);
				results.datasets[0].data.push(data[i].stats.started);
				results.datasets[1].data.push(data[i].stats.completed);

				results.datasets[0].fillColor = "rgb(214,225,229)";
				results.datasets[0].strokeColor = "rgb(168, 184, 190)";

				results.datasets[1].fillColor = "rgba(76, 215, 204, 1)";
				results.datasets[1].strokeColor = "rgba(49, 168, 159, 1)";
			}

			return results;
		},

		/**
		 * Convert stats into wonky Chartjs format
		 */
		etl2: function(data){

			var results = {
				labels: [],
				datasets: [ { data: [] } ]
			};

			for (var i = 0; i < data.length; i++) {
				results.labels.push(data[i]['title']);
				results.datasets[0].data.push(data[i].stats.started);

				results.datasets[0].fillColor = "rgb(214,225,229)";
				results.datasets[0].strokeColor = "rgb(168, 184, 190)";
				results.datasets[0].highlightFill = "rgba(49, 168, 159, 1)";
				results.datasets[0].highlightStroke = "rgba(49, 168, 159, 1)";
			}
			return results;
		}
	};

	/**
	 *  @namespace Analytics
	 *  @class Analytics.view
	 *  UX Views and Event Handlers
	 */
	Analytics.view = {

		/**
		 *  Completed vs Incompleted chart
		 */
		renderChart1 : function(){
			Analytics.model.getChart1(function(data){
				var ctx = document.getElementById("chart-1").getContext("2d");
				new Chart(ctx).Line(data);
			});
		},

		/**
		 *  Times taken
		 */
		renderChart2 : function(){
			Analytics.model.getChart2(function(data){
				var ctx = document.getElementById("chart-2").getContext("2d");
				new Chart(ctx).Bar(data);
			});
		},

		/**
		 *  Setup all event triggers
		 */
		setEvents : function(){

			var self = this;

			//On chart two tab click
			$q('a[href=#panel2]').on('click', function(){
				if(!$q(this).data('rendered')){


					User.api.get(function(r){

						$q.each(r, function(a,b){
							$q('select[name="user_list"]').append('<option value="'+ b.email+'">'+ b.email +'</option>');
						});
					});
					//self.renderChart2();
					//$q(this).data('rendered', true);

				}
			});
		}
	};

	$q(function(){
		Analytics.init();

		$q('.ui.dropdown')
			.dropdown()
		;
	});

});
