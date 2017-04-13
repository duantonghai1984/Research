

(function($){
	$.extend($.fn,{jSlider:function(setting){
		var ps=$.extend({
			renderTo:$(document.body),
			enable:true,
			initPosition:'max',
			size:{barWidth:200,sliderWidth:5},
			barCssName:'defaultbar',
			completeCssName:'jquery-completed',
			sliderCssName:'jquery-jslider',
			sliderHover:'jquery-jslider-hover',
			onChanging:function(){},
			onChanged:function(){}
		},setting);
		ps.renderTo=(typeof ps.renderTo=='string'?$(ps.renderTo):ps.renderTo);
		var sliderbar=$('<div><div>&nbsp;</div><div>&nbsp;</div></div>')
		              .attr('class',ps.barCssName)
		                .css('width',ps.size.barWidth)
		                  .appendTo(ps.renderTo);
		var completedbar = sliderbar.find('div:eq(0)')
        .attr('class', ps.completedCssName);

		var slider = sliderbar.find('div:eq(1)')
			.attr('class', ps.sliderCssName)
			    .css('width', ps.size.sliderWidth);
		
		var bw=sliderbar.width(); sw=slider.width();
		ps.limited={min:0,max:bw-sw};
		
		if (typeof window.$sliderProcess == 'undefined') {
            window.$sliderProcess = new Function('obj1', 'obj2', 'left',
                                             'obj1.css(\'left\',left);obj2.css(\'width\',left);');
        }
        $sliderProcess(slider, completedbar, eval('ps.limited.' + ps.initPosition));
        
        //drag and drop
        var slide={
        		drag:function(e){
        	          var d=e.data;
        	          var l = Math.min(Math.max(e.pageX - d.pageX + d.left, ps.limited.min), ps.limited.max);
        	          $sliderProcess(slider, completedbar, l);
        	          //push two parameters: 1st:percentage, 2nd: event
        	          ps.onChanging(l / ps.limited.max, e);
        			},
        		
        		drop:function(e){
        				 slider.removeClass(ps.sliderHover);
                         //push two parameters: 1st:percentage, 2nd: event
                         ps.onChanged(parseInt(slider.css('left')) / ps.limited.max, e);

                         $().unbind('mousemove', slide.drag).unbind('mouseup', slide.drop);
                     }
        };
        
        if(ps.enable){
        	slider.bind('mousedown',function(e){
        		var d={
        			left:parseInt(slider.css('left')),
        			pageX:e.pageX
        		};
        		$(this).addClass(ps.sliderHover);
        		$().bind('mousemove', d, slide.drag).bind('mouseup', d, slide.drop);
        	});
        }
        slider.data = { bar: sliderbar, completed: completedbar };
        return slider;
	},
	
	setSliderValue: function(v, callback) {
        try {
            //validate
            if (typeof v == 'undefined' || v < 0 || v > 1) {
                throw new Error('\'v\' must be a Float variable between 0 and 1.');
            }

            var s = this;

            //validate 
            if (typeof s == 'undefined' ||
                typeof s.data == 'undefined' ||
                    typeof s.data.bar == 'undefined') {
                throw new Error('You bound the method to an object that is not a slider!');
            }

            $sliderProcess(s, s.data.completed, v * s.data.bar.width());

            if (typeof callback != 'undefined') { callback(v); }
        }
        catch (e) {
            alert(e.message);
        }
    }
});
})(jQuery);