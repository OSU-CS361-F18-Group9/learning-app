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
  
  $("#usertype").change(onChangeUsertype);
})