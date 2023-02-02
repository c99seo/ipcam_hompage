var output = {};
var wificheck = false;
var pageName = "";
var newIp = "";

window.addEventListener('load', () => {
	pageName = document.getElementsByName("pageName")[0].value;
	output = document.getElementById("note");

	once(pageName);

	// 버튼 이벤트
	if (pageName == "infor" || pageName == "content1") {
		document.querySelector('#restart').addEventListener('click', () => {
			if (confirm('재실행합니다.')) re('restart');
		});

		document.querySelector('#s_db_reset').addEventListener('click', () => {
			if (confirm('라우터를 초기화 합니다.')) re('s_db_reset');
		});

		document.querySelector('#idButton').addEventListener('click', () => {
			window.location.reload();
		});
		
		document.querySelector('#check').addEventListener('click', () => {
			fetch("/mag/checkBuzz");
		});
		
	}
	else if (pageName == "content3") {
		document.querySelector('#wifiSaveBt').addEventListener('click', () => {
			let doc = document.network;
			if (doc.Rssid.value == "" || doc.Rpwd.value == "") {
				alert("인터넷 설정 정보를 입력해 주세요.");
				return false;
			}

			if (confirm('인터넷 설정을 저장하고 WIFI를 재접속 합니다.')) {
				newIp = document.getElementById("Rip").value;
				var formData = new FormData(document.getElementById("network"));
				formData.append("wifiApMode", 0);
				
				if(window.location.hostname != "192.168.4.1" && document.getElementById("dhcp1").checked == true){
					formData.set("wifiApMode", 1);
				}
				fetch('/mag/set/wifi', { method: 'POST', body: formData })
				.then((response) => {
					var message1 = '인터넷 WIFI 재설정 중입니다. ';
					var message2 = '초 후에 다시로드됩니다.<br>접속 오류 발생시 와이파이 연결 상태를 확인해 주세요.';

					setLoadTimer(15, message1, message2, wifiStatusCheck);
				})
				.catch((error) => { alert('네트워크 오류 발생하였습니다.!'); });
			}
		});

	}
	else if (pageName == "content5") {
		document.querySelector('#firmwareCheck').addEventListener('click', () => {
			if(!wificheck){
				alert("인터넷 WIFI 설정 후 진행해주세요.");
				return false;
			}

			if (confirm('펨웨어 소프트웨어 버젼 확인 및 업데이트를 진행합니다.!')) re('firmwareCheck');
		});
	}
	else if (pageName == "content9") {
		document.querySelector('#userSearchBt').addEventListener('click', () => {
			if(!wificheck){
				alert("인터넷 WIFI 설정 후 진행해주세요.");
				return false;
			}
			
			let doc = document.Userinfo;
			if(removeSpacesCheck(doc.userNo.value)==""){
			alert("고객번호를 입력해 주세요.");
			doc.userNo.focus();
			return false;
			}
				
				
			let formData = new FormData(document.getElementById("Userinfo"));
			fetch('/mag/search/user', { method: 'POST', body: formData })
				.then(response => response.json())
				.then(data => {
					var obj = data.data;
					if (data.code == 200) {
						if(obj != null){
							if (obj['infoOthbcAt'] == "1") {
							document.getElementById("userdisplay2").checked = true;
							} else {
								document.getElementById("userdisplay1").checked = true;
							}

							document.getElementById("user").value = obj['cstmrNm'];
							document.getElementById("tel").value = obj['telno'];
							document.getElementById("area").value = obj['lclasArea'];
							document.getElementById("memo").value = obj['rm'];
						}
						else{
							document.getElementById("userdisplay1").checked = true;
							document.getElementById("user").value = "";
							document.getElementById("tel").value = "";
							document.getElementById("area").value = "";
							document.getElementById("memo").value = "";
						}
						

					}
					else {
						alert("오류발생!\n" + data.data);
					}
				});
		});

		document.querySelector('#userSaveBt').addEventListener('click', () => {
			if(!wificheck){
				alert("인터넷 WIFI 설정 후 진행해주세요.");
				return false;
			}
			
			let doc = document.Userinfo;
			if(removeSpacesCheck(doc.user.value)==""){
			alert("고객명 입력해 주세요.");
			doc.user.focus();
			return false;
			}
			if(removeSpacesCheck(doc.tel.value)==""){
			alert("전화번호를 입력해 주세요.");
			doc.tel.focus();
			return false;
			}
			if (confirm('고객 정보를 저장합니다.!')) {
				let formData = new FormData(document.getElementById("Userinfo"));
				
				fetch('/mag/set/user', { method: 'POST', body: formData })
					.then(response => response.json())
					.then(data => {
						var obj = data.data;
						if (data.code == 200) {
							if (obj['infoOthbcAt'] == "1") {
								document.getElementById("userdisplay2").checked = true;
							} else /*if(obj['DIP'] ="1")*/ {
								document.getElementById("userdisplay1").checked = true;
							}
							document.getElementById('userNo').value = obj['cstmrNo'];
							document.getElementById("user").value = obj['cstmrNm'];
							document.getElementById("tel").value = obj['telno'];
							document.getElementById("area").value = obj['lclasArea'];
							document.getElementById("memo").value = obj['rm'];
							alert('고객 정보가 저장 되었습니다.!');
						}
						else {
							alert("오류발생!\n" + data.data);
						}
					});

			}
		});

	}
	else if (pageName == "content11") {
		document.querySelector('#serverSaveBt').addEventListener('click', () => {
			var url = document.getElementById("url").value;
			var port = document.getElementById("port").value;
			var urlSub = document.getElementById('urlSub').value;

			if(isNaN(Number(port))){
				alert("목적지 포트는 숫자만 입력 가능 합니다");
				return false;
			}
			
			
			if (confirm('API 서버 정보를 저장합니다.!\n서버정보:' + url + ":" + port + (urlSub == "" ? "" : "/" + urlSub))) {
				let formData = new FormData(document.getElementById("ServerInfo"));
				fetch('/mag/set/server', { method: 'POST', body: formData })
					.then((response) => { alert('서버 정보가 저장 되었습니다.!') });
			}

		});
		
		document.querySelector('#cycleSaveBt').addEventListener('click', () => {
			
			var _cycle = removeSpacesCheck(document.querySelector("#cycle").value);
/*
			if(_cycle==""||isNaN(Number(_cycle))||Number(_cycle)<300){
				alert("300 이상의 숫자만 입력 가능 합니다");
				return false;
			}
*/
			if (confirm('API 서버 전송 정보를 재 설정합니다.')) {
				var formData = new FormData();
				var checked = document.querySelector("#trnsmisAt").checked;
				if(checked){
					formData.append("trnsmisAt","1");
				}
				else{
					formData.append("trnsmisAt","0");
				}
				formData.append("cycle",document.querySelector("#cycle").value);

				fetch('/mag/set/deviceApi', { method: 'POST', body: formData })
				.then((response) => { alert('API 서버 전송 정보가 재 설정 되었습니다.!') });
			}
		});
		
		
	}
	else if (pageName == "content12") {
		document.querySelector('#deviceSaveBt').addEventListener('click', () => {
			if(!wificheck){
				alert("인터넷 WIFI 설정 후 진행해주세요.");
				return false;
			}
			
			let doc = document.deviceInfo;
			if (doc.customerNo.value == "") {
				alert("고객정보를 등록해 주세요.");
				return false;
			}

			fetch('/mag/set/device', { method: 'POST' })
				.then(response => response.json())
				.then(data => {
					var obj = data.data;
					if (data.code == 200) {
						document.querySelector('#duserid').innerHTML = obj['eqpmnId'];
						document.getElementById("deviceSaveBt").style.display ='none'
						alert('저장 되었습니다.!');
					}
					else {
						alert("오류발생!\n" + data.data);
					}
				});
		});

	}

	async function once(arg1) {
		try {

			let resp = await fetch('/mag/once', { method: 'POST', body: undefined });
			let obj = await resp.json();

			document.querySelector('form').reset();

			// 요약정보
			if (arg1 == "infor" || arg1 == "content1") {
				wifiStatusCheck(false, false);
				// 연결 정보
				document.querySelector('#ssid').innerHTML = obj['SSID'];
				document.querySelector('#local').innerHTML = obj['LocalIP'];
				document.querySelector('#subnet').innerHTML = obj['SubnetMask'];
				document.querySelector('#gateway').innerHTML = obj['GatewayIP'];
				document.querySelector('#dns').innerHTML = obj['DnsIP'];
				document.querySelector('#mac').innerHTML = obj['MacAddress'];

				// 서버 정보
				document.querySelector('#vurl').innerHTML = obj['URL'] + ":" + obj['PORT'] + (obj['URLSUB'] == 0 ? "" : "/" + obj['URLSUB']);
				document.querySelector('#vcycle').innerHTML = obj['RUTCYCLE'];

				// 고객 정보
				document.querySelector('#vuserid').innerHTML = obj['RUTID'];
				document.querySelector('#vuserno').innerHTML = obj['RUTUSERNO'];
				document.querySelector('#vuser').innerHTML = obj['RUTUSER'];
				document.querySelector('#vtel').innerHTML = obj['RUTTEL'];
				document.querySelector('#varea').innerHTML = obj['RUTAREA'];
				document.querySelector('#vmemo').innerHTML = obj['RUTMEMO'];

			}
			// 인터넷 설정
			else if (arg1 == "content3") {
				wifiStatusCheck(false, false);
				document.getElementById("Rssid").value = obj['SSID'];
				document.getElementById("Rpwd").value = obj['PWD'];

				if (obj['DHCP'] == "1") {
					document.getElementById("dhcp1").checked = true;
					displayReadOnly(true);
				} else {
					document.getElementById("dhcp0").checked = true;
					displayReadOnly(false);
				}

				document.getElementById("Rip").value = obj['LocalIP'];
				document.getElementById("Rsubmk").value = obj['SubnetMask'];
				document.getElementById("Rgw").value = obj['GatewayIP'];
				document.getElementById("Rdns").value = obj['DnsIP'];
			}
			// 펌웨어 설정
			else if (arg1 == "content5") {
				wifiStatusCheck(false, false);

				document.querySelector('#rver').innerHTML = obj['RVER'];
				document.querySelector('#build').innerHTML = obj['Build'];
			}
			// 펌웨어 설정
			else if (arg1 == "content7") {
				document.getElementById("Dssid").value = obj['SSID'];
				document.getElementById("Dpwd").value = obj['PWD'];
			}
			// 고객 정보
			else if (arg1 == "content9") {
				wifiStatusCheck(false, false);

				if (obj['RUTDIP'] == "1") {
					document.getElementById("userdisplay2").checked = true;
					//					document.getElementById("userview").style.display ='block';
				} else /*if(obj['DIP'] ="1")*/ {
					document.getElementById("userdisplay1").checked = true;
					//					document.getElementById("userview").style.display ='none';
				}
				document.getElementById('userNo').value = obj['RUTUSERNO'];
				document.getElementById("user").value = obj['RUTUSER'];
				document.getElementById("tel").value = obj['RUTTEL'];
				document.getElementById("area").value = obj['RUTAREA'];
				document.getElementById("memo").value = obj['RUTMEMO'];
			}
			// API 서버 정보 설정
			else if (arg1 == "content11") {
				wifiStatusCheck(false, false);

				document.getElementById("url").value = obj['URL'];
				document.getElementById("port").value = obj['PORT'];
				document.getElementById('urlSub').value = obj['URLSUB'];
				document.getElementById('cycle').value = obj['RUTCYCLE'];
				
				if (obj['RUTTRNSMISAT'] == "1") {
					document.getElementById("trnsmisAt").checked = true;
				} else {
					document.getElementById("trnsmisAt").checked = false;
				}
			}
			// API 장비 정보 전송
			else if (arg1 == "content12") {
				wifiStatusCheck(false, false);

				// 장비정보
				document.querySelector('#duserid').innerHTML = obj['RUTID'];

				// 고객정보
				document.querySelector('#customerNo').value = obj['RUTUSERNO'];
				document.querySelector('#res_no').innerHTML = obj['RUTUSERNO'];
				document.querySelector('#res_user').innerHTML = obj['RUTUSER'];
				document.querySelector('#res_tel').innerHTML = obj['RUTTEL'];
				document.querySelector('#res_area').innerHTML = obj['RUTAREA'];
				document.querySelector('#res_rm').innerHTML = obj['RUTMEMO'];

				// WIFI 정보
				document.querySelector('#res_Rip').innerHTML = obj['LocalIP'];
				document.querySelector('#res_Rsubmk').innerHTML = obj['SubnetMask'];
				document.querySelector('#res_Rgw').innerHTML = obj['GatewayIP'];
				document.querySelector('#res_Rdns').innerHTML = obj['DnsIP'];
				document.querySelector('#res_Rmac').innerHTML = obj['MacAddress'];

				// API 서버 정보
				document.querySelector('#res_vurl').innerHTML = obj['URL'] + ":" + obj['PORT'] + (obj['URLSUB'] == 0 ? "" : "/" + obj['URLSUB']);
				document.querySelector('#res_vcycle').innerHTML = obj['RUTCYCLE'];
				
				if(obj['RUTID'] != ""){
					document.getElementById("deviceSaveBt").style.display ='none'
				}
				
			}
		}catch (err) {
			console.log("오류 발생");
		}
}
});


