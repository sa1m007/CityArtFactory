/*! Simple Overlay 0.1.0 | MIT *
 * https://github.com/jpcurrier/simple-overlay !*/
( function( $ ){
	$.fn.simpleOverlay = function(){
		// overlay background
		if( !$( '.simple-overlay-bg' ).length )
			$( 'body' ).prepend( '<div class="simple-overlay-bg"></div>' );

		// detect: touch
		if( 'ontouchstart' in document.documentElement )
			$( '.simple-overlay' ).addClass( 'touch' );

		function overlaySizing(){
			// dimensions
			var $overlay = $( '.simple-overlay' ),
				$figure = $( '.simple-overlay figure' ),
				figurePadH = parseInt( $figure.css( 'padding-right' ) ) + parseInt( $figure.css( 'padding-left' ) ),
				figurePadV = parseInt( $figure.css( 'padding-top' ) ) + parseInt( $figure.css( 'padding-bottom' ) ),
				overlayWidth = $( window ).width() - parseInt( $overlay.css( 'padding-right' ) ) - parseInt( $overlay.css( 'padding-left' ) ) - figurePadH,
				overlayHeight = $( window ).height() - parseInt( $overlay.css( 'padding-top' ) ) - parseInt( $overlay.css( 'padding-bottom' ) ) - figurePadV;

			$( '.simple-overlay' ).each( function(){
				var naturalWidth = Number( $( this ).find( 'figure' ).attr( 'data-natural-width' ) ),
					naturalHeight = Number( $( this ).find( 'figure' ).attr( 'data-natural-height' ) );

				// figure width extends beyond overlay & extends further than figure height
				if(
					( overlayWidth - naturalWidth < 0 ) &&
					( overlayWidth - naturalWidth < overlayHeight - naturalHeight )
				){
					$( this ).find( 'figure' ).css({
						'width': '100%',
						'height': naturalHeight * ( overlayWidth / naturalWidth ) + figurePadV
					});
				}
				// figure height extends beyond overlay, further than figure width
				else if( overlayHeight - naturalHeight < 0 ){
					$( this ).find( 'figure' ).css({
						'width': naturalWidth * ( overlayHeight / naturalHeight ) + figurePadH,
						'height': '100%'
					});
				}
				// figure does not extend beyond overlay
				else{
					$( this ).find( 'figure' ).css({
						'width': naturalWidth + figurePadH,
						'height': naturalHeight + figurePadV
					});
				}
			} );
		}
		$( window ).on( 'resize', function(){
			overlaySizing();
		} );

		function closeSlide(){
			$( '.simple-overlay.on' ).removeClass( 'on' ).fadeOut( 200 );
		}
		function openOverlay( overlayID ){
			$( '.simple-overlay[ data-overlay="' + overlayID +'" ]' ).css({
				'display': 'block',
				'opacity': 0
			}).addClass( 'on' );
			overlaySizing();
			$( '.simple-overlay[ data-overlay="' + overlayID +'" ]' ).animate({
				'opacity': 1
			});
		}

		// group navigation
		if( !( 'ontouchstart' in document.documentElement ) ){
			$( document ).on( 'mouseenter', '.simple-overlay .next', function(){
				$( '.simple-overlay' ).addClass( 'next-o' );
			} );
			$( document ).on( 'mouseleave', '.simple-overlay .next', function(){
				$( '.simple-overlay' ).removeClass( 'next-o' );
			});
			$( document ).on( 'mouseenter', '.simple-overlay .prev', function(){
				$( '.simple-overlay' ).addClass( 'prev-o' );
			} );
			$( document ).on( 'mouseleave', '.simple-overlay .prev', function(){
				$( '.simple-overlay' ).removeClass( 'prev-o' );
			});
		}
		$( document ).on( 'click', '.simple-overlay .prev, .simple-overlay .next', function( e ){
			var $current = $( '.simple-overlay.on' ),
				direction = $( e.currentTarget ).attr( 'class' );

			if( $( e.currentTarget ).hasClass( 'touch' ) ){
				e.stopPropagation();
				direction = direction.replace( ' touch', '' );
			}

			var group = [];
			$( '.simple-overlay[ data-group="' + $( this ).closest( '.simple-overlay' ).attr( 'data-group' ) + '" ]' ).each( function(){
				group.push( {
					element: $( this ),
					i: $( this ).attr( 'data-overlay' )
				} );
			} );
			group.sort( function( a, b ){
				return a.i - b.i;
			} );

			var slidePos = false;
			for( var slide in group ){
				if( group[ slide ].i === $current.attr( 'data-overlay' ) )
					slidePos = Number( slide );
			}
			if( slidePos !== false ){
				closeSlide();
				if( direction === 'prev' ){
					if( slidePos !== 0 )
						openOverlay( group[ slidePos - 1 ].element.attr( 'data-overlay' ) );
					else
						openOverlay( group[ group.length - 1 ].element.attr( 'data-overlay' ) );
				}
				if( direction === 'next' ){
					if( slidePos < group.length - 1 )
						openOverlay( group[ slidePos + 1 ].element.attr( 'data-overlay' ) );
					else
						openOverlay( group[ 0 ].element.attr( 'data-overlay' ) );
				}
			}
		} );

		var id = 1;
		return this.each( function(){
			var overlayID = id,
				src = $( this ).attr( 'href' ),
				group =
					$( this ).attr( 'data-group' ) && ( $( 'a[ data-group="' + $( this ).attr( 'data-group' ) + '" ]' ).length > 1 ) ?
						' data-group="' + $( this ).attr( 'data-group' ) + '"' :
							'',
				groupClass =
					group ?
						' grouped' :
							'';

			// create overlays
			var img = new Image();
			img.onload = function(){
				$( 'body' ).append(
					'<div class="simple-overlay' + groupClass + '" data-overlay="' + overlayID + '"' + group + '>' +
						'<button class="close"><div><div></div></div></button>' +
						'<button class="prev touch"><div></div></button>' +
						'<button class="next touch"><div></div></button>' +
						'<div>' +
							'<div class="wrap-slide">' +
								'<figure data-natural-width="' + this.width + '" data-natural-height="' + this.height + '">' +
									'<img src="' + src + '">' +
									'<button class="prev"></button>' +
									'<button class="next"></button>' +
								'</figure>' +
							'</div>' +
						'</div>' +
					'</div>'
				);
			}
			img.src = src;

			// open
			$( this ).on( 'click', function( e ){
				e.preventDefault();

				$( 'body' ).addClass( 'simple-overlay-open' );
				$( '.simple-overlay-bg' ).fadeIn( 200 );
				setTimeout( function(){
					openOverlay( overlayID );
				}, 100 );
			} );

			// close
			function closeOverlay(){
				$( 'body' ).removeClass( 'simple-overlay-open' );
				$( '.simple-overlay-bg, .simple-overlay' ).fadeOut( 200 );
				$( '.simple-overlay.on' ).removeClass( 'on' );
			}
			$( document ).on( 'click', '.simple-overlay figure', function( e ){
				e.stopPropagation();
			} );
			$( document ).on( 'click', '.simple-overlay, .simple-overlay .close', function(){
				closeOverlay();
			} );
			$( document ).on( 'keydown', function( e ){
				if( e.keyCode == 27 ){
					closeOverlay();
				}
			});

			id++;
		} );
	};
} )( jQuery );