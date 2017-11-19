$(document).ready(function(){
  function validateEmail(email) {
    var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return re.test(email);
  }

  function validInputs() {
    var errors = "";
    if (!validateEmail($("input#email").val())) {
      errors += "<li>Need an e-mail address</li>";
    }
    
    if (!$("input#password").val().match(/[a-z]/i)) {
      errors += "<li>Need a password</li>";
    }
    
    $("ul#errors").html(errors);
    if (errors === "") {
      return true;
    }
    else {
      return false;
    }
  }

  function onLogin() {
    if (validInputs()) {
      $.ajax({
        type: "POST",
        url: '/login',
        data: $("#LoginForm").serialize(),
        dataType: 'JSON'
      }).success(function(data, textStatus, req) {
        if(data.msg === "redirect") {
          window.location = data.location;
        }
      });
    }
  }
  
  $("input#login").click(onLogin);
});