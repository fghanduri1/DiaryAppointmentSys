//the document ready function
var baseURL = "appointment"

	
	
	
	
try {
	$(function() {
		init();
	});
} catch (e) {
	alert("*** jQuery not loaded. ***");
}

//
// Initialise page.
//





function init() {

	
//------------------------------------ADD A NEW APPOINTMENT-----------------------------------------
	// make dialog box
	$("#addAppointment").dialog({
		modal : true, // modal dialog to disable parent when dialog is active
		autoOpen : false, // set autoOpen to false, hidding dialog after
		// creation
		title : "Add Appointment", // set title of dialog box
		minWidth : 500,
		minHeight : 400
	});

	// set click handler of Add City button
	$("#addNewAppointment").click(function() {
		$("#addOwner").val(""); // clear city name text input
		$("#addDescription").val("");
		$("#addDate").val("");
		$("#addDuration").val("");
		//updateAppointment($(this).attr("id"));
		$("#addAppointment").dialog("open", true); // open dialog box
	});
	// set click handler of Save Appointment button in Add appointment dialog
	$("#saveAppointment").click(function() {
		saveAppointment(); // save city to web service
		$("#addAppointment").dialog("close");
	});

	// set click handler of Cancel button in Add appointment dialog
	$("#cancel").click(function() {
		$("#addAppointment").dialog("close");
	});

	// set click handler of Save appointment button in Add appointment dialog
	
	
	
//----------------------------SHOW APPOINTMENT&&DIALOG------------------------------------------
	//show appointment dialof box
	$("#showAppointment").dialog({
		modal : true, // modal dialog to disable parent when dialog is active
		autoOpen : false, // set autoOpen to false, hidding dialog after
		// creation
		title : "Show Appointment", // set title of dialog box
		minWidth : 500,
		minHeight : 400
	});
	
//setting the clicker handle for show new appointment
	$("#showNewAppointment").click(function() {
		$("#ownerz").val(""); // clear city name text input
		$("#startD").val("");
		$("#endD").val("");
		$("#showAppointment").dialog("open", true); // open dialog box
	});

	//cancel button for show appointment pop up
	$("#cancelShowAppointment").click(function() {
		$("#showAppointment").dialog("close");
	});

	
	//showing the specified appoitment
	// using the showall appointments function
	$("#showAppointmentDialogButton").click(function() {
		showAllAppointments(); // save city to web service
		$("#showAppointment").dialog("close");
	});



//------------------------------DELETE BUTTON-----------------------------------
	$("#deleteAppointment").click(function() 
			{
		$("#appointmentsList .selected").each(function() {
			deleteAppointment($(this).attr("id"));
			$(this).remove();
		});
	});

	
	
//--------------------------------UPDATE APPOINTMENT SECTION--------------------------------------------------
	
	$("#updateAppointment").dialog({
		modal : true, // modal dialog to disable parent when dialog is active
		autoOpen : false, // set autoOpen to false, hidding dialog after
		// creation
		title : "Update Appointment", // set title of dialog box
		minWidth : 500,
		minHeight : 400
		
	});
	
	
	
	
	
	
	$("#cancleUpdateAppointment").click(function() {
		$("#updateAppointment").dialog("close");
	});
	
	
	$("#updateAppointmentDialogButton").click(function() {
		$("#appointmentsList .selected").each(function()
				{
				updateAppointment($(this).attr("id"));
				});
		
		$("#updateAppointment").dialog("close");
	});
	

	
	//setting the clicker handle for show new appointment
	$("#updateNewAppointment").click(function() {
	
		var cross = new Array();
		
		$("#appointmentsList .selected").each(function(){
			var dataP = $("#"+ $(this).attr("id")).find('li');
			dataP.each(function() { cross.push($(this).text()); });
			
			console.log($(this).attr("id"));
		});
		
		console.log(cross[0]);
		console.log(cross[1]);
		console.log(cross[2]);
		console.log(cross[3]);
		
		$("#newUpdateDate").val(cross[0]); // clear city name text input
		$("#newUpdateDuration").val(cross[1]);
		$("#newUpdateDescription").val(cross[2]);
		$("#newUpdateowner").val(cross[3]);
		
		$("#updateAppointment").dialog("open", true); // open dialog box
	});
	
}



//-----------------------------------DATE TO PICKER METHODS--------------------------

$(function() {
	$("#addDate").datepicker();

});

$(function() {
	$("#startDateShowAppointment").datepicker();

});

$(function() {
	$("#endDateShowAppointment").datepicker();
});


