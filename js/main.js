$(document).ready(function () {
    $('#pagination-demo').twbsPagination({
		
        totalPages: "35", //total number of pages
        visiblePages: "10", // number of pages can be seen on html
        onPageClick: function (event, page) {
            alert("Page: "+page+" was clicked");
        }
    });
});

