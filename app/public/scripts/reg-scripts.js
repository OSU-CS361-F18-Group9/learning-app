$(document).ready(function(){
  function onChangeUsertype() {
    // If parent is selected, show student e-mail field
    if ($("select#usertype").val() == "3") {
      $("div#student_email_row").show();
    }
    else {
      $("div#student_email_row").hide();
    }
  }

  function validateEmail(email) {
    var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return re.test(email);
  }

  function validInputs() {
    var errors = "";
    if (!$("input#first_name").val().match(/[a-z]/i)) {
      errors += "<li>Need a first name</li>";
    }
    if (!$("input#last_name").val().match(/[a-z]/i)) {
      errors += "<li>Need a last name</li>";
    }
    if (!validateEmail($("input#email").val())) {
      errors += "<li>Need an e-mail address</li>";
    }
    if ($("select#usertype").val() == "0") {
      errors += "<li>Need to select if you are a student, teacher, or parent</li>";
    }
    if (!$("input#password").val().match(/[a-z]/i)) {
      errors += "<li>Need a password</li>";
    }
    if ($("input#password_confirmation").val() != $("input#password").val()) {
      errors += "<li>Passwords must match</li>";
    }
    if ($("select#usertype").val() == "3" && !validateEmail($("input#student_email").val())) {
      errors += "<li>Need to enter in your student's e-mail</li>";
    }
    $("ul#errors").html(errors);
    if (errors === "") {
      return true;
    }
    else {
      return false;
    }
  }

  function onRegister() {
    // Reference the following for explanation on redirection:
    // http://bit.ly/2ANIB4x
    if (validInputs()) {
      $.ajax({
        type: "POST",
        url: '/register/new_user',
        data: $("#regForm").serialize(),
        dataType: 'JSON'
      }).success(function(data, textStatus, req) {
        if(data.msg === "redirect") {
          window.location = data.location;
        }
      });
    }
  }
  
  $("#usertype").change(onChangeUsertype);
  $("input#register").click(onRegister);
});