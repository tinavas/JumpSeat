/**
 *  @class Admin object
 *  @author Mike Priest
 */
"use strict";

/**
 *  View definition
 */
Aero.view.admin = {

	guideid : "",
	type : "",

	/**
	 *  Render steps in the menu list
	 */
	render : function(type, guide){

		$q('.container-close').remove();
		this.type = type;
		if(Aero.tip._guide) Aero.tip.hide();
		$q('.aero-active').removeClass('aero-active');

		Aero.tpl.get("sidebar-"+this.type+"-admin.html", function(r){
			$q('.aero-admin-wrapper').remove();

			var tpl = _q.template(r);
			$q('body').append( tpl( { model: guide }));

			$q('#aero-tab').css('left', '-542px');
			$q('.aero-sidebar').prepend('<div class="aero-blanket" style="display:none"></div>');
			$q('.aero-blanket').fadeTo(300 , 0.9, function(){ });

			if(type == "step") $q('.aero-nav-item:not(:first)').append('<a class="aero-del-nav">X</a>');

			var btnsGrps = $q.trumbowyg.btnsGrps;
			$q('#aeroEditor')
	        	.trumbowyg({
	        		fullscreenable: false,
	                fixedFullWidth: true,
	                resetCss: true,
	                autogrow: true,
	                btns: ['viewHTML',
	                       '|', btnsGrps.design,
	                       '|', 'link',
	                       '|', 'insertImage',
	                       '|', btnsGrps.justify,
	                       '|', btnsGrps.lists,
	                       '|', 'insertHorizontalRule']
	            });
        });

		setTimeout("$q('.aero-required:eq(0)').focus();", 300);
	},

	/**
	 *  Render view for sub menu
	 */
	renderMenu : function($li){
		var i = $q('.aero-strip-menu li').index($li);
		$q('.aero-admin-body .open').removeClass('open');
		$q('.aero-strip-menu li').removeClass('aero-menu-active');

		$li.addClass('aero-menu-active');
		$q('#aeroSection' + i).addClass('open');

		//Guide screens
		if(i == 2 && this.type == "guide") Aero.view.guide.admin.renderRoles();
		if(i == 1 && this.type == "guide") Aero.view.guide.admin.renderPathways();
	},

	/**
	 *  Render the hover tip
	 */
	renderMenuTip : function($a, title){
		var $tip = $q('<div class="aero-menu-tip" style="top:-200px"><span></span>' + title + '</div>');
		var o = $a.offset().top + ($tip.outerHeight() / 2) + 16;
		$q('.aero-app').append($tip);

		$tip.css( { 'top':  o - $q(window).scrollTop(), 'left' : 55, opacity: 0 });
		$tip.animate({
		    opacity: 1,
		    left: "+=8"
		  }, 100);
	},

	/**
	 *  Close edit view
	 */
	close : function(){
		var show = ($q('.aero-editing-step').hasClass('aero-add-step') ? false : true);
		$q('.aero-admin-wrapper, .aero-edit-active').remove();
		$q('#aero-tab').css('left', '-44px');
		$q('.aero-blanket').fadeTo( "medium" , 0, function(){ $q(this).remove(); });
		$q('.aero-editing').removeClass('aero-editing');

		//Show step again?
		if(Aero.tip._guide && show){
			var step = Aero.step.get(Aero.tip._current);
			Aero.tip.beforeShow(Aero.tip._current, step);
		}
	},

	/**
	 *  Edit a model
	 */
	edit : function($this){
		var self = this;
		var $li = $this.parents('li:eq(0)');
		var type = Aero.tip._guide ? "step" : "guide";
		self.guideid = Aero.tip._guide ? Aero.tip._guide.id : $this.parents('li:eq(0)').data('guideid');

		$li.addClass('aero-editing');
		$li.prepend('<span class="aero-edit-active"></span>');

		Aero.guide.get(self.guideid, function(guide){
			if(type == "step"){
				guide = guide['step'][Aero.index];
				guide.id = self.guideid;
				guide.index = Aero.index;
				guide.isAdd = false;
			}

			Aero.view.admin.render(type, guide);
		});
	},

	/**
	 *  Render admin tools
	 */
	renderTools : function($el){

		var $tools = $el.find('.aero-item-tools:eq(0)');

		if($tools.length > 0){
			$tools.show();
			return;
		}

		//Go get it
		var type = $el.data('guideid') ? "guide" : "step";
		var guideid = $el.data('guideid') || Aero.tip._guide.id;

		Aero.tpl.get("sidebar-"+type+"-tools.html", function(r){
			Aero.model.guide.byId(guideid, function(guide){
				var tpl = _q.template(r);
				$el.prepend( tpl( { creator: (guide.creator == Aero.constants.USERNAME) }));
			});
		});
	},

	/**
	 *  Create events for admin UX
	 */
	setEvents : function(type){
		var self = this;
		if(type) self.type = type;

		$q('body')
		//Cancel
		.off("click.aeroCancel").on("click.aeroCancel", ".aero-cancel-edit", function(){
			self.close();
			return false;
		})
		//Menu enter
		.off("mouseenter.aerome").on("mouseenter.aerome", ".aero-strip-menu a", function() {
			$q('.aero-menu-tip').remove();
			Aero.view.admin.renderMenuTip($q(this), $q(this).data('title'));
        })
        //Menu leave
        .off("mouseleave.aeroml").on("mouseleave.aeroml", ".aero-strip-menu a", function() {
        	$q('.aero-menu-tip').remove();
        })
		//Tools hover
		.off("click.aeroTools").on("mouseenter.aeroTools", ".aero-"+self.type+"s ul li", function(){
			Aero.view.admin.renderTools($q(this));
			return false;
		})
		//Tools leave
		.off("click.aeroTools").on("mouseleave.aeroTools", ".aero-"+self.type+"s ul li", function(){
			$q('.aero-item-tools').hide();
		})
		//branch
		.off("change.aerob").on("change.aerob", "select[name='aero_branch']", function(){
			$q('select[name="aero_return"]').parents('div:eq(0)').hide();
			if($q(this).val() != "") $q('select[name="aero_return"]').parents('div:eq(0)').show();
		});
	}
};


