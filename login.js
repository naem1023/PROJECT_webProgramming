//sign in
$("#signInBtn").click(
	function(){
		var email = $("#loginEmail").val();
		var pwd = $("#loginPwd").val();

		if(email != "" && pwd != ""){
			firebase.auth().signInWithEmailAndPassword(email, pwd).catch(function(error){
				console.log(error.message);
  				$("#loginErr").show().text(error.message);
			});	
		}
	}
);


//if login, go to diary
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    location.href = "diary.html";
  } else {
    // No user is signed in.
  }
});