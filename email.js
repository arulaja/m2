
  function inboxMail(tag,e,s){
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      LoadingProgress(true);
      var url = 'aplikasi/email/inbox.php' ;
     
     
      var param = "e="+e+"&s="+s+"&i_o="+tag;

      var obj = document.getElementById('view_list');
      obj.innerHTML =  '<div class="w-100 text-center"><img src="assets/images/loading.gif" style="height: 100px"> </div>' ;

      xmlHttp.open("POST", url , true);
      xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          LoadingProgress(false);
          if (obj!='undefined' && obj!=null){
            obj.innerHTML = xmlHttp.responseText;

          } 
        };
      };
      xmlHttp.send(param);
    }
  }

  function AddEmailAkun(){
    Swal.queue([{
      title: 'Simpan Akun ??',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        LoadingProgress(true);
        var obj = {};
        obj = PostUserInfo(obj);
        obj['kirim'] = 'simpan_akun_email' ;
        obj['email'] = getValueElm('email') ;
        obj['sandi'] = getValueElm('pass') ;
        $.post(urlDB,obj,
          function(data,status){
            if (status=="success"){
              LoadingProgress(false);
              if (data=='1' || data=='ok'){
                gotoJS('email');
              } else {
                Swal.fire({type: 'error',title: data})
              }
              
            } else {
              LoadingProgress(false);
              Swal.fire({type: 'error',title: 'Gagal Proses'})
            };
          } 
        ); 
      }
    }])

  }

  function RubahEmailAkun(){
    $("#form_input_akun").removeClass("hidden");
    $("#form_email").addClass('hidden')
  }

  function ShowBalasEmail(id){
    var cekclass = hasClass("#reply"+id,'hidden')
    if (cekclass){
      $("#reply"+id).removeClass('hidden')  
    } else {
      $("#reply"+id).addClass('hidden')  
    }
  }
  
  function BalasEmail(id,SenderMail){
    
    var mail_s =  getValueElm('subject'+id) ;
    var mail_f =  getValueElm('from'+id) ;
    var mail_c =  getValueElm('cc'+id) ;
    var mail_b =  getValueElm('bcc'+id) ;
    var mail_t =  getValueElm('text'+id) ;
    var mail_reply =  getValueElm('input_reply'+id) ;

    var textReply = mail_t+mail_reply ;
    


    Swal.queue([{
      title: 'Kirim Email ??',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        LoadingProgress(true);
        var urlMail = 'http://mail.mastermedia.co.id/api.php' ;
        var obj = {};
        obj = PostUserInfo(obj);
        obj['sender'] = SenderMail ;
        obj['to'] = mail_f ;
        obj['cc'] = mail_c ;
        obj['bcc'] = mail_b ;
        obj['subject'] = mail_s ;
        obj['message'] = textReply ;
        $.post(urlMail,obj,
          function(data,status){
            if (status=="success"){
              LoadingProgress(false);
              if (data!=''){
                var myJSON = JSON.parse(data);
                if (myJSON['status']==1){
                  SwalPopupSuccess('Email Berhasil di Kirim')   ;  
                  $("#reply"+id).addClass('hidden')
                  $("#btn_reply"+id).removeClass('hidden')
                } else {
                  Swal.fire({type: 'error',title: data})
                }

                
              } else {
                Swal.fire({type: 'error',title: data})
              }
              
            } else {
              LoadingProgress(false);
              Swal.fire({type: 'error',title: 'Gagal Proses'})
            };
          } 
        ); 
      }
    }])

   

  }
