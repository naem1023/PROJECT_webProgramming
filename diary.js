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
  imgN = null;
  file = null;
	video = null;

	var img = document.getElementById('imgBox');
	img.src = null;
}

//file upload
var fileButton  = document.getElementById('fileUpload');
var imgButton = document.getElementById('imgUpload');
var videoButton =document.getElementById('videoUpload');


//object, saving files
var img = null;
var isImgEx = false;
var file = null;
var isFileEx = false;
var video = null;
var isVideoEx = false;

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



function fileUpload(){
	if(file != null && isFileEx == false){
		//create storage ref
		var storageRef = firebase.storage().ref('file/' + currDiaryKey + '/' + fileName);
	  //Upload
	  storageRef.put(file);	
	}
}

function imgUpload(){
	if(img != null && isImgEx == false){
		//create storage ref
		var storageRef = firebase.storage().ref('img/' + currDiaryKey + '/' + imgName);
	  //Upload
	  storageRef.put(img);	
	}
}

function videoUpload(){
	if(video != null && isVideoEx == false){
		//create storage ref
		var storageRef = firebase.storage().ref('video/' + currDiaryKey + '/' + videoName);
	  //Upload
	  storageRef.put(video);	
	}
}

function hashCheck(data){
	var hash = new Array();
	var firstSplit = data.split('\n\n');
	var secondSplit = new Array();
	var temp = new Array();
	var splitData = new Array();

	//remove tag
	//split(' ')
	firstSplit.forEach(function(i){
		i = i.replace(/(<([^>]+)>)/ig,"");

		temp = i.split(' ');
		
		temp.forEach(function(j){
			secondSplit.push(j);
		});
	});

	secondSplit.forEach(function(i){
		temp = i.split('\n');
		
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

	var title = $('#title').val();
	console.log("title : " + title);
	if(title == ""){
		alert("일기장의 제목을 입력해주세요.");
		return;
	}

	var text = CKEDITOR.instances.editor.getData();
	var hash = hashCheck(text);

  var t = new Date();
  //var now = new Date(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
  var now, parm;
   
  if(currDiaryKey == null){
  	now = -(t.getTime());
  	param = {
	  	title : title,
	  	content : text,
	  	date : now,
	  	file : fileName,
	  	img : imgName,
	  	video : videoName,
	  	hash : hash,
  	};
  }
  else{
  	param = {
	  	title : title,
	  	content : text,
	  	file : fileName,
	  	img : imgName,
	  	video : videoName,
	  	hash : hash,
  	};
  }
  
  var key;
  if(currDiaryKey == null){
  	key = ref.push().key;
  	currDiaryKey = key;
  }

	imgUpload();
	fileUpload();
	videoUpload();

  //new diary
	if(currDiaryKey == null){
		ref.child(key).update(param);
	}
	//rewrite diary
	else{
		ref.child(currDiaryKey).update(param);
	}

	if(isImgEx){
		var hi = null;
		if(currDiaryKey == null)
			hi = key;
		else
			hi = currDiaryKey;

		firebase.storage().ref().child('img/' + hi + '/' + imgName).getDownloadURL().then(function(url) {
		  var downImg = document.getElementById('imgBox');
		  downImg.src = url;
		}).catch(function(error) {
		  // Handle any errors
		  console.log(error);
		});	
  }
  

	//init files' nmae
	file = null;
	img = null;
	video = null;

	window.scrollTo(0,0);
}


var countList = 12;

var dbRef = firebase.database().ref('diary');


function searchHash(){
	var hash = $("#hashBox").val();
	hash = "#" + hash;
	dbRef.once('value').then(function(snapshot){
		printDiaryList(snapshot.val(), hash);
	});
}

$("#diaryList").scroll(
	function(){
		var maxHeight = $("#diaryList").prop("scrollHeight");
		var currScroll = $("#diaryList").scrollTop() + diaryListHeight;

		/*
		console.log("maxHeight " + maxHeight);
		console.log("scrollTop " + $("#diaryList").scrollTop());
		console.log("diaryListHeight" + diaryListHeight);
		console.log();
		*/
		if(maxHeight <= currScroll){
			countList += 5;
			dbRef.once('value').then(function(snapshot){
				printDiaryList(snapshot.val(), null);
			});
		}
	}
);

//diary update(list update)
//when db is changed, 'value' event occur
dbRef.on("value", function(data) {
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


function order(data){
	var min = 0;
	var orderData = new Array();
	var length = Object.keys(data).length;
	var del = null;

	//bubble sort
	for(var i=0; i<length; i++){
		for(var j in data){
			if(data[j].date < min){
				min = data[j].date
				del = j;
			}
		}
		if(del != null){
			orderData[del] = data[del];
			delete data[del];
			min = 0;
		}
	}
	return orderData;
}

//print diary list
//demand with countList
function printDiaryList(data, hash){
	$("#diaryList").html(null);
	var i = 1;
	var diaryDate = null;
	var hashString = null;
	//temp is key

	if(data == null)
		return;
	data = order(data);
	//if hash saerch button isn't clicked
	if(hash == null){
		for(var temp in data){
			if(i > countList){
				break;
			}
			diaryDate = new Date(-data[temp].date);
			hashString = "";
			console.log(data[temp].hash);

			if(data[temp].hash != null){
				data[temp].hash.forEach(function(i){
					hashString += i + " ";
				});	
			}
			

			$("#diaryList").append('<li class="list-group-item"><a onClick="loadDiary(&quot;' + temp + '&quot;);"><h3>' + data[temp].title + "<small>&nbsp;&nbsp;&nbsp;" + hashString + "&nbsp;&nbsp;" + diaryDate.toLocaleString() + "</small></h3></a></li>");	
			i++;
		}
	}

	//if hash saerch button is clicked
	else{
		for(var temp in data){
			if(i > countList){
				break;
			}
			if(data[temp].hash != null){
				data[temp].hash.forEach(function(i){
					if(i == hash){
						hashString = "";
						data[temp].hash.forEach(function(i){
							hashString += i + " ";
						});	

						diaryDate = new Date(-data[temp].date);
						$("#diaryList").append('<li class="list-group-item"><a onClick="loadDiary(&quot;' + temp + '&quot;);"><h3>' + data[temp].title + "<small>&nbsp;&nbsp;&nbsp;" + hashString + "&nbsp;&nbsp;" + diaryDate.toLocaleString() + "</small></h3></a></li>");	
						i++;
						return;
					}
				});	
			}
		}
	}
}


//load diary
function loadDiary(key){
	if(window.innerWidth < 992)
		window.scrollTo(0,$("#diaryList").prop("scrollHeight") + 110);

	firebase.database().ref('diary/' + key).once('value').then(function(snapshot) {
    // handle read data.
    console.log(key);
    var data = snapshot.val();
		$("#title").val(data.title);
		CKEDITOR.instances.editor.setData(data.content);
		currDiaryKey = key;
  
  	var downImg = document.getElementById('imgBox');
		downImg.src = null;

  	if(data.img != null){
  		firebase.storage().ref().child('img/' + key + '/' + data.img).getDownloadURL().then(function(url) {			  
			  downImg.src = url;
			  isImgEx = true;
			}).catch(function(error) {
			  // Handle any errors
			  console.log(error);
			});	
  	}

  	if(data.file != null){
  		firebase.storage().ref().child('file/' + key + '/' + data.file).getDownloadURL().then(function(url) {
			  isFileEx = true;
			}).catch(function(error) {
			  // Handle any errors
			  console.log(error);
			});	
  	}

  	if(data.img != null){
  		firebase.storage().ref().child('img/' + key + '/' + data.img).getDownloadURL().then(function(url) {
			  isVideoEx = true;
			}).catch(function(error) {
			  // Handle any errors
			  console.log(error);
			});	
  	}
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

