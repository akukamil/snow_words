var M_WIDTH=800, M_HEIGHT=450, gdata={};
var app ={stage:{},renderer:{}}, game_res, objects={}, state="o",git_src, my_role="", LANG = 0, main_word = '', game_tick=0, my_turn=0, game_id=0, h_state=0, game_platform="", hidden_state_start = 0, connected = 1;
var pending_player="", room_name = 'states2', players_node;
var my_data={opp_id : ''},opp_data={};
var some_process = {};
var dict={};
const ME = 0, OPP = 1;
let main_word_conf = [3,3];
const WIN = 1, DRAW = 0, LOSE = -1, NOSYNC = 2;
const IDLE =0, HITED = 1, SINKING = 2, THROWING = 3, FALLING = 4;

irnd = function (min,max) {	
	//мин и макс включительно
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const rgb_to_hex = (r, g, b) => '0x' + [r, g, b].map(x => {
  const hex = x.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}).join('')

class player_mini_card_class extends PIXI.Container {

	constructor(x,y,id) {
		super();
		this.visible=false;
		this.id=id;
		this.uid=0;
		this.type = "single";
		this.x=x;
		this.y=y;
		this.bcg=new PIXI.Sprite(game_res.resources.mini_player_card.texture);
		this.bcg.interactive=true;
		this.bcg.buttonMode=true;
		this.bcg.pointerdown=function(){cards_menu.card_down(id)};
		this.bcg.pointerover=function(){this.bcg.alpha=0.5;}.bind(this);
		this.bcg.pointerout=function(){this.bcg.alpha=1;}.bind(this);
		this.bcg.width=200;
		this.bcg.height=100;
		
		this.avatar=new PIXI.Sprite();
		this.avatar.x=20;
		this.avatar.y=20;
		this.avatar.width=this.avatar.height=60;

		this.name="";
		this.name_text=new PIXI.BitmapText('...', {fontName: 'mfont',fontSize: 25});
		this.name_text.anchor.set(0.5,0.5);
		this.name_text.x=135;
		this.name_text.y=35;

		this.rating=0;
		this.rating_text=new PIXI.BitmapText('...', {fontName: 'mfont',fontSize: 28});
		this.rating_text.tint=0xffff00;
		this.rating_text.anchor.set(0.5,0.5);
		this.rating_text.x=135;
		this.rating_text.y=70;

		//аватар первого игрока
		this.avatar1=new PIXI.Sprite();
		this.avatar1.x=20;
		this.avatar1.y=20;
		this.avatar1.width=this.avatar1.height=60;

		//аватар второго игрока
		this.avatar2=new PIXI.Sprite();
		this.avatar2.x=120;
		this.avatar2.y=20;
		this.avatar2.width=this.avatar2.height=60;

		this.rating_text1=new PIXI.BitmapText('1400', {fontName: 'mfont',fontSize: 22});
		this.rating_text1.tint=0xffff00;
		this.rating_text1.anchor.set(0.5,0);
		this.rating_text1.x=50;
		this.rating_text1.y=70;

		this.rating_text2=new PIXI.BitmapText('1400', {fontName: 'mfont',fontSize: 22});
		this.rating_text2.tint=0xffff00;
		this.rating_text2.anchor.set(0.5,0);
		this.rating_text2.x=150;
		this.rating_text2.y=70;
		
		//
		this.rating_bcg = new PIXI.Sprite(game_res.resources.rating_bcg.texture);
		this.rating_bcg.width=200;
		this.rating_bcg.height=100;
		
		this.name1="";
		this.name2="";

		this.addChild(this.bcg,this.avatar, this.avatar1, this.avatar2, this.rating_bcg, this.rating_text,this.rating_text1,this.rating_text2, this.name_text);
	}

}

class lb_player_card_class extends PIXI.Container{

	constructor(x,y,place) {
		super();

		this.bcg=new PIXI.Sprite(game_res.resources.lb_player_card_bcg.texture);
		this.bcg.interactive=true;
		this.bcg.pointerover=function(){this.tint=0x55ffff};
		this.bcg.pointerout=function(){this.tint=0xffffff};
		this.bcg.width = 370;
		this.bcg.height = 70;

		this.place=new PIXI.BitmapText("", {fontName: 'mfont',fontSize: 25});
		this.place.tint=0xffff00;
		this.place.x=20;
		this.place.y=22;

		this.avatar=new PIXI.Sprite();
		this.avatar.x=43;
		this.avatar.y=10;
		this.avatar.width=this.avatar.height=48;


		this.name=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25});
		this.name.tint=0xdddddd;
		this.name.x=105;
		this.name.y=22;


		this.rating=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25});
		this.rating.x=298;
		this.rating.tint=rgb_to_hex(255,242,204);
		this.rating.y=22;

		this.addChild(this.bcg,this.place, this.avatar, this.name, this.rating);
	}


}

class letter_button_class extends PIXI.Container{
	
	constructor() {
		super();
		this.letter = '';
		
		this.bcg=new PIXI.Sprite(gres.letter_bcg.texture);
		this.bcg.interactive=true;
		this.bcg.buttonMode=true;
		this.bcg.pointerover=function(){this.tint=0x9999ff};
		this.bcg.pointerout=function(){this.tint=0xffffff};
		this.bcg.pointerdown=game.letter_down.bind(game,this);
		this.bcg.width=this.bcg.height=80;
		
		
		this.l=new PIXI.BitmapText(this.letter, {fontName: 'mfont',fontSize: 60});
		this.l.tint=0xffffff;
		this.l.x=37;
		this.l.y=40;
		this.l.anchor.set(0.5,0.5);
		
		this.addChild(this.bcg,this.l);
		this.visible=false;
		this.y = 340;
		
	}
	
	set_letter (l) {
		
		this.letter = l;
		this.l.text = l;		
	}
	
}

class snowball_class extends PIXI.Container{
	
	constructor() {
		super();
		this.letter = '';
		this.rot_shift = irnd(0,300);
		
		this.bcg=new PIXI.Sprite(gres.snowball0.texture);
		this.bcg.interactive=true;
		this.bcg.buttonMode=true;
		this.bcg.pointerover=function(){this.tint=0x5544ff};
		this.bcg.pointerout=function(){this.tint=0xffffff};
		//this.bcg.pointerdown=game.letter_down.bind(game,this);
		this.bcg.anchor.set(0.5,0.5);
		this.bcg.width=this.bcg.height=80;
		
		this.l=new PIXI.BitmapText(this.letter, {fontName: 'mfont',fontSize: 45});
		this.l.tint=0x2321fe;
		this.l.anchor.set(0.5,0.5);
		
		this.addChild(this.bcg,this.l);
		this.visible=false;
		this.y = 340;
		
	}
	
	set_letter (l) {
		
		this.letter = l;
		this.l.text = l;		
	}
	
}

class shop_card_class extends PIXI.Container {
		
	constructor (data) {
		
		//скидка
		data.price=~~(data.price*0.5);
		
		
		super();
		this.x=data.x;
		this.y=data.y;
		this.bcg = new PIXI.Sprite(gres.buy_card_bcg.texture);
		this.bcg.interactive=true;
		this.bcg.buttonMode=true;
		this.bcg.pointerover=function(){this.tint=0x9999ff};
		this.bcg.pointerout=function(){this.tint=0xffffff};
		this.bcg.pointerdown=shop.card_down.bind(this);
		this.bcg.width=gdata.shop_card_w;
		this.bcg.height=gdata.shop_card_h;
		
		
		if (data.type==='skin') this.img = new PIXI.Sprite(gres[data.name+'_idle'].texture);
		if (data.type==='wall') this.img = new PIXI.Sprite(gres.wall.texture);
		
		//копируем в даннуе карточки
		this.data=data
				
		//применяем окраску
		this.img.tint=data.tint||0xffffff;
		
		
		this.img.x=gdata.shop_card_image_x;
		this.img.y=gdata.shop_card_image_y;;
		this.img.width=gdata.shop_card_image_w;
		this.img.height=gdata.shop_card_image_h;
		
		
		this.price_text = new PIXI.BitmapText(['Цена: ','Price: '][LANG] + data.price, {fontName: 'mfont',fontSize: gdata.shop_card_price_font_size});
		this.price_text.x=gdata.shop_card_price_x;
		this.price_text.y=gdata.shop_card_price_y;
		this.price_text.tint=gdata.shop_card_price_font_col;
		this.price_text.anchor.set(0.5,0.5);
		
		this.desc_text = new PIXI.BitmapText(data.desc, {fontName: 'mfont',fontSize: gdata.shop_card_desc_font_size,align:'center'});
		this.desc_text.x=gdata.shop_card_desc_x;
		this.desc_text.y=gdata.shop_card_desc_y;
		this.desc_text.tint=gdata.shop_card_desc_font_col;
		this.desc_text.maxWidth=gdata.shop_card_desc_max_w;
		this.desc_text.anchor.set(0.5,0.5);		
				
		this.addChild(this.bcg,this.img,this.price_text,this.desc_text);
		
	}

}

var sound = {
	
	on : 1,
	
	play : function(snd_res) {
		
		if (this.on === 0)
			return;
		
		if (game_res.resources[snd_res]===undefined)
			return;
		
		game_res.resources[snd_res].sound.play();	
		
	}
	
	
}

var message =  {
	
	promise_resolve :0,
	
	add : async function(text) {
		
		if (this.promise_resolve!==0)
			this.promise_resolve("forced");
		
		//воспроизводим звук
		sound.play('message');	

		objects.message_text.text=text;

		await anim2.add(objects.message_cont,{y:[-100,objects.message_cont.sy]}, true, 0.5,'easeOutBack');

		let res = await new Promise((resolve, reject) => {
				message.promise_resolve = resolve;
				setTimeout(resolve, 3000)
			}
		);
		
		if (res === "forced")
			return;

		anim2.add(objects.message_cont,{y:[objects.message_cont.y, -100]}, false, 0.5,'easeInBack');			
	}

}

var anim2 = {
		
	c1: 1.70158,
	c2: 1.70158 * 1.525,
	c3: 1.70158 + 1,
	c4: (2 * Math.PI) / 3,
	c5: (2 * Math.PI) / 4.5,
		
	slot: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
	
	linear: function(x) {
		return x
	},
	
	kill_anim: function(obj) {
		
		for (var i=0;i<this.slot.length;i++)
			if (this.slot[i]!==null)
				if (this.slot[i].obj===obj)
					this.slot[i]=null;		
	},
	
	easeOutBack: function(x) {
		return 1 + this.c3 * Math.pow(x - 1, 3) + this.c1 * Math.pow(x - 1, 2);
	},
	
    easeOutBounce: function (x) {
        const n1 = 7.5625;
        const d1 = 2.75;

        if (x < 1 / d1) {
            return n1 * x * x;
        } else if (x < 2 / d1) {
            return n1 * (x -= 1.5 / d1) * x + 0.75;
        } else if (x < 2.5 / d1) {
            return n1 * (x -= 2.25 / d1) * x + 0.9375;
        } else {
            return n1 * (x -= 2.625 / d1) * x + 0.984375;
        }
    },
	
	easeOutElastic: function(x) {
		return x === 0
			? 0
			: x === 1
			? 1
			: Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * this.c4) + 1;
	},
	
	easeOutSine: function(x) {
		return Math.sin( x * Math.PI * 0.5);
	},
	
	easeOutCubic: function(x) {
		return 1 - Math.pow(1 - x, 3);
	},
	
	easeInBack: function(x) {
		return this.c3 * x * x * x - this.c1 * x * x;
	},
	
	easeInQuad: function(x) {
		return x * x;
	},
	
	ease2back : function(x) {
		return Math.sin(x*Math.PI);
	},
	
	easeInOutCubic: function(x) {
		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
	},
	
	add : function(obj, params, vis_on_end, time, func, anim3_origin) {
				
		//если уже идет анимация данного спрайта то отменяем ее
		anim2.kill_anim(obj);
		if (anim3_origin === undefined)
			anim3.kill_anim(obj);


		let f=0;
		//ищем свободный слот для анимации
		for (var i = 0; i < this.slot.length; i++) {

			if (this.slot[i] === null) {

				obj.visible = true;
				obj.ready = false;

				//добавляем дельту к параметрам и устанавливаем начальное положение
				for (let key in params) {
					params[key][2]=params[key][1]-params[key][0];					
					obj[key]=params[key][0];
				}
				
				//для возвратных функцие конечное значение равно начальному
				if (func === 'ease2back')
					for (let key in params)
						params[key][1]=params[key][0];					

					

				this.slot[i] = {
					obj: obj,
					params: params,
					vis_on_end: vis_on_end,
					func: this[func].bind(anim2),
					speed: 0.01818 / time,
					progress: 0
				};
				f = 1;
				break;
			}
		}
		
		if (f===0) {
			console.log("Кончились слоты анимации");	
			
			
			//сразу записываем конечные параметры анимации
			for (let key in params)				
				obj[key]=params[key][1];			
			obj.visible=vis_on_end;
			obj.alpha = 1;
			obj.ready=true;
			
			
			return new Promise(function(resolve, reject){					
			  resolve();	  		  
			});	
		}
		else {
			return new Promise(function(resolve, reject){					
			  anim2.slot[i].p_resolve = resolve;	  		  
			});			
			
		}

		
		

	},	
	
	process: function () {
		
		for (var i = 0; i < this.slot.length; i++)
		{
			if (this.slot[i] !== null) {
				
				let s=this.slot[i];
				
				s.progress+=s.speed;				
				for (let key in s.params)				
					s.obj[key]=s.params[key][0]+s.params[key][2]*s.func(s.progress);		

				
				//если анимация завершилась то удаляем слот
				if (s.progress>=0.999) {
					for (let key in s.params)				
						s.obj[key]=s.params[key][1];
					
					s.obj.visible=s.vis_on_end;
					if (s.vis_on_end === false)
						s.obj.alpha = 1;
					s.obj.ready=true;					
					s.p_resolve('finished');
					this.slot[i] = null;
				}
			}			
		}
		
	}
	
}