// json파일읽어오는 fetch 
function fetchData(url) { // 반환값을 받을 Promise 객체 생성 
	return new Promise(function(receive) {
		fetch(url) // json 파일 읽어오기 
		.then(function(response) {
			return response.json(); // 읽어온 데이터를 json으로 변환 
		})
		.then(function(data) {
			receive(JSON.stringify(data)); // json파일을 텍스트로 
		});
	});
}

function re(arg) {
	output.innerHTML = "";
	output.classList.add('note');
	if (arg == undefined) {
		output.innerHTML = '오류가 발생했습니다.\n관리자에게 문의 하세요.';
		return;
	}
	else {
		if (arg == "restart" || arg == "s_db_reset") {
			fetch("/mag/" + arg);
			re_allback(arg);
		}
		else {
			fetch("/mag/" + arg)
				.then((response) => response.json())
				.then((data) => re_allback(arg, data));
		}
	}
}

function re_allback(arg, data) {
	console.log("============== re_allback ==============");
	console.log(data);
	if (arg != undefined) {
		var timeleft = 15;
		var message1 = "";
		var message2 = "";

		if (arg == 'restart') {
			message1 = '서버가 다시 시작됩니다.<br>데이터는 ';
			message2 = '초 후에 다시로드됩니다.<br>접속 오류 발생시 와이파이 연결 상태를 확인해 주세요.';
		} else if (arg == 's_db_reset') {
			message1 = '라우터가 초기화 되었습니다.<br>데이터는 ';
			message2 = '초 후에 다시로드됩니다.<br>접속 오류 발생시 192.168.4.1로 다시 접속해 주세요.';
		} else if (arg == 'firmwareCheck') {
			timeleft = 30;
			message1 = '펌웨어 업데이트 중입니다.<br>';
			message2 = '초 후에 다시 로드됩니다.';
		}

		setLoadTimer(timeleft, message1, message2);
		/*			var loadTimer = setInterval(function(){
		if(timeleft <= 0){
		clearInterval(loadTimer);
		location.reload();
		}
		output.innerHTML = message1+timeleft+message2;
		timeleft --;
		}, 1000);
		*/
	}
	else {
		output.innerHTML = '연결 오류가 발생했습니다. 다시 연결을 시도했습니다.';
	}
}



