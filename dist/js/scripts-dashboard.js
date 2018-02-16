$(document).ready(function () {
    
    // ESPELHO DO MENU DO MOBILE PARA O DESKTOP
    $(".dropdown ul.dropdown-menu li a").click(function(){
        
        var btMenuMob = $(this).attr("class");
        var btMenuDesk = btMenuMob.replace("mob-", "desk-");
        $(".card .nav-tabs>li").removeClass("active");
        $(".card .nav-tabs>li." + btMenuDesk).addClass("active");
        var contentAtual = btMenuDesk.replace("desk-", "");
        $(".conteudo-atual .tab-pane").removeClass("active");
        $(".conteudo-atual .tab-pane#" + contentAtual).addClass("active");
         
        var textMenuMob = $(this).text();
        $("span#label_menu").text(textMenuMob);
        
    });
    
    // ESPELHO DO MENU DO DESKTOP PARA O MOBILE
    $(".card .nav-tabs>li a").click(function(){
         
        var textMenuDesk = $(this).text();
        $("span#label_menu").text(textMenuDesk);
        
    });
    
    
    
    
    
    $(function () {
        $('.button-checkbox').each(function () {
    
            // Settings
            var $widget = $(this),
                $button = $widget.find('button'),
                $checkbox = $widget.find('input:checkbox'),
                color = $button.data('color'),
                settings = {
                    on: {
                        icon: 'glyphicon glyphicon-check'
                    },
                    off: {
                        icon: 'glyphicon glyphicon-unchecked'
                    }
                };
    
            // Event Handlers
            $button.on('click', function () {
                $checkbox.prop('checked', !$checkbox.is(':checked'));
                $checkbox.triggerHandler('change');
                updateDisplay();
            });
            $checkbox.on('change', function () {
                updateDisplay();
            });
    
            // Actions
            function updateDisplay() {
                var isChecked = $checkbox.is(':checked');
    
                // Set the button's state
                $button.data('state', (isChecked) ? "on" : "off");
    
                // Set the button's icon
                $button.find('.state-icon')
                    .removeClass()
                    .addClass('state-icon ' + settings[$button.data('state')].icon);
    
                // Update the button's color
                if (isChecked) {
                    $button
                        .removeClass('btn-default')
                        .addClass('btn-' + color + ' active');
                }
                else {
                    $button
                        .removeClass('btn-' + color + ' active')
                        .addClass('btn-default');
                }
            }
    
            // Initialization
            function init() {
    
                updateDisplay();
    
                // Inject the icon if applicable
                if ($button.find('.state-icon').length == 0) {
                    $button.prepend('<i class="state-icon ' + settings[$button.data('state')].icon + '"></i> ');
                }
            }
            init();
        });
    });
    
    
    
    
    
});