var GUI = (function() { //IIFE for all Views

  // generic ctor to represent interface:
  function GUI(el) {
    $.get("/", function(data) {
      app.currentUser = new app.UserModel(data);
      if (app.currentUser.get("username") === "") {
        new app.LoginView();
      } else {
        new app.HomePageView({user: app.currentUser});
      }
    });
  }

  return GUI;
} ())
