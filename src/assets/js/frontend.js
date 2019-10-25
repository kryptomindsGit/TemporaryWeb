// $(document).ready(function () {
//   $("#menu-toggle").click(function (e) {
//     e.preventDefault();
//     $("#wrapper").toggleClass("toggled");
//   });
// });

// Dropdown list will open by Tab click
$(document).ready(function () {
    $('select').focus(function () {
        $(this).attr("size", $(this).attr("expandto"));
        var x = "select[tabindex='" + (parseInt($(this).attr('tabindex'), 10) + 1) + "']";
        $(x).fadeTo(50, 0);
    });
    $('select').blur(function () {
        $(this).attr("size", 1);
        var x = "select[tabindex='" + (parseInt($(this).attr('tabindex'), 10) + 1) + "']";
        $(x).fadeTo('fast', 1.0);
    });
});