/**
 *  View definition
 */
Aero.view.guide.admin = {

	id : "",

	/**
	 *  Render role screen
	 */
	renderRoles : function(){
		this.renderMapping('roles');
	},

	/**
	 *  Render pathway screen
	 */
	renderPathways : function(){
		this.renderMapping('pathways');
	},

	/**
	 *  Render mapping between guide and pathway/role
	 */
	renderMapping : function(type){

		//Show available
		Aero[type].getAll(function(result){

			$q('.aero-' + type).html("").append('<option value="">- Select a '+type.slice(0, -1)+' -</option>');
			for(var i in result){
                if (result.hasOwnProperty(i)) {
                    $q('.aero-' + type).append('<option value="' + result[i].id + '">' + result[i].title + '</option>');
                }
			}
		});

		//Show currently assigned
		Aero[type].getByGuideid(Aero.view.admin.guideid, function(result){
			$q('.aero-'+type+'-list ul').html('');
			for(var i in result){
                if (result.hasOwnProperty(i)) {
                    $q('.aero-'+type+'-list ul').append('<li class="clearfix" data-id="'+result[i].id+'"><a class="aero-btn-grey"><i class="fa fa-times"></i></a><span>'+result[i].title+'</span></li>');
                }
            }
		});
	},

	/**
	 *  Save form
	 */
	save : function(){

		var id = Aero.view.admin.guideid;
		var data = $q('#editGuideFrm').aeroSerialize();
			data.desc = $q('#aeroEditor').trumbowyg('html');

		Aero.view.admin.close();

		//Switch checkboxes to boolean
		data.active = (data.active == "1");
		data.auto = (data.auto == "1") ? true : null;

		//Update or create
		if(id != ""){
			data.id = id;
			Aero.guide.update(data);
		}else{
			Aero.guide.create(data, function(r){
				Aero.tip.start(r);
			});
		}
	},

	/**
	 *  Set event handlers
	 */
	setEvents : function(guide){

		var self = this;

		//Create
		$q('body').off("click.aeroGCreate").on("click.aeroGCreate", "a.aero-btn-create", function(){

			//Clear out guideid
			Aero.view.admin.guideid = "";
			Aero.view.admin.render("guide", {});
			return false;
		});

		//Menu
		$q('body').off("click.aeroSMenu").on("click.aeroSMenu", ".aero-strip-menu a", function(){
			var $li = $q(this).parents('li:eq(0)');
			Aero.view.admin.renderMenu($li);
			return false;
		});

		//Delete
		$q('body').off("click.aeroGDelete").on("click.aeroGDelete", ".aero-guides ul li a.aero-delete", function(){
			var li = $q(this).parents('li:eq(0)');
			var id = li.data('guideid');
			var name = li.find('a:last').text();

			Aero.confirm({
				ok : "Delete",
				title : name,
				msg : "Are you sure you want to delete this guide?",
				onConfirm : function(){
					Aero.guide.destroy(id);
				}
			});

			return false;
		});

		//Edit
		$q('body').off("click.aeroGEdit").on("click.aeroGEdit", ".aero-guides ul li a.aero-edit", function(){
			Aero.view.admin.edit($q(this));
			return false;
		});

		//Save on enter
		$q('body').off("keypress.gsa").on("keypress.gsa", '#editGuideFrm input', function(e){
			var k = e.keyCode || e.which;
			if(k == '13'){
				if(Aero.model.guide.validate()){
					self.save();
				}
				return false;
			}
		});

		//Save
		$q('body').off("click.aeroGSave").on("click.aeroGSave", ".aero-editing-guide .aero-btn-save", function(){
			if(Aero.model.guide.validate()){
				self.save();
				return false;
			}
		});

		//Create pathway association
		$q('body').off("click.apA").on("click.apA", ".aero-pathways-search a", function(){
			var id = $q('.aero-pathways').val();
			if(id != "") Aero.pathways.createMapping(id, Aero.view.admin.guideid);
			return false;
		});

		//Delete pathway association
		$q('body').off("click.dpA").on("click.dpA", ".aero-pathways-list a", function(){
			var id = $q(this).parent().data('id');

			Aero.confirm({
				ok : "unlink",
				title : "Removing pathway link",
				msg : "Are you sure you want to remove this pathway?",
				onConfirm : function(){
					Aero.pathways.destroyMapping(id, Aero.view.admin.guideid);
				}
			});
			return false;
		});

		//Create role association
		$q('body').off("click.arA").on("click.arA", ".aero-roles-search a", function(){
			var id = $q('.aero-roles').val();
			if(id != "") Aero.roles.createMapping(id, Aero.view.admin.guideid);
			return false;
		});

		//Delete role association
		$q('body').off("click.drA").on("click.drA", ".aero-roles-list a", function(){
			var id = $q(this).parent().data('id');

			Aero.confirm({
				ok : "unlink",
				title : "Removing role link",
				msg : "Are you sure you want to remove this role?",
				onConfirm : function(){
					Aero.roles.destroyMapping(id, Aero.view.admin.guideid);
				}
			});
			return false;
		});
	}
};


