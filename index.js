// ScriptUI example with animated images in the interface
// By Tomas Šinkūnas, www.rendertom.com

(function(thisObj) {
	var win = (thisObj instanceof Panel) ? thisObj : new Window('palette', 'ScriptUI mouseOver animation test', undefined, {
		resizeable: true
	});

	win.margins = 0;
	win.orientation = 'row';
	win.spacing = 0;

	var roll = addAnimatedImage(win, {
		mouseoutImages: 'images/roll/mouseout/',
		mouseoverImages: 'images/roll/mouseover/',
	});

	var hand = addAnimatedImage(win, {
		mouseoutImages: 'images/hand/mouseout/',
		mouseoverImages: 'images/hand/mouseover/',
	});

	var tractor = addAnimatedImage(win, {
		mouseoutImages: 'images/tractor/mouseout/',
		mouseoverImages: 'images/tractor/mouseover/',
	});

	win.onResizing = win.onResize = function() {
		this.layout.resize();
	};

	if (win instanceof Window) {
		win.center();
		win.show();
	} else {
		win.layout.layout(true);
		win.layout.resize();
	}


	function addAnimatedImage(parentGroup, options) {
		var element = parentGroup.add('image');
		element.mouseoutImages = getImages(options.mouseoutImages);
		element.mouseoverImages = getImages(options.mouseoverImages);
		element.imageIndex = 0;
		element.numFrames = element.mouseoverImages.length;
		element.addEventListener('mouseout', stopAnimation);
		element.addEventListener('mouseover', startAnimation);

		setMouseoutImage(element);

		return element;



		function getImages(folder) {
			folder = (folder instanceof Folder) ? folder : new Folder(folder);

			var files = folder.getFiles(function(file) {
				return file.fsName.split('.').pop() === 'png';
			});

			return files.sort(function(a, b) {
				return a.fsName.toLowerCase() > b.fsName.toLowerCase();
			});
		}

		function incrementImageIndex(element) {
			element.imageIndex = (element.imageIndex + 1) % element.numFrames;
		}

		function setMouseoutImage(element) {
			var image = element.mouseoutImages[element.imageIndex];
			element.icon = ScriptUI.newImage(image);
		}

		function setMouseoverImage(element) {
			var image = element.mouseoverImages[element.imageIndex];
			element.icon = ScriptUI.newImage(image);
		}

		function startAnimation() {
			var self = this;

			incrementImageIndex(self);
			setMouseoverImage(self);
			self.timer = app.setTimeout(function() {
				startAnimation.call(self);
			}, 1000 / 60);
		}

		function stopAnimation() {
			if (this.timer) {
				this.timer = app.cancelTimeout(this.timer);
				setMouseoutImage(this);
			}
		}
	}
})(this);