var anim3 = {
			
	slot: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
	
	kill_anim: function(obj) {
		
		for (var i=0;i<this.slot.length;i++)
			if (this.slot[i]!==null)
				if (this.slot[i].obj===obj)
					this.slot[i]=null;		
	},
	
	add : function (obj, params, schedule, func = 0, repeat = 0) {
		
		//anim3.add(objects.header0,['x','y'],[{time:0,val:[0,0]},{time:1,val:[110,110]},{time:2,val:[0,0]}],'easeInOutCubic');	
		
		
		//если уже идет анимация данного спрайта то отменяем ее
		anim3.kill_anim(obj);
		
		
		//ищем свободный слот для анимации
		let f=0;
		for (var i = 0; i < this.slot.length; i++) {

			if (this.slot[i] === null) {
				
				obj.ready = true;
				
				//если это точечная анимация то сразу устанавливаем первую точку
				if (func === 0)
					for (let i=0;i<params.length;i++)
						obj[params[i]]=schedule[0].val[i]
				
				this.slot[i] = {
					obj: obj,
					params: params,
					schedule: schedule,
					func: func,
					start_time : game_tick,
					cur_point: 0,
					next_point: 1,
					repeat: repeat
				};
				f = 1;				
				break;
			}
		}		
		
		if (f===1) {			
			return new Promise(function(resolve, reject){					
			  anim3.slot[i].p_resolve = resolve;	  		  
			});				
		} else {
			
			return new Promise(function(resolve, reject){					
			  resolve();	  		  
			});	
		}
	},
	
	process: function () {
		
		for (var i = 0; i < this.slot.length; i++)
		{
			if (this.slot[i] !== null) {
				
				let s=this.slot[i];
				
				//это точечная анимация
				if (s.func === 0) {
					
					let time_passed = game_tick - s.start_time;
					let next_point_time = s.schedule[s.next_point].time;
					
					//если пришло время следующей точки
					if (time_passed > next_point_time) {
						
						//устанавливаем параметры точки
						for (let i=0;i<s.params.length;i++)
							s.obj[s.params[i]]=s.schedule[s.next_point].val[i];
												
						s.next_point++;		
						
						//начинаем опять отчет времени
						s.start_time = game_tick;	
						
						//если следующая точка - не существует
						if (s.next_point === s.schedule.length) {							

							if (s.repeat === 1) {
								s.start_time = game_tick
								s.next_point = 1;
							}
							else {								
								s.p_resolve('finished');
								this.slot[i]=null;									
							}
						
						}
					}					
				}
				else
				{
					//это вариант с твинами между контрольными точками
					
					m_lable : if (s.obj.ready === true) {						
						
						//если больше нет контрольных точек то убираем слот или начинаем сначала
						if (s.next_point === s.schedule.length) {
							
							if (s.repeat === 1) {
								s.cur_point = 0;
								s.next_point = 1;
							}
							else {
								s.p_resolve('finished');
								this.slot[i]=null;	
								break m_lable;
							}			
						}					

							
						let p0 = s.schedule[s.cur_point];
						let p1 = s.schedule[s.next_point];
						let time = p1.time;
						
						//заполняем расписание для анимации №2
						let cur_schedule={};							
						for (let i = 0 ; i < s.params.length ; i++) {						
							let p = s.params[i];
							cur_schedule[p]=[p0.val[i],p1.val[i]]						
						}					
						
						//активируем анимацию
						anim2.add(s.obj,cur_schedule,true,time,s.func,1);	
						
						s.cur_point++;
						s.next_point++;							
							
					
					}		
				}
			}			
		}		
	}
	

}

var big_message = {
	
	p_resolve : 0,
		
	show: function(t1,t2) {
				
		if (t2!==undefined || t2!=="")
			objects.big_message_text2.text=t2;
		else
			objects.big_message_text2.text='**********';

		objects.big_message_text.text=t1;
		anim2.add(objects.big_message_cont,{y:[-180,objects.big_message_cont.sy]}, true, 0.6,'easeOutBack');		
				
		return new Promise(function(resolve, reject){					
			big_message.p_resolve = resolve;	  		  
		});
	},

	close : function() {
		
		if (objects.big_message_cont.ready===false)
			return;
		sound.play('close_it');	
		anim2.add(objects.big_message_cont,{y:[objects.big_message_cont.sy,450]}, false, 0.4,'easeInBack');		
		this.p_resolve("close");			
	}

}

var confirm_dialog = {
	
	p_resolve : 0,
		
	show: function(msg) {
				
				
		if (objects.confirm_cont.visible === true) {
			sound.play('locked');	
			return;			
		}		
				
		objects.confirm_msg.text=msg;
		
		sound.play('bad_move');	
		anim2.add(objects.confirm_cont,{y:[-300,objects.confirm_cont.sy]}, true, 0.6,'easeOutBack');		
				
		return new Promise(function(resolve, reject){					
			confirm_dialog.p_resolve = resolve;	  		  
		});
	},
	
	button_down : function(res) {
		
		if (objects.confirm_cont.ready === false || objects.req_cont.visible === true) {
			sound.play('locked');	
			return;			
		}
		
		sound.play('close_it');	
		anim2.add(objects.confirm_cont,{y:[objects.confirm_cont.y,-300]}, false, 0.4,'easeInBack');		
		this.p_resolve(res);	
		
	}

}

var make_text = function (obj, text, max_width) {

	let sum_v=0;
	let f_size=obj.fontSize;

	for (let i=0;i<text.length;i++) {

		let code_id=text.charCodeAt(i);
		let char_obj=game_res.resources.m2_font.bitmapFont.chars[code_id];
		if (char_obj===undefined) {
			char_obj=game_res.resources.m2_font.bitmapFont.chars[83];
			text = text.substring(0, i) + 'S' + text.substring(i + 1);
		}

		sum_v+=char_obj.xAdvance*f_size/64;
		if (sum_v>max_width) {
			obj.text =  text.substring(0,i-1);
			return;
		}
	}

	obj.text =  text;
}

var online_player = {
		
	name : 'online',
	syn_ok : 0,
	start_time : 0,	
	
	activate : function() {
		
		
		//если мастер то отправляем дополнительное подтверждение о начале
		if (my_role === 'master')
			firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"SYN_OK",tm:Date.now()});
		else
			this.check_syn();
				
		//проверка синхронизации пока не пройдена
		this.syn_ok = 0;
		
		//фиксируем врему начала игры
		this.start_time = Date.now();
		
		//вычиcляем рейтинг при проигрыше и устанавливаем его в базу он потом изменится
		const lose_rating = this.calc_new_rating(my_data.rating, LOSE);
		if (lose_rating >100 && lose_rating<9999)
			firebase.database().ref("players/"+my_data.uid+"/rating").set(lose_rating);
				
		//устанавливаем статус в базе данных а если мы не видны то установливаем только скрытое состояние
		set_state({state : 'p'});
		
	},
	
	check_syn : async function() {		
		
		await new Promise((resolve, reject) => setTimeout(resolve, 4000));
		if (this.syn_ok === 0)
			game.stop('no_syn');
		
	},
	
	send_move : function  (data) {
		
		
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"MOVE",tm:Date.now(),data:data});

	},
	
	calc_new_rating : function (old_rating, game_result) {
				
		if (game_result === NOSYNC)
			return old_rating;
		
		var Ea = 1 / (1 + Math.pow(10, ((opp_data.rating-my_data.rating)/400)));
		if (game_result === WIN)
			return Math.round(my_data.rating + 16 * (1 - Ea));
		if (game_result === DRAW)
			return Math.round(my_data.rating + 16 * (0.5 - Ea));
		if (game_result === LOSE)
			return Math.round(my_data.rating + 16 * (0 - Ea));
		
	},
	
	stop : async function(result) {
		
		let res_array = [
			['my_hidden',LOSE, 'Вы проиграли (вышли из игры)! '],
			['opp_hidden',WIN, 'Вы выиграли (соперник вышел из игры)! '],
			['my_lose',LOSE, 'Вы проиграли!'],
			['my_win' ,WIN, 'Вы выиграли!'],
			['no_syn' ,NOSYNC, 'Кажется игру не удалось начать. Попробуйте еще раз.'],
			['my_cancel' ,LOSE, 'Вы проиграли!\nВы отменили игру.'],
			['opp_cancel' ,WIN, 'Вы выиграли!\nСоперник отменил игру.'],
		];
		
		let result_row = res_array.find( p => p[0] === result);
		let result_str = result_row[0];
		let result_number = result_row[1];
		let result_info = result_row[2];				
		let old_rating = my_data.rating;
		my_data.rating = this.calc_new_rating (my_data.rating, result_number);
		objects.my_card_rating.text = my_data.rating;
		firebase.database().ref(players_node+'/'+my_data.uid+"/rating").set(my_data.rating);
		
		//если мы отменили игру то отправляем сопернику уведомление об этом
		if (result === 'my_cancel')
			firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"opp_cancel",tm:Date.now()});



		//если игра результативна то записываем дополнительные данные
		if (result_number === DRAW || result_number === LOSE || result_number === WIN) {
			
			//увеличиваем количество игр
			my_data.games++;
			firebase.database().ref(players_node+'/'+[my_data.uid]+"/games").set(my_data.games);		

			//записываем результат в базу данных
			let duration = ~~((Date.now() - this.start_time)*0.001);
			firebase.database().ref("finishes/"+game_id + my_role).set({'player1':objects.my_card_name.text,'player2':objects.opp_card_name.text, 'res':result_number,'fin_type':result,'duration':duration, 'ts':firebase.database.ServerValue.TIMESTAMP});
			
		}
		
		//воспроизводим звук
		if (result_number === DRAW || result_number === LOSE || result_number === NOSYNC )
			sound.play('lose');	
		else
			sound.play('win');	
		
		await big_message.show(result_info, `Рейтинг: ${old_rating} > ${my_data.rating}`)
	},
	
	process : function() {
		
	
		
	}
	
}

function get_random_word() {
	
	let letters_blocks=['ОЕАИ','НТСРВЛКМДП','УЯЫЬГЗБЧЙХЖШЮ'];	
	if(LANG===1)
		letters_blocks=['EAIO','RTNSLCUDPM','HGBFYWKVXZJQ'];	

	
	const block0_shuffled = letters_blocks[0].split('').sort(function(){return 0.5-Math.random()}).join('');
	const block1_shuffled = letters_blocks[1].split('').sort(function(){return 0.5-Math.random()}).join('');
	const block2_shuffled = letters_blocks[2].split('').sort(function(){return 0.5-Math.random()}).join('');
		
	let _word = block0_shuffled[0] + block0_shuffled[1] + block1_shuffled[0] + block1_shuffled[1] + block1_shuffled[2] + block2_shuffled[0];
		
	_word = _word.split('').sort(function(){return 0.5-Math.random()}).join('');
	return _word;
	
}

var bot_player = {
	
	last_word_time : 0,
	name : 'bot',
	delay_search_time : 7,
	game_id : 0,
	
	activate : function() {	

		set_state({state : 'b'});		
		
		game_id=~~(Math.random()*99999);

		//придумываем слово
		main_word = get_random_word();
		
		//сдвигаем время для отсрочки начала поиска
		this.last_word_time = game_tick;
		
		this.delay_search_time = 6;
		
		if (my_data.rating > 1450)
			this.delay_search_time = 5;
		
		if (my_data.rating > 1500)
			this.delay_search_time = 4;
		
		if (my_data.rating > 1550)
			this.delay_search_time = 3;
		
		if (my_data.rating > 1600)
			this.delay_search_time = 2;
		
		//процессинговая функция
		some_process.bot = this.process.bind(bot_player);
		
	},
	
	process : async function () {
		
		//если появилось сообщение то выходим из игры или изменилось состояние
		if (objects.big_message_cont.visible === true || state !== 'b') {
				some_process.bot = function(){};
				return;	
		}
		
		//не ищем слова если я тону
		if (game.my_sink === 1 || game.opp_sink === 1)
			return;			
		
		//ждем несколько секунд после последнего слова
		if (game_tick - this.last_word_time < this.delay_search_time)
			return;
				
		//ище случайное слово случайной длины
		let w_len = main_word_conf[0] + main_word_conf[1];
		let word5 = '';
		for (let i = 0 ; i < 5; i++) {
			let random_pos = irnd(0, w_len - 1);
			word5 += objects.l_buttons[random_pos].letter;
		}
		
		//если слово есть в словаре то запускаем пули
		if (game.word_hist.includes(word5)===false && dict0.includes(word5)===true) {			
			game.receive_move(word5);			
			this.last_word_time = game_tick;
			return;
		}				
		
		let word4 = word5.substring(0,4);
		//если слово есть в словаре то запускаем пули
		if (game.word_hist.includes(word4)===false && dict0.includes(word4)===true) {			
			game.receive_move(word4);			
			this.last_word_time = game_tick;
			return;
		}	
		
		let word3 = word5.substring(0,3);
		//если слово есть в словаре то запускаем пули
		if (game.word_hist.includes(word3)===false && dict0.includes(word3)===true) {			
			game.receive_move(word3);			
			this.last_word_time = game_tick;
			return;
		}	
		


	},
	
	stop : async function() {
		
		sound.play('draw');	
		some_process.bot = function(){};
		await big_message.show(['Игра с ботом завершена!','The bot game is over!'][LANG],['Сыграйте с реальным соперником для получения рейтинга','Play with a real opponent to get a rating'][LANG]);
	},
	
	send_move : function() {
		
		
	}
	
}

var wait_timer = {
	
	timers : [null,null,null,null,null],
	
	add(tar_tick, cb) {
		
		for (let i = 0 ; i < this.timers.length ; i++) {
			if (this.timers[i] === null) {
				this.timers[i]=[tar_tick + game_tick,cb];						
				return;
			}
		}	

		alert("Нету слотов для таймера! Сообщите об этом разработчику!")
	},
	
	
	process : function() {		
		
		for (let i = 0 ; i < this.timers.length ; i++) {
			if (this.timers[i] !== null) {
				if (game_tick >=this.timers[i][0]) {
					this.timers[i][1]();							
					this.timers[i]=null;
				}		
			}
		}	
	}
	
	
}

