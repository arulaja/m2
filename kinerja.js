
  function KinerjaHome(){
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      var url = 'aplikasi/kinerja/index.php' ;
      
      var uid = getUserInfo('id');
      var akses = getUserInfo('id_akses');

      var param = 'uid='+uid+'&akses='+akses;

      var obj = document.getElementById('main-content');
      obj.innerHTML =  '<div class="w-100 text-center"><img src="assets/images/loading.gif" style="height: 100px"> </div>' ;
      xmlHttp.open("POST", url , true);
      xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          if (obj!='undefined' && obj!=null){
            obj.innerHTML = xmlHttp.responseText;
          }
          LoadingProgress(false);
          ReloadJsFunc();
        };
      };
      xmlHttp.send(param);
    }
  }

  function KinerjaAll(){
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      var url = 'aplikasi/kinerja/approval.php' ;
      
      var uid = getUserInfo('id');
      var akses = getUserInfo('id_akses');

      var param = 'uid='+uid+'&akses='+akses;

      var obj = document.getElementById('main-content');
      obj.innerHTML =  '<div class="w-100 text-center"><img src="assets/images/loading.gif" style="height: 100px"> </div>' ;
      xmlHttp.open("POST", url , true);
      xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          if (obj!='undefined' && obj!=null){
            obj.innerHTML = xmlHttp.responseText;
          }
          LoadingProgress(false);
          ReloadJsFunc();
        };
      };
      xmlHttp.send(param);
    }
  }

  function KinerjaUserExcel(id,bulan){
    var uid = getUserInfo('id');
    var akses = getUserInfo('id_akses');

    var params = {} ;
    params.id = id
    params.bulan = bulan
    params.uid = uid
    params.akses = akses
    OpenWindowWithPost('aplikasi/kinerja/approval_detail_xls.php', "", "Kinerja karyawan", params);  
  }

  function KinerjaUser(id,bulan){
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      var url = 'aplikasi/kinerja/approval_detail.php' ;
      
      var uid = getUserInfo('id');
      var akses = getUserInfo('id_akses');

      var param = 'uid='+uid+'&akses='+akses+'&id='+id+'&bulan='+bulan;

      var obj = document.getElementById('info_kinerja');
      obj.innerHTML =  '<div class="w-100 text-center"><img src="assets/images/loading.gif" style="height: 100px"> </div>' ;
      xmlHttp.open("POST", url , true);
      xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          if (obj!='undefined' && obj!=null){
            obj.innerHTML = xmlHttp.responseText;
            obj.scrollIntoView();
          }
          LoadingProgress(false);
          ReloadJsFunc();
        };
      };
      xmlHttp.send(param);
    }

  }

  function addKinerjaHarian(tgl,bln,id,agenda,keterangan,pelaksanaan,tindakan){

    if (id=='undefined' || id==null) id = 0;
    if (agenda=='undefined' || agenda==null) agenda = '';
    if (keterangan=='undefined' || keterangan==null) keterangan = '';
    if (pelaksanaan=='undefined' || pelaksanaan==null) pelaksanaan = '';
    if (tindakan=='undefined' || tindakan==null) tindakan = '';

    var htmlInput = '<div class="row"> '
                    + '<div class="col-md-12">'
                      + '<textarea type="text" id="agenda" rows="3" class="form-control" placeholder="Agenda">'+agenda+'</textarea>'
                    + '</div>'
                    + '<div class="col-md-12 mt-1">'
                      + '<textarea type="text" id="keterangan" rows="5" class="form-control" placeholder="Keterangan">'+keterangan+'</textarea>'
                    + '</div>'
                    + '<div class="col-md-12 mt-1">'
                      + '<select class="form-control" id="pelaksanaan">'
                          +'<option value="2">sudah dilaksanakan</option>'
                          +'<option value="1">dalam proses</option>'
                          +'<option value="0">belum dilaksanakan</option>'
                          +'</select>'
                    + '</div>'
                    + '<div class="col-md-12 mt-1">'
                      + '<textarea type="text" id="tindakan" rows="5" class="form-control" placeholder="Status">'+tindakan+'</textarea>'
                    + '</div>'

                    + '<div class="col-md-12 mt-1 w-100">'
                        + '<input class="form-control w-100" type="file" id="foto" onchange="handleFiles(this.files)" >'
                    + '</div>'
                  + '</div>';

    var htmlHapus = '&nbsp;&nbsp;&nbsp;' ;
    if (id>0){
      htmlHapus = '<button class="btn btn-danger waves-effect text-center mx-2" id="hapus">Hapus</button>' ;
    }
    var buttonsPlus = '<div class="row mt-4">'
                        +'<div class="col-md-12">'
                        +'<button class="btn btn-primary waves-effect text-center" id="simpan">Simpan</button>'
                        +htmlHapus
                        +'<button class="btn btn-warning waves-effect text-center" id="batal">Batal</button>'
                        +'</div>'
                      +'</div>';
    
    swal({
      title: 'Agenda Kegiatan',
      html: htmlInput+buttonsPlus,
      showCancelButton: false,
      showConfirmButton: false,
      onOpen: function (dObj) {
        $('#batal').on('click',function () {
          swal.close();
        });
        $('#hapus').on('click',function () {
          var objPost = {};
          objPost = PostUserInfo(objPost);
          objPost['kirim'] = 'hapus_kinerja' ;
          objPost['id'] = id
          
          Swal.fire({
            title: 'Hapus ?',
            type: 'warning',
            showCancelButton: true,
          }).then((result) => {
            if (result.value) {
              LoadingProgress(true);
              axios.post(urlDB, objPost )
              .then(function (res) {

                var resData = res.data ;
                if (resData==1 || resData=='1' || resData==true){
                  SwalPopupSuccess('Berhasil disimpan');
                  KinerjaHome();  
                } else {
                  Swal.fire({type: 'error',title: 'Gagal Proses ('+resData+')'})
                }
              })
              .catch(function (err) {
                Swal.fire({type: 'error',title: 'Gagal Proses'})
              });

              
            }
          })
        });
        $('#simpan').on('click',function () {
          var objPost = {};
          objPost = PostUserInfo(objPost);
          objPost['kirim'] = 'simpan_kinerja' ;
          objPost['id'] = id
          objPost['tanggal'] = tgl
          objPost['bulan'] = bln
          objPost['agenda'] = getValueElm("agenda")
          objPost['keterangan'] = getValueElm("keterangan")
          objPost['pelaksanaan'] = getSelectValueElm("pelaksanaan")
          objPost['tindakan'] = getValueElm("tindakan")
          objPost['file'] = StoreBase64Array ;
          
          Swal.fire({
            title: 'Simpan ?',
            type: 'warning',
            showCancelButton: true,
          }).then((result) => {
            if (result.value) {
              LoadingProgress(true);
              axios.post(urlDB, objPost )
              .then(function (res) {
                var resData = res.data ;
                StoreBase64Array = new Array();
                if (resData==1 || resData=='1' || resData==true){
                  SwalPopupSuccess('Berhasil disimpan');
                  KinerjaHome();  
                } else {
                  Swal.fire({type: 'error',title: 'Gagal Proses {'+resData+'}'})
                }
                
                //LoadingProgress(false);
              })
              .catch(function (err) {
                Swal.fire({type: 'error',title: 'Gagal Proses'})
              });

              
            }
          })
          //swal.close();
        });
          
      }

    });
  }
  function EditKinerjaHarian(id){
    LoadingProgress(true);
    var obj = {};
    obj = PostUserInfo(obj);
    obj['id'] = id ;
    obj['kirim'] = 'cari_kinerja' ;
    $.post(urlDB,obj,
      function(data,status){
        LoadingProgress(false);
        if (status=="success"){
          if (data==''){
            addKinerjaHarian('','',id,detailAry['agenda'],detailAry['keterangan'],detailAry['pelaksanaan'],detailAry['tindakan']);
          } else {
            var dataAry = JSON.parse(data);
            var detailAry = dataAry['list'][0] ;
            if (detailAry['ajukan']==1){
              if (detailAry['sts_diperiksa']==1){
                Swal.fire({type: 'success',title: 'Sudah di Setujui'})
              } else {
                Swal.fire({type: 'error',title: 'Status sedang di Periksa tidak dapat di ubah'})  
              }
              
            } else {
              addKinerjaHarian('','',id,detailAry['agenda'],detailAry['keterangan'],detailAry['pelaksanaan'],detailAry['tindakan']);
            }
            
          }
        } else {
          Swal.fire({type: 'error',title: 'Gagal Proses'})
        };
      } 
    ); 
  }
  function AjukanKinerja(id){
    var objPost = {};
    objPost = PostUserInfo(objPost);
    objPost['kirim'] = 'revisi_kinerja' ;
    objPost['id'] = id
    objPost['sub'] = 'ajukan';
    Swal.fire({
      title: 'Sudah Selesai ???',
      html: ' Lanjut Proses Persetujuan dari manager',
      type: 'warning',
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        LoadingProgress(true);
        axios.post(urlDB, objPost )
        .then(function (res) {
          var resData = res.data ;
          if (resData==1 || resData=='1' || resData==true){
            SwalPopupSuccess('Berhasil diajukan');
            KinerjaHome();  
          } else {
            Swal.fire({type: 'error',title: 'Gagal Proses '+resData})
          }
          LoadingProgress(false);
        })
        .catch(function (err) {
          Swal.fire({type: 'error',title: 'Gagal Proses'})
        });
      }
    })

  }


  function xxSetujuiKinerja(idUser,bulan,idKinerja){
    var objPost = {};
    objPost = PostUserInfo(objPost);
    objPost['kirim'] = 'revisi_kinerja' ;
    objPost['id'] = idKinerja
    objPost['sub'] = 'acc';
    objPost['catatan'] = getValueElm("catatan")          
    Swal.fire({
      title: 'Disejutui ?',
      type: 'warning',
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        LoadingProgress(true);
        axios.post(urlDB, objPost )
        .then(function (res) {
          var resData = res.data ;
          if (resData==1 || resData=='1' || resData==true){
            SwalPopupSuccess('Berhasil disimpan');
            KinerjaUser(idUser,bulan);  
          } else {
            Swal.fire({type: 'error',title: 'Gagal Proses '+resData})
          }
          LoadingProgress(false);
        })
        .catch(function (err) {
          Swal.fire({type: 'error',title: 'Gagal Proses'})
        });
      }
    })

  }
  function RevisiKinerja(idUser,bulan,idKinerja){
    
    var htmlInput = '<div class="row"> '
                    + '<div class="col-md-12">'
                      + '<textarea type="text" id="catatan" rows="3" class="form-control" placeholder="catatan"></textarea>'
                    + '</div>'
                    + '</div>';


    var buttonsPlus = '<div class="row mt-4">'
                        +'<div class="col-md-12">'
                        +'<button class="btn btn-primary waves-effect text-center" id="simpan">Simpan</button>'
                        +'&nbsp;&nbsp;&nbsp;'
                        +'<button class="btn btn-warning waves-effect text-center" id="batal">Batal</button>'
                        +'</div>'
                      +'</div>';
    
    swal({
      title: 'Revisi Agenda Kegiatan',      
      html: htmlInput+buttonsPlus,
      showCancelButton: false,
      showConfirmButton: false,
      type: 'warning',
      onOpen: function (dObj) {
        $('#batal').on('click',function () {
          swal.close();
        });
        
        $('#simpan').on('click',function () {
          var objPost = {};
          objPost = PostUserInfo(objPost);
          objPost['kirim'] = 'revisi_kinerja' ;
          objPost['id'] = idKinerja
          objPost['sub'] = 'tolak';
          objPost['catatan'] = getValueElm("catatan")          
          Swal.fire({
            title: 'Simpan ?',
            type: 'warning',
            showCancelButton: true,
          }).then((result) => {
            if (result.value) {
              LoadingProgress(true);
              axios.post(urlDB, objPost )
              .then(function (res) {
                var resData = res.data ;
                
                if (resData==1 || resData=='1' || resData==true){
                  SwalPopupSuccess('Berhasil disimpan');
                  KinerjaUser(idUser,bulan);  
                } else {
                  Swal.fire({type: 'error',title: 'Gagal Proses'})
                }
                
                LoadingProgress(false);
              })
              .catch(function (err) {
                Swal.fire({type: 'error',title: 'Gagal Proses'})
              });

            }
          })
          //swal.close();
        });
          
      }

    });
  }


  function SetujuiKinerja(idUser,bulan,idKinerja){
    
    var htmlInput = '<div class="row"> '
                    + '<div class="col-md-12">'
                      + '<textarea type="text" id="catatan" rows="3" class="form-control" placeholder="catatan"></textarea>'
                    + '</div>'
                    + '<div class="col-md-12 mt-3">'
                      + '<select class="form-control" id="penilaian">'
                        + '<option value=1>Cukup</option>'
                        + '<option value=2 selected>Baik</option>'
                        + '<option value=3>Sangat Baik</option>'
                        + '<option value=4>Istimewa</option>'
                      + '</select>'
                    + '</div>'
                  + '</div>';


    var buttonsPlus = '<div class="row mt-4">'
                        +'<div class="col-md-12">'
                        +'<button class="btn btn-primary waves-effect text-center" id="simpan">Simpan</button>'
                        +'&nbsp;&nbsp;&nbsp;'
                        +'<button class="btn btn-warning waves-effect text-center" id="batal">Batal</button>'
                        +'</div>'
                      +'</div>';
    
    swal({
      title: 'Persetujuan Agenda Kegiatan',
      html: htmlInput+buttonsPlus,
      type: 'question',
      showCancelButton: false,
      showConfirmButton: false,
      onOpen: function (dObj) {
        $('#batal').on('click',function () {
          swal.close();
        });
        
        $('#simpan').on('click',function () {
          var objPost = {};
          objPost = PostUserInfo(objPost);
          objPost['kirim'] = 'revisi_kinerja' ;
          objPost['id'] = idKinerja
          objPost['sub'] = 'acc';
          objPost['catatan'] = getValueElm("catatan")          
          objPost['penilaian'] = getSelectValueElm("penilaian")
          Swal.fire({
            title: 'Simpan Persetujuan ?',
            type: 'warning',
            showCancelButton: true,
          }).then((result) => {
            if (result.value) {
              LoadingProgress(true);
              axios.post(urlDB, objPost )
              .then(function (res) {
                var resData = res.data ;
                
                if (resData==1 || resData=='1' || resData==true){
                  SwalPopupSuccess('Berhasil disimpan');
                  KinerjaUser(idUser,bulan);  
                } else {
                  Swal.fire({type: 'error',title: 'Gagal Proses'})
                }
                
                LoadingProgress(false);
              })
              .catch(function (err) {
                Swal.fire({type: 'error',title: 'Gagal Proses'})
              });

            }
          })
          //swal.close();
        });
          
      }

    });
  }

  function ViewFileKinerja(path){
    var infoModal = document.getElementById('ContentPopupModal');
    infoModal.innerHTML = '<iframe src="'+path+'" width="100%" height="600px"></iframe>';
    $("#PopupModal").modal()

    }

