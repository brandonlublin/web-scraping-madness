$(document).on("click", ".saveButton", function handleArticleSave() {
  var articleToSave = $(this).parents(".panel").data();
  articleToSave.saved = true;

  $.ajax({
    method: "PATCH",
    url: "/api/articles",
    data: articleToSave
  })
  .then(function(data) {
    if (data.ok){}
  })
});
