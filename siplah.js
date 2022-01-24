
  var StoreBase64Npwp = new Array();
  var StoreBase64Faktur = new Array();
  var StoreBase64Setor = new Array();

  var TotalInputSiplah = 0 ;

  function ReloadElmSiplah(){
    TotalInputSiplah = 0 ;
    document.getElementById("info_jumlah").innerHTML = "Rp.";
    $("#btn_action").addClass('hidden')

    var elmSiplah = document.getElementsByClassName("input_siplah_qty");
    for(var i=0; i<elmSiplah.length; i++) {
      var dataID = elmSiplah[i].getAttribute("id") ; 
      var elmListener = document.getElementById(dataID);
      elmListener.addEventListener("change", function(e){
        var dID = $(this).attr('data-id') ;
        var vQty = $(this).val() ;
        var vHarga = $("#harga_"+dID).val() ;

        vQty = parseInt(strToNumber(vQty));
        vHarga = parseInt(strToNumber(vHarga));

        if (vQty>0 && vHarga>0){
          addValueCheckBoxElm("pilih_"+dID,true);
        } else {
          addValueCheckBoxElm("pilih_"+dID,false);
        }
        HitungSiplah();
      }, false);
    }
    var elmSiplah = document.getElementsByClassName("input_siplah_harga");
    for(var i=0; i<elmSiplah.length; i++) {
      var dataID = elmSiplah[i].getAttribute("id") ; 
      var elmListener = document.getElementById(dataID);
      elmListener.addEventListener("change", function(e){
        var dID = $(this).attr('data-id') ;
        var vHarga = $(this).val() ;
        var vQty = $("#qty"+dID).val() ;

        vQty = parseInt(strToNumber(vQty));
        vHarga = parseInt(strToNumber(vHarga));

        if (vQty>0 && vHarga>0){
          addValueCheckBoxElm("pilih_"+dID,true);
        } else {
          addValueCheckBoxElm("pilih_"+dID,false);
        }
        HitungSiplah();
      }, false);
    }
    var elmSiplah = document.getElementsByClassName("pilih_siplah");
    for(var i=0; i<elmSiplah.length; i++) {
      var dataID = elmSiplah[i].getAttribute("id") ; 
      var elmListener = document.getElementById(dataID);
      elmListener.addEventListener("change", function(e){
        HitungSiplah();
      }, false);
    }
  }

  function HitungSiplah(){
    var jml = 0 ;
    var elmSiplah = document.getElementsByClassName("input_siplah_qty");
    for(var i=0; i<elmSiplah.length; i++) {

      var dataID = elmSiplah[i].getAttribute("data-id") ; 
      var i_pilih = getValueCheckboxElm("pilih_"+dataID) ;
      if (i_pilih){
        var vQty = getValueElm("qty_"+dataID);
        var vHarga = getValueElm("harga_"+dataID);
          
        if (vQty==null) vQty = 0 ;
        if (vHarga==null) vHarga = 0 ;

        vQty = parseInt(strToNumber(vQty));
        vHarga = parseInt(strToNumber(vHarga));

        if (vQty>0 && vHarga>0){
          jml =jml+(vHarga*vQty);
        }
      }
    }
    document.getElementById("info_jumlah").innerHTML = "Rp. "+number_format(jml)+"-";
    if (jml>0) {
      $("#btn_action").removeClass("hidden");  
    } else {
      $("#btn_action").addClass('hidden')
    }
    
  }


  function SimpanTrxSiplah(){
    var no =getValueElm('no_trx') ;
    if (no==''){
      Swal.fire({type: 'error',title: 'Nomor Tidak Boleh Kosong'})
      return ;
    }
    var objList = [];
    var elmSiplah = document.getElementsByClassName("input_siplah_qty");
    for(var i=0; i<elmSiplah.length; i++) {
      var dataID = elmSiplah[i].getAttribute("data-id") ; 
      var i_pilih = getValueCheckboxElm("pilih_"+dataID) ;
      if (i_pilih){
        var vQty = getValueElm("qty_"+dataID);
        var vHarga = getValueElm("harga_"+dataID);
        
        if (vQty==null) vQty = 0 ;
        if (vHarga==null) vHarga = 0 ;

        vQty = parseInt(strToNumber(vQty));
        vHarga = parseInt(strToNumber(vHarga));

        if (vQty>0 && vHarga>0){
          var objElm = {};
          objElm['id'] = dataID ;
          objElm['qty'] = vQty;
          objElm['harga'] = vHarga;
          objList.push(objElm);
        }
      }
    }

    Swal.queue([{
      title: 'Simpan Transaksi ??',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {

        LoadingProgress(true);
        var obj = {};
        obj = PostUserInfo(obj);
        obj['kirim'] = 'simpan_transaksi_siplah' ;
        obj['penyedia'] = getValueElm('penyedia') ;
        obj['tanggal'] = getValueElm('tanggal') ;
        obj['no_trx'] = getValueElm('no_trx') ;
        obj['pelanggan'] = getValueElm('pelanggan') ;
        obj['kota'] = getValueElm('kota') ;
        obj['provinsi'] = getValueElm('provinsi') ;
        obj['sekolah'] = getValueElm('sekolah') ;
        obj['keterangan'] = getValueElm('keterangan') ;
        obj['list'] = objList ;
        $.post(urlDB,obj,
          function(data,status){
            if (status=="success"){
              LoadingProgress(false);
              if (data=='1' || data=='ok'){
                SwalPopupSuccess('Berhasil disimpan')   ;
                gotoJS('siplah','input');
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


  function DaftarSiplah(tag){
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      document.getElementById('view_list_detail').innerHTML="";
      var no = getValueElm('no') ;
      var kota = getValueElm('kota') ;
      var pelanggan = getValueElm('pelanggan') ;
      var id_pelanggan = getValueElm('id_pelanggan') ;
      var sekolah = getValueElm('sekolah') ;

      var url = 'aplikasi/siplah/daftar.php' ;
      var param = 'trx='+tag+'&no='+no+'&kota='+kota+'&pelanggan='+pelanggan+'&id_pelanggan='+id_pelanggan+'&sekolah='+sekolah ;


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
          //ReloadJsFunc()
        };
      };

      xmlHttp.send(param);
    }
  }

  function DetailTrxSiplah(tag,id){
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      var url = 'aplikasi/siplah/info_trx.php' ;
      var param = 'trx='+tag+'&id='+id ;

      var obj = document.getElementById('view_list_detail');
      obj.innerHTML =  '<div class="w-100 text-center"><img src="assets/images/loading.gif" style="height: 100px"> </div>' ;

      xmlHttp.open("POST", url , true);
      xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          if (obj!='undefined' && obj!=null){
            obj.innerHTML = xmlHttp.responseText;
            document.getElementById("view_list_detail").scrollIntoView();
          }          
          //ReloadJsFunc()
        };
      };

      xmlHttp.send(param);
    }
  }

  function ProsesTrxSiplah(trx,tag,id){
    var tanya = tag ;
    if (tag=='batal'){
      tanya = 'Transaksi Dibatalkan ??';
    } else if (tag=='kirim'){
      tanya = 'Barang akan dikirim ??';
    } else if (tag=='bayar'){
      tanya = 'Sekolah sudah bayar ??';
    } else if (tag=='pencairan'){
      tanya = 'Sudah Pencairan dana ??';
    } else if (tag=='kirimgudang'){
      tanya = 'Barang sudah Siap dikirim ??';
    }

    Swal.queue([{
      title: tanya,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        var obj = {};
        obj = PostUserInfo(obj);
        obj['trx'] = trx ;
        obj['tag'] = tag ;
        obj['id'] = id ;
        obj['kirim'] = 'proses_transaksi_siplah' ;

        $.post(urlDB,obj,
          function(data,status){
            if (status=="success"){
              if (data=='1' || data=='ok'){
                SwalPopupSuccess('Berhasil disimpan')   ;
                DaftarSiplah(trx);
                
              } else {
                Swal.fire({type: 'error',title: data})
              }
            } else {
              Swal.fire({type: 'error',title: 'Gagal Proses'})
            };
          } 
        ); 

      }
    }])

  }
  function inputPajakSiplah(id){
    var htmlInput = '<input type="text" id="billing" class="swal2-input" placeholder="ID Billing">';
    htmlInput += '<input type="text" id="faktur" class="swal2-input" placeholder="Faktur Pajak">';
    htmlInput += 'Foto Faktur Pajak<input type="file" id="fotofaktur" onchange="handleFilesFaktur(this.files)" >';
    htmlInput += '<input type="text" id="setor" class="swal2-input" placeholder="Setor Pajak">';
    htmlInput += 'Foto Setor Pajak<input type="file" id="fotosetor" onchange="handleFilesSetor(this.files)" >';
    swal({
      title: 'Input Data Pajak',
      html: htmlInput,
      confirmButtonText: 'Confirm',
      showCancelButton: true,
      preConfirm: function() {
        return new Promise((resolve, reject) => {
          var objPost = {};
          objPost = PostUserInfo(objPost);
          objPost['kirim'] = 'simpan_pajak_siplah' ;
          objPost['id'] = id
          objPost['billing'] = getValueElm("billing")
          objPost['faktur'] = getValueElm("faktur")
          objPost['setor'] = getValueElm("setor")
          objPost['file_faktur'] = StoreBase64Faktur ;
          objPost['file_setor'] = StoreBase64Setor ;
          

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
                StoreBase64Npwp = new Array();
                SwalPopupSuccess('Berhasil disimpan')   ;
                LoadingProgress(false)
                DaftarSiplah('pajak')
              })
              .catch(function (err) {
                Swal.fire({type: 'error',title: 'Gagal Proses'})
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


  function inputNPWPSiplah(id){
    var htmlInput = '<input type="text" id="npwp" class="swal2-input" placeholder="no NPWP">';
    htmlInput += '<input type="file" id="foto" onchange="handleFilesNpwp(this.files)" >';
    swal({
      title: 'Input NPWP Sekolah',
      html: htmlInput,
      confirmButtonText: 'Confirm',
      showCancelButton: true,
      preConfirm: function() {
        return new Promise((resolve, reject) => {
          var objPost = {};
          objPost = PostUserInfo(objPost);
          objPost['kirim'] = 'upload_npwp_siplah' ;
          objPost['id'] = id
          objPost['npwp'] = getValueElm("npwp")
          objPost['file'] = StoreBase64Npwp ;
          

          Swal.fire({
            title: 'Simpan NPWP Sekolah ?',
            type: 'warning',
            showCancelButton: true,
          }).then((result) => {
            if (result.value) {

              LoadingProgress(true);
              axios.post(urlDB, objPost )
              .then(function (res) {
                var resData = res.data ;
                StoreBase64Npwp = new Array();
                SwalPopupSuccess('Berhasil disimpan')   ;
                LoadingProgress(false)
                DaftarSiplah('npwp')
              })
              .catch(function (err) {
                Swal.fire({type: 'error',title: 'Gagal Proses'})
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




  function handleFilesNpwp(files) {
    StoreBase64Npwp = new Array();
    files = [...files]
    files.forEach(previewFileNpwp);
  }

  function previewFileNpwp(file) {
    var nmFile = file.name;
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function() {
      var obj = {};
      obj['base64'] = reader.result ;
      obj['name'] = nmFile ;
      StoreBase64Npwp.push(obj)
    }
  }

  function handleFilesFaktur(files) {
    StoreBase64Faktur = new Array();
    files = [...files]
    files.forEach(previewFileFaktur)
  }

  function previewFileFaktur(file) {
    var nmFile = file.name;
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function() {
      var obj = {};
      obj['base64'] = reader.result ;
      obj['name'] = nmFile ;
      StoreBase64Faktur.push(obj)
    }
  }

  function handleFilesSetor(files) {
    StoreBase64Setor = new Array();
    files = [...files]
    files.forEach(previewFileSetor)
  }

  function previewFileSetor(file) {
    var nmFile = file.name;
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function() {
      var obj = {};
      obj['base64'] = reader.result ;
      obj['name'] = nmFile ;
      StoreBase64Setor.push(obj)
    }
  }



  function ViewImageNPWP(tag,nm){
    var ftag = urlHome+'file_upload/';
    if (tag=='npwp'){
      ftag += "NPWP/";
    } else if (tag=='setor'){
      ftag += "SETOR/";
    } else if (tag=='faktur'){
      ftag += "FAKTUR/";
    }
    console.log(ftag+nm)
    Swal.fire({
      imageUrl: ftag+nm,
      imageAlt: tag+' '+nm

    })
  }


  function CariBarangSiplah(tag){
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      TambahDataBrg('batal',0)

      var url = 'aplikasi/siplah/barang_view.php' ;
      var uid = getUserInfo('id');
      var akses = getUserInfo('id_akses');

      var cari = getValueElm('cari') ;
      var param = 'cari='+cari+'&info='+tag+'&uid='+uid+'&akses='+akses;

      var obj = document.getElementById('view_list');
      obj.innerHTML =  '<div class="w-100 text-center"><img src="assets/images/loading.gif" style="height: 100px"> </div>' ;

      xmlHttp.open("POST", url , true);
      xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          if (obj!='undefined' && obj!=null){
            obj.innerHTML = xmlHttp.responseText;

          }          
          ReloadJsFunc()
        };
      };

      xmlHttp.send(param);
    }
  }

  function HapusBrgSiplah(id,tag){
    Swal.queue([{
      title: 'Hapus Barang Siplah ??',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        LoadingProgress(true);
        var obj = {};
        obj = PostUserInfo(obj);
        obj['id'] = id ;
        obj['kirim'] = 'hapus_barang_siplah' ;
        $.post(urlDB,obj,
          function(data,status){
            if (status=="success"){
              LoadingProgress(false);
              if (data=='1' || data=='ok'){
                SwalPopupSuccess('Berhasil disimpan')   ;
                $("#view_list").removeClass("col-md-8");
                $("#view_list").addClass('col-md-12')
                $("#view_edit").addClass('hidden')
                CariBarangSiplah(tag)
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

  function TambahBrgSiplah(id,tag){
    var htmlInput = '<input type="text" id="harga" class="swal2-input" placeholder="Harga">';
    swal({
      title: 'Harga Jual Siplah',
      html: htmlInput,
      confirmButtonText: 'Confirm',
      showCancelButton: true,
      preConfirm: function() {
        return new Promise((resolve, reject) => {
          var objPost = {};
          objPost = PostUserInfo(objPost);
          objPost['kirim'] = 'simpan_barang_siplah' ;
          objPost['id'] = id
          objPost['harga'] = getValueElm("harga")

          Swal.fire({
            title: 'Simpan Barang Siplah ?',
            type: 'warning',
            showCancelButton: true,
          }).then((result) => {
            if (result.value) {

              LoadingProgress(true);
              axios.post(urlDB, objPost )
              .then(function (res) {
                var resData = res.data ;
                StoreBase64Npwp = new Array();
                SwalPopupSuccess('Berhasil disimpan')   ;
                LoadingProgress(false)
                CariBarangSiplah(tag)
              })
              .catch(function (err) {
                Swal.fire({type: 'error',title: 'Gagal Proses'})
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
