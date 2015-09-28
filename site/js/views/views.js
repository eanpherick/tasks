var GUI = (function() { //IIFE for all Views



  // generic ctor to represent interface:
  function GUI(el) {
    $.get("/", function(data) {
      app.currentUser = new UserModel(data);
      if (app.currentUser.get("username") === "") {
        new LoginView();
      } else {
        new HomePageView({user: app.currentUser});
      }
    });
  }

  return GUI;
} ())
