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

                if ( entry.origin.length ) { $('#'+entryId).find('.origin').text( entry.origin ); }
                else                       { $('#'+entryId).find('.origin').css('display', 'none'); }

                $('#'+entryId).find('.img').attr('src', 'data/img/'+entry.img );

                if ( !entry.ratings.length ) { entry.rating = 0; }

                var rating = self.calcRating( entry.ratings );
                var i=1;
                for ( ; i <= rating[0]; i++) {
                    $('#'+entryId+' .rating-'+i).attr('src', 'images/beer_color.png');
                };
                if ( rating[1] === "5" || rating[1] === 5 ) {
                    $('#'+entryId+' .rating-'+i).attr('src', 'images/beer_csw.png');
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

        self.calcRating = function( ratings ) {
            var rating = 0;
            $.each(ratings, function(index, val) { rating += parseFloat( val.rating ); });
            rating = (( (rating/ratings.length)+'' ).substring(0,3)).split('.');

            if ( rating[1] ) {
                if ( rating[1] > 3 && rating[1] <= 7 ) {
                    rating[1] = '5';
                } else if ( rating[1] > 7 ) {
                    rating[0] = parseInt(rating[0])+1;
                    rating[1] = '0';
                } else {
                    rating[1] = '0';
                }
            }

            return rating;
        }

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