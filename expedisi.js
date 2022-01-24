
  //var fileList = [] ;
  var fileListSJ = new Array();
  var fileListDO = new Array();
  var fileListRESI = new Array();

  function handleFilesUpload(files,tag) {
    files = [...files]

    if (tag=='SJ'){
      fileListSJ = [] ;
      files.forEach(previewFileSJ)
    } else if (tag=='DO'){
      fileListDO = [] ;
      files.forEach(previewFileDO)
    } else if (tag=='PO'){
      fileListPO = [] ;
      files.forEach(previewFilePO)
    } else if (tag=='RESI'){
      fileListRESI = [] ;
      files.forEach(previewFileRESI)
    }
  }

  function previewFileSJ(file) {
    var nmFile = file.name;
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function() {
      var obj = {};
      obj['base64'] = reader.result ;
      obj['name'] = nmFile ;
      fileListSJ.push(obj)
      var objBtn = document.getElementById('btn_f_sj');
      if (objBtn!='undefined' && objBtn!=null){
        objBtn.innerHTML="ganti";
      }
    }
  }

  function previewFileDO(file) {
    var nmFile = file.name;
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function() {
      var obj = {};
      obj['base64'] = reader.result ;
      obj['name'] = nmFile ;
      fileListDO.push(obj)
      var objBtn = document.getElementById('btn_f_do');
      if (objBtn!='undefined' && objBtn!=null){
        objBtn.innerHTML="ganti";
      }
    }
  }

  function previewFileRESI(file) {
    var nmFile = file.name;
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function() {
      var obj = {};
      obj['base64'] = reader.result ;
      obj['name'] = nmFile ;
      fileListRESI.push(obj)
      var objBtn = document.getElementById('btn_f_resi');
      if (objBtn!='undefined' && objBtn!=null){
        objBtn.innerHTML="ganti";
      }
    }
  }

  
  function simpanPengiriman(tagUpdate){
    var tanyaSimpan = 'Simpan Data ??' ;
    var infoUpdate = '';
    if (tagUpdate!='undefined' && tagUpdate!=null){
      infoUpdate = tagUpdate ;
      tanyaSimpan = 'Data akan di Rubah ??' ;
    }
    swal({
      title: tanyaSimpan,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: function(result) {
        return new Promise(function(resolve, reject) {
          if (result) {
              var obj = {};
              obj = PostUserInfo(obj);
              obj['kirim'] = 'simpan_pengiriman' ;
              obj['update_data'] = infoUpdate ;
              
              obj['id_ekatalog'] = getValueElm('id_ekatalog') ;
              obj['detail-produk'] = getValueElm('detail-produk') ;
              obj['invoice'] = getValueElm('invoice') ;
              
              obj['tgl_kontrak'] = getValueElm('tgl_kontrak') ;
              obj['tgl_batas'] = getValueElm('tgl_batas') ;

              obj['pt_cv'] = getValueElm('pt_cv') ;
              obj['nama_penerima'] = getValueElm('nama_penerima') ;
              obj['tlp_penerima'] = getValueElm('tlp_penerima') ;
              obj['alamat'] = getValueElm('alamat') ;
              obj['kota'] = getValueElm('kota') ;
              obj['provinsi'] = getValueElm('provinsi') ;
              obj['catatan'] = getValueElm('catatan') ;

              obj['no_do'] = getValueElm('no_do') ;
              obj['DO'] = fileListDO ;

              obj['no_surat_jalan'] = getValueElm('no_surat_jalan') ;
              obj['SJ'] = fileListSJ ;

              obj['tanggal'] = getValueElm('tanggal') ;
              obj['catatan_kirim'] = getValueElm('catatan_kirim') ;

              obj['zona'] = getSelectValueElm('zona') ;

              var infoJadwal = getValueCheckboxElm('blm_ada_jadwal') ;
              if (infoJadwal){
                obj['blm_ada_jadwal'] = '1';
              } else {
                obj['blm_ada_jadwal'] = '0';
              }

              $.post(urlDB,obj,
                function(data,status){
                  if (status=="success"){
                    if (data=='1' || data=='ok'){
                      fileListSJ = new Array();
                      fileListDO = new Array();

                      SwalPopupSuccess('Berhasil disimpan')   ;
                      resetInputJadwal() ;
                    } else if (data=='update'){
                      simpanPengiriman('update');
                    } else {
                      Swal.fire({type: 'error',title: data})
                    }
                  } else {

                    Swal.fire({type: 'error',title: 'Gagal Proses'})
                  };
                } 
              ); 
           
          }
        });
      },
      allowOutsideClick: () => $swal.isLoading(),
    })

    /*
    Swal.queue([{
      title: tanyaSimpan,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        
        var obj = {};
        obj = PostUserInfo(obj);
        obj['kirim'] = 'simpan_pengiriman' ;
        obj['update_data'] = infoUpdate ;
        
        obj['id_ekatalog'] = getValueElm('id_ekatalog') ;
        obj['invoice'] = getValueElm('invoice') ;
        
        obj['tgl_kontrak'] = getValueElm('tgl_kontrak') ;
        obj['tgl_batas'] = getValueElm('tgl_batas') ;

        obj['pt_cv'] = getValueElm('pt_cv') ;
        obj['nama_penerima'] = getValueElm('nama_penerima') ;
        obj['tlp_penerima'] = getValueElm('tlp_penerima') ;
        obj['alamat'] = getValueElm('alamat') ;
        obj['kota'] = getValueElm('kota') ;
        obj['provinsi'] = getValueElm('provinsi') ;
        obj['catatan'] = getValueElm('catatan') ;

        obj['no_do'] = getValueElm('no_do') ;
        obj['DO'] = fileListDO ;

        obj['no_surat_jalan'] = getValueElm('no_surat_jalan') ;
        obj['SJ'] = fileListSJ ;

        obj['tanggal'] = getValueElm('tanggal') ;
        obj['catatan_kirim'] = getValueElm('catatan_kirim') ;

        obj['zona'] = getSelectValueElm('zona') ;

        var infoJadwal = getValueCheckboxElm('blm_ada_jadwal') ;
        if (infoJadwal){
          obj['blm_ada_jadwal'] = '1';
        } else {
          obj['blm_ada_jadwal'] = '0';
        }

        if (fileListSJ.length>0){
          $("#PopupModalLoading").modal()
        }
        LoadingProgress(true);
        $.post(urlDB,obj,
          function(data,status){
            if (status=="success"){
              if (fileListSJ.length>0){
                $('#PopupModalLoading').modal('hide');
              }

              LoadingProgress(false);
              if (data=='1' || data=='ok'){
                fileListSJ = new Array();
                fileListDO = new Array();

                SwalPopupSuccess('Berhasil disimpan')   ;
                resetInputJadwal() ;
              } else if (data=='update'){
                simpanPengiriman('update');
              } else {
                Swal.fire({type: 'error',title: data})
              }
            } else {
              if (fileListSJ.length>0){
                $('#PopupModalLoading').modal('hide');
              }

              LoadingProgress(false);
              Swal.fire({type: 'error',title: 'Gagal Proses'})
            };
          } 
        ); 

      }
    }])
    */
  }
  function resetInputJadwal(){
    addValueElm('invoice',null);
    addValueElm('pt_cv',null);
    addValueElm('tgl_kontrak',null);
    addValueElm('tgl_batas',null);
    addValueElm('tanggal',null);
    addValueElm('nama_penerima',null);
    addValueElm('tlp_penerima',null);
    addValueElm('alamat',null);
    addValueElm('kota',null);
    addValueElm('provinsi',null);
    addValueElm('catatan',null);
    addValueElm('no_do',null);
    addValueElm('no_surat_jalan',null);
    addValueElm('catatan_kirim',null);
    addValueElm('id_ekatalog',null);
    addValueElm('detail-produk',null);

    setElmFocus('invoice');

  }

  function resetInputKirim(){
    addValueElm('invoice',null);
  }

  function InfoJadwal(){
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      var url = 'aplikasi/expedisi/pengiriman_view.php' ;

      var cari = getValueElm('cari') ;
      var param = 'cari='+cari;

      var obj = document.getElementById('view_list');
      obj.innerHTML =  '<div class="w-100 text-center"><img src="assets/images/loading.gif" style="height: 100px"> </div>' ;
      xmlHttp.open("POST", url , true);
      xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          if (obj!='undefined' && obj!=null){
            obj.innerHTML = xmlHttp.responseText;
            document.getElementById("view_list").scrollIntoView();
          }          
          ReloadJsFunc()
        };
      };
      xmlHttp.send(param);
    }

  }

  function InfoDalamPengiriman(){
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      var url = 'aplikasi/expedisi/tracking_view.php' ;

      var cari = getValueElm('cari') ;
      var param = 'cari='+cari;

      var obj = document.getElementById('view_list');
      obj.innerHTML =  '<div class="w-100 text-center"><img src="assets/images/loading.gif" style="height: 100px"> </div>' ;
      xmlHttp.open("POST", url , true);
      xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          if (obj!='undefined' && obj!=null){
            obj.innerHTML = xmlHttp.responseText;
            document.getElementById("view_list").scrollIntoView();
          }          
          ReloadJsFunc()
        };
      };
      xmlHttp.send(param);
    }

  }

  function ExpedisiDone(){
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      var url = 'aplikasi/expedisi/terkirim_view.php' ;

      var cari = getValueElm('cari') ;
      var param = 'cari='+cari;

      var obj = document.getElementById('view_list');
      obj.innerHTML =  '<div class="w-100 text-center"><img src="assets/images/loading.gif" style="height: 100px"> </div>' ;
      xmlHttp.open("POST", url , true);
      xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          if (obj!='undefined' && obj!=null){
            obj.innerHTML = xmlHttp.responseText;
            document.getElementById("view_list").scrollIntoView();
          }          
          ReloadJsFunc()
        };
      };
      xmlHttp.send(param);
    }

  }


  function HapusPengiriman(id){
    Swal.queue([{
      title: 'Hapus Data ??',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        LoadingProgress(true);
        var obj = {};
        obj = PostUserInfo(obj);
        obj['kirim'] = 'hapus_pengiriman' ;
        obj['id'] = id ;
       
        
        $.post(urlDB,obj,
          function(data,status){
            if (status=="success"){
              LoadingProgress(false);
              if (data=='1' || data=='ok'){
                SwalPopupSuccess('Berhasil disimpan')   ;
                InfoJadwal() ;
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

  function EntryPengiriman(id){
    resetTmpFileUpload();
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      var url = 'aplikasi/expedisi/input_kirim.php' ;

      var param = 'id='+id;

      var obj = document.getElementById('view_entry');
      obj.innerHTML =  '<div class="w-100 text-center"><img src="assets/images/loading.gif" style="height: 100px"> </div>' ;
      xmlHttp.open("POST", url , true);
      xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          if (obj!='undefined' && obj!=null){
            obj.innerHTML = xmlHttp.responseText;
            document.getElementById("view_entry").scrollIntoView();
          }          
          ReloadJsFunc()
        };
      };
      xmlHttp.send(param);
    }

  }


  function BatalSimpanKeberangkatan(){
    document.getElementById('view_entry').innerHTML='';
    resetKeberangkaran()
  }
  function simpanKeberangkatan(id){
    Swal.queue([{
      title: 'Proses Pengiriman ??',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        LoadingProgress(true);
        var obj = {};
        obj = PostUserInfo(obj);
        obj['kirim'] = 'simpan_keberangkatan' ;
        obj['id'] = id ;
        obj['tanggal'] = getValueElm('tanggal') ;
        obj['tgl_estimasi'] = getValueElm('tanggal1') ;
        
        obj['pengemudi'] = getValueElm('pengemudi') ;
        obj['tlp_pengemudi'] = getValueElm('tlp_pengemudi') ;
        obj['asisten'] = getValueElm('asisten') ;
        obj['tlp_asisten'] = getValueElm('tlp_asisten') ;

        obj['kendaraan'] = getValueElm('kendaraan') ;
        obj['nopol'] = getValueElm('nopol') ;

        obj['catatan'] = getValueElm('catatan') ;

        obj['no_do'] = getValueElm('no_do') ;
        obj['DO'] = fileListDO ;

        obj['no_surat_jalan'] = getValueElm('no_surat_jalan') ;
        obj['SJ'] = fileListSJ ;

        obj['kurir'] = getValueElm('kurir') ;
        obj['no_resi'] = getValueElm('no_resi') ;
        obj['RESI'] = fileListRESI ;

        var filePendukung = new Array();
        for (index = 0; index < fileListUpload.length; ++index) {
          var hapus = fileListUpload[index]['hapus'];
          if (hapus==0){
            filePendukung.push(fileListUpload[index])
          }
        }
        obj['FILE-PENDUKUNG'] = filePendukung ;


        
        $.post(urlDB,obj,
          function(data,status){
            if (status=="success"){
              LoadingProgress(false);
              if (data=='1' || data=='ok'){
                fileListSJ = new Array();
                fileListDO = new Array();
                fileListRESI = new Array();
                SwalPopupSuccess('Berhasil disimpan')   ;
                document.getElementById('view_entry').innerHTML='';
                resetKeberangkaran()
                InfoJadwal()
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

  function resetKeberangkaran(){
    addValueElm('tanggal',null);
    addValueElm('pengemudi',null);
    addValueElm('tlp_pengemudi',null);
    addValueElm('asisten',null);
    addValueElm('tlp_asisten',null);
    addValueElm('kendaraan',null);
    addValueElm('nopol',null);
    addValueElm('catatan',null);
    addValueElm('no_do',null);
    addValueElm('no_surat_jalan',null);
    addValueElm('kurir',null);
    addValueElm('no_resi',null);
    addValueElm('catatan',null);

  }

  function inputTracking(id){
    Swal.fire({
      title: 'Tracking Paket',
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Simpan',
      showLoaderOnConfirm: true,
      preConfirm: (ket) => {
        LoadingProgress(true);
        var keterangan = `${ket}` ;

        var obj = {};
        obj = PostUserInfo(obj);
        obj['kirim'] = 'update_tracking' ;
        obj['id'] = id ;
        obj['keterangan'] = keterangan ;
        
        $.post(urlDB,obj,
          function(data,status){
            if (status=="success"){
              LoadingProgress(false);
              if (data=='1' || data=='ok'){
                SwalPopupSuccess('Berhasil disimpan')   ;
                InfoDalamPengiriman();
                //DetailTrx(tag,Notrx);
              } else {
                Swal.fire({type: 'error',title: data})
              }
            } else {
              LoadingProgress(false);
              Swal.fire({type: 'error',title: 'Gagal Proses'})
            };
          } 
        ); 
      },
      allowOutsideClick: () => !Swal.isLoading()
    })
  }

  function TrackingDone(id){
    resetTmpFileUpload();
    var htmlInput = '<input type="text" id="tanggal_selesai" name="tanggal_selesai" class="swal2-input" placeholder="Tanggal">'
                    +'<input type="text" id="penerima" name="penerima" class="swal2-input" placeholder="Nama Penerima">'
                    +'<div class="card"><div class="d-flex"><div class="row py-2 px-4" id="prev_name_file"></div></div></div>'
                    +'<button class="btn btn-block btn-danger btn-sm waves-effect text-center" id="tmp_pilih_file">Pilih File</button>';
    swal({
      title: 'Tanggal diterima User',
      html: htmlInput,
      confirmButtonText: 'Sudah diterima User',
      cancelButtonText: 'Batal',
      showCancelButton: true,
      onOpen: function() {
        $('#tmp_pilih_file').on('click',function () {
            $('#F_UPLOAD').trigger('click'); 
        }); 

        $('input[name="tanggal_selesai"]').daterangepicker({
          singleDatePicker: true,
          timePicker: false,
          showDropdowns: true,
          drops: "down",
          opens: "right",
          locale: {
            format: 'YYYY-MM-DD'
          }
        }, 
        function(start, end, label) {
          $('input[name="tanggal_selesai"]').on('apply.daterangepicker', function(ev, picker) {
            $(this).val(picker.startDate.format('YYYY-MM-DD'));
          });
        });
      },
      preConfirm: function() {
        return new Promise((resolve, reject) => {
          var objPost = {};
          objPost = PostUserInfo(objPost);
          objPost['kirim'] = 'update_tracking_done' ;
          objPost['id'] = id ;
          objPost['tanggal'] = getValueElm("tanggal_selesai")
          objPost['penerima'] = getValueElm("penerima")
          objPost['FILE-PENDUKUNG'] = fileListUpload ;
          

          Swal.fire({
            title: 'Sudah diterima oleh User ??',
            type: 'warning',
            showCancelButton: true,
          }).then((result) => {
            if (result.value) {

              LoadingProgress(true);
              axios.post(urlDB, objPost )
              .then(function (res) {
                var resData = res.data ;
                if (resData=='1' || resData=='ok'){
                  SwalPopupSuccess('Berhasil disimpan')   ;
                  InfoDalamPengiriman()
                } else {
                  Swal.fire({type: 'error',title: 'Gagal Proses '+resData})
                }

              })
              .catch(function (err) {
                Swal.fire({type: 'error',title: 'Gagal Proses '+resData})
              });

            }
          })
          //resolve();
        });
      }
    }).then((data) => {
      console.log(data);
    });

  }
  /*
  function TrackingDoneXX(id){
    Swal.queue([{
      title: 'Sudah diterima oleh Konsumen ??',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        LoadingProgress(true);
        var obj = {};
        obj = PostUserInfo(obj);
        obj['kirim'] = 'update_tracking_done' ;
        obj['id'] = id ;
        
        $.post(urlDB,obj,
          function(data,status){
            if (status=="success"){
              LoadingProgress(false);
              if (data=='1' || data=='ok'){
                SwalPopupSuccess('Berhasil disimpan')   ;
                InfoDalamPengiriman()
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
  */

  function TrackingKurirExt(id,kurir,resi){
    Swal.queue([{
      title: 'Tracking Paket ??',
      confirmButtonText: 'Lacak',
      showLoaderOnConfirm: true,
      preConfirm: () => {
      
        return fetch(urlTracking+'?kurir='+kurir+'&resi='+resi)
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {

            var res = data.result ;
            var resDate = res.date+' '+res.time ;
            var resDesc = res.description ;

            if (resDate!='' && resDesc!=''){
              var obj = {};
              obj = PostUserInfo(obj);
              obj['kirim'] = 'update_tracking' ;
              obj['id'] = id ;
              obj['tanggal'] = resDate ;
              obj['keterangan'] = resDesc ;
              
              $.post(urlDB,obj); 
            }

            Swal.insertQueueStep({
              icon: 'success',
              html:
                '<b>'+kurir+' - '+resi+'</b><br/><br/>'  +
                resDate+'<br/>'  +
                '<b>'+resDesc+'</b>' 
            })
            
          }).catch(() => {
            Swal.insertQueueStep({
              icon: 'error',
              title: 'Gagal Lacak Paket'
            })
          })

      }
    }])

   


  }


  function InfoTracking(){
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      var url = 'aplikasi/expedisi/info_view.php' ;

      var cari = getValueElm('cari') ;
      var status_paket = getSelectValueElm('status_paket') ;
      var param = 'cari='+cari+'&status_paket='+status_paket;

      var obj = document.getElementById('view_list');
      obj.innerHTML =  '<div class="w-100 text-center"><img src="assets/images/loading.gif" style="height: 100px"> </div>' ;
      xmlHttp.open("POST", url , true);
      xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          if (obj!='undefined' && obj!=null){
            obj.innerHTML = xmlHttp.responseText;
          }          
        };
      };
      xmlHttp.send(param);
    }

  }

  function KurirTracking(){
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      var url = 'aplikasi/expedisi/kurir_tracking_view.php' ;

      var resi = getValueElm('resi') ;
      var kurir = getSelectValueElm('kurir') ;
      var param = 'resi='+resi+'&kurir='+kurir;

      var obj = document.getElementById('view_list');
      obj.innerHTML =  '<div class="w-100 text-center"><img src="assets/images/loading.gif" style="height: 100px"> </div>' ;
      xmlHttp.open("POST", url , true);
      xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          if (obj!='undefined' && obj!=null){
            obj.innerHTML = xmlHttp.responseText;
          }          
        };
      };
      xmlHttp.send(param);
    }

  }


  function simpanResiPengiriman(){
    Swal.queue([{
      title: 'Simpan Data ??',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        LoadingProgress(true);
        var obj = {};
        obj = PostUserInfo(obj);
        obj['kirim'] = 'simpan_resi_pengiriman' ;
        
        obj['pt_cv'] = getValueElm('pt_cv') ;
        obj['nama_penerima'] = getValueElm('nama_penerima') ;
        obj['tlp_penerima'] = getValueElm('tlp_penerima') ;
        obj['alamat'] = getValueElm('alamat') ;
        obj['kota'] = getValueElm('kota') ;
        obj['provinsi'] = getValueElm('provinsi') ;
        obj['catatan'] = getValueElm('catatan') ;

        obj['kurir'] = getValueElm('kurir') ;
        obj['no_resi'] = getValueElm('no_resi') ;
        obj['RESI'] = fileListRESI ;

        obj['catatan_kirim'] = getValueElm('catatan_kirim') ;
        
        $("#PopupModalLoading").modal() ;
        $.post(urlDB,obj,
          function(data,status){
            if (status=="success"){
              //LoadingProgress(false);
              $('#PopupModalLoading').modal('hide');
              if (data=='1' || data=='ok'){
                fileListRESI = new Array();
                SwalPopupSuccess('Berhasil disimpan')   ;
                resetInputResi() ;
              } else {
                Swal.fire({type: 'error',title: data})
              }
            } else {
              //LoadingProgress(false);
              $('#PopupModalLoading').modal('hide');
              Swal.fire({type: 'error',title: 'Gagal Proses'})
            };
          } 
        ); 
      }
    }])
  }

  function resetInputResi(){
    addValueElm('pt_cv',null);
    addValueElm('nama_penerima',null);
    addValueElm('tlp_penerima',null);
    addValueElm('alamat',null);
    addValueElm('kota',null);
    addValueElm('provinsi',null);
    addValueElm('catatan',null);
    addValueElm('catatan_kirim',null);
    addValueElm('kurir',null);
    addValueElm('resi',null);
    addValueElm('catatan_kirim',null);
    setElmFocus('pt_cv');
  }

  function ProsesDOSJKembali(tag,id){
    var tanya = 'DO sudah Kembali ??';
    if (tag=='sj' || tag=='SJ'){
      tanya = 'Surat Jalan sudah Kembali ??';
    }
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
        obj['kirim'] = 'update_sts_sj_do' ;
        obj['id'] = id ;
        obj['tag'] = tag ;

        
        $.post(urlDB,obj,
          function(data,status){
            if (status=="success"){
              LoadingProgress(false);
              if (data=='1' || data=='ok'){
                SwalPopupSuccess('Berhasil disimpan')   ;
                ExpedisiDone() ;
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

  function cariNoInvoiceExp(){
    var invoice = getValueElm('invoice') ;
    var obj = {};
    obj = PostUserInfo(obj);
    obj['kirim'] = 'cari_invoice_expedisi' ;
    obj['invoice'] = invoice ;

    $.post(urlDB,obj,
      function(data,status){
        if (status=="success"){
          var json = JSON.parse(data);
          addValueElm('invoice',json['invoice'])
          addValueElm('pt_cv',json['nama_pt_cv'])
          addValueElm('nama_penerima',json['nama_penerima'])
          addValueElm('tlp_penerima',json['tlp_penerima'])
          //addValueElm('alamat',json['alamat'])
          addValueElm('kota',json['kota'])
          addValueElm('provinsi',json['provinsi'])
          //addValueElm('catatan',json['catatan'])
          addValueElm('no_do',json['no_do'])
          addValueElm('no_surat_jalan',json['no_sj'])
          addValueElm('tanggal',json['tgl_jadwal'])
          addValueElm('tgl_kontrak',json['tgl_kontrak'])
          addValueElm('tgl_batas',json['tgl_batas_kontrak'])

          addValueElm('zona',json['zona'])
          addValueElm('id_ekatalog',json['id_ekatalog'])
          //addValueElm('catatan_kirim',json['catatan_kirim'])
          
          var alamat = json['alamat'] ;
          var catatan = json['catatan'] ;
          var catatan_kirim = json['catatan_kirim'] ;

          alamat = alamat.replace(/<br ?\/?>/g, "\n") ;
          catatan = catatan.replace(/<br ?\/?>/g, "\n") ;
          catatan_kirim = catatan_kirim.replace(/<br ?\/?>/g, "\n") ;

          addValueElm('catatan',catatan) ;
          addValueElm('catatan_kirim',catatan_kirim) ;
          addValueElm('alamat',alamat) ;


          var objBtn = document.getElementById('btn_f_sj');
          if (objBtn!='undefined' && objBtn!=null){
            if (json['file_sj']==1 || json['file_sj']=='1'){
              objBtn.innerHTML="Ganti"; 
            } else {
              objBtn.innerHTML="Pilih"; 

            }
          }

          var objBtn = document.getElementById('btn_f_do');
          if (objBtn!='undefined' && objBtn!=null){
            if (json['file_do']==1 || json['file_do']=='1'){
              objBtn.innerHTML="Ganti"; 
            } else {
              objBtn.innerHTML="Pilih"; 

            }
          }

        };
      } 
    ); 
  }


  function viewExpedisiFile(tag,id){
    var obj = {};
    obj = PostUserInfo(obj);
    obj['kirim'] = 'view_file_expedisi' ;
    obj['id'] = id ;
    obj['tag'] = tag ;
    $.post(urlDB,obj,
      function(data,status){
        if (status=="success"){
          LoadingProgress(false);
          var json = JSON.parse(data);
          var filePath = json['list']['path'];
          var url = urlHome+'file_upload/EXPEDISI/'+filePath
          var infoModal = document.getElementById('ContentPopupModal');
          infoModal.innerHTML = '<iframe src="'+url+'" width="100%" height="600px"></iframe>';
            
          $("#PopupModal").modal()

        } else {
          LoadingProgress(false);
          Swal.fire({type: 'error',title: 'Gagal Proses'})
        };
      } 
    ); 

  }

  function uploadExpDoKembali(id){
    resetTmpFileUpload();
    var htmlInput = '<input type="text" id="no" class="swal2-input" placeholder="Nomor DO">';
    htmlInput += '<input type="file" id="foto" onchange="handleFilesDO(this.files)" >';
    swal({
      title: 'DO sudah kembali',
      html: htmlInput,
      confirmButtonText: 'Confirm',
      showCancelButton: true,
      preConfirm: function() {
        return new Promise((resolve, reject) => {
          var objPost = {};
          objPost = PostUserInfo(objPost);
          objPost['kirim'] = 'exp_upload_do_sj_kembali' ;
          objPost['id'] = id
          objPost['no'] = getValueElm("no")
          objPost['tag'] = 'DO'
          objPost['file'] = fileListDO ;
          

          Swal.fire({
            title: 'Simpan DO Kembali ?',
            type: 'warning',
            showCancelButton: true,
          }).then((result) => {
            if (result.value) {

              LoadingProgress(true);
              axios.post(urlDB, objPost )
              .then(function (res) {
                var resData = res.data ;
                if (resData=='1' || resData=='ok'){
                  LoadingProgress(false)
                  ExpedisiDone()

                  fileListDO = new Array();
                  SwalPopupSuccess('Berhasil disimpan ')   ;
                } else {
                  Swal.fire({type: 'error',title: 'Gagal Proses '+resData})
                }

              })
              .catch(function (err) {
                Swal.fire({type: 'error',title: 'Gagal Proses '+resData})
              });

              
            }
          })
          //resolve();
        });
      }
    }).then((data) => {
      console.log(data);
    });

  }


  function uploadExpSJKembali(id){
    resetTmpFileUpload();
    var htmlInput = '<input type="text" id="no" class="swal2-input" placeholder="Nomor Surat Jalan">';
    htmlInput += '<input type="file" id="foto" onchange="handleFilesSJ(this.files)" >';
    swal({
      title: 'Surat Jalan sudah kembali',
      html: htmlInput,
      confirmButtonText: 'Confirm',
      showCancelButton: true,
      preConfirm: function() {
        return new Promise((resolve, reject) => {
          var objPost = {};
          objPost = PostUserInfo(objPost);
          objPost['kirim'] = 'exp_upload_do_sj_kembali' ;
          objPost['id'] = id
          objPost['no'] = getValueElm("no")
          objPost['tag'] = 'SJ'
          objPost['file'] = fileListSJ ;

          Swal.fire({
            title: 'Simpan Surat Jalan Kembali ?',
            type: 'warning',
            showCancelButton: true,
          }).then((result) => {
            if (result.value) {

              LoadingProgress(true);
              axios.post(urlDB, objPost )
              .then(function (res) {
                var resData = res.data ;
                if (resData=='1' || resData=='ok'){
                  LoadingProgress(false)
                  ExpedisiDone()

                  fileListSJ = new Array();
                  SwalPopupSuccess('Berhasil disimpan ')   ;
                } else {
                  Swal.fire({type: 'error',title: 'Gagal Proses '+resData})
                }

              })
              .catch(function (err) {
                Swal.fire({type: 'error',title: 'Gagal Proses '+resData})
              });

            }
          })
          //resolve();
        });
      }
    }).then((data) => {
      console.log(data);
    });

  }

  function uploadExpResi(id){
    resetTmpFileUpload();
    var htmlInput = '<input type="text" id="kurir" class="swal2-input" placeholder="Kurir">';
    htmlInput += '<input type="text" id="no" class="swal2-input" placeholder="Nomor Resi">';
    htmlInput += '<input type="file" id="foto" onchange="handleFilesResi(this.files)" >';
    swal({
      title: 'Surat Jalan sudah kembali',
      html: htmlInput,
      confirmButtonText: 'Confirm',
      showCancelButton: true,
      preConfirm: function() {
        return new Promise((resolve, reject) => {
          var objPost = {};
          objPost = PostUserInfo(objPost);
          objPost['kirim'] = 'exp_upload_do_sj_kembali' ;
          objPost['id'] = id
          objPost['kurir'] = getValueElm("kurir")
          objPost['no'] = getValueElm("no")
          objPost['tag'] = 'RESI'
          objPost['file'] = fileListRESI ;

          Swal.fire({
            title: 'Simpan Resi Pengiriman ?',
            type: 'warning',
            showCancelButton: true,
          }).then((result) => {
            if (result.value) {

              LoadingProgress(true);
              axios.post(urlDB, objPost )
              .then(function (res) {
                var resData = res.data ;
                if (resData=='1' || resData=='ok'){
                  LoadingProgress(false)
                  InfoDalamPengiriman()

                  fileListRESI = new Array();
                  SwalPopupSuccess('Berhasil disimpan ')   ;
                } else {
                  Swal.fire({type: 'error',title: 'Gagal Proses '+resData})
                }

              })
              .catch(function (err) {
                Swal.fire({type: 'error',title: 'Gagal Proses '+resData})
              });

            }
          })
          //resolve();
        });
      }
    }).then((data) => {
      console.log(data);
    });

  }

  function handleFilesDO(files) {
    fileListDO = new Array();
    files = [...files]
    files.forEach(previewFileDO)
  }

  function handleFilesSJ(files) {
    fileListSJ = new Array();
    files = [...files]
    files.forEach(previewFileSJ)
  }

  function handleFilesResi(files) {
    fileListRESI = new Array();
    files = [...files]
    files.forEach(previewFileRESI)
  }

  function resetTmpFileUpload(){
    fileListSJ = new Array();
    fileListDO = new Array();
    fileListRESI = new Array();
            
  }

