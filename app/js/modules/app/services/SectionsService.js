define(function () {
	return ['SessionService', 'MENU_GROUPS', SectionsService];

	function SectionsService(SessionService, MENU_GROUPS) {

		function flatternSection() {
			var flatternedSections = [];
			_.each(MENU_GROUPS, function (menu) {
				if (_.has(menu, 'subMenus')) {
					flatternedSections = flatternedSections.concat(menu.subMenus);
				} else {
					flatternedSections.push(menu);
				}
			});

			return flatternedSections;
		}

		return {
			positiveSections: [],
			hiddenSections:[],
			activeSection: {},
			flatternSection: flatternSection(),
			maxSections:8,
			init: function (maxSections) {
				var self = this;
				if (!self.positiveSections.length || !self.activeSection) {
					if (localStorage.getItem(sessionStorage.getItem('username') + '-positiveSections')) {
						self.positiveSections = _.filter(flatternSection(), localStorage.getItem(sessionStorage.getItem('username') + '-positiveSections'));
						self.activeSection = _.filter(flatternSection(), {isActive: localStorage.getItem(sessionStorage.getItem('username') + '-activeSection')})[0];
					} else {
						self.positiveSections=angular.copy(_.filter(flatternSection(), 'default'));
						self.activeSection = _.filter(flatternSection(), 'active')[0];
					}
				}
				this.maxSections=maxSections||8;
			},
			clearSection:function(){
				var self = this;
				self.positiveSections.splice(1,self.positiveSections.length);
				self.hiddenSections.splice(0,self.hiddenSections.length);
				self.positiveSections[0].active=true;
			},
			addActiveSection: function (section) {
				var self = this;
				self.activeSection=null;
				section.active = true;
				_.each(self.positiveSections,function(ps){
					if(ps.id!=section.id){
						ps.active=false;
						return;
					}
					self.activeSection=ps;
				});
				/*if(section.data){
					console.log(self)
				}*/
				if (!self.activeSection) {
					self.positiveSections.push(section);
					self.activeSection=section;
				}
				if(self.positiveSections.length>self.maxSections){
	                var first=self.positiveSections[2];
	                self.closeSection(first);    
	                self.hideSection(first);
	            }
			},
			closeSection: function (section) {
				var self = this;
				_.remove(self.positiveSections, function (activeSection) {
					return activeSection.id === section.id;
				});
			},
			deactiveOtherSection: function (section) {
				var self = this;
				_.each(self.positiveSections,function(ps){
					if(ps.id!=section.id){
						ps.active=false;
					}
				});
			},
			showSection: function (section) {
				var self = this;
				_.remove(self.hiddenSections, function (hs) {
					return hs.id === section.id;
				});
			},
			hideSection:function(section){
				var self = this;
				self.hiddenSections.push(section);
			}
		};
	}
});