/**
 *  Pathway Object
 */
Aero.pathways = {

	/**
	 *  Get pathway list
	 */
	getAll : function(callback){
		if(!Aero.constants.PATHWAYS){
			Aero.send("api/pathway", {}, function(r){
				Aero.constants.PATHWAYS = r;
				callback(r)
			}, "GET");
		}else{
			callback(Aero.constants.PATHWAYS);
		}
	},

	/**
	 *  Get pathway list
	 */
	getByGuideid : function(guideid, callback){
		Aero.send("api/pathwaymap/by_guide", { guideid : guideid }, function(r){
			callback(r)
		}, "GET");
	},

	/**
	 *  Create association with role and guide
	 */
	createMapping : function(pathwayid, guideid){
		Aero.send("api/pathwaymap", { guideid: guideid, pathwayid: pathwayid}, function(){
			Aero.view.guide.admin.renderMapping('pathways');
		}, "POST");
	},

	/**
	 *  Delete assication between role and guide
	 */
	destroyMapping : function(pathwayid, guideid){
		Aero.send("api/pathwaymap", { guideid: guideid, pathwayid: pathwayid}, function(){
			Aero.view.guide.admin.renderMapping('pathways');
		}, "DELETE");
	}
};


/**
 *  Role Object
 */
Aero.roles = {

	/**
	 *  Get role listing
	 */
	getAll : function(callback){
		if(!Aero.constants.ROLES){
			Aero.send("api/role", {}, function(r){
				Aero.constants.ROLES = r;
				callback(r)
			}, "GET");
		}else{
			callback(Aero.constants.ROLES);
		}
	},

	/**
	 *  Get roles assigned to guide
	 */
	getByGuideid : function(guideid, callback){
		Aero.send("api/rolemap/by_guide", { guideid : guideid }, function(r){
			callback(r);
		}, "GET");
	},

	/**
	 *  Create association with role and guide
	 */
	createMapping : function(roleid, guideid){
		Aero.send("api/rolemap", { guideid: guideid, roleid: roleid}, function(){
			Aero.view.guide.admin.renderMapping('roles');
		}, "POST");
	},

	/**
	 *  Delete assication between role and guide
	 */
	destroyMapping : function(roleid, guideid){
		Aero.send("api/rolemap", { guideid: guideid, roleid: roleid}, function(){
			Aero.view.guide.admin.renderMapping('roles');
		}, "DELETE");
	}
};