var game = {
	
	opponent : {},
	word_hist : [],
	opp_sink : 0,
	my_sink : 0,
	max_idle_time : 15000,
	last_word_time : 0,
	time_pen_row : 0,
	my_move_amount : 0,
	opp_move_amount : 0,
	shift_vs_amount : [0,1,1,1,2,2,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5],
	wall_decay:null,
	

	async activate(role, opponent) {
		
		
		//создаем wall decay для каждой стены
		if (this.wall_decay===null){
			this.wall_decay={};
			for (let i=1;i<4;i++){
				this.wall_decay[i]={};
				const max_life=gdata.walls_life[i];
				for (k=0;k<=max_life;k++)
					this.wall_decay[i][k]=Math.round((1-(k-1)/(max_life-1))*4);
			}			
		}

		
		//устанавливаем роль
		my_role = role;
					
		//фиксируем оппонента
		this.opponent = opponent;
				
		//фиксируем время когда началась игра для контроля простоя
		this.last_word_time = Date.now();
		this.time_pen_row = 0;
		
		//отключаем все комки
		for (let b of objects.snowballs) {						
			b.visible = false; 
			b.active = 0;
			anim2.kill_anim(b);
		}

		this.max_idle_time = 15000;	
		
		
		//остаточное количество движения
		this.my_move_amount = 0;
		this.opp_move_amount = 0;
		
		//убираем окно подтверждения если оно есть
		if (objects.confirm_cont.visible === true)
			anim2.add(objects.confirm_cont,{y:[objects.confirm_cont.y,-300]}, false, 1,'easeInOutCubic');	
		
		//если открыт лидерборд то закрываем его
		if (objects.lb_1_cont.visible===true) lb.close();
		
		//если открыт магаз то закрываем его
		if (objects.shop_cont.visible === true) shop.close();
		
		//активируем все что связано с оппонентом
		this.opponent.activate();
		
		//воспроизводим звук о начале игры
		sound.play('game_start');	
				
		//показываем карточки игроков		
		objects.my_card_cont.visible = true;
		objects.opp_card_cont.visible = true;		
				
		objects.cur_word.visible = true;	
		
		
		objects.my_words.visible = objects.opp_words.visible = true;	
		objects.my_words.text = objects.opp_words.text = '';	
		objects.cur_word.text = '';	
		
		this.my_sink = this.opp_sink = 0;
		this.word_hist=[];

		//показываем кнопку выхода
		anim2.add(objects.exit_button,{x:[-50, objects.exit_button.sx]},true,0.5,'linear');

		//показываем море
		anim2.add(objects.sea.sprite,{alpha: [0,1]}, true, 3.5,'linear');
		
		//показыаем айсберг
		anim2.add(objects.iceberg,{y:[450, objects.iceberg.sy]}, true, 1.57,'linear');	
		
		
		objects.my_icon.y=objects.opp_icon.y = objects.my_icon.sy;
		objects.my_icon.x = 300;
		objects.opp_icon.x = 500;
					
		//если оналйн определяем скин айди оппонента и стену
		opp_data.skin = 'peng';
		if (this.opponent.name === 'online'){			
			this.update_opp_skin();				
			const opp_wall=await firebase.database().ref(players_node+'/'+opp_data.uid +"/wall").once('value');
			opp_data.wall=opp_wall.val()||0;
		}			
			
		//устанаваем состояния
		this.set_player_state(objects.my_icon, IDLE);
		this.set_player_state(objects.opp_icon, IDLE);
		
		//показываем стену
		if (my_data.wall>0){
			anim2.add(objects.my_wall,{y:[450, objects.my_wall.sy]}, true, 1.7,'linear');				
			objects.my_wall.life=gdata.walls_life[my_data.wall];			
			objects.my_wall.texture=gres.wall0.texture;		
			objects.my_wall.tint=gdata[`wall_${my_data.wall}_tint`];		
		}
			
		if (opp_data.wall>0){			
			anim2.add(objects.opp_wall,{y:[450, objects.opp_wall.sy]}, true, 1.7,'linear');	
			objects.opp_wall.life=gdata.walls_life[opp_data.wall];		
			objects.opp_wall.texture=gres.wall0.texture;	
			objects.opp_wall.tint=gdata[`wall_${opp_data.wall}_tint`];		
		}
		
		
		//опускаем наших игроков
		anim2.add(objects.my_icon,{y:[-150, objects.my_icon.sy]}, true, 1.7,'linear');	
		anim2.add(objects.opp_icon,{y:[-150, objects.opp_icon.sy]}, true, 1.8,'linear');	

		//Включаем фон
		objects.desktop.texture=gres.desktop2.texture;
		objects.desktop.visible = true;
		
		//отключаем все буквы
		for (let b of objects.l_buttons)
			b.visible = false;
				
		
		//определяем структуру слов
		main_word_conf = [3,3];
		
		//показыаем буквы кнопки
		let iter = 0;		
		for (let r = 0 ; r < 2; r++) {
			
			let num_of_col = main_word_conf[r];
			
			b_x_start = 400 - 70 * num_of_col * 0.5;
			for (let c = 0 ; c < num_of_col ; c++ ) {
				
				let wx = b_x_start + c * 70;
				let wy = 300 + r * 70;
				
				anim2.add(objects.l_buttons[iter],{y:[450, wy]}, true, 0.7,'easeOutBack');	
				objects.l_buttons[iter].x = wx;
				
				objects.l_buttons[iter].set_letter(main_word[iter]);
				objects.l_buttons[iter].visible = true;	
				iter ++;
			}			
			
		}
		
		
		some_process.main = this.process.bind(game);
		
	},
	
	async update_opp_skin () {
				
		
		//считываем и обновляем скин соперника
		let _skin = await firebase.database().ref(players_node+'/'+opp_data.uid +"/skin").once('value');
		_skin = _skin.val();
		
		//если такого скина нет
		if (gres[_skin+'_idle'] === undefined)
			return;
		
		opp_data.skin = _skin;
		this.set_player_state(objects.opp_icon, objects.opp_icon.state);

	},
		
	async stop (result) {
						
				
		//если отменяем игру то сначала предупреждение
		if (result === 'my_cancel') {			
			if (objects.req_cont.visible === true) {
				sound.play('locked');	
				return;			
			}
			
			let conf = await confirm_dialog.show(['Уверены?','Exit?'][LANG]);
			if (conf === 'no')
				return;			
		}
		
		
		
		//отключаем процессинги
		some_process.main = function(){};
				
		//принимаем локальный стейт
		state = 'o';
				
		//убираем кнопку выхода
		objects.exit_button.visible = false;		
		
		//убираем окно подтверждения если оно есть
		if (objects.confirm_cont.visible === true && objects.confirm_cont.ready === true )
			anim2.add(objects.confirm_cont,{y:[objects.confirm_cont.y,-300]}, false, 1,'easeInOutCubic');		
				
				
		if (game_platform === 'CRAZYGAMES' && result==='my_win')
			window.CrazyGames.SDK.game.happytime();
				
		//сначала завершаем все что связано с оппонентом
		await this.opponent.stop(result);		
						
		objects.my_wall.visible=false;
		objects.opp_wall.visible=false;
		objects.opp_card_cont.visible=false;
		objects.my_card_cont.visible=false;
		objects.cur_word.visible = false;	
		objects.my_words.visible = false;	
		objects.opp_words.visible = false;	
		objects.sea.sprite.visible = false;	
		objects.confirm_buttons_cont.visible = false;	

		//убираем все комки (они могли остаться)
		for (let b of objects.snowballs)
			b.visible = false
	

		anim2.add(objects.iceberg,{y:[objects.iceberg.y, 450]}, false, 1.57,'linear');	
		anim2.add(objects.my_icon,{y:[ objects.my_icon.y, -150]}, false, 1.7,'linear');	
		anim2.add(objects.opp_icon,{y:[ objects.opp_icon.y, -150]}, false, 1.8,'linear');	
				
		//убираем буквы		
		for (let l of objects.l_buttons)
			l.visible = false;
		
		opp_data.uid = '';
		
		set_state({state : 'o'});
						
		//показыаем рекламу		
		await ad.show();
		
		main_menu.activate();		

	},

	letter_down(l) {			
		
		if (this.my_sink === 1 || this.opp_sink === 1  || objects.req_cont.visible === true)
			return;
		
		
		sound.play('letter_click');	
		objects.cur_word.text +=l.letter;
		
		if (objects.confirm_buttons_cont.visible === false)
			anim2.add(objects.confirm_buttons_cont,{x:[900,objects.confirm_buttons_cont.sx]}, true, 0.25,'easeOutBack');	
	
		
	},
		
	erase() {
		
		sound.play('letter_erase');	
		if (objects.cur_word.text.length === 1)
			objects.confirm_buttons_cont.visible=false;

		if (objects.cur_word.text.length > 0)
			objects.cur_word.text = objects.cur_word.text.slice(0, -1);
		
	
	},
	
	confirm () {
		
		
		if (objects.confirm_buttons_cont.ready === false || objects.req_cont.visible === true) {
			sound.play('locked');	
			return;			
		}
		
		
		//убираем кнопки
		anim2.add(objects.confirm_buttons_cont,{x:[objects.confirm_buttons_cont.x, 900]}, false, 0.25,'easeInBack');	

		
		if (this.word_hist.includes(objects.cur_word.text) === true) {
			objects.cur_word.text ='';	
			message.add(['Это слово уже назвали!','This word has already been called!'][LANG])
			return;
		}
		
		if (dict0.includes(objects.cur_word.text)===false && dict1.includes(objects.cur_word.text)===false) {
			objects.cur_word.text ='';	
			message.add(['Я не знаю такого слова!','I do not know such a word!'][LANG])
			return;	
		}
		
		//Все нормально
		this.word_hist.push(objects.cur_word.text)
		objects.my_words.text += objects.cur_word.text +' ';			
		this.turn_word_to_bullets(objects.cur_word.text, OPP, game_id);
		this.opponent.send_move(objects.cur_word.text);
		objects.cur_word.text ='';	
	
	},
		
	add_wall_break(wall){		
	
		const sparks=[objects.spark0,objects.spark1,objects.spark2,objects.spark3,objects.spark4];
		const sx=wall.x;
		const sy=wall.y+50;
		const ang=Math.PI*2/sparks.length;
		const ang2=Math.random();

		for (let i=0;i<sparks.length;i++){
			
			const spark=sparks[i];
			spark.tint=wall.tint;
			spark.rotation=Math.random()*6.26;			
			const dx=Math.sin(i*ang+ang2)*150;
			const dy=Math.cos(i*ang+ang2)*150;			
			anim2.add(spark,{x:[sx,sx+dx],y:[sy,sy+dy],alpha:[1,0]}, false, 0.6,'linear');
		}
	},
		
	add_snow_pieces(x, y , target) {
				
		for (let p of objects.s_pieces) {			
			
			if (p.visible === false) {
				
				let rnd_angle = Math.random() * 6.28;
				let dx = Math.sin(rnd_angle)*45;
				let dy = Math.cos(rnd_angle)*45;
				
				let r_snow = irnd(0,4);
				p.texture = gres['snow_hit'+r_snow].texture;
				anim2.add(p,{alpha : [1,0], angle: [Math.random()*20-10,Math.random()*20-10],x:[x,x+dx], y:[y,y+dy]}, false, 1.5,'easeOutCubic');
				return;				
			}				
		}	
	},
		
	async turn_word_to_bullets(word, target, id) {	
	
	
		//фиксируем время слова
		this.last_word_time = Date.now();
		
		this.time_pen_row = 0;
			
		//зависимость сдвига от количества букв
		let x_shift = [0,1,2,4,5,6,7,8,8,10,10,10,10,10,10,10,10,10];
		
		//добавляем комки
		for (let i = 0 ; i < word.length ; i++) {		
			if (game_id !== id)
				return;
			
			this.add_bullet(word[i], target, x_shift[i]);			
			await new Promise((resolve, reject) => wait_timer.add(0.15,resolve));
		}
		
	},
	
	add_bullet(letter, target, x_shift) {			
		

		for (let b of objects.snowballs) {
			if (b.visible === false) {
				
				b.set_letter(letter);

				if (target === ME) {
					b.x = objects.opp_icon.x;	
					b.time = 0;
					b.dx = -5;
					b.dr = -0.25;
					
					//устнавливаем сосотояние броска
					this.set_player_state(objects.opp_icon, THROWING);
				}
				else 
				{
					b.x = objects.my_icon.x;	
					b.time = 0;
					b.dx = 5;
					b.dr = 0.25;
					
					//устнавливаем сосотояние броска
					this.set_player_state(objects.my_icon, THROWING);
				}
				
				b.y = 90;				
				b.active = 1;
				b.target = target;
				b.rotation = 0;
				b.x_shift = x_shift;
				sound.play('throw');	
				anim2.add(b,{alpha:[0, 1]}, true, 0.2,'linear');	
				return;
			}			
		}	
	
	},
	
	add_blood_splash(x,y) {
		
		
		for (let p of objects.blood) {			
			
			if (p.visible === false) {				
				let rnd_angle = Math.random() * 3.14-1.57;
				let dx = Math.sin(rnd_angle)*45;
				let dy = Math.cos(rnd_angle)*45;
				anim2.add(p,{alpha : [1,0], scale_xy :[1,3], angle: [Math.random()*20-10,Math.random()*20-10],x:[x,x+dx], y:[y,y+dy]}, false, 5,'easeOutCubic');
			}				
		}	
		
	},
	
	async sink_opponent() {
		
		
		//убираем кнопки
		anim2.add(objects.exit_button,{x:[objects.exit_button.x,-50]},false,0.5,'linear');		
		if (objects.confirm_buttons_cont.visible===true)
			anim2.add(objects.confirm_buttons_cont,{x:[objects.confirm_buttons_cont.x, 900]}, true, 0.25,'easeInBack');	
		
		sound.play('falling');	
		
		objects.shark.x = 815;
		objects.shark.scale.x = -0.666;
		objects.shark.texture  = gres.shark.texture;		
		
		this.set_player_state(objects.opp_icon, FALLING);		
		this.opp_sink = 1;
		
		await anim2.add(objects.opp_icon,{x:[objects.opp_icon.x,710],y:[objects.opp_icon.y,330]}, true, 2,'linear');
		sound.play('hero_sink');	
		this.set_player_state(objects.opp_icon, SINKING);
		anim2.add(objects.opp_icon,{y:[objects.opp_icon.y,objects.opp_icon.y+50]}, true, 3,'linear');			
		await anim2.add(objects.shark,{y:[950,280]},true,2,'linear');
		objects.shark.texture  = gres.shark_ate_texture.texture;
		sound.play('hero_death');	
		anim2.kill_anim(objects.opp_icon);
		this.add_blood_splash(objects.opp_icon.x , objects.opp_icon.y);
		objects.opp_icon.visible=false;
		await anim2.add(objects.shark,{y:[280,340], alpha:[1,0]},false,4,'linear');
		this.stop('my_win');
	},
	
	async sink_me() {
		
		
		//убираем кнопки
		anim2.add(objects.exit_button,{x:[objects.exit_button.x,-50]},false,0.5,'linear');		
		if (objects.confirm_buttons_cont.visible===true)
			anim2.add(objects.confirm_buttons_cont,{x:[objects.confirm_buttons_cont.x, 900]}, true, 0.25,'easeInBack');	

		sound.play('falling');	
		objects.shark.scale.x = 0.6666;
		objects.shark.texture  = gres.shark.texture;
		objects.shark.x = -5;
		
		this.set_player_state(objects.my_icon, FALLING);
		this.my_sink = 1;
		await anim2.add(objects.my_icon,{x:[objects.my_icon.x,100],y:[objects.my_icon.y,330]}, true, 1.5,'linear');
		sound.play('hero_sink');	
		this.set_player_state(objects.my_icon, SINKING);
		anim2.add(objects.my_icon,{y:[objects.my_icon.y,objects.my_icon.y+50]}, true, 3,'linear');			
		await anim2.add(objects.shark,{y:[950,280]},true,2,'linear');
		objects.shark.texture  = gres.shark_ate_texture.texture;
		sound.play('hero_death');	
		anim2.kill_anim(objects.my_icon);
		this.add_blood_splash(objects.my_icon.x , objects.my_icon.y);
		objects.my_icon.visible=false;
		await anim2.add(objects.shark,{y:[280,340], alpha:[1,0]},false,4,'linear');
		this.stop('my_lose');
		
	},
		
	exit_button_down() {
		
		if (objects.big_message_cont.visible === true || objects.req_cont.visible === true)
			return;
		
		this.stop('my_cancel');
		
	},
		
	set_player_state(player, p_state) {
		
		
		player.state = p_state;
		player.state_time = game_tick;
		let skin = 'peng';
		
		if (player === objects.my_icon)
			skin = my_data.skin;
		else
			skin = opp_data.skin;
		
		switch (p_state) {
						
			case IDLE:
				player.texture = gres[skin+'_idle'].texture;
			break;
			
			case HITED:
				player.texture = gres[skin+'_hited'].texture;
			break;
			
			case THROWING:
				player.texture = gres[skin+'_throwing'].texture;
			break;
			
			case FALLING:
				player.texture = gres[skin+'_falling'].texture;
			break;
			
			case SINKING:
				player.texture = gres[skin+'_sinking'].texture;
			break;
		}
		
		
	},
		
	process() {
		
		//обработка комков
		for (let b of objects.snowballs) {
						
			if (b.visible === true && b.active === 1) {				

				b.x += b.dx;
				b.time++;
				b.y = 110 - Math.abs(Math.cos(b.time*0.25))*20 					
				
				
				//если комок улетел не туда
				if (b.x >= 630 || b.x <= 160) {
					anim2.add(b,{alpha:[1, 0]}, false, 0.2,'linear');	
					b.active=0;
					continue;					
				}						
				
				if (b.target === ME) {
					
					//если попали в стену
					if (objects.my_wall.visible && b.x < objects.my_wall.x+40){
						b.visible = false;	
						b.active=0
						sound.play('wall_hit');
						this.add_snow_pieces(b.x ,b.y, ME);
						this.add_snow_pieces(b.x ,b.y, ME);
						this.add_snow_pieces(b.x ,b.y, ME);
						objects.my_wall.life--;
						if (objects.my_wall.life<=0) {
							objects.my_wall.visible=false;
							this.add_wall_break(objects.my_wall);
							sound.play('wall_break');return;
						}
						//меняем текстуру
						objects.my_wall.texture=gres['wall'+this.wall_decay[my_data.wall][objects.my_wall.life]].texture;
						return;
					}
					
					
					if (b.x < objects.my_icon.x+30) {
						b.visible = false;	
						b.active=0
						sound.play('snowball_hit');
						if (this.my_sink === 0 && this.opp_sink === 0) {
							this.my_move_amount += b.x_shift;
							this.set_player_state(objects.my_icon, HITED);
							this.add_snow_pieces(b.x ,b.y, ME);
							this.add_snow_pieces(b.x ,b.y, ME);
							this.add_snow_pieces(b.x ,b.y, ME);
						}
					}						
				}
				else
				{		


					//если попали в стену
					if (objects.opp_wall.visible && b.x > objects.opp_wall.x-40){
						b.visible = false;	
						b.active=0
						sound.play('wall_hit');	
						this.add_snow_pieces(b.x ,b.y, OPP);
						this.add_snow_pieces(b.x ,b.y, OPP);
						this.add_snow_pieces(b.x ,b.y, OPP);
						objects.opp_wall.life--;
						if (objects.opp_wall.life<=0) {
							sound.play('wall_break');
							this.add_wall_break(objects.opp_wall);
							objects.opp_wall.visible=false;return;
						}
						//меняем текстуру
						objects.opp_wall.texture=gres['wall'+this.wall_decay[opp_data.wall][objects.opp_wall.life]].texture;
						return;
					}
			
					if (b.x > objects.opp_icon.x-30) {
						b.visible = false;		
						b.active=0
						
						sound.play('snowball_hit');
						if (this.my_sink === 0 && this.opp_sink === 0) {
							this.opp_move_amount +=  b.x_shift;									
							this.set_player_state(objects.opp_icon, HITED);		
							this.add_snow_pieces(b.x ,b.y, OPP);
							this.add_snow_pieces(b.x ,b.y, OPP);
							this.add_snow_pieces(b.x ,b.y, OPP);
						}
					}
				}								
			}			
		}		
		
		//обработка состояний
		if (objects.opp_icon.state === HITED)
			if (game_tick - objects.opp_icon.state_time > 0.5)
				this.set_player_state(objects.opp_icon, IDLE);

		
		if (objects.my_icon.state === HITED)
			if (game_tick - objects.my_icon.state_time > 0.5)
				this.set_player_state(objects.my_icon, IDLE);

		
		if (objects.opp_icon.state === THROWING)
			if (game_tick - objects.opp_icon.state_time > 0.5)
				this.set_player_state(objects.opp_icon, IDLE);

		
		if (objects.my_icon.state === THROWING)
			if (game_tick - objects.my_icon.state_time > 0.5)
				this.set_player_state(objects.my_icon, IDLE);
		
		
		
		//перемещение игроков  0 1 2 3 4 5 6 7 8 9 
		
		if (this.my_move_amount > 0) {
			
			let shift_amount = this.shift_vs_amount[this.my_move_amount];			
			objects.my_icon.x -= shift_amount;
			this.my_move_amount -= shift_amount;
		}
		
		if (this.opp_move_amount > 0) {
			
			let shift_amount = this.shift_vs_amount[this.opp_move_amount];	
			objects.opp_icon.x += shift_amount;
			this.opp_move_amount -= shift_amount;
		}
				
	
		// анимация волны
		for (let i = 0; i < objects.sea.points.length; i++) 
			objects.sea.points[i].y = Math.sin((i * 1.5) + game_tick * 4) * 3 + 400;
		
		//наказание за простой
		if (my_role === 'master') {
			if (Date.now() > this.last_word_time + this.max_idle_time ) {
				
				
				//выбираем новую букву
				let new_let = this.get_new_letter();
				
				//отправляем слейву
				if (state === 'p')
					firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"TIME_HIT",new_let:new_let,tm:Date.now()});
				
				this.time_hit(new_let);					
			}
		
		}
		
		//проверка падения
		if (this.my_sink === 0 && this.opp_sink === 0) {
			
			if (this.my_move_amount === 0)
				if (objects.my_icon.x <= 170)
					this.sink_me();
			
			//проверяем падение оппонента но только если я сам не утанул
			if (this.opp_move_amount === 0 && this.my_sink === 0)
				if (objects.opp_icon.x >= 630)
					this.sink_opponent();
		}
	
	},
	
	get_new_letter() {
		
		let block0='ОЕАИНТСРВЛКМДПГЗБУЯ';	
		if(LANG===1)
			block0='EARIOTNSLCUDPMHGBFYWKVXZJQ';	
		
		for (let i = 0 ; i < 100 ; i++) {
					
			let new_let = block0[irnd(0,block0.length-1)];		
			let already_have = 0;
			for (let l_b of objects.l_buttons) {				
				if (new_let === l_b.letter)
					already_have = 1;
			}	
			
			if (already_have === 0)
				return new_let;	
			
		}
	},
	
	async receive_move (word) {
		

		game.turn_word_to_bullets(word, ME, game_id);
		
		//проверяем если слово уже есть
		if (this.word_hist.includes(word) === true)
			return;
		
		this.word_hist.push(word)
		objects.opp_words.text += word +' ';			
		
		
	},
	
	async time_hit(new_let) {
		
		//фиксируем время слова
		this.last_word_time = Date.now();		
		
		await anim2.add(objects.angry_clock,{y:[-100,objects.angry_clock.sy]}, true, 0.75,'easeOutBack');
		
		anim2.add(objects.angry_clock,{y:[objects.angry_clock.sy,-100]}, false, 0.5,'easeInBack');
		
		console.log("Time hit", my_role, objects.my_icon.x, objects.opp_icon.x);
				
		let shift_vs_row = [5,10,15,20,20,20,25,25,25,25,25,25,25,25];
		
		//проигрываем звук
		sound.play('clock');	
		
		
		//передвигаем обоих
		this.my_move_amount += shift_vs_row[this.time_pen_row];
		this.opp_move_amount += shift_vs_row[this.time_pen_row];
		

		this.time_pen_row++;		
		
		
		//первая новая буква
		if (objects.l_buttons[6].visible === false) {
			
			objects.l_buttons[6].set_letter(new_let);		
			objects.l_buttons[6].x = 470;
			anim2.add(objects.l_buttons[6],{y:[450,300]}, true, 0.5,'easeOutCubic');			
			
			for (let b = 0 ; b < 3; b++)
				anim2.add(objects.l_buttons[b],{x:[objects.l_buttons[b].x,objects.l_buttons[b].x-35]}, true, 0.5,'linear');	
			main_word_conf[0] = 4;
			return;
		}
		
		//вторая новая буква
		if (objects.l_buttons[7].visible === false) {
			
			objects.l_buttons[7].set_letter(new_let);		
			objects.l_buttons[7].x = 470;
			anim2.add(objects.l_buttons[7],{y:[450,370]}, true, 0.5,'easeOutCubic');			
			
			for (let b = 3 ; b < 6; b++)
				anim2.add(objects.l_buttons[b],{x:[objects.l_buttons[b].x,objects.l_buttons[b].x-35]}, true, 0.5,'linear');	
			main_word_conf[1] = 4;
			return;
		}
		
		//третья новая буква
		if (objects.l_buttons[8].visible === false) {
			
			objects.l_buttons[8].set_letter(new_let);		
			objects.l_buttons[8].x = 505;
			anim2.add(objects.l_buttons[8],{y:[450,300]}, true, 0.5,'easeOutCubic');			
			
			anim2.add(objects.l_buttons[0],{x:[objects.l_buttons[0].x,objects.l_buttons[0].x-35]}, true, 0.5,'linear');	
			anim2.add(objects.l_buttons[1],{x:[objects.l_buttons[1].x,objects.l_buttons[1].x-35]}, true, 0.5,'linear');	
			anim2.add(objects.l_buttons[2],{x:[objects.l_buttons[2].x,objects.l_buttons[2].x-35]}, true, 0.5,'linear');	
			anim2.add(objects.l_buttons[6],{x:[objects.l_buttons[6].x,objects.l_buttons[6].x-35]}, true, 0.5,'linear');	
			main_word_conf[0] = 5;
			return;
		}

		
	}
		
	
}

