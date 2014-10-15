(function() {

    function App() {

        var self  = this;
        self.data = [];

        self.timelineToHtml = function( timelineEntries ) {
            timelineEntries.forEach(function( entry, index ) {
                // console.log( entry );
                var entryId = 'timeline-entry-'+index;

                $('#timeline').append( $('#timeline-entry').clone(true).attr('id', entryId) );

                if ( entry.date.length ) { $('#'+entryId).find('.date').text( entry.date ); }
                else                     { $('#'+entryId).find('.date').css('display', 'none'); }

                if ( entry.name.length ) { $('#'+entryId).find('.name').text( entry.name ); }
                else                     { $('#'+entryId).find('.name').css('display', 'none'); }

                if ( entry.origin.length ) { $('#'+entryId).find('.origin').text( entry.date ); }
                else                       { $('#'+entryId).find('.origin').css('display', 'none'); }

                $('#'+entryId).find('.img').attr('src', 'data/img/'+entry.img );

                if ( !entry.rating.length ) { entry.rating = 0; }
                var rating = Math.ceil( entry.rating );
                for (var i = 1; i <= rating; i++) {
                    $('.rating-'+i).attr('src', 'images/beer_color.png');
                };
                if ( rating != entry.rating ) {
                    $('.rating-'+rating).attr('src', 'images/beer_csw.png');
                }

            });
        };

        self.drawConnectionLines = function() {
            if ( $(window).width() <= 640 ) { return; }

            var left = $('.timeline-entry [data-connector-line="left"]');
            var right = $('.timeline-entry [data-connector-line="right"]');
            var root = 'body';
            var middle = $(window).width() / 2;
            var lineOffset = 50;
            var lineOptions = { color: '#d3ccc1', stroke: '2', style: 'solid' };

            $.each(left, function(index, val) {
                if ( $(val).is(':visible') ) {
                    var offset = $(val).offset();
                    var posY   = offset.top + $(val).outerHeight() - 2;
                    var posX   = offset.left - $(root).scrollLeft() + $(val).outerWidth();
                    $(root).line(posX,posY,middle+10,posY+lineOffset,lineOptions,function() {});
                }
            });

            $.each(right, function(index, val) {
                if ( $(val).is(':visible') ) {
                    var offset = $(val).offset();
                    var posY   = offset.top + $(val).outerHeight() - 2;
                    var posX   = offset.left - $(root).scrollLeft();
                    $(root).line(posX,posY,middle-10,posY+lineOffset,lineOptions,function() {});
                }
            });
        };
        self.loadJson = function(cb) {
            $.getJSON('data/timeline.json', function(data) {
                self.data = data;
                cb(data);
            });
        };
        self.loadJsonCallback = function( data ) {
            self.timelineToHtml( self.data.timeline );
            self.drawConnectionLines();
        };

        self.init = function() {
            self.loadJson( self.loadJsonCallback );
        };

        return {
            init: self.init
        }
    }

    var app = new App();
    app.init();

    window.onresize = function(){};

})();