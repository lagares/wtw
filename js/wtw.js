
// angularjs controller
var miniWeebly = angular.module('miniWeebly', ['ngSanitize']);

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
		// var enabled = false;
		// var caution = false;

		// page names and pages as objects
		$scope.pages = [ 
			{ 'name': 'PAGE ZERO' },
			{ 'name': 'PAGE ONE' },
			{ 'name': 'PAGE TWO' }
		];

		// page names and pages as array
		// $scope.pages = [ 'PAGE ZERO', 'PAGE ONE', 'PAGE TWO' ];	

		// $scope.page = 'ADD NEW PAGE'; 

		// this simulates pre-existing/edited content
		$scope.blocks = [
			{ 'page': 'PAGE ZERO', 'type': 'title', 'contents': '<h1>ipsa quae ab illo</h1>' },
			{ 'page': 'PAGE ZERO', 'type': 'image', 'contents': '<img src="http://lagares.github.io/wtw/images/Image-Placeholder.png" alt="image" />' },
			{ 'page': 'PAGE ZERO', 'type': 'text', 'contents': '<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, </p>' },
			{ 'page': 'PAGE ZERO', 'type': 'text', 'contents': '<p>Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>' },
			{ 'page': 'PAGE ONE', 'type': 'title', 'contents': '<h1>Totam rem aperiam</h1>' },
			{ 'page': 'PAGE ONE', 'type': 'text', 'contents': '<p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. </p>' },
			{ 'page': 'PAGE ONE', 'type': 'text', 'contents': '<p>Fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.</p>' },
			{ 'page': 'PAGE ONE', 'type': 'text', 'contents': '<p>Consectetur, adipisci velit, sed consequuntur magni dolores eos qui ratione et dolore magnam aliquam quaerat voluptatem eos qui ratione voluptatem sequi.</p>' },
			{ 'page': 'PAGE TWO', 'type': 'title', 'contents': '<h1>sed quia consequuntur</h1>' },
			{ 'page': 'PAGE TWO', 'type': 'image', 'contents': '<img src="http://lagares.github.io/wtw/images/Image-Placeholder.png" alt="image" />' },
			{ 'page': 'PAGE TWO', 'type': 'image', 'contents': '<img src="http://lagares.github.io/wtw/images/Image-Placeholder.png" alt="image" />' },
			{ 'page': 'PAGE TWO', 'type': 'image', 'contents': '<img src="http://lagares.github.io/wtw/images/Image-Placeholder.png" alt="image" />' } 
		];

		$scope.placeholderContent = [
			{ 'text'	: '<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>'},
			{ 'image'	: '' },
			{ 'nav'		: '' },
			{ 'title'	: '<h1>Add Title Here</h1>'}
		];

		$scope.currentPage = null;

		$scope.setCurrentPage = function(page) {
			$scope.currentPage = page;
		};

		$scope.isCurrentPage = function(page) {
			return $scope.currentPage !== null && page.name === $scope.currentPage.name;
		};

		$scope.addPage = function(page) {
			// create a new page object w corresponding child scope here
			// ...

			$scope.pages.push($scope.name);
			$scope.page = 'ADD NEW PAGE';
			$scope.addPageForm.$setPristine();
		};

		$scope.removePage = function(page) {
			var i = $scope.pages.indexOf(page);
			$scope.pages.splice(i, 1);
		};

		$scope.editEnable = function(page) {
			$scope.enabled = !$scope.enabled;
			var oldName = page;
			j = $scope.pages.indexOf(oldName);
		};

		$scope.editPageName = function(page) {
			$scope.enabled = !$scope.enabled;
			$scope.pages.splice(j, 1, page);
		};

		$scope.cautionOn = function(block){
			$scope.caution = true;
		};

		$scope.cautionOff = function(block){
		 	$scope.caution = false;
		};

		$scope.removeBlock = function(block) {
			var i = $scope.blocks.indexOf(block);
			$scope.blocks.splice(i, 1);			
		}

	/* TODO:

	1- submit editable content onBlur 
	2- enable half-size when drag on-top of another - "columns"
	3- BUG - on tool drag stop content is added to the pasteboard even if dropped on sidebar, why?
	4- BUG - only content frames already on screen are deletable/editable. New ones do not delete, why?
	7- enable resize + handles
	*- enable 'selected' state on page-badge and pasteboard button nav
	*- BUG - only first page-badge accepts :hover delete color, why?
	*- How to update the URL fragment when the page name is edited?
	*- implement 'pages' - objects made up of name, an array of content frames' names?, the type of each content frame, the content of each content frame - Wahid says use individual Angular $scopes for each 'page', to keep their contents apart

	*/
	});

// Pasteboard utils

$(function() {
	var contentType; // set by the draggable.stop, used by addContent

	// page delete warning highlight
	$('.page-badge .button-remove-pg').hover(
		function() {
			$(this).parent().parent().toggleClass('caution')
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
		// ghost: true,
		containment: 'parent',
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
				dummyContent = '<small>ADD IMAGE +</small>';
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
			// .addClass('placeholder ' + {{block.type}}) no longer depends on passing contentType via JS outside NG
			.appendTo($('#content-added-items'));
	};

	$('.delete-element').hover(function() {
		$(this).parent().toggleClass('caution');
	});

	// remove active content box by clicking the upper right corner x
	$('.delete-element').on('click', function() {
		$(this).parent().remove();
	});

	// make content editable - text content type only for now
	$('.text-placeholder p').click( function() {
		var content = $(this).text();
		$(this).replaceWith('<form id="textEditor"><textarea tabindex="-1">' + content + '</textarea></form>');
	});

	// moving out of the placeholder signifies finished editing, remove the textarea and replace with a <p>
	$('.placeholder').on('focusout', function() {
		var editedContent = $(this).text(); // store the newly-edited text
		$(this).empty()
		.append('<span class="delete-element"></span><p>' + editedContent + '</p>');
	});

});
