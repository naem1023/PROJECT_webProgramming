/*
{
  "username" : {
    "article" : [
      {
        "title" : "";
        "id" : "";
        "content" : "";
      }.
      {
        "title" : "";
        "id" : "";
        "content" : "";
      }
    ]
  }
}
*/



$("#diaryList").height(window.innerHeight-170);
$(window).resize(function(){
  $("#diaryList").height(window.innerHeight-170);
});


//file upload
var fileButton  = document.getElementById('fileUpload');
var imgButton = document.getElementById('imgUpload');
var videoButton =document.getElementById('videoUpload');

fileButton.addEventListener('change', function(e){
  //get fileButton
  var file = e.target.files[0];
  //create storage ref
  var storageRef = firebase.storage().ref('file/' + file.name);
  //Upload
  storageRef.put(file);
  $("#fileP").show().text("success");
});

imgButton.addEventListener('change', function(e){
  //get fileButton
  var file = e.target.files[0];
  //create storage ref
  var storageRef = firebase.storage().ref('img/' + file.name);
  //Upload
  storageRef.put(file);
  $("#imgP").show().text("success");
});

videoButton.addEventListener('change', function(e){
  //get fileButton
  var file = e.target.files[0];
  //create storage ref
  var storageRef = firebase.storage().ref('video/' + file.name);
  //Upload
  storageRef.put(file);
  $("#videoP").show().text("success");
});



//text upload
var database = firebase.database();

function saveClick(){
  var ref = database.ref('article');
  var text = CKEDITOR.instances.editor.getData();

  var date = new Date();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var year = date.getFullYear();
  var now = month + '-' + day + '-' + year;

  var data = {
    title : now,
    content : text
  };
  ref.push(data);
  //firebaseRef.child("Text").set(text);
}









/*
//login check
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var name, email;

    if (user != null) {
      name = user.displayName;
      email = user.email;
    }

    $("#currUserName").text(email);
  } else {
    // No user is signed in.
  }
});
*/

/*
//sign out
$("#signOut").click(
  function(){
    console.log("aa");
    firebase.auth().signOut().then(function(){
    //Sign out success
      location.href = "login.html";
    }, function(error){
      alert(error);
    });
  }
);
*/