/**
 *  View definition
 */
Aero.view.step.admin = {

	/**
	 *  Delete nav item
	 */
	addNav : function(){
		$q('.aero-nav-item:first').clone().append('<a class="aero-del-nav">X</a>').insertAfter('.aero-nav-item:last');
	},

	/**
	 *  Delete nav item
	 */
	destroyNav : function($this){
		if($q('.aero-nav-item'))
		$this.parents('.aero-nav-item').remove();
	},

	/**
	 *  Save step data
	 */
	save : function(){
		var index = parseInt($q('.aero-step-index').val());
		var data = $q('#editStepFrm').aeroSerialize();
			data.id = Aero.view.admin.guideid;
			data.body = $q('#aeroEditor').trumbowyg('html');
			data.nav = {};

		//Check for custom size and move into size prop
		if(data.size_custom != "" && !isNaN(data.size_custom + "")){
			data.size = data.size_custom + '';
		}
		//Not an actual prop
		delete data.size_custom;

		//Grab nav
		$q('.aero_nav_when').each(function(){
			if($q(this).val() != ""){
				data.nav[$q(this).val()] = $q(this).parent().find('.aero_nav_to').val();
			}
		});

		//Switch hide dropdown to boolean props
		if(data.nav.length == 0) delete data.nav;
		if(data.hide){ data[data.hide] = true; delete data.hide; }

		//Switch checkboxes to boolean
		data.showTitle = (data.showTitle == "1") ? true : null;
		data.sidebar = (data.sidebar == "1") ? true : null;
		data.multi = (data.multi == "1") ? true : null;

		//Clean data for empty props
		data = _q.pick(data,_q.identity);

		//Update or create step
		if($q('.aero-editing-step').hasClass('aero-add-step')){
			Aero.step.add(data);
			$q('.aero-helper').remove();
		}else{
			Aero.step.update(index, data);
		}
		Aero.view.admin.close();
	},


	/**
	 *  Start the picker
	 */
	pickerStart : function(){

		Aero.picker.init({
    		onStart : function(){
    			Aero.tip.hide();
    			Aero.view.sidebar.hide();
    		},
    		callback: function(path){
    			Aero.view.sidebar.show(false, 0);
    			Aero.picker.destroy();

    			var index = (Aero.tip._guide.step.length > 0) ? Aero.tip._current + 1 : 0;
    			var nav = [];
    			var title = "";
    			var body = "";
    			var text = "";

    			//Auto populate buttons
    			var tag = $q(path).prop('tagName').toLowerCase();
    			var contains = ['button', 'a'];
    			if($q.inArray(tag, contains) > -1){
    				text = $q.trim($q(path).text());
    				body = "Click " + text;
    				title = text;

    				nav = { click : "-1" };
    			}

    			//Auto populate for forms
    			contains = ['input', 'select', 'textarea'];
    			if($q.inArray(tag, contains) > -1){

    				text = $q.trim($q(path).parent().find('label:eq(0)').text());

    				var lbl = $q("label[for='"+$q(path).attr('id')+"']");
    				if(lbl.length > 0) text = lbl.text().replace('*', '');
    				body = "Enter " + text;
    				title = text;

    				nav = { blur : "-1" };
    			}

    			var url = document.URL;
    			var full = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
    			url = url.replace(full, '');

    			//Remove trailing slash and slash with empty #
    			if(!url.match(/#\/$/)){
    				var sl = /(\/$|\/#$|#$)/;
        			url = url.replace(sl, "");
    			}

    			//Step settings
    			var settings = {
					id : null,
					title: title,
					body: body,
					url: url,
					isAdd: true,
					index: index,
					loc : path,
					nav : nav
    			};

    			Aero.view.admin.render("step", $q.extend(Aero.model.step.defaults(), settings));
    		}
    	});
    	Aero.picker.setEvents();
	},

	/**
	 *  Create draggable
	 */
	renderSortable : function(){

		//Drag order
		$q('.aero-steps ul')
			.sortable({
				placeholder: "aero-helper-dropable",
		        update: function(event, ui) {
		        	Aero.step.moveIndex(Aero.moveFrom, ui.item.index());
		        	Aero.moveFrom = null;
		        },
		        start: function(event, ui) {
		            Aero.moveFrom = ui.item.index();
		        }
		    })
		    .disableSelection();
	},

	/**
	 *  Set event handlers
	 */
	setEvents : function(){

		var self = this;

		//Delete
		$q('body').off("click.aroSD").on("click.aroSD", ".aero-steps ul li a.aero-delete", function(){
			var index = $q( ".aero-steps li" ).index( $q(this).parents('li:eq(0)') );
			Aero.confirm({
				ok : "Delete",
				title : "Step delete",
				msg : "Are you sure you want to delete this step?",
				onConfirm : function(){
					Aero.step.destroy(index);
				}
			});
			return false;
		});


		//Edit
		$q('body').off("click.aeroSEdit").on("click.aeroSEdit", ".aero-steps ul li a.aero-edit", function(){
			var $li = $q(this).parents('li:eq(0)');
			Aero.index = $q('.aero-steps li').index($li);
			Aero.view.admin.edit($q(this));
			return false;
		});

		//Save on enter
		$q('body').off("keypress.ssa").on("keypress.ssa", '#editStepFrm input', function(e){
			var k = e.keyCode || e.which;
			if(k == '13'){
				if(Aero.model.step.validate()){
					self.save();
				}
				return false;
			}
		});

		//Save
		$q('body').off("click.aeroSSave").on("click.aeroSSave", ".aero-editing-step .aero-btn-save", function(){
			if(Aero.model.step.validate()){
				self.save();
				return false;
			}
		});

		//Add nav
		$q('body').off("click.aeroNAdd").on("click.aeroNAdd", ".aero-editing-step .aero-add-nav", function(){
			self.addNav();
			return false;
		});

		//Remove nav
		$q('body').off("click.aeroNDel").on("click.aeroNDel", ".aero-editing-step .aero-del-nav", function(){
			self.destroyNav($q(this));
			return false;
		});

		//Change size
		$q('body').off("change.ssC").on("change.ssC", ".aero-section select[name='aero_size']", function(){
			$q('.aero-custom-size').hide();
			$q('.aero-custom-size input').val("");

			if($q(this).val() == "custom") $q('.aero-custom-size').show();
		});

		//Change exception type
		$q('body').off("change.seC").on("change.seC", ".aero-section select[name='aero_miss']", function(){
			$q('.aero-alert-edit').hide();
			$q('.aero_alert, .aero_alertContent').val("");
			if($q(this).val() == "alert") $q('.aero-alert-edit').show();
		});

		//Add step
		$q('body')
	        .on("mouseup", "a.aero-btn-picker", function() {
	        	self.pickerStart();
	        })
	        .on("click", "a.aero-btn-picker", function() {
	            return false;
	        });
	}
};

/**
*	Picker Plugin
*/
Aero.picker = {

	/**
	 *  Save
	 */
	options : {
		onStart : function(){
			Aero.log("Starting picker", "info");
		},
		callback : function(path){
			Aero.log("Starting picker path:" + path, "info");
		}
	},

	/**
	 *  Initialize
	 */
	init : function(options) {
		var self = this;
		var $picker = $q('.aero-picker');
		var settings = $q.extend({}, this.options, options);
		settings.onStart();

		if ($picker.length == 0) {

			$picker = $q('<div class="aero-picker" style="border:0.2em dashed #0599c3; position: fixed; top: 0; left: 0; height: 100%; width: 100%; z-index:999999999999;"></div>');
			$q('body').append($picker);

			$picker
				.on('mousemove.aeroPicker', function(e) { self.latch(e); })
				.on('mouseup.aeroPicker', function(e) { settings.callback(self.get(e)); });
		}
	},

	/**
	 *  Destroy the picker picker
	 */
	destroy : function() {
		$q('.aero-picker').remove();
		$q('*').off('.aeroPicker');
	},

	/**
	 *  Latch picker onto element
	 */
    latch : function(e){

        var self = this;
        var $el = this.getElementByPos(e.pageX, e.pageY);

        if($el.length > 0){

            var isFrame = false;
            var $picker = $q('.aero-picker');
            var offset = this.scrollOffset($el);
            var top = offset.top;
            var left = offset.left;
            var height = $el.outerHeight();
            var width = $el.outerWidth();

            if($el.prop('tagName') == "IFRAME"){

                //It's a frame!
                isFrame = true;

                var iframe= $el.get(0);
                var i= $el.contentWindow? iframe.contentWindow : iframe.contentDocument.defaultView;
                var $frameEl = $q(i.document.elementFromPoint(e.pageX - left, e.pageY - top));
                var iOffset = $frameEl.offset();
            }

            $el.trigger('mouseover');
            $el.trigger('mouseenter');

            if(isFrame) {
                top = top + iOffset.top;
                left = left + iOffset.left;
                height = $frameEl.outerHeight();
                width = $frameEl.outerWidth();
            }

            if (height > 0 && width > 0) {
                $picker.css({
                    height: height + "px",
                    width: width + "px",
                    top: top + "px",
                    left: left + "px"
                });
            }
        }
    },

	/**
	 *  Get full path of element
	 */
	get : function(e) {
		var self = this;
		var $el = self.getElementByPos(e.pageX, e.pageY);

        return $el.getSelector().join("\n");
	},

	/**
	 *  Get element by x-y position
	 */
	getElementByPos : function(x, y) {

		$q('.aero-picker').hide();

		x -= $q(document).scrollLeft();
		y -= $q(document).scrollTop();

		var eel = document.elementFromPoint(x, y);

		$q('.aero-picker').show();

		return $q(eel);
	},

	/**
	 *  Get scroll offset
	 */
	scrollOffset : function($el) {
		var offset = $el.offset();
			offset.top  -= $q(document).scrollTop();
			offset.left -= $q(document).scrollLeft();

		return offset;
	},

	/**
	 *  Create events
	 */
	setEvents : function(){
		var self = this;

        $q("body")
            .on("mousemove.aeroPicker", "*", function(e) {
                self.latch(e);
            });

        //Shortcuts
        $q(document).keyup(function(e) {
        	if (e.keyCode == 27){
        		self.destroy();
            	Aero.view.sidebar.show(false, 0);
        	}
    	});
	}
};

if(AeroStep.admin){
	//Setup events
	Aero.view.admin.setEvents("step");
	Aero.view.admin.setEvents("guide");
	Aero.view.step.admin.setEvents();
	Aero.view.guide.admin.setEvents();
}

//Shortcuts
$q(document).keyup(function(e) {
	if(e.keyCode == 192){
		Aero.view.step.admin.pickerStart();
	}
});
