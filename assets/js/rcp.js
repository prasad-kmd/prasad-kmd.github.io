jQuery(function ($) {
  // --- RIGHT CLICK PROTECTION //
  function RightClickProtection(selector) {
    if (jQuery(selector).length) {
      let $this = jQuery(selector);
      let rcp_message = $this.children().length ? true : false;
      let rcp_timer = null;
      jQuery(document).on("contextmenu", function (e) {
        if (rcp_timer !== null) {
          clearInterval(rcp_timer);
        }
        e.preventDefault();
        if (rcp_message) {
          document.body.classList.add("rcp-show");
          rcp_timer = setInterval(function () {
            document.body.classList.remove("rcp-show");
            clearInterval(rcp_timer);
          }, 2000);
        }
      });
      if (rcp_message) {
        $this.on("click", function (e) {
          e.preventDefault();
          document.body.classList.remove("rcp-show");
        });
      }

      jQuery(document).on("keyup", function (e) {
        if (e.keyCode === 27) {
          if (document.body.classList.contains("rcp-show")) {
            document.body.classList.remove("rcp-show");
          }
        }
      });
    }
  }
  $(document).ready(function () {
    RightClickProtection(".pmbsweb-rcp-wrap");
  });
});
