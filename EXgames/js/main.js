$(document).ready(function () {

    $('#pagination-demo').twbsPagination({
		
        totalPages: "35", //total number of pages
        visiblePages: "10", // number of pages can be seen on html
        onPageClick: function (event, page) {
            alert("Page: "+page+" was clicked");
			changeThumb('thumb1',1,2,"123",12);
			
        }
    });
	
});

function changeThumb(thumbNum,price,itemName,description,thumbReview){
	$('#'+thumbNum+' h3').html(price);
	$('#'+thumbNum+' h4').html(itemName);
	$('#'+thumbNum+' #thumbDescription').text(description);
	$('#'+thumbNum+' #thumbReview').text(thumbReview);
};