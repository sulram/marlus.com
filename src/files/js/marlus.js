var timer, resizer;

$(function () {

    // TAG CLOUD PLUGIN

    $.fn.tagcloud.defaults = {
        size: {start: 11, end: 16, unit: 'pt'},
        color: {start: '#999', end: '#444'}
    };

    $('#tags a').tagcloud();

    // ISOTOPE PLUGIN

    var iso = $('#isotope');
    iso.isotope({
        // options
        itemSelector : 'article',
        layoutMode : 'masonry'
    });
    iso.filter = function(filter){
        if(filter!='none'){
            $('#yield').fadeOut(500,function(){
                $(this).html('');
            });
            $('#tags a.active').removeClass('active');
            $('#tags a[data-slug='+filter+']').addClass('active');
        }
        $('#tags.highlight').removeClass('highlight');
        
        iso.isotope({ filter: '.' + filter });
    };

    // LEARN FILTER

    $('#isotope .item').each(function(i,item){
        $(item).find('.tags li').each(function(j,tag){
            $(item).addClass($(tag).text());
        });
        $(item).find('.tags').remove();
    });

    // TAG CLICK

    $('#header h1 a, #tags a').mousedown(function(e){
        e.preventDefault();
        iso.filter($(this).attr('data-slug'));
    }).click(function(e){
        e.preventDefault();
    });

    // PROJECT CLICK

    $('#isotope article a').mousedown(function(e){
        e.preventDefault();
        iso.filter('none');
        $('#yield').load($(this).attr('href') + ' #content > *',function(){
            formatDates();
            highlightTags();
            $('#yield').hide(0).fadeIn(500);
            $("#yield").fitVids();
            console.log(arguments);
        });
    }).click(function(e){
        e.preventDefault();
    });

    function highlightTags(){
        $('#yield .tags li').each(function(j,tag){
            var tagslug = $(tag).text();
            $('#tags').addClass('highlight');
            $('#tags a[data-slug='+tagslug+']').addClass('active');
        });
        $('#yield .tags').remove();
    }

    // DATE PLUGIN

    moment.lang('pt-br');

    // DATE FORMAT

    formatDates();

    $(window).resize(function(){
        clearTimeout(timer);
        timer = setTimeout(function(){
            window.resizer();
        },100);
    });

    resizer = function(){
        iso.isotope({
            itemSelector : 'article',
            layoutMode : $(window).width() < 580 ? 'spineAlign' : 'masonry'
        });
    };

    resizer();

});

function formatDates(){
    if($('.date').length){
        $('.date').text(formatOneDate($('.date').text()));
    }
}

function formatOneDate(date){
    return moment(date).add('day',1).format("MMMM YYYY")
}