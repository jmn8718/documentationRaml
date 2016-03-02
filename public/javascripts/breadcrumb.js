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

});