var keep_alive = function() {
	
	if (h_state === 1) {		
		
		//убираем из списка если прошло время с момента перехода в скрытое состояние		
		let cur_ts = Date.now();	
		let sec_passed = (cur_ts - hidden_state_start)/1000;		
		if ( sec_passed > 100 )	firebase.database().ref("states/"+my_data.uid).remove();
		return;		
	}


	firebase.database().ref(players_node+'/'+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);
	firebase.database().ref("inbox/"+my_data.uid).onDisconnect().remove();
	firebase.database().ref(room_name + "/"+my_data.uid).onDisconnect().remove();

	set_state({});
}

var process_new_message = function(msg) {

	//проверяем плохие сообщения
	if (msg===null || msg===undefined)
		return;

	//принимаем только положительный ответ от соответствующего соперника и начинаем игру
	if (msg.message==="ACCEPT"  && pending_player===msg.sender && state !== "p") {
		//в данном случае я мастер и хожу вторым
		game_id=msg.game_id;
		main_word=msg.main_word;
		cards_menu.accepted_invite();
	}

	//принимаем также отрицательный ответ от соответствующего соперника
	if (msg.message==="REJECT"  && pending_player===msg.sender) {
		cards_menu.rejected_invite();
	}

	//получение сообщение в состояни игры
	if (state==="p") {

		//учитываем только сообщения от соперника
		if (msg.sender===opp_data.uid) {

			//получение отказа от игры
			if (msg.message==="SYN_OK")
				game.opponent.syn_ok = 1;

			//получение согласия на игру
			if (msg.message==="TIME_HIT")
				game.time_hit(msg.new_let);

			//получение стикера
			if (msg.message==="MSG")
				stickers.receive(msg.data);

			//получение сообщение об отмене игры
			if (msg.message==="opp_cancel" )
				game.stop('opp_cancel');
								
			//получение сообщение с ходом игорка
			if (msg.message==="MOVE")
				game.receive_move(msg.data);
			
			//получение сообщения о сдаче
			if (msg.message==="opp_hidden")
				game.stop("opp_hidden");
		}
	}

	//приглашение поиграть
	if(state==="o" || state==="b") {
		if (msg.message==="INV") {
			req_dialog.show(msg.sender);
		}
		if (msg.message==="INV_REM") {
			//запрос игры обновляет данные оппонента поэтому отказ обрабатываем только от актуального запроса
			if (msg.sender===req_dialog._opp_data.uid)
				req_dialog.hide(msg.sender);
		}
	}
}