$(function(){
	$("#newUpdateDate").datepicker();
});

//----------------------SAVE APPOINTMENT FUNCTION-----------------------------

function saveAppointment() {
	
	
	var date = $("#addDate").val();
	var duration = $("#addDuration").val();
	var description = $("#addDescription").val();
	var owner = $("#addOwner").val();

	console.log(date);

	var s = date.split("/");

	//console.log("s to string " + s);

	var dateU = new Date(Date.UTC(s[2], (s[0]*1-1), (s[1]), 0, 0, 0)).getTime();
	
	var dateU = dateU / 1000;
	
	console.log("Test: " + dateU);


	var url = baseURL + "/appointments";
	var data = {
		"dateTime":dateU,
		"duration":duration,
		"description":description,
		"owner":owner
	};

	$.post( url, data, function() {
		alert("Appointment has been Saved!")
	});

}

//---------------------------SHOW ALL APPOINTMENTS FUNCTIOIN----------------------------

function showAllAppointments() {
	
	var startDate = $("#startDateShowAppointment").val();
	var endDate = $("#endDateShowAppointment").val();
	var owner = $("#ownerShowAppointment").val();
	
	console.log("Testtsssssss");

	var splitStartDate = startDate.split("/");
	unixStartDate = new Date(Date.UTC(splitStartDate[2],(splitStartDate[0] * 1 - 1), (splitStartDate[1]), 0, 0, 0)).getTime();

	var unixStartDateDivided = unixStartDate / 1000;

	var splitEndDate = endDate.split("/");
	unixEndDate = new Date(Date.UTC(splitEndDate[2], (splitEndDate[0] * 1 - 1),(splitEndDate[1]), 0, 0, 0)).getTime();
	var unixEndDateDivided = unixEndDate / 1000;

	var url = baseURL + "/appointments/search/start="+ unixStartDateDivided +"&end="+unixEndDateDivided+"&owner="+ owner;

	$.getJSON(url, // URL of service
	function(appointments) // successful callback function
	{
		$("#appointmentsList").empty(); // find city list and remove its
		// children
		for (var i in appointments) {
			var appointment = appointments[i]; // get 1 city from the JSON list
			var id = appointment["id"]; // get city ID from JSON data
			var dateTime = appointment["dateTime"]; // get city name from
			// data
			var owner = appointment["owner"];
			var duration = appointment["duration"];
			var description = appointment["description"];
			// compose HTML of a list item using the city ID and name.
			var htmlCode = "<li id='"+id+"' > "+ "Date Time   " +dateTime+ "   |   "+ "Duration    "+duration+"   |   "+"Owner    "+owner+"  |   "+"Description     "+description  +"</li>";
			//var htmlCode="<li id='"+id+"'>"+duration+"</li>";
			$("#appointmentsList").append(htmlCode); // add a child to the
										
			// listS
		}
		
		$("#appointmentsList li").click(function()
				{
	
			appointmentClicked($(this).attr("id"));
				} //end click handler function
		);
		

	}); // end Ajax call
	

} 

//---------------------------------------------APPOINTMENTS CLICKED FUNCTION---------------------------

function appointmentClicked(id){
	$("#appointmentsList li").removeClass("selected");
	//console.log("testing click" + id);
	$("#"+id).addClass("selected");	
}



//---------------------------DELETE APPOINTMENTS FUNCTIONS------------------
function deleteAppointment(id)
{
	var url=baseURL+"/appointments/delete/id="+id;
	var settings= {type:"DELETE"};
	$.ajax(url,settings);
}



//-------------------UPDATE APPOINTMENT FUNCTION-------------------


function updateAppointment(id){

	var dateUpdate = $("#newUpdateDate").val();
	var durationUpdate = $("#newUpdateDuration").val();
	var ownerUpdated = $("#newUpdateowner").val();
	var descriptionUpdated = $("#newUpdateDescription").val();
	
	
	var url = baseURL +"/appointments/updates";
	
	console.log("test");
	
	
	
	var x = dateUpdate.split("/");
	console.log("x to string " + x);
	var dateUx = new Date(Date.UTC(x[2], (x[0] * 1 - 1), (x[1] * 1 - 1), 0, 0, 0)).getTime();

	console.log("Test: " + dateUx);

	var dateUx = dateUx / 1000;
	
	
	var data = {
			"id":id,
			"dateTime":dateUx,
			"duration":durationUpdate,
			"description":descriptionUpdated,
			"owner":ownerUpdated
		};
	$.post(url, data, function(){
		alert("Appointment Updated");
	});
}




