"use strict";

/**
 * ToolTip Object
 * @author Mike Priest
 * @type {{options: {labels: {end: *, next: *, prev: *}, template: Function}, setGuide: Function, setStep: Function, redirect: Function, start: Function, stop: Function, next: Function, prev: Function, jumpTo: Function, findStep: Function, findStepTimeout: Function, observe: Function, beforeShow: Function, show: Function, hide: Function, buildNav: Function, setPosition: Function, containIn: Function, scrollToElement: Function, isReturnBranch: Function, renderBranch: Function, renderException: Function, setNav: Function, sayCongrats: Function, setEvents: Function}}
 */
Aero.tip = {

	/**
	 *  Default settings
	 */
	options : {

        //Multilingual
		labels: {
			end: AeroStep.lang['finished'],
			next: AeroStep.lang['next'],
			prev: AeroStep.lang['prev']
		},

		template: function(step){
			var size = "",
				title = "",
				quiz = "",
                media = "";
			var pos = step.position ? step.position : "top";
			var now = parseInt(Aero.tip._current) + 1;
			var total = (Aero.tip._guide) ? Aero.tip._guide.step.length : 0;
			var pec = (now / total) * 100;

			if(isNaN(step.size)){
				size = (step.size && step.size != "") ? " aero-tip-"+step.size : "";
			}else{
				size = "' style='width:"+step.size+"px'";
			}

			if(step.showTitle) title = '<div class="aero-tip-title">'+step.title+'</div>';
			var progress = step.multi ? "" : "<div class='aero-tip-nav clearfix'><div class='aero-progress'><span>" + now +" of "+total+"</span><span class='aero-needle'><span style='width:"+pec+"%'></span></span></div></div>";

			//Clear progress on contextual tips
			if(!Aero.tip._guide) progress = "";

			//Does it have a Quiz?
			if(step.answers && step.answers.length > 0){
				quiz = Aero.view.quiz.render(step.answers, step.quizsize);
			}

			//Does it have media?
            if(step.embed || step.youtube){
                media = Aero.view.media.render(step);
            }

			return "<div id='"+step.id +"' class='aero-tip aero-tip-"+pos+size+"' style='display:none'>" +
                    "<div class='aero-tip-arrow'></div>" +
					"<div class='aero-tip-body'>"+title+step.body+quiz+media+"</div>" +
                    progress +
                    "<div class='aero-tip-draggable'></div>" +
	    	  "</div>";
		}
	},

    /**
     * Create Spotlight Effect
     * @param step
     * @todo complete spotlight feature
     */
    spotlight : function($tip, step){
        return;

        var $el, $tpl, sWidth, sHeight, offSet;

        //Append Relative CSS
        $el = $q(step.loc);
        $el.addClass('ae-showElement ae-relativePosition');

        //Add minus padding 10
        sWidth = $el.outerWidth() + 10;
        sHeight = $el.outerHeight() + 10;
        offSet = $el.offset();

        //Append Overlay
        $tpl = $q('<div class="aero-remove ae-overlay" style="top: 0;bottom: 0; left: 0;right: 0;position: fixed;opacity: 0.8;"></div>');
        $q('body').append($tpl);

        //Append Spotlight
        $tpl = $q('<div />')
                .addClass('aero-remove ae-helperLayer')
                .css({
                width : sWidth,
                height : sHeight,
                top : offSet.top - 5,
                left: offSet.left - 5
            });
        $q('body').append($tpl);
    },

	/**
	 * @function Get step data
	 * @param {integer} id unique guide id
     * @returns {object} guide object
	 */
	setGuide : function(id, callback, force){

		var self = this;
			self._guide = false;

        aeroStorage.getItem('aero:session', function(ls){

            if(ls && !force) {

                //Start from session
                self._guide = JSON.parse(ls);
                Aero.view.step.render(self._guide);
                if(callback) callback();
            }else{

                //Start without session
                Aero.model.guide.byId(id, function (guide) {

                    //Set current
                    self._guide = guide;

                    //Set cookie
                    Aero.view.step.render(self._guide);

                    aeroStorage.setItem('aero:session', JSON.stringify(self._guide), function () {
                        if (callback) callback();
                    }, true);
                });
            }
        }, true);
	},

	/**
	 *  @function Set current step once shown
	 *  @param {Number} i index to set
	 */
	setStep : function(i, skipStore, callback) {
		this._current = i;
		if(!skipStore) {
            aeroStorage.setItem('aero:session:current', i, function () {
                if (callback) callback();
            }, true);
        }else{
            if (callback) callback();
        }
	},

	/**
	 *  @function Redirect to correct page if needed
	 *  @param {string} url for step
	 */
	redirect : function(url, ignore, cds) {

		//Trailing hash
        var self = this;
		var skipTrim = false;
		var an = /#$/;
		var sl = /\/$/;
		var curUrl = document.URL;
        var cdsEnabled = false;

        //If cross domain
        var myHost = (cdsEnabled || aeroStorage.override) ? Aero.host : location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
        var full = cds ? cds : myHost;

		if(url == "/#/") skipTrim = true;
		if(!url) url = "";
        url = full + url;

		if(!skipTrim){
			//Remove trailing empty hash
			if(an.test(curUrl)) curUrl = curUrl.replace("#", "");
			if(sl.test(curUrl)) curUrl = curUrl.slice(0,-1);
		}

		//Replace
		url = AeroStep.getSubURL(url);

		if(ignore == "all") return false;

		if(ignore == "par"){
			curUrl = curUrl.split('?')[0];
			url = url.split('?')[0];
		}

		if(ignore == "anc"){
			curUrl = curUrl.split('#')[0];
			url = url.split('#')[0];
		}

		if(curUrl != url){
			var tried = aeroStorage.getItem('aero:session:404');
			var tries = (tried) ? (parseInt(tried) + 1) : 0;

			aeroStorage.setItem('aero:session:404', tries);

			if(tries > 1){
				Aero.confirm({
					ok : AeroStep.lang['done'],
					title : AeroStep.lang['notfound'],
					msg : AeroStep.lang['urlloop'] + "</br></br><strong>" + url + "</strong>",
					onConfirm : function(){
						Aero.tip.stop();
					},
                    onClose : function(){
                        Aero.view.step.setState(aeroStorage.getItem('aero:session:pause'), 'forward');
                    }
				});
			}else{
                //First step, just take me there
                if(Aero.forceTakeme || Aero.navigating || Aero.tip._current == 0){
                    Aero.navigating = false;
                    window.location = url;

                    return true;
                }

                //Not the first step, choose where you go
				Aero.confirm({
					ok : AeroStep.lang['oopst'],
                    cancel : AeroStep.lang['oopsm'],
					title : AeroStep.lang['oops'],
					msg : AeroStep.lang['oopsdesc'],
					onConfirm : function(){
						window.location = url;
					},
                    onCancel : function(){
                        Aero.forceTakeme = true;
                        var i = Aero.tip._current - 1;

                        self.setStep(i, false, function() {
                            Aero.tip.jumpTo(i);
                        });
                    },
                    onClose : function(){
                        Aero.view.step.setState(aeroStorage.getItem('aero:session:pause'), 'forward');
                    }
				});
			}
			return true;
		}

		return false;
	},

    /**
     *  @function Validate if the user can move on
     */
    validate : function(){

        var valid = true;

        //Check for Quiz
        var step = Aero.step.get(this._current);
        if(step.answers && step.answers.length > 0) valid = Aero.view.quiz.validate(step);

        return valid;
    },

	/**
	 * @function Start a guide
     * @param {string} id unique guide id
     * @returns {void}
	 */
	start : function(id, step, force){
		var s = step ? step : 0;
        var self = this;

        //Cross Domain
        aeroStorage.getItem('aero:session:cds', function(cds){

            if(!cds) {
                //Cross Domain
                aeroStorage.setItem('aero:session:cds', Aero.host, function () {
                }, true);
            }else{
                Aero.host = cds;
            }

            self._forward = true;
            self.setGuide(id, function() {
                Aero.audit.init(function(){
                    self.setNav();

                    //Remove restrictions
                    $q('.aero-restrict').remove();

                    //Start the tips!
                    self.beforeShow(s);
                });
            }, force);
        }, true);
	},

	/**
	 * @function Stop the guide
     * @returns {void}
	 */
	stop : function(){

        //Validate
        if(!this.validate()) return;

        // @todo clear on restrict and auto only
        aeroStorage.setItem('aero:cache', 0);

		//Return to branch?
		var isReturn = this.isReturnBranch();

		if(!isReturn){
			//Last step end?
			if(Aero.tip._guide.step && Aero.tip._current == (Aero.tip._guide.step.length - 1)) this.sayCongrats();

			this.setStep(null);
			this.hide(this._current);
			clearInterval(this.ob);
			Aero.tip._guide = null;

			//Clear session
			AeroStep.session.destroy();
			Aero.guide.init();
		}
	},

	/**
	 * @function Move to next step
     * @returns {void}
	 */
	next : function(){

        //Validate
        if(!this.validate()) return;

		var step = Aero.step.get(this._current);

		this._forward = true;
		clearInterval(this.ob);

		aeroStorage.removeItem('aero:session:pause');

		if(step.next != -1){
			this.hide(this._current);
			this.beforeShow(step.next);
		}
	},

	/**
	 * @function Move to previous step
     * @returns {void}
	 */
	prev : function(){
		var step = Aero.step.get(this._current);
		this._forward = false;
		clearInterval(this.ob);

		aeroStorage.removeItem('aero:session:pause');

		if(step.prev != -1){
			this.hide(this._current);
			this.beforeShow(step.prev);
		}
	},

	/**
	 * @function Jump to specific step
     * @param {integer} i Step number
     * @returns {void}
	 */
	jumpTo : function(i){

        var step = Aero.step.get(i);
		this._forward = true;
		clearInterval(this.ob);
		Aero.jump = true;

		aeroStorage.removeItem('aero:session:pause');

		if(step){
			this.hide(this._current);
			this.beforeShow(i);
		}
	},

	/**
	 * @function Find step element
     * @param {string} Locator path
     * @returns {object} element
	 */
	findStep : function(step){

		var $el = false;

        //Default orphan to body
		if(step.position == "orphan") step.loc = "body";

		if(step.loc){
			$el = step.isFrame ? $q(step.framePath).contents().find(step.loc) : $q(step.loc);

			if($el.length === 0 || !$el.is(":visible") || $el.css("visibility") == "hidden")
				$el = false;
		}

		return $el;
	},

	/**
	 * @function Look for step until timeout
     * @param {integer} Seconds until timeout
     * @returns {void}
	 */
	findStepTimeout : function(time, i){
		var self = this;
		if(Aero.hashChange) return;
        clearTimeout(Aero.timeFindStep);

        if($q('.aero-modal:visible').length > 0){
            return;
        }

		if(self.tries < time * 2){
			Aero.timeFindStep = setTimeout(function(){
				self.hide(i - 1);
				self.show(i);
				self.tries++;
			}, 500);
		}else{
            //Finished Trying
            var step = Aero.step.get(i);
            Aero.view.step.setState(i, "missing");

            if(step.miss == "alert"){
                this.renderException(step.alert, step.alertContent, true);
            }
            else if(step.miss == "back"){
                Aero.view.step.setState(i, "missing");
                this.prev();
            }
            else if(step.miss == "skip"){
                self.show(i + 1);
            }
            else if(step.miss == "skipto"){
                self.jumpTo(step.skipto);

                for(var i = Aero.tip._current; i <= step.skipto - 1; i++){
                    Aero.view.step.setState(i, "missing");
                }
            }else {
                this.renderException("Step is Missing", "Sorry, we can't find that step - to fix this try: <ul><li>Using a more generic element</li><li>Use 'next item visible' for the navigation on your previous step</li><li>Increase the wait timer for finding this step</li></ul>", true);
            }
		}
	},


	/**
	 * @function Observe element to progress
     * @param {object} $el Element to watch
     * @param {integer} i Step index
     * @returns {void}
	 */
	observe : function(i, isFound, callback){
		var self = this;
    	var step = Aero.step.get(i);

        clearInterval(self.ob);
		self.ob = setInterval(function(){
			Aero.log("Observing for item visible: " + isFound, "info");

            //Found the step?
			var found = self.findStep(step);

            //If found and callback on waiting
			if (isFound && found) {
                Aero.log("Observe found item", "info");
                callback();
                clearInterval(self.ob);
			}

            //If found and callback on missing
            if(!isFound && !found) {
                //Wait for next step to be set
                setTimeout(function(){
                    //Don't do anything for steps in transition
                    if(Aero.navigating) {
                        Aero.navigating = false;
                        clearInterval(self.ob);
                        return;
                    }

                    Aero.log("Observe lost item", "info");
                    callback();
                    clearInterval(self.ob);
                }, 500);
			}
		}, 500);
	},

	/**
	 * @function Before showing a step
     * @param {integer} i Step number
     * @returns {void}
	 */
	beforeShow : function(i){
		var self = this;
			self.tries = 1;

        //Get Step Info
        var step = Aero.step.get(i);

        //Default wait
		var wait = 200;
		var before = (this._forward) ? step.beforeCode : this._guide.step[i].beforeCode;
		if(step.pause) wait = parseInt(step.pause) * 1000;

        //Fire custom code
		if(before){
			try {
				eval(before);
			}catch(err){
				Aero.log('Before show code is broken: ' + err,'error');
			}
		}

        //Call Show Step
        clearTimeout(Aero.timeBeforeShow);
		Aero.timeBeforeShow = setTimeout(function(){
			if(!Aero.hashChange) self.show(i);
		}, wait);
	},

	/**
	 * @function Show a step
     * @param {integer} i Step number
     * @returns {void}
	 */
	show : function(i, skipStore){
		var $tip, $el, step, self;

        self = this;

        //Stop trying
        clearTimeout(Aero.timeFindStep);

        //Empty guide
        if (Aero.tip._guide.step.length == 0) return;

        //Default current step
        if (typeof i == "undefined") i = self._current;
        if (!Aero.tip._guide || i > Aero.tip._guide.step.length || i < 0) return;
        aeroStorage.setItem("aero:session:forward", true);

        //Get step data
        step = Aero.step.get(i);

        //Set the step and go for it
        self.setStep(i, skipStore, function() {

            //Close sidebar?
            if (step.sidebar) {
                //Timeout required for bug
                setTimeout("Aero.view.sidebar.hide();", 100);
            } else {
                aeroStorage.getItem('aero:sidebar:open', function (s) {
                    if (!$q('.aero-sidebar').hasClass('open') && s == "1") Aero.view.sidebar.show();
                }, true);
            }

            //Go find the element step
            $el = self.findStep(step, i);

            //Check for redirect (admins don't need to)
            if (AeroStep.admin && aeroStorage.getItem('aero:session:pause') && aeroStorage.getItem('aero:session:forwardUrl') !== document.URL) {
                Aero.view.step.setState(aeroStorage.getItem('aero:session:pause'), 'forward');
                return;
            } else {
                if (self.redirect(step.url, step.noUrl, step.cds)) return;
            }

            //Clear 404 watcher
            aeroStorage.removeItem('aero:session:404');

            //Found element?
            if ($el && $el.is(':visible')) {
                Aero.log('Found Step ' + i, 'success');

                //Wait and see if it disappears
                Aero.tip.isMoving = null;
                self.observe(i, false, function(){
                    self.findStepTimeout(0, i);
                });

                //Add input mask
                if (step.mask && step.mask != "") $el.mask(step.mask);

                //Update audit
                Aero.audit.update();

                //Setup Cross Domain and Pause Guide
                if (AeroStep.admin) {
                    aeroStorage.setItem('aero:sidebar:cdshost', i + "~" + window.location.host, function () {}, true);
                    aeroStorage.setItem("aero:session:pause", i);
                    aeroStorage.setItem("aero:session:forwardUrl", document.URL);
                }

                //Get tip template
                $tip = $q(self.options.template(step));

                //Apply branch options
                if (step.branch) {
                    $tip = self.renderBranch($tip, step.branch, step.branchstep, step['return']);
                }

                //Build Navigation
                $tip = self.buildNav($tip, step);

                //Add Flag
                $q('.ae-active-el').removeClass('ae-active-el');
                $el.addClass('ae-active-el');

                //Draw
                $q('body').append($tip);
                Aero.view.step.setState(i);

                //// @todo finalize spotlight
                //if(true){
                //     self.spotlight($tip, step);
                //}
                self.setPosition($el, $tip, step.position);
                self.setEvents($el, step.nav, $tip, step.position);

                //Don't scroll orphans
                if(step.position != "orphan") {
                    self.scrollToElement($el);
                }else{
                    $q('.aero-tip').fadeIn(200);
                }
            } else {
                //Missing steps
                if (step.tries && step.tries > 0) {
                    self.findStepTimeout(step.tries, i);
                    return;
                }
                else {
                    if (!step.multi) {
                        clearTimeout(Aero.timeFindStep);

                        //Default skip
                        Aero.log('Skipping step: ' + i + ' with loc:' + step.loc, 'error');
                        Aero.view.step.setState(i, "missing");

                        if (i < Aero.tip._guide.step.length) {
                            if (self._forward) {
                                self.next();
                            } else {
                                self.prev();
                            }
                        }
                    }
                }
            }

            // @todo on page load try multi
            var d = (self._forward) ? 1 : -1;
            var isMulti = false;

            if (self._forward && Aero.step.get(i + d).multi || !self._forward && step.multi) isMulti = true;

            if (Aero.jump && step.multi) {
                isMulti = true;
                d = -1;
                self._forward = false;
            }

            if (isMulti) self.show(i + d, true);
            Aero.jump = null;
        });
	},

	/**
	 * @function Hide a step
     * @param {integer} Step number to hide
     * @returns {void}
	 */
	hide : function(i){
		var step = Aero.step.get(i);

        //Ignore missing steps
        if(!$q('.aero-tip:visible').length > 0) return;

		$q('.aero-active, .aero-showElement').removeClass('aero-active aero-showElement aero-relativePosition');
		$q('.aero-tip, .aero-remove').remove();

		if(step.afterCode){
			try {
				eval(step.afterCode);
			}catch(err){
				Aero.log('After hide code is broken: ' + err,'error');
			}
		}
	},

	/**
	 * @function Position tool-tip inline with element and within document
     * @param {integer} i Step number
     * @returns {void}
	 */
	buildNav : function($el, step){
		var nav = "";
		var skipNext = false;

		//Only show next on next nav
		if(!step.nav.next && !step.nav.blur) skipNext = true;
        if(step.nav.length == 0) skipNext = false;

		if(!step.noNav){
			if(step.next == -1) nav += "<a class='aero-btn-end'>"+this.options.labels.end+"</a>";
			if(!step.noNext && !skipNext && step.next != -1) nav += "<a class='aero-btn-next'>"+this.options.labels.next+"</a>";
			if(!step.noPrev && step.prev != -1) nav += "<a class='aero-btn-prev'>"+this.options.labels.prev+"</a>";
		}
		$el.find('.aero-tip-nav').append(nav);

		return $el;
	},

	/**
	 * @function Position tool-tip inline with element and within document
     * @param {integer} i Step number
     * @returns {void}
	 */
	setPosition : function($el, $tip, position){
		var pos = {};
		var off = $el.offset();
		var tipMidX = $tip.outerWidth() / 2;
		var tipMidY = $tip.outerHeight();
		var elMidX = off.left + ($el.outerWidth() / 2);
		var elMidY = off.top + ($el.outerHeight() / 2);
		var $tri = $tip.find('.aero-tip-arrow');

		pos.tLeft = tipMidX - ($tri.outerWidth() / 2);
		pos.tTop = ($tip.outerHeight() / 2) - ($tri.outerHeight() / 2);

		switch(position) {
		    case "top":
		    	pos.left = elMidX - tipMidX;
		    	pos.top = off.top - tipMidY - $tip.find('.aero-tip-arrow').outerHeight();
		        break;
		    case "bottom":
		    	pos.left = elMidX - tipMidX;
		    	pos.top = off.top + $el.outerHeight();
		        break;
		    case "left":
		    	pos.left = off.left - $tip.outerWidth() - $tip.find('.aero-tip-arrow').outerWidth();
		    	pos.top = elMidY - (tipMidY / 2);
		        break;
		    case "right":
		    	pos.left = off.left + $el.outerWidth();
		    	pos.top = elMidY - (tipMidY / 2);
		        break;
		    case "orphan":
		    	pos.left = $q(window).width() / 2 - tipMidX;
		    	pos.top = $q(window).height() / 2 - (tipMidY / 2);
		        break;
		}

		//Snap to window
		pos = this.containIn(document, $tip, pos, position);

		//Set triangle
		$q('.aero-tip-top, .aero-tip-bottom').each(function(){ $tri.css({ 'left' : pos.tLeft }); });
        $q('.aero-tip-left, .aero-tip-right').each(function(){ $tri.css({ 'top' : pos.tTop }); });
        $q('.aero-tip-top').each(function(){ $tri.css({ 'top' : 'auto' }); });

		$tip.css({ "left": pos.left, "top": pos.top });
	},

	/**
	 * @function Scroll tool-tip into view
     * @returns {void}
	 */
	containIn : function(container, $tip, pos, position){

		//Window
		var winH = $q(container).height();
		var winW = $q(window).width();
		var rightDiff = pos.left + $tip.outerWidth() - winW;
		var bottomDiff = pos.top + $tip.outerHeight() - winH;

		//Push right in
		if(rightDiff > 0){
			if(position == "bottom" || position == "top") pos.tLeft += rightDiff;
			pos.left -= rightDiff;
		}

		//Push left in
		if(pos.left < 0){
			if(position == "bottom" || position == "top") pos.tLeft += pos.left;
			pos.left -= pos.left;
		}

		//Push top in
		if(pos.top < 0){
			if(position == "left" || position == "right") pos.tTop += pos.top;
			pos.top -= pos.top;
		}

		//Push bottom up
		if(bottomDiff > 0 && position == "bottom"){
			if(position == "left" || position == "right") pos.tTop += bottomDiff;
			pos.top -= bottomDiff;
		}

		//Auto open or close sidebar
		var r = pos.left + $tip.outerWidth();

		if(r > (winW - 270)){
            //Need: Timing issue with cross domain ls
            aeroStorage.getItem('aero:sidebar:open', function(s){
                Aero.view.sidebar.hide();
            }, true);
		}else {
            aeroStorage.getItem('aero:sidebar:open', function(o){
                if(o == "1"){
                    Aero.view.sidebar.show();
                }
            }, true);

            //Center in free space
            if(position == "orphan") pos.left -= 115;
		}

		return pos;
	},

	/**
	 * @function Scroll tool-tip into view
     * @returns {void}
	 */
	scrollToElement : function($el){
		var $tip = $q('.aero-tip:eq(0)');

		$tip.show();
		if (!$el.visible()) {

            var $scrollParent = Aero.pos.isScrollable($el);

            //Check if $el is part of scrollable list
            if($scrollParent){
                $scrollParent.stop().animate({
                    scrollTop: $scrollParent.scrollTop() + $el.position().top - $scrollParent.height()/2 + $el.height()/2
                }, 1000, function () {
                    $q('.aero-tip').fadeIn(200);
                });
            }else{
                $q('body, html').stop().animate({
                    scrollTop: $tip.offset().top - ($q(window).height() / 2) + ($tip.height())
                }, 1000, function () {
                    $q('.aero-tip').fadeIn(200);
                });
            }
            $tip.hide();
		}else{
			$tip.hide();
			$q('.aero-tip').fadeIn(200);
		}

        $q('.aero-tip').fadeIn(200);
	},

	/**
	 *  Return back to branch
	 */
	isReturnBranch : function(){

		var id = aeroStorage.getItem('aero:session:branch:returnid');
		var to = aeroStorage.getItem('aero:session:branch:returnto');
		if(!id) return false;

		aeroStorage.removeItem('aero:session:branch:returnid');
		aeroStorage.removeItem('aero:session:branch:returnto');

		Aero.confirm({
			ok : "Return",
			cancel : "End Guide",
			title : "Branch complete",
			msg : "You have completed this branch, we will now move you back to the original guide.",
			onConfirm : function(){
				//Hide the current in case same page
				Aero.tip.hide();

				//Start return
				Aero.tip.start(id, parseInt(to), true);
			},
			onCancel : function(){
				Aero.tip.stop();
			}
		});

		return true;
	},

	/**
	 * @function Display branch options
     * @param {string} guideid
     * @returns {void}
	 */
	renderBranch : function($tip, guideid, step, returnStep){

		var body = $tip.find('.aero-tip-body').html();
        var tpl = body + "<div class='aero-branch'></div>";

        setTimeout(function(){
            for(i in guideid) { if(typeof guideid[i] == "string"){
                Aero.guide.get(guideid[i], function(r) {
                    if( $q('.aero-branch').find('#b-' + r.id).length == 0)
                        $q('.aero-branch').append("<a id='b-"+r.id+"' data-returnid='" + Aero.tip._guide.id + "' data-returnto='" + returnStep + "' data-guideid='" + r.id + "' class='aero-start'>" + r.title + "</a>");
                    $q(window).trigger('resize');
                });
            }}
        }, 250);

        //tpl += "<a class='aero-continue'>Continue with this guide</a></div>";
        $tip.find('.aero-tip-body').html(tpl);
		return $tip;
	},

	/**
	 * @function Display exceiption to user when element cannot be found
     * @param {object} options for alert dialog
     * @returns {void}
	 */
	renderException : function(title, body, goBack){

        var dropdown = "";

        //Optional move to step for admins
        if(goBack && AeroStep.admin) {
            dropdown = '<div class="aero-section aero-goto"><label>Go back to step:</label><select id="aero-goto">';

            for (var i = 0; i < Aero.tip._guide.step.length; i++) {
                var s = i == (Aero.tip._current - 1) ? 'selected="selected"' : '';
                dropdown += '<option ' + s + 'value="' + i + '">' + (i + 1) + ': '+ Aero.tip._guide.step[i].title + '</option>';
            }
            dropdown += '</select></div>';
        }

        Aero.confirm({
			ok : "End Guide",
            cancel : goBack ? "Go Back" : "Ok",
			title : title,
			msg : body + dropdown,
			onConfirm : function(){
				Aero.tip.stop();
			},
			onCancel : function(){
                if(goBack && AeroStep.admin){
                    Aero.tip.jumpTo(parseInt($q('#aero-goto').val()));
                }
                else if(goBack){
                    Aero.tip.prev();
                }
			},
            onClose : function(){
                Aero.view.step.setState(aeroStorage.getItem('aero:session:pause'), 'forward');
            }
		});
	},

	/**
	 * @function Display exceiption to user when element cannot be found
     * @param {object} options for alert dialog
     * @returns {void}
	 */
	setNav : function(){
		var self = this;

		$q('body')
			.off('click.aPe').on('click.aPe', '.aero-btn-prev', function(){
                Aero.navigating = true;
                self.prev();
			})
			.off('click.aEd').on('click.aEd', '.aero-btn-end', function(){
				self.stop();
			});
	},

	/**
	 *  @function Say congratulations
	 *  @param {string} session
	 */
	sayCongrats : function(){
		aeroStorage.getItem("aero:session", function(ls){
			var guide = JSON.parse(ls);

			if(!AeroStep.admin){
				Aero.confirm({
					ok : AeroStep.lang['done'],
					title : AeroStep.lang['gfinished'],
					msg : AeroStep.lang['congrats'] + guide.title,
					onConfirm : function(){
						AeroStep.session.destroy();
					}
				});
			}
		}, true);
	},

	/**
	 * @function Setup navigation for tip
     * @param {object} $el Element
     * @returns {string} $nav Navigation type
	 */
	setEvents : function($el, nav, $tip, position){
		var self = this, last = false;

		//Watch
		$q(document).off("scroll.scw").on("scroll.scw" + Aero.tip._current, function(){ self.setPosition($el, $tip, position);  }, 250);
		$q('div *:not(".aero-steps")').off("scroll.scd").on("scroll.scd" + Aero.tip._current, function(){ self.setPosition($el, $tip, position); }, 250);

        //Draggable tips
        $q('.aero-tip').draggable({ handle: "div.aero-tip-draggable" });

		//Resize window reposition
        $q(window).on("resize", function(){
            self.setPosition($el, $tip, position);
            Aero.view.sidebar.setScrollable();
		}, 250);

		//Is last step?
		aeroStorage.removeItem('aero:session:end');
		if(parseInt($q('.aero-tip:last').attr('id').replace('astep-', '')) == (Aero.tip._guide.step.length - 1)){
			aeroStorage.setItem('aero:session:end', 1);
			last = true;
		}

		//Branch continue
		$q('body').off('click.branchc').on('click.branchc', '.aero-continue', function(){
			Aero.tip.next();
		});

		//Branch start
		$q('body').off('click.branchs').on('click.branchs', '.aero-start', function(){

			aeroStorage.setItem('aero:session:branch:returnid', $q(this).data('returnid'));
			aeroStorage.setItem('aero:session:branch:returnto', $q(this).data('returnto'));

			Aero.tip.hide();
			Aero.tip.start($q(this).data('guideid'), 0, true);
		});

        //Default for next
        $q('body').off('click.aNe').on('click.aNe', '.aero-btn-next', function(){
            Aero.navigating = true;
            self.next();
        });

		for(var n in nav){
            if (nav.hasOwnProperty(n)) {
			    //Default next
			    if(nav[n] == -1) nav[n] = Aero.tip._current + 1;

                switch(n) {
                    case "next":
                        $q('body').off('click.aNe').on('click.aNe', '.aero-btn-next', function(){
                            Aero.navigating = true;
                            if(!self.validate()) return;

                            self.jumpTo(nav[n]);
                        });
                        break;

					case "click":
                        $el.off('click.aeronav').on('click.aeronav', $el, function(){
                            Aero.navigating = true;
                            if(!self.validate()) return;

                            if(last){
                                if(!AeroStep.admin) self.stop();
                                return;
                            }

                            self.jumpTo(nav[n]);
                        });
                        break;

                    case "mousedown":
                        $el.off('mousedown.aeronav').on('mousedown.aeronav', $el, function(){
                            Aero.navigating = true;
                            if(!self.validate()) return;

                            if(last){
                                if(!AeroStep.admin) self.stop();
                                return;
                            }

                            self.jumpTo(nav[n]);
                        });
                        break;

                    case "hover":
                        $el.off('mouseenter.aeronav').on('mouseenter.aeronav', $el, function(){
                            Aero.navigating = true;
                            if(!self.validate()) return;

                            setTimeout(function(){
                                self.jumpTo(nav[n]);
                            },500);
                        });
                        break;

                    case "blur":
                        $el.focus();
                        $el.off('keydown.aeronav').on('keydown.aeronav', $el, function(e){
                            Aero.navigating = true;
                            if(!self.validate()) return;

                            var code = e.keyCode || e.which;
                            if(code == 13 || code == 9){
                                self.jumpTo(nav[n]);
                            }
                        });
                        break;

                    case "unload":
                        $q(window).off('beforeunload.aeronav').on('beforeunload.aeronav', function(){
                            Aero.navigating = true;
                            self.setStep(nav[n]);
                        });
                        break;

                    case "observe":
                        self.observe(self._current + 1, true, function(){
                            Aero.navigating = true;
                            self.next();
                        });
                        break;
                }
            }
		}
	}
};
