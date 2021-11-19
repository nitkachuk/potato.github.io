var cards = [  ];
var shadow_color = "#ffffff";		// #d0d0d0
var my_music = new Audio( "sounds/music.mp3" );

// таймер основной
var global_timer = 0;

// таймер клика
var click_timer = 0;
// счетчик клика
var click_timer_value = 0;

var flag = 0;	// 1 - первый клик, 2 - второй клик, 3 - пауза перед решением о совпадении
var pick1;
var pick2;
var img_path = "images/cards/";

var click_counter = 0;


function start()
{
	
	play_music( 1 );
	my_music.currentTime = 0;
	
	// подготавливаем игровое поле и сбрасываем переменные
	click_counter = 0;
	pick1 = 0;
	pick2 = 0;
	
	toggle_game();
	
	
	// создаем массив
	create_array();
	
	// перемешиваем
	cards.sort( shuffle );
	
		// переносим нулевой элемент массива, который появился при перемешке
		cards[ cards.length - 1 ] = cards[ 0 ];
	
	// запускаем основной таймер
	$("#timer-box").html("0");
	global_timer = window.setInterval( "tick_global_timer()", 1000 ); 
	
}

function toggle_game()
{
	
	if( flag== 0 )	{		// игра еще не началась
		
		//приводим прозрачность и дивы в видимый вид

		$(".card").css( "background-image", "url( " +img_path+ "shirt.png)" );
		$(".card").css( "background-color", "" );
		
		$(".card-box div").css( "visibility", "visible" );
		
		$("#start_button").fadeOut("fast");
		
		$(".card-box").animate( { opacity: 1 }, 250, function() {  } );
		$(".card-box div").animate( { opacity: 1 }, 250, function() {  } );
		$(".card-box").css( "pointer-events", "all" );
		
		 flag = 1;
		
					}
					
	else	{				// игра закончена
		
		$("#start_button").css( "background-image", "url( images/icons/cool_potato.png )" );
		
		$("#start_button").fadeIn("fast");
		 flag = 0;
		
			}
			
}

function tick_global_timer()
{
	$("#timer-box").html(   parseInt( $("#timer-box").html() ) + 1   );
}


function create_array()
{
	cards = [  ];
	
	for( i=1; i<= 36; i++ )		{
		cards[ i ] = i;
			if( cards[ i ] > 18 )	{ cards[ i ] -= 18; }
	}
}

function shuffle( a, b )
{
	return 0.5 - Math.random();
}



function pick( obj )	
{ 

 // нельзя нажать, если игра не началась
 if( flag == 0 )	{ return; }
 
 // нельзя нажать на ту же карточку
 if( flag == 2 && pick1 == Number( obj.id.replace("card", "") ) )	{ return; }
 
	switch( flag  )		{		

		case 1: 	// первый клик
		
			pick1 =  Number( obj.id.replace("card", "") );
			
			// показываем карточку, выделяем
			$("#" +obj.id).css( "background-image", "url( " +img_path+ cards[ pick1 ]+ ".png)" );
			$("#" +obj.id).css( "background-color", shadow_color );
			
			// пошли 5 секунд
			toggle_click_timer();
			
			flag = 2;
			
			play_sound( "open_card" );
			
			// чит ;)
			cheat();
			
			break;

	
		case 2:		// второй клик
		
			pick2 =  Number( obj.id.replace("card", "") );
			
			// показываем карточку, выделяем
			$("#" +obj.id).css( "background-image", "url( " +img_path+ cards[ pick2 ]+ ".png)" );
			$("#" +obj.id).css( "background-color", shadow_color );
			
			click_timer_value = 0;
			
			flag = 3;
			
			play_sound( "open_card" );
			
			$(".card-box").css( "pointer-events", "none" );
			
			break;
			
		default: 

		
	}
	
	
}

function cheat()
{
	for( i=0; i<cards.length; i++ )		{
		if( cards[ i ] == cards[ pick1 ] )	{
			$("#card" +i).css( "background-color", shadow_color );
		}
	}
}

