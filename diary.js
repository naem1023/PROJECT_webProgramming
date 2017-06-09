//auto resize diary list
var diaryListHeight = window.innerHeight-170;
$("#diaryList").height(diaryListHeight);
$(window).resize(function(){
	$("#diaryList").height(diaryListHeight);
});




var currDiaryKey = null;
var imgName = null;
var fileName = null;
var videoName = null;

//add new diary
function newDiary(){
  $("#title").val("");
  CKEDITOR.instances.editor.setData("");
  currDiaryKey = null;
  imgName = null;
  fileName = null;
  videoName = null;
}

//file upload
var fileButton  = document.getElementById('fileUpload');
var imgButton = document.getElementById('imgUpload');
var videoButton =document.getElementById('videoUpload');


//object, saving files
var img = null;
var file = null;
var video = null;

fileButton.addEventListener('change', function(e){
  //get fileButton
  var f = e.target.files[0];
  if(f != null){
  	file = f;

  	var filePath = $(this).val().split("\\");
	  var _fileName = filePath[filePath.length-1];
	  fileName = _fileName;
	  $("#fileName").show().text(_fileName);
		$("#fileP").show().text("success");	
  }
});

imgButton.addEventListener('change', function(e){
  //get fileButton
  var f = e.target.files[0];
  
  if(f != null){
  	img = f;

  	var filePath = $(this).val().split("\\");
	  var _fileName = filePath[filePath.length-1];
	  imgName = _fileName;
	  $("#imgName").show().text(_fileName);
	  $("#imgP").show().text("success");	
  }
});

videoButton.addEventListener('change', function(e){
  //get fileButton
  var f = e.target.files[0];
  if(file != null){
  	video = f;

	  var filePath = $(this).val().split("\\");
	  var _fileName = filePath[filePath.length-1];
	  videoName = _fileName;
	  $("#videoName").show().text(_fileName);
	  $("#videoP").show().text("success");	
  }
});

/*
$("#fileUpload").on('save', function(e){
	var file = e.normFile;

	//create storage ref
  var storageRef = firebase.storage().ref('file/' + currDiaryKey + '/' + file.name);
  //Upload
  storageRef.put(file);  
});
*/

function fileUpload(){
	//create storage ref
	var storageRef = firebase.storage().ref('file/' + currDiaryKey + '/' + fileName);
  //Upload
  storageRef.put(file);
}

function imgUpload(){
	//create storage ref
	var storageRef = firebase.storage().ref('img/' + currDiaryKey + '/' + imgName);
  //Upload
  storageRef.put(img);
}

function videoUpload(){
	//create storage ref
	var storageRef = firebase.storage().ref('video/' + currDiaryKey + '/' + videoName);
  //Upload
  storageRef.put(video);
}

function hashCheck(data){
	var hash = new Array();
	var _splitData = data.split('\n\n');
	var temp = new Array();
	var splitData = new Array();

	//remove tag
	//split(' ')
	_splitData.forEach(function(i){
		i = i.replace(/(<([^>]+)>)/ig,"");

		temp = i.split(' ');
		console.log(temp);
		temp.forEach(function(j){
			splitData.push(j);
		});
	});

	splitData.forEach(function(word){
		if(word.indexOf('#') == 0){
			hash.push(word);
		}	
	});

	console.log("hash : " + hash);
	return hash;
}

//text upload
var database = firebase.database();