var req_dialog = {
	
	_opp_data : {} ,
	
	show(uid) {		

		firebase.database().ref(players_node+'/'+uid).once('value').then((snapshot) => {

			//не показываем диалог если мы в игре
			if (state === 'p')
				return;

			player_data=snapshot.val();

			//показываем окно запроса только если получили данные с файербейс
			if (player_data===null) {
				//console.log("Не получилось загрузить данные о сопернике");
			}	else	{


				sound.play('invite');	
				//защита от неправильного рейтинга
				player_data.rating = player_data.rating || 1400;
				
				//так как успешно получили данные о сопернике то показываем окно	
				anim2.add(objects.req_cont,{y:[-260, objects.req_cont.sy]}, true, 1,'easeOutElastic');

				//Отображаем  имя и фамилию в окне приглашения
				req_dialog._opp_data.name=player_data.name;
				make_text(objects.req_name,player_data.name,200);
				objects.req_rating.text=player_data.rating;
				req_dialog._opp_data.rating=player_data.rating;
				

				//throw "cut_string erroor";
				req_dialog._opp_data.uid=uid;

				//загружаем фото
				this.load_photo(player_data.pic_url);

			}
		});
	},

	load_photo: function(pic_url) {


		//сначала смотрим на загруженные аватарки в кэше
		if (PIXI.utils.TextureCache[pic_url]===undefined || PIXI.utils.TextureCache[pic_url].width===1) {

			//console.log("Загружаем текстуру "+objects.mini_cards[id].name)
			var loader = new PIXI.Loader();
			loader.add("inv_avatar", pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE});
			loader.load((loader, resources) => {
				objects.req_avatar.texture=loader.resources.inv_avatar.texture;
			});
		}
		else
		{
			//загружаем текустуру из кэша
			//console.log("Ставим из кэша "+objects.mini_cards[id].name)
			objects.req_avatar.texture=PIXI.utils.TextureCache[pic_url];
		}

	},

	reject: function() {

		if (objects.req_cont.ready===false)
			return;
		
		sound.play('click');	

		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 0.5,'easeInBack');
				
		firebase.database().ref("inbox/"+req_dialog._opp_data.uid).set({sender:my_data.uid,message:"REJECT",tm:Date.now()});
	},

	accept: function() {
				
		if (objects.req_cont.ready===false || objects.rules_cont.visible===true ) {
			sound.play('bad_move');	
			return;			
		}
		
		//только когда бот сделал ход
		//if (state ==='b')
		//	return;
		
		sound.play('click');	
		
		//устанавливаем окончательные данные оппонента
		opp_data=req_dialog._opp_data;

		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 1,'easeInBack');

		//придумываем слово
		main_word = get_random_word();

				
		//отправляем информацию о согласии играть с идентификатором игры и словом
		game_id=~~(Math.random()*999);
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"ACCEPT",tm:Date.now(),game_id:game_id, main_word : main_word});

		//заполняем карточку оппонента
		make_text(objects.opp_card_name,opp_data.name,150);
		objects.opp_card_rating.text=objects.req_rating.text;
		objects.opp_avatar.texture=objects.req_avatar.texture;

		main_menu.close();
		cards_menu.close();
		game.activate("slave" , online_player );

	},

	hide: function() {

		//если диалог не открыт то ничего не делаем
		if (objects.req_cont.ready===false || objects.req_cont.visible===false)
			return;

		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 0.5,'easeInBack');
	}

}

var	ad = {
			
	show : async function() {
		
		if (game_platform==="YANDEX") {			
			//показываем рекламу
			window.ysdk.adv.showFullscreenAdv({
			  callbacks: {
				onClose: function() {}, 
				onError: function() {}
						}
			})
		}
		
		if (game_platform==="VK") {
					 
			await vkBridge.send("VKWebAppShowNativeAds", {ad_format:"interstitial"});	
		}		

		if (game_platform==="MY_GAMES") {
					 
			my_games_api.showAds({interstitial:true});
		}			
		
		if (game_platform==='CRAZYGAMES') {
			const callbacks = {
				adFinished: () => console.log("End midgame ad (callback)"),
				adError: (error) => console.log("Error midgame ad (callback)", error),
				adStarted: () => console.log("Start midgame ad (callback)"),
			};
			window.CrazyGames.SDK.ad.requestAd("midgame", callbacks);		
		}
		
		
	},
	
	show2 : async function() {
		
		
		if (game_platform ==="YANDEX") {
			
			let res = await new Promise(function(resolve, reject){				
				window.ysdk.adv.showRewardedVideo({
						callbacks: {
						  onOpen: () => {},
						  onRewarded: () => {resolve('ok')},
						  onClose: () => {resolve('err')}, 
						  onError: (e) => {resolve('err')}
					}
				})
			
			})
			return res;
		}
		
		if (game_platform === "VK") {	

			let res = '';
			try {
				res = await vkBridge.send("VKWebAppShowNativeAds", { ad_format: "reward" })
			}
			catch(error) {
				res ='err';
			}
			
			return res;				
			
		}	
		
		return 'err';
		
	}
}

var main_menu = {
	
	activate: function() {

		//процессинг главного меню
		some_process.main_menu = this.process;
		
		//просто добавляем контейнер с кнопками
		objects.desktop.visible=true;
		//objects.desktop.alpha=0.8;
		objects.desktop.texture=gres.desktop.texture;
		
		//показываем название игры
		anim2.add(objects.maze_logo,{alpha: [0,1],y:[-200, objects.maze_logo.sy]}, true, 1,'linear');
		
		//показываем кнопку магазина
		anim2.add(objects.shop_button,{x:[-200, objects.shop_button.sx]}, true, 1,'linear');
		
		//показываем кнопки
		anim2.add(objects.main_buttons_cont,{y:[450, objects.main_buttons_cont.sy],alpha: [0,1]}, true, 0.75,'linear');
		
	},	

	close : async function() {

		//отключаем процессинг
		some_process.main_menu = function(){};
		
		//убираем название игры
		anim2.add(objects.maze_logo,{alpha: [1,0]}, false, 0.5,'linear');
		
		//убираем кнопки
		anim2.add(objects.main_buttons_cont,{y:[ objects.main_buttons_cont.y, 450],alpha: [1,0]}, false, 0.5,'linear');
		
		//убираем кнопку магазина
		anim2.add(objects.shop_button,{x:[objects.shop_button.x, -200]}, false, 1,'linear');
		
		//убираем море
		anim2.add(objects.sea.sprite,{alpha: [1,0]}, false, 0.5,'linear');

		objects.desktop.alpha=1;
	},

	play_button_down: async function () {

		if (objects.big_message_cont.visible === true || objects.main_buttons_cont.ready === false || objects.id_cont.visible === true) {
			sound.play('bad_move');	
			return;			
		}

		//играем звук
		sound.play('click');	

		//ждем когда главное меню закроется
		await this.close();
		
		//активируем меню выбора соперников
		cards_menu.activate();

	},

	lb_button_down: function () {

		if (objects.big_message_cont.visible === true ||  objects.main_buttons_cont.ready === false) {
			sound.play('bad_move');	
			return;			
		}

		sound.play('click');	
		this.close();
		lb.show();

	},

	rules_button_down: function () {

		if (objects.big_message_cont.visible === true ||  objects.main_buttons_cont.ready === false ||  objects.rules_cont.ready === false) {
			sound.play('bad_move');	
			return;			
		}

		sound.play('click');	

	
		anim2.add(objects.rules_cont,{y:[-450, objects.rules_cont.sy]}, true, 0.5,'easeOutBack');

	},

	rules_ok_down: function () {
		
		if (objects.big_message_cont.visible === true ||  objects.rules_cont.ready === false) {
			sound.play('bad_move');	
			return;			
		}
		
		anim2.add(objects.rules_cont,{y:[objects.rules_cont.y,-450, ]}, false, 0.5,'easeInBack');
	},
	
	shop_button_down : function() {
		
		//message.add('Закрыто!');
		//return;
		
		
		if (objects.shop_button.ready === false || objects.big_message_cont.visible === true || objects.main_buttons_cont.ready === false || objects.id_cont.visible === true) {
			sound.play('bad_move');	
			return;			
		}		
		
		this.close();
		shop.activate();		
		
	},
		
	process : function () {
		
		// анимация волны
		//for (let i = 0; i < objects.sea.points.length; i++) 
		//	objects.sea.points[i].y = Math.sin((i * 1.5) + game_tick * 8) * 3 + 400;
	
	}

}

var shop = {
	
	
	activate : function () {
		
		anim2.add(objects.shop_cont,{alpha: [0,1]}, true, 0.5,'linear');
		objects.desktop.texture=gres.desktop2.texture;
		objects.ice_cream_balance.text = 'x' + my_data.money;
	},
	
	async try_buy_skin(data){
		
		if (my_data.skin === data.name) {
			message.add(['У вас уже есть этот скин!!!','You already have this skin'][LANG]);
			return;
		}
		
		let res = await confirm_dialog.show(['Точно хотите купить?','Sure?'][LANG]);
		if (res === 'no')
			return;
		
		//обновляем количество денег
		my_data.money -= data.price;
		firebase.database().ref(players_node+'/'+my_data.uid+'/money').set(my_data.money);
		firebase.database().ref(players_node+'/'+my_data.uid+'/skin').set(data.name);
		objects.ice_cream_balance.text = 'x' + my_data.money;
		my_data.skin = data.name;
		message.add(['Вы купили новый скин )))','You bought a new skin)))'][LANG])
				
		//обновляем мою иконку
		game.set_player_state(objects.my_icon, objects.my_icon.state);
		
	},
	
	async try_buy_wall(data){
		
		if (my_data.wall !== 0) {
			message.add(['У вас уже есть стена!!!','You already have a wall'][LANG]);
			return;
		}
		
		let res = await confirm_dialog.show(['Точно хотите купить?','Sure?'][LANG]);
		if (res === 'no')
			return;
		
		//обновляем количество денег
		my_data.money -= data.price;
		firebase.database().ref(players_node+'/'+my_data.uid+'/money').set(my_data.money);
		firebase.database().ref(players_node+'/'+my_data.uid+'/wall').set(data.wall);
		objects.ice_cream_balance.text = 'x' + my_data.money;
		my_data.wall = data.wall;
		message.add(['У Вас есть стена на игровой сеанс)))','You bought a wall)))'][LANG])
		
	},
			
	card_down () {
		
		if (objects.confirm_cont.visible === true) return;
		
		if (this.data.price > my_data.money) {
			message.add(['Недостаточно мороженок (((','Not enough icecream((('][LANG]);
			return;
		}
		
		if (this.data.type==='skin') shop.try_buy_skin(this.data);
		if (this.data.type==='wall') shop.try_buy_wall(this.data);
	
	},
		
	exit_down : function() {
		
		if (objects.shop_cont.ready === false)
			return;
		
		this.close();
		main_menu.activate();
		
	},	
			
	close : function () {
		
		anim2.add(objects.shop_cont,{alpha: [1,0]}, false, 0.5,'linear');
		objects.desktop.texture=gres.desktop.texture;
	}
	
}

var lb = {

	cards_pos: [[370,10],[380,70],[390,130],[380,190],[360,250],[330,310],[290,370]],

	show: function() {

		objects.desktop.visible=true;
		objects.desktop.texture=game_res.resources.lb_bcg.texture;

		
		anim2.add(objects.lb_1_cont,{x:[-150, objects.lb_1_cont.sx]}, true, 1,'easeOutBack');
		anim2.add(objects.lb_2_cont,{x:[-150, objects.lb_2_cont.sx]}, true, 1,'easeOutBack');
		anim2.add(objects.lb_3_cont,{x:[-150, objects.lb_3_cont.sx]}, true, 1,'easeOutBack');
		anim2.add(objects.lb_cards_cont,{x:[450, 0]}, true, 1,'easeOutCubic');

		objects.lb_cards_cont.visible=true;
		objects.lb_back_button.visible=true;

		for (let i=0;i<7;i++) {
			objects.lb_cards[i].x=this.cards_pos[i][0];
			objects.lb_cards[i].y=this.cards_pos[i][1];
			objects.lb_cards[i].place.text=(i+4)+".";

		}


		this.update();

	},

	close: function() {


		objects.lb_1_cont.visible=false;
		objects.lb_2_cont.visible=false;
		objects.lb_3_cont.visible=false;
		objects.lb_cards_cont.visible=false;
		objects.lb_back_button.visible=false;


	},

	back_button_down: function() {

		if (objects.big_message_cont.visible === true ||  objects.lb_cards_cont.ready === false) {
			sound.play('bad_move');	
			return;			
		}

		sound.play('close_it');	
		this.close();
		main_menu.activate();

	},

	update: function () {

		firebase.database().ref(players_node).orderByChild('rating').limitToLast(25).once('value').then((snapshot) => {

			if (snapshot.val()===null) {
			  //console.log("Что-то не получилось получить данные о рейтингах");
			}
			else {

				var players_array = [];
				snapshot.forEach(players_data=> {
					if (players_data.val().name!=="" && players_data.val().name!=='' && players_data.val().name!==undefined)
						players_array.push([players_data.val().name, players_data.val().rating, players_data.val().pic_url]);
				});


				players_array.sort(function(a, b) {	return b[1] - a[1];});

				//создаем загрузчик топа
				var loader = new PIXI.Loader();

				var len=Math.min(10,players_array.length);

				//загружаем тройку лучших
				for (let i=0;i<3;i++) {
					
					if (i >= len) break;		
					if (players_array[i][0] === undefined) break;	
					
					let fname = players_array[i][0];
					make_text(objects['lb_'+(i+1)+'_name'],fname,180);					
					objects['lb_'+(i+1)+'_rating'].text=players_array[i][1];
					loader.add('leaders_avatar_'+i, players_array[i][2],{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 3000});
				};

				//загружаем остальных
				for (let i=3;i<10;i++) {
					
					if (i >= len) break;	
					if (players_array[i][0] === undefined) break;	
					
					let fname=players_array[i][0];

					make_text(objects.lb_cards[i-3].name,fname,180);

					objects.lb_cards[i-3].rating.text=players_array[i][1];
					loader.add('leaders_avatar_'+i, players_array[i][2],{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE});
				};

				loader.load();

				//показываем аватар как только он загрузился
				loader.onProgress.add((loader, resource) => {
					let lb_num=Number(resource.name.slice(-1));
					if (lb_num<3)
						objects['lb_'+(lb_num+1)+'_avatar'].texture=resource.texture
					else
						objects.lb_cards[lb_num-3].avatar.texture=resource.texture;
				});

			}

		});

	}

}

