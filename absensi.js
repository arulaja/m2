
  var onDownloadFinger = '' ;
  /* MESIN */
  function downloadDariMesin(id,ip,key_id){
    var bulan= getValueElm('bulan') ;
    if (ip=='undefined' || ip==null){
      notifyDef('' , ' Silahkan Masukan IP Address') ;
      return
    }
    if (bulan=='undefined' || bulan==null || bulan==''){
      notifyDef('' , ' Silahkan masukan Bulan Absensi') ;
      return
    }
    if (onDownloadFinger!=''){
      notifyDef('' , ' Sedang Proses Download '+onDownloadFinger) ;
      return
    }
    bulan = bulan.replace("-", "");
    var obj = {};
    obj = PostUserInfo(obj);

    obj['kirim'] = 'cek_data_absen' ;
    obj['bulan'] = bulan;
    obj['pin'] = getValueElm('pin') ;
    obj['nip'] = getValueElm('nip') ;
    $.post(urlDB,obj,
      function(data,status){
        if (status=="success"){
          TanyaProsesDownload(false,id,ip,key_id,bulan);
        } else {
          Swal.fire({type: 'error',title: 'Gagal Proses'})
        };
      } 
    );  
  }



  function TanyaProsesDownload(info,id,ip,key_id,bulan){
    var judul = 'Download Data Absensi ??';
    var infohtml = 'Bulan <b>'+bulan+'</b>';
    var bg = '' ;
    if (info){
      judul = 'Proses Ulang ??';
      infohtml = 'Bulan <b>'+bulan+'</b> sudah di buat';
      bg = '#FFF1AB' ;
    }
    Swal.queue([{
      title: judul,
      html: infohtml,
      background : bg,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        var up = "0" ;
        var down = "1";
        var downPegawai = "1"

        var ElmUp = document.getElementById('up');
        if (ElmUp!='undefined' && ElmUp!=null){
          var chk = ElmUp.checked ; 
          if (chk){
            up = "1";
          } else {
            up = "0";
          }
        }
        var ElmDownPegawai = document.getElementById('down_pegawai');
        if (ElmDownPegawai!='undefined' && ElmDownPegawai!=null){
          var chk = ElmDownPegawai.checked ; 
          if (chk){
            downPegawai = "1";
          } else {
            downPegawai = "0";
          }
        }

        var ElmDown = document.getElementById('down');
        if (ElmDown!='undefined' && ElmDown!=null){
          var chk = ElmDown.checked ; 
          if (chk){
            down = "1";
          } else {
            down = "0";
          }
        }

        var pin = getValueElm('pin') ;
        var nip = getValueElm('nip') ;

        onDownloadFinger = ip ;
        statProgres = false ;
        waitFor('progress_'+id , () => statProgres, () => notifyDef('',' Download Selesai ') )

        var url = 'aplikasi/absensi/download.php' ;
        var param = 'bulan='+bulan+'&id='+id+'&ip='+ip+'&key_id='+key_id+'&up='+up+'&down='+down+'&download_pegawai='+downPegawai+'&pin='+pin+'&nip='+nip ;
        xmlHttp.open("POST", url , true);
        xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        xmlHttp.onreadystatechange = function() {
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            var obj = document.getElementById('info_'+id);
            obj.innerHTML = xmlHttp.responseText;
            onDownloadFinger = '' ;
            statProgres = true ;

          } else if (xmlHttp.status == 404) {
            notifyDef('',' File not found '+url)
          };
        };
        xmlHttp.send(param);
      }
    }])
  }


  function ViewLaporanAbsen(tag){
      var tahun= getValueElm('tahun') ;
      if (tahun=='undefined' || tahun==null || tahun==''){
        SwalPopupError('Silahkan masukan Tahun dengan benar')   
        return;
      }
      if (tag=='undefined' || tag==null || tag==''){
        SwalPopupError('Error Proses... Silahkan Hubungi Administrator ')   
        return;
      }
      tahun = tahun.replace("-", "");
      var obj = document.getElementById('view');
      obj.innerHTML = "";
      var url = 'aplikasi/laporan/absensi_view.php' ;

      var uid = getUserInfo('id');
      var akses = getUserInfo('id_akses');
      
      var param = 'tahun='+tahun+'&uid='+uid+'&akses='+akses ;

      //var nip= getValueElm('nip') ;
      //var pin= getValueElm('pin') ;
      //param += '&nip='+nip+'&pin='+pin+'&nama='+nama ;
      
      var nama= getValueElm('nama') ;
      var group_kerja= getSelectValueElm('group_kerja') ;
      var bidang= getSelectValueElm('bidang') ;
      param += '&nama='+nama+'&group_kerja='+group_kerja+'&bidang='+bidang ;
      

      

      xmlHttp.open("POST", url , true);
      xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          var hasil = xmlHttp.responseText;
          obj.innerHTML = hasil;
          if (hasil==''){
            SwalPopupError('Data Tidak ditemukan')   
          } else {
            ReloadJsFunc();
          }
        } else if (xmlHttp.status == 404) {
          notifyDef('',' File not found '+url)
        };
    };
    xmlHttp.send(param);
  }

  function OpenReportAbsensi(tag,tahun,bulan,id,bidang,bank){
    var url = 'aplikasi/laporan/pdf_absensi.php' ;
    
    var params = {} ;
    params.laporan = tag
    params.tahun = tahun
    params.bulan = bulan
    params.id = id

    OpenWindowWithPost(url, "", tag, params);
  }



  function ViewPengajuanLembur(){
      var tahun= getValueElm('tahun') ;
      if (tahun=='undefined' || tahun==null || tahun==''){
        SwalPopupError('Silahkan masukan Tahun dengan benar')   
        return;
      }
      var uid = getUserInfo('id');
      var akses = getUserInfo('id_akses');

      var sts = getSelectValueElm("status") ; 

      var param = 'tahun='+tahun+'&status='+sts+'&uid='+uid+'&akses='+akses;

      var url = 'aplikasi/absensi/lembur_view.php' ;

      var obj = document.getElementById('view');
      xmlHttp.open("POST", url , true);
      xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          var hasil = xmlHttp.responseText;
          obj.innerHTML = hasil;
          if (hasil==''){
            SwalPopupError('Data Tidak ditemukan')   
          } else {
            ReloadJsFunc();
          }
        } else if (xmlHttp.status == 404) {
          notifyDef('',' File not found '+url)
        };
    };
    xmlHttp.send(param);
  }


  function ActionLembur(id,sts){
    var tanya = '' ;
    if (sts==1) tanya = 'Lembur Setujui ?? ';
    else if (sts==2) tanya = 'Lembur tidak di ACC ?? ';
    else return ;
    Swal.queue([{
      title: tanya,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        LoadingProgress(true);
        var obj = {};
        obj = PostUserInfo(obj);
          
        obj['kirim'] = 'action_pengajuan_lembur' ;
        obj['id'] = id ;
        obj['status'] = sts ;

        $.post(urlDB,obj,
          function(data,status){
            if (status=="success"){
              LoadingProgress(false);
              if (data=='1' || data=='ok'){
                SwalPopupSuccess('Berhasil disimpan')   ;
                ViewPengajuanLembur();
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


  function SubmitAbsen(lokasi,tagAbsen){
    var uid = getUserInfo('id');
    var akses = getUserInfo('id_akses');
    var infoJudul = '' ;
    if (lokasi=='toko'){
      infoJudul = 'CSB' ;
    } else if (lokasi=='wahidin') {
      infoJudul = 'Wahidin' ;
    } else if (lokasi=='saphire') {
      infoJudul = 'Saphire' ;
    } else if (lokasi=='pembangunan') {
      infoJudul = 'Pembangunan' ;
    }


    var buttonsPlus = $('<div><h1 class="text-red">'+infoJudul+'</h1></div>')
      .append('<div>')
      if (tagAbsen==0){
        buttonsPlus.append(createButton('Absen Masuk','sw_masuk','btn-primary'))
        buttonsPlus.append(createButton('Absen Pulang','sw_pulang','btn-success'))

      } else if (tagAbsen==1){
        buttonsPlus.append(createButton('Absen Masuk','sw_masuk','btn-primary'))
      } else if (tagAbsen==10){
        buttonsPlus.append(createButton('Absen Masuk','sw_masuk','btn-primary'))
        buttonsPlus.append(createButton('Absen Pulang','sw_pulang','btn-success'))
      } else if (tagAbsen==2){
        buttonsPlus.append(createButton('Absen Masuk','sw_masuk','btn-primary'))
        buttonsPlus.append(createButton('Absen Pulang','sw_pulang','btn-success'))
      } else if (tagAbsen==20){
        buttonsPlus.append(createButton('Absen Pulang','sw_pulang','btn-success'))
      }
      
      buttonsPlus.append(createButton('Batal','sw_batal','btn-danger'))
      buttonsPlus.append('</div>')

      swal({
        html: buttonsPlus,
        showCancelButton: false,
        showConfirmButton: false,
        onOpen: function (dObj) {
          $('#sw_batal').on('click',function () {
            swal.close();
          });
          $('#sw_masuk').on('click',function () {
            var objPost = {};
            objPost = PostUserInfo(objPost);
            objPost['kirim'] = 'isi_absen_android' ;
            objPost['uid'] = uid ;
            objPost['akses'] = akses ;
            
            objPost['lokasi'] = lokasi ;
            objPost['status'] = 'masuk' ;

            axios.post(urlDB, objPost )
            .then(function (res) {
              var resData = res.data ;
              if (resData!='undefined' ) {
                var note = resData['respon'] ;
                var infoAll = JSON.stringify(note) ;
                if (note=='1' || note=='ok'){
                  SwalPopupSuccess('Absen Masuk Berhasil disimpan')   ;
                } else {
                  Swal.fire({type: 'error',title: 'Gagal Proses '})
                }
              } else {
                Swal.fire({type: 'error',title: 'Gagal Proses 0'})
              }
            })
            .catch(function (err) {
              Swal.fire({type: 'error',title: 'Gagal Proses err '+resData})
            });
            swal.close();
          });
          $('#sw_pulang').on('click',function () {
            var objPost = {};
            objPost = PostUserInfo(objPost);
            objPost['kirim'] = 'isi_absen_android' ;
            objPost['uid'] = uid ;
            objPost['akses'] = akses ;
            
            objPost['lokasi'] = lokasi ;
            objPost['status'] = 'pulang' ;

            axios.post(urlDB, objPost )
            .then(function (res) {
              var resData = res.data ;
              if (resData!='undefined' ) {
                var note = resData['respon'] ;
                var infoAll = JSON.stringify(note) ;
                if (note=='1' || note=='ok'){
                  SwalPopupSuccess('Absen Pulang Berhasil disimpan')   ;
                } else {
                  Swal.fire({type: 'error',title: 'Gagal Proses '})
                }
              } else {
                Swal.fire({type: 'error',title: 'Gagal Proses 0'})
              }
              
            })
            .catch(function (err) {
              var infoAll = JSON.stringify(note) ;
              Swal.fire({type: 'error',title: 'Gagal Proses err '+infoAll})
            });
            swal.close();

          });

          
        }
      });
  }
