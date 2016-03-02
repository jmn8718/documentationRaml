$(function(){
    $(".default-logo").removeAttr("href");
    var a=$(window);
    a.scroll(function(){
        if(a.scrollTop()==0){
            $('.genoa-heading').removeClass('compact-head');
            $('.genoa-navbar').removeClass('compact-navbar');
            $('.search-form').removeClass('compact-search');
            $('.genoa-content').removeClass('compact-content');
            $('.breadcrumb').closest('.portlet').removeClass('compact-breadcrumb');
            $('.api-console-header').closest('.api-console').removeClass('compact-api-header');
        }
        else {
            $('.genoa-heading').addClass('compact-head');
            $('.genoa-navbar').addClass('compact-navbar');
            $('.search-form').addClass('compact-search');
            $('.genoa-content').addClass('compact-content');
            $('.breadcrumb').closest('.portlet').addClass('compact-breadcrumb');
            $('.api-console-header').closest('.api-console').addClass('compact-api-header');
        }
    });

    $(".collapse.nav-collapse").click(function() {
        if($(window).width()<1024) {
            if($('.genoa-navbar').hasClass('genoa-navbar--displayed-mobile')) {
                $('.genoa-navbar').removeClass('genoa-navbar--displayed-mobile');
                $('body').removeClass('traslated');
            }
            else {
                $('.genoa-navbar').addClass('genoa-navbar--displayed-mobile');

                $('body').addClass('traslated');}
        }
    });
    $(".share>a").click(function() {
        $(".share").addClass("share--displayed");
    });

    $( window ).resize(function() {
        if($(window).width()>1024) {
            $('body').removeClass('traslated');
            $('.genoa-navbar').removeClass('genoa-navbar--displayed-mobile');
        }
    });

});