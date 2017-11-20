define(function () {
	function AlertService($document, $compile, $rootScope) {
		var body = $document.find('body');
		var scope = $rootScope.$new();
		var element;

		function createAlertElement() {
			if (element) {
				element.remove();
			}
			element = angular.element(
				'<div class="alert alert-{{level}} fadehover col-sm-4" style="display:none;padding:10px;position: absolute; left:2px;bottom:2px;z-index:9999">' +
				'<a href="javascript:void(0)" class="close" data-dismiss="alert" aria-label="close">&times;</a>' +
				'<strong>{{title}} </strong> {{message}}' +
				'</div>'
			);


			$compile(element)(scope);
			body.append(element);
			$(element).fadeIn(500);
		}

		return {
			show: function (title, message, level) {
				scope.title = title;
				scope.message = message;
				if (!level) {
					scope.level = 'danger';
				}
				if (!!level && !_(['success', 'info', 'warning', 'danger']).contains(level)) {
					scope.level = 'info';
				}
				var msg = (title && message) ? (title + ':' + message) : title ? title : message ? message : '';
			}
		};
	}

	return ['$document', '$compile', '$rootScope',  AlertService];
});