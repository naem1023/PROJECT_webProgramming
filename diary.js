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
	var ref = database.ref('diary');
	var text = CKEDITOR.instances.editor.getData();
	var title = $('#title').val();

  /*
  var date = new Date();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var year = date.getFullYear();
  var now = year + '-' + month + '-' + day;
  */
  var t = new Date();
  var now = new Date(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
  console.log(now);
  now = now.toLocaleString();
  var param = {
  	title : title,
  	content : text,
  	date : now,
  };
  ref.push(param);
  //firebaseRef.child("Text").set(text);
  //ref.update(param);


  /*
  $.ajax({
  	url : "https://wp-project-f8926.firebaseio.com/diary.json",
  	method : "PATCH",
  	data : JSON.stringify(param),
  	success : function(data){
  		console.log(data);
  	}
  });
  */
}




//diary update(list update)
var dbRef = firebase.database().ref('diary');

//when db is changed, value event occur
dbRef.on('child_added', function(data) {
	/*
	console.log("----------------");
	var list = snapshot.val();
	console.log(list);

	console.log(list[0].content);

	var data = JSON.stringify(snapshot);
	console.log(data);
	console.log(Object.keys(data).length-1);

	var keys = Object.keys(data);
	
	console.log(keys);

	var length = Object.keys(snapshot).length-1;
	for(var i=0; i<length; i++){
		$("diaryList").append('<li class="list-group-item"><h3>' + data[keys[i]] + "<small>date</small></h3></li>");	
	}
	*/

	var a = data.val();
	console.log(a);
	console.log(data.key);
	console.log(Object.keys(a).length);
	$("#diaryList").append('<li class="list-group-item"><h3>' + a.title + "<small>&nbsp;&nbsp;&nbsp;" + a.date + "</small></h3></li>");	
	
});







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