var cards_menu = {

	state_tint :{},
	_opp_data : {},
	uid_pic_url_cache : {},
	
	cards_pos: [
				[0,0],[0,90],[0,180],[0,270],
				[190,0],[190,90],[190,180],[190,270],
				[380,0],[380,90],[380,180],[380,270],
				[570,0],[570,90],[570,180]

				],

	activate: function () {

		objects.cards_cont.visible=true;
		objects.back_button_cont.visible=true;


		objects.lobby_frame.visible = true;

		objects.header4.visible=true;
		objects.desktop.texture=gres.desktop2.texture;
		//objects.desktop.alpha=0.6;

		//расставляем по соответствующим координатам
		for(let i=0;i<15;i++) {
			objects.mini_cards[i].x=this.cards_pos[i][0];
			objects.mini_cards[i].y=this.cards_pos[i][1];
		}


		//отключаем все карточки
		this.card_i=1;
		for(let i=1;i<15;i++)
			objects.mini_cards[i].visible=false;

		//добавляем карточку ии
		this.add_cart_ai();

		//включаем сколько игроков онлайн
		objects.players_online.visible=true;

		//подписываемся на изменения состояний пользователей
		firebase.database().ref(room_name) .on('value', (snapshot) => {cards_menu.players_list_updated(snapshot.val());});

	},

	players_list_updated: function(players) {

		//если мы в игре то не обновляем карточки
		if (state==="p" || state==="b")
			return;


		//это столы
		let tables = {};
		
		//это свободные игроки
		let single = {};


		//делаем дополнительный объект с игроками и расширяем id соперника
		let p_data = JSON.parse(JSON.stringify(players));
		
		//создаем массив свободных игроков
		for (let uid in players){			
			if (players[uid].state === 'o' || players[uid].state === 'b')
				if (players[uid].hidden === 0)
					single[uid] = players[uid].name;						
		}
		
		//console.table(single);
		
		//убираем не играющие состояние
		for (let uid in p_data)
			if (p_data[uid].state !== 'p')
				delete p_data[uid];
		
		
		//дополняем полными ид оппонента
		for (let uid in p_data) {			
			let small_opp_id = p_data[uid].opp_id;			
			//проходимся по соперникам
			for (let uid2 in players) {	
				let s_id=uid2.substring(0,10);				
				if (small_opp_id === s_id) {
					//дополняем полным id
					p_data[uid].opp_id = uid2;
				}							
			}			
		}
				
		
		//определяем столы
		//console.log (`--------------------------------------------------`)
		for (let uid in p_data) {
			let opp_id = p_data[uid].opp_id;
			let name1 = p_data[uid].name;
			let rating = p_data[uid].rating;
			let hid = p_data[uid].hidden;
			
			if (p_data[opp_id] !== undefined) {
				
				if (uid === p_data[opp_id].opp_id && tables[uid] === undefined) {
					
					tables[uid] = opp_id;					
					//console.log(`${name1} (Hid:${hid}) (${rating}) vs ${p_data[opp_id].name} (Hid:${p_data[opp_id].hidden}) (${p_data[opp_id].rating}) `)	
					delete p_data[opp_id];				
				}
				
			} else 
			{				
				//console.log(`${name1} (${rating}) - одиночка `)					
			}			
		}
					
		
		
		//считаем и показываем количество онлайн игроков
		let num = 0;
		for (let uid in players)
			if (players[uid].hidden===0)
				num++
			
		objects.players_online.text=['Игроков онлайн: ','Players online: '][LANG]+ num + ' (' + room_name + ')';
		
		
		//считаем сколько одиночных игроков и сколько столов
		let num_of_single = Object.keys(single).length;
		let num_of_tables = Object.keys(tables).length;
		let num_of_cards = num_of_single + num_of_tables;
		
		//если карточек слишком много то убираем столы
		if (num_of_cards > 14) {
			let num_of_tables_cut = num_of_tables - (num_of_cards - 14);			
			
			let num_of_tables_to_cut = num_of_tables - num_of_tables_cut;
			
			//удаляем столы которые не помещаются
			let t_keys = Object.keys(tables);
			for (let i = 0 ; i < num_of_tables_to_cut ; i++) {
				delete tables[t_keys[i]];
			}
		}

		
		//убираем карточки пропавших игроков и обновляем карточки оставшихся
		for(let i=1;i<15;i++) {			
			if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'single') {				
				let card_uid = objects.mini_cards[i].uid;				
				if (single[card_uid] === undefined)					
					objects.mini_cards[i].visible = false;
				else
					this.update_existing_card({id:i, state:players[card_uid].state , rating:players[card_uid].rating});
			}
		}



		
		//определяем новых игроков которых нужно добавить
		new_single = {};		
		
		for (let p in single) {
			
			let found = 0;
			for(let i=1;i<15;i++) {			
			
				if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'single') {					
					if (p ===  objects.mini_cards[i].uid) {
						
						found = 1;							
					}	
				}				
			}		
			
			if (found === 0)
				new_single[p] = single[p];
		}
		

		
		//убираем исчезнувшие столы (если их нет в новом перечне) и оставляем новые
		for(let i=1;i<15;i++) {			
		
			if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'table') {
				
				let uid1 = objects.mini_cards[i].uid1;	
				let uid2 = objects.mini_cards[i].uid2;	
				
				let found = 0;
				
				for (let t in tables) {
					
					let t_uid1 = t;
					let t_uid2 = tables[t];				
					
					if (uid1 === t_uid1 && uid2 === t_uid2) {
						delete tables[t];
						found = 1;						
					}							
				}
								
				if (found === 0)
					objects.mini_cards[i].visible = false;
			}	
		}
		
		
		//размещаем на свободных ячейках новых игроков
		for (let uid in new_single)			
			this.place_new_cart({uid:uid, state:players[uid].state, name : players[uid].name,  rating : players[uid].rating});

		//размещаем новые столы сколько свободно
		for (let uid in tables) {			
			let n1=players[uid].name
			let n2=players[tables[uid]].name
			
			let r1= players[uid].rating
			let r2= players[tables[uid]].rating
			this.place_table({uid1:uid,uid2:tables[uid],name1: n1, name2: n2, rating1: r1, rating2: r2});
		}
		
	},

	get_state_tex: function(s) {

		switch(s) {

			case "o":
				return gres.mini_player_card.texture;
			break;
			
			case "b":
				return gres.mpc_bot.texture;
			break;

		}
	},

	place_table : function (params={uid1:0,uid2:0,name1: "XXX",name2: "XXX", rating1: 1400, rating2: 1400}) {
				
		for(let i=1;i<15;i++) {

			//это если есть вакантная карточка
			if (objects.mini_cards[i].visible===false) {

				//устанавливаем цвет карточки в зависимости от состояния
				objects.mini_cards[i].state=params.state;

				objects.mini_cards[i].type = "table";
				
				
				objects.mini_cards[i].bcg.texture = gres.mini_player_card_table.texture;
				
				//присваиваем карточке данные
				//objects.mini_cards[i].uid=params.uid;
				objects.mini_cards[i].uid1=params.uid1;
				objects.mini_cards[i].uid2=params.uid2;
												
				//убираем элементы свободного стола
				objects.mini_cards[i].rating_text.visible = false;
				objects.mini_cards[i].avatar.visible = false;
				objects.mini_cards[i].name_text.visible = false;

				//Включаем элементы стола 
				objects.mini_cards[i].rating_text1.visible = true;
				objects.mini_cards[i].rating_text2.visible = true;
				objects.mini_cards[i].avatar1.visible = true;
				objects.mini_cards[i].avatar2.visible = true;
				objects.mini_cards[i].rating_bcg.visible = true;

				objects.mini_cards[i].rating_text1.text = params.rating1;
				objects.mini_cards[i].rating_text2.text = params.rating2;
				
				objects.mini_cards[i].name1 = params.name1;
				objects.mini_cards[i].name2 = params.name2;

				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid1, tar_obj:objects.mini_cards[i].avatar1});
				
				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid2, tar_obj:objects.mini_cards[i].avatar2});


				objects.mini_cards[i].visible=true;


				break;
			}
		}
		
	},

	update_existing_card: function(params={id:0, state:"o" , rating:1400}) {

		//устанавливаем цвет карточки в зависимости от состояния(имя и аватар не поменялись)
		objects.mini_cards[params.id].bcg.texture=this.get_state_tex(params.state);
		objects.mini_cards[params.id].state=params.state;

		objects.mini_cards[params.id].rating=params.rating;
		objects.mini_cards[params.id].rating_text.text=params.rating;
		objects.mini_cards[params.id].visible=true;
	},

	place_new_cart: function(params={uid:0, state: "o", name: "XXX", rating: rating}) {

		for(let i=1;i<15;i++) {

			//это если есть вакантная карточка
			if (objects.mini_cards[i].visible===false) {

				//устанавливаем цвет карточки в зависимости от состояния
				objects.mini_cards[i].bcg.texture = gres.mini_player_card.texture;
				objects.mini_cards[i].bcg.texture=this.get_state_tex(params.state);
				objects.mini_cards[i].state=params.state;

				objects.mini_cards[i].type = "single";

				//присваиваем карточке данные
				objects.mini_cards[i].uid=params.uid;

				//убираем элементы стола так как они не нужны
				objects.mini_cards[i].rating_text1.visible = false;
				objects.mini_cards[i].rating_text2.visible = false;
				objects.mini_cards[i].avatar1.visible = false;
				objects.mini_cards[i].avatar2.visible = false;
				objects.mini_cards[i].rating_bcg.visible = false;
				
				//включаем элементы свободного стола
				objects.mini_cards[i].rating_text.visible = true;
				objects.mini_cards[i].avatar.visible = true;
				objects.mini_cards[i].name_text.visible = true;

				objects.mini_cards[i].name=params.name;
				make_text(objects.mini_cards[i].name_text,params.name,110);
				objects.mini_cards[i].rating=params.rating;
				objects.mini_cards[i].rating_text.text=params.rating;

				objects.mini_cards[i].visible=true;

				//стираем старые данные
				objects.mini_cards[i].avatar.texture=PIXI.Texture.EMPTY;

				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid, tar_obj:objects.mini_cards[i].avatar});

				//console.log(`новая карточка ${i} ${params.uid}`)
				break;
			}
		}

	},

	get_texture : function (pic_url) {
		
		return new Promise((resolve,reject)=>{
			
			//меняем адрес который невозможно загрузить
			if (pic_url==="https://vk.com/images/camera_100.png")
				pic_url = "https://i.ibb.co/fpZ8tg2/vk.jpg";

			//сначала смотрим на загруженные аватарки в кэше
			if (PIXI.utils.TextureCache[pic_url]===undefined || PIXI.utils.TextureCache[pic_url].width===1) {

				//загружаем аватарку игрока
				//console.log(`Загружаем url из интернети или кэша браузера ${pic_url}`)	
				let loader=new PIXI.Loader();
				loader.add("pic", pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 5000});
				loader.load(function(l,r) {	resolve(l.resources.pic.texture)});
			}
			else
			{
				//загружаем текустуру из кэша
				//console.log(`Текстура взята из кэша ${pic_url}`)	
				resolve (PIXI.utils.TextureCache[pic_url]);
			}
		})
		
	},
	
	get_uid_pic_url : function (uid) {
		
		return new Promise((resolve,reject)=>{
						
			//проверяем есть ли у этого id назначенная pic_url
			if (this.uid_pic_url_cache[uid] !== undefined) {
				//console.log(`Взяли pic_url из кэша ${this.uid_pic_url_cache[uid]}`);
				resolve(this.uid_pic_url_cache[uid]);		
				return;
			}

							
			//получаем pic_url из фб
			firebase.database().ref(players_node+'/'+ uid + "/pic_url").once('value').then((res) => {

				pic_url=res.val();
				
				if (pic_url === null) {
					
					//загрузить не получилось поэтому возвращаем случайную картинку
					resolve('https://avatars.dicebear.com/v2/male/'+irnd(10,10000)+'.svg');
				}
				else {
					
					//добавляем полученный pic_url в кэш
					//console.log(`Получили pic_url из ФБ ${pic_url}`)	
					this.uid_pic_url_cache[uid] = pic_url;
					resolve (pic_url);
				}
				
			});		
		})
		
	},
	
	load_avatar2 : function (params = {uid : 0, tar_obj : 0, card_id : 0}) {
		
		//получаем pic_url
		this.get_uid_pic_url(params.uid).then(pic_url => {
			return this.get_texture(pic_url);
		}).then(t=>{			
			params.tar_obj.texture=t;			
		})	
	},

	add_cart_ai: function() {

		//убираем элементы стола так как они не нужны
		objects.mini_cards[0].rating_text1.visible = false;
		objects.mini_cards[0].rating_text2.visible = false;
		objects.mini_cards[0].avatar1.visible = false;
		objects.mini_cards[0].avatar2.visible = false;
		objects.mini_cards[0].rating_bcg.visible = false;

		objects.mini_cards[0].bcg.texture=gres.mpc_ai.texture;
		objects.mini_cards[0].visible=true;
		objects.mini_cards[0].uid="AI";
		objects.mini_cards[0].name=['Бот','Bot'][LANG];
		objects.mini_cards[0].name_text.text=['Бот','Bot'][LANG];
		objects.mini_cards[0].rating_text.text='1400';
		objects.mini_cards[0].rating=1400;
		objects.mini_cards[0].avatar.texture=game_res.resources.pc_icon.texture;
	},
	
	card_down : function ( card_id ) {
		
		if (objects.mini_cards[card_id].type === 'single')
			this.show_invite_dialog(card_id);
		
		if (objects.mini_cards[card_id].type === 'table')
			this.show_table_dialog(card_id);
				
	},
	
	show_table_dialog : function (card_id) {
		
		if (objects.td_cont.ready === false || objects.td_cont.visible === true || objects.big_message_cont.visible === true ||objects.req_cont.visible === true)	{
			sound.play('locked');	
			return
		};

		sound.play('click');	
		
		anim2.add(objects.td_cont,{y:[-150,objects.td_cont.sy]}, true, 0.5,'easeOutBack');
		
		objects.td_avatar1.texture = objects.mini_cards[card_id].avatar1.texture;
		objects.td_avatar2.texture = objects.mini_cards[card_id].avatar2.texture;
		
		objects.td_rating1.text = objects.mini_cards[card_id].rating_text1.text;
		objects.td_rating2.text = objects.mini_cards[card_id].rating_text2.text;
		
		make_text(objects.td_name1, objects.mini_cards[card_id].name1, 150);
		make_text(objects.td_name2, objects.mini_cards[card_id].name2, 150);
		
	},
	
	close_table_dialog : function () {
		
		if (objects.td_cont.ready === false)
			return;
				
		sound.play('close_it');	
		
		anim2.add(objects.td_cont,{y:[objects.td_cont.sy,400,]}, false, 0.5,'easeInBack');
		
	},

	show_invite_dialog: function(cart_id) {


		if (objects.invite_cont.ready === false || objects.invite_cont.visible === true || 	objects.big_message_cont.visible === true ||objects.req_cont.visible === true)	{
			sound.play('locked');	
			return
		};


		pending_player="";

		sound.play('click');	

		//показыаем кнопку приглашения			
		anim2.add(objects.invite_cont,{y:[450, objects.invite_cont.sy]}, true, 0.6,'easeOutBack');

		//копируем предварительные данные
		cards_menu._opp_data = {uid:objects.mini_cards[cart_id].uid,name:objects.mini_cards[cart_id].name,rating:objects.mini_cards[cart_id].rating};


		let invite_available = 	cards_menu._opp_data.uid !== my_data.uid;
		invite_available=invite_available && (objects.mini_cards[cart_id].state==="o" || objects.mini_cards[cart_id].state==="b");
		invite_available=invite_available || cards_menu._opp_data.uid==="AI";

		//показыаем кнопку приглашения только если это допустимо
		if (invite_available === true) {
			objects.invite_button.visible = objects.invite_header6.visible = true;		
			objects.invite_header6.text = ['Пригласить','Ask to play'][LANG];
		} else {
			objects.invite_button.visible = objects.invite_header6.visible = false;
		}



		//заполняем карточу приглашения данными
		objects.invite_avatar.texture=objects.mini_cards[cart_id].avatar.texture;
		make_text(objects.invite_name,cards_menu._opp_data.name,230);
		objects.invite_rating.text=objects.mini_cards[cart_id].rating_text.text;

	},

	close: function() {

		objects.cards_cont.visible=false;
		objects.back_button_cont.visible=false;
		objects.desktop.alpha=1;

		objects.lobby_frame.visible=false;
		objects.header4.visible=false;

		if (objects.invite_cont.visible === true)
			this.hide_invite_dialog();
		
		if (objects.td_cont.visible === true)
			this.close_table_dialog();

		//больше ни ждем ответ ни от кого
		pending_player="";

		//убираем сколько игроков онлайн
		objects.players_online.visible=false;

		//подписываемся на изменения состояний пользователей
		firebase.database().ref(room_name).off();

	},

	hide_invite_dialog: function() {

		if (objects.invite_cont.ready === false)
			return;
		

		sound.play('close_it');	
				
		//отправляем сообщение что мы уже не заинтересованы в игре
		if (pending_player!=="") {
			firebase.database().ref("inbox/"+pending_player).set({sender:my_data.uid,message:"INV_REM",tm:Date.now()});
			pending_player="";
		}

		anim2.add(objects.invite_cont,{y:[objects.invite_cont.sy,400]}, false, 0.5,'easeInBack');
	},

	send_invite: function() {


		if (objects.invite_cont.ready === false || objects.invite_header6.text==='Ждем ответ...'||objects.big_message_cont.visible === true ||objects.req_cont.visible === true)	{
			sound.play('locked');	
			return
		}

		if (cards_menu._opp_data.uid==="AI")
		{
			cards_menu._opp_data.rating = 1400;
			
			make_text(objects.opp_card_name,cards_menu._opp_data.name,160);
			objects.opp_card_rating.text='1400';
			objects.opp_avatar.texture=objects.invite_avatar.texture;				
			
			this.close();
			game.activate('master', bot_player );
		}
		else
		{
			sound.play('click');	
			objects.invite_header6.text = ['Ждем ответ...','Await...'][LANG];
			firebase.database().ref("inbox/"+cards_menu._opp_data.uid).set({sender:my_data.uid,message:"INV",tm:Date.now()});
			pending_player=cards_menu._opp_data.uid;
		}



	},

	rejected_invite: function() {

		pending_player="";
		cards_menu._opp_data={};
		this.hide_invite_dialog();
		big_message.show(['Соперник отказался от игры','Opponent refused to play'][LANG],'(((');

	},

	accepted_invite: function() {

		//убираем запрос на игру если он открыт
		req_dialog.hide();
		
		//устанаваем окончательные данные оппонента
		opp_data=cards_menu._opp_data;
		
		//сразу карточку оппонента
		make_text(objects.opp_card_name,opp_data.name,160);
		objects.opp_card_rating.text=opp_data.rating;
		objects.opp_avatar.texture=objects.invite_avatar.texture;		

		cards_menu.close();
		game.activate("master" , online_player );
	},

	back_button_down: function() {

		if (objects.td_cont.visible === true || objects.big_message_cont.visible === true ||objects.req_cont.visible === true ||objects.invite_cont.visible === true)	{
			sound.play('locked');	
			return
		};


		sound.play('close_it');	

		this.close();
		main_menu.activate();

	}

}

