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
    
});