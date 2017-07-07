$(document).ready(function(){
  $('.detailArticle').on('click', function(e){
    $target = $(e.target);
    // console.log($target.attr('data-id'));
    const id = $target.attr('data-id');
    $.ajax({
      type: 'DELETE',
      url: '/articles/'+id,
      success: function(response){
        alert('Article Deleted');
        window.location.href='/articles/all'
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});