auth2 = {
		
	load_script (src) {
	  return new Promise((resolve, reject) => {
		const script = document.createElement('script')
		script.type = 'text/javascript'
		script.onload = resolve
		script.onerror = reject
		script.src = src
		document.head.appendChild(script)
	  })
	},
			
	get_random_char () {		
		
		const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		return chars[irnd(0,chars.length-1)];
		
	},
	
	get_random_uid_for_local(prefix) {
		
		let uid = prefix;
		for ( let c = 0 ; c < 12 ; c++ )
			uid += this.get_random_char();
		
		//сохраняем этот uid в локальном хранилище
		try {
			localStorage.setItem('poker_uid', uid);
		} catch (e) {alert(e)}
					
		return uid;
		
	},
	
	get_random_name(uid) {
		
		const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		const rnd_names = ['Gamma','Chime','Dron','Perl','Onyx','Asti','Wolf','Roll','Lime','Cosy','Hot','Kent','Pony','Baker','Super','ZigZag','Magik','Alpha','Beta','Foxy','Fazer','King','Kid','Rock'];
		
		if (uid !== undefined) {
			
			let e_num1 = chars.indexOf(uid[3]) + chars.indexOf(uid[4]) + chars.indexOf(uid[5]) + chars.indexOf(uid[6]);
			e_num1 = Math.abs(e_num1) % (rnd_names.length - 1);				
			let name_postfix = chars.indexOf(uid[7]).toString() + chars.indexOf(uid[8]).toString() + chars.indexOf(uid[9]).toString() ;	
			return rnd_names[e_num1] + name_postfix.substring(0, 3);					
			
		} else {

			let rnd_num = irnd(0, rnd_names.length - 1);
			let rand_uid = irnd(0, 999999)+ 100;
			let name_postfix = rand_uid.toString().substring(0, 3);
			let name =	rnd_names[rnd_num] + name_postfix;				
			return name;
		}	
	},	
	
	async get_country_code() {
		
		let country_code = ''
		try {
			let resp1 = await fetch("https://ipinfo.io/json");
			let resp2 = await resp1.json();			
			country_code = resp2.country;			
		} catch(e){}

		return country_code;
		
	},
	
	search_in_local_storage () {
		
		//ищем в локальном хранилище
		let local_uid = null;
		
		try {
			local_uid = localStorage.getItem('poker_uid');
		} catch (e) {alert(e)}
				
		if (local_uid !== null) return local_uid;
		
		return undefined;	
		
	},
	
	async search_in_crazygames(){
		
		const is_user_data = await window.CrazyGames.SDK.user.isUserAccountAvailable();
		if (is_user_data===false) return {};
		const user = await window.CrazyGames.SDK.user.getUser();
		return user || {};
	},
	
	async init() {	
				
		if (game_platform === 'YANDEX') {			
		
			try {await this.load_script('https://yandex.ru/games/sdk/v2')} catch (e) {alert(e)};										
					
			let _player;
			
			try {
				window.ysdk = await YaGames.init({});			
				_player = await window.ysdk.getPlayer();
			} catch (e) { alert(e)};
			
			my_data.uid = _player.getUniqueID().replace(/[\/+=]/g, '');
			my_data.name = _player.getName();
			my_data.pic_url = _player.getPhoto('medium');
			
			if (my_data.pic_url === 'https://games-sdk.yandex.ru/games/api/sdk/v1/player/avatar/0/islands-retina-medium')
				my_data.pic_url = 'https://avatars.dicebear.com/api/adventurer/' + my_data.uid + '.svg';
			
			if (my_data.name === '')
				my_data.name = this.get_random_name(my_data.uid);
			
			//если английский яндекс до добавляем к имени страну
			let country_code = await this.get_country_code();
			my_data.name = my_data.name + ' (' + country_code + ')';			


			
			return;
		}
		
		if (game_platform === 'VK') {
			
			try {await this.load_script('https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js')} catch (e) {alert(e)};
			
			let _player;
			
			try {
				await vkBridge.send('VKWebAppInit');
				_player = await vkBridge.send('VKWebAppGetUserInfo');				
			} catch (e) {alert(e)};

			
			my_data.name 	= _player.first_name + ' ' + _player.last_name;
			my_data.uid 	= "vk"+_player.id;
			my_data.pic_url = _player.photo_100;
			
			return;
			
		}
		
		if (game_platform === 'GOOGLE_PLAY') {	

			let country_code = await this.get_country_code();
			my_data.uid = this.search_in_local_storage() || this.get_random_uid_for_local('GP_');
			my_data.name = this.get_random_name(my_data.uid) + ' (' + country_code + ')';
			my_data.pic_url = 'https://avatars.dicebear.com/api/adventurer/' + my_data.uid + '.svg';	
			return;
		}
		
		if (game_platform === 'DEBUG') {		

			my_data.name = my_data.uid = 'debug' + prompt('Отладка. Введите ID', 100);
			my_data.pic_url = 'https://avatars.dicebear.com/api/adventurer/' + my_data.uid + '.svg';		
			return;
		}
		
		if (game_platform === 'CRAZYGAMES') {
			
			try {await this.load_script('https://sdk.crazygames.com/crazygames-sdk-v2.js')} catch (e) {alert(e)};	
			
			let country_code = await this.get_country_code();
			const cg_user_data=await this.search_in_crazygames();
			
			my_data.uid = cg_user_data.id || this.search_in_local_storage() || this.get_random_uid_for_local('CG_');
			my_data.name = cg_user_data.username || this.get_random_name(my_data.uid) + ' (' + country_code + ')';
			my_data.pic_url = cg_user_data.profilePictureUrl || ('https://avatars.dicebear.com/api/adventurer/' + my_data.uid + '.svg');	
		
			return;
		}
		
		if (game_platform === 'VSEIGRU') {	

			let country_code = await this.get_country_code();
			my_data.uid = this.search_in_local_storage() || this.get_random_uid_for_local('VI_');
			my_data.name = this.get_random_name(my_data.uid) + ' (' + country_code + ')';
			my_data.pic_url = 'https://avatars.dicebear.com/api/adventurer/' + my_data.uid + '.svg';	
			return;
		}
		
		if (game_platform === 'UNKNOWN') {
			
			//если не нашли платформу
			alert('Неизвестная платформа. Кто Вы?')
			my_data.uid = this.search_in_local_storage() || this.get_random_uid_for_local('LS_');
			my_data.name = this.get_random_name(my_data.uid);
			my_data.pic_url = 'https://avatars.dicebear.com/api/adventurer/' + my_data.uid + '.svg';	
		}
	}
	
}

function resize() {
    const vpw = window.innerWidth;  // Width of the viewport
    const vph = window.innerHeight; // Height of the viewport
    let nvw; // New game width
    let nvh; // New game height

    if (vph / vpw < M_HEIGHT / M_WIDTH) {
      nvh = vph;
      nvw = (nvh * M_WIDTH) / M_HEIGHT;
    } else {
      nvw = vpw;
      nvh = (nvw * M_HEIGHT) / M_WIDTH;
    }
    app.renderer.resize(nvw, nvh);
    app.stage.scale.set(nvw / M_WIDTH, nvh / M_HEIGHT);
}