function saveClick(){
	var ref = database.ref('diary');
	var text = CKEDITOR.instances.editor.getData();
	var title = $('#title').val();
	var hash = hashCheck(text);

  var t = new Date();
  //var now = new Date(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
  console.log(hash);
  now = -(t.getTime());
  var param = {
  	title : title,
  	content : text,
  	date : now,
  	file : fileName,
  	img : imgName,
  	video : videoName,
  	hash : hash,
  };
  
  var key = ref.push().key;
  currDiaryKey = key;

  
  //$("#fileUpload").trigger(event);
  //$("#imgUpload").trigger(event);
  //$("#videoUpload").trigger(event);
	imgUpload();

  //new diary
	if(currDiaryKey == null){
		ref.child(key).update(param);
		//ref.push(param);
		//console.log(ref.orderByChild('date').equalTo(now).parent().key);
	}
	//rewrite diary
	else{
		ref.child(currDiaryKey).update(param);
	}

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


var countList = 12;

var dbRef = firebase.database().ref('diary');


function searchHash(){
	var hash = $("#hashBox").val();
	hash = "#" + hash + "\n";
	dbRef.orderByChild("date").once('value').then(function(snapshot){
		printDiaryList(snapshot.val(), hash);
	});
}

$("#diaryList").scroll(
	function(){
		var maxHeight = $("#diaryList").prop("scrollHeight");
		var currScroll = $("#diaryList").scrollTop() + diaryListHeight;

		console.log("maxHeight " + maxHeight);
		console.log("scrollTop " + $("#diaryList").scrollTop());
		console.log("diaryListHeight" + diaryListHeight);
		console.log();
		if(maxHeight <= currScroll){
			console.log("----------------------------------------");
			countList += 5;
			dbRef.orderByChild("date").once('value').then(function(snapshot){
				printDiaryList(snapshot.val(), null);
			});
		}
	}
);

//diary update(list update)
//when db is changed, 'value' event occur
dbRef.orderByChild("date").on("value", function(data) {
	var a = data.val();
	/*
	console.log(a);
	console.log(data.key);
	console.log(Object.keys(a).length);
	var length = Object.keys(a).length;
	*/

	console.log(a);
	printDiaryList(a, null);
});

//print diary list
//demand with countList
function printDiaryList(data, hash){
	$("#diaryList").html(null);
	var i = 1;
	//temp is key

	console.log("hash is " + hash);

	//if hash saerch button isn't clicked
	if(hash == null){
		for(var temp in data){
			if(i > countList){
				break;
			}
			
			$("#diaryList").append('<li class="list-group-item"><a onClick="loadDiary(&quot;' + temp + '&quot;);"><h3>' + data[temp].title + "<small>&nbsp;&nbsp;&nbsp;" + data[temp].date + "</small></h3></a></li>");	
			i++;
		}
	}

	//if hash saerch button is clicked
	else{
		for(var temp in data){
			if(i > countList){
				break;
			}
			data[temp].hash.forEach(function(i){
				console.log(data[temp].title + "'s hash is " + i);
				if(i == hash){
					console.log("same!");
					$("#diaryList").append('<li class="list-group-item"><a onClick="loadDiary(&quot;' + temp + '&quot;);"><h3>' + data[temp].title + "<small>&nbsp;&nbsp;&nbsp;" + data[temp].date + "</small></h3></a></li>");	
					i++;
					return;
				}
			});
		}
	}
}



//load diary
function loadDiary(key){
	firebase.database().ref('diary/' + key).once('value').then(function(snapshot) {
    // handle read data.
    var data = snapshot.val();
		$("#title").val(data.title);
		CKEDITOR.instances.editor.setData(data.content);
		currDiaryKey = key;
  
  	firebase.storage().ref().child('img/' + key + '/' + data.img).getDownloadURL().then(function(url) {
		  // Or inserted into an <img> element:
		  console.log("image url : " + url);
		  var img = document.getElementById('imgBox');
		  img.src = url;
		}).catch(function(error) {
		  // Handle any errors
		  console.log(error);
		});
  });

	/*
	//get key to update uploaded files
  dbRef.once('value').then(function(snapshot){
  	var data = snapshot.val();
  	currDiaryKey = key;
  });
  */
}


//del diary
function delClick(){
	if(currDiaryKey == null){
		//no diary is wirten
	}
	else{
		var delRef = firebase.database().ref('diary');
		delRef.child(currDiaryKey).remove();
		newDiary();
	}
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