function check_cards()
{ 
	if(  cards[ pick1 ] == cards[ pick2 ]  )	{ 	// карты совпали
	
		play_sound( "delete_cards" );
	
		// плавное исчезание + удаление
		$("#card" +pick1+ ", #card" +pick2).animate( { opacity: 0 }, 250, function() 	{ 
			$("#card" +pick1+ ", #card" +pick2).css( "visibility", "hidden" ); 
			flag = 1;		// не разрешаем следующий клик, пока не выполнится вся анимация
																						} );
		
		// считаем угаданные карты
		click_counter++;
		
							}
	
	else	{	// карты не совпали
	
		hide_cards();
		flag = 1;			// не разрешаем следующий клик, пока не выполнится вся анимация
		
			}
			
	$(".card-box").css( "pointer-events", "all" );		
			
}

function hide_cards()
{
	
	play_sound( "hide_cards" );
	
	$("#card" +pick1+ ", #card" +pick2).animate( { opacity: 0 }, 200, function() {  } );
	
	// прячем карты
	$(".card").css( "background-image", "url( " +img_path+ "shirt.png)" );
	$(".card").css( "background-color", "" );
	
	$("#card" +pick1+ ", #card" +pick2).animate( { opacity: 1 }, 200, function() {    } );
	
	
	// обнуляем переменные для карточек 
	pick1 = 0;
	pick2 = 0;
	
}


// показывает карточки (для разработчика)
function show_cards()
{

	for( i=1; i<= 36; i++ )		{
	
		$("#card" +i).css( "background-image", "url( " +img_path+ cards[ i ]+ ".png)" );
		
	}
	
}

// выиграть (для разработчика)
function cheat_win()
{

	for( i=1; i<= 36; i++ )		{
	
		$("#card" +i).css( "visibility", "hidden" );
		$("#card" +i).css( "opacity", "0" );
		
		click_counter++;
		
		check_win();
		
	}
	
}


function toggle_click_timer()
{
	
	if( click_timer == 0 )		{ 
		click_timer_value = 0;
		click_timer = window.setInterval( "tick_click_timer()", 1000 ); 
	}
	
	else	{
		window.clearInterval( click_timer );
		click_timer = 0;
	}
	
}

function tick_click_timer() 
{
	click_timer_value++;
	
	switch( flag )		{ 	
	
		case 2:		// если кликнули один раз, то считаем до 5
	
			if( click_timer_value == 5 )	{ 
			
				// останавливаем таймер
				toggle_click_timer();
				
				// прячем карты
				hide_cards();
				
				flag = 1;
			}
			
			break;
		
		case 3: 	// если кликнули два раза, то считаем до 2
		
			if( click_timer_value == 2 )	{ 
			
				// останавливаем таймер
				toggle_click_timer();
				
				// проверяем карты
				check_cards();	
				
				// проверяем выигрыш
				check_win();
				
			}
			
			break;
			
		default:
		
	}
			
}


function check_win()
{
	
	if( click_counter == 18 )	{
		
		play_music( 0 );
		play_sound( "victory" );
		
		window.clearInterval( global_timer );
		
		toggle_game();
		
	}
	
}


function play_sound( zval )
{
	my_sound = new Audio( "sounds/" +zval+ ".mp3" );
	my_sound.play();
}


function play_music( zval )
{
	if( zval == 1 )		{

			my_music.play();
			my_music.loop = true;

	}
	
	else	{
		my_music.pause()
	}
}

function set_volume() 
{
	
	if( my_music.volume == 1 )	{
		
		my_music.volume = 0;
		$("#volume_button").css( "background-image", "url( images/icons/volume_off.png )" );
		
	}
	
	else	{
		
		my_music.volume = 1;
		$("#volume_button").css( "background-image", "url( images/icons/volume_on.png )" );
		
			}
	
}





function ID( zval )
{
	return document.getElementById( zval );
}

