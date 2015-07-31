"use strict";

/**
 *  Start the analytics app
 */
require([ 'api/apps' ], function() {

	/**
	 *  @namespace App
	 *  @class App.view
	 *  UX Views and Event Handlers
	 */
	App.view = {

		/**
		 *  Initialize
		 */
		init: function () {
			$q('#form-wrapper').html("");

            //Init menu
            var options = {};
            new Utils.menu("#userMenu", options);

            App.api.get(function (results) {
				App.view.render(results);
			});
		},

		/**
		 *  Render list view
		 */
		render: function (apps, callback, noEmpty) {
			var $card = null;
			var self = this;

			if (apps.length > 0) {
				Aero.tpl.get("apps.html", function (r) {

					//Clear
					if (!noEmpty) $q('#apps ul').html("");

					var tpl = _q.template(r);
					for (var i in apps) {
						var host = (apps[i].host) ? apps[i].host : "http://example.com";
						apps[i].hostLink = host.replace(/:\/\/|\./g, "_");
						apps[i].host = host;

						var syn = apps[i].title.replace(/(\w)\w*\W*/g, function (_, i) {
							return i;
						});
						apps[i].syn = syn.slice(0, 2);

						$card = $q('#apps ul').append(tpl({app: apps[i]}));
					}

					if (callback) callback();
					self.setEvents();
				});
			} else {
				//Defaults
				var render = App.model.defaults();
				render.title = "New Application";
				render.host = "http://example.com";

				App.view.render([render], function () {
					App.view.renderForm(App.model.defaults(), $q('.front:last'));
				}, true);
			}
		},

		/**
		 *  Render list view
		 */
		renderForm: function (app, $el) {

			var self = this;
			var $back = $el.parents('.card').find('.back');

			Aero.tpl.get("app-form.html", function (r) {

				App.id = (app) ? app.id : null;
				if (!app) app = {};

				var tpl = _q.template(r);

				$back.find('.columns').html(tpl({app: app}));
				Utils.card.flip($el);

				self.setEvents();
			});
		},

		/**
		 *  Update card
		 */
		updateCard: function (r) {

			var $front = $q('.saving');
			var host = (r.host) ? r.host : "http://example.com";
			host = host.replace(/:\/\/|\./g, "_");

			var applink = '/app/' + host + '/';

			if (r.id) $front.parents('.app:eq(0)').data('id', r.id);
			$front.find('.host a').html(r.host);
			$front.find('.host a').attr('href', r.host);

			$front.find('.title').html(r.title);
			$front.find('.description').html(r.description);
			$front.find('.link-guide').attr('href', applink + 'guides');
			$front.find('.link-path').attr('href', applink + 'pathways');

			var syn = r.title.replace(/(\w)\w*\W*/g, function (_, i) {
				return i;
			});
			$front.find('.avatar span').html(syn.slice(0, 2));
		},

		/**
		 *  Add a new card
		 */
		newCard: function () {

			//Defaults
			var render = App.model.defaults();
			render.title = "New Application";
			App.view.render([render], function () {
				App.view.renderForm(App.model.defaults(), $q('.front:last'));
			}, true);

			return false;

		},

		/**
		 *  Render model issues
		 */
		renderIssue: function () {

			Aero.confirm({
				ok: "Ok",
				title: "Domain Exists",
				msg: "You tried to save an application with a domain that already exists. Please select another domain.",
				onConfirm: function () {
					return false;
				}
			});
		},

		/**
		 *  Setup all event triggers
		 */
		setEvents: function () {
			var self = this;

			//Save on enter
			$q('input, textarea').off("keypress.k").on("keypress.k", function (e) {
				var k = e.keyCode || e.which;
				if (k == '13') {
					$q('.saving').removeClass('saving');
					$q(this).parents('.card').addClass('saving');
					App.model.save($q(this));
					return false;
				}
			});

			$q('body').off("keypress.sn").on("keypress.sn", function (e) {
				var k = e.keyCode || e.which;
				if (e.target.tagName == "BODY" && k == '78' && e.shiftKey) {
					self.newCard();
					return false;
				}
			});

			//New
			$q('.add').off("click.patha").on("click.patha", function () {
				self.newCard();
				return false;
			});

			//Delete
			$q('.delete').off("click.pathd").on("click.pathd", function () {
				var $el = $q(this);
				var id = $el.parents('li:eq(0)').data('id');
				var name = $q(this).parents('form').find('input:eq(1)').val();

				Aero.confirm({
					ok: "Delete",
					title: name,
					msg: "Are you sure you want to delete this app?",
					onConfirm: function () {
						$el.parents('.card').addClass('deleting');
						App.api.del(id);
					}
				});
				return false;
			});

			//Save
			$q('.save').off("click.paths").on("click.paths", function () {
				$q('.saving').removeClass('saving');
				$q(this).parents('.card').addClass('saving');

				if ($q('.alias-wrapper').is(':visible')) $q('.add-alias').click();

				App.model.save($q(this));
				return false;
			});

			//Edit
			$q('.edit').off("click.pathe").on("click.pathe", function () {
				var id = $q(this).parents('li:eq(0)').data('id');
				var $el = $q(this);

				App.api.get(function (r) {
					App.view.renderForm(r, $el);
				}, id);
				return false;
			});

			//Show aliases
			$q('.add-alias').off('click.alias').on('click.alias', function () {

				//Toggle display
				var $back = $q(this).parents('.back');
				var display = $back.find('.alias').is(':visible');

				if (!display) {
					$back.find('.alias-wrapper').show();
					$back.find('.add-alias i').html('&#xF500;');
					Utils.card.setHeight(this);
				} else {
					$back.find('.alias-wrapper').hide();
					$back.find('.add-alias i').html('&#xF501;');
					Utils.card.setHeight(this);
				}
			});

			//Add alias input box
			$q('.add-alias-btn').off('click.aliasb').on('click.aliasb', function () {

				//Check if card expanded
				var $back = $q(this).parents('.back');
				var expanded = $back.find('.alias-wrapper').is(':visible');

				//Add new input field
				var $html = $q('<div class="row collapse alias" style="display:block;">\
					<div class="large-12 columns">\
						<input class="alias-input" type="text" placeholder="http://uat.example.com">\
						<a class="delete-alias"><i class="ss-delete"></i></a>\
					</div>\
				</div>');
				$back.find('.alias-wrapper').append($html);

				//Expand card
				if (!expanded) $back.find('a.add-alias').click();
				Utils.card.setHeight(this);
			});

			//Delete alias
			$q('body').off('click.aliasd').on('click.alaisd', '.delete-alias', function () {
				var $w = $q(this).parents('.alias-wrapper');
				$q(this).parents('.alias:eq(0)').remove();
				Utils.card.setHeight($w);
				return false;
			});

			//Cancel
			$q('.cancel').off("click.pathc").on("click.pathc", function () {
				Utils.card.remove($q(this));
				return false;
			});

			//Active flag
			$q('body').off("change.active").on("change.active", "input[type='checkbox']", function () {
				var data = {};
				data.active = $q(this).is(':checked');
				var id = $q(this).parents('.app').data('id');
				App.api.update(data, id);
			});
		}
	};

	$q(function () { App.view.init(); });
});
