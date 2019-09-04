
// $(document).ready(function () {
//     $('#sidebarCollapse').on('click', function () {
//         $('#sidebar').toggleClass('active');
//     });
// });

$(function() {
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
});
