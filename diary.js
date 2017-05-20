$("#diaryList").height(window.innerHeight-170);
$(window).resize(function(){
	$("#diaryList").height(window.innerHeight-170);
});


var currDiaryKey;

//file upload
var fileButton  = document.getElementById('fileUpload');
var imgButton = document.getElementById('imgUpload');
var videoButton =document.getElementById('videoUpload');

fileButton.addEventListener('change', function(e){
  //get fileButton
  var file = e.target.files[0];
  //create storage ref
  var storageRef = firebase.storage().ref('file/' + currDiaryKey + '/' + file.name);
	//Upload
	storageRef.put(file);
	$("#fileP").show().text("success");
});

imgButton.addEventListener('change', function(e){
  //get fileButton
  var file = e.target.files[0];
  //create storage ref
  var storageRef = firebase.storage().ref('img/' + currDiaryKey + '/' + file.name);
  //Upload
  storageRef.put(file);
  $("#imgP").show().text("success");
});

videoButton.addEventListener('change', function(e){
  //get fileButton
  var file = e.target.files[0];
  //create storage ref
  var storageRef = firebase.storage().ref('video/' + currDiaryKey + '/' + file.name);
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

//when db is added, 'child_added' event occur
dbRef.on('child_added', function(data) {
	var a = data.val();
	/*
	console.log(a);
	console.log(data.key);
	console.log(Object.keys(a).length);
	*/
	$("#diaryList").append('<li class="list-group-item"><a onClick="loadDiary(&quot;' + data.key + '&quot;);"><h3>' + a.title + "<small>&nbsp;&nbsp;&nbsp;" + a.date + "</small></h3></a></li>");	
	
});


//load diary
function loadDiary(key){
	firebase.database().ref('diary/' + key).once('value').then(function(snapshot) {
    // handle read data.
    var data = snapshot.val();
		$("#title").val(data.title);
		CKEDITOR.instances.editor.setData(data.content);
		
  });

  dbRef.once('value').then(function(snapshot){
  	var data = snapshot.val();
  	console.log(data[key]);
  	currDiaryKey = key;
  });
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
