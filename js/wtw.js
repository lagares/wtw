
// angularjs controller
var miniWeebly = angular.module('miniWeebly', []);

	// allows auto-select text on add/edit page input fields
	miniWeebly.directive('selectContents', function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				element.on('click', function () {
					this.select();
				});
			}
		};
	});

	miniWeebly.controller('pgCtrl', function ($scope){

		var j; // index of oldName, set on editEnable and used by editPageName

		var parent = $rootScope;
		var child = parent.$new();

		$scope.pages = ['PAGE']; // this presupposes the existence of at least one page, named PAGE
		$scope.pageName = 'ADD NEW PAGE';

		$scope.addPage = function() {
			// create a new page object w corresponding child scope here
			// ...

			// add the pageName here for demo purposes
			$scope.pages.push($scope.pageName);
			$scope.pageName = 'ADD NEW PAGE';
			$scope.addPageForm.$setPristine();
		};

		$scope.removePage = function(pageName) {
			var i = $scope.pages.indexOf(pageName);
			$scope.pages.splice(i, 1);
		};

		$scope.editEnable = function(pageName) {
			$scope.enabled = !$scope.enabled;
			var oldName = pageName;
			j = $scope.pages.indexOf(oldName);
		};

		$scope.editPageName = function(pageName) {
			$scope.enabled = !$scope.enabled;
			$scope.pages.splice(j, 1, pageName);

			// console.log($routeProvider);
			// $scope.$apply( $location.path( pageName ) );
		};

		miniWeebly.config(function($routeProvider) {
			$routeProvider.
				when('/:pageName', {
					templateUrl: 'index.html',
					controller: 'miniWeebly'
				}).
				otherwise({
				redirectTo: '/'
			});
		});


		function update() {
			$scope.$apply();
		};

	/* TODO:

	*- unable to edit the first pageName - why?
	*- enable drag-drop
	*- enable auto-fill screen-width
	*- on click added-content-item, make editable

	1- submit editable content onBlur 
	2- enable half-size when drag on-top of another - "columns"
	3- implement 'pages' - objects made up of name, an array of content frames' names?, the type of each content frame, the content of each content frame - Wahid says use individual Angular $scopes for each 'page', to keep their contents apart
	3- BUG - on tool drag stop content is added to the pasteboard even if dropped on sidebar, why?
	4- BUG - only content frames already on screen are deletable/editable. New ones do not delete, why?
	5- BUG - only first page-badge accepts :hover delete color, why?
	6- How to update the URL fragment when the page name is edited?
	7- enable resize + handles
	8- enable 'selected' state on page-badge and pasteboard button nav

	*/
	});

// Pasteboard utils

$(function utils() {

	var contentType; // set by the draggable.stop, used by addContent

	// page delete warning highlight
	$('.page-badge .button-remove-pg').hover(
		function() {
			$(this).parent().parent().addClass('caution')
		},
		function() {
			$(this).parent().parent().removeClass('caution')
		}
	);

	// jQuery-ui enables dragging/dropping of new content areas
	$( '.tool-icon' ).draggable({
		opacity: 0.7, 
		helper: 'clone',
		stop: function() {
			contentType = $(this).data('contenttype');
			// limit adding content types to in-scope
			if (contentType === 'text' || contentType === 'image') {
				addContent(contentType);
			}
		}
	});

	$( '#content-added-items').droppable();

	// enables placed elements to be moved around in their DOM stack 
	$( '#content-added-items').sortable({
		delay: 300,
		revert: true
	});

	$('.placeholder').resizable({
		// autoHide: true,
		containment: 'parent',
		// ghost: true,
		handles: 'e, s, w'
	});

	// when the .tool-icon stops over the #pasteboard, create an <li> of the appropriate type, text or image for now
	function addContent(contentType) {
		var dummyContent = '';
		switch(contentType) {
			case 'text':
				dummyContent = '<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>';
				break;
			case 'image':
				dummyContent = '<img src="images/Image-Placeholder.png" alt="placeholder image" />';
				break;
			case 'nav':
				dummyContent = ''; // out of scope
				break;
			case 'title':
				dummyContent = '<h1>Add Title Here</h1>'; // out of scope, but modeled after the mockup
				break;
		};
	
		$('<li/>')
			.append('<span class="delete-element"></span>')
			.append( dummyContent )
			.addClass('placeholder ' + contentType + '-placeholder')
			.appendTo($('#content-added-items'));
	};

	$('.delete-element').hover(function() {
		$(this).parent().toggleClass('caution');
	});

	// remove active content box by clicking the upper right corner x
	$('.delete-element').on('click', function() {
		console.log('clicked close');
		$(this).parent().remove();
	});

	// make content editable - text content type only for now
	$('.text-placeholder p').click( function() {
		var content = $(this).text();
		$(this).replaceWith('<form id="textEditor"><textarea>' + content + '</textarea></form>');
	});

	// moving out of the placeholder signifies finished editing, remove the textarea and replace with a <p>
	$('.placeholder').focus( function() {
		console.log('onfocus');
		// var editedContent = $(this).text(); // store the newly-edited text
		// $(this).replaceWith('<span class="delete-element"></span><p>' + editedContent + '</p>');
	});

});	