function displayView(radiobutton) {
	if (radiobutton.name == "dhcp") {
		if (radiobutton.value == "1") {
			//document.getElementById("displayInfo").style.display ="none";
			displayReadOnly(true);
		}
		else {
			//document.getElementById("displayInfo").style.display ="";
			displayReadOnly(false);
		}
	}
}

// 인터넷 설정 읽기 전용 설정
function displayReadOnly(v) {
	document.getElementById("Rip").readOnly = v;
	document.getElementById("Rsubmk").readOnly = v;
	document.getElementById("Rgw").readOnly = v;
	document.getElementById("Rdns").readOnly = v;
}

// 설정 완료 카운트
function setLoadTimer(timeleft, message1, message2, callback) {
	var loadTimer = setInterval(function() {
		if (timeleft <= 0) {
			clearInterval(loadTimer);
			if (callback != undefined && callback != null && callback != "")
				callback();
			else
				location.reload();
		}
		output.innerHTML = message1 + timeleft + message2;
		timeleft--;
	}, 1000);
}

// 라우터 인터넷 접속 상태 확인
function wifiStatusCheck(sMessage, saveCheck) {
	param = {};
	param.method = 'POST';

	if(sMessage == undefined || sMessage == true){
		var formData = new FormData();
		formData.append('save', "ok");
		param.body = formData;
		
		if(window.location.hostname == "192.168.4.1"){
			fetch("/mag/wifiStatus", param)
			.then(response => response.json())
			.then(data => {
				if (data.data == "OK") {
					wificheck = true;
					alert("인터넷 WIFI 재설정이 완료 되었습니다.");
					location.reload();
				
				}
				else {
					wificheck = false;
					output.innerHTML = "";
					alert("인터넷 WIFI 재설정이 오류발생!\n" + data.data);
				}
			});
		}
		else{
			if(document.getElementById("dhcp1").checked == true){
				setTimeout(function() {
				  output.innerHTML = "장비 AP 접속 후 192.168.4.1 재 접속 바랍니다.";
				}, 1000);

				alert("장비 AP 접속 후 192.168.4.1 재 접속 바랍니다.");
				
//				parent.location.href="http://192.168.4.1";
			}
			else{
				fetch("http://"+newIp+"/mag/wifiStatus", param)
				.then(response => response.json())
				.then(data => {
					if (data.data == "OK") {
						alert("인터넷 WIFI 재설정이 완료 되었습니다.");
						parent.location.href="http://"+data.ip+"/mag";
					
					}
					else {
						wificheck = false;
						output.innerHTML = "";
						alert("인터넷 WIFI 재설정이 오류발생!\n" + data.data);
					}
				});
			}
		}
	}
	else{
		fetch('/mag/wifiStatus', param)
		.then(response => response.json())
		.then(data => {

			if (data.data == "OK") {
				wificheck = true;
				if (pageName == "infor" || pageName == "content1") {
					document.querySelector('#wifi').innerHTML = "정상";
				}
			}
			else {
				wificheck = false;
				output.innerHTML = "";

				output.innerHTML = "인터넷 WIFI 오류발생!\n" + data.data;
				if (pageName == "infor" || pageName == "content1") {
					document.querySelector('#wifi').innerHTML = "오류";
				}
			}
		})
		
	}
}

function validateWifi() {
	if (!wificheck) {
		alert("네트워크 오류가 발행 하였습니다.\n관리자에게 문의 하세요.");
		return false;
	}
	return true;
}

function removeSpacesCheck(str){
	return str.replace(/(\s*)/g,'');
}