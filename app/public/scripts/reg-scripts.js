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
    if (!$("input#first_name").val().match(/[a-z]/i)) {
      return false;
    }
    if (!$("input#last_name").val().match(/[a-z]/i)) {
      return false;
    }
    if (!validateEmail($("input#email").val())) {
      return false;
    }
    if ($("select#usertype").val() == "0") {
      return false;
    }
    if (!$("input#password").val().match(/[a-z]/i)) {
      return false;
    }
    if ($("input#password_confirmation").val() != $("input#password").val()) {
      return false;
    }
    if ($("select#usertype").val() == "3" && !validateEmail($("input#student_email").val())) {
      return false;
    }
    return true;
  }

  function onRegister() {
    if (validInputs()) {
      console.log("True");
    }
    else {
      console.log("False");
    }
  }
  
  $("#usertype").change(onChangeUsertype);
  $("input#register").click(onRegister);
});