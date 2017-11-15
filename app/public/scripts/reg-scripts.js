$(document).ready(function(){
  function onChangeUsertype() {
    if ($("select#usertype").val() == "0") {
      $("div#parent_email_row").hide();
      $("div#teacher_email_row").hide();
      $("div#student_email_row").hide();
    }
    // If student is selected, show parent and teacher e-mail fields
    else if ($("select#usertype").val() == "1") {
      $("div#parent_email_row").show();
      $("div#teacher_email_row").show();
      $("div#student_email_row").hide();
    }
    // If teacher is selected, hide all
    else if ($("select#usertype").val() == "2") {
      $("div#parent_email_row").hide();
      $("div#teacher_email_row").hide();
      $("div#student_email_row").hide();
    }
    // If parent is selected, show student e-mail field
    else if ($("select#usertype").val() == "3") {
      $("div#parent_email_row").hide();
      $("div#teacher_email_row").hide();
      $("div#student_email_row").show();
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
    if (errors == "") {
      return true;
    }
    else {
      return false;
    }
  }

  function onRegister() {
    // TODO: This should POST to the backend
    if (validInputs()) {
      console.log("True");
    }
  }
  
  $("#usertype").change(onChangeUsertype);
  $("input#register").click(onRegister);
});