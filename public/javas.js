

$(document).ready(function(){  
    //var socket = io.connect("http://localhost:3000");
	var socket = io.connect("https://dry-plateau-96049.herokuapp.com");
	
    var ready = false;

    $("#submit").submit(function(e) {
		e.preventDefault();
		var name = $("#nickname").val();
		if(name.length > 0){
			var time = new Date();

			$("#nick").fadeOut();
			$("#chat").fadeIn();

			$("#name").html(name);
			$("#time").html('First login: ' + time.getHours() + ':' + time.getMinutes());

			ready = true;
			socket.emit("join", name);
		}
	});



	$("#textarea").keypress(function(e){
        if(e.which == 13) {
        	var text = $("#textarea").val();
        	$("#textarea").val('');
			var time = new Date();
				if(text.length>0){
					$(".chat").append('<li class="self"><div class="msg"><span>' + $("#nickname").val() + ':</span><p>' + text + '</p><time>' + time.getHours() + ':' + time.getMinutes() + '</time></div></li>');
					
					socket.emit("send", text);
					// automatically scroll down
					document.getElementById('bottom').scrollIntoView();
					//updateScroll();
				}
		}
    });


	$(document).on("click", "#enviar", function(e){
		var text = $("#textarea").val();
		if(text.length>0){
			$("#textarea").val('');
			var time = new Date();

			$(".chat").append('<li class="self"><div class="msg"><span>' + $("#nickname").val() + ':</span><p>' + text + '</p><time>' + time.getHours() + ':' + time.getMinutes() + '</time></div></li>');
				
			socket.emit("send", text);
			
			document.getElementById('bottom').scrollIntoView();
		}
	});

    socket.on("update", function(msg) {
    	if (ready) {
    		$('.chat').append('<li class="info" align="center">' + msg + '</li>')
    	}
    }); 

    socket.on("chat", function(client,msg) {
    	if (ready) {
				var time = new Date();
				$(".chat").append('<li class="field"><div class="msg"><span>' + client + ':</span><p>' + msg + '</p><time>' + time.getHours() + ':' + time.getMinutes() + '</time></div></li>');
			
    	}
    });


});
