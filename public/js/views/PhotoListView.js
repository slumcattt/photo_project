App.views = App.views || {};

App.views.PhotoListView = Backbone.View.extend({
    template: Handlebars.compile($('#photoListViewTemplate').html()),
    $dropzone: null,
    $fileUpload: null,

    events: {
        'click #uploadBtn': '_uploadClicked'
    },

    initialize: function(options) {
        _.bindAll(this, 'render', '_uploadClicked', '_handleDragLeave', '_handleDragOver', '_handleDrop', '_handleFileUpload', '_uploadFiles', '_saveNewPhoto');
        this.setCollection = options.setCollection;

        this.collection.bind('reset', this.render);
        this.collection.bind('change', this.render);
        this.collection.bind('add', this.render);
        this.collection.bind('remove', this.render);
        this.setCollection.bind('reset', this.render);
    },

    render: function() {
        // Set the html
        var sets = this.setCollection.toJSON();
        var set = (sets) ? sets[0] : null;
        var photos = this.collection.toJSON();
        this.$el.html(this.template({
            set: set,
            photos: photos
        }));

        // Set the drag and drop listeners
        this.$dropzone = this.$el.find('#dropzone');
        var dropzone = this.$dropzone.get(0); // Gets the DOM element from jQuery. Not sure if this is actually quicker
        dropzone.addEventListener('dragleave', this._handleDragLeave, false);
        dropzone.addEventListener('dragover', this._handleDragOver, false);
        dropzone.addEventListener('drop', this._handleDrop, false);

        // Set the listeners for the manual file upload
        this.$fileUpload = this.$el.find('#fileUpload');
        var fileUpload = this.$fileUpload.get(0);
        fileUpload.addEventListener('change', this._handleFileUpload, false);

        return this;
    },

    _uploadClicked: function() {
        this.$fileUpload.click();
    },

    _handleDragLeave: function(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        this.$dropzone.removeClass('dragging');
    },
    _handleDragOver: function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = "copy";

        this.$dropzone.addClass('dragging');
    },
    _handleDrop: function(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        this.$dropzone.removeClass('dragging');

        var files = evt.dataTransfer.files; // FileList object
        this._uploadFiles(files);
    },
    _handleFileUpload: function(evt) {
        var files = evt.target.files; // FileList object
        this._uploadFiles(files);
    },
    _uploadFiles: function(files) {
        // Loop through the FileList and render image files as thumbnails.
        var file;
        for (var i = 0; i < files.length; i++) {
            file = files[i];

            // Only process image files.
            if (!file.type.match('image/jpeg')) {
                console.log("Ignoring:", file);
                continue;
            }

            // Read the file in as a data url
            var reader = new FileReader();
            reader.onload = this._saveNewPhoto(file);
            reader.readAsBinaryString(file);
        }
    },
    _saveNewPhoto: function(file) {
        var self = this;
        return (function(theFile) {
            return function(e) {
                var fileString = e.target.result;
                var base64String = 'data:image/png;base64,' + base64_encode(fileString);
                var exif = EXIF.readFromBinaryFile(new BinaryFile(e.target.result));
                console.log('EXIF', exif);

                var newPhoto = new App.models.Photo({
                    setId: self.setCollection.toJSON()[0].id,
                    tempName: theFile.name,
                    localFile: base64String,
                    localFileBlob: theFile
                });
                self.collection.add(newPhoto);
                newPhoto.save(null, {
                    progress: function(progress) {
                        var $progressBar = self.$el.find('.bar').filter('[data-file=' + theFile.name + ']');
                        $progressBar.width(progress + '%');
                    }
                });
            };
        })(file);
    }
});
