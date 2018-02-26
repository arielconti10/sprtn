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





    // GRÁFICO MARKET SHARE PIZZA
    var ctx = document.getElementById("myChart").getContext('2d');
	var myChart = new Chart(ctx, {
	    type: 'polarArea',
	    data: {
	        labels: ["FTD", "Ática Scipione", "Moderna"],
	        datasets: [{
	            label: '# of Votes',
	            data: [60, 15, 25],
	            backgroundColor: [
	                'rgba(255, 99, 132, 0.2)',
	                'rgba(54, 162, 235, 0.2)',
	                'rgba(255, 159, 64, 0.2)'
	            ],
	            borderColor: [
	                'rgba(255,99,132,1)',
	                'rgba(54, 162, 235, 1)',
	                'rgba(255, 159, 64, 1)'
	            ],
	            borderWidth: 1
	        }]
	    },
	    options: {
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero:true
	                }
	            }]
	        }
	    }
	});

	// GRÁFICO MARKET SHARE BARRAS
	var ctxBar = document.getElementById("myBarChart").getContext('2d');
	var myBarChart = new Chart(ctxBar, {
	    type: 'bar',
	    data: {
	        labels: ["2013", "2014", "2015", "2016", "2017", "2018"],
	        datasets: [{
	            label: '# of Votes',
	            data: [60, 15, 25, 60, 15, 25],
	            backgroundColor: [
	                'rgba(255, 99, 132, 0.2)',
	                'rgba(54, 162, 235, 0.2)',
	                'rgba(255, 159, 64, 0.2)',
	                'rgba(255, 99, 132, 0.2)',
	                'rgba(54, 162, 235, 0.2)',
	                'rgba(255, 159, 64, 0.2)'
	            ],
	            borderColor: [
	                'rgba(255,99,132,1)',
	                'rgba(54, 162, 235, 1)',
	                'rgba(255, 159, 64, 1)',
	                'rgba(255,99,132,1)',
	                'rgba(54, 162, 235, 1)',
	                'rgba(255, 159, 64, 1)'
	            ],
	            borderWidth: 1
	        }]
	    },
	    options: {
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero:true
	                }
	            }]
	        }
	    }
	});

    
});