async function check_daily_reward (last_seen_ts) {
	
	
	//вычисляем номер дня последнего посещения
	let last_seen_day = new Date(last_seen_ts).getDate();		
	
	//считываем текущее время
	await firebase.database().ref("server_time").set(firebase.database.ServerValue.TIMESTAMP);

	//определяем текущий день
	let _cur_ts = await firebase.database().ref("server_time").once('value');
	let cur_ts = _cur_ts.val();
	let cur_day = new Date(cur_ts).getDate();
	
	//обновляем время последнего посещения
	firebase.database().ref(players_node+'/'+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);

	if (cur_day !== last_seen_day) {		
		my_data.money++;
		firebase.database().ref(players_node+'/'+my_data.uid + "/money").set(my_data.money);		
		console.log("Награда за новый день!")
		
		await anim2.add(objects.daily_reward,{y:[450, objects.daily_reward.sy]}, true, 1,'easeOutBack');
		anim2.add(objects.daily_reward,{y:[objects.daily_reward.sy, 450]}, false, 1,'easeInBack');
		
	}

}

async function load_user_data() {
	
	try {
	
		//показываем окно авторизации
		anim2.add(objects.id_cont,{y:[-300,objects.id_cont.sy]}, true, 1.5,'easeOutBack');
		
		//анимация лупы
		some_process.loup_anim=function() {
			objects.id_loup.x=20*Math.sin(game_tick*8)+90;
			objects.id_loup.y=20*Math.cos(game_tick*8)+150;
		}
	
		//получаем данные об игроке из социальных сетей
		await auth2.init();
			
		//устанавлием имя на карточки
		make_text(objects.id_name,my_data.name,150);
		make_text(objects.my_card_name,my_data.name,150);
			
		//ждем пока загрузится аватар
		let loader=new PIXI.Loader();
		loader.add("my_avatar", my_data.pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 5000});			
		await new Promise((resolve, reject)=> loader.load(resolve))
		

		objects.id_avatar.texture=objects.my_avatar.texture=loader.resources.my_avatar.texture;
		
			
		
		//две комнаты для английского  и русского языков
		if (LANG===0){
			await auth2.load_script(git_src+'/rus_dict.js');
			room_name = 'states';		
			players_node='players';
		} else {
			await auth2.load_script(git_src+'/eng_dict.js');
			room_name = 'states2';
			players_node='players_eng';
		}	

		room_name = 'states';			
		
		
		//получаем остальные данные об игроке
		let snapshot = await firebase.database().ref(players_node+'/'+my_data.uid).once('value');
		let data = snapshot.val();
		
		
		
		//делаем защиту от неопределенности
		my_data.rating = (data && data.rating) || 1400;
		my_data.games = (data && data.games) || 0;
		my_data.skin = (data && data.skin) || 'peng';
		my_data.money = (data && data.money)  || 0;		
		my_data.wall = 0;		


		//определяем последнее время посещения
		let last_seen_ts = (data && data.tm) || 1000;
				
		check_daily_reward(last_seen_ts);
		
			
		//отключение от игры и удаление не нужного
		firebase.database().ref("inbox/"+my_data.uid).onDisconnect().remove();
		firebase.database().ref(room_name + "/"+my_data.uid).onDisconnect().remove();			
			
		//устанавливаем рейтинг в попап
		objects.id_rating.text=objects.my_card_rating.text = my_data.rating;

		//обновляем почтовый ящик
		firebase.database().ref("inbox/"+my_data.uid).set({sender:"-",message:"-",tm:"-",data:{x1:0,y1:0,x2:0,y2:0,board_state:0}});

		//подписываемся на новые сообщения
		firebase.database().ref("inbox/"+my_data.uid).on('value', (snapshot) => { process_new_message(snapshot.val());});

		//обновляем данные в файербейс так как могли поменяться имя или фото
		firebase.database().ref(players_node+'/'+my_data.uid + "/pic_url").set(my_data.pic_url);
		firebase.database().ref(players_node+'/'+my_data.uid + "/name").set(my_data.name);
		firebase.database().ref(players_node+'/'+my_data.uid + "/wall").set(my_data.wall);
		firebase.database().ref(players_node+'/'+my_data.uid + "/skin").set(my_data.skin);

		//устанавливаем мой статус в онлайн
		set_state({state : 'o'});
			
		//ждем и убираем попап
		await new Promise((resolve, reject) => setTimeout(resolve, 1000));
		
		anim2.add(objects.id_cont,{y:[objects.id_cont.y, -200]}, false, 1,'easeInBack');
		
		some_process.loup_anim=function() {};
		
	
	} catch (error) {		
		alert (error);		
	}
	
}

function set_state(params) {

	if (params.state!==undefined)
		state=params.state;

	if (params.hidden!==undefined)
		h_state=+params.hidden;

	let small_opp_id="";
	if (opp_data.uid!==undefined)
		small_opp_id=opp_data.uid.substring(0,10);

	firebase.database().ref(room_name + "/"+my_data.uid).set({state:state, name:my_data.name, rating : my_data.rating, hidden:h_state, opp_id : small_opp_id});

}

function vis_change() {

	if (document.hidden === true ) {
		
		hidden_state_start = Date.now();
		
		if (state === 'p' && game.my_sink === 0 && game.opp_sink === 0) {
			game.stop('my_hidden')			
			firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"opp_hidden",tm:Date.now()});
		}
	}
	
	set_state({hidden : document.hidden});
		
}

language_dialog = {
	
	p_resolve : {},
	
	show : function() {
				
		return new Promise(function(resolve, reject){


			document.body.innerHTML='<style>		html,		body {		margin: 0;		padding: 0;		height: 100%;	}		body {		display: flex;		align-items: center;		justify-content: center;		background-color: rgba(24,24,64,1);		flex-direction: column	}		.two_buttons_area {	  width: 70%;	  height: 50%;	  margin: 20px 20px 0px 20px;	  display: flex;	  flex-direction: row;	}		.button {		margin: 5px 5px 5px 5px;		width: 50%;		height: 100%;		color:white;		display: block;		background-color: rgba(44,55,100,1);		font-size: 10vw;		padding: 0px;	}  	#m_progress {	  background: rgba(11,255,255,0.1);	  justify-content: flex-start;	  border-radius: 100px;	  align-items: center;	  position: relative;	  padding: 0 5px;	  display: none;	  height: 50px;	  width: 70%;	}	#m_bar {	  box-shadow: 0 10px 40px -10px #fff;	  border-radius: 100px;	  background: #fff;	  height: 70%;	  width: 0%;	}	</style><div id ="two_buttons" class="two_buttons_area">	<button class="button" id ="but_ref1" onclick="language_dialog.p_resolve(0)">RUS</button>	<button class="button" id ="but_ref2"  onclick="language_dialog.p_resolve(1)">ENG</button></div><div id="m_progress">  <div id="m_bar"></div></div>';
			
			language_dialog.p_resolve = resolve;	
						
		})
		
	}
	
}

async function define_platform_and_language() {
	
	let s = window.location.href;
	
	if (s.includes('yandex')) {
		
		game_platform = 'YANDEX';
		
		if (s.match(/yandex\.ru|yandex\.by|yandex\.kg|yandex\.kz|yandex\.tj|yandex\.ua|yandex\.uz/))
			LANG = 0;
		else 
			LANG = 1;		
		return;
	}
	
	if (s.includes('vk.com')) {
		game_platform = 'VK';	
		LANG = 0;	
		return;
	}
	
	if (s.includes('google_play')) {
			
		game_platform = 'GOOGLE_PLAY';	
		LANG = await language_dialog.show();
		return;
	}	
	
	if (s.includes('crazygames')) {
			
		game_platform = 'CRAZYGAMES';	
		LANG = 1;
		return;
	}
	
	if (s.includes('vseigru')) {
			
		game_platform = 'VSEIGRU';	
		LANG = 0;
		return;
	}	
	
	if (s.includes('192.168')) {
			
		game_platform = 'DEBUG';	
		LANG = await language_dialog.show();
		return;	
	}	
	
	game_platform = 'UNKNOWN';	
	LANG = await language_dialog.show();
	
	

}

async function init_game_env() {
	
	await define_platform_and_language();
	console.log(game_platform, LANG);
	
	//ждем когда загрузятся ресурсы
	await load_resources();


	//короткое обращение к ресурсам
	gres=game_res.resources;

	//инициируем файербейс
	if (firebase.apps.length===0) {
		firebase.initializeApp({
			apiKey: "AIzaSyCDV8ndfTwbMq1jAv2VGxrWHLZ0mtvZJmQ",
			authDomain: "word-battle-7c6b5.firebaseapp.com",
			databaseURL: "https://word-battle-7c6b5-default-rtdb.europe-west1.firebasedatabase.app",
			projectId: "word-battle-7c6b5",
			storageBucket: "word-battle-7c6b5.appspot.com",
			messagingSenderId: "851590264454",
			appId: "1:851590264454:web:e7185c5fa1fa1b32b68307"
		});
	}

	
	app.stage = new PIXI.Container();
	app.renderer = new PIXI.Renderer({width:M_WIDTH, height:M_HEIGHT,antialias:true});
	document.body.appendChild(app.renderer.view).style["boxShadow"] = "0 0 15px #000000";
	document.body.style.backgroundColor = 'rgb(1,211,200)';
	
	
	resize();
	window.addEventListener("resize", resize);

    //создаем спрайты и массивы спрайтов и запускаем первую часть кода
    for (var i = 0; i < load_list.length; i++) {
        const obj_class = load_list[i].class;
        const obj_name = load_list[i].name;
		console.log('Processing: ' + obj_name)

        switch (obj_class) {
        case "sprite":
            objects[obj_name] = new PIXI.Sprite(gres[obj_name].texture);
            eval(load_list[i].code0);
            break;

        case "block":
            eval(load_list[i].code0);
            break;

        case "cont":
            eval(load_list[i].code0);
            break;

        case "array":
			var a_size=load_list[i].size;
			objects[obj_name]=[];
			for (var n=0;n<a_size;n++)
				eval(load_list[i].code0);
            break;
        }
    }

    //обрабатываем вторую часть кода в объектах
    for (var i = 0; i < load_list.length; i++) {
        const obj_class = load_list[i].class;
        const obj_name = load_list[i].name;
		console.log('Processing: ' + obj_name)
		
		
        switch (obj_class) {
        case "sprite":
            eval(load_list[i].code1);
            break;

        case "block":
            eval(load_list[i].code1);
            break;

        case "cont":	
			eval(load_list[i].code1);
            break;

        case "array":
			var a_size=load_list[i].size;
				for (var n=0;n<a_size;n++)
					eval(load_list[i].code1);	;
            break;
        }
    }
	
	
	//загружаем данные об игроке
	load_user_data();
			
	//это событие когда меняется видимость приложения
	document.addEventListener("visibilitychange", vis_change);
			
	//keep-alive сервис
	setInterval(function()	{keep_alive()}, 40000);
			
	//показыаем основное меню
	main_menu.activate();
		
	console.clear()
	
	//запускаем главный цикл
	main_loop();

}

async function load_resources() {
	
	//отображаем шкалу загрузки
	document.body.innerHTML='<style>html,body {margin: 0;padding: 0;height: 100%;	}body {display: flex;align-items: center;justify-content: center;background-color: rgba(41,41,41,1);flex-direction: column	}#m_progress {	  background: #1a1a1a;	  justify-content: flex-start;	  border-radius: 5px;	  align-items: center;	  position: relative;	  padding: 0 5px;	  display: none;	  height: 50px;	  width: 70%;	}	#m_bar {	  box-shadow: 0 1px 0 rgba(255, 255, 255, .5) inset;	  border-radius: 5px;	  background: rgb(119, 119, 119);	  height: 70%;	  width: 0%;	}	</style></div><div id="m_progress">  <div id="m_bar"></div></div>';
	document.getElementById("m_progress").style.display = 'flex'
		
	git_src='https://akukamil.github.io/snow_words'
	//git_src=''

	//подпапка с ресурсами
	let lang_pack = ['RUS','ENG'][LANG];
	
	game_res=new PIXI.Loader();
	game_res.add('m2_font', git_src+'/fonts/Neucha/font.fnt');


	game_res.add('click',git_src+'/sounds/click.mp3');
	game_res.add('locked',git_src+'/sounds/locked.mp3');
	game_res.add('clock',git_src+'/sounds/clock.mp3');
	game_res.add('close_it',git_src+'/sounds/close_it.mp3');
	game_res.add('game_start',git_src+'/sounds/game_start.mp3');
	game_res.add('lose',git_src+'/sounds/lose.mp3');
	game_res.add('message',git_src+'/sounds/message.mp3');
	game_res.add('bad_move',git_src+'/sounds/bad_move.mp3');
	game_res.add('win',git_src+'/sounds/win.mp3');
	game_res.add('invite',git_src+'/sounds/invite.mp3');
	game_res.add('draw',git_src+'/sounds/draw.mp3');
	game_res.add('throw',git_src+'/sounds/throw.mp3');
	game_res.add('snowball_hit',git_src+'/sounds/snowball_hit.mp3');
	game_res.add('hero_death',git_src+'/sounds/hero_death.mp3');
	game_res.add('letter_click',git_src+'/sounds/letter_click.mp3');
	game_res.add('letter_erase',git_src+'/sounds/letter_erase.mp3');
	game_res.add('falling',git_src+'/sounds/falling.mp3');
	game_res.add('hero_sink',git_src+'/sounds/sink.mp3')
	game_res.add('wall_hit',git_src+'/sounds/wall_hit.mp3')
	game_res.add('wall_break',git_src+'/sounds/wall_break.mp3')
	
    //добавляем из листа загрузки
    for (var i = 0; i < load_list.length; i++)
        if (load_list[i].class === 'sprite' || load_list[i].class === 'image' )
            game_res.add(load_list[i].name, git_src+'/res/'+lang_pack+'/'+load_list[i].name + '.' +  load_list[i].image_format);		

	game_res.onProgress.add(progress);
	function progress(loader, resource) {
		document.getElementById('m_bar').style.width =  Math.round(loader.progress)+'%';
	}
	
	
	await new Promise((resolve, reject)=> game_res.load(resolve))
	
	
	//убираем элементы загрузки
	document.getElementById("m_progress").outerHTML = '';	
}

function main_loop() {


	game_tick+=0.016666666;
	anim2.process();
	wait_timer.process();
	
	//обрабатываем минипроцессы
	for (let key in some_process)
		some_process[key]();

	app.renderer.render(app.stage);	
	requestAnimationFrame(main_loop);
}

